/* Meine bunte Welt 2.0 — kindgerechte Oberflaeche, Kreativstudio und vier Spiele. */
'use strict';

const V2_ICON = {
  back:'<path d="M15 6 9 12l6 6"/>',brush:'<path d="m14.5 6.5 3 3M6 20c-2 0-3-1-3-3 0-2 2-3 4-3l8-8a3 3 0 0 1 4 4l-8 8c-1 1-2 2-5 2Z"/>',
  new:'<path d="M7 3h7l4 4v14H7a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3Z"/><path d="M14 3v5h5M11 12v6M8 15h6"/>',
  undo:'<path d="m9 14-5-5 5-5M4 9h9a6 6 0 0 1 0 12h-1"/>',redo:'<path d="m15 14 5-5-5-5M20 9h-9a6 6 0 0 0 0 12h1"/>',
  gallery:'<rect x="3" y="4" width="18" height="16" rx="3"/><circle cx="9" cy="10" r="2"/><path d="m3 17 6-5 4 3 3-2 5 4"/>',
  more:'<circle cx="5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/>',
  close:'<path d="M5 5 19 19M19 5 5 19"/>',eraser:'<path d="m20 15-6 6H8l-6-6 11-11a3 3 0 0 1 4 0l3 3a3 3 0 0 1 0 4L9 21"/>',
  puzzle:'<path d="M10 3H4a1 1 0 0 0-1 1v6c2-2 5-1 5 2s-3 4-5 2v6a1 1 0 0 0 1 1h6c-2-2-1-5 2-5s4 3 2 5h6a1 1 0 0 0 1-1v-6c-2 2-5 1-5-2s3-4 5-2V4a1 1 0 0 0-1-1h-6c2 2 1 5-2 5S8 5 10 3Z"/>',
  palette:'<path d="M12 3a9 9 0 0 0 0 18h2a2 2 0 0 0 2-2 2 2 0 0 0-1-2c-1-1-1-2 1-2h2a3 3 0 0 0 3-3 9 9 0 0 0-9-9Z"/><circle cx="7" cy="11" r="1"/><circle cx="10" cy="7" r="1"/><circle cx="16" cy="8" r="1"/>',
  sound:'<path d="M4 9v6h4l5 4V5L8 9H4ZM17 9a4 4 0 0 1 0 6M19 6a8 8 0 0 1 0 12"/>',
  leaf:'<path d="M20 4C9 4 4 8 4 15a5 5 0 0 0 5 5c7 0 11-5 11-16ZM5 19c3-5 6-8 12-11"/>',
  star:'<path d="m12 2 3.1 6.3 7 1-5 4.9 1.2 6.8L12 17.8l-6.3 3.2 1.2-6.8-5-4.9 7-1Z"/>',
  gear:'<circle cx="12" cy="12" r="3"/><path d="M10 2h4l.7 3 2.4 1 2.6-1.6 2.8 2.8L21 9.8l1 2.4-1 2.4 1.6 2.6-2.8 2.8-2.6-1.6-2.4 1-.7 3h-4l-.7-3-2.4-1-2.6 1.6-2.8-2.8L4.1 14l-1-2.4 1-2.4-1.6-2.6 2.8-2.8 2.6 1.6 2.4-1Z"/>',
  layers:'<path d="m12 2 9 5-9 5-9-5 9-5Zm-9 9 9 5 9-5M3 16l9 5 9-5"/>'
};
function v2Icon(name,size=26){return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round" aria-hidden="true">${V2_ICON[name]||V2_ICON.star}</svg>`;}
function v2Profile(){return store.get('v2-active-profile','main');}
function v2DraftId(){const p=v2Profile();return p==='main'?'draft':'draft-'+p;}
function v2CuratedIllustration(key){
  const paths={
   draw:'<path d="M22 68C44 25 67 33 87 68S133 106 155 54S202 32 218 59" fill="none" stroke="#EA7886" stroke-width="17" stroke-linecap="round"/><path d="M31 127c16-40 41-58 74-25s53 35 78-6" fill="none" stroke="#8CC4A7" stroke-width="14" stroke-linecap="round"/><circle cx="194" cy="125" r="19" fill="#EDC46B"/>',
   color:'<path d="M40 118Q37 39 106 46Q164 48 165 114Z" fill="#B8A6E1"/><path d="M105 47Q111 14 144 30Q176 44 164 76" fill="#EBC582"/><circle cx="175" cy="123" r="37" fill="#EBA0AB"/><path d="m160 123 13 13 27-32" fill="none" stroke="white" stroke-width="9" stroke-linecap="round"/>',
   play:'<rect x="29" y="75" width="84" height="84" rx="22" fill="#8DBED8" transform="rotate(-13 71 117)"/><rect x="115" y="31" width="80" height="80" rx="20" fill="#F0C976" transform="rotate(13 155 71)"/><circle cx="172" cy="130" r="30" fill="#EAA5B1"/>',
   explore:'<path d="M101 163C78 108 96 54 169 34c0 71-24 120-68 129Z" fill="#96C9A6"/><path d="M101 161C80 109 62 86 28 83c-1 66 24 89 73 78Z" fill="#C3DB8F"/><path d="M101 169c6-63 35-107 64-129" fill="none" stroke="#5E987E" stroke-width="8" stroke-linecap="round"/><circle cx="182" cy="139" r="17" fill="#F0BF71"/>',
   gallery:'<rect x="39" y="28" width="151" height="131" rx="20" fill="#F0D9B5"/><rect x="48" y="36" width="133" height="113" rx="14" fill="#FDFDFB"/><circle cx="151" cy="70" r="19" fill="#EEC26A"/><path d="M58 132 99 82l32 28 17-15 27 37Z" fill="#8FC6A7"/>',
  };return `<svg class="v2-illustration" viewBox="0 0 245 175" aria-hidden="true">${paths[key]||paths.play}</svg>`;
}
function v2Home(){
 document.body.classList.remove('studio-active');
 const fav=(Array.isArray(settings.favorites)?settings.favorites:[]);
 const greeting=settings.childName?`Hallo, ${esc(settings.childName)}!`:'Was möchtest du spielen?';
 app.innerHTML=`<main class="v2-home"><header class="v2-home-head"><div class="v2-brand"><span class="v2-brand-mark">✳</span><span>Meine bunte Welt</span></div><button class="v2-circle v2-parent-link" id="parent" aria-label="Elternbereich">${v2Icon('gear',25)}</button></header><section class="v2-welcome"><h1>${greeting}</h1><p>Such dir etwas Schönes aus.</p></section><div class="v2-hometiles">
 <button class="v2-hometile peach" data-v2to="draw">${v2CuratedIllustration('draw')}<strong>Malen</strong></button>
 <button class="v2-hometile lilac" data-v2to="color">${v2CuratedIllustration('color')}<strong>Ausmalen</strong></button>
 <button class="v2-hometile blue" data-v2to="play">${v2CuratedIllustration('play')}<strong>Spielen</strong></button>
 <button class="v2-hometile green" data-v2to="explore">${v2CuratedIllustration('explore')}<strong>Entdecken</strong></button></div>
 <footer class="v2-home-footer"><button class="v2-gallery-entry" data-v2to="gallery">${v2Icon('gallery',23)} Meine Bilder</button><span>Ganz ohne Werbung · Funktioniert offline</span></footer></main>`;
 app.querySelectorAll('[data-v2to]').forEach(b=>b.addEventListener('click',()=>{const id=b.dataset.v2to; if(['play','explore'].includes(id))route('category',id);else route(id,'paint');}));
 on('parent','click',openParentGate);
}
function v2Category(){
 const c=CATEGORIES[currentCategory];
 const fav=Array.isArray(settings.favorites)?settings.favorites:[];
 app.innerHTML=`<main class="v2-categories"><header class="v2-list-head"><button class="v2-circle" id="back" aria-label="Zurück">${v2Icon('back')}</button><h1>${currentCategory==='paint'?'Kreativ sein':currentCategory==='play'?'Spielen':'Entdecken'}</h1><button class="v2-circle" id="parent" aria-label="Elternbereich">${v2Icon('gear')}</button></header><div class="v2-cardgrid">${c.activities.map(([id,name,emoji],i)=>`<button class="v2-gamecard tone-${i%5}" data-game="${id}"><span class="v2-game-art">${id==='draw'?v2CuratedIllustration('draw'):id==='color'?v2CuratedIllustration('color'):`<span class="v2-emoji" aria-hidden="true">${emoji}</span>`}</span><strong>${name}</strong></button>`).join('')}</div></main>`;
 on('back','click',()=>route('home'));on('parent','click',openParentGate);
 app.querySelectorAll('[data-game]').forEach(b=>b.addEventListener('click',()=>route(b.dataset.game)));
}
function v2Gallery(){
 const profile=v2Profile();
 app.innerHTML=`<main class="v2-gallery-page"><header class="v2-list-head"><button id="back" class="v2-circle" aria-label="Zurück">${v2Icon('back')}</button><h1>Meine Bilder</h1><button id="gallery-new" class="v2-primary-small">${v2Icon('new',23)} Neues Bild</button></header><div class="v2-gallery-grid" id="v2-gallery-grid"><p>Deine Bilder werden geladen …</p></div></main>`;
 on('back','click',()=>route('home'));on('gallery-new','click',()=>route('draw'));
 allPics().then(pictures=>{
  if(activePage!=='gallery')return;
  const all=pictures.filter(p=>p.type==='gallery'&&(p.profile||'main')===profile).sort((a,b)=>b.created-a.created);
  const el=document.getElementById('v2-gallery-grid');
  if(!all.length){el.innerHTML=`<div class="v2-empty-gallery">${v2CuratedIllustration('gallery')}<h2>Hier ist Platz für deine Kunstwerke.</h2><button class="v2-primary-small" id="gallery-start">Jetzt malen</button></div>`;on('gallery-start','click',()=>route('draw'));return;}
  el.innerHTML=all.map((p,i)=>`<article class="v2-gallery-card"><img alt="Bild ${i+1}" data-picture="${i}"/><div class="v2-gallery-meta"><span>Bild ${all.length-i}</span><button class="v2-reopen" data-open="${i}" aria-label="Bild zum Weitermalen öffnen">${v2Icon('brush',21)} Weiter malen</button></div></article>`).join('');
  all.forEach((p,i)=>{el.querySelector(`[data-picture="${i}"]`).src=p.data;});
  el.querySelectorAll('[data-open]').forEach(b=>b.addEventListener('click',async()=>{
   if(b.disabled)return;b.disabled=true;
   try{
    const selected=all[Number(b.dataset.open)];const id=v2DraftId();await draftWriteQueue.catch(()=>{});const saved=await getPic(id);
    if(saved?.data&&saved.hasInk!==false){await putPic({id:'img-'+Date.now()+'-previous',type:'gallery',label:'Mein Bild',data:saved.data,profile,created:Date.now()});}
    await putPic({id,type:'draft',label:'Mein Bild',data:selected.data,profile,hasInk:true,created:Date.now()});route('draw');
   }catch{toast('Das Bild konnte nicht geöffnet werden.');b.disabled=false;}
  }));
 }).catch(()=>{let el=document.getElementById('v2-gallery-grid');if(el)el.textContent='Galerie nicht verfügbar. Speicher prüfen.';});
}
function v2Draw(){
 document.body.classList.add('studio-active');
 const profile=v2Profile(),draftId=v2DraftId();
 const savedColor=store.get('v2-color','#E87586');
 let color=typeof savedColor==='string'?savedColor:'#E87586',mode='brush',size=11,ink=false,ready=false,busy=false,pointer=null,previous=null,previousPrevious=null,dirty=false,rev=0,queue=Promise.resolve(),saveTimer=null;
 const undo=[],redo=[];
 const chips=['#E87586','#E9A75A','#E5C65C','#77B68D','#78ABDC','#B499DD','#4F596B','#FFFFFF'];
 app.innerHTML=`<section class="v2-studio" aria-label="Freies Malen">
  <div class="v2-studio-surface" id="studio-surface"><canvas id="studio-canvas" aria-label="Malfläche. Male mit deinem Finger oder einem Stift."></canvas></div>
  <nav class="v2-studio-top" aria-label="Malen-Navigation"><button id="studio-back" class="v2-floating-icon" aria-label="Zurück">${v2Icon('back',29)}</button><div class="v2-studio-top-right"><span class="v2-save-indicator" id="studio-save-state" aria-live="polite"></span><button id="studio-gallery" class="v2-floating-icon" aria-label="Meine Bilder">${v2Icon('gallery',27)}</button><button id="studio-new" class="v2-new-sheet" aria-label="Neues Blatt beginnen. Altes Bild wird gespeichert.">${v2Icon('new',29)}<span>Neues Blatt</span></button></div></nav>
  <div class="v2-studio-bottom"><div class="v2-dock" aria-label="Malwerkzeuge"><button id="studio-brush" class="v2-dock-tool selected" aria-label="Pinsel und Malwerkzeuge">${v2Icon('brush')}</button><div class="v2-color-dock">${chips.map((c,i)=>`<button class="v2-color ${c===color?'selected':''}" style="--swatch:${c}" data-c="${c}" aria-label="Farbe ${i+1}" title="Farbe ${i+1}"></button>`).join('')}</div><button id="studio-undo" class="v2-dock-tool" aria-label="Rückgängig">${v2Icon('undo',26)}</button><button id="studio-redo" class="v2-dock-tool" aria-label="Wiederholen">${v2Icon('redo',26)}</button><button id="studio-more" class="v2-dock-tool" aria-label="Weitere Optionen">${v2Icon('more',26)}</button></div></div>
  <div id="studio-tool-menu" class="v2-tool-menu" hidden><h2>Mein Pinsel</h2><div class="v2-tool-options">${[['brush','Pinsel'],['crayon','Wachsmaler'],['marker','Filzstift'],['chalk','Kreide'],['rainbow','Regenbogen'],['eraser','Radierer'],['star','Sterne']].map(([m,n])=>`<button data-mode="${m}" class="${m===mode?'chosen':''}">${n}</button>`).join('')}</div><h2>Pinselgröße</h2><div class="v2-size-options">${[5,11,22,36].map(n=>`<button data-width="${n}" class="${n===size?'chosen':''}"><span style="height:${Math.min(n,24)}px;width:${Math.min(n,24)}px"></span></button>`).join('')}</div></div>
  <div class="v2-more-menu" id="studio-more-menu" hidden><button id="studio-paper">Papierfarbe ändern</button><button id="studio-share">Bild in Galerie speichern</button><button id="studio-help">So funktioniert Malen</button></div>
 </section>`;
 const canvas=document.getElementById('studio-canvas'),stage=document.getElementById('studio-surface');
 const ctx=canvas.getContext('2d',{alpha:false}),dpr=Math.min(2,window.devicePixelRatio||1);
 let W=0,H=0,paper=store.get('v2-paper','#FFFFFF');
 function fillPaper(){ctx.save();ctx.fillStyle=paper;ctx.fillRect(0,0,W,H);ctx.restore();}
 function resize(){const r=stage.getBoundingClientRect();if(r.width<40||r.height<40)return;
  const prev=document.createElement('canvas');if(canvas.width){prev.width=canvas.width;prev.height=canvas.height;prev.getContext('2d').drawImage(canvas,0,0);}
  W=r.width;H=r.height;canvas.width=Math.round(W*dpr);canvas.height=Math.round(H*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);fillPaper();if(prev.width){const ratio=Math.min(W/(prev.width/dpr),H/(prev.height/dpr)),nw=prev.width/dpr*ratio,nh=prev.height/dpr*ratio;ctx.drawImage(prev,0,0,prev.width,prev.height,(W-nw)/2,(H-nh)/2,nw,nh);}
 }
 resize();const watcher=typeof ResizeObserver!=='undefined'?new ResizeObserver(()=>resize()):null;watcher?.observe(stage);
 const indicator=document.getElementById('studio-save-state');
 const setStatus=msg=>{if(indicator)indicator.textContent=msg;};
 function serialize(){return canvas.toDataURL('image/png');}
 function saveDraft(force=false){if(!ready||busy||(!dirty&&!force))return queue;const revision=rev,data=serialize();setStatus('Speichert …');clearTimeout(saveTimer);saveTimer=null;
  queue=queue.catch(()=>{}).then(()=>writeDraftInOrder({id:draftId,type:'draft',data,profile,created:Date.now(),hasInk:ink}));
  queue.then(()=>{if(rev===revision){dirty=false;setStatus('✓ Gesichert');}}).catch(()=>setStatus('⚠ Nicht gespeichert'));
  return queue;
 }
 function scheduleSave(){dirty=true;rev++;clearTimeout(saveTimer);saveTimer=setTimeout(()=>saveDraft(),650);}
 function remember(){try{undo.push(serialize());if(undo.length>15)undo.shift();redo.length=0;}catch{}}
 function restoreImage(data,then){let image=new Image();image.onload=()=>{fillPaper();const scale=Math.min(W/image.width,H/image.height),w=image.width*scale,h=image.height*scale;ctx.drawImage(image,(W-w)/2,(H-h)/2,w,h);then?.();};image.onerror=()=>then?.();image.src=data;}
 function xy(e){const r=canvas.getBoundingClientRect();return{x:e.clientX-r.left,y:e.clientY-r.top};}
 function dot(p){ctx.save();ctx.globalAlpha=mode==='chalk'?.55:mode==='marker'?.72:1;ctx.fillStyle=mode==='eraser'?paper:mode==='rainbow'?'#A89DE7':color;ctx.beginPath();ctx.arc(p.x,p.y,Math.max(2,size/2),0,Math.PI*2);ctx.fill();ctx.restore();}
 function star(p){ctx.save();ctx.fillStyle=color;ctx.beginPath();for(let i=0;i<10;i++){let a=(i*Math.PI/5)-Math.PI/2,r=i%2?size*.75:size*1.7,x=p.x+r*Math.cos(a),y=p.y+r*Math.sin(a);if(i)ctx.lineTo(x,y);else ctx.moveTo(x,y);}ctx.closePath();ctx.fill();ctx.restore();}
 function segment(p,q){ctx.save();ctx.lineCap='round';ctx.lineJoin='round';ctx.lineWidth=mode==='eraser'?Math.max(25,size*2.1):size;ctx.globalAlpha=mode==='chalk'?.56:mode==='marker'?.67:1;ctx.strokeStyle=mode==='eraser'?paper:mode==='rainbow'?`hsl(${(p.x+p.y)*.35%360} 82% 63%)`:color;
  if(mode==='crayon'){ctx.globalAlpha=.86;ctx.lineWidth=size*1.25;}ctx.beginPath();ctx.moveTo(q.x,q.y);ctx.quadraticCurveTo(q.x,q.y,p.x,p.y);ctx.stroke();ctx.restore();}
 canvas.addEventListener('pointerdown',e=>{if(!ready||busy||pointer!==null||(e.pointerType==='mouse'&&e.button!==0))return;e.preventDefault();pointer=e.pointerId;remember();previous=xy(e);previousPrevious=previous;ink=true; if(mode==='star')star(previous);else dot(previous);scheduleSave();try{canvas.setPointerCapture(pointer)}catch{}});
 canvas.addEventListener('pointermove',e=>{if(pointer!==e.pointerId||busy)return;e.preventDefault();const p=xy(e);if(mode==='star'){if(Math.hypot(p.x-previous.x,p.y-previous.y)>size*4){star(p);previous=p;}}else{segment(p,previous);previousPrevious=previous;previous=p;}ink=true;dirty=true;rev++;});
 const finish=e=>{if(e.pointerId!==pointer)return;pointer=null;scheduleSave();};for(const ev of ['pointerup','pointercancel','lostpointercapture'])canvas.addEventListener(ev,finish);
 const changeColor=button=>{color=button.dataset.c;store.set('v2-color',color);app.querySelectorAll('.v2-color').forEach(b=>b.classList.toggle('selected',b===button));if(mode==='eraser'){mode='brush';updateMode();}};
 app.querySelectorAll('.v2-color').forEach(b=>b.addEventListener('click',()=>changeColor(b)));
 const toolMenu=document.getElementById('studio-tool-menu'),moreMenu=document.getElementById('studio-more-menu');
 function showMenu(menu){const was=menu.hidden;toolMenu.hidden=true;moreMenu.hidden=true;if(was)menu.hidden=false;}
 const updateMode=()=>{toolMenu.querySelectorAll('[data-mode]').forEach(b=>b.classList.toggle('chosen',b.dataset.mode===mode));};
 on('studio-brush','click',()=>showMenu(toolMenu));on('studio-more','click',()=>showMenu(moreMenu));
 toolMenu.querySelectorAll('[data-mode]').forEach(b=>b.addEventListener('click',()=>{mode=b.dataset.mode;updateMode();toolMenu.hidden=true;}));
 toolMenu.querySelectorAll('[data-width]').forEach(b=>b.addEventListener('click',()=>{size=Number(b.dataset.width);toolMenu.querySelectorAll('[data-width]').forEach(x=>x.classList.toggle('chosen',x===b));}));
 function step(from,to){if(!from.length||busy||pointer!==null)return; const shot=from.pop();to.push(serialize());if(to.length>15)to.shift();ready=false;restoreImage(shot,()=>{ink=true;ready=true;scheduleSave();});}
 on('studio-undo','click',()=>step(undo,redo));on('studio-redo','click',()=>step(redo,undo));
 on('studio-back','click',()=>route('home'));on('studio-gallery','click',()=>route('gallery'));
 on('studio-paper','click',()=>{paper=paper==='#FFFFFF'?'#FFF4DE':paper==='#FFF4DE'?'#E8F4FD':'#FFFFFF';store.set('v2-paper',paper);moreMenu.hidden=true;toast('Papierfarbe für neue Blätter ausgewählt');});
 on('studio-share','click',async()=>{if(!ready||busy||!ink)return toast('Male zuerst etwas Schönes.');try{await saveDraft(true);await saveToGallery(serialize(),'Mein Kunstwerk');moreMenu.hidden=true;}catch{toast('Speichern fehlgeschlagen');}});
 on('studio-help','click',()=>{moreMenu.hidden=true;toast('Male mit dem Finger. Neues Blatt speichert dein Bild!');});
 const nextButton=document.getElementById('studio-new');
 on('studio-new','click',async()=>{
  if(!ready||busy||pointer!==null)return;busy=true;nextButton.disabled=true;setStatus('Sichere dein Bild …');
  clearTimeout(saveTimer);saveTimer=null;toolMenu.hidden=true;moreMenu.hidden=true;
  try{
   await queue;await draftWriteQueue.catch(()=>{});
   const old=ink?serialize():null;
   const tmp=document.createElement('canvas');tmp.width=canvas.width;tmp.height=canvas.height;const t=tmp.getContext('2d');t.fillStyle=paper;t.fillRect(0,0,tmp.width,tmp.height);const blank=tmp.toDataURL('image/png');
   const database=await db();const picId='img-'+Date.now()+'-'+Math.floor(Math.random()*100000);const galleryPicture=old?{id:picId,type:'gallery',label:'Mein Bild',data:old,profile,created:Date.now()}:null;
   await new Promise((resolve,reject)=>{const tx=database.transaction('pictures','readwrite'),os=tx.objectStore('pictures');if(galleryPicture)os.put(galleryPicture);os.put({id:draftId,type:'draft',data:blank,profile,created:Date.now(),hasInk:false});tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error||new Error('Speicherfehler'));tx.onabort=()=>reject(tx.error||new Error('Speicher abgebrochen'));});
   fillPaper();undo.length=0;redo.length=0;ink=false;dirty=false;rev++;setStatus(old?'✓ Bild gesichert':'✓ Neues Blatt');beep();
  }catch(e){setStatus('⚠ Bitte erneut versuchen');toast('Das Bild konnte nicht gespeichert werden.');}
  finally{busy=false;nextButton.disabled=false;}
 });
 let loading=true;getPic(draftId).then(saved=>{if(saved?.data){restoreImage(saved.data,()=>{ink=saved.hasInk===undefined?true:!!saved.hasInk;ready=true;setStatus('✓ Bereit');});}else{ready=true;setStatus('✓ Bereit');}}).catch(()=>{ready=true;setStatus('⚠ Lokaler Speicher prüfen');});
 const onHide=()=>{if(document.visibilityState==='hidden')saveDraft();};const onPage=()=>saveDraft();document.addEventListener('visibilitychange',onHide);window.addEventListener('pagehide',onPage);
 cleanup.push(()=>{document.body.classList.remove('studio-active');clearTimeout(saveTimer);watcher?.disconnect();document.removeEventListener('visibilitychange',onHide);window.removeEventListener('pagehide',onPage);if(dirty&&!busy)saveDraft();});
}

