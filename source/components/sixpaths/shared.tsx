'use client';
import { Button } from '@/components/ui/button';
import { Select,SelectContent,SelectItem,SelectTrigger,SelectValue } from '@/components/ui/select';
import { Dialog,DialogContent,DialogHeader,DialogTitle,DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { type ReactNode } from 'react';
import { Home,LoaderCircle } from 'lucide-react';
export function Choice({value,onChange,options,label,className=''}:{value:string;onChange:(v:string)=>void;options:(string|{value:string;label:string})[];label:string;className?:string}){
 return <Select value={value} onValueChange={onChange}><SelectTrigger aria-label={label} className={'choice '+className}><SelectValue/></SelectTrigger><SelectContent position="popper">{options.map(o=>{const v=typeof o==='string'?o:o.value;return <SelectItem key={v} value={v}>{typeof o==='string'?o:o.label}</SelectItem>})}</SelectContent></Select>;
}
export function Field({label,children}: {label:string;children:ReactNode}){return <label className="field"><span>{label}</span>{children}</label>}
export function NumberField({label,value,onChange,min=0,max,step=1}:{label:string;value:number;onChange:(v:number)=>void;min?:number;max?:number;step?:number}){
 return <Field label={label}><Input type="number" required value={Number.isFinite(value)?value:''} min={min} max={max} step={step} onChange={e=>onChange(e.target.value===''?NaN:Number(e.target.value))}/></Field>;
}
export function Modal({open,onClose,title,description,children,wide=false}:{open:boolean;onClose:()=>void;title:string;description?:string;children:ReactNode;wide?:boolean}){
 return <Dialog open={open} onOpenChange={v=>{if(!v)onClose()}}><DialogContent className={'app-modal '+(wide?'wide-modal':'')}><DialogHeader><DialogTitle>{title}</DialogTitle><DialogDescription>{description||'Six Paths Smart-House'}</DialogDescription></DialogHeader>{children}</DialogContent></Dialog>;
}
export function Submit({busy,children}:{busy:boolean;children:ReactNode}){return <Button className="primary-button" type="submit" disabled={busy}>{busy&&<LoaderCircle size={16} className="animate-spin"/>}{children}</Button>}
export function Empty({title,children}: {title:string;children?:ReactNode}){return <div className="empty-state"><Home size={30}/><h3>{title}</h3><div>{children}</div></div>}
export function Status({children}:{children:ReactNode}){const value=String(children);return <span className={'status '+(/Urgent|Rejected|Suspended/.test(value)?'red':/Awaiting|Under|Offered|Due|Reported|New/.test(value)?'amber':'green')}>{children}</span>}
export type Mutation=(action:Record<string,unknown>)=>Promise<boolean>;
