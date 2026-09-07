export function amortizedPayment(principal:number,annualRate:number,years:number){
 const n=years*12,r=annualRate/1200;
 if(n<=0||principal<0||annualRate<0)return 0;
 if(r===0)return principal/n;
 return principal*r/(1-Math.pow(1+r,-n));
}
export function affordablePrincipal(monthly:number,annualRate:number,years:number){
 const n=years*12,r=annualRate/1200;
 if(n<=0||monthly<0||annualRate<0)return 0;
 return r===0?monthly*n:monthly*(1-Math.pow(1+r,-n))/r;
}
