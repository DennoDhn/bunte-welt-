/* Meine bunte Welt 2.0 — kindgerechte Oberflaeche, Kreativstudio und vier Spiele. */
'use strict';
const BW_MALKISTE_SHEETS=Object.freeze([
 {id:"malkiste-horse",name:"Pferd mit Fohlen",src:'motifs/malkiste-pferd-fohlen.png'},
 {id:"malkiste-pony",name:"Pony mit Zöpfen",src:'motifs/malkiste-pferd-pony.png'},
 {id:"malkiste-unicorn",name:"Einhorn mit Regenbogen",src:'motifs/malkiste-einhorn-regenbogen.png'},
 {id:"malkiste-unicorn-baby",name:"Mama und Baby-Einhorn",src:'motifs/malkiste-einhorn-baby.png'},
 {id:"malkiste-cat",name:"Katze mit Wollknäuel",src:'motifs/malkiste-katze-wollknaeuel.png'},
 {id:"malkiste-dog",name:"Hund mit Knochen",src:'motifs/malkiste-hund-knochen.png'},
 {id:"malkiste-rabbit",name:"Hase mit Karotte",src:'motifs/malkiste-hase-karotte.png'},
 {id:"malkiste-cow",name:"Kuh auf der Wiese",src:'motifs/malkiste-kuh.png'},
 {id:"malkiste-chicks",name:"Henne mit Küken",src:'motifs/malkiste-huehner.png'},
 {id:"malkiste-tractor",name:"Traktor mit Anhänger",src:'motifs/malkiste-traktor.png'},
 {id:"malkiste-firetruck",name:"Feuerwehrauto",src:'motifs/malkiste-feuerwehrauto.png'},
]);
const studioWorlds=['hof','hof','zauber','zauber','haus','haus','haus','hof','hof','hof','stadt'];
function sheetCatalog(){
 const detailed=BW_MALKISTE_SHEETS.map((sheet,i)=>({...sheet,world:studioWorlds[i]}));
 const simple=['horse','unicorn'].map((animal,i)=>({
  id:'simple-'+animal,name:i?'Einhorn (einfach)':'Pferd (einfach)',world:i?'zauber':'hof',
  src:'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(window.bwHorseUnicornColoring(animal,{}))
 }));
 const vehiclesAndRabbit=[
  ['firetruck','Feuerwehrauto','stadt'],['tractor','Traktor','hof'],['rabbit','Hase','haus']
 ].map(([id,name,world])=>({id:'simple-'+id,name:name+' (einfach)',world,src:'motifs/simple-'+id+'.svg'}));
 const sheets=WORLDS.flatMap(w=>w.items.map(item=>{
  const original=COLORING_SHEETS[item.sheet];
  return {id:item.id,name:item.name,world:w.id,src:original?.ink||
   'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(motifSvg(item,{}).replace('<svg ','<svg width="600" height="600" '))};
 }));
 return [...detailed,...simple,...vehiclesAndRabbit,...sheets];
}
function motifDraftId(profile,motif){return 'sheet-'+profile+'-'+motif;}
async function paintedPreviews(grid,profile){
 await draftWriteQueue;
 await Promise.all(Array.from(grid.querySelectorAll('[data-sheet], [data-motif]'),async button=>{
  const id=button.dataset.sheet||button.dataset.motif;
  const saved=await getPic(motifDraftId(profile,id));
  if(saved?.preview&&button.isConnected)button.querySelector('img').src=saved.preview;
 })).catch(()=>{});
}



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
   puzzle:'<path d="M52 37h44c-10-25 28-28 26 0h37v33c23-8 31 26 5 28l-5-1v39h-38c7-28-31-28-28 0H52V99c28 8 27-30 0-25Z" fill="#73a992" stroke="#477967" stroke-width="5" stroke-linejoin="round"/>',
   scratch:'<rect x="43" y="32" width="148" height="111" rx="18" fill="#b5a2d9"/><path d="m61 111 30-42 21 25 21-19 39 48H61Z" fill="#f8e5ab"/><circle cx="148" cy="58" r="13" fill="#f9d76d"/><path d="m169 100 30-38" stroke="#684e8b" stroke-width="10" stroke-linecap="round"/><path d="m196 34 4 10 10 4-10 4-4 11-4-11-10-4 10-4Z" fill="#efbd53"/>',
   soundboard:'<rect x="52" y="28" width="137" height="120" rx="22" fill="#567b91"/>'+['#e7ab79','#d487a5','#93c8b2','#edca77'].map((c,i)=>`<rect x="${66+(i%2)*55}" y="${41+Math.floor(i/2)*49}" width="49" height="44" rx="12" fill="${c}"/>`).join(''),
   music:['#d86a70','#e49757','#e5be65','#8bbb83','#77adc8','#a58cc2'].map((fill,i)=>`<rect x="${30+i*28}" y="${35+i*5}" width="26" height="${102-i*8}" rx="9" fill="${fill}"/><circle cx="${43+i*28}" cy="${49+i*5}" r="3" fill="#fff5db"/>`).join('')+'<path d="m78 155 92-74" stroke="#795d49" stroke-width="8" stroke-linecap="round"/><circle cx="171" cy="80" r="13" fill="#544958"/>',
   draw:'<path d="M22 138q32-49 61-12t60-12" fill="none" stroke="#df637c" stroke-width="13" stroke-linecap="round"/><g transform="rotate(39 147 82)"><rect x="128" y="13" width="38" height="92" rx="6" fill="#df637c"/><path d="M128 104h38l-19 39z" fill="#edbd91"/><path d="m139 127 8 16 8-16z" fill="#704555"/><path d="M138 27v67" stroke="#ffa2ad" stroke-width="8" stroke-linecap="round"/></g>',
   color:'<g stroke="#584d70" stroke-width="5" stroke-linejoin="round"><path d="m34 84 45-32v64z" fill="#fffaf2"/><ellipse cx="129" cy="84" rx="60" ry="43" fill="#f3bf66"/><path d="M119 43q-40 40 0 82-43-3-50-41 6-34 50-41Z" fill="#fffaf2"/><path d="m132 82-22 17 2-32z" fill="#eb879a"/></g><circle cx="164" cy="77" r="6" fill="#443d55"/><g fill="#9ecfdc"><circle cx="200" cy="55" r="9"/><circle cx="214" cy="31" r="5"/></g>',
   play:'<rect x="29" y="75" width="84" height="84" rx="22" fill="#8DBED8" transform="rotate(-13 71 117)"/><rect x="115" y="31" width="80" height="80" rx="20" fill="#F0C976" transform="rotate(13 155 71)"/><circle cx="172" cy="130" r="30" fill="#EAA5B1"/>',
   explore:'<path d="M101 163C78 108 96 54 169 34c0 71-24 120-68 129Z" fill="#96C9A6"/><path d="M101 161C80 109 62 86 28 83c-1 66 24 89 73 78Z" fill="#C3DB8F"/><path d="M101 169c6-63 35-107 64-129" fill="none" stroke="#5E987E" stroke-width="8" stroke-linecap="round"/><circle cx="182" cy="139" r="17" fill="#F0BF71"/>',
   gallery:'<rect x="39" y="28" width="151" height="131" rx="20" fill="#F0D9B5"/><rect x="48" y="36" width="133" height="113" rx="14" fill="#FDFDFB"/><circle cx="151" cy="70" r="19" fill="#EEC26A"/><path d="M58 132 99 82l32 28 17-15 27 37Z" fill="#8FC6A7"/>',
  };return `<svg class="v2-illustration" viewBox="0 0 245 175" aria-hidden="true">${paths[key]||paths.play}</svg>`;
}
function v2Home(){
 document.body.classList.remove('studio-active');
 const greeting=settings.childName?`Hallo, ${esc(settings.childName)}!`:'Was möchtest du machen?';
 const chosen=Array.isArray(settings.favorites)?settings.favorites:[];
 const byId=new Map(ALL_ACTIVITIES.map(a=>[a[0],a]));
 byId.set('music',['music','Xylophon','🎶']);
 byId.set('soundboard',['soundboard','Klangwelt','🔊']);
 const ids=[...new Set(['puzzle','scratch','music',...chosen,'draw','color','soundboard',...byId.keys()])];
 const resume=store.get('resume-'+v2Profile());
 const cards=ids.filter(id=>byId.has(id)).map((id,i)=>{
   const [,name,emoji]=byId.get(id);
   const art=['draw','color','music','scratch','puzzle','soundboard'].includes(id)?v2CuratedIllustration(id):`<span class="v2-emoji" aria-hidden="true">${emoji}</span>`;
   return `<button class="v2-gamecard tone-${i%5}" data-game="${id}"><span class="v2-game-art">${art}</span><strong>${esc(name)}</strong></button>`;
 });
 app.innerHTML=`<main class="v2-home"><header class="v2-home-head"><div class="v2-brand">Meine bunte Welt</div><button class="v2-circle" id="parent" aria-label="Elternbereich">${v2Icon('gear',25)}</button></header><section class="v2-welcome"><h1>${greeting}</h1></section><div class="v2-cardgrid">${cards.slice(0,6).join('')}</div>${resume&&['draw','puzzle','color'].includes(resume.page)?'<button id="world-resume" class="big-btn">↩ '+({draw:'Weitermalen',puzzle:'Weiterpuzzeln',color:'Weiter ausmalen'})[resume.page]+'</button>':''}${worldTiles()}<h2>Weitere Spiele</h2><div class="v2-cardgrid">${cards.slice(6).join('')}</div><footer class="v2-home-footer"><button class="v2-gallery-entry" data-game="gallery">🖼️ Meine Bilder</button></footer></main>`;
 app.querySelectorAll('[data-game]').forEach(button=>button.addEventListener('click',()=>route(button.dataset.game)));
 app.querySelectorAll('[data-world]').forEach(b=>b.onclick=()=>{currentWorld=WORLDS.find(w=>w.id===b.dataset.world);route('world')});
 on('world-resume','click',()=>{currentWorld=WORLDS.find(w=>w.id===resume.world)||null;route(resume.page)});
 on('parent','click',openParentGate);
}
function v2Category(){
 const c=CATEGORIES[currentCategory];
 const fav=Array.isArray(settings.favorites)?settings.favorites:[];
 app.innerHTML=`<main class="v2-categories"><header class="v2-list-head"><button class="v2-circle" id="back" aria-label="Zur Spielauswahl">🏠</button><h1>${currentCategory==='paint'?'Kreativ sein':currentCategory==='play'?'Spielen':'Entdecken'}</h1><button class="v2-circle" id="parent" aria-label="Elternbereich">${v2Icon('gear')}</button></header><div class="v2-cardgrid">${c.activities.map(([id,name,emoji],i)=>`<button class="v2-gamecard tone-${i%5}" data-game="${id}"><span class="v2-game-art">${id==='draw'?v2CuratedIllustration('draw'):id==='color'?v2CuratedIllustration('color'):`<span class="v2-emoji" aria-hidden="true">${emoji}</span>`}</span><strong>${name}</strong></button>`).join('')}</div></main>`;
 on('back','click',()=>route('home'));on('parent','click',openParentGate);
 app.querySelectorAll('[data-game]').forEach(b=>b.addEventListener('click',()=>route(b.dataset.game)));
}
function v2Gallery(){
 const profile=v2Profile();
 app.innerHTML=`<main class="v2-gallery-page"><header class="v2-list-head"><button id="back" class="v2-circle" aria-label="Zur Spielauswahl">🏠</button><h1>Meine Bilder</h1><button id="gallery-new" class="v2-primary-small">${v2Icon('new',23)} Neues Bild</button></header><div class="v2-gallery-grid" id="v2-gallery-grid"><p>Deine Bilder werden geladen …</p></div></main>`;
 on('back','click',()=>route('home'));on('gallery-new','click',()=>route('draw'));
 allPics().then(pictures=>{
  if(activePage!=='gallery')return;
  const all=pictures.filter(p=>p.type==='gallery'&&(p.profile||'main')===profile).sort((a,b)=>b.created-a.created);
  const el=document.getElementById('v2-gallery-grid');
  if(!all.length){el.innerHTML=`<div class="v2-empty-gallery">${v2CuratedIllustration('gallery')}<h2>Hier ist Platz für deine Kunstwerke.</h2><button class="v2-primary-small" id="gallery-start">Jetzt malen</button></div>`;on('gallery-start','click',()=>route('draw'));return;}
  el.innerHTML=all.map((p,i)=>`<article class="v2-gallery-card"><button class="picture-open" data-open="${i}" aria-label="Bild ${all.length-i} zum Weitermalen öffnen"><img alt="" data-picture="${i}"/></button><div class="v2-gallery-meta"><span>Bild ${all.length-i}</span><button class="v2-reopen" data-open="${i}" aria-label="Bild zum Weitermalen öffnen">${v2Icon('brush',21)} Weiter malen</button></div></article>`).join('');
  all.forEach((p,i)=>{el.querySelector(`[data-picture="${i}"]`).src=p.data;});
  el.querySelectorAll('[data-open]').forEach(b=>b.addEventListener('click',async()=>{
   if(el.dataset.opening)return;el.dataset.opening='yes';
   try{
    const selected=all[Number(b.dataset.open)];const id=v2DraftId();await draftWriteQueue.catch(()=>{});const saved=await getPic(id);
    const database=await db();
    await new Promise((resolve,reject)=>{
     const tx=database.transaction('pictures','readwrite');
     const pictures=tx.objectStore('pictures');
     if(saved?.data&&saved.hasInk!==false&&saved.data!==selected.data){
      pictures.put({id:'img-'+Date.now()+'-previous',type:'gallery',label:'Mein Bild',data:saved.data,outline:saved.outline,profile,created:Date.now()});
     }
     pictures.put({id,type:'draft',label:'Mein Bild',data:selected.data,outline:selected.outline,profile,hasInk:true,created:Date.now()});
     tx.oncomplete=resolve;tx.onabort=()=>reject(tx.error);
    });
    if(el.isConnected)route('draw');
   }catch{toast('Das Bild konnte nicht geöffnet werden.');delete el.dataset.opening;}
  }));
 }).catch(()=>{let el=document.getElementById('v2-gallery-grid');if(el)el.textContent='Galerie nicht verfügbar. Speicher prüfen.';});
}
// Label connected paper regions from the protected outline, independently of paint.
function regionPicker(overlay,width,height){
 const mask=document.createElement('canvas');
 mask.width=Math.ceil(width);mask.height=Math.ceil(height);
 const w=mask.width,h=mask.height;
 const context=mask.getContext('2d');
 context.drawImage(overlay,0,0,w,h);
 const pixels=context.getImageData(0,0,w,h).data;
 const labels=new Int32Array(w*h);
 for(let n=0;n<labels.length;n++)if(pixels[4*n+3]>40)labels[n]=-1;
 const paths=[null];
 return point=>{
  const x=Math.floor(point.x),y=Math.floor(point.y);
  if(x<0||y<0||x>=w||y>=h)return null;
  const start=y*w+x;
  if(labels[start]===-1)return null;
  if(labels[start])return paths[labels[start]];
  const id=paths.length,path=new Path2D(),pending=[start];
  paths.push(path);
  while(pending.length){
   const seed=pending.pop();
   if(labels[seed])continue;
   const row=Math.floor(seed/w),first=row*w,last=first+w-1;
   let left=seed,right=seed;
   while(left>first&&!labels[left-1])left--;
   while(right<last&&!labels[right+1])right++;
   labels.fill(id,left,right+1);
   path.rect(left-first,row,right-left+1,1);
   for(const adjacent of [row-1,row+1]){
    if(adjacent<0||adjacent>=h)continue;
    const offset=(adjacent-row)*w;
    let inRun=false;
    for(let col=left;col<=right;col++){
     const open=labels[col+offset]===0;
     if(open&&!inRun)pending.push(col+offset);
     inRun=open;
    }
   }
  }
  return path;
 };
}
function v2Draw(options={}){
 document.body.classList.add('studio-active');
 const coloringMode=!!options.coloringMode;
 const profile=v2Profile(),draftId=(coloringMode?'coloring-':'')+v2DraftId();
 const chips=[['Rot','#DF5264'],['Gelb','#EAB326'],['Grün','#41A46B'],['Blau','#4389D2']];
 const extraColors=[['Orange','#F38332'],['Rosa','#F397BB'],['Lila','#9451B5'],['Türkis','#25B8AE'],['Braun','#945B39'],['Grau','#878B94'],['Schwarz','#272830'],['Hellblau','#86C9F0'],['Mint','#92D8B9'],['Pfirsich','#F1C4A6'],['Ocker','#B77B38'],['Dunkelbraun','#5B392B'],['Weiß','#FFFFFF']];
 const catalog=sheetCatalog();
 let currentMotif=null,undo=null;
 const brushes=[
  {id:'pencil',name:'Stift',symbol:'✏️',width:8},
  {id:'crayon',name:'Wachsmaler',symbol:'🖍️',width:22},
  {id:'brush',name:'Pinsel',symbol:'🖌️',width:40}
 ];
 const savedBrush=store.get('studio-brush-'+profile,'crayon');
 let brush=brushes.find(item=>item.id===savedBrush)||brushes[1];
 const savedColor=store.get('v2-color',chips[0][1]);
 let color=[...chips,...extraColors].some(([,hex])=>hex===savedColor)?savedColor:chips[0][1];
 let erasing=false;
 let ink=false,ready=false,busy=false,pointer=null,previous=null,dirty=false,rev=0,queue=Promise.resolve(),saveTimer=null;
 function swatch([name,hex]){
  return `<button class="v2-color ${hex===color?'selected':''}" style="--swatch:${hex}" data-c="${hex}" aria-label="${name}" aria-pressed="${hex===color}"></button>`;
 }
 app.innerHTML=`<section class="v2-studio" aria-label="${coloringMode?'Ausmalbilder':'Freies Malen'}">
  <div class="v2-studio-surface" id="studio-surface"><canvas id="studio-canvas" aria-label="Malfläche. Male mit deinem Finger oder einem Stift."></canvas><canvas id="studio-outline" aria-hidden="true"></canvas></div>
  <nav class="v2-studio-top" aria-label="Blatt wählen">
   <button id="studio-home" aria-label="Zur Spielauswahl">🏠</button>
   <button id="studio-sounds" aria-label="Klangwelt öffnen">🎵</button>
   <div class="brush-anchor">
    <button id="brush-toggle" aria-controls="brush-options" aria-expanded="false" aria-label="Malwerkzeug: ${brush.name}">${brush.symbol}</button>
    <div id="brush-options" role="group" aria-label="Strichstärke wählen" hidden>
     ${brushes.map(item=>`<button data-brush="${item.id}" aria-label="${item.name}" aria-pressed="${item===brush}"><span aria-hidden="true">${item.symbol}</span><i style="height:${item.width}px"></i></button>`).join('')}
    </div>
   </div>
   <button id="studio-undo" disabled aria-label="Letzten Strich zurücknehmen">↶</button>
   <button id="studio-new" class="v2-new-sheet" aria-label="Neues Blatt">${v2Icon('new',32)} Neues Blatt</button>
  </nav>
  <span class="sr-only" id="studio-save-state" role="status"></span>
  <div class="mini-tray">
   <div class="mini-colors" role="group" aria-label="Farben">${chips.map(swatch).join('')}</div>
   <button id="studio-colors" aria-label="Weitere Farben" aria-controls="extra-colors" aria-expanded="false">🎨</button>
   <button id="studio-motifs" aria-label="Ausmalmotiv wählen" aria-expanded="false">🐠</button>
  </div>
  <div class="mini-motifs mini-extra" id="extra-colors" role="group" aria-label="Weitere Malfarben" hidden>${extraColors.map(swatch).join('')}<button id="studio-eraser" aria-label="Radierer" aria-pressed="false">🧽</button></div>
  <div class="mini-motifs" id="motif-options" role="dialog" aria-label="Ausmalmotive auswählen" hidden>
   <div class="motif-picker-title"><strong>Bild aussuchen</strong><button id="motif-close" aria-label="Bilderauswahl schließen">✕</button></div>
   <div class="motif-picker-grid" id="motif-grid">
   ${catalog.map(({id,name,src})=>`<button class="character-sheet" data-sheet="${id}" aria-label="${name}"><img src="${src}" alt="" loading="lazy"><small>${name}</small></button>`).join('')}
   </div>
   <div class="motif-picker-navigation"><button id="motif-prev" aria-label="Bilder nach oben">▲</button><input type="range" id="motif-scrollbar" min="0" max="100" value="0" aria-label="Bilderliste durch Ziehen verschieben"><button id="motif-next" aria-label="Bilder nach unten">▼</button></div>
  </div>
 </section>`;
 const canvas=document.getElementById('studio-canvas'),stage=document.getElementById('studio-surface');
 const ctx=canvas.getContext('2d'),dpr=Math.min(2,window.devicePixelRatio||1);
 const overlay=document.getElementById('studio-outline');
 let outline=null;
 function fitImage(target,image){
  const scale=Math.min(target.width/image.width,target.height/image.height);
  const w=image.width*scale,h=image.height*scale;
  target.getContext('2d').drawImage(image,(target.width-w)/2,(target.height-h)/2,w,h);
 }
 function resizeOutline(){
  const previous=outline?overlay.cloneNode():null;
  if(previous)previous.getContext('2d').drawImage(overlay,0,0);
  overlay.width=canvas.width;overlay.height=canvas.height;
  if(previous){fitImage(overlay,previous);outline=overlay.toDataURL();}
 }
 let W=0,H=0,paper='#FFFFFF';
 const phoneViewport=window.matchMedia('(max-width:600px), (max-width:950px) and (max-height:500px)');
 let resizeMaster=null,outlineMaster=null,resizeRevision=-1;
 function fillPaper(){ctx.save();ctx.fillStyle=paper;ctx.fillRect(0,0,W,H);ctx.restore();}
 function resize(){const r=stage.getBoundingClientRect();if(r.width<40||r.height<40||(W===r.width&&H===r.height))return;
  pointer=null;
  const prev=W&&H?document.createElement('canvas'):null;if(prev){prev.width=canvas.width;prev.height=canvas.height;prev.getContext('2d').drawImage(canvas,0,0);}
  // Keep a single source while rotating a phone: never repeatedly shrink padded snapshots.
  let stable=prev;
  if(phoneViewport.matches&&prev){
   if(resizeRevision!==rev||!resizeMaster){
    resizeMaster=prev;outlineMaster=outline?overlay.cloneNode():null;
    if(outlineMaster)outlineMaster.getContext('2d').drawImage(overlay,0,0);
    resizeRevision=rev;
   }
   stable=resizeMaster;
  }else{resizeMaster=null;outlineMaster=null;resizeRevision=-1;}
  W=r.width;H=r.height;canvas.width=Math.round(W*dpr);canvas.height=Math.round(H*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);resizeOutline();
  if(phoneViewport.matches&&outlineMaster){overlay.getContext('2d').clearRect(0,0,overlay.width,overlay.height);fitImage(overlay,outlineMaster);outline=overlay.toDataURL();}
  fillPaper();if(stable){const prev=stable;const ratio=Math.min(W/(prev.width/dpr),H/(prev.height/dpr)),nw=prev.width/dpr*ratio,nh=prev.height/dpr*ratio;ctx.drawImage(prev,0,0,prev.width,prev.height,(W-nw)/2,(H-nh)/2,nw,nh);}
 }
 resize();const watcher=typeof ResizeObserver!=='undefined'?new ResizeObserver(()=>resize()):null;watcher?.observe(stage);
 const indicator=document.getElementById('studio-save-state');
 const setStatus=msg=>{indicator.textContent=msg;indicator.className=msg.startsWith('⚠')?'studio-save-error':'sr-only';};
 function serialize(){

  const result=canvas.cloneNode();
  const context=result.getContext('2d');
  context.fillStyle=paper;context.fillRect(0,0,result.width,result.height);
  context.drawImage(canvas,0,0);if(outline)context.drawImage(overlay,0,0);
  return result.toDataURL();
 }
 function saveDraft(force=false){if(!ready||busy||(!dirty&&!force))return queue;const revision=rev,data=canvas.toDataURL('image/png');setStatus('Speichert …');clearTimeout(saveTimer);saveTimer=null;
  const record={id:draftId,type:'draft',data,outline,profile,motif:currentMotif,created:Date.now(),hasInk:ink};
  if(currentMotif){
   const preview=document.createElement('canvas'),scale=Math.min(1,240/canvas.width,240/canvas.height);
   preview.width=Math.max(1,Math.round(canvas.width*scale));preview.height=Math.max(1,Math.round(canvas.height*scale));
   const context=preview.getContext('2d');context.fillStyle=paper;context.fillRect(0,0,preview.width,preview.height);
   context.drawImage(canvas,0,0,preview.width,preview.height);if(outline)context.drawImage(overlay,0,0,preview.width,preview.height);
   record.preview=preview.toDataURL();
  }
  queue=draftWriteQueue.then(()=>saveStudioRecords(record));
  draftWriteQueue=queue.catch(()=>{});
  queue.then(()=>{if(rev===revision){dirty=false;setStatus('✓ Gesichert');}}).catch(()=>setStatus('⚠ Nicht gespeichert'));
  return queue;
 }
 async function saveStudioRecords(record,gallery){
  const database=await db();
  await new Promise((resolve,reject)=>{
   const tx=database.transaction('pictures','readwrite'),os=tx.objectStore('pictures');
   os.put(record);
   if(record.motif)os.put({...record,id:motifDraftId(profile,record.motif)});
   if(gallery)os.put(gallery);
   tx.oncomplete=resolve;tx.onabort=()=>reject(tx.error);
  });
 }
 function scheduleSave(){dirty=true;rev++;clearTimeout(saveTimer);saveTimer=setTimeout(()=>saveDraft(),650);}
 function restoreImage(data,then){let image=new Image();image.onload=()=>{fillPaper();const scale=Math.min(W/image.width,H/image.height),w=image.width*scale,h=image.height*scale;ctx.drawImage(image,(W-w)/2,(H-h)/2,w,h);then?.();};image.onerror=()=>then?.();image.src=data;}
 function xy(e){const r=canvas.getBoundingClientRect();return{x:e.clientX-r.left,y:e.clientY-r.top};}

 canvas.addEventListener('pointerdown',e=>{
  if(!ready||busy||pointer!==null||e.button!==0)return;
  e.preventDefault();
  if(extras.hidden)setPicker(false);
  undo={canvas:canvas.cloneNode(),ink};undo.canvas.getContext('2d').drawImage(canvas,0,0);
  document.getElementById('studio-undo').disabled=false;
  previous=xy(e);
   // Farbe wird unter den unbeeinflussbaren Konturen aufgetragen.
   pointer=e.pointerId;
  ctx.save();
  
  ctx.globalCompositeOperation=erasing?'destination-out':'source-over';
  ctx.fillStyle=color;
  ctx.beginPath();
  ctx.arc(previous.x,previous.y,(erasing?44:brush.width)/2,0,Math.PI*2);
  ctx.fill();ctx.restore();
  if(!erasing)ink=true;
  scheduleSave();
  canvas.setPointerCapture(pointer);
 });
 canvas.addEventListener('pointermove',e=>{
  if(pointer!==e.pointerId||busy)return;
  const p=xy(e);
  ctx.save();
  ctx.globalCompositeOperation=erasing?'destination-out':'source-over';
  ctx.lineCap='round';ctx.lineWidth=erasing?44:brush.width;ctx.strokeStyle=color;
  ctx.beginPath();ctx.moveTo(previous.x,previous.y);ctx.lineTo(p.x,p.y);ctx.stroke();ctx.restore();
  previous=p;dirty=true;rev++;
 });
 const finish=e=>{if(e.pointerId!==pointer)return;pointer=null;scheduleSave();};for(const ev of ['pointerup','pointercancel','lostpointercapture'])canvas.addEventListener(ev,finish);
 const changeColor=button=>{
  erasing=false;
  syncTool();
  color=button.dataset.c;
  store.set('v2-color',color);
  updatePalette();
  app.querySelectorAll('.v2-color').forEach(b=>{
   const selected=b.dataset.c===color;
   b.classList.toggle('selected',selected);
   b.setAttribute('aria-pressed',String(selected));
  });
  setPicker(false);
 };
 app.querySelectorAll('.v2-color').forEach(b=>b.addEventListener('click',()=>changeColor(b)));
 const picker=document.getElementById('motif-options');
 const motifGrid=document.getElementById('motif-grid');
 const motifScrollbar=document.getElementById('motif-scrollbar');
 const syncMotifScroll=()=>{
  const max=Math.max(0,motifGrid.scrollHeight-motifGrid.clientHeight);
  motifScrollbar.value=max?Math.round(motifGrid.scrollTop/max*100):0;
  motifScrollbar.disabled=max<5;
 };
 motifGrid.addEventListener('scroll',syncMotifScroll,{passive:true});
 motifScrollbar.addEventListener('input',()=>{
  const max=motifGrid.scrollHeight-motifGrid.clientHeight;
  motifGrid.scrollTop=max*Number(motifScrollbar.value)/100;
 });
 on('motif-prev','click',()=>motifGrid.scrollBy({top:-Math.max(120,motifGrid.clientHeight*.75),behavior:'smooth'}));
 on('motif-next','click',()=>motifGrid.scrollBy({top:Math.max(120,motifGrid.clientHeight*.75),behavior:'smooth'}));
 on('motif-close','click',()=>setPicker(false));
 const paletteButton=document.getElementById('studio-colors');
 const extras=document.getElementById('extra-colors');
 function updatePalette(){
  const active=extraColors.find(([,hex])=>hex===color);
  paletteButton.style.background=active?color:'';

  paletteButton.setAttribute('aria-label',active?'Weitere Farben, gewählt: '+active[0]:'Weitere Farben');
 }
 updatePalette();
 on('studio-colors','click',()=>setPicker(extras.hidden?'colors':false));
 const brushToggle=document.getElementById('brush-toggle');
 const brushOptions=document.getElementById('brush-options');
 function syncTool(){
  brushToggle.textContent=erasing?'🧽':brush.symbol;
  brushToggle.setAttribute('aria-label',erasing?'Malwerkzeug: Radierer':'Malwerkzeug: '+brush.name);
  document.getElementById('studio-eraser').setAttribute('aria-pressed',String(erasing));
 }
 on('studio-eraser','click',()=>{
  erasing=true;syncTool();
  app.querySelectorAll('.v2-color').forEach(b=>{b.classList.remove('selected');b.setAttribute('aria-pressed','false');});
  setPicker(false);
 });
 brushToggle.addEventListener('click',()=>setPicker(brushOptions.hidden?'brushes':false));
 brushOptions.querySelectorAll('[data-brush]').forEach(button=>button.addEventListener('click',()=>{
  brush=brushes.find(item=>item.id===button.dataset.brush);
  store.set('studio-brush-'+profile,brush.id);
  changeColor(app.querySelector(`[data-c="${color}"]`));
  brushOptions.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
  setPicker(false);
 }));
 function setPicker(open){
  brushOptions.hidden=open!=='brushes';
  brushToggle.setAttribute('aria-expanded',String(!brushOptions.hidden));
  brushOptions.style.setProperty('--stroke-preview',color);
  extras.hidden=open!=='colors';
  paletteButton.setAttribute('aria-expanded',String(!extras.hidden));
  picker.hidden=open!=='motifs';
  document.getElementById('studio-motifs').setAttribute('aria-expanded',String(!picker.hidden));
  if(!picker.hidden){requestAnimationFrame(syncMotifScroll);paintedPreviews(picker,profile);}
 }
 on('studio-undo','click',()=>{
  if(!undo||busy||pointer!==null)return;
  fillPaper();const scale=Math.min(W/undo.canvas.width,H/undo.canvas.height);
  const w=undo.canvas.width*scale,h=undo.canvas.height*scale;
  ctx.drawImage(undo.canvas,(W-w)/2,(H-h)/2,w,h);ink=undo.ink;undo=null;
  document.getElementById('studio-undo').disabled=true;scheduleSave();
 });
 async function leaveStudio(page){
  if(!ready||busy||pointer!==null)return;
  const pending=saveDraft();busy=true;
  try{await pending;route(page);}catch{setStatus('⚠ Bild konnte nicht gespeichert werden.');}finally{busy=false;}
 }
 on('studio-sounds','click',()=>leaveStudio('soundboard'));
 on('studio-home','click',()=>leaveStudio('home'));
 on('studio-motifs','click',()=>{if(ready&&!busy)setPicker(picker.hidden?'motifs':false);});
 on('studio-new','click',()=>nextSheet(currentMotif,true));
 picker.querySelectorAll('[data-sheet]').forEach(button=>button.addEventListener('click',()=>nextSheet(button.dataset.sheet)));
 async function nextSheet(motif,fresh=false){
  if(!ready||busy||pointer!==null)return;
  if(motif&&currentMotif===motif&&!fresh){setPicker(false);return;}
  const pending=saveDraft();
  busy=true;setPicker(false);setStatus('Sichere dein Bild …');
  clearTimeout(saveTimer);saveTimer=null;
  try{
   await pending;
   const resumed=motif&&!fresh?await getPic(motifDraftId(profile,motif)):null;
   const old=ink?serialize():null;
   let lines=null;
   const tmp=document.createElement('canvas');tmp.width=canvas.width;tmp.height=canvas.height;const t=tmp.getContext('2d');t.fillStyle=paper;t.fillRect(0,0,tmp.width,tmp.height);if(motif){
    const image=new Image();
    const sheet=catalog.find(s=>s.id===motif);
    await new Promise((resolve,reject)=>{image.onload=resolve;image.onerror=reject;image.src=sheet.src;});
    const imageW=image.naturalWidth,imageH=image.naturalHeight;
    const scale=Math.min(tmp.width*.90/imageW,tmp.height*.90/imageH);
    t.drawImage(image,(tmp.width-imageW*scale)/2,(tmp.height-imageH*scale)/2,imageW*scale,imageH*scale);
    // Lift the printed lines from the untouched template, before the first finger stroke.
    lines=tmp.cloneNode();
    const raster=t.getImageData(0,0,tmp.width,tmp.height);
    for(let i=0;i<raster.data.length;i+=4){
     if(Math.min(raster.data[i],raster.data[i+1],raster.data[i+2])>180)raster.data[i+3]=0;
    }
    lines.getContext('2d').putImageData(raster,0,0);
    t.fillStyle=paper;t.fillRect(0,0,tmp.width,tmp.height);
    // Konturen bleiben ausschliesslich auf dem oberen Canvas.
   }
   const newOutline=lines?lines.toDataURL():null;
   const blank=tmp.toDataURL('image/png');
   const gallery=old?{id:'img-'+crypto.randomUUID(),type:'gallery',label:catalog.find(s=>s.id===currentMotif)?.name||'Mein Bild',data:old,outline,profile,created:Date.now()}:null;
   if(resumed){
    const paint=new Image();paint.src=resumed.data;await paint.decode();
    t.fillStyle=paper;t.fillRect(0,0,tmp.width,tmp.height);fitImage(tmp,paint);
    if(resumed.outline){const lineImage=new Image();lineImage.src=resumed.outline;await lineImage.decode();lines=tmp.cloneNode();fitImage(lines,lineImage);}
   }
   const record=resumed?{...resumed,id:draftId}:{id:draftId,type:'draft',data:blank,outline:newOutline,profile,motif:motif||null,created:Date.now(),hasInk:false};
   await saveStudioRecords(record,gallery);
   currentMotif=record.motif;undo=null;document.getElementById('studio-undo').disabled=true;
   overlay.getContext('2d').clearRect(0,0,overlay.width,overlay.height);
   if(lines)overlay.getContext('2d').drawImage(lines,0,0,overlay.width,overlay.height);
   outline=lines?overlay.toDataURL():null;
   fillPaper();ctx.drawImage(tmp,0,0,W,H);ink=record.hasInk;dirty=false;rev++;setStatus(resumed?'✓ Weiter malen':old?'✓ Bild gesichert':'✓ Neues Blatt');beep();
  }catch(e){setStatus('⚠ Bitte erneut versuchen');toast('Das Bild konnte nicht gespeichert werden.');}
  finally{busy=false;}
 }
 draftWriteQueue.then(()=>getPic(draftId)).then(async saved=>{
  if(saved?.outline){
   const image=new Image();image.src=saved.outline;
   await image.decode();fitImage(overlay,image);outline=overlay.toDataURL();
  }
  const loaded=()=>{
   currentMotif=saved?.motif||null;
   ink=saved?.data?(saved.hasInk===undefined?true:!!saved.hasInk):false;
   ready=true;setStatus('✓ Bereit');
   if(coloringMode&&(options.initialMotif||!saved?.data))nextSheet(options.initialMotif||'malkiste-horse');
  };
  if(saved?.data)restoreImage(saved.data,loaded);else loaded();
 }).catch(()=>{ready=true;setStatus('⚠ Lokaler Speicher prüfen');});
 const onHide=()=>{if(document.visibilityState==='hidden')saveDraft();};const onPage=()=>saveDraft();document.addEventListener('visibilitychange',onHide);window.addEventListener('pagehide',onPage);
 cleanup.push(()=>{document.body.classList.remove('studio-active');clearTimeout(saveTimer);watcher?.disconnect();document.removeEventListener('visibilitychange',onHide);window.removeEventListener('pagehide',onPage);if(dirty&&!busy)saveDraft();});
}

