import { useState, useEffect, useRef } from "react";
import { sb } from "./supabase.js";

const BREEDS = [
  "Affenpinscher","Afghan Hound","Airedale Terrier","Akita","Alaskan Malamute",
  "American Bulldog","American Cocker Spaniel","American Eskimo Dog","American Foxhound",
  "American Pit Bull Terrier","American Staffordshire Terrier","American Water Spaniel",
  "Anatolian Shepherd","Australian Cattle Dog","Australian Shepherd","Australian Silky Terrier",
  "Australian Terrier","Azawakh","Basenji","Basset Fauve de Bretagne","Basset Hound",
  "Bavarian Mountain Hound","Beagle","Bearded Collie","Bedlington Terrier","Belgian Malinois",
  "Belgian Shepherd (Groenendael)","Belgian Shepherd (Laekenois)","Belgian Shepherd (Tervuren)",
  "Bergamasco","Bernese Mountain Dog","Bichon Frise","Bloodhound","Blue Heeler",
  "Bluetick Coonhound","Boerboel","Border Collie","Border Terrier","Borzoi","Boston Terrier",
  "Bouvier des Flandres","Boxer","Boykin Spaniel","Bracco Italiano","Briard","Brittany Spaniel",
  "Brussels Griffon","Bull Terrier","Bull Terrier (Miniature)","Bulldog (English)","Bulldog (French)",
  "Bullmastiff","Cairn Terrier","Cane Corso","Cardigan Welsh Corgi","Cavalier King Charles Spaniel",
  "Cesky Terrier","Chesapeake Bay Retriever","Chihuahua (Long-Coat)","Chihuahua (Smooth-Coat)",
  "Chinese Crested","Chinese Shar-Pei","Chow Chow","Clumber Spaniel","Cockapoo",
  "Cocker Spaniel (American)","Cocker Spaniel (English)","Collie (Rough)","Collie (Smooth)",
  "Coonhound (Black and Tan)","Coonhound (Redbone)","Coton de Tulear","Curly-Coated Retriever",
  "Dachshund (Miniature Long-Haired)","Dachshund (Miniature Smooth-Haired)","Dachshund (Miniature Wire-Haired)",
  "Dachshund (Standard Long-Haired)","Dachshund (Standard Smooth-Haired)","Dachshund (Standard Wire-Haired)",
  "Dalmatian","Dandie Dinmont Terrier","Deerhound (Scottish)","Dobermann","Dogue de Bordeaux",
  "Dutch Shepherd","English Setter","English Springer Spaniel","English Toy Terrier",
  "Entlebucher Mountain Dog","Eurasier","Field Spaniel","Finnish Lapphund","Finnish Spitz",
  "Flat-Coated Retriever","Fox Terrier (Smooth)","Fox Terrier (Wire)","Foxhound (English)",
  "German Pinscher","German Shepherd","German Shorthaired Pointer","German Spitz (Klein)",
  "German Spitz (Mittel)","German Wirehaired Pointer","Giant Schnauzer","Glen of Imaal Terrier",
  "Golden Retriever","Gordon Setter","Grand Basset Griffon Vendéen","Great Dane","Great Pyrenees",
  "Greyhound","Hamiltonstovare","Harrier","Havanese","Hovawart","Hungarian Puli","Hungarian Vizsla",
  "Hungarian Wire-Haired Vizsla","Ibizan Hound","Irish Red and White Setter","Irish Setter",
  "Irish Terrier","Irish Water Spaniel","Irish Wolfhound","Italian Greyhound","Jack Russell Terrier",
  "Japanese Akita Inu","Japanese Chin","Japanese Shiba Inu","Japanese Spitz","Keeshond",
  "Kerry Blue Terrier","Komondor","Kooikerhondje","Labradoodle","Labrador Retriever (Black)",
  "Labrador Retriever (Chocolate)","Labrador Retriever (Yellow)","Lagotto Romagnolo","Lakeland Terrier",
  "Lancashire Heeler","Leonberger","Lhasa Apso","Löwchen","Maltese","Manchester Terrier",
  "Maremma Sheepdog","Mastiff (English)","Mastiff (Neapolitan)","Mastiff (Tibetan)",
  "Miniature Pinscher","Miniature Schnauzer","Mixed Breed","Munsterlander (Large)","Munsterlander (Small)",
  "Neapolitan Mastiff","Newfoundland","Norfolk Terrier","Norwegian Buhund","Norwegian Elkhound",
  "Norwegian Lundehund","Norwich Terrier","Nova Scotia Duck Tolling Retriever","Old English Sheepdog",
  "Otterhound","Papillon","Parson Russell Terrier","Pekingese","Pembroke Welsh Corgi",
  "Perro de Presa Canario","Petit Basset Griffon Vendéen","Pharaoh Hound","Plott Hound","Pointer",
  "Polish Lowland Sheepdog","Pomeranian","Poodle (Miniature)","Poodle (Standard)","Poodle (Toy)",
  "Portuguese Podengo","Portuguese Water Dog","Pug","Pyrenean Mountain Dog","Pyrenean Shepherd",
  "Rat Terrier","Redbone Coonhound","Rhodesian Ridgeback","Rottweiler","Rough Collie","Saint Bernard",
  "Saluki","Samoyed","Schipperke","Schnauzer (Miniature)","Schnauzer (Standard)","Scottish Terrier",
  "Sealyham Terrier","Segugio Italiano","Serbian Tricolour Hound","Shetland Sheepdog","Shih Tzu",
  "Siberian Husky","Skye Terrier","Sloughi","Smooth Collie","Soft-Coated Wheaten Terrier",
  "Spinone Italiano","Staffordshire Bull Terrier","Sussex Spaniel","Swedish Lapphund","Swedish Vallhund",
  "Tibetan Mastiff","Tibetan Spaniel","Tibetan Terrier","Toy Fox Terrier","Treeing Walker Coonhound",
  "Vizsla","Weimaraner","Welsh Springer Spaniel","Welsh Terrier","West Highland White Terrier",
  "Whippet","White Swiss Shepherd","Wirehaired Pointing Griffon","Xoloitzcuintli","Yorkshire Terrier"
];

const GOAL_OPTIONS = ["Lose weight","Gain weight","More exercise","Better diet","Dental hygiene","Reduce anxiety","Socialise more","Post-surgery recovery"];
const NEXT_DUE_MONTHS = [1,2,3,4,5,6];
const UK_VACCINES = [
  { id:"dhpp",   name:"DHPP",          desc:"Distemper, Hepatitis, Parvo, Parainfluenza", defaultMonths:12 },
  { id:"lepto",  name:"Leptospirosis", desc:"Annual booster — L2/L4",                    defaultMonths:12 },
  { id:"rabies", name:"Rabies",        desc:"For travel abroad",                          defaultMonths:36 },
  { id:"kennel", name:"Kennel Cough",  desc:"Recommended if kennelling",                  defaultMonths:12 },
];

