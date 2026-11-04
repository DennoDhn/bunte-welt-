'use strict';

const soundPads=[
 {id:'bird',name:'Vogel',icon:'🐦',echo:'♪',color:'#dcefcf'},
 {id:'train',name:'Dampflok',icon:'🚂',echo:'☁',color:'#e1e9fc'},
 {id:'bubbles',name:'Seifenblasen',icon:'🫧',echo:'○',color:'#ccefeb'},
 {id:'drum',name:'Trommel',icon:'🥁',echo:'♫',color:'#ffe4cd'},
 {id:'rain',name:'Regen',icon:'🌧️',echo:'💧',color:'#d7eaf8'},
 {id:'bell',name:'Glocke',icon:'🔔',echo:'✧',color:'#fff1b9'}
];

// Short, locally generated sound effects. All voices share one output level.
function makePadSound(context,id){
 const rate=22050,duration=1.5;
 const buffer=context.createBuffer(1,Math.ceil(rate*duration),rate);
 const samples=buffer.getChannelData(0);
 let noise=0;
 const tau=2*Math.PI;
 for(let i=0;i<samples.length;i++){
  const t=i/rate;
  const wave=cycles=>Math.sin(tau*cycles);
  let value=0;
  switch(id){
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
    const u=t%0.34;
    if(t<1.02)value=Math.exp(-17*u)*(wave(92*u+1.8*(1-Math.exp(-30*u)))+0.18*wave(175*u));
    break;
   }
   case 'rain':{
    const white=2*Math.random()-1;
    noise=0.82*noise+0.18*white;
    value=(0.37*white+1.2*noise)*(0.65+0.15*wave(1.3*t));
    break;
   }
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
 let current=null,sequence=0;
 app.innerHTML=`<main class="sound-room"><header><button id="sound-back">🖍️ Zum Malen</button><h1>Klangwelt</h1></header><div class="sound-pads">${soundPads.map(p=>`<button data-pad="${p.id}" aria-label="${p.name}" style="--pad:${p.color}"><span class="pad-icon" aria-hidden="true">${p.icon}</span><span class="pad-echo" aria-hidden="true">${p.echo}</span><span>${p.name}</span></button>`).join('')}</div></main>`;
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
 on('sound-back','click',()=>route('draw'));
 app.querySelectorAll('[data-pad]').forEach(button=>button.addEventListener('click',()=>{
  app.querySelector('.pad-playing')?.classList.remove('pad-playing');
  void button.offsetWidth;
  button.classList.add('pad-playing');
  play(button.dataset.pad);
 }));
}
