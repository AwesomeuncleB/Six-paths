export type Role = 'Owner' | 'Tenant' | 'Provider' | 'Admin';
export type Property = { id:string; title:string; address:string; area:string; city:string; rent:number; beds:number; baths:number; size:number; status:string; stage:string; progress:number; rto:boolean; price:number; amenities:string[]; description:string; image:string; year:number; warranty:string; floorPlan:string };
export type Repair = { id:string; propertyId:string; category:string; urgency:string; description:string; reportedBy:string; status:string; providerId:string; window:string; amount:number; createdAt:string; history:{status:string; date:string}[] };
export type Provider = {id:string; name:string; trade:string; status:string; rating:number; jobs:number};
export type Payment = {id:string; propertyId:string; label:string; amount:number; type:string; status:string; date:string};
export type Interest = {id:string; propertyId:string; name:string; email:string; phone:string; note:string; status:string; createdAt:string};
export type DemoUser = {id:string;name:string;email:string;role:Role;status:string};
export type AppData = { properties:Property[]; repairs:Repair[]; providers:Provider[]; payments:Payment[]; interests:Interest[]; users:DemoUser[]; rates:{commission:number;service:number}; notifications:{id:string;text:string;date:string;read:boolean}[] };
export const personas:Record<Role,{name:string;initials:string;description:string}> = {
 Owner:{name:'Ngozi Adeyemi',initials:'NA',description:'Properties, repairs & payments'},
 Tenant:{name:'Emeka Chukwu',initials:'EC',description:'Your home & repair reports'},
 Provider:{name:'Bola Okafor',initials:'BO',description:'Job offers, bookings & earnings'},
 Admin:{name:'Six Paths Ops',initials:'SP',description:'Properties, people & operations'},
};
export const money = (n:number) => new Intl.NumberFormat('en-NG',{style:'currency',currency:'NGN',maximumFractionDigits:0}).format(n);
export const shortDate = (s:string) => new Date(s).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'});
export function makeInitialData():AppData {
 const now=new Date().toISOString();
 const base={city:'Kaduna',year:2021,warranty:'No warranty record on file.',progress:100,stage:'Ready to move in',status:'Available'};
 return {
 properties:[
 {...base,id:'p1',title:'A fresh start in Barnawa',address:'7 Yakowa Road, Barnawa, Kaduna',area:'Barnawa',rent:150000,beds:3,baths:2,size:240,rto:true,price:25000000,image:'/home-4.jpg',amenities:['Borehole water','Fitted kitchen','Gated compound','Prepaid meter'],description:'Bright 3-bedroom bungalow on a quiet Barnawa side street, freshly repainted with a fitted kitchen and a small front garden. Five minutes from Kaduna Polytechnic.',floorPlan:'3 bedrooms, 2 bathrooms, open-plan living/dining, fitted kitchen, small front garden.'},
 {...base,id:'p2',title:'Room to grow in Kawo',address:'18 Ahmadu Bello Way, Kawo, Kaduna',area:'Kawo',rent:350000,beds:4,baths:4,size:420,rto:true,price:55000000,image:'/home-2.jpg',amenities:['Solar power',"Boys’ quarters",'Gated compound','Borehole water'],description:"Spacious 4-bedroom duplex on Ahmadu Bello Way with a boys’ quarters, solar backup, and a private compound with parking for two cars. Close to Kawo market.",floorPlan:'4 bedrooms, formal lounge, family lounge, dining, fitted kitchen, boys’ quarters, 2-car parking.'},
 {...base,id:'p3',title:'An easy place to call home',address:'3 Ali Akilu Road, Malali, Kaduna',area:'Malali',rent:65000,beds:1,baths:1,size:65,rto:false,price:8500000,image:'/home-1.jpg',amenities:['Prepaid meter','Borehole water','Gated compound'],description:'Compact 1-bedroom self-contained apartment in Malali, ideal for a single tenant or student. Walking distance to Ali Akilu Road shops.',floorPlan:'1 bedroom, 1 bathroom, living room and kitchenette.'},
 {...base,id:'p4',title:'Quiet living in Ungwan Rimi',address:'9 Waff Road, Ungwan Rimi, Kaduna',area:'Ungwan Rimi',rent:220000,beds:3,baths:2,size:210,rto:true,price:32000000,image:'/home-3.jpg',amenities:['Estate security','Fitted kitchen','Dedicated parking','Small garden'],description:'Modern 3-bedroom terrace house in Ungwan Rimi with a small garden and dedicated parking. Quiet residential estate, walking distance to Waff Road.',floorPlan:'3 bedrooms, 2 bathrooms, living/dining room, fitted kitchen, small garden, dedicated parking.'},
 {...base,id:'p5',title:'A family home in Sabon Tasha',address:'5 Independence Way, Sabon Tasha, Kaduna',area:'Sabon Tasha',rent:100000,beds:2,baths:1,size:120,rto:false,price:15000000,image:'/home-3.jpg',amenities:['Borehole water','Fenced compound','Prepaid meter'],description:'Cosy 2-bedroom flat in a family-friendly Sabon Tasha compound, close to the market and main road. Good for a small household or young couple.',floorPlan:'2 bedrooms, 1 bathroom, combined living/dining, kitchenette.',status:'Under Maintenance'},
 {...base,id:'p6',title:'Your home in Malali',address:'14 Ali Akilu Road, Malali, Kaduna',area:'Malali',rent:180000,beds:3,baths:2,size:230,rto:false,price:28000000,image:'/home-2.jpg',amenities:['Borehole water','Gated compound','Fitted kitchen'],description:'A comfortable family home with a fitted kitchen and a private carport.',floorPlan:'3 bedrooms, 2 bathrooms, living/dining room, fitted kitchen, single-car carport.',status:'Occupied',warranty:'Roofing warranty from Dala Roofing Co. valid until 2027.'},
 {...base,id:'p7',title:'A new chapter in Kawo',address:'22 Constitution Road, Kawo, Kaduna',area:'Kawo',rent:280000,beds:3,baths:3,size:280,rto:true,price:38000000,image:'/home-4.jpg',amenities:['Solar power','Estate security','Dedicated parking'],description:'A 3-bedroom home under construction, with a family lounge, balcony and fitted kitchen planned.',floorPlan:'3 bedrooms, 3 bathrooms, family lounge, dining area, fitted kitchen, balcony.',stage:'Under construction',progress:65},
 ],
 repairs:[
 {id:'r1',propertyId:'p6',category:'Plumbing',urgency:'Normal',description:'The kitchen sink has a persistent leak beneath the counter.',reportedBy:'Tenant',status:'Scheduled',providerId:'v1',window:'Tomorrow, morning',amount:15000,createdAt:now,history:[{status:'Reported',date:now},{status:'Offered',date:now},{status:'Scheduled',date:now}]},
 {id:'r2',propertyId:'p6',category:'Electrical',urgency:'Urgent',description:'Two sockets in the living room stopped working after the last outage.',reportedBy:'Tenant',status:'Reported',providerId:'',window:'',amount:18000,createdAt:now,history:[{status:'Reported',date:now}]},
 {id:'r3',propertyId:'p5',category:'Plumbing',urgency:'Normal',description:'Bathroom tap in the master ensuite needs replacing before the next tenant viewing.',reportedBy:'Owner',status:'Awaiting confirmation',providerId:'v1',window:'Completed on site',amount:12000,createdAt:now,history:[{status:'Reported',date:now},{status:'Scheduled',date:now},{status:'Awaiting confirmation',date:now}]},
 ],
 providers:[{id:'v1',name:'Bola Okafor',trade:'Plumbing',status:'Verified',rating:4.9,jobs:24},{id:'v2',name:'Chidi Eze',trade:'Electrical',status:'Verified',rating:4.8,jobs:18},{id:'v3',name:'Fatima Bello',trade:'General repairs',status:'Under review',rating:0,jobs:0}],
 payments:[{id:'bill1',propertyId:'p6',label:'Electricity',amount:25000,type:'Utility',status:'Due',date:now},{id:'bill2',propertyId:'p6',label:'Water',amount:5000,type:'Utility',status:'Due',date:now},{id:'pay1',propertyId:'p5',label:'Water',amount:5000,type:'Utility',status:'Paid',date:now},{id:'pay2',propertyId:'p1',label:'Electrical repair',amount:18000,type:'Repair',status:'Paid',date:now}],
 interests:[],
 users:[{id:'u1',name:'Ngozi Adeyemi',email:'owner@sixpaths.demo',role:'Owner',status:'Active'},{id:'u2',name:'Emeka Chukwu',email:'tenant@sixpaths.demo',role:'Tenant',status:'Active'},{id:'u3',name:'Bola Okafor',email:'provider@sixpaths.demo',role:'Provider',status:'Active'},{id:'u4',name:'Six Paths Ops',email:'admin@sixpaths.demo',role:'Admin',status:'Active'}],
 rates:{commission:5,service:3},
 notifications:[{id:'n1',text:'Bola Okafor marked the Sabon Tasha tap replacement complete. Review the work to confirm completion.',date:now,read:false},{id:'n2',text:'A plumber is scheduled for the kitchen sink leak at 14 Ali Akilu Road.',date:now,read:false}],
 };
}
