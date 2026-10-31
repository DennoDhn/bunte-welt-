/* Meine bunte Welt 1.3 – zusätzliche Spiele und familienfreundliche Datensicherung.
   Alle Inhalte bleiben lokal. Keine externen Ressourcen. */
'use strict';

const STICKER_SETS={
  wiese:{label:'🌿 Blumenwiese',items:['🐰','🐶','🐱','🦋','🌻','🌷','🌈','🐝','🐞','🍎','☀️','🏡']},
  meer:{label:'🌊 Unterwasser',items:['🐠','🐟','🐬','🐢','🐙','🦀','🐚','🪸','⭐','🫧','🐡','🦈']},
  himmel:{label:'☁️ Wolkenwelt',items:['🦄','🌈','☀️','🌙','⭐','🚀','🎈','🪁','🛩️','🐦','🦋','💖']}
};
function stickers(){
 let theme=store.get('sticker-theme','wiese');if(!STICKER_SETS[theme])theme='wiese';
 const states={};for(const id of Object.keys(STICKER_SETS)){const saved=store.get('sticker-'+id,[]);states[id]=Array.isArray(saved)?saved.filter(v=>v&&typeof v.emoji==='string'&&Number.isFinite(v.x)&&Number.isFinite(v.y)).slice(0,70):[];}
 frame('Mein Stickerbuch','Wähle Bilder aus, verschiebe sie mit dem Finger und gestalte deine Welt.',`<div class="panel sticker-panel"><div class="sticker-tabs" id="sticker-tabs">${Object.entries(STICKER_SETS).map(([id,v])=>`<button class="chip ${id===theme?'active':''}" data-theme="${id}">${v.label}</button>`).join('')}</div><div class="sticker-stage"><canvas id="sticker-canvas" width="1100" height="700" aria-label="Stickerbild, Sticker mit dem Finger bewegen"></canvas></div><div class="sticker-palette" id="sticker-palette" aria-label="Sticker wählen"></div><div class="toolbar sticker-actions"><button class="tool-btn soft" id="sticker-undo">↶ Rückgängig</button><button class="tool-btn soft" id="sticker-clear">🧽 Neues Bild</button><button class="tool-btn primary" id="sticker-save">💛 Bild speichern</button></div></div>`);
 const canvas=document.getElementById('sticker-canvas'),ctx=canvas.getContext('2d'),stickerChoices=document.getElementById('sticker-palette');
 let activePointer=null,moving=-1,started=false,moved=false;
 const items=()=>states[theme];
 const persist=()=>store.set('sticker-'+theme,items());
 function background(){
  const grad=ctx.createLinearGradient(0,0,0,700);
  if(theme==='meer'){grad.addColorStop(0,'#b4efff');grad.addColorStop(1,'#d0e8fa');}
  else if(theme==='himmel'){grad.addColorStop(0,'#b2dafa');grad.addColorStop(1,'#f9e3ee');}
  else {grad.addColorStop(0,'#d5f1ff');grad.addColorStop(1,'#fff9da');}
  ctx.fillStyle=grad;ctx.fillRect(0,0,1100,700);
  ctx.fillStyle='#ffffffbb';
  for(const [x,y,scale] of [[130,108,1],[600,90,1.5],[943,152,.9]]){
    ctx.beginPath();ctx.ellipse(x,y,70*scale,29*scale,0,0,2*Math.PI);ctx.ellipse(x-27*scale,y-13*scale,39*scale,30*scale,0,0,2*Math.PI);ctx.ellipse(x+25*scale,y-20*scale,51*scale,35*scale,0,0,2*Math.PI);ctx.fill();
  }
  if(theme==='wiese'){
   ctx.fillStyle='#a6dfa2';ctx.beginPath();ctx.moveTo(0,530);ctx.quadraticCurveTo(520,410,1100,530);ctx.lineTo(1100,700);ctx.lineTo(0,700);ctx.fill();
   ctx.fillStyle='#80c78e';ctx.beginPath();ctx.moveTo(0,624);ctx.quadraticCurveTo(500,545,1100,615);ctx.lineTo(1100,700);ctx.lineTo(0,700);ctx.fill();
  }else if(theme==='meer'){
   ctx.fillStyle='#f5e3b4';ctx.fillRect(0,605,1100,95);
   ctx.strokeStyle='#a7dfee';ctx.lineWidth=8;for(let y=260;y<610;y+=95){ctx.beginPath();ctx.moveTo(0,y);for(let x=0;x<=1100;x+=65)ctx.quadraticCurveTo(x+30,y-21,x+65,y);ctx.stroke();}
  }else{ctx.fillStyle='#eee4f8';ctx.fillRect(0,620,1100,80);}
 }
 function renderCanvas(){background();ctx.textAlign='center';ctx.textBaseline='middle';for(const item of items()){ctx.font=`${item.size||112}px "Apple Color Emoji","Segoe UI Emoji",sans-serif`;ctx.fillText(item.emoji,item.x,item.y);} }
 function renderPalette(){stickerChoices.innerHTML=STICKER_SETS[theme].items.map((e,i)=>`<button class="sticker-option" data-sticker="${i}" aria-label="Sticker ${i+1}: ${e}">${e}</button>`).join('');stickerChoices.querySelectorAll('[data-sticker]').forEach(b=>b.addEventListener('click',()=>{if(items().length>=70){toast('Dieses Bild ist schon ganz voll.');return;}items().push({emoji:STICKER_SETS[theme].items[Number(b.dataset.sticker)],x:550+((items().length%5)-2)*55,y:340+((items().length%3)-1)*30,size:112});persist();renderCanvas();beep('pop');}));}
 function xy(ev){const r=canvas.getBoundingClientRect();return {x:(ev.clientX-r.left)/r.width*1100,y:(ev.clientY-r.top)/r.height*700};}
 canvas.addEventListener('pointerdown',e=>{if(activePointer!==null||e.pointerType==='mouse'&&e.button!==0)return;e.preventDefault();activePointer=e.pointerId;const p=xy(e);moving=-1;for(let i=items().length-1;i>=0;i--){const a=items()[i];if(Math.hypot((p.x-a.x)*1.1,p.y-a.y)<(a.size||112)*.70){moving=i;break;}}if(moving>=0){started=true;moved=false;try{canvas.setPointerCapture(e.pointerId);}catch{}}});
 canvas.addEventListener('pointermove',e=>{if(e.pointerId!==activePointer||moving<0)return;e.preventDefault();const p=xy(e),v=items()[moving];v.x=Math.min(1040,Math.max(60,p.x));v.y=Math.min(650,Math.max(50,p.y));moved=true;renderCanvas();});
 const finish=e=>{if(e.pointerId!==activePointer)return;activePointer=null;if(moving>=0){if(moved)persist();moving=-1;}};
 for(const event of ['pointerup','pointercancel','lostpointercapture'])canvas.addEventListener(event,finish);
 for(const b of document.querySelectorAll('#sticker-tabs [data-theme]'))b.addEventListener('click',()=>{theme=b.dataset.theme;store.set('sticker-theme',theme);document.querySelectorAll('#sticker-tabs [data-theme]').forEach(v=>v.classList.toggle('active',v===b));renderPalette();renderCanvas();});
 on('sticker-undo','click',()=>{if(!items().length)return;items().pop();persist();renderCanvas();});
 on('sticker-clear','click',()=>confirmBox('Neues Stickerbild?','Alle Sticker dieser Landschaft entfernen? Bereits gespeicherte Bilder bleiben in deiner Galerie.','Ja, neues Bild',()=>{states[theme]=[];persist();renderCanvas();}));
 on('sticker-save','click',()=>saveToGallery(canvas.toDataURL('image/png'),'Mein Stickerbild'));
 renderPalette();renderCanvas();
}