function v2Parents(){
 app.insertAdjacentHTML('beforeend',worldCredit());
 const panel=app.querySelector('.panel');if(!panel)return;
 const profiles=store.get('v2-profiles',[{id:'main',name:settings.childName||'Kind 1'}]);if(!Array.isArray(profiles)||!profiles.length)return;
 const active=v2Profile();
 const box=document.createElement('section');box.className='v2-profile-panel';
 box.innerHTML=`<div class="parent-links"><button id="mini-resume" class="tool-btn">🖍️ Zum Malblatt</button><button id="mini-activities" class="tool-btn">Spielauswahl öffnen</button></div><h2>Kinderprofile</h2><p>Jedes Kind erhält eigene Malblätter und eine eigene Bildergalerie. Bestehende Bilder gehören zum ersten Profil.</p><div class="v2-profile-row"><select id="v2-profile-select" aria-label="Aktives Kinderprofil">${profiles.map(p=>`<option value="${esc(p.id)}" ${p.id===active?'selected':''}>${esc(p.name)}</option>`).join('')}</select><input id="v2-profile-name" maxlength="24" placeholder="Neuer Kindername" aria-label="Neuer Kindername"/><button id="v2-add-profile" type="button">Profil hinzufügen</button></div><p class="v2-profile-note">Für jedes Profil kannst du die anderen Familieneinstellungen getrennt anpassen, indem du das Profil auswählst.</p>`;
 panel.insertBefore(box,panel.firstChild);
 for(const [prefix,label] of [['world-motion-','Bewegungseffekte in Themenwelten'],['world-help-','Puzzle-Hilfe anzeigen']]){
   const row=document.createElement('label'),toggle=document.createElement('input');
   row.className='setting';toggle.type='checkbox';toggle.checked=store.get(prefix+active,true);
   toggle.onchange=()=>store.set(prefix+active,toggle.checked);
   row.append(label,toggle);box.append(row);
 }
 on('mini-resume','click',()=>route('draw'));on('mini-activities','click',()=>route('home'));
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
 frame('Farben sortieren','Ziehe die Kugel in den passenden Korb oder tippe auf den Korb.',`<div class="v2-mini-game v2-sort"><div class="v2-sort-object" id="sort-ball" role="img"></div><div class="v2-sort-baskets" id="sort-baskets"></div><p id="sort-status" aria-live="polite"></p></div>`);
 const ball=document.getElementById('sort-ball'),baskets=document.getElementById('sort-baskets'),status=document.getElementById('sort-status');
 let timer,drag=null,locked=false;
 cleanup.push(()=>clearTimeout(timer));
 function next(){
  locked=false;const [color,name]=objs[round%objs.length];
  ball.style.background=color;ball.setAttribute('aria-label','Kugel in '+name);status.textContent='Welche Farbe passt?';
  baskets.innerHTML=[...objs].sort(()=>Math.random()-.5).map(([hex,label])=>`<button class="v2-basket" data-color="${hex}" aria-label="${label}"><span style="background:${hex}"></span>${label}</button>`).join('');
 }
 baskets.onclick=e=>{
  const button=e.target.closest('button');if(!button||locked)return;
  if(button.dataset.color!==objs[round%objs.length][0]){status.textContent='Probier einen anderen Korb.';beep('no');return;}
  locked=true;button.classList.add('target');status.textContent='Das passt!';beep();round++;timer=setTimeout(next,500);
 };
 const targetAt=e=>document.elementsFromPoint(e.clientX,e.clientY).map(el=>el.closest('.v2-basket')).find(Boolean);
 ball.onpointerdown=e=>{
  if(drag||locked||e.button!==0)return;
  drag={id:e.pointerId,x:e.clientX,y:e.clientY};ball.setPointerCapture(e.pointerId);
 };
 ball.onpointermove=e=>{
  if(e.pointerId!==drag?.id)return;
  ball.style.transform=`translate(${e.clientX-drag.x}px,${e.clientY-drag.y}px)`;
  const target=targetAt(e);for(const b of baskets.children)b.classList.toggle('target',b===target);
 };
 ball.onpointerup=ball.onpointercancel=ball.onlostpointercapture=e=>{
  if(e.pointerId!==drag?.id)return;
  const target=e.type==='pointerup'&&targetAt(e);drag=null;ball.style.transform='';
  for(const b of baskets.children)b.classList.remove('target');
  if(target)target.click();
 };
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
 const names={'🦋':'Schmetterling','🐝':'Biene','🌼':'Blume','🐞':'Marienkäfer','🌳':'Baum','☀️':'Sonne','🌙':'Mond','☁️':'Wolke','⭐':'Stern','🪁':'Drachen','🐦':'Vogel','🐌':'Schnecke','🐛':'Raupe','🍄':'Pilz','🌻':'Sonnenblume','🪻':'Hyazinthe'};
 let timer;cleanup.push(()=>clearTimeout(timer));
 const prompt=document.getElementById('seek-prompt'),grid=document.getElementById('seek-grid'),status=document.getElementById('seek-status');
 function next(){
  const r=rounds[round%rounds.length],symbol=r.items.find(s=>names[s]===r.target);
  const question='Wo ist '+(r.target==='Schmetterling'?'der ':'die ')+r.target+'?';
  let solved=false;status.textContent='';prompt.textContent=symbol+' '+question;speak(question);
  grid.innerHTML=r.items.map(s=>`<button class="v2-seek-item" data-symbol="${s}" aria-label="${names[s]}">${s}</button>`).join('');
  grid.onclick=e=>{
   const b=e.target.closest('button');if(!b||solved)return;
   if(b.dataset.symbol!==symbol){status.textContent='Schau nochmal genau.';beep('no');return;}
   solved=true;status.textContent='Prima entdeckt!';beep();round++;timer=setTimeout(next,550);
  };
 }
 next();
}

