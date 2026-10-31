/* Meine bunte Welt – v1.1.0. Komplett offline, ohne externe Bibliotheken oder Tracker. */
'use strict';
const app=document.getElementById('app');
const modalRoot=document.getElementById('modal-root');
const toastElement=document.getElementById('toast');
const COLORS=[['Rot','#F16A79'],['Orange','#F5A35D'],['Gelb','#F7D05D'],['Grün','#70C49B'],['Blau','#6AABEE'],['Lila','#AB8EE5'],['Rosa','#F49DC1'],['Braun','#AA7B5E'],['Schwarz','#455166'],['Weiß','#FFFFFF']];
const SHAPECOLORS=[['Rot','#F16A79'],['Blau','#6AABEE'],['Gelb','#F7D05D'],['Grün','#70C49B'],['Lila','#AB8EE5']];
const SHAPES=[['Kreis','circle'],['Quadrat','square'],['Dreieck','triangle'],['Herz','heart']];
const ANIMALS=[['Kuh','🐮','Muh!'],['Schaf','🐑','Mäh!'],['Hund','🐶','Wuff!'],['Katze','🐱','Miau!'],['Ente','🦆','Quak!'],['Pferd','🐴','Wieher!']];
const FOOD=[['Hase','🐰','🥕',['🥕','🍋','🍕']],['Affe','🐵','🍌',['🍎','🍌','🧀']],['Kuh','🐮','🌿',['🍪','🌿','🍓']],['Katze','🐱','🐟',['🥦','🐟','🍌']]];
const CATEGORIES={paint:{title:'Malen & Ausmalen',subtitle:'Hier kannst du richtig kreativ sein!',activities:[['draw','Freies Malen','🎨','Male mit vielen bunten Farben.'],['color','Ausmalbilder','🦋','Bunte Bilder mit Fingertipps ausmalen.']]},play:{title:'Kleine Spiele',subtitle:'Tippen, staunen und ausprobieren.',activities:[['shapes','Farben & Formen','🔴','Finde die richtige Form.'],['puzzle','Tier-Puzzle','🧩','Setze das Tier wieder zusammen.'],['mix','Farben mischen','🌈','Was passiert mit zwei Farben?'],['bubbles','Seifenblasen','🫧','Lass die Blasen platzen.'],['food','Tiere füttern','🥕','Was frisst welches Tier?']]},explore:{title:'Entdeckerwelt',subtitle:'Tiere und Natur entdecken.',activities:[['animals','Tiergeräusche','🐮','Wer macht Muh und wer macht Miau?'],['garden','Mein kleiner Garten','🌷','Lass Blumen wachsen.'],['stars','Sterne leuchten','🌟','Ein ruhiger Sternenhimmel zum Entdecken.']]}};
const store={
  get(k,fallback=null){try{let v=localStorage.getItem('bw-'+k);return v===null?fallback:JSON.parse(v);}catch{return fallback;}},
  set(k,v){try{localStorage.setItem('bw-'+k,JSON.stringify(v));return true;}catch{return false;}}
};
let settings=Object.assign({sound:true,quiet:false,easy:true,childName:'',ageBand:'2',theme:'sun',fullscreenDefault:true},store.get('settings',{}));
const ACTIVITY_PAGES=new Set(['draw','color','shapes','puzzle','mix','bubbles','food','animals','garden','stars']);
let immersiveActive=store.get('immersive-active',settings.fullscreenDefault);
function applyTheme(){document.body.dataset.theme=['sun','mint','ocean'].includes(settings.theme)?settings.theme:'sun';}
applyTheme();
function syncImmersive(){
 const onStage=ACTIVITY_PAGES.has(activePage);
 document.body.classList.toggle('focus-mode',onStage&&immersiveActive);
 document.body.classList.toggle('focus-tools-open',false);
 const toggle=document.getElementById('focus-toggle');
 if(toggle){toggle.textContent=immersiveActive?'⛶ Normal':'⛶ Groß';toggle.setAttribute('aria-label',immersiveActive?'Zur normalen Spielansicht':'Spielfläche vergrößern');}
}
function toggleImmersive(){immersiveActive=!immersiveActive;store.set('immersive-active',immersiveActive);syncImmersive();}

let activePage='home', currentCategory='paint', cleanup=[],toastTimer=null,audioCtx=null;
let draftWriteQueue=Promise.resolve();
function writeDraftInOrder(pic){const task=draftWriteQueue.catch(()=>{}).then(()=>putPic(pic));draftWriteQueue=task.catch(()=>{});return task;}

function esc(s){return String(s).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));}
function on(id,event,fn){const el=document.getElementById(id);if(el)el.addEventListener(event,fn);return el;}
function toast(s){toastElement.textContent=s;toastElement.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>toastElement.classList.remove('show'),1900);}
function beep(kind='happy'){
  if(!settings.sound||settings.quiet)return;
  try{
    audioCtx=audioCtx||new(window.AudioContext||window.webkitAudioContext)();
    if(audioCtx.state==='suspended')audioCtx.resume();
    const now=audioCtx.currentTime;let notes=kind==='pop'?[650]:kind==='no'?[300]:[480,650,820];
    notes.forEach((f,i)=>{const osc=audioCtx.createOscillator(),gain=audioCtx.createGain(),t=now+i*.095;osc.type='sine';osc.frequency.setValueAtTime(f,t);gain.gain.setValueAtTime(.0001,t);gain.gain.exponentialRampToValueAtTime(kind==='pop'?.04:.075,t+.018);gain.gain.exponentialRampToValueAtTime(.0001,t+.15);osc.connect(gain);gain.connect(audioCtx.destination);osc.start(t);osc.stop(t+.17);});
  }catch{}
}
function speak(text){if(!settings.sound||settings.quiet||!('speechSynthesis' in window))return;try{window.speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang='de-DE';u.rate=.85;u.pitch=1.1;window.speechSynthesis.speak(u);}catch{}}
function dispose(){cleanup.splice(0).forEach(fn=>{try{fn();}catch{}});try{window.speechSynthesis?.cancel();}catch{}}
function route(page,cat){dispose();activePage=page;if(cat)currentCategory=cat;modalRoot.replaceChildren();render();window.scrollTo(0,0);}
function heading(title,subtitle){return `<div class="page-intro"><h1>${title}</h1><p>${subtitle}</p></div>`;}
function topbar(back='home'){
 const focus=ACTIVITY_PAGES.has(activePage)?'<button class="round-btn focus-toggle" id="focus-toggle" aria-label="Spielfläche vergrößern">⛶ Groß</button>':'';
 return `<header class="topbar"><button class="home-link" id="back" aria-label="Zurück"><span class="round-btn" aria-hidden="true">←</span><span>Zurück</span></button><div class="topbar-actions">${focus}<button class="round-btn" id="parent" aria-label="Elternbereich" title="Elternbereich">⚙️</button></div></header>`;
}
function wireTop(back='home'){on('back','click',()=>route(back));on('parent','click',openParentGate);on('focus-toggle','click',toggleImmersive);}
function home(){
 const greeting=settings.childName?`Hallo, ${esc(settings.childName)}! Was möchtest du machen?`:'Was möchtest du heute machen?';
 app.innerHTML=`<header class="topbar"><div class="brand"><span class="brand-icon">🌈</span>Meine bunte Welt</div><button class="round-btn" id="parent" title="Elternbereich" aria-label="Elternbereich">⚙️</button></header>
  <div class="hero"><div class="hero-text"><h1>${greeting}</h1><p>Hier gibt es so viel Schönes zu entdecken!</p></div><div class="hero-art" aria-hidden="true">🦄</div></div>
  <h2 class="section-heading">Such dir etwas aus!</h2><div class="tile-grid">
  <button class="tile paint" id="go-paint"><span class="emoji" aria-hidden="true">🎨</span><span><span class="tile-title">Malen</span><span class="tile-caption">Bunte Kunstwerke zaubern</span></span></button>
  <button class="tile play" id="go-play"><span class="emoji" aria-hidden="true">🧩</span><span><span class="tile-title">Spielen</span><span class="tile-caption">Lustige kleine Spiele</span></span></button>
  <button class="tile explore" id="go-explore"><span class="emoji" aria-hidden="true">🐣</span><span><span class="tile-title">Entdecken</span><span class="tile-caption">Tiere, Blumen und vieles mehr</span></span></button>
  </div><button class="gallery-link" id="gallery"><span>🖼️ Meine Bilder</span><span aria-hidden="true">›</span></button>
  <div class="footer-note">Mit Liebe gemacht · Ohne Werbung · Funktioniert offline</div>`;
  on('parent','click',openParentGate);['paint','play','explore'].forEach(cat=>on('go-'+cat,'click',()=>route('category',cat)));on('gallery','click',()=>route('gallery'));
}
function category(){const c=CATEGORIES[currentCategory];app.innerHTML=topbar()+heading(c.title,c.subtitle)+`<div class="activity-grid">${c.activities.map(([id,name,emoji,desc])=>`<button class="activity-card" data-activity="${id}"><span class="emoji" aria-hidden="true">${emoji}</span><span><strong>${name}</strong><small>${desc}</small></span></button>`).join('')}</div>`;wireTop('home');app.querySelectorAll('[data-activity]').forEach(b=>b.addEventListener('click',()=>route(b.dataset.activity)));}
function frame(title,subtitle,content,back='category'){
 const immersiveControls=ACTIVITY_PAGES.has(activePage)?'<div class="focus-float"><button id="focus-exit" aria-label="Zurück zur Spielauswahl">← Zurück</button><button id="focus-tool" aria-label="Malwerkzeuge einblenden">⚙ Werkzeuge</button><button id="focus-normal" aria-label="Vollbild ausschalten">↙ Normal</button></div>':'';
 app.innerHTML=topbar()+heading(title,subtitle)+immersiveControls+content;
 wireTop(back);
 on('focus-exit','click',()=>route(back));
 on('focus-normal','click',toggleImmersive);
 on('focus-tool','click',()=>document.body.classList.toggle('focus-tools-open'));
}
function palette(active,handler){return `<div class="palette" role="group" aria-label="Wähle eine Farbe">${COLORS.map(([name,hex])=>`<button class="color-dot ${active===hex?'active':''}" data-color="${hex}" style="background:${hex}" aria-label="${name}" title="${name}" aria-pressed="${active===hex}"></button>`).join('')}</div>`;}
function bindPalette(selected,onChoose){app.querySelectorAll('[data-color]').forEach(b=>b.addEventListener('click',()=>{selected.value=b.dataset.color;app.querySelectorAll('[data-color]').forEach(x=>{x.classList.toggle('active',x===b);x.setAttribute('aria-pressed',String(x===b));});onChoose?.(selected.value);beep('pop');}));}