const SCRATCH_MOTIFS=[['🐱','Katze','#ffe2cb'],['🌈','Regenbogen','#d8effa'],['🦋','Schmetterling','#f7deef'],['🐻','Bär','#e4eccd'],['🚀','Rakete','#e6e0fc']];
function scratch(){
 let selected=0,pressed=false,pointer=null;
 frame('Zauberbilder','Wische mit deinem Finger und entdecke, wer sich versteckt.',`<div class="activity-area scratch-wrap"><div class="scratch-tabs">${SCRATCH_MOTIFS.map(([e,n],i)=>`<button class="chip ${i===0?'active':''}" data-scratch="${i}">${e} ${n}</button>`).join('')}</div><div class="scratch-stage"><canvas id="scratch-bg" width="900" height="570" aria-hidden="true"></canvas><canvas id="scratch-cover" width="900" height="570" aria-label="Hier wischen, um ein Überraschungsbild freizulegen"></canvas></div><div class="toolbar"><button id="scratch-new" class="tool-btn primary">✨ Neues Zauberbild</button></div></div>`);
 const back=document.getElementById('scratch-bg'),cover=document.getElementById('scratch-cover'),b=back.getContext('2d'),c=cover.getContext('2d');
 function paint(){let [emoji,name,color]=SCRATCH_MOTIFS[selected];b.fillStyle=color;b.fillRect(0,0,900,570);b.font='275px "Apple Color Emoji","Segoe UI Emoji",sans-serif';b.textAlign='center';b.textBaseline='middle';b.fillText(emoji,450,275);b.font='bold 39px ui-rounded,system-ui,sans-serif';b.fillStyle='#536580';b.fillText(name,450,505);c.globalCompositeOperation='source-over';c.fillStyle='#b3b9d6';c.fillRect(0,0,900,570);for(let x=0;x<900;x+=115){for(let y=0;y<570;y+=90){c.fillStyle=(x/115+y/90)%2?'#c9c5e8':'#c5dbe6';c.beginPath();c.arc(x+25,y+30,14,0,Math.PI*2);c.fill();}}c.globalCompositeOperation='destination-out';}
 function reveal(e){let r=cover.getBoundingClientRect();let x=(e.clientX-r.left)/r.width*900,y=(e.clientY-r.top)/r.height*570;c.beginPath();c.arc(x,y,66,0,Math.PI*2);c.fill();}
 cover.addEventListener('pointerdown',e=>{if(pointer!==null)return;e.preventDefault();pointer=e.pointerId;pressed=true;try{cover.setPointerCapture(pointer);}catch{}reveal(e);beep('pop');});
 cover.addEventListener('pointermove',e=>{if(pressed&&e.pointerId===pointer){e.preventDefault();reveal(e);}});
 const finish=e=>{if(e.pointerId===pointer){pressed=false;pointer=null;}};
 ['pointerup','pointercancel','lostpointercapture'].forEach(event=>cover.addEventListener(event,finish));
 document.querySelectorAll('[data-scratch]').forEach(btn=>btn.addEventListener('click',()=>{selected=Number(btn.dataset.scratch);document.querySelectorAll('[data-scratch]').forEach(x=>x.classList.toggle('active',x===btn));paint();}));
 on('scratch-new','click',()=>{selected=(selected+1)%SCRATCH_MOTIFS.length;document.querySelectorAll('[data-scratch]').forEach(x=>x.classList.toggle('active',Number(x.dataset.scratch)===selected));paint();});paint();
}