function v2Parents(){
 const panel=app.querySelector('.panel');if(!panel)return;
 const profiles=store.get('v2-profiles',[{id:'main',name:settings.childName||'Kind 1'}]);if(!Array.isArray(profiles)||!profiles.length)return;
 const active=v2Profile();
 const box=document.createElement('section');box.className='v2-profile-panel';
 box.innerHTML=`<h2>Kinderprofile</h2><p>Jedes Kind erhält eigene Malblätter und eine eigene Bildergalerie. Bestehende Bilder gehören zum ersten Profil.</p><div class="v2-profile-row"><select id="v2-profile-select" aria-label="Aktives Kinderprofil">${profiles.map(p=>`<option value="${esc(p.id)}" ${p.id===active?'selected':''}>${esc(p.name)}</option>`).join('')}</select><input id="v2-profile-name" maxlength="24" placeholder="Neuer Kindername" aria-label="Neuer Kindername"/><button id="v2-add-profile" type="button">Profil hinzufügen</button></div><p class="v2-profile-note">Für jedes Profil kannst du die anderen Familieneinstellungen getrennt anpassen, indem du das Profil auswählst.</p>`;
 panel.insertBefore(box,panel.firstChild);
 box.querySelector('#v2-profile-select').addEventListener('change',e=>{const selected=profiles.find(p=>p.id===e.target.value);if(!selected)return;store.set('v2-active-profile',selected.id);const prefs=store.get('v2-profile-settings-'+selected.id,{});settings=Object.assign(settings,prefs,{childName:selected.name});store.set('settings',settings);route('parents');});
 box.querySelector('#v2-add-profile').addEventListener('click',()=>{const name=box.querySelector('#v2-profile-name').value.trim();if(!name)return toast('Bitte einen Namen eingeben.');if(profiles.length>=6)return toast('Maximal sechs Profile.');const id='kid-'+Date.now();profiles.push({id,name:name.slice(0,24)});store.set('v2-profiles',profiles);store.set('v2-active-profile',id);store.set('v2-profile-settings-'+id,{childName:name.slice(0,24),ageBand:'2'});settings.childName=name.slice(0,24);settings.ageBand='2';store.set('settings',settings);route('parents');});
 for(const id of ['setting-name','setting-age','setting-theme','setting-sound','setting-quiet','setting-easy','setting-fullscreen']){
  const el=document.getElementById(id);if(el)el.addEventListener('change',()=>{const profileId=v2Profile();const profilePrefs={childName:settings.childName,ageBand:settings.ageBand,theme:settings.theme,sound:settings.sound,quiet:settings.quiet,easy:settings.easy,fullscreenDefault:settings.fullscreenDefault};store.set('v2-profile-settings-'+profileId,profilePrefs);if(id==='setting-name'){const p=profiles.find(x=>x.id===profileId);if(p){p.name=settings.childName||p.name;store.set('v2-profiles',profiles);}}});
 }
}