/* IndexedDB speichert Entwürfe und Galerie dauerhaft im Browser, soweit iPadOS dies zulässt. */
let dbPromise;
function db(){if(dbPromise)return dbPromise;dbPromise=new Promise((resolve,reject)=>{if(!window.indexedDB){reject(new Error('IndexedDB fehlt'));return;}let req=indexedDB.open('meine-bunte-welt',1);req.onupgradeneeded=()=>{if(!req.result.objectStoreNames.contains('pictures'))req.result.createObjectStore('pictures',{keyPath:'id'});};req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);});return dbPromise;}
async function dbCall(type,mode='readonly',arg){let database=await db();return new Promise((resolve,reject)=>{let tx=database.transaction('pictures',mode),os=tx.objectStore('pictures'),req=type==='get'?os.get(arg):type==='all'?os.getAll():type==='put'?os.put(arg):os.delete(arg);req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);});}
const getPic=id=>dbCall('get','readonly',id),allPics=()=>dbCall('all'),putPic=obj=>dbCall('put','readwrite',obj),delPic=id=>dbCall('delete','readwrite',id);
function downloadData(data,filename){const a=document.createElement('a');a.href=data;a.download=filename;document.body.append(a);a.click();a.remove();}
function crc32(bytes){let crc=-1;for(const b of bytes){crc^=b;for(let i=0;i<8;i++)crc=(crc>>>1)^((crc&1)?0xEDB88320:0);}return (crc^(-1))>>>0;}
function zipPictures(pictures){
 // Kleine ZIP-Implementierung ohne Bibliotheken: PNG-Daten sind bereits komprimiert.
 const enc=new TextEncoder(),chunks=[],central=[];let offset=0;
 const push=(a)=>{chunks.push(a);offset+=a.length;};
 function header(size){const b=new Uint8Array(size);return [b,new DataView(b.buffer)];}
 pictures.forEach((pic,index)=>{
   const name=enc.encode(`kunstwerk-${String(index+1).padStart(2,'0')}-${pic.created}.png`);
   const raw=atob(pic.data.split(',')[1]),bytes=Uint8Array.from(raw,ch=>ch.charCodeAt(0));
   const crc=crc32(bytes),start=offset;
   let [head,h]=header(30);h.setUint32(0,0x04034b50,true);h.setUint16(4,20,true);h.setUint16(8,0,true);h.setUint32(14,crc,true);h.setUint32(18,bytes.length,true);h.setUint32(22,bytes.length,true);h.setUint16(26,name.length,true);
   push(head);push(name);push(bytes);
   let [c,v]=header(46);v.setUint32(0,0x02014b50,true);v.setUint16(4,20,true);v.setUint16(6,20,true);v.setUint32(16,crc,true);v.setUint32(20,bytes.length,true);v.setUint32(24,bytes.length,true);v.setUint16(28,name.length,true);v.setUint32(42,start,true);
   central.push(c,name);
 });
 const centralStart=offset;central.forEach(push);let [end,v]=header(22);v.setUint32(0,0x06054b50,true);v.setUint16(8,pictures.length,true);v.setUint16(10,pictures.length,true);v.setUint32(12,offset-centralStart,true);v.setUint32(16,centralStart,true);push(end);
 return new Blob(chunks,{type:'application/zip'});
}
function downloadBlob(blob,name){let url=URL.createObjectURL(blob);downloadData(url,name);setTimeout(()=>URL.revokeObjectURL(url),60000);} 
function saveToGallery(data,label){let id='img-'+Date.now()+'-'+Math.floor(Math.random()*9999);return putPic({id,type:'gallery',label,created:Date.now(),data}).then(()=>{toast('Bild gespeichert! 🌟');beep();}).catch(()=>toast('Speichern leider nicht möglich.'));}
function confirmBox(title,message,yesLabel,onConfirm){
 modalRoot.innerHTML=`<div class="modal-backdrop"><section class="dialog" role="dialog" aria-modal="true" aria-labelledby="dialog-title"><h2 id="dialog-title">${esc(title)}</h2><p>${esc(message)}</p><div class="dialog-actions"><button class="tool-btn" id="cancel-modal">Zurück</button><button class="tool-btn primary" id="ok-modal">${esc(yesLabel)}</button></div></section></div>`;
 on('cancel-modal','click',()=>modalRoot.replaceChildren());on('ok-modal','click',()=>{modalRoot.replaceChildren();onConfirm();});
}