function music(){
 const notes=[['Do',261.63,'#f57f83'],['Re',293.66,'#fab16a'],['Mi',329.63,'#f6d46d'],['Fa',349.23,'#96cf8b'],['Sol',392,'#8dd1da'],['La',440,'#8aadec'],['Si',493.88,'#bca0ef'],['Do',523.25,'#eba0c7']];
 frame('Meine Musik-Ecke','Tippe auf die bunten Töne und erfinde deine eigene Musik.',`<div class="activity-area music-stage"><div class="instrument-panel"><h2>🎹 Mein Xylophon</h2><div class="music-keys">${notes.map(([name,hz,color],i)=>`<button class="music-key" data-note="${i}" aria-label="Ton ${name}" style="background:${color};height:${155+(7-i)*8}px"><span>${name}</span></button>`).join('')}</div></div><div class="music-percussion"><button data-percussion="drum" aria-label="Trommel spielen">🥁<span>Trommel</span></button><button data-percussion="bell" aria-label="Glöckchen spielen">🔔<span>Glöckchen</span></button><button data-percussion="shake" aria-label="Rassel spielen">🪇<span>Rassel</span></button></div></div>`);
 function tone(hz,type='sine',length=.5){if(!settings.sound||settings.quiet)return;try{audioCtx=audioCtx||new(window.AudioContext||window.webkitAudioContext)();if(audioCtx.state==='suspended')audioCtx.resume();const t=audioCtx.currentTime;const osc=audioCtx.createOscillator(),gain=audioCtx.createGain();osc.type=type;osc.frequency.value=hz;gain.gain.setValueAtTime(.0001,t);gain.gain.exponentialRampToValueAtTime(.09,t+.015);gain.gain.exponentialRampToValueAtTime(.0001,t+length);osc.connect(gain);gain.connect(audioCtx.destination);osc.start(t);osc.stop(t+length+.04);}catch{}}
 document.querySelectorAll('[data-note]').forEach(el=>el.addEventListener('click',()=>{const n=Number(el.dataset.note);tone(notes[n][1]);el.classList.add('played');const t=setTimeout(()=>el.classList.remove('played'),160);cleanup.push(()=>clearTimeout(t));}));
 document.querySelectorAll('[data-percussion]').forEach(el=>el.addEventListener('click',()=>{const kind=el.dataset.percussion;if(kind==='bell')tone(830,'sine',1);else if(kind==='drum')tone(100,'triangle',.2);else{tone(430,'sawtooth',.12);setTimeout(()=>{if(activePage==='music')tone(510,'sawtooth',.12);},130);}el.classList.add('played');setTimeout(()=>el.classList.remove('played'),160);}));
}

