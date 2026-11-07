/* Malkiste CC0 Vorlagen: lokale Original-PNGs, ohne Netzwerk beim Malen.
 * Quellen und Lizenz: motifs/MALKISTE-CC0.md */
(() => {
 'use strict';
 const SHEETS = {
  'malkiste-horse': {name:'Pferd mit Fohlen',src:'motifs/malkiste-pferd-fohlen.png'},
  'malkiste-unicorn': {name:'Einhorn mit Regenbogen',src:'motifs/malkiste-einhorn-regenbogen.png'}
 };
 const rgb = hex => [parseInt(hex.slice(1,3),16),parseInt(hex.slice(3,5),16),parseInt(hex.slice(5,7),16)];
 function mount(host,id,getColor,key,onPaint){
  const sheet=SHEETS[id];if(!sheet)return null;
  const canvas=document.createElement('canvas');
  canvas.id='color-bitmap';canvas.className='malkiste-canvas';
  canvas.setAttribute('role','img');canvas.setAttribute('aria-label',sheet.name+' zum Ausmalen');
  host.replaceChildren(canvas);
  const ctx=canvas.getContext('2d',{willReadFrequently:true});
  let image=null,blocked=null,ready=false,history=[],lastTap=0,start=null;
  const save=()=>{try{store.set(key,{bitmap:canvas.toDataURL('image/png')});}catch{toast('Speicher ist voll.');}};
  const snapshot=()=>{history.push(canvas.toDataURL('image/png'));if(history.length>12)history.shift();onPaint?.(history.length>0);};
  function restore(data,done){
   const saved=new Image();
   saved.onload=()=>{if(!canvas.isConnected)return;ctx.clearRect(0,0,canvas.width,canvas.height);ctx.drawImage(saved,0,0,canvas.width,canvas.height);done?.();};
   saved.onerror=()=>done?.();saved.src=data;
  }
  const original=new Image();
  original.onload=()=>{
   if(!canvas.isConnected)return;
   image=original;canvas.width=original.naturalWidth;canvas.height=original.naturalHeight;
   ctx.fillStyle='#fff';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.drawImage(original,0,0);
   const pixels=ctx.getImageData(0,0,canvas.width,canvas.height).data;
   blocked=new Uint8Array(canvas.width*canvas.height);
   for(let i=0;i<blocked.length;i++){
    const p=i*4;
    // Schwarze Konturen bleiben eine undurchlaessige Grenze.
    blocked[i]=pixels[p+3]>40 && (pixels[p]+pixels[p+1]+pixels[p+2])<615?1:0;
   }
   const previous=store.get(key,{});
   if(previous?.bitmap){restore(previous.bitmap,()=>{ready=true;});}
   else ready=true;
  };
  original.onerror=()=>{host.textContent='Bild konnte nicht geladen werden. Bitte mit Internet aktualisieren.';};
  original.src=sheet.src;
  function paint(event){
   if(!ready||!blocked||!canvas.isConnected)return;
   const now=Date.now();if(now-lastTap<350)return;lastTap=now;
   const r=canvas.getBoundingClientRect();
   const w=canvas.width,h=canvas.height;
   let x=Math.max(0,Math.min(w-1,Math.floor((event.clientX-r.left)*w/r.width)));
   let y=Math.max(0,Math.min(h-1,Math.floor((event.clientY-r.top)*h/r.height)));
   let seed=y*w+x;
   // Wenn ein Finger eine Kontur trifft, angrenzende freie Malflaeche suchen.
   if(blocked[seed]){
    let best=1e6,choice=-1;
    for(let dy=-8;dy<=8;dy++)for(let dx=-8;dx<=8;dx++){
     const xx=x+dx,yy=y+dy;if(xx<0||xx>=w||yy<0||yy>=h)continue;
     const n=yy*w+xx,d=dx*dx+dy*dy;
     if(!blocked[n]&&d<best){best=d;choice=n;}
    }
    if(choice<0)return;seed=choice;
   }
   const data=ctx.getImageData(0,0,w,h),v=data.data,paintRGB=rgb(getColor());
   // Flood-Fill beachtet die ORIGINALEN Konturen, auch nach wiederholtem Umfaerben.
   const visited=new Uint8Array(w*h),queue=new Int32Array(w*h);
   let head=0,tail=0;queue[tail++]=seed;visited[seed]=1;
   const region=[];
   while(head<tail){
    const n=queue[head++];if(blocked[n])continue;region.push(n);
    const left=n%w!==0?n-1:-1,right=n%w!==w-1?n+1:-1;
    for(const t of [left,right,n-w,n+w]){
     if(t<0||t>=w*h||visited[t]||blocked[t])continue;
     visited[t]=1;queue[tail++]=t;
    }
   }
   if(!region.length)return;
   snapshot();
   for(const i of region){
    const p=i*4;v[p]=paintRGB[0];v[p+1]=paintRGB[1];v[p+2]=paintRGB[2];v[p+3]=255;
   }
   ctx.putImageData(data,0,0);save();onPaint?.(history.length>0);
  }
  canvas.addEventListener('pointerdown',e=>{start={x:e.clientX,y:e.clientY};});
  canvas.addEventListener('pointerup',e=>{
   if(!start||Math.hypot(e.clientX-start.x,e.clientY-start.y)>20){start=null;return;}
   start=null;e.preventDefault();paint(e);
  });
  canvas.addEventListener('click',e=>paint(e));
  return {
   undo(){if(!ready||!history.length)return;const data=history.pop();restore(data,()=>{save();onPaint?.(history.length>0);});},
   reset(){if(!ready||!image)return;snapshot();ctx.clearRect(0,0,canvas.width,canvas.height);ctx.fillStyle='#fff';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.drawImage(image,0,0);store.set(key,{});},
   save(){if(!ready){toast('Bild wird noch geladen.');return;}return saveToGallery(canvas.toDataURL('image/png'),'Mein Ausmalbild');}
  };
 }
 window.bwMalkisteColoring={isSheet:id=>Object.prototype.hasOwnProperty.call(SHEETS,id),mount,sheets:SHEETS};
})();