/* Malstudio */
function draw(){
 const selected={value:COLORS[0][1]},pen={size:18,mode:'pen'};
 frame('Meine Malwerkstatt','Male einfach mit deinem Finger – ganz wie du möchtest!',`<div class="panel"><div class="paint-tools"><div>${palette(selected.value)}</div></div><details class="advanced-tools"><summary>✨ Weitere Malwerkzeuge</summary><div class="toolbar"><button class="tool-btn active" id="pen" aria-pressed="true">🖌️ Pinsel</button><button class="tool-btn" id="rainbow" aria-pressed="false">🌈 Zauber</button><button class="tool-btn" id="eraser" aria-pressed="false">🧽 Radieren</button><button class="tool-btn" id="stamp" aria-pressed="false">⭐ Sterne</button></div><div class="toolbar" style="margin-bottom:15px"><span class="tool-label">Pinselgröße</span><button class="tool-btn" data-size="7">Klein</button><button class="tool-btn active" data-size="18">Mittel</button><button class="tool-btn" data-size="37">Groß</button></div></details><div class="drawing-surface"><canvas id="canvas" width="1200" height="900" aria-label="Malfläche"></canvas></div><div class="toolbar" style="margin-top:16px"><button class="tool-btn soft" id="undo">↶ Rückgängig</button><button class="tool-btn soft" id="new-paper">📄 Neues Blatt</button><button class="tool-btn primary" id="save">💛 In meine Bilder</button></div><p class="paint-hint" id="draft-status" role="status">Entwurf wird geladen …</p></div>`);
 bindPalette(selected,()=>{if(pen.mode==='eraser'){pen.mode='pen';markMode();}});
 let canvas=document.getElementById('canvas'),ctx=canvas.getContext('2d',{willReadFrequently:false});
 const background=()=>{ctx.fillStyle='white';ctx.fillRect(0,0,canvas.width,canvas.height);};background();
 const history=[];let painting=false,last=null,dirty=false,saveTimer=null,loaded=false,editVersion=0,activePointer=null;
 const saveLabel=()=>document.getElementById('draft-status');
 function snapshot(){history.push(canvas.toDataURL('image/png'));if(history.length>10)history.shift();}
 function autosave(){
   if(!loaded||!dirty)return Promise.resolve();
   clearTimeout(saveTimer);saveTimer=null;
   const revision=editVersion;
   let data;
   try{data=canvas.toDataURL('image/png');}catch{toast('Entwurf konnte nicht gelesen werden.');return Promise.resolve();}
   const promise=writeDraftInOrder({id:'draft',type:'draft',data,created:Date.now()});
   promise.then(()=>{if(editVersion===revision){dirty=false;const label=saveLabel();if(label)label.textContent='✓ Entwurf gespeichert';}})
     .catch(()=>{const label=saveLabel();if(label)label.textContent='Speicherung fehlgeschlagen';toast('Speichern nicht möglich – Speicherplatz prüfen.');});
   return promise;
 }
 function scheduleSave(delay=900){
   dirty=true;editVersion++;
   const label=saveLabel();if(label)label.textContent='Entwurf wird gespeichert …';
   if(saveTimer===null)saveTimer=setTimeout(()=>{saveTimer=null;autosave();if(painting && dirty)scheduleContinuedSave();},delay);
 }
 function scheduleContinuedSave(){if(painting && saveTimer===null)saveTimer=setTimeout(()=>{saveTimer=null;autosave();scheduleContinuedSave();},1200);}
 function saveNow(){clearTimeout(saveTimer);saveTimer=null;return autosave();}
 function onHidden(){if(document.visibilityState==='hidden')saveNow();}
 document.addEventListener('visibilitychange',onHidden);
 window.addEventListener('pagehide',saveNow);
 // Der Entwurf wird zuerst geladen. Eingaben währenddessen bleiben gesperrt.
 canvas.style.opacity='.75';
 getPic('draft').then(saved=>new Promise(resolve=>{
   if(!saved?.data){resolve();return;}let img=new Image();img.onload=()=>{ctx.drawImage(img,0,0,canvas.width,canvas.height);resolve();};img.onerror=resolve;img.src=saved.data;
 })).catch(()=>{}).finally(()=>{loaded=true;canvas.style.opacity='1';const label=saveLabel();if(label)label.textContent='✓ Dein Entwurf ist bereit';});
 function pos(e){let r=canvas.getBoundingClientRect();return{x:(e.clientX-r.left)*canvas.width/r.width,y:(e.clientY-r.top)*canvas.height/r.height};}
 function markMode(){['pen','rainbow','eraser','stamp'].forEach(id=>{let b=document.getElementById(id),a=pen.mode===id;b.classList.toggle('active',a);b.setAttribute('aria-pressed',String(a));});}
 function markSize(){app.querySelectorAll('[data-size]').forEach(b=>b.classList.toggle('active',Number(b.dataset.size)===pen.size));}
 function dot(p){ctx.beginPath();ctx.arc(p.x,p.y,pen.size/2,0,Math.PI*2);ctx.fillStyle=pen.mode==='eraser'?'white':pen.mode==='rainbow'?'#ed7ab0':selected.value;ctx.fill();}
 function star(p){const n=5,outer=pen.size*2.4,inner=outer*.44;ctx.beginPath();for(let i=0;i<n*2;i++){let angle=(Math.PI*i/n)-Math.PI/2,r=i%2?inner:outer,x=p.x+r*Math.cos(angle),y=p.y+r*Math.sin(angle);i?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.closePath();ctx.fillStyle=selected.value;ctx.fill();}
 function stroke(p,q){ctx.beginPath();ctx.moveTo(q.x,q.y);ctx.lineTo(p.x,p.y);ctx.lineCap='round';ctx.lineJoin='round';ctx.lineWidth=pen.size;ctx.strokeStyle=pen.mode==='eraser'?'#fff':pen.mode==='rainbow'?`hsl(${((p.x+p.y)*.55)%360} 90% 67%)`:selected.value;ctx.stroke();}
 canvas.addEventListener('pointerdown',e=>{if(!loaded||activePointer!==null||e.pointerType==='mouse'&&e.button!==0)return;e.preventDefault();activePointer=e.pointerId;snapshot();painting=true;last=pos(e);try{canvas.setPointerCapture(e.pointerId);}catch{}if(pen.mode==='stamp')star(last);else dot(last);scheduleSave();});
 canvas.addEventListener('pointermove',e=>{if(!painting||e.pointerId!==activePointer)return;e.preventDefault();let p=pos(e);if(pen.mode==='stamp'){if(Math.hypot(p.x-last.x,p.y-last.y)>pen.size*4){star(p);last=p;}}else{stroke(p,last);last=p;}dirty=true;editVersion++;});
 const finish=e=>{if(!painting||e.pointerId!==activePointer)return;painting=false;activePointer=null;saveNow();};canvas.addEventListener('pointerup',finish);canvas.addEventListener('pointercancel',finish);canvas.addEventListener('lostpointercapture',finish);
 ['pen','rainbow','eraser','stamp'].forEach(id=>on(id,'click',()=>{pen.mode=id;markMode();}));app.querySelectorAll('[data-size]').forEach(b=>b.addEventListener('click',()=>{pen.size=Number(b.dataset.size);markSize();}));
 on('undo','click',()=>{if(!loaded)return;let old=history.pop();if(!old){toast('Noch nichts zum Rückgängigmachen.');return;}let img=new Image();img.onload=()=>{ctx.clearRect(0,0,canvas.width,canvas.height);ctx.drawImage(img,0,0);scheduleSave();};img.src=old;});
 on('new-paper','click',()=>confirmBox('Neues Blatt?','Dein aktueller Entwurf wird durch ein leeres Blatt ersetzt. Gespeicherte Bilder bleiben erhalten.','Ja, neues Blatt',()=>{snapshot();background();scheduleSave();}));
 on('save','click',()=>{if(!loaded)return;saveToGallery(canvas.toDataURL('image/png'),'Mein Kunstwerk');});
 cleanup.push(()=>{clearTimeout(saveTimer);document.removeEventListener('visibilitychange',onHidden);window.removeEventListener('pagehide',saveNow);if(dirty)autosave();});
}

/* Tap-to-fill SVG-Ausmalbilder */
function part(tag,attrs,key,state){return `<${tag} ${attrs} data-colorpart="${key}" fill="${state[key]||'#ffffff'}" stroke="#55647A" stroke-width="6" stroke-linejoin="round" stroke-linecap="round" />`;}
function templateSvg(which,state){
 const bg=`<rect x="0" y="0" width="720" height="480" rx="28" fill="#f4fbff"/>`;
 let s='';
 if(which==='fish')s=`<path d="M 32 388 Q 250 360 460 392 T 710 378" fill="none" stroke="#b5e2f1" stroke-width="13"/><circle cx="102" cy="130" r="17" fill="none" stroke="#a7d6ed" stroke-width="5"/><circle cx="130" cy="93" r="10" fill="none" stroke="#a7d6ed" stroke-width="4"/>${part('path','d="M 216 225 L 70 128 L 70 335 Z"','tail',state)}${part('path','d="M 298 169 L 368 63 L 422 181 Z"','top',state)}${part('ellipse','cx="396" cy="241" rx="194" ry="112"','body',state)}${part('path','d="M 376 270 Q 433 336 496 293 Q 435 267 376 270 Z"','fin',state)}<circle cx="504" cy="220" r="17" fill="#55647a"/><circle cx="510" cy="214" r="6" fill="white"/><path d="M 545 268 Q 568 277 582 255" fill="none" stroke="#55647a" stroke-width="6" stroke-linecap="round"/>`;
 if(which==='flower')s=`<path d="M 0 403 Q 180 355 340 400 T 720 392 L 720 480 L 0 480" fill="#d8efd1"/>${part('circle','cx="85" cy="95" r="44"','sun',state)}<path d="M 358 284 Q 349 348 358 440" fill="none" stroke="#508d67" stroke-width="17" stroke-linecap="round"/>${part('path','d="M 355 374 Q 251 272 209 345 Q 238 408 355 395 Z"','leaf1',state)}${part('path','d="M 359 391 Q 453 290 510 341 Q 489 411 359 413 Z"','leaf2',state)}${part('ellipse','cx="356" cy="143" rx="66" ry="91"','p1',state)}${part('ellipse','cx="448" cy="208" rx="74" ry="67"','p2',state)}${part('ellipse','cx="411" cy="296" rx="69" ry="73"','p3',state)}${part('ellipse','cx="300" cy="292" rx="69" ry="73"','p4',state)}${part('ellipse','cx="264" cy="205" rx="74" ry="67"','p5',state)}${part('circle','cx="357" cy="222" r="69"','middle',state)}<circle cx="334" cy="209" r="6" fill="#55647a"/><circle cx="382" cy="209" r="6" fill="#55647a"/><path d="M 338 238 Q 358 257 378 238" fill="none" stroke="#55647a" stroke-width="5"/>`;
 if(which==='house')s=`<path d="M 0 400 Q 200 375 380 403 T 720 396 L 720 480 L 0 480" fill="#dfefd7"/>${part('circle','cx="625" cy="100" r="52"','sun',state)}${part('rect','x="183" y="198" width="341" height="213" rx="8"','walls',state)}${part('path','d="M 155 207 L 355 55 L 554 207 Z"','roof',state)}${part('rect','x="305" y="289" width="96" height="122" rx="8"','door',state)}${part('rect','x="214" y="250" width="80" height="73" rx="8"','window1',state)}${part('rect','x="421" y="250" width="80" height="73" rx="8"','window2',state)}<circle cx="382" cy="357" r="6" fill="#55647a"/>`;
 if(which==='butterfly')s=`<path d="M 346 146 Q 256 33 179 88 Q 110 163 307 249 Q 122 241 160 353 Q 231 426 354 284 Z" fill="none" stroke="#55647a" stroke-width="6"/>${part('path','d="M 347 148 Q 255 22 172 100 Q 113 182 347 251 Z"','leftTop',state)}${part('path','d="M 347 251 Q 100 224 166 359 Q 267 429 348 286 Z"','leftBottom',state)}${part('path','d="M 373 148 Q 465 22 548 100 Q 607 182 373 251 Z"','rightTop',state)}${part('path','d="M 373 251 Q 620 224 554 359 Q 453 429 372 286 Z"','rightBottom',state)}${part('ellipse','cx="360" cy="243" rx="29" ry="111"','body',state)}<path d="M 350 137 Q 321 84 306 97 M 370 137 Q 400 84 413 97" stroke="#55647a" stroke-width="6" fill="none" stroke-linecap="round"/><circle cx="351" cy="179" r="5" fill="#55647a"/><circle cx="370" cy="179" r="5" fill="#55647a"/>`;
 if(which==='car')s=`<path d="M 0 393 Q 350 373 720 390 L 720 480 L 0 480 Z" fill="#ddecd9"/><path d="M 35 426 L 670 426" fill="none" stroke="#f6e2b3" stroke-width="8" stroke-dasharray="30 25"/>${part('path','d="M 113 255 L 165 250 L 220 175 L 490 175 L 548 251 L 603 262 Q 631 269 631 299 L 628 355 L 104 355 L 99 293 Q 102 263 113 255 Z"','car-body',state)}${part('path','d="M 244 181 L 284 126 L 446 126 L 486 181 Z"','car-roof',state)}${part('rect','x="268" y="194" width="100" height="66" rx="10"','window1',state)}${part('rect','x="385" y="194" width="91" height="66" rx="10"','window2',state)}${part('circle','cx="229" cy="351" r="57"','wheel1',state)}${part('circle','cx="519" cy="351" r="57"','wheel2',state)}<circle cx="229" cy="351" r="18" fill="#657489"/><circle cx="519" cy="351" r="18" fill="#657489"/>`;
 if(which==='balloons')s=`<path d="M 0 431 Q 295 401 720 431 L 720 480 L 0 480" fill="#e5f3d7"/><path d="M 231 237 Q 258 306 353 425 M 373 207 Q 365 292 353 425 M 524 238 Q 476 328 353 425" fill="none" stroke="#657489" stroke-width="5"/>${part('ellipse','cx="202" cy="170" rx="90" ry="116"','balloon1',state)}${part('ellipse','cx="387" cy="135" rx="91" ry="112"','balloon2',state)}${part('ellipse','cx="549" cy="190" rx="89" ry="110"','balloon3',state)}<path d="M 179 259 L 203 277 L 226 259 M 364 228 L 387 246 L 410 228 M 528 284 L 549 303 L 572 284" fill="none" stroke="#657489" stroke-width="6"/>`;
 return `<svg id="color-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 480" role="img" aria-label="Ausmalbild">${bg}${s}</svg>`;
}
function color(){
 const templates=[['fish','🐠 Fisch'],['flower','🌼 Blume'],['house','🏠 Haus'],['butterfly','🦋 Schmetterling'],['car','🚗 Auto'],['balloons','🎈 Ballons']];
 let which=store.get('selected-template','fish');if(!templates.some(t=>t[0]===which))which='fish';
 const selected={value:COLORS[0][1]};
 function state(){return store.get('coloring-'+which,{});}
 frame('Buntes Ausmalen','Tippe erst auf eine Farbe und dann auf das Bild.',`<div class="panel"><div class="chip-row" id="templates">${templates.map(([id,title])=>`<button class="chip ${which===id?'active':''}" data-template="${id}">${title}</button>`).join('')}</div><div class="paint-tools">${palette(selected.value)}</div><div class="coloring-surface" id="coloring-surface">${templateSvg(which,state())}</div><div class="toolbar" style="margin-top:17px"><button class="tool-btn soft" id="reset-coloring">🧽 Farben entfernen</button><button class="tool-btn primary" id="save-coloring">💛 In meine Bilder</button></div></div>`);
 bindPalette(selected);const surf=document.getElementById('coloring-surface');
 function refresh(){surf.innerHTML=templateSvg(which,state());app.querySelectorAll('[data-template]').forEach(b=>b.classList.toggle('active',b.dataset.template===which));}
 surf.addEventListener('click',e=>{let el=e.target.closest('[data-colorpart]');if(!el)return;let s=state();s[el.dataset.colorpart]=selected.value;store.set('coloring-'+which,s);el.setAttribute('fill',selected.value);beep('pop');});
 app.querySelectorAll('[data-template]').forEach(b=>b.addEventListener('click',()=>{which=b.dataset.template;store.set('selected-template',which);refresh();}));
 on('reset-coloring','click',()=>confirmBox('Farben entfernen?','Dieses Ausmalbild wird wieder weiß. In der Galerie gespeicherte Bilder bleiben erhalten.','Ja, zurücksetzen',()=>{store.set('coloring-'+which,{});refresh();}));
 on('save-coloring','click',()=>{const svg=document.getElementById('color-svg').cloneNode(true);svg.setAttribute('width','1200');svg.setAttribute('height','800');const data='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(new XMLSerializer().serializeToString(svg));const image=new Image();image.onload=()=>{let c=document.createElement('canvas');c.width=1200;c.height=800;let x=c.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,1200,800);x.drawImage(image,0,0,1200,800);saveToGallery(c.toDataURL('image/png'),'Mein Ausmalbild');};image.onerror=()=>toast('Bild konnte nicht gespeichert werden.');image.src=data;});
}

/* Formen – ein Ziel, drei große Auswahlmöglichkeiten, ohne Zeitdruck */
function shapeSvg(shape,color){const attrs=`fill="${color}" stroke="#53647D" stroke-width="3"`;let s=shape==='circle'?`<circle cx="50" cy="50" r="40" ${attrs}/>`:shape==='square'?`<rect x="12" y="12" width="76" height="76" rx="6" ${attrs}/>`:shape==='triangle'?`<path d="M 50 10 L 92 86 L 8 86 Z" ${attrs}/>`:`<path d="M 50 88 C 12 61 3 38 20 22 C 36 7 50 20 50 30 C 50 20 67 7 81 22 C 97 39 87 62 50 88 Z" ${attrs}/>`;return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" aria-hidden="true">${s}</svg>`;}
function shapes(){
 let turn=0,locked=false;
 frame('Farben & Formen','Schau genau hin und finde die passende Form!',`<div class="activity-area"><div class="prompt" id="shape-prompt"></div><button class="listen-btn" id="shape-listen" aria-label="Aufgabe vorlesen">🔊 Hör mal!</button><div class="shape-options" id="shape-options"></div><div class="message-pill" id="shape-message">Du schaffst das! 🌟</div></div>`);
 function next(){locked=false;let targetC=SHAPECOLORS[turn%SHAPECOLORS.length],targetS=SHAPES[Math.floor(turn/SHAPECOLORS.length)%SHAPES.length];let answer={color:targetC,shape:targetS,correct:true};let options=[answer,{color:SHAPECOLORS[(turn+2)%SHAPECOLORS.length],shape:targetS}];if(!settings.easy)options.push({color:targetC,shape:SHAPES[(Math.floor(turn/SHAPECOLORS.length)+1)%SHAPES.length]});options.sort(()=>Math.random()-.5);
  document.getElementById('shape-prompt').textContent=`Wo ist ${targetS[0]==='Herz'?'das':'der'} ${targetC[0].toLowerCase()}${targetS[0]==='Kreis'?'e':targetS[0]==='Dreieck'?'e':'e'} ${targetS[0]}?`;
  // Verwende eine explizite korrekte Formulierung statt eines rein grammatischen Algorithmus.
  document.getElementById('shape-prompt').textContent=`Finde: ${targetC[0]} – ${targetS[0]}!`;
  document.getElementById('shape-message').textContent='Tippe auf die richtige Form.';
  let box=document.getElementById('shape-options');box.classList.toggle('easy',settings.easy);box.innerHTML=options.map((o,i)=>`<button class="shape-option" data-i="${i}" aria-label="${o.color[0]} ${o.shape[0]}">${shapeSvg(o.shape[1],o.color[1])}</button>`).join('');
  box.querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>{if(locked)return;let o=options[Number(b.dataset.i)];if(o.correct){locked=true;b.classList.add('right');document.getElementById('shape-message').textContent='Ja! Super gemacht! 💛';beep();const t=setTimeout(()=>{turn++;if(document.getElementById('shape-options'))next();},950);cleanup.push(()=>clearTimeout(t));}else{b.classList.add('wrong');document.getElementById('shape-message').textContent='Versuch es noch einmal!';beep('no');setTimeout(()=>b.classList.remove('wrong'),320);}}));
 }
 on('shape-listen','click',()=>{const c=SHAPECOLORS[turn%SHAPECOLORS.length][0],n=SHAPES[Math.floor(turn/SHAPECOLORS.length)%SHAPES.length][0];speak(`Finde ${c} ${n}`);});
 next();
}

/* Farb-Mischlabor: Zwei große Farbtöpfe, kein Zeitdruck, mehrere Kombinationen. */
function mix(){
  const combos=[
    {a:['Rot','#F16A79'],b:['Gelb','#F7D05D'],name:'Orange',hex:'#F5A35D'},
    {a:['Gelb','#F7D05D'],b:['Blau','#6AABEE'],name:'Grün',hex:'#70C49B'},
    {a:['Rot','#F16A79'],b:['Blau','#6AABEE'],name:'Lila',hex:'#AB8EE5'},
    {a:['Weiß','#FFFFFF'],b:['Rot','#F16A79'],name:'Rosa',hex:'#F49DC1'}
  ];
  let turn=0, mixed=false;
  frame('Farben mischen','Tippe auf beide Farbtöpfe und schau, was passiert.',`<div class="activity-area"><div class="mix-area"><div class="mix-pots" id="mix-pots"></div><div class="mix-result" id="mix-result" aria-live="polite">?</div><div class="message-pill" id="mix-message">Welche Farbe entsteht wohl?</div><button class="big-btn primary" id="mix-again" hidden>Nächste Farben →</button></div></div>`);
  function round(){mixed=false;const c=combos[turn%combos.length];const box=document.getElementById('mix-pots');
    box.innerHTML=`<button class="mix-pot" style="--pot:${c.a[1]}" data-pot="0" aria-label="${c.a[0]} antippen"><span class="paint-blob"></span><strong>${c.a[0]}</strong></button><span class="mix-plus" aria-hidden="true">+</span><button class="mix-pot" style="--pot:${c.b[1]}" data-pot="1" aria-label="${c.b[0]} antippen"><span class="paint-blob"></span><strong>${c.b[0]}</strong></button>`;
    const result=document.getElementById('mix-result');result.textContent='?';result.style.background='#f5f1fb';result.style.color='#52627b';document.getElementById('mix-message').textContent='Tippe auf beide Farben.';document.getElementById('mix-again').hidden=true;
    const tapped=new Set();box.querySelectorAll('[data-pot]').forEach(b=>b.addEventListener('click',()=>{if(mixed)return;tapped.add(b.dataset.pot);b.classList.add('chosen');beep('pop');if(tapped.size===2){mixed=true;result.style.background=c.hex;result.textContent='♥';result.style.color=c.name==='Rosa'?'#a24363':'white';document.getElementById('mix-message').textContent=`Das wird ${c.name}!`;document.getElementById('mix-again').hidden=false;speak(c.name);beep();}}));
  }
  on('mix-again','click',()=>{turn++;round();});round();
}

/* Beruhigende Sternenwelt ohne Zeitdruck und ohne Endlosschleifen-Belohnungen. */
function stars(){
  frame('Sterne leuchten','Berühre einen Stern und lass ihn funkeln.',`<div class="activity-area"><div class="star-sky" id="star-sky" aria-label="Sternenhimmel"><div class="sky-moon" aria-hidden="true">☾</div></div><div class="message-pill" id="stars-message">Wie schön die Sterne leuchten!</div><button class="big-btn" id="stars-again">🌙 Neuer Himmel</button></div>`);
  const field=document.getElementById('star-sky');const positions=[[14,24],[30,55],[65,20],[82,46],[50,75],[20,79],[72,82],[46,31],[88,19]];
  function populate(){field.querySelectorAll('button').forEach(b=>b.remove());positions.forEach(([x,y],i)=>{let b=document.createElement('button');b.className='sky-star';b.textContent='★';b.setAttribute('aria-label','Stern antippen');b.style.left=x+'%';b.style.top=y+'%';b.style.fontSize=(45+i%3*10)+'px';b.addEventListener('click',()=>{b.classList.toggle('glowing');if(!settings.quiet)beep('pop');});field.append(b);});}
  on('stars-again','click',populate);populate();
}

/* Seifenblasen */
function bubbles(){frame('Seifenblasen','Tippe die bunten Blasen an!',`<div class="activity-area"><div class="bubble-field" id="bubble-field" aria-label="Tippe auf die Seifenblasen"></div><div class="prompt-small" id="bubble-text">Plopp, plopp, plopp!</div><button class="big-btn primary" id="more-bubbles">🫧 Neue Blasen</button></div>`);const field=document.getElementById('bubble-field');let popped=0;function populate(){popped=0;field.replaceChildren();document.getElementById('bubble-text').textContent='Plopp, plopp, plopp!';for(let i=0;i<11;i++){let b=document.createElement('button');b.className='bubble';b.setAttribute('aria-label','Seifenblase platzen lassen');let size=48+(i*17)%55;b.style.width=size+'px';b.style.height=size+'px';b.style.left=(5+(i*31)%78)+'%';b.style.top=(7+(i*47)%72)+'%';b.style.setProperty('--duration',(5+i%5)+'s');b.addEventListener('click',()=>{if(b.classList.contains('popped'))return;b.classList.add('popped');beep('pop');popped++;if(popped===11){document.getElementById('bubble-text').textContent='Alle Blasen geplatzt! 🌟';beep();}});field.append(b);}}on('more-bubbles','click',populate);populate();}

/* Tiergeräusche */
function animals(){frame('Hallo, Tiere!','Tippe auf ein Tier und höre, was es sagt.',`<div class="activity-area"><div class="animal-grid">${ANIMALS.map(([name,emoji])=>`<button class="animal-card" data-name="${name}"><span class="emoji" aria-hidden="true">${emoji}</span>${name}</button>`).join('')}</div><div class="message-pill" id="animal-message">Welches Tier möchtest du hören?</div><p class="helper">Die Sprachausgabe hängt von den auf dem iPad installierten Stimmen ab.</p></div>`);app.querySelectorAll('[data-name]').forEach(b=>b.addEventListener('click',()=>{let a=ANIMALS.find(x=>x[0]===b.dataset.name);document.getElementById('animal-message').textContent=`${a[0]} sagt: ${a[2]}`;beep();speak(`${a[0]} sagt ${a[2]}`);}));}

/* Tiere füttern */
function food(){let turn=0,done=false;frame('Tiere füttern','Welches Futter mag unser Tier?',`<div class="activity-area"><div class="prompt" id="food-question"></div><div class="food-animal" id="food-animal"></div><div class="food-options" id="food-options"></div><div class="message-pill" id="food-message">Such das richtige Futter.</div><button class="big-btn primary" id="food-next" style="display:none">Nächstes Tier ➜</button></div>`);function show(){done=false;const [name,emoji,correct,choices]=FOOD[turn%FOOD.length];document.getElementById('food-question').textContent=`Was mag ${name==='Affe'||name==='Hase'?'der':name==='Kuh'||name==='Katze'?'die':'das'} ${name}?`;document.getElementById('food-animal').textContent=emoji;document.getElementById('food-message').textContent='Tippe auf das Futter.';document.getElementById('food-next').style.display='none';let area=document.getElementById('food-options');area.innerHTML=choices.map((v,i)=>`<button class="food-btn" data-choice="${i}" aria-label="Futter ${i+1}">${v}</button>`).join('');area.querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>{if(done)return;let v=choices[Number(b.dataset.choice)];if(v===correct){done=true;document.getElementById('food-message').textContent=`Lecker! ${name} freut sich! 💛`;beep();document.getElementById('food-next').style.display='block';}else{document.getElementById('food-message').textContent='Das mag es heute nicht. Versuch es noch mal!';beep('no');}}));}on('food-next','click',()=>{turn++;show();});show();}

