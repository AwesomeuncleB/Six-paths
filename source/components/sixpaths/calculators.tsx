'use client';
import {useState} from 'react';
import {Tabs,TabsList,TabsTrigger} from '@/components/ui/tabs';
import {Calculator,ArrowUpRight,Leaf,Landmark,House,Wallet} from 'lucide-react';
import {NumberField} from './shared';
import {money} from '@/lib/model';
import {amortizedPayment,affordablePrincipal} from '@/lib/calculators';
const types=[{name:'Rent-to-own',icon:House},{name:'Loan repayment',icon:Landmark},{name:'Affordability',icon:Wallet},{name:'Utility savings',icon:Leaf}];
export function Calculators({initialPrice=25000000}:{initialPrice?:number}){
 const [tab,setTab]=useState('Rent-to-own');
 const [price,setPrice]=useState(initialPrice),[deposit,setDeposit]=useState(5000000),[years,setYears]=useState(10),[rate,setRate]=useState(5);
 const [income,setIncome]=useState(600000),[expenses,setExpenses]=useState(250000),[share,setShare]=useState(35);
 const [bill,setBill]=useState(30000),[fuel,setFuel]=useState(20000),[saving,setSaving]=useState(60),[cost,setCost]=useState(2500000);
 const financed=Math.max(0,price-deposit),profit=financed*rate/100*years;
 const rto=(financed+profit)/(years*12),loan=amortizedPayment(financed,rate,years);
 const affordable=Math.max(0,Math.min(income*share/100,income-expenses));
 const monthSave=bill*saving/100+fuel;
 const valid=[price,deposit,years,rate,income,expenses,share,bill,fuel,saving,cost].every(n=>Number.isFinite(n)&&n>=0)&&years>=1&&years<=50&&rate<=100&&share<=100&&saving<=100&&(tab==='Affordability'||tab==='Utility savings'||deposit<=price);
 let value=tab==='Rent-to-own'?rto:tab==='Loan repayment'?loan:tab==='Affordability'?affordablePrincipal(affordable,rate,years)+deposit:monthSave*12;
 const caption=tab==='Rent-to-own'||tab==='Loan repayment'?'Estimated monthly payment':tab==='Affordability'?'Estimated affordable home price':'Estimated annual savings';
 return <main className="page calculator-page"><div className="page-heading"><p className="eyebrow">PLAN YOUR NEXT CHAPTER</p><h1>A little clarity.<br/><em>A smarter decision.</em></h1><p>Explore the numbers before you make your move.</p></div>
 <Tabs value={tab} onValueChange={setTab}><TabsList className="calculator-tabs">{types.map(t=><TabsTrigger key={t.name} value={t.name}><t.icon size={17}/>{t.name}</TabsTrigger>)}</TabsList></Tabs>
 <div className="calculator-grid"><section className="panel calculator-inputs"><div className="section-title"><h2>{tab}</h2><Calculator size={22}/></div><div className="form-grid">
 {(tab==='Rent-to-own'||tab==='Loan repayment')&&<><NumberField label="Purchase price (₦)" value={price} onChange={setPrice}/><NumberField label="Initial deposit (₦)" value={deposit} onChange={setDeposit} max={price}/></>}
 {tab==='Affordability'&&<><NumberField label="Monthly income (₦)" value={income} onChange={setIncome}/><NumberField label="Monthly debts & expenses (₦)" value={expenses} onChange={setExpenses}/><NumberField label="Maximum share of income (%)" value={share} onChange={setShare} max={100}/><NumberField label="Available deposit (₦)" value={deposit} onChange={setDeposit}/></>}
 {tab!=='Utility savings'&&<><NumberField label="Plan duration (years)" value={years} onChange={setYears} min={1} max={50}/><NumberField label={tab==='Rent-to-own'?'Annual flat profit rate (%)':'Annual interest rate (%)'} value={rate} onChange={setRate} max={100} step={0.1}/></>}
 {tab==='Utility savings'&&<><NumberField label="Monthly electricity bill (₦)" value={bill} onChange={setBill}/><NumberField label="Monthly generator fuel savings (₦)" value={fuel} onChange={setFuel}/><NumberField label="Electricity reduction (%)" value={saving} onChange={setSaving} max={100}/><NumberField label="Solar installation cost (₦)" value={cost} onChange={setCost}/></>}
 </div><p className="fine-print">{tab==='Rent-to-own'?'Uses a flat annual profit rate on the amount financed. Your actual plan may use a different pricing method.':tab==='Loan repayment'?'Assumes equal monthly payments with interest on the remaining balance. Excludes fees and insurance.':tab==='Affordability'?'Uses the lower of your chosen income share or income after expenses. Assumes a reducing-balance loan.':'Uses your entered electricity reduction and generator fuel savings. Excludes maintenance and battery replacement.'}</p></section>
 <aside className="calculation-result"><span className="result-icon"><ArrowUpRight size={26}/></span><p>{caption}</p><h2 aria-live="polite">{valid?money(value):'Check your inputs'}</h2><span>{valid?(tab==='Utility savings'?'more in your pocket each year':tab==='Affordability'?`Based on ${money(affordable)} per month`:`over ${years} years`):'Use valid values within the field limits.'}</span><div className="result-breakdown">
 {(tab==='Rent-to-own'||tab==='Loan repayment')&&<><div><span>Amount financed</span><strong>{money(financed)}</strong></div><div><span>{tab==='Rent-to-own'?'Total profit':'Total interest'}</span><strong>{valid?money(tab==='Rent-to-own'?profit:loan*years*12-financed):'—'}</strong></div><div><span>Total incl. deposit</span><strong>{valid?money((tab==='Rent-to-own'?rto:loan)*years*12+deposit):'—'}</strong></div></>}
 {tab==='Affordability'&&<><div><span>Monthly payment limit</span><strong>{valid?money(affordable):'—'}</strong></div><div><span>Available deposit</span><strong>{money(deposit)}</strong></div></>}
 {tab==='Utility savings'&&<><div><span>Monthly savings</span><strong>{valid?money(monthSave):'—'}</strong></div><div><span>Simple payback period</span><strong>{valid&&monthSave>0?`${(cost/monthSave/12).toFixed(1)} years`:'—'}</strong></div></>}
 </div><p className="result-note">Planning estimates only. These are editable assumptions, not a financing offer.</p></aside></div></main>
}
