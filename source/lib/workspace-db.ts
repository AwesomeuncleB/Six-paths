import { makeInitialData, type AppData } from './model';
import * as fs from 'node:fs';
import * as path from 'node:path';

// Fallback file/memory storage for Vercel / Node.js serverless functions
const TMP_FILE = path.join(process.env.TMPDIR || '/tmp', 'sixpaths_workspace.json');

let memoryStore: { data: AppData; revision: number } | null = null;

function loadFsWorkspace(): { data: AppData; revision: number } {
  if (memoryStore) return memoryStore;
  try {
    if (fs.existsSync(TMP_FILE)) {
      const raw = fs.readFileSync(TMP_FILE, 'utf-8');
      memoryStore = JSON.parse(raw);
      return memoryStore!;
    }
  } catch {
    // Fall through to initial state
  }
  memoryStore = { data: makeInitialData(), revision: 0 };
  return memoryStore;
}

function saveFsWorkspace(store: { data: AppData; revision: number }) {
  memoryStore = store;
  try {
    fs.writeFileSync(TMP_FILE, JSON.stringify(store), 'utf-8');
  } catch {
    // Ignore file write issues in restricted environments
  }
}

async function getCloudflareDb() {
  try {
    // Dynamic import to prevent build failure on Vercel Node.js environment
    // @ts-ignore
    const cf = await import('cloudflare:workers');
    return cf.env?.DB || null;
  } catch {
    return null;
  }
}

export async function readWorkspace(): Promise<{ data: AppData; revision: number }> {
  const db = await getCloudflareDb();
  if (db) {
    let row = await db.prepare('SELECT data, revision FROM workspace WHERE id = ?').bind('main').first<{ data: string; revision: number }>();
    if (!row) {
      await db.prepare('INSERT OR IGNORE INTO workspace (id, data, revision) VALUES (?, ?, ?)').bind('main', JSON.stringify(makeInitialData()), 0).run();
      row = await db.prepare('SELECT data, revision FROM workspace WHERE id = ?').bind('main').first<{ data: string; revision: number }>();
    }
    if (!row) throw new Error('Workspace could not be loaded');
    return { data: JSON.parse(row.data) as AppData, revision: row.revision };
  }

  // Vercel / standard Node.js runtime fallback
  return loadFsWorkspace();
}

export async function writeWorkspace(data: AppData, revision: number): Promise<boolean> {
  const db = await getCloudflareDb();
  if (db) {
    const result = await db.prepare('UPDATE workspace SET data = ?, revision = revision + 1 WHERE id = ? AND revision = ?').bind(JSON.stringify(data), 'main', revision).run();
    return result.meta.changes === 1;
  }

  // Vercel / standard Node.js runtime fallback
  const current = loadFsWorkspace();
  if (current.revision !== revision) {
    return false;
  }
  const nextStore = { data, revision: revision + 1 };
  saveFsWorkspace(nextStore);
  return true;
}