/* Puzzle (Zweifachauswahl: Teil auswählen, passende Stelle antippen) */
function puzzleIllustration(){return `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><rect width="400" height="400" fill="#e2f4fb"/><circle cx="337" cy="73" r="42" fill="#ffe4a0"/><path d="M 0 318 Q 140 270 250 311 T 400 314 V 400 H 0 Z" fill="#cce9c3"/><path d="M 96 154 Q 62 36 105 41 Q 145 40 156 143 M 245 146 Q 261 31 296 46 Q 331 71 288 169" stroke="#946a58" stroke-width="18" stroke-linejoin="round" fill="#ffe0b2"/><ellipse cx="197" cy="231" rx="137" ry="123" fill="#f8dcc3" stroke="#946a58" stroke-width="10"/><circle cx="148" cy="215" r="11" fill="#455166"/><circle cx="247" cy="215" r="11" fill="#455166"/><ellipse cx="200" cy="261" rx="21" ry="16" fill="#c97b87"/><path d="M 199 277 Q 178 298 163 282 M 199 277 Q 225 297 239 282" stroke="#946a58" stroke-width="6" fill="none" stroke-linecap="round"/><circle cx="95" cy="258" r="17" fill="#f2b3ab"/><circle cx="301" cy="258" r="17" fill="#f2b3ab"/><path d="M 30 367 Q 75 346 111 369 M 281 371 Q 336 343 380 365" fill="none" stroke="#80bd78" stroke-width="6"/></svg>`;}
function puzzle(){const src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(puzzleIllustration());let placed=new Set(),selected=null;const order=[2,0,3,1];frame('Mein Tier-Puzzle','Tippe auf ein Teil und dann auf die passende Stelle.',`<div class="activity-area"><div class="puzzle-layout"><div class="puzzle-board" id="puzzle-board" aria-label="Puzzle mit vier Feldern"></div><div class="puzzle-pieces" id="puzzle-pieces"></div></div><div class="message-pill" id="puzzle-message">Welches Teil passt wohin?</div><button class="big-btn primary" id="puzzle-reset">🔁 Noch einmal</button></div>`);const pos=i=>`${i%2?100:0}% ${i>1?100:0}%`;
 function show(){let board=document.getElementById('puzzle-board'),pieces=document.getElementById('puzzle-pieces');board.innerHTML=[0,1,2,3].map(i=>`<button class="puzzle-slot ${placed.has(i)?'filled':''}" data-slot="${i}" aria-label="Position ${i+1}" style="${placed.has(i)?`background-image:url(&quot;${src}&quot;);background-position:${pos(i)}`:''}"></button>`).join('');pieces.innerHTML=order.map(i=>`<button class="puzzle-piece ${selected===i?'selected':''} ${placed.has(i)?'placed':''}" data-piece="${i}" ${placed.has(i)?'disabled':''} aria-label="Puzzleteil ${i+1}" style="background-image:url(&quot;${src}&quot;);background-position:${pos(i)}"></button>`).join('');pieces.querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>{selected=Number(b.dataset.piece);show();beep('pop');}));board.querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>{if(selected===null){toast('Such dir zuerst ein Teil aus.');return;}let i=Number(b.dataset.slot);if(selected===i){placed.add(i);selected=null;beep();document.getElementById('puzzle-message').textContent=placed.size===4?'Hurra! Das Puzzle ist fertig! 🌟':'Das passt! Weiter so!';show();}else{document.getElementById('puzzle-message').textContent='Fast! Probier eine andere Stelle.';beep('no');}}));}
 on('puzzle-reset','click',()=>{placed=new Set();selected=null;document.getElementById('puzzle-message').textContent='Welches Teil passt wohin?';show();});show();}