function families(){
 const combos=[['🐤','🐔','Küken','Huhn','🐻','🐮'],['🐶','🐕','Welpe','Hund','🐴','🐔'],['🐱','🐈','Kätzchen','Katze','🐥','🐷'],['🦆','🦆','Entenküken','Ente','🐴','🐻'],['🐻','🐻','Bärenjunges','Bär','🐕','🐄']];
 let round=0,completed=false;
 frame('Tierbabys finden','Bringe das Tierbaby zu seinem großen Tier.',`<div class="activity-area family-stage"><p class="prompt" id="family-prompt"></p><div class="family-baby" id="family-baby"></div><div class="family-choices" id="family-choices"></div><div class="message-pill" id="family-message">Wer passt zusammen?</div><button class="big-btn primary" id="family-next" hidden>🐾 Nächstes Tier</button></div>`);
 function paint(){completed=false;const [baby,parent,babyName,parentName,...wrong]=combos[round%combos.length];document.getElementById('family-prompt').textContent='Wohin gehört das '+babyName+'?';document.getElementById('family-baby').textContent=baby;document.getElementById('family-message').textContent='Tippe auf das passende Tier.';document.getElementById('family-next').hidden=true;let options=[parent,wrong[0],wrong[1]].slice(0,settings.easy?2:3);options=options.sort(()=>Math.random()-.5);const el=document.getElementById('family-choices');el.innerHTML=options.map((x,i)=>`<button class="family-option" data-idx="${i}" aria-label="Tier ${i+1}">${x}</button>`).join('');el.querySelectorAll('button').forEach(btn=>btn.addEventListener('click',()=>{if(completed)return;if(options[Number(btn.dataset.idx)]===parent){completed=true;btn.classList.add('right');document.getElementById('family-message').textContent='Super, die Familie ist zusammen!';document.getElementById('family-next').hidden=false;beep();}else{btn.classList.add('wrong');const t=setTimeout(()=>btn.classList.remove('wrong'),350);cleanup.push(()=>clearTimeout(t));beep('no');}}));}
 on('family-next','click',()=>{round++;paint();});paint();
}

/* Backups: JSON enthält ausschließlich lokale Zeichnungen und freiwillige Einstellungen.
   Keine PIN, keine Kontoinformationen, keine externe Übermittlung. */
