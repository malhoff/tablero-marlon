import { useState, useRef, useEffect } from "react";

const TEAM = ["Marlon", "Brian", "Elena", "Julia", "André"];
const TIPOS = ["Expediente", "Informe", "Coordinación", "Otro"];
const PRIORIDADES = ["Alta", "Media", "Normal"];
const ESTADOS = ["Pendiente", "En proceso", "En revisión", "Completado"];
const SH_CATEGORIAS = ["Consultoría IA", "Cursos y talleres", "Contenido digital", "Emprendimientos", "Otro"];
const SH_ESTADOS = ["Por hacer", "En curso", "Completado"];
const SH_PRIORIDADES = ["Alta","Media","Normal"];

const AVATAR_C = {
  Marlon:["#534AB7","#EEEDFE"], Brian:["#185FA5","#E6F1FB"],
  Elena:["#993C1D","#FAECE7"], Julia:["#993556","#FBEAF0"], "André":["#0F6E56","#E1F5EE"],
};
const ESTADO_STYLE = {
  Pendiente:    {hdr:"#185FA5",bg:"#ddeeff",col:"#0c2d52"},
  "En proceso": {hdr:"#854F0B",bg:"#fde9c0",col:"#412402"},
  "En revisión":{hdr:"#534AB7",bg:"#EEEDFE",col:"#26215C"},
  Completado:   {hdr:"#3B6D11",bg:"#d6edbe",col:"#173404"},
};
const PRI_STYLE = {
  Alta:  {bg:"#fcebeb",color:"#a32d2d",border:"#e24b4a"},
  Media: {bg:"#faeeda",color:"#633806",border:"#ef9f27"},
  Normal:{bg:"#eaf3de",color:"#27500a",border:"#639922"},
};
const TIPO_STYLE = {
  Expediente:  {bg:"#EEEDFE",color:"#3C3489"},
  Informe:     {bg:"#E6F1FB",color:"#0C447C"},
  Coordinación:{bg:"#FBEAF0",color:"#72243E"},
  Otro:        {bg:"#F1EFE8",color:"#444441"},
};
const SH_ESTADO_STYLE = {
  "Por hacer": {hdr:"#185FA5",bg:"#ddeeff",col:"#0c2d52"},
  "En curso":  {hdr:"#854F0B",bg:"#fde9c0",col:"#412402"},
  Completado:  {hdr:"#3B6D11",bg:"#d6edbe",col:"#173404"},
};
const CAT_STYLE = {
  "Consultoría IA":  {bg:"#EEEDFE",color:"#3C3489"},
  "Cursos y talleres":{bg:"#E6F1FB",color:"#0C447C"},
  "Contenido digital":{bg:"#FBEAF0",color:"#72243E"},
  "Emprendimientos": {bg:"#E1F5EE",color:"#085041"},
  "Otro":            {bg:"#F1EFE8",color:"#444441"},
};

const initials = n => n.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase();
const fmtDate  = d => d ? d.slice(5).replace("-","/") : "—";
const monthNames = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
const BLANK = {titulo:"",responsable:"Marlon",tipo:"Expediente",prioridad:"Normal",estado:"Pendiente",descripcion:"",inicio:new Date().toISOString().slice(0,10),vencimiento:""};
const SH_BLANK = {titulo:"",descripcion:"",categoria:"Consultoría IA",prioridad:"Normal",estado:"Por hacer",vencimiento:"",notas:""};

const seed = [
  {id:1,titulo:"Informe mensual de inversiones",responsable:"Marlon",tipo:"Informe",prioridad:"Alta",estado:"En proceso",descripcion:"Consolidar datos de ejecución presupuestal",inicio:"2026-04-01",vencimiento:"2026-04-25"},
  {id:2,titulo:"Revisión expediente IOARR #045",responsable:"Brian",tipo:"Expediente",prioridad:"Alta",estado:"Pendiente",descripcion:"Verificar requisitos técnicos y legales",inicio:"2026-04-10",vencimiento:"2026-04-28"},
  {id:3,titulo:"Coordinación con INVERMET",responsable:"Elena",tipo:"Coordinación",prioridad:"Media",estado:"Pendiente",descripcion:"Reunión de seguimiento de proyectos",inicio:"2026-04-15",vencimiento:"2026-04-30"},
  {id:4,titulo:"Modificación presupuestaria Q2",responsable:"Julia",tipo:"Expediente",prioridad:"Normal",estado:"Pendiente",descripcion:"Elaborar nota técnica justificatoria",inicio:"2026-04-18",vencimiento:"2026-05-05"},
  {id:5,titulo:"Plan operativo actualización",responsable:"André",tipo:"Informe",prioridad:"Media",estado:"Pendiente",descripcion:"Actualizar metas e indicadores",inicio:"2026-04-20",vencimiento:"2026-05-10"},
];
const shSeed = [
  {id:1,titulo:"Taller IA para gestión pública — PUCP",descripcion:"Diseñar y presentar propuesta de taller de 8 horas",categoria:"Cursos y talleres",prioridad:"Alta",estado:"En curso",vencimiento:"2026-05-10",notas:"Coordinando con directora académica"},
  {id:2,titulo:"Post LinkedIn: prompt engineering aplicado",descripcion:"Artículo con ejemplos reales de municipio",categoria:"Contenido digital",prioridad:"Media",estado:"Por hacer",vencimiento:"2026-04-28",notas:""},
  {id:3,titulo:"Propuesta consultoría procesos",descripcion:"Diagnóstico de procesos administrativos con IA",categoria:"Consultoría IA",prioridad:"Alta",estado:"Por hacer",vencimiento:"2026-05-05",notas:"Referido por Roberto"},
];

