// Auth
function getRole(){return localStorage.getItem('tk_role')||'customer';}
function setRole(r){localStorage.setItem('tk_role',r);}
function canEdit(){const r=getRole();return r==='admin'||r==='media';}
function isAdmin(){return getRole()==='admin';}

// Supabase
const SB_URL="https://wqeadksvszjnloavxruf.supabase.co";
const SB_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndxZWFka3N2c3pqbmxvYXZ4cnVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI1NTQzNjYsImV4cCI6MjA5ODEzMDM2Nn0.yyzZ1jlGy1eZJn37wUFQxJGQ2R3-Hih9LoBkFNZ1NWU";

async function sbReq(table,method,body,filter){
  method=method||'GET';
  let url=SB_URL+'/rest/v1/'+table;
  const p=[];
  if(method==='GET')p.push('select=*','order=created_at.desc');
  if(filter)Object.entries(filter).forEach(([k,v])=>p.push(k+'=eq.'+encodeURIComponent(v)));
  if(p.length)url+='?'+p.join('&');
  const opts={method,headers:{'apikey':SB_KEY,'Authorization':'Bearer '+SB_KEY,'Content-Type':'application/json','Prefer':method==='POST'?'return=representation':''}};
  if(body)opts.body=JSON.stringify(body);
  try{
    const res=await fetch(url,opts);
    if(!res.ok){console.error('SB error:',await res.text());return null;}
    if(method==='DELETE')return true;
    const txt=await res.text();
    return txt?JSON.parse(txt):true;
  }catch(e){console.error('SB fetch:',e);return null;}
}
async function sbGet(t){return await sbReq(t,'GET')||[];}
async function sbInsert(t,d){return await sbReq(t,'POST',d);}
async function sbUpdate(t,id,d){return await sbReq(t,'PATCH',d,{id});}
async function sbDelete(t,id){return await sbReq(t,'DELETE',null,{id});}

// Luxury Loader
function showLoader(){
  if(document.getElementById('tk-loader'))return;
  const el=document.createElement('div');
  el.id='tk-loader';
  el.innerHTML='<style>#tk-loader{position:fixed;inset:0;background:#0a0a0a;z-index:9999;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:20px}.ldr-logo{width:72px;height:72px;object-fit:contain;animation:ldrP 1.8s ease-in-out infinite}.ldr-ring{width:52px;height:52px;border:2px solid #1a1a1a;border-top:2px solid #dc2626;border-radius:50%;animation:ldrS 0.85s linear infinite}.ldr-text{font-family:system-ui,sans-serif;font-size:10px;font-weight:700;letter-spacing:4px;color:#444;text-transform:uppercase}@keyframes ldrS{to{transform:rotate(360deg)}}@keyframes ldrP{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.5;transform:scale(0.93)}}</style>'+(window._tkLogo?'<img class="ldr-logo" src="data:image/png;base64,'+window._tkLogo+'" alt="">':'<div style="width:72px;height:72px;background:#1a1a1a;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:700;color:#dc2626">TK</div>')+'<div class="ldr-ring"></div><div class="ldr-text">Loading</div>';
  document.body.appendChild(el);
}
function hideLoader(){
  const el=document.getElementById('tk-loader');
  if(!el)return;
  el.style.transition='opacity 0.4s';el.style.opacity='0';
  setTimeout(()=>el.remove(),400);
}

// Toast
function showToast(msg,err){
  const t=document.getElementById('toast');
  if(!t)return;
  t.textContent=msg;
  t.style.background=err?'#1f0000':'#001a0a';
  t.style.borderColor=err?'#dc2626':'#16a34a';
  t.style.color=err?'#f87171':'#4ade80';
  t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'),2500);
}

// Role badge
function initRole(){
  const r=getRole(),b=document.getElementById('roleBadge');
  if(!b)return;
  if(r==='admin'){b.textContent='Admin';b.className='role-badge';}
  else if(r==='media'){b.textContent='Media';b.className='role-badge media';}
  else{b.textContent='Viewing';b.className='role-badge customer';}
}