async function exportCompleteBackup(){
 try{
   const pictures=await allPics();const coloring={};
   for(const k of ['fish','flower','house','butterfly','car','balloons','sun','tree','cat','rocket'])coloring[k]=store.get('coloring-'+k,{});
   const stickersSaved={};for(const k of Object.keys(STICKER_SETS))stickersSaved[k]=store.get('sticker-'+k,[]);
   const safeSettings={...settings};delete safeSettings.parentPin;delete safeSettings.pin;
   const payload={type:'meine-bunte-welt-backup',version:1,created:new Date().toISOString(),pictures,coloring,stickers:stickersSaved,settings:safeSettings,profiles:store.get('v2-profiles',[{id:'main',name:safeSettings.childName||'Kind 1'}]),activeProfile:v2Profile()};
   downloadBlob(new Blob([JSON.stringify(payload)],{type:'application/json'}),'meine-bunte-welt-komplett-'+new Date().toISOString().slice(0,10)+'.json');toast('Backup wird gespeichert.');
 }catch{toast('Backup konnte nicht erstellt werden.');}
}
function restoreCompleteBackup(file){
 if(file.size>40*1024*1024){toast('Backup ist zu groß.');return;}
 confirmBox('Backup wiederherstellen?','Bilder und Einstellungen aus dieser Datei werden zusätzlich geladen. Der aktuelle Malentwurf bleibt bestehen.','Backup einlesen',async()=>{
  try{
   const data=JSON.parse(await file.text());if(data.type!=='meine-bunte-welt-backup'||data.version!==1||!Array.isArray(data.pictures)||data.pictures.length>500)throw Error('Ungültiges Backup');
   // Validate all records independently; do not insert untrusted labels or huge data.
   let count=0;
   for(const p of data.pictures){if(!p||!['gallery','draft'].includes(p.type)||typeof p.data!=='string'||!/^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(p.data)||p.data.length>8000000)continue;
     if(p.type==='draft')continue;const id='restored-'+Date.now()+'-'+count+'-'+Math.floor(Math.random()*1000000);await putPic({id,type:'gallery',label:typeof p.label==='string'?p.label.slice(0,60):'Wiederhergestelltes Bild',created:Number.isFinite(p.created)?p.created:Date.now(),data:p.data,profile:typeof p.profile==='string'&&/^(main|kid-[0-9]+)$/.test(p.profile)?p.profile:'main'});count++;}
   if(Array.isArray(data.profiles)){const valid=data.profiles.filter(v=>v&&typeof v.id==='string'&&/^(main|kid-[0-9]+)$/.test(v.id)&&typeof v.name==='string'&&v.name.length<=24).slice(0,6);if(valid.length&&valid.some(v=>v.id==='main'))store.set('v2-profiles',valid);}
   for(const k of ['fish','flower','house','butterfly','car','balloons','sun','tree','cat','rocket']){const obj=data.coloring?.[k];if(obj&&typeof obj==='object'&&!Array.isArray(obj)&&JSON.stringify(obj).length<3000)store.set('coloring-'+k,obj);}
   for(const k of Object.keys(STICKER_SETS)){const arr=data.stickers?.[k];if(Array.isArray(arr))store.set('sticker-'+k,arr.filter(v=>v&&typeof v.emoji==='string'&&v.emoji.length<10&&Number.isFinite(v.x)&&Number.isFinite(v.y)&&Number.isFinite(v.size)).slice(0,70));}
   const sc=data.settings;if(sc&&typeof sc==='object'){
     const keys=['sound','quiet','easy','childName','ageBand','theme','fullscreenDefault','favorites'];
     for(const k of keys){const v=sc[k];if(['sound','quiet','easy','fullscreenDefault'].includes(k)&&typeof v==='boolean')settings[k]=v;
       if(k==='childName'&&typeof v==='string')settings.childName=v.slice(0,20);
       if(k==='ageBand'&&['2','3','4'].includes(v))settings.ageBand=v;
       if(k==='theme'&&['sun','mint','ocean'].includes(v))settings.theme=v;
       if(k==='favorites'&&Array.isArray(v))settings.favorites=v.filter(id=>ALL_ACTIVITIES.some(a=>a[0]===id)).slice(0,4);
     }store.set('settings',settings);applyTheme();
   }
   toast(`${count} Bilder wiederhergestellt.`);route('parents');
  }catch(e){toast('Diese Sicherung ist ungültig oder beschädigt.');}
 });
}

async function manageGallery(){
 frame('Bilder verwalten','Einzelne Bilder sichern oder aus der Galerie entfernen.',`<div id="manage-list"><div class="empty-state">Bilder werden geladen …</div></div>`,'parents');const box=document.getElementById('manage-list');
 try{const pics=(await allPics()).filter(p=>p.type==='gallery').sort((a,b)=>b.created-a.created);
   if(activePage!=='manage-gallery')return;
   if(!pics.length){box.innerHTML='<div class="empty-state">Noch keine Bilder vorhanden.</div>';return;}
   box.innerHTML='<div class="gallery-grid manage-grid">'+pics.map((p,i)=>`<article class="gallery-item"><img data-preview="${i}" alt="${esc(p.label)}"/><p><b>${esc(p.label)}</b></p><div class="manage-actions"><button class="tool-btn" data-download="${i}">⬇️ Sichern</button><button class="tool-btn danger" data-delete="${i}">🗑️ Löschen</button></div></article>`).join('')+'</div>';
   pics.forEach((p,i)=>{box.querySelector(`[data-preview="${i}"]`).src=p.data;});
   box.querySelectorAll('[data-download]').forEach(btn=>btn.addEventListener('click',()=>{const p=pics[Number(btn.dataset.download)];downloadData(p.data,'kunstwerk-'+p.created+'.png');}));
   box.querySelectorAll('[data-delete]').forEach(btn=>btn.addEventListener('click',()=>{const p=pics[Number(btn.dataset.delete)];confirmBox('Bild löschen?','Dieses Bild wird vom Gerät entfernt. Das kann nicht rückgängig gemacht werden.','Bild löschen',async()=>{try{await delPic(p.id);toast('Bild gelöscht.');manageGallery();}catch{toast('Löschen fehlgeschlagen.');}});}));
 }catch{box.innerHTML='<div class="empty-state">Galerie konnte nicht geladen werden.</div>';}
}
