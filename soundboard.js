'use strict';

const soundPads=[
 {id:'bird',name:'Vogel',icon:'🐦',echo:'♪',color:'#dcefcf'},
 {id:'train',name:'Dampflok',icon:'🚂',echo:'☁',color:'#e1e9fc'},
 {id:'bubbles',name:'Seifenblasen',icon:'🫧',echo:'○',color:'#ccefeb'},
 {id:'drum',name:'Trommel',icon:'🥁',echo:'♫',color:'#ffe4cd'},
 {id:'rain',name:'Regen',icon:'🌧️',echo:'💧',color:'#d7eaf8'},
 {id:'bell',name:'Glocke',icon:'🔔',echo:'✧',color:'#fff1b9'},
 {id:'frog',name:'Frosch',icon:'🐸',echo:'♪',color:'#deedc5'},
 {id:'sea',name:'Meer',icon:'🌊',echo:'≈',color:'#d3f1ed'},
 {id:'owl',name:'Eule',icon:'🦉',echo:'☾',color:'#ebe3fb'},
 {id:'horn',name:'Hupe',icon:'🚗',echo:'♫',color:'#ffe2d4'},
 {id:'xylophone',name:'Xylophon',icon:'🎶',echo:'♪',color:'#ffeec4'},
 {id:'bee',name:'Biene',icon:'🐝',echo:'✿',color:'#f5efbc'},
 {id:'wind',name:'Wind',icon:'🍃',echo:'≈',color:'#deedc5'},
 {id:'water',name:'Wassertropfen',icon:'💧',echo:'○',color:'#d7eaf8'},
 {id:'cat',name:'Kätzchen',icon:'🐱',echo:'♪',color:'#ffe2d4'},
 {id:'space',name:'Weltraum',icon:'🚀',echo:'✧',color:'#ebe3fb'},
 {id:'harp',name:'Harfe',icon:'🎼',echo:'♫',color:'#fff1b9'},
 {id:'heartbeat',name:'Herzklopfen',icon:'💗',echo:'♡',color:'#ffe0e9'}
];

// Short, locally generated sound effects. All voices share one output level.
function makePadSound(context,id){
 const rate=22050,duration=id==='drum'?0.34:id==='pop'?0.12:1.5;
 const buffer=context.createBuffer(1,Math.ceil(rate*duration),rate);
 const samples=buffer.getChannelData(0);
 let noise=0;
 const tau=2*Math.PI;
 for(let i=0;i<samples.length;i++){
  const t=i/rate;
  const wave=cycles=>Math.sin(tau*cycles);
  let value=0;
  switch(id){
   case 'wind':
    noise=0.96*noise+0.04*(2*Math.random()-1);
    value=3*noise*Math.sin(Math.PI*t/duration)**2; break;
   case 'water':{
    const u=t%0.4; value=Math.exp(-24*u)*wave(700*u+2200*u*u); break;
   }
   case 'cat':
    value=(wave(620*t-140*t*t)+0.2*wave(1240*t-280*t*t))*Math.sin(Math.PI*t/duration)**2; break;
   case 'space':
    value=wave(220*t+380*t*t)*(0.5+0.5*wave(8*t))*Math.sin(Math.PI*t/duration)**2; break;
   case 'harp':{
    const n=Math.min(4,Math.floor(t/0.25)),u=t-n*0.25;
    value=wave([262,330,392,523,659][n]*u)*Math.exp(-8*u); break;
   }
   case 'heartbeat':{
    const u=t%0.7;
    value=wave(65*t)*(Math.exp(-35*u)+(u>0.2?0.65*Math.exp(-35*(u-0.2)):0)); break;
   }
   case 'bird':{
    const u=t%0.38;
    if(t<1.14&&u<0.23)value=wave(1450*u+2800*u*u+0.8*Math.sin(18*u))*Math.sin(Math.PI*u/0.23)**2;
    break;
   }
   case 'train':{
    const u=t%0.24;
    noise=0.66*noise+0.34*(2*Math.random()-1);
    value=2.4*noise*Math.exp(-18*u)+(t>0.6?0.35*(wave(560*t)+0.4*wave(843*t))*Math.sin(Math.PI*(t-0.6)/0.9):0);
    break;
   }
   case 'bubbles':{
    const n=Math.floor(t/0.22),u=t%0.22;
    if(n<6)value=Math.exp(-32*u)*wave((380+(n%3)*180)*u+3100*u*u);
    break;
   }
   case 'drum':{
    value=Math.exp(-17*t)*(wave(92*t+1.8*(1-Math.exp(-30*t)))+0.18*wave(175*t));
    break;
   }
   case 'pop':
    value=Math.exp(-35*t)*wave(1050*t-3600*t*t);
    break;
   case 'rain':{
    const white=2*Math.random()-1;
    noise=0.82*noise+0.18*white;
    value=(0.37*white+1.2*noise)*(0.65+0.15*wave(1.3*t));
    break;
   }
   case 'frog':{
    const u=t%0.5;
    if(u<0.27)value=(wave(137*u)+0.45*wave(274*u))*Math.sin(Math.PI*u/0.27)**2*(0.6+0.4*wave(31*u));
    break;
   }
   case 'sea':
    noise=0.93*noise+0.07*(2*Math.random()-1);
    value=3*noise*Math.sin(Math.PI*t/duration)**2;
    break;
   case 'owl':{
    const u=t%0.65;
    if(u<0.42)value=wave(395*u-92*u*u)*Math.sin(Math.PI*u/0.42)**2;
    break;
   }
   case 'horn':{
    const u=t%0.48;
    if(t<0.96&&u<0.29)value=(0.6*wave(349*u)+0.4*wave(440*u)+0.13*wave(698*u))*Math.min(1,u*35,(0.29-u)*25);
    break;
   }
   case 'xylophone':{
    const n=Math.min(3,Math.floor(t/0.3)),u=t-n*0.3,f=[523,659,784,1046][n];
    value=(wave(f*u)+0.24*wave(f*3.9*u))*Math.exp(-11*u);
    break;
   }
   case 'bee':
    value=(wave(178*t+0.4*wave(4*t))+0.3*wave(356*t+0.8*wave(4*t)))*(0.5+0.25*wave(t));
    break;
   case 'bell':
    value=Math.exp(-2.8*t)*(wave(740*t)+0.38*wave(1501*t)+0.2*wave(1991*t));
    break;
  }
  const edge=Math.min(1,i/(rate*0.008),(samples.length-i)/(rate*0.09));
  samples[i]=0.28*edge*value;
 }
 return buffer;
}

