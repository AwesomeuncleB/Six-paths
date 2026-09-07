import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { pathToFileURL } from 'node:url';
import { build, transform } from 'esbuild';
const root=process.cwd();
const temp=path.join(root,'.sites-runtime','checks');fs.mkdirSync(temp,{recursive:true});
const sql=new DatabaseSync(':memory:');
globalThis.__SIXPATHS_TEST_ENV = {
 DB: {
  prepare(query) {
   return {
    bind(...values) {
     return {
      async first() { return sql.prepare(query).get(...values) || null; },
      async run() {
       const result = sql.prepare(query).run(...values);
       return { meta: { changes: Number(result.changes) } };
      },
     };
    },
   };
  },
 },
};
await build({entryPoints:['app/api/workspace/route.ts'],outfile:path.join(temp,'route.mjs'),bundle:true,platform:'node',format:'esm',plugins:[{name:'local-binding',setup(b){b.onResolve({filter:/^cloudflare:workers$/},()=>({path:'runtime',namespace:'test-runtime'}));b.onLoad({filter:/.*/,namespace:'test-runtime'},()=>({contents:'export const env=globalThis.__SIXPATHS_TEST_ENV;',loader:'js'}))}}]});
const route=await import(pathToFileURL(path.join(temp,'route.mjs')).href);
const dispatch=async(url,options)=>options?route.POST(new Request(url,options)):route.GET();
let state;
async function get(){const res=await dispatch('https://sixpaths.test/api/workspace');assert.equal(res.status,200);return res.json()}
async function post(action,expected=200,revision=state.revision){const res=await dispatch('https://sixpaths.test/api/workspace',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({revision,action})});const body=await res.json();assert.equal(res.status,expected,JSON.stringify(body));if(expected===200)state=body;return body;}
try {
 sql.exec(fs.readFileSync(path.join(root,'drizzle/0000_quiet_blackheart.sql'),'utf8'));
 state=await get();assert.equal(state.data.properties.length,7);
 const again=await get();assert.equal(again.revision,state.revision);assert.equal(again.data.repairs.length,3);
 await build({entryPoints:['app/page.tsx'],outfile:path.join(temp,'page.mjs'),bundle:true,platform:'node',format:'esm',packages:'external'});
 const {default:Page}=await import(pathToFileURL(path.join(temp,'page.mjs')).href);
 const {createElement}=await import('react');const {renderToString}=await import('react-dom/server');
 const html=renderToString(createElement(Page));assert.match(html,/Find your next/);assert.match(html,/Six Paths/);assert.doesNotMatch(html,/Starter Project/);
 for(const file of ['brand.png','home-1.jpg','home-4.jpg','fonts/Fraunces_400Regular.ttf'])assert.ok(fs.statSync(path.join(root,'public',file)).size>0,file);
 await post({type:'repair',id:'r2',status:'Offered',providerId:'v1'},400);
 await post({type:'repair',id:'r2',status:'Offered',providerId:'v2'});
 const oldRevision=state.revision;
 await post({type:'repair',id:'r2',status:'Scheduled',window:'Tomorrow, morning'});
 await post({type:'readNotifications'},409,oldRevision);
 await post({type:'repair',id:'r2',status:'Awaiting confirmation'});
 const count=state.data.payments.length;
 await post({type:'repair',id:'r2',status:'Confirmed'});
 assert.equal(state.data.payments.length,count+1);
 await post({type:'repair',id:'r2',status:'Confirmed'},400);
 assert.equal((await get()).data.payments.length,count+1);
 await post({type:'interest',propertyId:'p1',name:'Test Visitor',email:'visitor@example.test',phone:'1234567890',note:'A demo viewing request.'});
 await post({type:'interest',propertyId:'p1',name:'Test Visitor',email:'visitor@example.test',phone:'1234567890',note:''},400);
 await post({type:'interest',propertyId:'p6',name:'Test Visitor',email:'other@example.test',phone:'1234567890',note:''},400);
 assert.equal((await get()).data.interests.length,1);
 await post({type:'payment',id:'bill1'});await post({type:'payment',id:'bill1'},400);
 await post({type:'report',propertyId:'p6',category:'Plumbing',urgency:'Normal',description:'A new kitchen pipe leak.',reportedBy:'Tenant',providerId:''});
 assert.equal((await get()).data.repairs.length,4);
 await post({type:'property',property:{...state.data.properties[0],id:'',title:'New test property',image:''}});
 assert.equal((await get()).data.properties.length,8);
 const compiled=await transform(fs.readFileSync('lib/calculators.ts','utf8'),{loader:'ts',format:'esm'});
 const calc=await import('data:text/javascript;base64,'+Buffer.from(compiled.code).toString('base64'));
 assert.equal(calc.amortizedPayment(120000,0,1),10000);
 assert.ok(Math.abs(calc.amortizedPayment(100000,12,1)-8884.8788678)<0.001);
 assert.ok(Math.abs(calc.affordablePrincipal(calc.amortizedPayment(25000000,7,10),7,10)-25000000)<0.01);
 console.log('PASS: page rendering, assets, migrations, persisted records, repair lifecycle, duplicate-payment protection, interest validation, conflict handling, and calculator math.');
} finally {sql.close()}
