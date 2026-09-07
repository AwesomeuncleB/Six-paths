import { z } from 'zod';
import { readWorkspace, writeWorkspace } from '@/lib/workspace-db';
import { type AppData, type Property } from '@/lib/model';
const text=z.string().trim().min(1).max(200);
const propertySchema=z.object({id:z.string().max(100),title:text,address:text,area:text,city:z.literal('Kaduna'),rent:z.number().min(0).max(1e9),beds:z.number().int().min(1).max(30),baths:z.number().int().min(1).max(30),size:z.number().min(1).max(1e6),status:z.enum(['Available','Occupied','Under Maintenance']),stage:z.enum(['Ready to move in','Under construction','Off plan']),progress:z.number().min(0).max(100),rto:z.boolean(),price:z.number().min(0).max(1e12),amenities:z.array(text).max(20),description:z.string().max(3000),image:z.string().regex(/^\/home-[1-4]\.jpg$|^$/),year:z.number().int().min(1900).max(2100),warranty:z.string().max(1000),floorPlan:z.string().max(1000)});
const actionSchema=z.discriminatedUnion('type',[
 z.object({type:z.literal('property'),property:propertySchema}),
 z.object({type:z.literal('interest'),propertyId:text,name:text,email:z.string().email().max(200),phone:z.string().min(7).max(30),note:z.string().max(2000)}),
 z.object({type:z.literal('interestStatus'),id:text,status:z.enum(['New','Contacted','Closed'])}),
 z.object({type:z.literal('report'),propertyId:text,category:z.enum(['Plumbing','Electrical','General repairs']),urgency:z.enum(['Normal','Urgent']),description:z.string().trim().min(10).max(3000),reportedBy:z.enum(['Owner','Tenant','Admin']),providerId:z.string().max(100)}),
 z.object({type:z.literal('repair'),id:text,status:z.enum(['Offered','Scheduled','Awaiting confirmation','Confirmed','Reported','Closed']),providerId:z.string().max(100).optional(),window:z.string().min(3).max(200).optional()}),
 z.object({type:z.literal('payment'),id:text}),
 z.object({type:z.literal('provider'),id:text,status:z.enum(['Verified','Under review','Rejected'])}),
 z.object({type:z.literal('user'),id:text,status:z.enum(['Active','Suspended'])}),
 z.object({type:z.literal('rates'),commission:z.number().min(0).max(100),service:z.number().min(0).max(100)}),
 z.object({type:z.literal('readNotifications')}),
]);
function fail(message:string){throw new Error(message)}
function update(data:AppData, action:z.infer<typeof actionSchema>){
 const now=new Date().toISOString();
 const uid=()=>crypto.randomUUID();
 const notify=(text:string)=>data.notifications.unshift({id:uid(),text,date:now,read:false});
 if(action.type==='property'){
  const old=data.properties.findIndex(p=>p.id===action.property.id);
  if(old>=0)data.properties[old]=action.property as Property;
  else data.properties.push({...action.property,id:uid()} as Property);
 }
 if(action.type==='interest'){
  const p=data.properties.find(p=>p.id===action.propertyId);
  if(!p||p.status!=='Available'||p.rent<=0)fail('This listing is no longer available.');
  if(data.interests.some(i=>i.propertyId===action.propertyId&&i.email.toLowerCase()===action.email.toLowerCase()&&i.status!=='Closed'))fail('An interest request for this email and home is already saved.');
  data.interests.unshift({...action,id:uid(),status:'New',createdAt:now});
  notify(`${action.name} expressed interest in ${p!.address}.`);
 }
 if(action.type==='interestStatus'){
  const item=data.interests.find(i=>i.id===action.id);if(!item)fail('Request not found');item!.status=action.status;
 }
 if(action.type==='report'){
  const p=data.properties.find(p=>p.id===action.propertyId);if(!p)fail('Property not found');
  const provider=data.providers.find(p=>p.id===action.providerId);
  if(action.providerId&&(!provider||provider.status!=='Verified'||provider.trade!==action.category))fail('Choose a verified provider for this repair category.');
  const status=provider?'Offered':'Reported';
  data.repairs.unshift({...action,id:uid(),status,window:'',amount:action.category==='Electrical'?18000:15000,createdAt:now,history:[{status,date:now}]});
  notify(`${action.category} repair ${provider?'offered to '+provider.name:'reported'} at ${p!.address}.`);
 }
 if(action.type==='repair'){
  const r=data.repairs.find(r=>r.id===action.id);if(!r)fail('Repair not found');
  const transitions:Record<string,string[]>={'Reported':['Offered','Closed'],'Offered':['Scheduled','Reported'],'Scheduled':['Awaiting confirmation'],'Awaiting confirmation':['Confirmed'],'Confirmed':[],'Closed':[]};
  if(!transitions[r!.status]?.includes(action.status))fail('This repair has changed. Refresh and try again.');
  if(action.status==='Offered'){
   const p=data.providers.find(p=>p.id===action.providerId&&p.status==='Verified'&&p.trade===r!.category);if(!p)fail('Choose a verified provider for this category.');r!.providerId=p!.id;
  }
  if(action.status==='Scheduled'){if(!action.window)fail('Choose a visit window.');r!.window=action.window!;}
  if(action.status==='Reported'){r!.providerId='';r!.window='';}
  if(action.status==='Confirmed'){
   data.payments.unshift({id:uid(),propertyId:r!.propertyId,label:`${r!.category} repair`,amount:r!.amount,type:'Repair',status:'Paid',date:now});
   const p=data.providers.find(p=>p.id===r!.providerId);if(p)p.jobs++;
  }
  r!.status=action.status;r!.history.push({status:action.status,date:now});
  notify(`${r!.category} repair: ${action.status.toLowerCase()}.`);
 }
 if(action.type==='payment'){
  const p=data.payments.find(p=>p.id===action.id);if(!p||p.status!=='Due')fail('This bill is no longer due.');p!.status='Paid';p!.date=now;notify(`${p!.label} payment recorded.`);
 }
 if(action.type==='provider'){const p=data.providers.find(p=>p.id===action.id);if(!p)fail('Provider not found');p!.status=action.status;}
 if(action.type==='user'){const u=data.users.find(u=>u.id===action.id);if(!u)fail('User not found');u!.status=action.status;}
 if(action.type==='rates')data.rates={commission:action.commission,service:action.service};
 if(action.type==='readNotifications')data.notifications.forEach(n=>n.read=true);
 data.notifications=data.notifications.slice(0,100);
 return data;
}
export async function GET(){
 try{return Response.json(await readWorkspace(),{headers:{'Cache-Control':'no-store'}})}
 catch(error){console.error('Workspace load failed',error);return Response.json({error:'Your workspace could not be loaded. Please try again.'},{status:503});}
}
export async function POST(request:Request){
 if(request.headers.get('sec-fetch-site')==='cross-site')return Response.json({error:'Request not allowed'},{status:403});
 try{
  const payload=z.object({revision:z.number().int().min(0),action:actionSchema}).parse(await request.json());
  const current=await readWorkspace();
  if(current.revision!==payload.revision)return Response.json({error:'Your workspace changed in another view. Reload it and try again.'},{status:409});
  const data=update(current.data,payload.action);
  if(!await writeWorkspace(data,current.revision))return Response.json({error:'Your workspace changed. Reload it and try again.'},{status:409});
  return Response.json({data,revision:current.revision+1},{headers:{'Cache-Control':'no-store'}});
 }catch(error){
  if(error instanceof z.ZodError)return Response.json({error:'Check the form fields and try again.'},{status:400});
  console.error('Workspace save failed',error);
  const message=error instanceof Error&& !/SQL|D1|binding|storage|workspace|fetch/i.test(error.message)?error.message:'Your changes could not be saved. Please try again.';
  return Response.json({error:message},{status:400});
 }
}