/* Garten */
function garden(){let stage=0;frame('Mein kleiner Garten','Aus einem Samen kann eine wunderschöne Blume wachsen.',`<div class="activity-area"><div class="garden"><div class="sun" aria-hidden="true">☀️</div><div class="plant" id="garden-plant">🟤</div><div class="prompt-small" id="garden-caption">Hier ist noch ein kleiner Samen.</div><div class="garden-controls"><button class="big-btn primary" id="garden-action">💧 Gießen</button><button class="big-btn" id="garden-again" style="display:none">🌱 Neuer Samen</button></div></div></div>`);on('garden-action','click',()=>{stage=Math.min(3,stage+1);let plant=document.getElementById('garden-plant'),cap=document.getElementById('garden-caption');plant.classList.remove('grow');void plant.offsetWidth;plant.classList.add('grow');plant.textContent=['🟤','🌱','🌿','🌷'][stage];cap.textContent=['Hier ist noch ein kleiner Samen.','Oh! Der Samen wächst!','Schon ganz groß!','Eine wunderschöne Blume! 💛'][stage];beep();if(stage===3){document.getElementById('garden-action').style.display='none';document.getElementById('garden-again').style.display='block';}});on('garden-again','click',()=>{stage=0;document.getElementById('garden-plant').textContent='🟤';document.getElementById('garden-caption').textContent='Hier ist noch ein kleiner Samen.';document.getElementById('garden-action').style.display='block';document.getElementById('garden-again').style.display='none';});}