function soundboard(){
 const clips=new Map();
 let current=null,sequence=0,page=0;
 app.innerHTML=`<main class="sound-room"><header><button id="sound-home" aria-label="Zur Spielauswahl">🏠</button><button id="sound-back">🖍️ Zum Malen</button><h1>Klangwelt</h1><button id="sound-next" aria-label="Weitere Klänge">➜</button></header><div class="sound-pads">${soundPads.map((p,i)=>`<button ${i>=6?'hidden':''} data-pad="${p.id}" aria-label="${p.name}" style="--pad:${p.color}"><span class="pad-icon" aria-hidden="true">${p.icon}</span><span class="pad-echo" aria-hidden="true">${p.echo}</span><span>${p.name}</span></button>`).join('')}</div><section id="bubble-play" hidden><div class="bubble-sky" aria-label="Seifenblasen"></div><div class="bubble-actions"><button id="bubble-more" aria-label="Neue Seifenblase">🫧 ＋</button><button id="bubble-back">🎵 Klänge</button></div></section></main>`;
 function silence(){
  sequence++;
  if(current){current.stop();current.disconnect();current=null;}
 }
 async function play(id){
  silence();
  if(!settings.sound||settings.quiet)return;
  const request=sequence;
  try{
   audioCtx=audioCtx||new(window.AudioContext||window.webkitAudioContext)();
   if(audioCtx.state!=='running')await audioCtx.resume();
   if(request!==sequence)return;
   if(!clips.has(id))clips.set(id,makePadSound(audioCtx,id));
   const source=audioCtx.createBufferSource();
   source.buffer=clips.get(id);source.connect(audioCtx.destination);current=source;
   source.onended=()=>{source.disconnect();if(current===source)current=null;};
   source.start();
  }catch{if(request===sequence)toast('Ton ist gerade nicht verfügbar.');}
 }
 const hide=()=>{if(document.hidden)silence();};
 document.addEventListener('visibilitychange',hide);
 cleanup.push(()=>{silence();document.removeEventListener('visibilitychange',hide);});
 const field=app.querySelector('.bubble-sky'),bubblePlay=document.getElementById('bubble-play');
 const pads=app.querySelector('.sound-pads'),nextPage=document.getElementById('sound-next');
 const places=[[18,68],[50,28],[80,65],[18,25],[50,75],[80,23]];
 let serial=0;
 function addBubble(){
  const slot=serial%places.length;
  field.querySelector(`[data-slot="${slot}"]`)?.remove();
  const bubble=document.createElement('button');
  const [x,y]=places[slot];
  bubble.className='play-bubble';bubble.dataset.slot=slot;
  bubble.setAttribute('aria-label','Seifenblase platzen lassen');
  bubble.style.left=x+'%';bubble.style.top=y+'%';
  bubble.style.setProperty('--hue',String((serial++*67+183)%360));
  bubble.addEventListener('click',()=>{bubble.remove();play('pop');});
  field.append(bubble);
 }
 function bubbles(open){
  silence();
  pads.hidden=open;nextPage.hidden=open;bubblePlay.hidden=!open;
  if(open){addBubble();document.getElementById('bubble-more').focus();}
  else{field.replaceChildren();pads.querySelector('[data-pad=bubbles]').focus();}
 }
 on('bubble-more','click',addBubble);
 on('bubble-back','click',()=>bubbles(false));
 on('sound-next','click',()=>{
  silence();page=(page+1)%Math.ceil(soundPads.length/6);
  const next=document.getElementById('sound-next');
  next.textContent=`${page+1}/${Math.ceil(soundPads.length/6)} ➜`;
  next.setAttribute('aria-label',`Klangseite ${page+1}. Weitere Klänge`);
  app.querySelectorAll('[data-pad]').forEach((b,i)=>{b.hidden=Math.floor(i/6)!==page;b.classList.remove('pad-playing');});
 });
 on('sound-home','click',()=>route('home'));
 on('sound-back','click',()=>route('draw'));
 app.querySelectorAll('[data-pad]').forEach(button=>button.addEventListener('click',()=>{
  app.querySelector('.pad-playing')?.classList.remove('pad-playing');
  void button.offsetWidth;
  button.classList.add('pad-playing');
  if(button.dataset.pad==='bubbles')bubbles(true);
  else play(button.dataset.pad);
 }));
}