const storageGet = (k, fallback) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : fallback; } catch { return fallback; } };
const storageSet = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };

const Label = ({text,style}) => <span style={{fontSize:11,padding:"2px 8px",borderRadius:20,fontWeight:500,...style}}>{text}</span>;
const Avatar = ({name,size=28}) => <div style={{width:size,height:size,borderRadius:"50%",background:AVATAR_C[name]?.[1]||"#eee",color:AVATAR_C[name]?.[0]||"#333",display:"flex",alignItems:"center",justifyContent:"center",fontSize:size*0.36,fontWeight:500,flexShrink:0}}>{initials(name)}</div>;

export default function App() {
  const [tasks,   setTasksRaw]   = useState(() => storageGet("tablero_tasks",   seed));
  const [shTasks, setShTasksRaw] = useState(() => storageGet("tablero_shtasks", shSeed));

  const setTasks   = v => { const next = typeof v==="function"?v(tasks):v;   storageSet("tablero_tasks",   next); setTasksRaw(next); };
  const setShTasks = v => { const next = typeof v==="function"?v(shTasks):v; storageSet("tablero_shtasks", next); setShTasksRaw(next); };

  const [view, setView] = useState("kanban");
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(BLANK);
  const [editId, setEditId] = useState(null);
  const [aiReport, setAiReport] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [calMonth, setCalMonth] = useState({y:2026,m:3});
  const [filterPerson, setFilterPerson] = useState("Todos");
  const [shModal, setShModal] = useState(null);
  const [shForm, setShForm] = useState(SH_BLANK);
  const [shEditId, setShEditId] = useState(null);
  const [shFilter, setShFilter] = useState("Todas");
  const [module, setModule] = useState("equipo");

  const dragTask   = useRef(null);
  const shDragTask = useRef(null);
  const dragFrom   = useRef(null);
  const [dragOver, setDragOver]   = useState(null);
  const [shDragOver, setShDragOver] = useState(null);

  const nextId   = () => Math.max(0,...tasks.map(t=>t.id))+1;
  const shNextId = () => Math.max(0,...shTasks.map(t=>t.id))+1;
  const cargaActiva = p => tasks.filter(t=>t.responsable===p&&t.estado!=="Completado").length;
  const alerts = TEAM.filter(p=>cargaActiva(p)>=4);

  const openNew  = () => { setForm({...BLANK}); setEditId(null); setModal("form"); };
  const openEdit = t  => { setForm({...t}); setEditId(t.id); setModal("form"); };
  const saveTask = () => {
    if(!form.titulo.trim()) return;
    if(editId) setTasks(ts=>ts.map(t=>t.id===editId?{...form,id:editId}:t));
    else setTasks(ts=>[...ts,{...form,id:nextId()}]);
    setModal(null);
  };
  const deleteTask = id => { setTasks(ts=>ts.filter(t=>t.id!==id)); setModal(null); };
  const updateField = (id,field,val) => setTasks(ts=>ts.map(t=>t.id===id?{...t,[field]:val}:t));

  const shOpenNew  = () => { setShForm({...SH_BLANK}); setShEditId(null); setShModal("form"); };
  const shOpenEdit = t  => { setShForm({...t}); setShEditId(t.id); setShModal("form"); };
  const shSaveTask = () => {
    if(!shForm.titulo.trim()) return;
    if(shEditId) setShTasks(ts=>ts.map(t=>t.id===shEditId?{...shForm,id:shEditId}:t));
    else setShTasks(ts=>[...ts,{...shForm,id:shNextId()}]);
    setShModal(null);
  };
  const shDeleteTask = id => { setShTasks(ts=>ts.filter(t=>t.id!==id)); setShModal(null); };

  const sorted = arr => { const p={Alta:0,Media:1,Normal:2}; return [...arr].sort((a,b)=>p[a.prioridad]!==p[b.prioridad]?p[a.prioridad]-p[b.prioridad]:a.id-b.id); };
  const kanbanTasks = estado => sorted(tasks.filter(t=>t.estado===estado&&(filterPerson==="Todos"||t.responsable===filterPerson)));
  const shKanbanTasks = estado => { const p={Alta:0,Media:1,Normal:2}; return [...shTasks.filter(t=>t.estado===estado&&(shFilter==="Todas"||t.categoria===shFilter))].sort((a,b)=>p[a.prioridad]-p[b.prioridad]||a.id-b.id); };
  const calTasks = day => { const ds=`${calMonth.y}-${String(calMonth.m+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`; return tasks.filter(t=>t.vencimiento===ds&&(filterPerson==="Todos"||t.responsable===filterPerson)); };

  const onKanbanDragStart=(e,t)=>{ dragTask.current=t; e.dataTransfer.effectAllowed="move"; };
  const onKanbanDrop=(e,estado)=>{ e.preventDefault(); setDragOver(null); if(dragTask.current&&dragTask.current.estado!==estado) updateField(dragTask.current.id,"estado",estado); dragTask.current=null; };
  const onCalDragStart=(e,t)=>{ dragTask.current=t; dragFrom.current="calendar"; e.dataTransfer.effectAllowed="move"; };
  const onCalDrop=(e,day)=>{ e.preventDefault(); setDragOver(null); if(!dragTask.current) return; const ds=`${calMonth.y}-${String(calMonth.m+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`; updateField(dragTask.current.id,"vencimiento",ds); dragTask.current=null; };
  const onShDragStart=(e,t)=>{ shDragTask.current=t; e.dataTransfer.effectAllowed="move"; };
  const onShDrop=(e,estado)=>{ e.preventDefault(); setShDragOver(null); const t=shDragTask.current; shDragTask.current=null; if(t&&t.estado!==estado) setShTasks(ts=>ts.map(s=>s.id===t.id?{...s,estado}:s)); };

  const getAiReport = async () => {
    setAiLoading(true); setAiReport("");
    const resumen = TEAM.map(p=>{ const all=tasks.filter(t=>t.responsable===p); return `${p}: ${all.length} encargos (${all.filter(t=>t.estado==="Completado").length} completados, ${all.filter(t=>t.estado==="En proceso").length} en proceso, ${all.filter(t=>t.estado==="En revisión").length} en revisión, ${all.filter(t=>t.estado==="Pendiente").length} pendientes)`; }).join("\n");
    try {
      const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,system:"Eres un asistente de gestión pública. Responde en español, tono ejecutivo, conciso. Sin emojis.",messages:[{role:"user",content:`Analiza la carga mensual del equipo de Marlon.\n\n${resumen}\n\nAnálisis ejecutivo (máx 200 palabras): (1) mayor carga, (2) menor carga, (3) desequilibrio, (4) recomendación.`}]})});
      const data=await res.json(); setAiReport(data.content?.[0]?.text||"Sin respuesta.");
    } catch { setAiReport("Error de conexión."); }
    setAiLoading(false);
  };

  const daysInMonth=(y,m)=>new Date(y,m+1,0).getDate();
  const firstDay=(y,m)=>new Date(y,m,1).getDay();

  return (
    <div style={{fontFamily:"system-ui,sans-serif",minHeight:"100vh",background:"#f4f2ee",padding:"1.25rem"}}>

      {/* TOP BAR */}
      <div style={{background:"#2C2C2A",borderRadius:12,padding:"14px 20px",marginBottom:12,display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:8}}>
        <div>
          <div style={{fontSize:16,fontWeight:500,color:"#fff"}}>Tablero de Pendientes</div>
          <div style={{fontSize:12,color:"#B4B2A9",marginTop:2}}>Equipo de Marlon</div>
        </div>
        <div style={{display:"flex",gap:4}}>
          {[["equipo","Mi Equipo"],["sidehustles","Side Hustles"]].map(([id,lbl])=>(
            <button key={id} onClick={()=>setModule(id)} style={{padding:"8px 16px",fontSize:13,cursor:"pointer",background:module===id?"#534AB7":"rgba(255,255,255,0.1)",color:"#fff",border:"none",borderRadius:8,fontWeight:module===id?500:400}}>{lbl}</button>
          ))}
        </div>
        <button onClick={module==="equipo"?openNew:shOpenNew} style={{padding:"9px 18px",fontSize:13,cursor:"pointer",background:module==="sidehustles"?"#0F6E56":"#534AB7",color:"#fff",border:"none",borderRadius:8,fontWeight:500}}>
          + Nuevo {module==="equipo"?"encargo":"proyecto"}
        </button>
      </div>

      {/* ══ MÓDULO EQUIPO ══ */}
      {module==="equipo"&&(<>
        {alerts.length>0&&(
          <div style={{background:"#fcebeb",border:"1px solid #f09595",borderRadius:8,padding:"10px 16px",marginBottom:12,fontSize:13,color:"#791f1f",display:"flex",alignItems:"center",gap:8}}>
            <span style={{width:8,height:8,borderRadius:"50%",background:"#e24b4a",display:"inline-block",flexShrink:0}}></span>
            <strong>Alerta:</strong>&nbsp;{alerts.join(", ")} {alerts.length===1?"tiene":"tienen"} 4 o más pendientes activos.
          </div>
        )}

        {/* Filter + Tabs */}
        <div style={{background:"#fff",borderRadius:10,padding:"10px 14px",marginBottom:12,display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:8,border:"0.5px solid #D3D1C7"}}>
          <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
            {["Todos",...TEAM].map(p=>{
              const activos=p==="Todos"?null:cargaActiva(p); const over=activos!==null&&activos>=4; const sel=filterPerson===p;
              return (
                <button key={p} onClick={()=>setFilterPerson(p)} style={{display:"flex",alignItems:"center",gap:7,padding:"6px 13px",fontSize:13,cursor:"pointer",background:sel?"#EEEDFE":"transparent",color:sel?"#3C3489":"#5F5E5A",border:sel?"1px solid #AFA9EC":"1px solid #D3D1C7",borderRadius:20,fontWeight:sel?500:400}}>
                  {p!=="Todos"&&<Avatar name={p} size={22}/>}
                  <span>{p}</span>
                  {activos!==null&&<span style={{fontSize:11,fontWeight:500,minWidth:18,height:18,borderRadius:"50%",display:"inline-flex",alignItems:"center",justifyContent:"center",background:over?"#e24b4a":"#D3D1C7",color:over?"#fff":"#5F5E5A",marginLeft:2}}>{activos}</span>}
                </button>
              );
            })}
          </div>
          <div style={{display:"flex",gap:2}}>
            {[["kanban","Kanban"],["calendario","Calendario"],["dashboard","Dashboard"]].map(([id,lbl])=>(
              <button key={id} onClick={()=>setView(id)} style={{padding:"6px 14px",fontSize:12,cursor:"pointer",background:view===id?"#2C2C2A":"transparent",color:view===id?"#fff":"#5F5E5A",border:"1px solid "+(view===id?"#2C2C2A":"#D3D1C7"),borderRadius:6,fontWeight:view===id?500:400}}>{lbl}</button>
            ))}
          </div>
        </div>

        {/* KANBAN */}
        {view==="kanban"&&(
          <div>
            <div style={{fontSize:12,color:"#888",marginBottom:8,textAlign:"center"}}>Arrastra las tarjetas entre columnas para cambiar el estado</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12}}>
              {ESTADOS.map(estado=>{
                const st=ESTADO_STYLE[estado]; const cols=kanbanTasks(estado); const isOver=dragOver===estado;
                return (
                  <div key={estado} style={{borderRadius:12,overflow:"hidden",border:isOver?"2px solid "+st.hdr:"1px solid #D3D1C7"}}
                    onDragOver={e=>{e.preventDefault();setDragOver(estado);}} onDragLeave={()=>setDragOver(null)} onDrop={e=>onKanbanDrop(e,estado)}>
                    <div style={{background:st.hdr,padding:"10px 14px",display:"flex",alignItems:"center",gap:8}}>
                      <span style={{width:8,height:8,borderRadius:"50%",background:"rgba(255,255,255,0.6)",display:"inline-block"}}></span>
                      <span style={{fontSize:13,fontWeight:500,color:"#fff"}}>{estado}</span>
                      <span style={{marginLeft:"auto",background:"rgba(255,255,255,0.25)",color:"#fff",fontSize:11,padding:"1px 8px",borderRadius:20}}>{cols.length}</span>
                    </div>
                    <div style={{background:isOver?"rgba(255,255,255,0.6)":st.bg,padding:10,display:"flex",flexDirection:"column",gap:8,minHeight:140}}>
                      {isOver&&<div style={{border:"2px dashed "+st.hdr,borderRadius:8,height:48,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,color:st.hdr,opacity:.7}}>Soltar aquí</div>}
                      {cols.length===0&&!isOver&&<div style={{textAlign:"center",fontSize:12,color:"#888",padding:"24px 0",opacity:.5}}>Sin encargos</div>}
                      {cols.map(t=>(
                        <div key={t.id} draggable onDragStart={e=>onKanbanDragStart(e,t)} onDragEnd={()=>setDragOver(null)} onClick={()=>openEdit(t)}
                          style={{background:"#fff",borderRadius:8,padding:"10px 12px",cursor:"grab",border:"0.5px solid #D3D1C7",borderLeft:`3px solid ${PRI_STYLE[t.prioridad].border}`,userSelect:"none"}}>
                          <div style={{fontSize:12,fontWeight:500,marginBottom:6,lineHeight:1.4,color:"#2C2C2A"}}>{t.titulo}</div>
                          <div style={{fontSize:11,color:"#888",marginBottom:8,lineHeight:1.3}}>{t.descripcion}</div>
                          <div style={{display:"flex",alignItems:"center",gap:5,flexWrap:"wrap"}}>
                            <Avatar name={t.responsable} size={20}/><span style={{fontSize:11,color:"#5F5E5A"}}>{t.responsable}</span>
                            <Label text={t.prioridad} style={{...PRI_STYLE[t.prioridad],marginLeft:"auto"}}/>
                          </div>
                          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:7}}>
                            <Label text={t.tipo} style={TIPO_STYLE[t.tipo]||{}}/>
                            {t.vencimiento&&<span style={{fontSize:10,color:"#888"}}>Vence: {fmtDate(t.vencimiento)}</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* CALENDARIO */}
        {view==="calendario"&&(
          <div style={{background:"#fff",borderRadius:12,border:"0.5px solid #D3D1C7",overflow:"hidden"}}>
            <div style={{background:"#2C2C2A",padding:"12px 20px",display:"flex",alignItems:"center",gap:12}}>
              <button onClick={()=>setCalMonth(({y,m})=>m===0?{y:y-1,m:11}:{y,m:m-1})} style={{padding:"4px 12px",cursor:"pointer",background:"rgba(255,255,255,0.1)",color:"#fff",border:"none",borderRadius:6,fontSize:16}}>‹</button>
              <span style={{fontSize:15,fontWeight:500,color:"#fff",flex:1,textAlign:"center"}}>{monthNames[calMonth.m]} {calMonth.y}</span>
              <button onClick={()=>setCalMonth(({y,m})=>m===11?{y:y+1,m:0}:{y,m:m+1})} style={{padding:"4px 12px",cursor:"pointer",background:"rgba(255,255,255,0.1)",color:"#fff",border:"none",borderRadius:6,fontSize:16}}>›</button>
            </div>
            <div style={{padding:"8px 12px",background:"#f4f2ee",fontSize:12,color:"#888",textAlign:"center",borderBottom:"0.5px solid #D3D1C7"}}>Arrastra una tarea a otro día para reprogramarla · Clic para editar</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)"}}>
              {["Dom","Lun","Mar","Mié","Jue","Vie","Sáb"].map(d=>(
                <div key={d} style={{fontSize:11,color:"#5F5E5A",textAlign:"center",padding:"8px 0",fontWeight:500,borderBottom:"0.5px solid #D3D1C7",background:"#f9f8f6"}}>{d}</div>
              ))}
              {Array.from({length:firstDay(calMonth.y,calMonth.m)}).map((_,i)=>(
                <div key={"e"+i} style={{background:"#fafafa",borderBottom:"0.5px solid #D3D1C7",borderRight:"0.5px solid #D3D1C7",minHeight:90}}/>
              ))}
              {Array.from({length:daysInMonth(calMonth.y,calMonth.m)}).map((_,i)=>{
                const day=i+1; const dt=calTasks(day);
                const today=new Date(); const isToday=calMonth.y===today.getFullYear()&&calMonth.m===today.getMonth()&&day===today.getDate();
                const isOver=dragOver==="day-"+day;
                return (
                  <div key={day} onDragOver={e=>{e.preventDefault();setDragOver("day-"+day);}} onDragLeave={()=>setDragOver(null)} onDrop={e=>onCalDrop(e,day)}
                    style={{minHeight:90,background:isOver?"#EEEDFE":isToday?"#f0eeff":"#fff",borderBottom:"0.5px solid #D3D1C7",borderRight:"0.5px solid #D3D1C7",padding:"4px 5px",outline:isOver?"2px solid #534AB7":"none",outlineOffset:"-2px"}}>
                    <div style={{fontSize:11,fontWeight:isToday?500:400,color:isToday?"#534AB7":"#aaa",marginBottom:3,textAlign:"right"}}>{day}</div>
                    {dt.map(t=>(
                      <div key={t.id} draggable onDragStart={e=>onCalDragStart(e,t)} onDragEnd={()=>setDragOver(null)} onClick={()=>openEdit(t)}
                        style={{fontSize:10,background:t.estado==="Completado"?"#f4f2ee":PRI_STYLE[t.prioridad].bg,color:t.estado==="Completado"?"#aaa":PRI_STYLE[t.prioridad].color,borderLeft:`2px solid ${t.estado==="Completado"?"#B4B2A9":PRI_STYLE[t.prioridad].border}`,borderRadius:4,padding:"3px 5px",marginBottom:3,cursor:"grab",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",lineHeight:1.4,userSelect:"none",textDecoration:t.estado==="Completado"?"line-through":"none",opacity:t.estado==="Completado"?0.7:1}}>
                        <span style={{fontWeight:500}}>{initials(t.responsable)}</span> {t.titulo}
                      </div>
                    ))}
                  </div>
                );
              })}
              {(()=>{
                const totalCells=firstDay(calMonth.y,calMonth.m)+daysInMonth(calMonth.y,calMonth.m);
                const trailing=totalCells%7===0?0:7-(totalCells%7);
                const nextY=calMonth.m===11?calMonth.y+1:calMonth.y; const nextM=calMonth.m===11?0:calMonth.m+1;
                return Array.from({length:trailing}).map((_,i)=>{
                  const day=i+1; const ds=`${nextY}-${String(nextM+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`; const key="next-"+day; const isOver=dragOver===key;
                  const dt=tasks.filter(t=>t.vencimiento===ds&&(filterPerson==="Todos"||t.responsable===filterPerson));
                  return (
                    <div key={key} onDragOver={e=>{e.preventDefault();setDragOver(key);}} onDragLeave={()=>setDragOver(null)}
                      onDrop={e=>{e.preventDefault();setDragOver(null);if(!dragTask.current)return;updateField(dragTask.current.id,"vencimiento",ds);dragTask.current=null;setCalMonth({y:nextY,m:nextM});}}
                      style={{minHeight:90,background:isOver?"#EEEDFE":"#f7f6f2",borderBottom:"0.5px solid #D3D1C7",borderRight:"0.5px solid #D3D1C7",padding:"4px 5px",outline:isOver?"2px solid #534AB7":"none",outlineOffset:"-2px"}}>
                      <div style={{fontSize:11,color:"#ccc",marginBottom:3,textAlign:"right"}}>{day}</div>
                      {dt.map(t=>(
                        <div key={t.id} draggable onDragStart={e=>onCalDragStart(e,t)} onDragEnd={()=>setDragOver(null)} onClick={()=>openEdit(t)}
                          style={{fontSize:10,background:PRI_STYLE[t.prioridad].bg,color:PRI_STYLE[t.prioridad].color,borderLeft:`2px solid ${PRI_STYLE[t.prioridad].border}`,borderRadius:4,padding:"3px 5px",marginBottom:3,cursor:"grab",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",lineHeight:1.4,userSelect:"none"}}>
                          <span style={{fontWeight:500}}>{initials(t.responsable)}</span> {t.titulo}
                        </div>
                      ))}
                    </div>
                  );
                });
              })()}
            </div>
          </div>
        )}

        {/* DASHBOARD */}
        {view==="dashboard"&&(
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:10}}>
              {[
                {lbl:"Total",val:tasks.length,bg:"#2C2C2A"},
                {lbl:"Pendientes",val:tasks.filter(t=>t.estado==="Pendiente").length,bg:"#185FA5"},
                {lbl:"En proceso",val:tasks.filter(t=>t.estado==="En proceso").length,bg:"#854F0B"},
                {lbl:"En revisión",val:tasks.filter(t=>t.estado==="En revisión").length,bg:"#534AB7"},
                {lbl:"Completados",val:tasks.filter(t=>t.estado==="Completado").length,bg:"#3B6D11"},
              ].map(m=>(
                <div key={m.lbl} style={{background:m.bg,borderRadius:10,padding:"14px 16px"}}>
                  <div style={{fontSize:11,color:"rgba(255,255,255,0.7)",marginBottom:6}}>{m.lbl}</div>
                  <div style={{fontSize:28,fontWeight:500,color:"#fff"}}>{m.val}</div>
                </div>
              ))}
            </div>
            <div style={{background:"#fff",borderRadius:12,border:"0.5px solid #D3D1C7",overflow:"hidden"}}>
              <div style={{background:"#534AB7",padding:"10px 16px"}}><span style={{fontSize:13,fontWeight:500,color:"#fff"}}>Carga por persona</span></div>
              <div style={{padding:14,display:"flex",flexDirection:"column",gap:8}}>
                {TEAM.map(p=>{
                  const all=tasks.filter(t=>t.responsable===p);
                  const pend=all.filter(t=>t.estado==="Pendiente").length;
                  const proc=all.filter(t=>t.estado==="En proceso").length;
                  const rev=all.filter(t=>t.estado==="En revisión").length;
                  const comp=all.filter(t=>t.estado==="Completado").length;
                  const over=pend+proc+rev>=4; const pct=tasks.length?Math.round(all.length/tasks.length*100):0;
                  return (
                    <div key={p} style={{background:over?"#fcebeb":"#f4f2ee",borderRadius:8,padding:"10px 14px",border:over?"1px solid #f09595":"1px solid #D3D1C7"}}>
                      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
                        <Avatar name={p} size={32}/>
                        <div style={{flex:1}}>
                          <div style={{display:"flex",alignItems:"center",gap:6}}>
                            <span style={{fontSize:13,fontWeight:500}}>{p}</span>
                            {over&&<Label text="Sobrecarga" style={{background:"#fcebeb",color:"#a32d2d",border:"1px solid #f09595"}}/>}
                          </div>
                          <div style={{display:"flex",gap:6,marginTop:4,flexWrap:"wrap"}}>
                            {[["Pendiente",pend,"#185FA5"],["En proceso",proc,"#854F0B"],["En revisión",rev,"#534AB7"],["Completado",comp,"#3B6D11"]].map(([lbl,n,c])=>(
                              <span key={lbl} style={{fontSize:10,background:c,color:"#fff",padding:"1px 8px",borderRadius:20}}>{lbl}: {n}</span>
                            ))}
                          </div>
                        </div>
                        <div style={{textAlign:"right"}}>
                          <div style={{fontSize:22,fontWeight:500,color:over?"#a32d2d":"#2C2C2A"}}>{all.length}</div>
                          <div style={{fontSize:10,color:"#888"}}>{pct}% del total</div>
                        </div>
                      </div>
                      <div style={{background:"#D3D1C7",borderRadius:4,height:6,overflow:"hidden"}}>
                        <div style={{width:pct+"%",height:"100%",background:over?"#e24b4a":AVATAR_C[p]?.[0]||"#534AB7",borderRadius:4}}/>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div style={{background:"#fff",borderRadius:12,border:"0.5px solid #D3D1C7",overflow:"hidden"}}>
              <div style={{background:"#0F6E56",padding:"10px 16px"}}><span style={{fontSize:13,fontWeight:500,color:"#fff"}}>Análisis mensual con IA</span></div>
              <div style={{padding:"1rem 1.25rem"}}>
                <div style={{fontSize:13,color:"#5F5E5A",marginBottom:12}}>Evaluación de distribución de carga y recomendaciones del equipo.</div>
                <button onClick={getAiReport} disabled={aiLoading} style={{padding:"9px 18px",fontSize:13,cursor:aiLoading?"not-allowed":"pointer",background:aiLoading?"#D3D1C7":"#0F6E56",color:"#fff",border:"none",borderRadius:8,fontWeight:500}}>
                  {aiLoading?"Analizando...":"Generar análisis ↗"}
                </button>
                {aiReport&&<div style={{marginTop:14,fontSize:13,lineHeight:1.8,color:"#2C2C2A",background:"#f4f2ee",borderRadius:8,padding:"12px 14px",borderLeft:"3px solid #0F6E56",whiteSpace:"pre-wrap"}}>{aiReport}</div>}
              </div>
            </div>
          </div>
        )}

        {/* MODAL EQUIPO */}
        {modal==="form"&&(
          <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:100}} onClick={e=>e.target===e.currentTarget&&setModal(null)}>
            <div style={{background:"#fff",borderRadius:14,padding:"1.5rem",width:"100%",maxWidth:500,maxHeight:"92vh",overflowY:"auto",boxSizing:"border-box"}}>
              <div style={{background:editId?"#534AB7":"#185FA5",margin:"-1.5rem -1.5rem 1.25rem",padding:"14px 20px",borderRadius:"14px 14px 0 0",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                <span style={{fontSize:15,fontWeight:500,color:"#fff"}}>{editId?"Editar encargo":"Registrar nuevo encargo"}</span>
                <button onClick={()=>setModal(null)} style={{background:"rgba(255,255,255,0.2)",border:"none",color:"#fff",borderRadius:6,padding:"3px 10px",cursor:"pointer",fontSize:16}}>✕</button>
              </div>
              {[{lbl:"Título *",el:<input value={form.titulo} onChange={e=>setForm({...form,titulo:e.target.value})} placeholder="Descripción breve" style={{width:"100%",boxSizing:"border-box",padding:"7px 10px",border:"1px solid #D3D1C7",borderRadius:6}}/>},{lbl:"Descripción",el:<textarea value={form.descripcion} onChange={e=>setForm({...form,descripcion:e.target.value})} rows={2} style={{width:"100%",boxSizing:"border-box",padding:"7px 10px",border:"1px solid #D3D1C7",borderRadius:6,resize:"vertical"}}/>}].map(({lbl,el})=>(
                <div key={lbl} style={{marginBottom:12}}><div style={{fontSize:12,fontWeight:500,color:"#5F5E5A",marginBottom:4}}>{lbl}</div>{el}</div>
              ))}
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
                {[{lbl:"Responsable",field:"responsable",opts:TEAM},{lbl:"Tipo",field:"tipo",opts:TIPOS},{lbl:"Prioridad",field:"prioridad",opts:PRIORIDADES},{lbl:"Estado",field:"estado",opts:ESTADOS}].map(({lbl,field,opts})=>(
                  <div key={field}><div style={{fontSize:12,fontWeight:500,color:"#5F5E5A",marginBottom:4}}>{lbl}</div><select value={form[field]} onChange={e=>setForm({...form,[field]:e.target.value})} style={{width:"100%",padding:"7px 10px",border:"1px solid #D3D1C7",borderRadius:6,boxSizing:"border-box"}}>{opts.map(o=><option key={o}>{o}</option>)}</select></div>
                ))}
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:"1.25rem"}}>
                {[["Fecha inicio","inicio"],["Fecha vencimiento","vencimiento"]].map(([lbl,field])=>(
                  <div key={field}><div style={{fontSize:12,fontWeight:500,color:"#5F5E5A",marginBottom:4}}>{lbl}</div><input type="date" value={form[field]} onChange={e=>setForm({...form,[field]:e.target.value})} style={{width:"100%",padding:"7px 10px",border:"1px solid #D3D1C7",borderRadius:6,boxSizing:"border-box"}}/></div>
                ))}
              </div>
              <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
                {editId&&<button onClick={()=>{if(window.confirm("¿Eliminar?"))deleteTask(editId);}} style={{marginRight:"auto",color:"#a32d2d",background:"#fcebeb",border:"1px solid #f09595",padding:"8px 14px",fontSize:13,cursor:"pointer",borderRadius:7}}>Eliminar</button>}
                <button onClick={()=>setModal(null)} style={{padding:"8px 16px",fontSize:13,cursor:"pointer",borderRadius:7,border:"1px solid #D3D1C7",background:"#fff"}}>Cancelar</button>
                <button onClick={saveTask} style={{padding:"8px 18px",fontSize:13,cursor:"pointer",borderRadius:7,background:editId?"#534AB7":"#185FA5",color:"#fff",border:"none",fontWeight:500}}>{editId?"Guardar cambios":"Registrar encargo"}</button>
              </div>
            </div>
          </div>
        )}
      </>)}

      {/* ══ MÓDULO SIDE HUSTLES ══ */}
      {module==="sidehustles"&&(<>
        <div style={{background:"#fff",borderRadius:10,padding:"10px 14px",marginBottom:12,display:"flex",alignItems:"center",gap:6,flexWrap:"wrap",border:"0.5px solid #D3D1C7"}}>
          <span style={{fontSize:12,color:"#888",marginRight:4}}>Categoría:</span>
          {["Todas",...SH_CATEGORIAS].map(c=>{
            const sel=shFilter===c;
            return <button key={c} onClick={()=>setShFilter(c)} style={{padding:"5px 12px",fontSize:12,cursor:"pointer",background:sel?"#0F6E56":"transparent",color:sel?"#fff":"#5F5E5A",border:sel?"1px solid #0F6E56":"1px solid #D3D1C7",borderRadius:20,fontWeight:sel?500:400}}>{c}</button>;
          })}
          <span style={{marginLeft:"auto",fontSize:12,color:"#888"}}>{shTasks.filter(t=>t.estado!=="Completado").length} activos · {shTasks.filter(t=>t.estado==="Completado").length} completados</span>
        </div>
        <div style={{fontSize:12,color:"#888",marginBottom:8,textAlign:"center"}}>Arrastra las tarjetas entre columnas para cambiar el estado</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12}}>
          {SH_ESTADOS.map(estado=>{
            const st=SH_ESTADO_STYLE[estado]; const cols=shKanbanTasks(estado); const isOver=shDragOver===estado;
            return (
              <div key={estado} style={{borderRadius:12,overflow:"hidden",border:isOver?"2px solid "+st.hdr:"1px solid #D3D1C7"}}
                onDragOver={e=>{e.preventDefault();setShDragOver(estado);}} onDragLeave={()=>setShDragOver(null)} onDrop={e=>onShDrop(e,estado)}>
                <div style={{background:st.hdr,padding:"10px 14px",display:"flex",alignItems:"center",gap:8}}>
                  <span style={{width:8,height:8,borderRadius:"50%",background:"rgba(255,255,255,0.6)",display:"inline-block"}}></span>
                  <span style={{fontSize:13,fontWeight:500,color:"#fff"}}>{estado}</span>
                  <span style={{marginLeft:"auto",background:"rgba(255,255,255,0.25)",color:"#fff",fontSize:11,padding:"1px 8px",borderRadius:20}}>{cols.length}</span>
                </div>
                <div style={{background:isOver?"rgba(255,255,255,0.6)":st.bg,padding:10,display:"flex",flexDirection:"column",gap:8,minHeight:160}}>
                  {isOver&&<div style={{border:"2px dashed "+st.hdr,borderRadius:8,height:48,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,color:st.hdr,opacity:.7}}>Soltar aquí</div>}
                  {cols.length===0&&!isOver&&<div style={{textAlign:"center",fontSize:12,color:"#888",padding:"24px 0",opacity:.5}}>Sin proyectos</div>}
                  {cols.map(t=>(
                    <div key={t.id} draggable onDragStart={e=>onShDragStart(e,t)} onDragEnd={()=>setShDragOver(null)} onClick={()=>shOpenEdit(t)}
                      style={{background:"#fff",borderRadius:8,padding:"10px 12px",cursor:"grab",border:"0.5px solid #D3D1C7",borderLeft:`3px solid ${PRI_STYLE[t.prioridad].border}`,userSelect:"none",opacity:t.estado==="Completado"?0.7:1}}>
                      <div style={{fontSize:12,fontWeight:500,marginBottom:5,lineHeight:1.4,color:"#2C2C2A",textDecoration:t.estado==="Completado"?"line-through":"none"}}>{t.titulo}</div>
                      <div style={{fontSize:11,color:"#888",marginBottom:7,lineHeight:1.3}}>{t.descripcion}</div>
                      {t.notas&&<div style={{fontSize:10,color:"#534AB7",background:"#EEEDFE",borderRadius:4,padding:"2px 6px",marginBottom:7}}>{t.notas}</div>}
                      <div style={{display:"flex",alignItems:"center",gap:5,flexWrap:"wrap"}}>
                        <Label text={t.categoria} style={CAT_STYLE[t.categoria]||{}}/>
                        <Label text={t.prioridad} style={{...PRI_STYLE[t.prioridad],marginLeft:"auto"}}/>
                      </div>
                      {t.vencimiento&&<div style={{fontSize:10,color:"#888",marginTop:5}}>Meta: {fmtDate(t.vencimiento)}</div>}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* MODAL SIDE HUSTLES */}
        {shModal==="form"&&(
          <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:100}} onClick={e=>e.target===e.currentTarget&&setShModal(null)}>
            <div style={{background:"#fff",borderRadius:14,padding:"1.5rem",width:"100%",maxWidth:500,maxHeight:"92vh",overflowY:"auto",boxSizing:"border-box"}}>
              <div style={{background:shEditId?"#0F6E56":"#3B6D11",margin:"-1.5rem -1.5rem 1.25rem",padding:"14px 20px",borderRadius:"14px 14px 0 0",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                <span style={{fontSize:15,fontWeight:500,color:"#fff"}}>{shEditId?"Editar proyecto":"Nuevo proyecto / side hustle"}</span>
                <button onClick={()=>setShModal(null)} style={{background:"rgba(255,255,255,0.2)",border:"none",color:"#fff",borderRadius:6,padding:"3px 10px",cursor:"pointer",fontSize:16}}>✕</button>
              </div>
              {[{lbl:"Título *",el:<input value={shForm.titulo} onChange={e=>setShForm({...shForm,titulo:e.target.value})} placeholder="Nombre del proyecto" style={{width:"100%",boxSizing:"border-box",padding:"7px 10px",border:"1px solid #D3D1C7",borderRadius:6}}/>},{lbl:"Descripción",el:<textarea value={shForm.descripcion} onChange={e=>setShForm({...shForm,descripcion:e.target.value})} rows={2} style={{width:"100%",boxSizing:"border-box",padding:"7px 10px",border:"1px solid #D3D1C7",borderRadius:6,resize:"vertical"}}/>},{lbl:"Notas",el:<input value={shForm.notas} onChange={e=>setShForm({...shForm,notas:e.target.value})} placeholder="Ej: coordinar con Roberto" style={{width:"100%",boxSizing:"border-box",padding:"7px 10px",border:"1px solid #D3D1C7",borderRadius:6}}/>}].map(({lbl,el})=>(
                <div key={lbl} style={{marginBottom:12}}><div style={{fontSize:12,fontWeight:500,color:"#5F5E5A",marginBottom:4}}>{lbl}</div>{el}</div>
              ))}
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:"1.25rem"}}>
                {[{lbl:"Categoría",field:"categoria",opts:SH_CATEGORIAS},{lbl:"Prioridad",field:"prioridad",opts:SH_PRIORIDADES},{lbl:"Estado",field:"estado",opts:SH_ESTADOS}].map(({lbl,field,opts})=>(
                  <div key={field}><div style={{fontSize:12,fontWeight:500,color:"#5F5E5A",marginBottom:4}}>{lbl}</div><select value={shForm[field]} onChange={e=>setShForm({...shForm,[field]:e.target.value})} style={{width:"100%",padding:"7px 10px",border:"1px solid #D3D1C7",borderRadius:6,boxSizing:"border-box"}}>{opts.map(o=><option key={o}>{o}</option>)}</select></div>
                ))}
                <div><div style={{fontSize:12,fontWeight:500,color:"#5F5E5A",marginBottom:4}}>Fecha objetivo</div><input type="date" value={shForm.vencimiento} onChange={e=>setShForm({...shForm,vencimiento:e.target.value})} style={{width:"100%",padding:"7px 10px",border:"1px solid #D3D1C7",borderRadius:6,boxSizing:"border-box"}}/></div>
              </div>
              <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
                {shEditId&&<button onClick={()=>{if(window.confirm("¿Eliminar?"))shDeleteTask(shEditId);}} style={{marginRight:"auto",color:"#a32d2d",background:"#fcebeb",border:"1px solid #f09595",padding:"8px 14px",fontSize:13,cursor:"pointer",borderRadius:7}}>Eliminar</button>}
                <button onClick={()=>setShModal(null)} style={{padding:"8px 16px",fontSize:13,cursor:"pointer",borderRadius:7,border:"1px solid #D3D1C7",background:"#fff"}}>Cancelar</button>
                <button onClick={shSaveTask} style={{padding:"8px 18px",fontSize:13,cursor:"pointer",borderRadius:7,background:shEditId?"#0F6E56":"#3B6D11",color:"#fff",border:"none",fontWeight:500}}>{shEditId?"Guardar cambios":"Agregar proyecto"}</button>
              </div>
            </div>
          </div>
        )}
      </>)}
    </div>
  );
}