/* Galerie und Bilderexport */
async function gallery(){frame('Meine Bilder','Alle deine bunten Kunstwerke an einem Ort.',`<div id="gallery-list"><div class="empty-state"><span class="emoji">🖼️</span><h2>Bilder werden geladen ...</h2></div></div>`,'home');let list=document.getElementById('gallery-list');try{let pictures=(await allPics()).filter(x=>x.type==='gallery').sort((a,b)=>b.created-a.created);if(activePage!=='gallery')return;if(!pictures.length){list.innerHTML=`<div class="empty-state"><div class="emoji">🎨</div><h2>Hier ist noch Platz für Bilder!</h2><p>Male etwas Schönes und speichere es in deiner Galerie.</p><button class="big-btn primary" id="gallery-paint">Jetzt malen</button></div>`;on('gallery-paint','click',()=>route('draw'));return;}list.innerHTML=`<div class="gallery-grid">${pictures.map((p,i)=>`<article class="gallery-item"><img data-image="${i}" alt="${esc(p.label)}"/><div class="row"><div><strong>${esc(p.label)}</strong><small>${new Date(p.created).toLocaleDateString('de-DE')}</small></div></div></article>`).join('')}</div><p class="helper">Zum Löschen öffne den geschützten Elternbereich.</p>`;pictures.forEach((p,i)=>list.querySelector(`[data-image="${i}"]`).src=p.data);}catch{list.innerHTML=`<div class="empty-state"><h2>Galerie nicht verfügbar</h2><p>Der lokale Speicher konnte nicht geöffnet werden. Bitte im Safari-Browser über HTTPS testen.</p></div>`;}}