const mealNamesFor = n => { if(n===1)return["Morning"]; if(n===2)return["Morning","Evening"]; if(n===3)return["Morning","Midday","Evening"]; return["Morning","Midday","Evening","Night"]; };
const todayStr  = () => new Date().toISOString().slice(0,10);
const fmtFull   = d => new Date(d).toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"});
const fmtShort  = d => new Date(d).toLocaleDateString("en-GB",{day:"numeric",month:"short"});
const daysUntil = d => Math.ceil((new Date(d)-Date.now())/86400000);
const addMonths = (ds,m) => { const d=new Date(ds); d.setMonth(d.getMonth()+m); return d.toISOString().slice(0,10); };
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
  html,body,#root{min-height:100dvh;background:#F5EFE6;font-family:'DM Sans','Helvetica Neue',sans-serif;}
  input[type=date]::-webkit-calendar-picker-indicator{opacity:0.4;}
  .roller-wrap{position:relative;height:200px;overflow:hidden;}
  .roller-list{position:absolute;top:0;left:0;right:0;transition:transform .12s ease;will-change:transform;}
  .roller-item{height:40px;display:flex;align-items:center;justify-content:center;font-size:15px;font-family:'DM Sans',sans-serif;color:#5a4a3a;cursor:pointer;user-select:none;}
  .roller-item.selected{font-size:17px;font-weight:600;color:#2a1a0a;}
  .roller-item.near{opacity:.65;}
  .roller-item.far{opacity:.28;}
  .roller-highlight{position:absolute;top:80px;left:0;right:0;height:40px;background:rgba(180,140,100,.1);border-top:1.5px solid rgba(180,140,100,.22);border-bottom:1.5px solid rgba(180,140,100,.22);border-radius:8px;pointer-events:none;}
  .roller-fade-top{position:absolute;top:0;left:0;right:0;height:72px;background:linear-gradient(to bottom,#FAF4EC,transparent);pointer-events:none;z-index:2;}
  .roller-fade-bot{position:absolute;bottom:0;left:0;right:0;height:72px;background:linear-gradient(to top,#FAF4EC,transparent);pointer-events:none;z-index:2;}
  .crop-canvas{touch-action:none;cursor:grab;display:block;}
  .crop-canvas:active{cursor:grabbing;}
  button,input,textarea{font-family:'DM Sans',sans-serif;}
  a{text-decoration:none;}
`;

export default function App() {
  const [session,setSession]=useState(null);
  const [authReady,setAuthReady]=useState(false);
  const [householdId,setHouseholdId]=useState(null);
  const [profile,setProfileState]=useState(null);
  const [tab,setTab]=useState("home");
  const [feeds,setFeeds]=useState({});
  const [vaccines,setVaccines]=useState({});
  const [vetAppts,setVetAppts]=useState([]);
  const [groomAppts,setGroomAppts]=useState([]);
  const [loading,setLoading]=useState(true);

  useEffect(()=>{
    sb.auth.getSession().then(({data:{session}})=>{setSession(session);setAuthReady(true);});
    const {data:{subscription}}=sb.auth.onAuthStateChange((_,session)=>setSession(session));
    return()=>subscription.unsubscribe();
  },[]);

  useEffect(()=>{if(!session){setLoading(false);return;}loadAll();},[session]);

  async function loadAll(){
    setLoading(true);
    try{
      const{data:memberships}=await sb.from("household_members").select("household_id").eq("user_id",session.user.id);
      let hid;
      if(!memberships?.length){
        const{data:hh}=await sb.from("households").insert({}).select().single();
        await sb.from("household_members").insert({household_id:hh.id,user_id:session.user.id});
        hid=hh.id;
      }else{hid=memberships[0].household_id;}
      setHouseholdId(hid);
      const{data:prof}=await sb.from("profiles").select("*").eq("household_id",hid).maybeSingle();
      setProfileState(prof||null);
      const{data:feedRows}=await sb.from("feeds").select("*").eq("household_id",hid);
      const feedMap={};
      (feedRows||[]).forEach(r=>{if(!feedMap[r.date])feedMap[r.date]={};feedMap[r.date][r.meal_index]={time:r.fed_at,dbId:r.id};});
      setFeeds(feedMap);
      const{data:vaccRows}=await sb.from("vaccines").select("*").eq("household_id",hid);
      const vaccMap={};
      (vaccRows||[]).forEach(r=>{vaccMap[r.vaccine_id]={lastDate:r.last_date,nextDate:r.next_date,notes:r.notes,dbId:r.id};});
      setVaccines(vaccMap);
      const{data:vetRows}=await sb.from("vet_appointments").select("*").eq("household_id",hid).order("date",{ascending:false});
      const{data:groomRows}=await sb.from("grooming_appointments").select("*").eq("household_id",hid).order("date",{ascending:false});
      setVetAppts((vetRows||[]).map(r=>({id:r.id,date:r.date,reason:r.reason,notes:r.notes,isReminder:r.is_reminder})));
      setGroomAppts((groomRows||[]).map(r=>({id:r.id,date:r.date,task:r.task,notes:r.notes,isReminder:r.is_reminder})));
    }catch(e){console.error(e);}
    setLoading(false);
  }

  useEffect(()=>{
    if(!householdId)return;
    const ch=sb.channel("feeds-"+householdId)
      .on("postgres_changes",{event:"*",schema:"public",table:"feeds",filter:`household_id=eq.${householdId}`},()=>loadAll())
      .subscribe();
    return()=>sb.removeChannel(ch);
  },[householdId]);

  async function saveProfile(p){
    const row={household_id:householdId,name:p.name,dob:p.dob,breed:p.breed,microchip:p.microchip,meals_per_day:p.mealsPerDay||p.meals_per_day||2,goals:p.goals||[],photo:p.photo||null,vet_name:p.vetName||p.vet_name,vet_phone:p.vetPhone||p.vet_phone,vet_address:p.vetAddress||p.vet_address,vet_individual:p.vetIndividual||p.vet_individual,groomer_name:p.groomerName||p.groomer_name,groomer_phone:p.groomerPhone||p.groomer_phone,groomer_address:p.groomerAddress||p.groomer_address,updated_at:new Date().toISOString()};
    if(profile?.id){await sb.from("profiles").update(row).eq("id",profile.id);setProfileState({...row,id:profile.id});}
    else{const{data}=await sb.from("profiles").insert(row).select().single();setProfileState(data);}
  }

  async function toggleFeed(date,mealIdx){
    const existing=feeds[date]?.[mealIdx];
    if(existing){
      await sb.from("feeds").delete().eq("id",existing.dbId);
      setFeeds(f=>{const d={...(f[date]||{})};delete d[mealIdx];return{...f,[date]:d};});
    }else{
      const time=new Date().toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit"});
      const{data}=await sb.from("feeds").insert({household_id:householdId,date,meal_index:mealIdx,fed_at:time}).select().single();
      setFeeds(f=>({...f,[date]:{...(f[date]||{}),[mealIdx]:{time,dbId:data.id}}}));
    }
  }

  async function saveVaccine(vid,rec){
    const row={household_id:householdId,vaccine_id:vid,last_date:rec.lastDate,next_date:rec.nextDate,notes:rec.notes,updated_at:new Date().toISOString()};
    if(rec.dbId){await sb.from("vaccines").update(row).eq("id",rec.dbId);}
    else{const{data}=await sb.from("vaccines").insert(row).select().single();rec.dbId=data.id;}
    setVaccines(v=>({...v,[vid]:rec}));
  }

  async function addVetAppt(appt){const{data}=await sb.from("vet_appointments").insert({household_id:householdId,...appt}).select().single();setVetAppts(a=>[{...appt,id:data.id},...a].sort((x,y)=>y.date.localeCompare(x.date)));}
  async function delVetAppt(id){await sb.from("vet_appointments").delete().eq("id",id);setVetAppts(a=>a.filter(x=>x.id!==id));}
  async function addGroomAppt(appt){const{data}=await sb.from("grooming_appointments").insert({household_id:householdId,...appt}).select().single();setGroomAppts(a=>[{...appt,id:data.id},...a].sort((x,y)=>y.date.localeCompare(x.date)));}
  async function delGroomAppt(id){await sb.from("grooming_appointments").delete().eq("id",id);setGroomAppts(a=>a.filter(x=>x.id!==id));}

  if(!authReady||loading)return <Splash/>;
  if(!session)return<><style>{GLOBAL_CSS}</style><AuthScreen/></>;
  if(!profile)return<><style>{GLOBAL_CSS}</style><Setup onDone={saveProfile}/></>;

  const vaccAlerts=UK_VACCINES.filter(v=>{const r=vaccines[v.id];return r?.nextDate&&daysUntil(r.nextDate)<=30;});
  const now=todayStr();
  const upcoming=[...vetAppts.filter(a=>a.date>=now).map(a=>({...a,kind:"vet"})),...groomAppts.filter(a=>a.date>=now).map(a=>({...a,kind:"groom"}))].sort((a,b)=>a.date.localeCompare(b.date)).slice(0,5);

  return(
    <>
      <style>{GLOBAL_CSS}</style>
      <div style={S.app}>
        <div style={S.topBar}>
          <div>
            <div style={S.topName}>{profile.name}</div>
            <div style={S.topSub}>{new Date().toLocaleDateString("en-GB",{weekday:"long",day:"numeric",month:"long"})}</div>
          </div>
          {profile.photo?<img src={profile.photo} alt="" style={S.topPhoto}/>:<div style={{...S.topPhoto,background:"#E8DDD0",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,fontWeight:700,color:"#B09070"}}>{(profile.name||"?")[0]}</div>}
        </div>
        <div style={S.content}>
          {tab==="home"&&<HomeTab profile={profile} feeds={feeds} onToggle={toggleFeed} vaccAlerts={vaccAlerts} upcoming={upcoming} setTab={setTab}/>}
          {tab==="vet"&&<VetTab profile={profile} vaccines={vaccines} onSaveVaccine={saveVaccine} vetAppts={vetAppts} onAddVetAppt={addVetAppt} onDelVetAppt={delVetAppt}/>}
          {tab==="grooming"&&<GroomTab profile={profile} groomAppts={groomAppts} onAddGroomAppt={addGroomAppt} onDelGroomAppt={delGroomAppt}/>}
          {tab==="profile"&&<ProfileTab profile={profile} onSave={saveProfile} householdId={householdId}/>}
        </div>
        <nav style={S.nav}>
          {[{id:"home",label:"Home"},{id:"vet",label:"Vet",badge:vaccAlerts.length>0},{id:"grooming",label:"Grooming"},{id:"profile",label:"Profile"}].map(n=>(
            <button key={n.id} onClick={()=>setTab(n.id)} style={{...S.navBtn,...(tab===n.id?S.navOn:{})}}>
              <span style={{position:"relative",display:"inline-flex"}}><NavIcon id={n.id} active={tab===n.id}/>{n.badge&&<span style={S.navBadge}/>}</span>
              <span style={S.navLabel}>{n.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </>
  );
}
function AuthScreen(){
  const [mode,setMode]=useState("login");
  const [email,setEmail]=useState("");
  const [pass,setPass]=useState("");
  const [msg,setMsg]=useState("");
  const [busy,setBusy]=useState(false);
  async function submit(){
    setBusy(true);setMsg("");
    if(mode==="login"){const{error}=await sb.auth.signInWithPassword({email,password:pass});if(error)setMsg(error.message);}
    else if(mode==="signup"){const{error}=await sb.auth.signUp({email,password:pass});if(error)setMsg(error.message);else setMsg("Check your email to confirm your account, then sign in.");}
    else{const{error}=await sb.auth.resetPasswordForEmail(email);if(error)setMsg(error.message);else setMsg("Reset link sent — check your email.");}
    setBusy(false);
  }
  const ok=msg.includes("Check")||msg.includes("sent");
  return(
    <div style={{...S.app,justifyContent:"center",padding:"0 24px"}}>
      <div style={{textAlign:"center",marginBottom:36}}>
        <div style={{width:72,height:72,borderRadius:"50%",background:"#E8DDD0",margin:"0 auto 20px",display:"flex",alignItems:"center",justifyContent:"center"}}><PawIcon size={32} color="#B09070"/></div>
        <div style={{fontSize:28,fontWeight:700,color:"#2A1A0A",letterSpacing:-.3}}>{mode==="login"?"Welcome back":mode==="signup"?"Create account":"Reset password"}</div>
        <div style={{fontSize:15,color:"#A09080",marginTop:6}}>{mode==="login"?"Sign in to your pet's account":"Your pet's health, all in one place"}</div>
      </div>
      <Field label="Email address"><input type="email" style={S.inp} value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com"/></Field>
      {mode!=="reset"&&<Field label="Password"><input type="password" style={S.inp} value={pass} onChange={e=>setPass(e.target.value)} placeholder="••••••••"/></Field>}
      {msg&&<div style={{fontSize:14,color:ok?"#4A8A60":"#B03020",background:ok?"#EAF4EA":"#FAE8E4",borderRadius:10,padding:"10px 14px",marginBottom:14,lineHeight:1.5}}>{msg}</div>}
      <button style={{...S.nextBtn,marginTop:4,opacity:busy?.6:1}} onClick={submit} disabled={busy}>{busy?"Please wait…":mode==="login"?"Sign in":mode==="signup"?"Create account":"Send reset link"}</button>
      <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:12,marginTop:20}}>
        {mode==="login"&&<button style={S.textBtn} onClick={()=>{setMode("signup");setMsg("");}}>New here? Create an account</button>}
        {mode==="signup"&&<button style={S.textBtn} onClick={()=>{setMode("login");setMsg("");}}>Already have an account? Sign in</button>}
        {mode!=="reset"&&<button style={{...S.textBtn,color:"#B0A090"}} onClick={()=>{setMode("reset");setMsg("");}}>Forgot password?</button>}
        {mode==="reset"&&<button style={S.textBtn} onClick={()=>{setMode("login");setMsg("");}}>Back to sign in</button>}
      </div>
    </div>
  );
}

function HomeTab({profile,feeds,onToggle,vaccAlerts,upcoming,setTab}){
  const key=todayStr();const today=feeds[key]||{};
  const meals=mealNamesFor(profile.meals_per_day||2);
  const fedCount=Object.keys(today).length;const allFed=fedCount===meals.length;
  const history=Object.entries(feeds).filter(([d])=>d!==key).sort(([a],[b])=>b.localeCompare(a)).slice(0,5);
  return(
    <div>
      {vaccAlerts.length>0&&<button onClick={()=>setTab("vet")} style={S.alertBanner}>
        <div style={{width:8,height:8,borderRadius:"50%",background:"#C07A45",flexShrink:0,marginTop:2}}/>
        <div style={{flex:1}}><div style={{fontWeight:600,fontSize:14,color:"#7A4A10"}}>Vaccination due soon</div><div style={{fontSize:13,color:"#A06020",marginTop:2}}>{vaccAlerts.map(a=>a.name).join(", ")} — tap to view</div></div>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C07A45" strokeWidth="2.5"><path d="M9 18l6-6-6-6"/></svg>
      </button>}
      {upcoming.length>0&&<div style={S.upcomingCard}>
        <div style={S.cardLabel}>Upcoming</div>
        {upcoming.map((a,i)=>{const d=daysUntil(a.date);return(
          <div key={i} style={{...S.upRow,...(i<upcoming.length-1?{borderBottom:"1px solid #EDE4D8"}:{})}}>
            <div style={{...S.upDot,background:a.kind==="vet"?"#7AAEC8":"#7DC49A"}}/>
            <div style={{flex:1}}><div style={S.upKind}>{a.kind==="vet"?"Vet":"Grooming"}</div><div style={S.upReason}>{a.reason||a.task}</div></div>
            <div style={{textAlign:"right"}}><div style={S.upDate}>{fmtShort(a.date)}</div><div style={{...S.upDays,color:d<=3?"#C05030":d<=7?"#B07020":"#6A9A60"}}>{d===0?"Today":d===1?"Tomorrow":`${d}d`}</div></div>
          </div>
        );})}
      </div>}
      <div style={S.cardLabel}>Today's meals</div>
      <div style={{fontSize:15,fontWeight:500,color:allFed?"#4A8A60":"#9A7040",marginBottom:14}}>{allFed?`All ${meals.length} meals done`:`${fedCount} of ${meals.length} logged`}</div>
      <div style={{display:"grid",gridTemplateColumns:`repeat(${Math.min(meals.length,2)},1fr)`,gap:12,marginBottom:28}}>
        {meals.map((name,i)=>{const done=!!today[i];return(
          <button key={i} onClick={()=>onToggle(key,i)} style={{...S.mealBtn,...(done?S.mealOn:S.mealOff)}}>
            <div style={{...S.mealCircle,...(done?S.circleOn:S.circleOff)}}><span style={{fontSize:13,fontWeight:700,letterSpacing:.3,color:done?"#fff":"#B0A090"}}>{done?"Fed":"Tap"}</span></div>
            <span style={{...S.mealName,color:done?"#3A7050":"#6A5A4A"}}>{name}</span>
            {done&&<span style={S.mealTime}>{today[i].time}</span>}
          </button>
        );})}
      </div>
      {history.length>0&&<><div style={S.cardLabel}>Recent days</div>
        <div style={S.histCard}>{history.map(([date,dayFeeds],idx)=>{
          const total=profile.meals_per_day||2;const count=Object.keys(dayFeeds).length;
          return(<div key={date} style={{...S.histRow,...(idx<history.length-1?{borderBottom:"1px solid #EDE4D8"}:{})}}>
            <span style={S.histDate}>{fmtShort(date)}</span>
            <div style={S.histDots}>{mealNamesFor(total).map((_,i)=><span key={i} style={{...S.dot,background:dayFeeds[i]?"#7DC49A":"#DDD5C8"}}/>)}</div>
            <span style={{...S.histCount,color:count===total?"#4A8A60":"#B07040"}}>{count}/{total}</span>
          </div>);
        })}</div>
      </>}
    </div>
  );
}

function VetTab({profile,vaccines,onSaveVaccine,vetAppts,onAddVetAppt,onDelVetAppt}){
  const [modal,setModal]=useState(null);const [form,setForm]=useState({});
  function openVacc(v){setModal({type:"vacc",v});setForm({date:vaccines[v.id]?.lastDate||"",nextDate:vaccines[v.id]?.nextDate||"",notes:vaccines[v.id]?.notes||""});}
  function openAppt(){setModal({type:"appt"});setForm({date:todayStr(),reason:"",notes:"",nextMonths:null});}
  async function saveVacc(){await onSaveVaccine(modal.v.id,{lastDate:form.date,nextDate:form.nextDate,notes:form.notes,dbId:vaccines[modal.v.id]?.dbId});setModal(null);}
  async function saveAppt(){
    await onAddVetAppt({date:form.date,reason:form.reason,notes:form.notes,is_reminder:false});
    if(form.nextMonths)await onAddVetAppt({date:addMonths(form.date,form.nextMonths),reason:`Follow-up: ${form.reason||"vet visit"}`,notes:"Scheduled reminder",is_reminder:true});
    setModal(null);
  }
  const now=todayStr();
  const upcoming=vetAppts.filter(a=>a.date>=now).sort((a,b)=>a.date.localeCompare(b.date));
  const past=vetAppts.filter(a=>a.date<now).sort((a,b)=>b.date.localeCompare(a.date));
  return(<div>
    {profile.vet_phone&&<a href={`tel:${profile.vet_phone}`} style={S.callBtn}>Call {profile.vet_name||"Vet"} — {profile.vet_phone}</a>}
    {profile.vet_address&&<div style={S.addrLine}>{profile.vet_address}</div>}
    {profile.vet_individual&&<div style={S.addrLine}>Dr. {profile.vet_individual}</div>}
    <div style={S.cardLabel}>Vaccinations</div>
    <div style={S.card}>{UK_VACCINES.map((v,i)=>{
      const rec=vaccines[v.id];const next=rec?.nextDate;const d=next?daysUntil(next):null;
      const urgent=d!==null&&d<=30&&d>=0;const overdue=d!==null&&d<0;
      return(<div key={v.id} style={{...S.vaccRow,...(i<UK_VACCINES.length-1?{borderBottom:"1px solid #EDE4D8"}:{})}}>
        <div style={{flex:1}}><div style={S.vaccName}>{v.name}</div><div style={S.vaccDesc}>{v.desc}</div>
          {rec?.lastDate&&<div style={S.metaTxt}>Last: {fmtFull(rec.lastDate)}</div>}
          {next?<div style={{...S.metaTxt,fontWeight:600,color:overdue?"#B03020":urgent?"#B06020":"#4A8A60"}}>{overdue?`Overdue by ${Math.abs(d)} days`:`Due: ${fmtFull(next)} (${d}d)`}</div>:<div style={{...S.metaTxt,color:"#C4B5A5"}}>Not yet recorded</div>}
        </div>
        <button style={S.editBtn} onClick={()=>openVacc(v)}>{rec?.lastDate?"Update":"Log"}</button>
      </div>);
    })}</div>
    <div style={{...S.cardLabel,marginTop:24}}>Appointments</div>
    <button style={S.addBtn} onClick={openAppt}>Book appointment</button>
    {upcoming.length>0&&<div style={S.subHead}>Upcoming</div>}
    {upcoming.map(a=><ApptCard key={a.id} appt={a} onDelete={()=>onDelVetAppt(a.id)} upcoming/>)}
    {past.length>0&&<div style={S.subHead}>Past</div>}
    {past.map(a=><ApptCard key={a.id} appt={a} onDelete={()=>onDelVetAppt(a.id)}/>)}
    {vetAppts.length===0&&<div style={S.empty}>No appointments yet</div>}
    {modal?.type==="vacc"&&<Modal title={modal.v.name} subtitle={modal.v.desc} onClose={()=>setModal(null)} onSave={saveVacc}>
      <Field label="Date given"><input type="date" style={S.inp} value={form.date||""} onChange={e=>setForm(f=>({...f,date:e.target.value}))}/></Field>
      <Field label="Next due date"><input type="date" style={S.inp} value={form.nextDate||""} onChange={e=>setForm(f=>({...f,nextDate:e.target.value}))}/></Field>
      <Field label="Notes"><textarea style={S.ta} value={form.notes||""} onChange={e=>setForm(f=>({...f,notes:e.target.value}))}/></Field>
    </Modal>}
    {modal?.type==="appt"&&<Modal title="Book Vet Appointment" onClose={()=>setModal(null)} onSave={saveAppt}>
      <Field label="Date"><input type="date" style={S.inp} value={form.date||""} onChange={e=>setForm(f=>({...f,date:e.target.value}))}/></Field>
      <Field label="Reason"><input type="text" style={S.inp} placeholder="e.g. Annual check-up" value={form.reason||""} onChange={e=>setForm(f=>({...f,reason:e.target.value}))}/></Field>
      <Field label="Notes"><textarea style={S.ta} value={form.notes||""} onChange={e=>setForm(f=>({...f,notes:e.target.value}))}/></Field>
      <Field label="Schedule next appointment"><MonthPicker value={form.nextMonths} onChange={m=>setForm(f=>({...f,nextMonths:m}))} baseDate={form.date}/></Field>
    </Modal>}
  </div>);
}

function GroomTab({profile,groomAppts,onAddGroomAppt,onDelGroomAppt}){
  const [modal,setModal]=useState(false);const [form,setForm]=useState({});
  const TASKS=["Bath","Haircut","Nail clip","Brush","Ear clean","Teeth clean"];
  async function save(){
    await onAddGroomAppt({date:form.date,task:form.task||"Bath",notes:form.notes,is_reminder:false});
    if(form.nextMonths)await onAddGroomAppt({date:addMonths(form.date,form.nextMonths),task:form.task||"Bath",notes:"Scheduled reminder",is_reminder:true});
    setModal(false);
  }
  const now=todayStr();
  const upcoming=groomAppts.filter(a=>a.date>=now).sort((a,b)=>a.date.localeCompare(b.date));
  const past=groomAppts.filter(a=>a.date<now).sort((a,b)=>b.date.localeCompare(a.date));
  return(<div>
    {profile.groomer_phone&&<a href={`tel:${profile.groomer_phone}`} style={{...S.callBtn,background:"#EAF0F8",color:"#2A5080",borderColor:"#B8CCE8"}}>Call {profile.groomer_name||"Groomer"} — {profile.groomer_phone}</a>}
    {profile.groomer_address&&<div style={S.addrLine}>{profile.groomer_address}</div>}
    <div style={S.cardLabel}>Appointments</div>
    <button style={S.addBtn} onClick={()=>{setModal(true);setForm({date:todayStr(),task:"Bath",nextMonths:null});}}>Book appointment</button>
    {upcoming.length>0&&<div style={S.subHead}>Upcoming</div>}
    {upcoming.map(a=><ApptCard key={a.id} appt={{...a,reason:a.task}} onDelete={()=>onDelGroomAppt(a.id)} upcoming/>)}
    {past.length>0&&<div style={S.subHead}>Past</div>}
    {past.map(a=><ApptCard key={a.id} appt={{...a,reason:a.task}} onDelete={()=>onDelGroomAppt(a.id)}/>)}
    {groomAppts.length===0&&<div style={S.empty}>No appointments yet</div>}
    {modal&&<Modal title="Book Grooming" onClose={()=>setModal(false)} onSave={save}>
      <Field label="Type"><div style={{display:"flex",flexWrap:"wrap",gap:8}}>{TASKS.map(t=><Chip key={t} label={t} active={form.task===t} onClick={()=>setForm(f=>({...f,task:t}))}/>)}</div></Field>
      <Field label="Date"><input type="date" style={S.inp} value={form.date||""} onChange={e=>setForm(f=>({...f,date:e.target.value}))}/></Field>
      <Field label="Notes"><textarea style={S.ta} value={form.notes||""} onChange={e=>setForm(f=>({...f,notes:e.target.value}))}/></Field>
      <Field label="Schedule next appointment"><MonthPicker value={form.nextMonths} onChange={m=>setForm(f=>({...f,nextMonths:m}))} baseDate={form.date}/></Field>
    </Modal>}
  </div>);
}
function ProfileTab({profile,onSave,householdId}){
  const norm=p=>({name:p.name||"",dob:p.dob||"",breed:p.breed||"",microchip:p.microchip||"",mealsPerDay:p.meals_per_day||2,goals:p.goals||[],photo:p.photo||null,vetName:p.vet_name||"",vetPhone:p.vet_phone||"",vetAddress:p.vet_address||"",vetIndividual:p.vet_individual||"",groomerName:p.groomer_name||"",groomerPhone:p.groomer_phone||"",groomerAddress:p.groomer_address||""});
  const [form,setForm]=useState(norm(profile));
  const [saved,setSaved]=useState(false);
  const [cropSrc,setCropSrc]=useState(null);
  const [inviteEmail,setInviteEmail]=useState("");
  const [inviteMsg,setInviteMsg]=useState("");
  const fileRef=useRef();
  function toggleGoal(g){setForm(f=>{const goals=f.goals||[];return{...f,goals:goals.includes(g)?goals.filter(x=>x!==g):[...goals,g]};});}
  function handleFile(e){const file=e.target.files[0];if(!file)return;const r=new FileReader();r.onload=ev=>setCropSrc(ev.target.result);r.readAsDataURL(file);}
  async function save(){await onSave(form);setSaved(true);setTimeout(()=>setSaved(false),2500);}
  async function sendInvite(){
    if(!inviteEmail.trim())return;
    setInviteMsg(`Ask your partner to sign up at this app using the email: ${inviteEmail}. They will automatically join your household.`);
  }
  return(<div>
    {cropSrc&&<CropModal src={cropSrc} onDone={url=>{setForm(f=>({...f,photo:url}));setCropSrc(null);}} onClose={()=>setCropSrc(null)}/>}
    <div style={S.cardLabel}>Photo</div>
    <div style={{display:"flex",justifyContent:"center",marginBottom:24}}>
      <div onClick={()=>fileRef.current.click()} style={S.profilePhotoWrap}>
        {form.photo?<img src={form.photo} style={{width:"100%",height:"100%",objectFit:"cover",borderRadius:"50%"}}/>:<div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:8}}><CameraIcon/><span style={{fontSize:13,color:"#B0A090"}}>Add photo</span></div>}
        <div style={S.photoOverlay}><EditIcon/></div>
      </div>
      <input type="file" accept="image/*" ref={fileRef} style={{display:"none"}} onChange={handleFile}/>
    </div>
    <div style={S.cardLabel}>Pet details</div>
    <div style={S.card}><div style={{padding:"4px 0 12px"}}>
      <Field label="Name"><input type="text" style={S.inp} value={form.name||""} onChange={e=>setForm(f=>({...f,name:e.target.value}))}/></Field>
      <Field label="Date of birth"><input type="date" style={S.inp} value={form.dob||""} onChange={e=>setForm(f=>({...f,dob:e.target.value}))}/></Field>
      <Field label="Breed"><BreedRoller value={form.breed||""} onChange={b=>setForm(f=>({...f,breed:b}))}/></Field>
      <Field label="Microchip number"><input type="text" style={S.inp} value={form.microchip||""} onChange={e=>setForm(f=>({...f,microchip:e.target.value}))}/></Field>
      <Field label="Meals per day" last><div style={{display:"flex",gap:10}}>{[1,2,3,4].map(n=><Chip key={n} label={String(n)} active={form.mealsPerDay===n} onClick={()=>setForm(f=>({...f,mealsPerDay:n}))} wide/>)}</div></Field>
    </div></div>
    <div style={{...S.cardLabel,marginTop:20}}>Health goals</div>
    <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:20}}>{GOAL_OPTIONS.map(g=><Chip key={g} label={g} active={(form.goals||[]).includes(g)} onClick={()=>toggleGoal(g)}/>)}</div>
    <div style={S.cardLabel}>Vet details</div>
    <div style={S.card}><div style={{padding:"4px 0 12px"}}>
      <PlaceLookup label="Practice" nameKey="vetName" phoneKey="vetPhone" addressKey="vetAddress" form={form} setForm={setForm} suffix="vet UK"/>
      <Field label="Vet's name" last><input type="text" style={S.inp} value={form.vetIndividual||""} onChange={e=>setForm(f=>({...f,vetIndividual:e.target.value}))}/></Field>
    </div></div>
    <div style={{...S.cardLabel,marginTop:20}}>Groomer details</div>
    <div style={S.card}><div style={{padding:"4px 0 12px"}}>
      <PlaceLookup label="Groomer" nameKey="groomerName" phoneKey="groomerPhone" addressKey="groomerAddress" form={form} setForm={setForm} suffix="dog groomer UK" last/>
    </div></div>
    <div style={{...S.cardLabel,marginTop:20}}>Invite partner</div>
    <div style={S.card}><div style={{padding:"12px 0"}}>
      <div style={{fontSize:14,color:"#7A6A5A",marginBottom:12,lineHeight:1.5}}>Invite your partner to share Diego's data in real time.</div>
      <div style={{display:"flex",gap:8}}>
        <input type="email" style={{...S.inp,flex:1}} placeholder="Partner's email" value={inviteEmail} onChange={e=>setInviteEmail(e.target.value)}/>
        <button style={S.searchBtn} onClick={sendInvite}>Invite</button>
      </div>
      {inviteMsg&&<div style={{fontSize:13,color:"#6A8A60",marginTop:8,fontWeight:500,lineHeight:1.4}}>{inviteMsg}</div>}
    </div></div>
    <button style={{...S.addBtn,marginTop:16,background:saved?"#4A8A60":"#3A2A1A"}} onClick={save}>{saved?"Saved!":"Save profile"}</button>
    <button style={{...S.textBtn,display:"block",margin:"20px auto 0",color:"#B0A090"}} onClick={()=>sb.auth.signOut()}>Sign out</button>
  </div>);
}

function Setup({onDone}){
  const [step,setStep]=useState(0);
  const [form,setForm]=useState({mealsPerDay:2,goals:[]});
  const [cropSrc,setCropSrc]=useState(null);
  const fileRef=useRef();
  function toggleGoal(g){setForm(f=>{const goals=f.goals||[];return{...f,goals:goals.includes(g)?goals.filter(x=>x!==g):[...goals,g]};});}
  function handleFile(e){const file=e.target.files[0];if(!file)return;const r=new FileReader();r.onload=ev=>setCropSrc(ev.target.result);r.readAsDataURL(file);}
  const steps=[
    <div key={0} style={{textAlign:"center",paddingTop:32}}>
      <div style={{width:80,height:80,borderRadius:"50%",background:"#E8DDD0",margin:"0 auto 24px",display:"flex",alignItems:"center",justifyContent:"center"}}><PawIcon size={34} color="#B09070"/></div>
      <div style={S.setupH}>Welcome</div>
      <div style={S.setupSub}>Let's set up your pet's profile. It takes about two minutes.</div>
      <button style={S.nextBtn} onClick={()=>setStep(1)}>Get started</button>
    </div>,
    <div key={1}>
      <div style={S.setupH}>About your pet</div>
      {cropSrc&&<CropModal src={cropSrc} onDone={url=>{setForm(f=>({...f,photo:url}));setCropSrc(null);}} onClose={()=>setCropSrc(null)}/>}
      <div style={{display:"flex",justifyContent:"center",marginBottom:20}}>
        <div onClick={()=>fileRef.current.click()} style={S.profilePhotoWrap}>
          {form.photo?<img src={form.photo} style={{width:"100%",height:"100%",objectFit:"cover",borderRadius:"50%"}}/>:<div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:6}}><CameraIcon/><span style={{fontSize:13,color:"#B0A090"}}>Add photo</span></div>}
          <div style={S.photoOverlay}><EditIcon/></div>
        </div>
        <input type="file" accept="image/*" ref={fileRef} style={{display:"none"}} onChange={handleFile}/>
      </div>
      <Field label="Pet's name"><input type="text" style={S.inp} value={form.name||""} onChange={e=>setForm(f=>({...f,name:e.target.value}))}/></Field>
      <Field label="Date of birth"><input type="date" style={S.inp} value={form.dob||""} onChange={e=>setForm(f=>({...f,dob:e.target.value}))}/></Field>
      <Field label="Breed"><BreedRoller value={form.breed||""} onChange={b=>setForm(f=>({...f,breed:b}))}/></Field>
      <Field label="Microchip number"><input type="text" style={S.inp} value={form.microchip||""} onChange={e=>setForm(f=>({...f,microchip:e.target.value}))}/></Field>
      <button style={{...S.nextBtn,opacity:form.name?1:.45}} onClick={()=>form.name&&setStep(2)}>Next</button>
    </div>,
    <div key={2}>
      <div style={S.setupH}>Feeding and goals</div>
      <Field label="Meals per day"><div style={{display:"flex",gap:10}}>{[1,2,3,4].map(n=><Chip key={n} label={String(n)} active={form.mealsPerDay===n} onClick={()=>setForm(f=>({...f,mealsPerDay:n}))} wide/>)}</div></Field>
      <Field label="Health goals"><div style={{display:"flex",flexWrap:"wrap",gap:8}}>{GOAL_OPTIONS.map(g=><Chip key={g} label={g} active={(form.goals||[]).includes(g)} onClick={()=>toggleGoal(g)}/>)}</div></Field>
      <button style={S.nextBtn} onClick={()=>setStep(3)}>Next</button>
    </div>,
    <div key={3}>
      <div style={S.setupH}>Your vet</div>
      <PlaceLookup label="Practice" nameKey="vetName" phoneKey="vetPhone" addressKey="vetAddress" form={form} setForm={setForm} suffix="vet UK"/>
      <Field label="Vet's name"><input type="text" style={S.inp} value={form.vetIndividual||""} onChange={e=>setForm(f=>({...f,vetIndividual:e.target.value}))}/></Field>
      <button style={S.nextBtn} onClick={()=>setStep(4)}>Next</button>
    </div>,
    <div key={4}>
      <div style={S.setupH}>Your groomer</div>
      <PlaceLookup label="Groomer" nameKey="groomerName" phoneKey="groomerPhone" addressKey="groomerAddress" form={form} setForm={setForm} suffix="dog groomer UK" last/>
      <button style={S.nextBtn} onClick={()=>{ if(form.name) onDone(form); }}>All done</button>
    </div>,
  ];
  return(<div style={S.app}>
    <div style={{display:"flex",gap:6,justifyContent:"center",padding:"20px 0 4px"}}>{steps.map((_,i)=><div key={i} style={{width:7,height:7,borderRadius:"50%",background:i<=step?"#C07A45":"#DDD5C8",transition:"background .3s"}}/>)}</div>
    <div style={{padding:"16px 20px 80px",maxWidth:430,margin:"0 auto",flex:1,overflowY:"auto"}}>{steps[step]}</div>
  </div>);
}

function BreedRoller({value,onChange}){
  return(
    <select
      value={value||""}
      onChange={e=>onChange(e.target.value)}
      style={{width:"100%",background:"#FAF4EC",border:"1.5px solid #DDD5C8",borderRadius:10,padding:"12px 14px",fontSize:15,outline:"none",fontFamily:"'DM Sans',sans-serif",color:value?"#2A1A0A":"#B0A090",appearance:"none",WebkitAppearance:"none",backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23B0A090' stroke-width='2.5'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,backgroundRepeat:"no-repeat",backgroundPosition:"right 14px center",boxSizing:"border-box"}}
    >
      <option value="" disabled>Select breed…</option>
      {BREEDS.map(b=><option key={b} value={b}>{b}</option>)}
    </select>
  );
}

function CropModal({src,onDone,onClose}){
  const canvasRef=useRef();const imgRef=useRef(new Image());
  const state=useRef({offsetX:0,offsetY:0,scale:1,dragging:false,lastX:0,lastY:0});
  const C=260;
  useEffect(()=>{const img=imgRef.current;img.onload=()=>{const sc=Math.max(C/img.width,C/img.height);state.current={...state.current,scale:sc,offsetX:(C-img.width*sc)/2,offsetY:(C-img.height*sc)/2};draw();};img.src=src;},[src]);
  function draw(){const cv=canvasRef.current;if(!cv)return;const ctx=cv.getContext("2d");const{offsetX,offsetY,scale}=state.current;ctx.clearRect(0,0,C,C);ctx.save();ctx.beginPath();ctx.arc(C/2,C/2,C/2,0,Math.PI*2);ctx.clip();ctx.drawImage(imgRef.current,offsetX,offsetY,imgRef.current.width*scale,imgRef.current.height*scale);ctx.restore();ctx.beginPath();ctx.arc(C/2,C/2,C/2-1,0,Math.PI*2);ctx.strokeStyle="rgba(180,140,100,.3)";ctx.lineWidth=2;ctx.stroke();}
  function getXY(e){if(e.touches)return{x:e.touches[0].clientX,y:e.touches[0].clientY};return{x:e.clientX,y:e.clientY};}
  function onDown(e){const{x,y}=getXY(e);state.current.dragging=true;state.current.lastX=x;state.current.lastY=y;}
  function onMove(e){if(!state.current.dragging)return;const{x,y}=getXY(e);state.current.offsetX+=x-state.current.lastX;state.current.offsetY+=y-state.current.lastY;state.current.lastX=x;state.current.lastY=y;draw();}
  function onUp(){state.current.dragging=false;}
  function onWheelCrop(e){e.preventDefault();state.current.scale=Math.max(.3,Math.min(5,state.current.scale*(e.deltaY>0?.95:1.05)));draw();}
  function confirm(){const cv=canvasRef.current;const out=document.createElement("canvas");out.width=C;out.height=C;out.getContext("2d").drawImage(cv,0,0);onDone(out.toDataURL("image/jpeg",.9));}
  return(<div style={S.overlay} onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
    <div style={{...S.modal,alignItems:"center"}}>
      <div style={{fontWeight:700,fontSize:17,color:"#2A1A0A",marginBottom:6}}>Crop photo</div>
      <div style={{fontSize:13,color:"#A09080",marginBottom:16}}>Drag to reposition · Scroll to zoom</div>
      <canvas ref={canvasRef} width={C} height={C} className="crop-canvas" style={{borderRadius:"50%",width:C,height:C,background:"#EDE4D8"}} onMouseDown={onDown} onMouseMove={onMove} onMouseUp={onUp} onMouseLeave={onUp} onTouchStart={onDown} onTouchMove={onMove} onTouchEnd={onUp} onWheel={onWheelCrop}/>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginTop:20,width:"100%"}}>
        <button style={S.btnCancel} onClick={onClose}>Cancel</button>
        <button style={S.btnSave} onClick={confirm}>Use photo</button>
      </div>
    </div>
  </div>);
}

function MonthPicker({value,onChange,baseDate}){return(<><div style={{display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:6}}>{NEXT_DUE_MONTHS.map(m=><button key={m} onClick={()=>onChange(value===m?null:m)} style={{...S.monthBtn,...(value===m?S.monthOn:{})}}>{m}mo</button>)}</div>{value&&baseDate&&<div style={{fontSize:13,color:"#6A8A60",fontWeight:600,marginTop:8}}>Next: {fmtFull(addMonths(baseDate,value))}</div>}</>);}

function PlaceLookup({label,nameKey,phoneKey,addressKey,form,setForm,suffix,last}){
  const [results,setResults]=useState([]);const[busy,setBusy]=useState(false);const[query,setQuery]=useState(form[nameKey]||"");
  async function search(){if(!query.trim())return;setBusy(true);try{const res=await fetch(`/api/places?query=${encodeURIComponent(query+" "+suffix)}`);const data=await res.json();setResults((data.results||[]).slice(0,4));}catch{setResults([]);}setBusy(false);}
  function pick(p){setForm(f=>({...f,[nameKey]:p.name,[addressKey]:p.formatted_address,[phoneKey]:p.formatted_phone_number||f[phoneKey]||""}));setQuery(p.name);setResults([]);}
  return(<>
    <Field label={label}><div style={{display:"flex",gap:8}}><input type="text" style={{...S.inp,flex:1}} value={query} placeholder="Search or type…" onChange={e=>setQuery(e.target.value)} onKeyDown={e=>e.key==="Enter"&&search()}/><button style={S.searchBtn} onClick={search}>{busy?"…":"Search"}</button></div>{results.length>0&&<div style={S.dropdown}>{results.map((r,i)=><div key={i} style={S.dropItem} onClick={()=>pick(r)}><div style={{fontWeight:600,fontSize:14,color:"#2A1A0A"}}>{r.name}</div><div style={{fontSize:12,color:"#A09080"}}>{r.formatted_address}</div></div>)}</div>}</Field>
    <Field label="Phone"><input type="tel" style={S.inp} value={form[phoneKey]||""} placeholder="e.g. 020 7946 0123" onChange={e=>setForm(f=>({...f,[phoneKey]:e.target.value}))}/></Field>
    <Field label="Address" last={last}><input type="text" style={S.inp} value={form[addressKey]||""} placeholder="Auto-filled or enter manually" onChange={e=>setForm(f=>({...f,[addressKey]:e.target.value}))}/></Field>
  </>);
}

function Chip({label,active,onClick,wide}){return<button onClick={onClick} style={{background:active?"#EAD9C0":"#F0EAE0",border:`1.5px solid ${active?"#C07A45":"#DDD5C8"}`,borderRadius:10,padding:wide?"12px 0":"9px 14px",fontSize:14,fontWeight:active?600:400,cursor:"pointer",color:active?"#7A4010":"#7A6A5A",flex:wide?1:undefined,transition:"all .15s"}}>{label}</button>;}
function Field({label,children,last}){return<div style={{marginBottom:last?0:16}}><div style={S.fieldLbl}>{label}</div>{children}</div>;}
function ApptCard({appt,onDelete,upcoming}){const d=daysUntil(appt.date);return<div style={{...S.apptCard,...(upcoming?S.apptUp:{})}}><div style={{flex:1}}>{upcoming&&<div style={{fontSize:13,fontWeight:600,color:d<=3?"#B03020":d<=7?"#A06020":"#4A7A50",marginBottom:3}}>{d===0?"Today":d===1?"Tomorrow":`In ${d} days`}{appt.isReminder?" · Reminder":""}</div>}<div style={{fontSize:16,fontWeight:600,color:"#2A1A0A"}}>{appt.reason||appt.task}</div><div style={{fontSize:13,color:"#A09080",marginTop:3}}>{fmtFull(appt.date)}</div>{appt.notes&&appt.notes!=="Scheduled"&&appt.notes!=="Scheduled reminder"&&<div style={{fontSize:13,color:"#B0A090",marginTop:4}}>{appt.notes}</div>}</div><button onClick={onDelete} style={{background:"none",border:"none",color:"#D0C4B8",fontSize:22,cursor:"pointer",padding:"0 2px",lineHeight:1}}>×</button></div>;}
function Modal({title,subtitle,onClose,onSave,children}){return<div style={S.overlay} onClick={e=>{if(e.target===e.currentTarget)onClose();}}><div style={S.modal}><div style={{fontSize:18,fontWeight:700,color:"#2A1A0A",marginBottom:subtitle?4:18}}>{title}</div>{subtitle&&<div style={{fontSize:13,color:"#A09080",marginBottom:18}}>{subtitle}</div>}{children}<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginTop:20}}><button style={S.btnCancel} onClick={onClose}>Cancel</button><button style={S.btnSave} onClick={onSave}>Save</button></div></div></div>;}
function Splash(){return<div style={{display:"flex",alignItems:"center",justifyContent:"center",minHeight:"100dvh",background:"#F5EFE6"}}><PawIcon size={40} color="#DDD5C8"/></div>;}
function NavIcon({id,active}){const c=active?"#C07A45":"#C4B5A5";const i={home:<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/><path d="M9 21V12h6v9"/></svg>,vet:<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M12 8v8M8 12h8"/></svg>,grooming:<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M20 4L8.12 15.88M14.47 14.48L20 20M8.12 8.12L12 12"/></svg>,profile:<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>};return i[id]||null;}
function PawIcon({size=24,color="#B09070"}){return<svg width={size} height={size} viewBox="0 0 64 64" fill={color}><ellipse cx="32" cy="50" rx="14" ry="10"/><ellipse cx="14" cy="38" rx="7" ry="9"/><ellipse cx="50" cy="38" rx="7" ry="9"/><ellipse cx="22" cy="22" rx="6" ry="8"/><ellipse cx="42" cy="22" rx="6" ry="8"/></svg>;}
function CameraIcon(){return<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C4B5A5" strokeWidth="1.5"><rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="12" cy="12" r="3"/><path d="M3 9h2l2-4h10l2 4h2"/></svg>;}
function EditIcon(){return<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;}

const S={
  app:{fontFamily:"'DM Sans','Helvetica Neue',sans-serif",background:"#F5EFE6",minHeight:"100dvh",maxWidth:430,margin:"0 auto",display:"flex",flexDirection:"column"},
  topBar:{background:"#FAF4EC",padding:"20px 20px 16px",display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:"1.5px solid #EDE4D8",position:"sticky",top:0,zIndex:10},
  topName:{fontSize:24,fontWeight:700,letterSpacing:-.3,color:"#2A1A0A"},
  topSub:{fontSize:14,color:"#B0A090",marginTop:2},
  topPhoto:{width:48,height:48,borderRadius:"50%",objectFit:"cover",border:"2px solid #EDE4D8"},
  content:{flex:1,padding:"20px 18px 100px",overflowY:"auto"},
  nav:{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:430,background:"#FAF4EC",borderTop:"1.5px solid #EDE4D8",display:"grid",gridTemplateColumns:"repeat(4,1fr)",padding:"10px 0 24px",zIndex:10},
  navBtn:{background:"none",border:"none",cursor:"pointer",padding:"4px",display:"flex",flexDirection:"column",alignItems:"center",gap:4,color:"#C4B5A5",position:"relative"},
  navOn:{color:"#C07A45"},navLabel:{fontSize:11,fontWeight:600,letterSpacing:.3,color:"inherit"},
  navBadge:{position:"absolute",top:-1,right:-3,width:8,height:8,borderRadius:"50%",background:"#C07A45",border:"2px solid #FAF4EC"},
  card:{background:"#FAF4EC",borderRadius:16,border:"1.5px solid #EDE4D8",padding:"0 16px",marginBottom:4},
  cardLabel:{fontSize:11,fontWeight:700,letterSpacing:1.8,textTransform:"uppercase",color:"#C4B5A5",marginBottom:10},
  alertBanner:{background:"#FDF3E3",border:"1.5px solid #F0D8A0",borderRadius:14,padding:"12px 14px",display:"flex",alignItems:"flex-start",gap:10,marginBottom:16,cursor:"pointer",width:"100%",textAlign:"left"},
  upcomingCard:{background:"#FAF4EC",border:"1.5px solid #EDE4D8",borderRadius:16,padding:"14px 16px",marginBottom:20},
  upRow:{display:"flex",alignItems:"center",gap:12,paddingBottom:10,marginBottom:10},
  upDot:{width:8,height:8,borderRadius:"50%",flexShrink:0},
  upKind:{fontSize:11,fontWeight:700,letterSpacing:1.2,textTransform:"uppercase",color:"#C4B5A5"},
  upReason:{fontSize:15,fontWeight:500,color:"#2A1A0A",marginTop:1},
  upDate:{fontSize:12,color:"#B0A090",fontWeight:500},upDays:{fontSize:13,fontWeight:700},
  mealBtn:{border:"2px solid transparent",borderRadius:20,padding:"20px 10px 16px",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:8,transition:"all .2s",boxShadow:"0 1px 6px rgba(0,0,0,.04)"},
  mealOff:{background:"#FAF4EC",borderColor:"#EDE4D8"},mealOn:{background:"#EAF2EA",borderColor:"#8ACA9A"},
  mealCircle:{width:66,height:66,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",transition:"all .2s"},
  circleOff:{background:"#EDE4D8"},circleOn:{background:"#6AAA7A"},
  mealName:{fontSize:15,fontWeight:600},mealTime:{fontSize:12,color:"#7A9A7A"},
  histCard:{background:"#FAF4EC",borderRadius:16,border:"1.5px solid #EDE4D8",padding:"0 16px"},
  histRow:{display:"flex",alignItems:"center",gap:12,padding:"12px 0"},
  histDate:{fontSize:14,color:"#A09080",width:72,flexShrink:0,fontWeight:500},
  histDots:{display:"flex",gap:6,flex:1},dot:{width:12,height:12,borderRadius:"50%"},
  histCount:{fontSize:14,fontWeight:700,width:32,textAlign:"right"},
  callBtn:{display:"block",background:"#EAF2EA",color:"#2A5A3A",borderRadius:14,padding:"14px 18px",fontSize:15,fontWeight:600,textDecoration:"none",marginBottom:8,border:"1.5px solid #A8CCA8",textAlign:"center"},
  addrLine:{fontSize:13,color:"#A09080",marginBottom:6,paddingLeft:2},
  vaccRow:{display:"flex",alignItems:"flex-start",gap:12,padding:"14px 0"},
  vaccName:{fontWeight:700,fontSize:16,color:"#2A1A0A"},vaccDesc:{fontSize:13,color:"#A09080",marginTop:2},metaTxt:{fontSize:13,color:"#B0A090",marginTop:4},
  editBtn:{background:"#F0EAE0",border:"1.5px solid #DDD5C8",borderRadius:8,padding:"7px 14px",fontSize:13,fontWeight:600,cursor:"pointer",flexShrink:0,color:"#7A5A3A"},
  addBtn:{background:"#3A2A1A",color:"#F5EFE6",border:"none",borderRadius:12,padding:"14px",fontSize:15,fontWeight:600,cursor:"pointer",width:"100%",marginBottom:16,letterSpacing:.2},
  subHead:{fontSize:12,fontWeight:700,color:"#C4B5A5",letterSpacing:.5,margin:"16px 0 8px",textTransform:"uppercase"},
  apptCard:{background:"#FAF4EC",borderRadius:12,padding:"14px 16px",marginBottom:8,border:"1.5px solid #EDE4D8",display:"flex",alignItems:"flex-start",gap:8},
  apptUp:{borderColor:"#A8CCA8",background:"#F0F6F0"},
  empty:{textAlign:"center",color:"#C4B5A5",padding:"32px 0",fontSize:15},
  monthBtn:{background:"#F0EAE0",border:"1.5px solid #DDD5C8",borderRadius:8,padding:"10px 0",fontSize:13,fontWeight:600,cursor:"pointer",color:"#7A6A5A"},
  monthOn:{background:"#EAD9C0",borderColor:"#C07A45",color:"#7A4010"},
  profilePhotoWrap:{width:130,height:130,borderRadius:"50%",background:"#EDE4D8",border:"2px dashed #D0C4B8",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",overflow:"hidden",position:"relative"},
  photoOverlay:{position:"absolute",inset:0,borderRadius:"50%",background:"rgba(0,0,0,.2)",display:"flex",alignItems:"center",justifyContent:"center"},
  fieldLbl:{fontSize:11,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",color:"#B0A090",marginBottom:7},
  inp:{width:"100%",background:"#FAF4EC",border:"1.5px solid #DDD5C8",borderRadius:10,padding:"12px 14px",fontSize:15,outline:"none",color:"#2A1A0A",boxSizing:"border-box"},
  ta:{width:"100%",background:"#FAF4EC",border:"1.5px solid #DDD5C8",borderRadius:10,padding:"12px 14px",fontSize:15,outline:"none",color:"#2A1A0A",resize:"none",height:78,boxSizing:"border-box"},
  searchBtn:{background:"#3A2A1A",color:"#F5EFE6",border:"none",borderRadius:10,padding:"0 16px",fontSize:13,fontWeight:600,cursor:"pointer",flexShrink:0},
  dropdown:{background:"#FAF4EC",border:"1.5px solid #DDD5C8",borderRadius:10,marginTop:4,overflow:"hidden",boxShadow:"0 4px 16px rgba(0,0,0,.08)"},
  dropItem:{padding:"10px 14px",cursor:"pointer",borderBottom:"1px solid #F0EAE0"},
  overlay:{position:"fixed",inset:0,background:"rgba(42,26,10,.45)",display:"flex",alignItems:"flex-end",justifyContent:"center",zIndex:100,backdropFilter:"blur(6px)"},
  modal:{background:"#FAF4EC",borderRadius:"22px 22px 0 0",padding:"24px 20px 44px",width:"100%",maxWidth:430,maxHeight:"88dvh",overflowY:"auto"},
  btnCancel:{background:"#F0EAE0",border:"none",borderRadius:12,padding:13,fontSize:15,fontWeight:600,cursor:"pointer",color:"#A09080"},
  btnSave:{background:"#3A2A1A",border:"none",borderRadius:12,padding:13,fontSize:15,fontWeight:600,cursor:"pointer",color:"#F5EFE6"},
  textBtn:{background:"none",border:"none",fontSize:14,fontWeight:500,color:"#C07A45",cursor:"pointer",padding:"4px 0"},
  setupH:{fontSize:28,fontWeight:700,letterSpacing:-.4,color:"#2A1A0A",marginBottom:8},
  setupSub:{fontSize:16,color:"#A09080",marginBottom:28,lineHeight:1.55},
  nextBtn:{background:"#3A2A1A",color:"#F5EFE6",border:"none",borderRadius:14,padding:15,fontSize:15,fontWeight:600,cursor:"pointer",width:"100%",marginTop:12,letterSpacing:.2},
};
