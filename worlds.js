'use strict';
const WORLDS=[];
let currentWorld=null;
let requestedMotif=null;
const WORLD_GAMES=[
 ['shadow','Schatten finden','🌗'],['eargame','Geräusche raten','👂'],
 ['pairs','Bildpaare','🃏'],['together','Was gehört zusammen?','🔗'],
 ['trail','Spuren malen','👣'],['story','Meine kleine Geschichte','📖']
];
function motifSvg(item,colors=null){
 const body=item.shapes.map(([tag,attrs],i)=>{
   const a={...attrs};
   if(colors && a.fill!=='none'){
     const fill=a.fill||'#242424';
     a.fill=/^#[0-9a-f]{6}$/i.test(colors[i])?colors[i]:['#292f33','#31373d','#000','#000000'].includes(fill.toLowerCase())?fill:'#ffffff';
     a.stroke='#485468';a['stroke-width'] ||= '.32';a['stroke-linejoin']='round';
     a['data-colorpart']=i;
   }
   return '<'+tag+' '+Object.entries(a).map(([k,v])=>k+'="'+esc(v)+'"').join(' ')+'/>';
 }).join('');
 return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 40 40" role="img" aria-label="'+esc(item.name)+'">'+body+'</svg>';
}
function motifUrl(item){return 'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(motifSvg(item));}
function worldTiles(){
 return '<section class="world-section"><h2>Themenwelten</h2><div class="world-grid">'+WORLDS.map(w=>'<button data-world="'+w.id+'" style="--paper:'+w.bg+'">'+motifSvg(w.items[0])+'<strong>'+w.name+'</strong></button>').join('')+'</div></section>';
}
function worldMenu(){
 const w=currentWorld||WORLDS[0];
 const activities=[['worldcolor','Ausmalen','🎨'],['puzzle','Puzzle','🧩'],['scratch','Zauberbilder','✨'],['stickers','Stickerbuch','🌼'],['worldsound','Klangwelt','🎵'],...WORLD_GAMES];
 frame(w.name,'Such dir ein Spiel aus.', '<div class="world-grid">'+activities.map(([id,name,icon])=>'<button data-start="'+id+'" style="--paper:'+w.bg+'"><span>'+icon+'</span><strong>'+name+'</strong></button>').join('')+'</div>');
 app.querySelectorAll('[data-start]').forEach(b=>b.onclick=()=>route(b.dataset.start));
}
function worldMotifs(){
 const w=currentWorld||WORLDS[0];
 frame(w.name,'Wähle dein Ausmalbild.', '<div class="world-grid">'+w.items.map(item=>{
  const colors=store.get(colorKey(item.id),{});
  return '<button data-motif="'+item.id+'" style="--paper:'+w.bg+'">'+motifSvg(item,Object.keys(colors).length?colors:null)+'<strong>'+item.name+'</strong></button>';
 }).join('')+'</div>');
 app.querySelectorAll('[data-motif]').forEach(b=>b.onclick=()=>{requestedMotif=b.dataset.motif;route('color')});
}
function colorKey(id){return v2Profile()==='main'?'coloring-'+id:'coloring-'+v2Profile()+'-'+id;}
function worldCredit(){return '<small class="world-credit">Motivgrafiken: Twemoji, © Twitter, Inc. und Mitwirkende, fortgeführt von jdecked/twemoji. Quelle: github.com/jdecked/twemoji · CC BY 4.0 (creativecommons.org/licenses/by/4.0/). Für Ausmalflächen und Spiele bearbeitet.</small>';}
const WORLD_SOUNDS=[
 [['bird','🐦','Vogel'],['bee','🐝','Biene'],['water','💧','Wasser']],
 [['cat','🐈','Katze'],['bell','🔔','Glöckchen'],['bird','🦜','Vogel']],
 [['owl','🦉','Eule'],['wind','🍃','Wind'],['frog','🐸','Frosch']],
 [['sea','🌊','Meer'],['bubbles','🫧','Blasen'],['rain','🌧️','Regen']],
 [['train','🚂','Zug'],['horn','🚗','Hupe'],['bell','🚲','Klingel']],
 [['harp','🪉','Harfe'],['xylophone','🎶','Xylophon'],['space','🌠','Weltraum']]
];
function worldAudio(){
 let source=null,serial=0;
 function stop(){serial++;if(source){source.stop();source.disconnect();source=null}}
 cleanup.push(stop);
 return async id=>{
  stop();const token=serial;
  if(settings.quiet||!settings.sound){toast('Ton ist im Elternbereich ausgeschaltet.');return}
  try{
   audioCtx||=new(window.AudioContext||window.webkitAudioContext)();
   if(audioCtx.state!=='running')await audioCtx.resume();
   if(token!==serial)return;
   source=audioCtx.createBufferSource();source.buffer=makePadSound(audioCtx,id);
   source.connect(audioCtx.destination);source.start();
  }catch{toast('Tippe für den Ton noch einmal.')}
 };
}
function playWorld(){
 const w=currentWorld||WORLDS[0],game=activePage;
 const sounds=WORLD_SOUNDS[WORLDS.indexOf(w)],play=worldAudio();
 const name= WORLD_GAMES.find(row=>row[0]===game)?.[1]||'Klangwelt';
 frame(name,w.name,'<section class="world-stage" style="--paper:'+w.bg+'"><div id="world-task"></div><div class="world-options" id="world-options"></div><p id="world-result" role="status"></p><button class="big-btn primary" id="world-next" hidden>Weiter ➜</button></section>');
 const task=document.getElementById('world-task'),opts=document.getElementById('world-options'),msg=document.getElementById('world-result'),next=document.getElementById('world-next');
 let round=0;
 function option(html,label,action){
  const b=document.createElement('button');b.innerHTML=html;b.setAttribute('aria-label',label);b.onclick=()=>action(b);opts.append(b);return b;
 }
 function won(text='Das passt!'){msg.textContent=text;next.hidden=false;beep();}
 function choices(entries,correct,onWin){
  const mixed=entries.slice();for(let i=mixed.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[mixed[i],mixed[j]]=[mixed[j],mixed[i]];}
  for(const [id,art,label] of mixed)option(art,label,b=>{
   if(!next.hidden)return;
   if(id===correct){b.classList.add('matched');onWin()}else{msg.textContent='Probier ein anderes Bild.';b.animate?.([{opacity:.55},{opacity:1}],{duration:220})}
  });
 }
 const scenes=[
 [['🛞','🚜','🌻','Der Traktor fährt!'],['🌱','🌻','🐏','Die Blume wächst!']],
 [['🦴','🐕','🐦','Der Hund freut sich!'],['🧶','🐈','🐩','Die Katze spielt!']],
 [['🌰','🐿️','🦋','Das Eichhörnchen knabbert!'],['🍯','🐻','🦔','Der Bär nascht!']],
 [['⛵','🌊','🌳','Das Boot fährt los!'],['🐚','🦀','🦉','Am Strand!']],
 [['🛞','🚗','🐋','Das Auto rollt!'],['🛤️','🚂','🚲','Der Zug fährt!']],
 [['👑','🏰','🚚','Das Schloss öffnet sich!'],['🪄','🧙','🐬','Es funkelt!']]
 ];
 const stories=[
 [['🥚','Ei'],['🐣','Die Schale knackt'],['🐥','Das Küken schlüpft']],
 [['🧺','Ein Körbchen'],['🐈','Die Katze kommt'],['😴','Die Katze schläft']],
 [['🌰','Eine Eichel'],['🌱','Ein Keimling wächst'],['🌳','Ein großer Baum']],
 [['🌦️','Es regnet'],['💧','Ein Tropfen fällt'],['🌊','Er landet im Meer']],
 [['🚦','Die Ampel wartet'],['🟢','Jetzt ist grün'],['🚌','Der Bus fährt los']],
 [['🌧️','Es regnet'],['☀️','Die Sonne kommt'],['🌈','Ein Regenbogen erscheint']]
 ];
 function start(){
  next.hidden=true;msg.textContent='';task.replaceChildren();opts.replaceChildren();
  const index=WORLDS.indexOf(w),item=w.items[round%w.items.length],other=w.items[(round+3)%w.items.length];
  if(game==='worldsound'){
   task.textContent='Welchen Klang möchtest du hören?';
   sounds.forEach(([id,icon,label])=>option(icon,label,()=>{play(id);msg.textContent=label}));return;
  }
  if(game==='shadow'){
   task.innerHTML='<div class="silhouette">'+motifSvg(item)+'</div>';
   choices([item,other].map(m=>[m.id,motifSvg(m),m.name]),item.id,()=>{task.innerHTML=motifSvg(item);won()});return;
  }
  if(game==='eargame'){
   const answer=sounds[round%sounds.length];
   const replay=document.createElement('button');replay.textContent='🔊';replay.setAttribute('aria-label','Geräusch anhören');replay.onclick=()=>play(answer[0]);task.append(replay);
   choices(sounds.map(([id,icon,label])=>[id,icon,label]),answer[0],()=>won(answer[2]+'!'));return;
  }
  if(game==='together'){
   const [icon,yes,no,result]=scenes[index][round%2];task.textContent=icon;
   choices([[yes,yes,yes],[no,no,no]],yes,()=>{task.textContent=icon+' '+yes;won(result)});return;
  }
  if(game==='story'){
   const story=stories[index];let step=0;const advance=()=>{
    task.textContent=story[step][0];msg.textContent=story[step][1];speak(story[step][1]);
    opts.replaceChildren();
    if(++step<story.length)option('➜','Geschichte weitererzählen',advance);else won(story[2][1]);
   };
   if(round%2===0)advance();else{
    task.textContent=story[0][0]+' ➜ ❔ ➜ '+story[2][0];
    choices(story.slice(0,2).map(([icon,label])=>[icon,icon,label]),story[1][0],()=>{task.textContent=story.map(x=>x[0]).join(' ');won()});
   }return;
  }
  if(game==='pairs'){
   task.textContent='Finde zwei gleiche Bilder';let first=null,matched=0;
   const covered=round%2===1;
   const cards=[item,other,item,other];for(let i=3;i>0;i--){const j=Math.floor(Math.random()*(i+1));[cards[i],cards[j]]=[cards[j],cards[i]]}
   for(const m of cards)option(covered?'❔':motifSvg(m),covered?'Karte aufdecken':m.name,b=>{
    if(first?.button===b)return;
    b.innerHTML=motifSvg(m);b.classList.add('selected');
    if(!first){first={button:b,id:m.id};return}
    const previous=first;first=null;
    if(previous.id===m.id){previous.button.disabled=b.disabled=true;matched++;if(matched===2)won('Beide Paare gefunden!')}
    else{msg.textContent='Schau noch einmal.';for(const c of [previous.button,b]){c.classList.remove('selected');if(covered)c.innerHTML='❔'}}
   });return;
  }
  if(game==='trail'){
   const stops=[[10,61],[28,45],[46,57],[65,35],[87,48]];
   task.innerHTML='<svg class="trail" viewBox="0 0 100 85" aria-label="Fahre den Weg entlang"><path d="M10 61 Q20 53 28 45 T46 57 Q56 45 65 35 T87 48" fill="none" stroke="#fff" stroke-width="12" stroke-linecap="round"/>'+stops.map(([x,y],i)=>'<circle cx="'+x+'" cy="'+y+'" r="4" fill="#a4bdad" data-step="'+i+'"/>').join('')+'<text x="80" y="38" font-size="14">'+item.emoji+'</text></svg>';
   const svg=task.firstElementChild;let pos=0,pointer=null;
   function move(e){const matrix=svg.getScreenCTM();if(!matrix||pos===stops.length)return;const p=new DOMPoint(e.clientX,e.clientY).matrixTransform(matrix.inverse());const [x,y]=stops[pos];if(Math.hypot(x-p.x,y-p.y)>13)return;svg.querySelector('[data-step="'+pos+'"]').setAttribute('fill','#e69a65');if(++pos===stops.length)won('Angekommen!');else msg.textContent='🌼'.repeat(pos);}
   svg.onpointerdown=e=>{if(pointer!==null)return;pointer=e.pointerId;svg.setPointerCapture(pointer);move(e)};svg.onpointermove=e=>{if(e.pointerId===pointer)move(e)};svg.onpointerup=svg.onpointercancel=svg.onlostpointercapture=()=>{pointer=null};
  }
 }
 next.onclick=()=>{round++;start()};start();
}