/* Eltern-PIN: Verhindert versehentliche Änderung in der App; keine Gerätesperre. */
function openParentGate(){
 let pin=store.get('parent-pin');
 if(pin){modalRoot.innerHTML=`<div class="modal-backdrop"><form class="dialog" id="pin-form" role="dialog" aria-modal="true" aria-labelledby="pin-title"><h2 id="pin-title">🔒 Für Erwachsene</h2><p>Bitte die vierstellige Eltern-PIN eingeben.</p><label class="sr-only" for="pin-input">Eltern-PIN</label><input id="pin-input" type="password" inputmode="numeric" pattern="[0-9]{4}" maxlength="4" autocomplete="off" placeholder="••••" required/><div class="err" id="pin-err"></div><div class="dialog-actions"><button class="tool-btn" type="button" id="pin-cancel">Abbrechen</button><button class="tool-btn primary" type="submit">Öffnen</button></div></form></div>`;on('pin-cancel','click',()=>modalRoot.replaceChildren());on('pin-form','submit',e=>{e.preventDefault();if(document.getElementById('pin-input').value===pin){route('parents');}else{document.getElementById('pin-err').textContent='PIN stimmt nicht.';document.getElementById('pin-input').value='';}});}
 else{modalRoot.innerHTML=`<div class="modal-backdrop"><form class="dialog" id="pin-setup" role="dialog" aria-modal="true" aria-labelledby="pin-title"><h2 id="pin-title">🔒 Eltern-PIN festlegen</h2><p>Lege jetzt eine vierstellige PIN fest. So kann deine Tochter die Einstellungen nicht versehentlich öffnen.</p><label class="sr-only" for="new-pin">Neue Eltern-PIN</label><input id="new-pin" type="password" inputmode="numeric" maxlength="4" pattern="[0-9]{4}" placeholder="Vierstellige PIN" required autocomplete="new-password"/><label class="sr-only" for="pin-repeat">Eltern-PIN wiederholen</label><input id="pin-repeat" type="password" inputmode="numeric" maxlength="4" pattern="[0-9]{4}" placeholder="PIN wiederholen" required autocomplete="new-password"/><div class="err" id="pin-err"></div><div class="dialog-actions"><button class="tool-btn" type="button" id="pin-cancel">Abbrechen</button><button class="tool-btn primary" type="submit">Speichern</button></div></form></div>`;on('pin-cancel','click',()=>modalRoot.replaceChildren());on('pin-setup','submit',e=>{e.preventDefault();let a=document.getElementById('new-pin').value,b=document.getElementById('pin-repeat').value;if(!/^\d{4}$/.test(a)||a!==b){document.getElementById('pin-err').textContent='Bitte zweimal dieselbe vierstellige PIN eingeben.';return;}if(store.set('parent-pin',a)){route('parents');}else{document.getElementById('pin-err').textContent='PIN konnte nicht gespeichert werden.';}});}
}
function parents(){frame('Elternbereich','Einstellungen und Schutzfunktionen für Erwachsene.',`<div class="panel"><h2 class="section-heading">Für deine Familie</h2><p class="helper">Die App funktioniert ohne Konto. Diese Angaben sind freiwillig und bleiben auf diesem Gerät.</p><div class="settings-list"><label class="setting"><span><strong>🧒 Kindername (optional)</strong><p>Persönliche Begrüßung auf der Startseite.</p></span><input id="setting-name" type="text" maxlength="20" value="${esc(settings.childName||'')}" placeholder="Ohne Namen" autocomplete="off" style="max-width:170px;min-width:0;width:42%" /></label><label class="setting"><span><strong>🎈 Alter / Spielstufe</strong><p>Steuert, wie leicht die Zuordnungsspiele sind.</p></span><select id="setting-age" aria-label="Spielstufe"><option value="2" ${settings.ageBand==='2'?'selected':''}>2 Jahre · leicht</option><option value="3" ${settings.ageBand==='3'?'selected':''}>3 Jahre</option><option value="4" ${settings.ageBand==='4'?'selected':''}>4+ Jahre</option></select></label><label class="setting"><span><strong>🎨 Farbwelt</strong><p>Wähle einen freundlichen Hintergrund.</p></span><select id="setting-theme" aria-label="Farbwelt"><option value="sun" ${settings.theme==='sun'?'selected':''}>Sonnenland</option><option value="mint" ${settings.theme==='mint'?'selected':''}>Wald & Wiese</option><option value="ocean" ${settings.theme==='ocean'?'selected':''}>Meereswelt</option></select></label><label class="setting"><span><strong>⛶ Großer Spielmodus</strong><p>Bei Spielen und Malen automatisch die Fläche vergrößern. Jederzeit umschaltbar.</p></span><input class="switch" type="checkbox" id="setting-fullscreen" ${settings.fullscreenDefault?'checked':''} aria-label="Großer Spielmodus automatisch" /></label></div><h2 class="section-heading">Weitere Einstellungen</h2><div class="settings-list"><label class="setting"><span><strong>🔊 Geräusche & Sprachausgabe</strong><p>Klänge und – falls verfügbar – deutsche Systemstimme.</p></span><input class="switch" type="checkbox" id="setting-sound" ${settings.sound?'checked':''} aria-label="Geräusche aktivieren" /></label><label class="setting"><span><strong>🌙 Ruhemodus</strong><p>Ton stumm, sanfte und reduzierte Effekte.</p></span><input class="switch" type="checkbox" id="setting-quiet" ${settings.quiet?'checked':''} aria-label="Ruhemodus aktivieren" /></label><label class="setting"><span><strong>🧸 Einfacher Spielmodus</strong><p>Bei Farben und Formen nur zwei statt drei Möglichkeiten anzeigen.</p></span><input class="switch" type="checkbox" id="setting-easy" ${settings.easy?'checked':''} aria-label="Einfacher Spielmodus" /></label></div><h2 class="section-heading">Bilder verwalten</h2><div class="parent-links"><button class="tool-btn" id="parent-gallery">🖼️ Galerie öffnen</button><button class="tool-btn" id="parent-export">📦 Alle Bilder sichern (ZIP)</button><button class="tool-btn danger" id="parent-delete">🗑️ Bilder löschen</button></div><h2 class="section-heading">Offline-Status</h2><div class="info-box" id="offline-status">Offline-Bereitschaft wird geprüft …</div><h2 class="section-heading">iPad absichern</h2><div class="info-box"><strong>Geführter Zugriff einschalten:</strong><br/>iPad-Einstellungen → Bedienungshilfen → Geführter Zugriff aktivieren. Danach die App öffnen und die obere Taste (beziehungsweise Home-Taste bei älteren Geräten) dreimal drücken. Damit bleibt deine Tochter in der App. Je nach iPad-Modell kann der genaue Ablauf abweichen.</div><h2 class="section-heading">Eltern-PIN</h2><button class="tool-btn" id="change-pin">🔐 PIN ändern</button><p class="helper">Die PIN schützt nur diesen App-Bereich vor versehentlichem Zugriff. Sie ersetzt keine iPad-Kindersicherung. Bilder und Einstellungen liegen lokal auf diesem Gerät und können bei gelöschten Website-Daten verloren gehen.</p></div>`,'home');
 if('serviceWorker' in navigator){navigator.serviceWorker.ready.then(()=>{const el=document.getElementById('offline-status');if(el)el.textContent='Offline-Technik registriert. Bitte im Flugmodus testen; iPad-Vollbild am besten über den Home-Bildschirm starten.';}).catch(()=>{});}else{const el=document.getElementById('offline-status');if(el)el.textContent='Offline-Technik in dieser Vorschau nicht verfügbar. Für die Installation HTTPS verwenden.';}
 on('setting-name','change',e=>{settings.childName=String(e.target.value||'').trim().slice(0,20);store.set('settings',settings);});
 on('setting-age','change',e=>{settings.ageBand=e.target.value;settings.easy=settings.ageBand==='2';store.set('settings',settings);const easy=document.getElementById('setting-easy');if(easy)easy.checked=settings.easy;});
 on('setting-theme','change',e=>{settings.theme=e.target.value;store.set('settings',settings);applyTheme();});
 on('setting-fullscreen','change',e=>{settings.fullscreenDefault=e.target.checked;immersiveActive=settings.fullscreenDefault;store.set('immersive-active',immersiveActive);store.set('settings',settings);});
 on('setting-sound','change',e=>{settings.sound=e.target.checked;store.set('settings',settings);});on('setting-quiet','change',e=>{settings.quiet=e.target.checked;store.set('settings',settings);});on('setting-easy','change',e=>{settings.easy=e.target.checked;store.set('settings',settings);});on('parent-gallery','click',()=>route('gallery'));
 on('parent-export','click',async()=>{try{const pics=(await allPics()).filter(x=>x.type==='gallery');if(!pics.length){toast('Noch keine Bilder gespeichert.');return;}downloadBlob(zipPictures(pics),'meine-bunte-welt-bilder.zip');toast('Bilder als ZIP gesichert.');}catch{toast('Export fehlgeschlagen.');}});
 on('parent-delete','click',()=>confirmBox('Alle Galerie-Bilder löschen?','Diese Aktion kann nicht rückgängig gemacht werden. Dein aktueller Mal-Entwurf bleibt erhalten.','Bilder löschen',async()=>{try{let pics=(await allPics()).filter(x=>x.type==='gallery');await Promise.all(pics.map(p=>delPic(p.id)));toast('Galerie wurde geleert.');}catch{toast('Löschen fehlgeschlagen.');}}));
 on('change-pin','click',()=>{modalRoot.innerHTML=`<div class="modal-backdrop"><form class="dialog" id="change-pin-form" role="dialog" aria-modal="true"><h2>Eltern-PIN ändern</h2><p>Gib deine neue vierstellige PIN zweimal ein.</p><input id="change-a" type="password" pattern="[0-9]{4}" maxlength="4" inputmode="numeric" placeholder="Neue PIN" required/><input id="change-b" type="password" pattern="[0-9]{4}" maxlength="4" inputmode="numeric" placeholder="PIN wiederholen" required/><div class="err" id="change-error"></div><div class="dialog-actions"><button class="tool-btn" type="button" id="change-cancel">Abbrechen</button><button class="tool-btn primary" type="submit">Ändern</button></div></form></div>`;on('change-cancel','click',()=>modalRoot.replaceChildren());on('change-pin-form','submit',e=>{e.preventDefault();let a=document.getElementById('change-a').value,b=document.getElementById('change-b').value;if(!/^\d{4}$/.test(a)||a!==b){document.getElementById('change-error').textContent='PINs stimmen nicht überein.';return;}store.set('parent-pin',a);modalRoot.replaceChildren();toast('PIN geändert.');});});
}
function render(){const pages={home,category,draw,color,shapes,puzzle,mix,bubbles,food,animals,garden,stars,gallery,parents};(pages[activePage]||home)();syncImmersive();}
render();
if('serviceWorker' in navigator&&/^https?:$/.test(location.protocol)){window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));}