/* Vier neue kreative Aktivitaeten; keine Netzwerkanfragen und kein Zeitdruck. */
function blocks(){
 frame('Meine Bausteine','Baue deinen eigenen Turm.',`<div class="v2-mini-game blocks-game"><div class="v2-blockstage"><div id="block-tower" class="v2-block-tower" aria-label="Dein Turm"></div></div><div class="v2-block-controls"><button id="block-add" class="v2-joy-button">${v2Icon('new')} Stein drauf!</button><button id="block-drop" class="v2-joy-button secondary">Umwerfen!</button></div></div>`);
 const tower=document.getElementById('block-tower');let n=0;const colors=['#df8897','#92b9d8','#eec579','#a0cba7','#af9bd5'];
 on('block-add','click',()=>{if(n>12)n=0;let b=document.createElement('div');b.className='v2-block';b.style.background=colors[n%colors.length];b.style.transform=`rotate(${(n%5-2)*3}deg)`;tower.prepend(b);n++;beep('pop');});
 on('block-drop','click',()=>{tower.classList.add('fall');beep();setTimeout(()=>{if(activePage==='blocks'){tower.replaceChildren();tower.classList.remove('fall');n=0;}},600);});
}
function sort(){
 const objs=[['#E87586','Rot'],['#77B68D','Grün'],['#78ABDC','Blau']];let round=0;
 frame('Farben sortieren','Schiebe die Kugel in den passenden Korb.',`<div class="v2-mini-game v2-sort"><div class="v2-sort-object" id="sort-ball" role="img" aria-label="Farbige Kugel"></div><div class="v2-sort-baskets" id="sort-baskets"></div><p id="sort-status" aria-live="polite"></p></div>`);
 function next(){const a=objs[round%objs.length];const ball=document.getElementById('sort-ball');ball.style.background=a[0];ball.setAttribute('aria-label',a[1]+'e Kugel');document.getElementById('sort-status').textContent='Welche Farbe passt?';const choices=[...objs].sort(()=>Math.random()-.5);document.getElementById('sort-baskets').innerHTML=choices.map(c=>`<button class="v2-basket" data-color="${c[0]}" aria-label="${c[1]}"><span style="background:${c[0]}"></span>${c[1]}</button>`).join('');document.querySelectorAll('.v2-basket').forEach(b=>b.addEventListener('click',()=>{if(b.dataset.color===a[0]){document.getElementById('sort-status').textContent='Das passt!';beep();round++;setTimeout(()=>{if(activePage==='sort')next()},500);}else{beep('no');document.getElementById('sort-status').textContent='Probier einen anderen Korb.';}}));}
 next();
}
function aquarium(){
 frame('Mein Aquarium','Lass deine eigene Unterwasserwelt entstehen.',`<div class="v2-mini-game aquarium-game"><div id="v2-sea" class="v2-sea" aria-label="Dein Aquarium"><div class="v2-seabed"></div></div><div class="v2-sea-controls"><button id="sea-fish" class="v2-joy-button">Fisch dazu</button><button id="sea-plant" class="v2-joy-button secondary">Pflanze dazu</button><button id="sea-clear" class="v2-joy-button neutral">Neu anfangen</button></div></div>`);
 const sea=document.getElementById('v2-sea');let count=0;
 function add(type){if(count>=25)return toast('Das Aquarium ist schon voll.');const b=document.createElement('span');b.className=type==='fish'?'v2-fish':'v2-seaplant';b.textContent=type==='fish'?['🐠','🐟','🐡'][count%3]:'🌿';b.style.left=(10+(count*31)%75)+'%';b.style.top=(15+(count*13)%66)+'%';sea.append(b);count++;beep('pop');}
 on('sea-fish','click',()=>add('fish'));on('sea-plant','click',()=>add('plant'));on('sea-clear','click',()=>{sea.querySelectorAll('.v2-fish,.v2-seaplant').forEach(x=>x.remove());count=0;});
}
function seek(){
 const rounds=[{target:'Schmetterling',items:['🦋','🐝','🌼','🐞','🌳','☀️']},{target:'Sonne',items:['🌙','☁️','⭐','☀️','🪁','🐦']},{target:'Schnecke',items:['🐌','🐛','🍄','🌻','🐞','🪻']}];let round=0;
 frame('Ich entdecke was','Findest du das gesuchte Bild?',`<div class="v2-mini-game"><p class="v2-seek-target" id="seek-prompt"></p><div class="v2-seek-grid" id="seek-grid"></div><p id="seek-status" aria-live="polite"></p></div>`);
 function next(){const r=rounds[round%rounds.length];document.getElementById('seek-prompt').textContent='Wo ist '+(r.target==='Schmetterling'?'der ':r.target==='Sonne'?'die ':'die ')+r.target+'?';document.getElementById('seek-grid').innerHTML=r.items.map(e=>`<button class="v2-seek-item" data-symbol="${e}" aria-label="Bild auswählen">${e}</button>`).join('');document.querySelectorAll('.v2-seek-item').forEach(b=>b.addEventListener('click',()=>{let correct=r.items[0];if(r.target==='Sonne')correct='☀️';if(b.dataset.symbol===correct){document.getElementById('seek-status').textContent='Prima entdeckt!';beep();round++;setTimeout(()=>{if(activePage==='seek')next()},550);}else{beep('no');document.getElementById('seek-status').textContent='Schau nochmal genau.';}}));}
 next();
}
