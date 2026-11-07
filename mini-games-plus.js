/* Bunte Welt 2.14.2 – kindgerechte Puzzle- und Zauberbilder-Erweiterung.
   Ergänzt bestehende Spiele, ohne Galerie oder gespeicherte Malbilder zu ändern. */
(function () {
  'use strict';
  const legacyAnimals = [
    {name:'Katze', icon:'🐱', kind:'cat', sky:'#E7F3FF', face:'#F4BC88', inner:'#E99699'},
    {name:'Hund', icon:'🐶', kind:'dog', sky:'#FFF0D7', face:'#D8A777', inner:'#B77E65'},
    {name:'Hase', icon:'🐰', kind:'rabbit', sky:'#F4E9FF', face:'#FFF7EF', inner:'#ECA4C8'},
    {name:'Bär', icon:'🐻', kind:'bear', sky:'#E4F5E7', face:'#BF895E', inner:'#E7B08C'},
    {name:'Fuchs', icon:'🦊', kind:'fox', sky:'#FFE7DE', face:'#EA9758', inner:'#F6D0BA'},
    {name:'Kuh', icon:'🐮', kind:'cow', sky:'#DEF3F6', face:'#F9F8F0', inner:'#DDA0AF'},
    {name:'Pferd', icon:'🐴', kind:'horse', sky:'#ECF5E6', face:'#DAB18A', inner:'#B8876D'},
    {name:'Einhorn', icon:'🦄', kind:'unicorn', sky:'#EDE7FF', face:'#FFFAF2', inner:'#E5AFDF'},
    {name:'Löwe', icon:'🦁', kind:'lion', sky:'#FFF1BF', face:'#F4C070', inner:'#CD8F4B'}
  ];
  function gridFor(parts) { if(parts===2)return [2,1];return parts===9?[3,3]:parts===6?[3,2]:[2,2]; }
  function defaultParts() { return String(settings.ageBand)==='4'?9:String(settings.ageBand)==='3'?6:4; }
  function artwork(animal) {
    const k=animal.kind, f=animal.face, e=animal.inner;
    const ears = k==='rabbit'
      ? '<ellipse cx="162" cy="116" rx="38" ry="103" fill="'+f+'" stroke="#815C4A" stroke-width="8"/><ellipse cx="338" cy="116" rx="38" ry="103" fill="'+f+'" stroke="#815C4A" stroke-width="8"/><ellipse cx="162" cy="114" rx="18" ry="75" fill="'+e+'"/><ellipse cx="338" cy="114" rx="18" ry="75" fill="'+e+'"/>'
      : k==='bear'||k==='lion'
      ? '<circle cx="139" cy="179" r="57" fill="'+f+'" stroke="#815C4A" stroke-width="8"/><circle cx="361" cy="179" r="57" fill="'+f+'" stroke="#815C4A" stroke-width="8"/><circle cx="139" cy="179" r="28" fill="'+e+'"/><circle cx="361" cy="179" r="28" fill="'+e+'"/>'
      : k==='dog'
      ? '<ellipse cx="130" cy="222" rx="64" ry="100" transform="rotate(21 130 222)" fill="'+e+'" stroke="#815C4A" stroke-width="8"/><ellipse cx="370" cy="222" rx="64" ry="100" transform="rotate(-21 370 222)" fill="'+e+'" stroke="#815C4A" stroke-width="8"/>'
      : k==='cow'
      ? '<ellipse cx="106" cy="242" rx="72" ry="43" fill="'+f+'" stroke="#815C4A" stroke-width="8"/><ellipse cx="394" cy="242" rx="72" ry="43" fill="'+f+'" stroke="#815C4A" stroke-width="8"/><path d="M156 174L132 104 Q118 90 114 119L124 202M344 174L368 104Q382 90 386 119L376 202" fill="#F4DFB6" stroke="#815C4A" stroke-width="8"/>'
      : '<path d="M121 209L126 73 Q183 89 204 166M379 209L374 73Q317 89 296 166" fill="'+f+'" stroke="#815C4A" stroke-width="9"/><path d="M151 164L152 107L188 163M349 164L348 107L312 163" fill="'+e+'"/>';
    const extra = k==='lion'?'<circle cx="250" cy="272" r="165" fill="#B77B3C" stroke="#93612F" stroke-width="7"/>':
                  k==='unicorn'?'<path d="M235 167 L250 40 L274 167" fill="#F9D474" stroke="#9471B0" stroke-width="7"/><path d="M278 161Q350 108 361 189" fill="none" stroke="#B7A4E8" stroke-width="28"/>':'';
    const muzzle = k==='cow'
      ? '<ellipse cx="250" cy="329" rx="82" ry="59" fill="#E9AEBD"/><ellipse cx="217" cy="330" rx="10" ry="14" fill="#A66579"/><ellipse cx="283" cy="330" rx="10" ry="14" fill="#A66579"/>'
      : '<ellipse cx="250" cy="321" rx="68" ry="47" fill="#FFF5EC"/><path d="M234 301 Q250 288 266 301 L250 317Z" fill="#9B6E69"/><path d="M250 317Q230 338 212 320M250 317Q270 338 288 320" fill="none" stroke="#815C4A" stroke-width="6" stroke-linecap="round"/>';
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="500" height="500">'
       +'<rect width="500" height="500" fill="'+animal.sky+'"/>'
       +'<circle cx="407" cy="89" r="49" fill="#FFF5B6"/><circle cx="80" cy="88" r="19" fill="#FFFFFFB8"/><circle cx="107" cy="78" r="28" fill="#FFFFFFB8"/><circle cx="139" cy="89" r="19" fill="#FFFFFFB8"/>'
       +'<path d="M0 427Q126 388 250 425T500 425V500H0Z" fill="#BFE3B4"/>'
       +extra+ears+'<ellipse cx="250" cy="276" rx="143" ry="139" fill="'+f+'" stroke="#815C4A" stroke-width="9"/>'
       +'<circle cx="195" cy="263" r="12" fill="#394D54"/><circle cx="305" cy="263" r="12" fill="#394D54"/>'
       +'<circle cx="188" cy="258" r="4" fill="white"/><circle cx="298" cy="258" r="4" fill="white"/>'
       +'<circle cx="143" cy="301" r="19" fill="#F8B1A388"/><circle cx="357" cy="301" r="19" fill="#F8B1A388"/>'
       +muzzle+'<path d="M30 446Q55 434 78 445M404 445Q429 433 465 446" fill="none" stroke="#70B36B" stroke-width="9" stroke-linecap="round"/>'
       +'</svg>';
  }
  function pictureUrl(a) { if(a.item)return motifUrl(a.item);if(a.kind==='unicorn'||a.kind==='horse')return './motifs/'+a.kind+'.svg';return 'data:image/svg+xml;charset=UTF-8,'+encodeURIComponent(artwork(a)); }
  function shuffled(n) {
    const order=Array.from({length:n},(_,i)=>i);
    for(let i=n-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[order[i],order[j]]=[order[j],order[i]];}
    if(n>1&&order.every((v,i)=>v===i)) order.push(order.shift());
    return order;
  }
  function enhancedPuzzle() {
    const worlds=currentWorld?[currentWorld]:WORLDS;
    const puzzleEntry=item=>({name:item.name,icon:item.emoji,kind:item.id,item});
    const catalog=worlds.flatMap(w=>w.items.slice(0,4).map(puzzleEntry));
    const originals=currentWorld?catalog:[...catalog,...legacyAnimals];
    const additions=worlds.flatMap(w=>w.items.slice(4).filter(item=>item.shapes).map(puzzleEntry));
    const animals=[...originals,...additions];
    let chosen=0, parts=defaultParts(), placed=new Set(), selected=null, order=shuffled(parts), drag=null;
    const progressKey='puzzle-progress-'+v2Profile()+(currentWorld?'-'+currentWorld.id:'');
    const saved=store.get(progressKey);
    const validIndices=(list,size)=>Array.isArray(list) && list.length<=size &&
      new Set(list).size===list.length && list.every(i=>Number.isInteger(i) && i>=0 && i<size);
    if(saved && [2,4,6,9].includes(saved.parts) && saved.age===String(settings.ageBand) &&
       animals.some(a=>a.kind===saved.animal) && validIndices(saved.order,saved.parts) &&
       saved.order.length===saved.parts && validIndices(saved.placed,saved.parts)){
      chosen=animals.findIndex(a=>a.kind===saved.animal);
      parts=saved.parts;
      order=saved.order;
      placed=new Set(saved.placed);
    }
    function saveProgress(){
      store.set(progressKey,{age:String(settings.ageBand),animal:animals[chosen].kind,parts,order,placed:[...placed]});
    }
    frame('Mein Tier-Puzzle','Tippe auf ein Teil oder ziehe es direkt an die richtige Stelle.',
      '<div class="activity-area bw-puzzle-game">'
      +'<div class="bw-motif-strip" id="bw-puzzle-motifs" aria-label="Puzzlemotiv aussuchen"></div>'
      +'<div class="bw-puzzle-layout">'
      +'<div class="bw-puzzle-board" id="bw-puzzle-board" aria-label="Puzzlefläche"></div>'
      +'<div class="bw-puzzle-pieces" id="bw-puzzle-pieces" aria-label="Puzzleteile"></div></div>'
      +'<div class="message-pill bw-game-message" id="bw-puzzle-message" role="status">Wohin passt das Teil?</div>'
      +'<div class="bw-game-actions"><button class="big-btn primary" id="bw-puzzle-next" hidden>Weiteres Tier →</button>'
      +'<button class="big-btn" id="bw-puzzle-help">✨ Hilfe</button>'
      +'<button class="big-btn" id="bw-puzzle-reset">↻ Nochmal</button>'
      +'<button class="big-btn" id="bw-puzzle-level" aria-label="Anzahl der Puzzleteile ändern"></button></div></div>');
    const board=document.getElementById('bw-puzzle-board'), tray=document.getElementById('bw-puzzle-pieces');
    const motifs=document.getElementById('bw-puzzle-motifs'), message=document.getElementById('bw-puzzle-message');
    const next=document.getElementById('bw-puzzle-next');
    function pos(i,cols,rows) {return ((i%cols)/(cols-1)*100)+'% '+(Math.floor(i/cols)/Math.max(1,rows-1)*100)+'%';}
    function say(s) {message.textContent=s;}
    function draw() {
      const [cols,rows]=gridFor(parts),image=pictureUrl(animals[chosen]);
      board.style.gridTemplateColumns='repeat('+cols+', minmax(0,1fr))';
      board.style.gridTemplateRows='repeat('+rows+', minmax(0,1fr))';
      tray.style.gridTemplateColumns='repeat('+cols+', minmax(0,1fr))';
      endDrag();
      board.replaceChildren();tray.replaceChildren();
      const preview=document.createElement('div');
      preview.className='bw-puzzle-preview';preview.style.backgroundImage='url("'+image+'")';
      if(parts>2)board.append(preview);
      // Keep the original matching pairs when a saved two-piece puzzle resumes.
      const insetPool=chosen<originals.length?originals:animals;
      const insetImage=i=>pictureUrl(insetPool[(chosen+i)%insetPool.length]);
      for(let i=0;i<parts;i++){
        const slot=document.createElement('button');
        slot.type='button';slot.className='bw-puzzle-slot'+(placed.has(i)?' filled':'');
        slot.dataset.slot=String(i);slot.setAttribute('aria-label','Puzzleplatz '+(i+1));
        if(placed.has(i)){slot.style.backgroundImage='url("'+image+'")';slot.style.backgroundSize=(cols*100)+'% '+(rows*100)+'%';slot.style.backgroundPosition=pos(i,cols,rows);}
        if(parts===2){
          slot.style.backgroundImage='url("'+insetImage(i)+'")';
          slot.style.backgroundSize='90% auto';slot.style.backgroundPosition='center';
          if(!placed.has(i))slot.classList.add('bw-inset-target');
        }
        slot.addEventListener('click',()=>{if(placed.has(i))return;if(selected===null){say('Such dir ein Teil aus oder ziehe es auf das Bild.');return;}place(selected,i);});
        board.append(slot);
      }
      for(const i of order){
        const p=document.createElement('button');
        p.type='button';p.className='bw-puzzle-piece'+(selected===i?' selected':'')+(placed.has(i)?' placed':'');
        p.dataset.piece=String(i);p.disabled=placed.has(i);p.setAttribute('aria-label','Puzzleteil '+(i+1));
        p.style.aspectRatio=String(rows)+' / '+String(cols);
        p.style.backgroundImage='url("'+image+'")';p.style.backgroundSize=(cols*100)+'% '+(rows*100)+'%';p.style.backgroundPosition=pos(i,cols,rows);
        if(parts===2){
          p.style.backgroundImage='url("'+insetImage(i)+'")';p.style.backgroundSize='90% auto';p.style.backgroundPosition='center';p.style.aspectRatio='1';
        }
        p.addEventListener('click',ev=>{if(ev.detail===0 && !drag){selected=i;beep('pop');draw();}});
        enableDrag(p,i);tray.append(p);
      }
      motifs.querySelectorAll('[data-animal]').forEach(b=>{b.classList.toggle('active',Number(b.dataset.animal)===chosen);});
      next.hidden=placed.size!==parts;
      document.getElementById('bw-puzzle-level').textContent=parts+' Teile';
    }
    function place(piece,slot){
      if(piece!==slot||placed.has(slot)){
        say('Fast! Versuch eine andere Stelle.');beep('pop');return;
      }
      placed.add(slot);saveProgress();selected=null;beep();
      say(placed.size===parts?'Hurra! '+animals[chosen].name+' ist fertig!':'Super! Das passt!');
      draw();
    }
    function endDrag(){
      if(!drag)return;
      const {el,id,ghost}=drag;
      drag=null;
      ghost?.remove();
      el.classList.remove('being-dragged');
      if(el.hasPointerCapture(id))el.releasePointerCapture(id);
    }
    window.addEventListener('blur',endDrag);
    cleanup.push(()=>{endDrag();window.removeEventListener('blur',endDrag);});
    function enableDrag(el,index){
      el.addEventListener('pointerdown',ev=>{
        if(drag || !ev.isPrimary || ev.button!==0)return;
        drag={id:ev.pointerId,el,x:ev.clientX,y:ev.clientY,ghost:null};
        el.setPointerCapture(ev.pointerId);
      });
      function owns(ev){return drag?.el===el && drag.id===ev.pointerId;}
      el.addEventListener('pointermove',ev=>{
        if(!owns(ev))return;
        if(!drag.ghost){
          if(Math.hypot(ev.clientX-drag.x,ev.clientY-drag.y)<8)return;
          const box=el.getBoundingClientRect();
          const ghost=el.cloneNode(false);
          ghost.removeAttribute('data-piece');
          ghost.setAttribute('aria-hidden','true');
          ghost.tabIndex=-1;
          ghost.className='bw-puzzle-ghost';
          Object.assign(ghost.style,{width:box.width+'px',height:box.height+'px',position:'fixed',pointerEvents:'none',zIndex:'1000',transform:'translate(-50%,-50%)'});
          el.classList.add('being-dragged');
          drag.ghost=ghost;
          document.body.append(ghost);
        }
        drag.ghost.style.left=ev.clientX+'px';
        drag.ghost.style.top=ev.clientY+'px';
      });
      el.addEventListener('pointerup',ev=>{
        if(!owns(ev))return;
        const moved=!!drag.ghost || Math.hypot(ev.clientX-drag.x,ev.clientY-drag.y)>=8;
        endDrag();
        if(!moved){selected=index;beep('pop');draw();return;}
        let slot=document.elementFromPoint(ev.clientX,ev.clientY)?.closest('[data-slot]');
        const right=board.querySelector('[data-slot="'+index+'"]'),r=right.getBoundingClientRect();
        const distance=Math.hypot(Math.max(r.left-ev.clientX,0,ev.clientX-r.right),Math.max(r.top-ev.clientY,0,ev.clientY-r.bottom));
        if(distance<=Math.min(r.width,r.height)*.12)slot=right;
        if(slot && board.contains(slot)){place(index,Number(slot.dataset.slot));return;}
        say('Versuch es noch einmal.');
      });
      for(const type of ['pointercancel','lostpointercapture']){
        el.addEventListener(type,ev=>{if(owns(ev))endDrag();});
      }
    }
    function reset(){placed=new Set();selected=null;order=shuffled(parts);saveProgress();say('Wohin passt das Teil?');draw();}
    motifs.innerHTML=animals.map((a,i)=>'<button class="bw-motif-button" type="button" data-animal="'+i+'" aria-label="'+a.name+' auswählen"><span aria-hidden="true">'+a.icon+'</span><small>'+a.name+'</small></button>').join('');
    motifs.querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>{chosen=Number(b.dataset.animal);reset();}));
    on('bw-puzzle-reset','click',reset);
    on('bw-puzzle-next','click',()=>{chosen=(chosen+1)%animals.length;reset();});
    on('bw-puzzle-level','click',()=>{parts=parts===2?4:parts===4?6:parts===6?9:2;reset();});
    on('bw-puzzle-help','click',()=>{
      if(placed.size===parts)return;
      const first=selected!==null&&!placed.has(selected)?selected:order.find(i=>!placed.has(i));
      if(first!==undefined){selected=first;draw();board.querySelector('[data-slot="'+first+'"]').classList.add('bw-hint');say('Hier passt dein Teil hinein.');}
    });
    if(placed.size===parts)say('Hurra! '+animals[chosen].name+' ist fertig!');
    else if(placed.size)say('Hier kannst du weiterpuzzeln.');
    document.getElementById('bw-puzzle-help').hidden=!store.get('world-help-'+v2Profile(),true);
    draw();
  }

  const oldMagic=[
    ['🐱','Katze','#FFEAD6','#FFD0E3'],['🌈','Regenbogen','#D9F0FF','#FFF0B8'],
    ['🦋','Schmetterling','#FBE5FA','#E8E4FF'],['🐻','Bär','#E8F4DE','#FEE5C9'],
    ['🚀','Rakete','#E8E4FF','#CBE8F9'],['🦄','Einhorn','#F6E4FA','#DCEBFF'],
    ['🐠','Fisch','#D7F5F8','#B4E5FC'],['🦕','Dino','#E0F5D3','#FFF2C9'],
    ['🌸','Blume','#FFE3EB','#FFF5D2'],['🐴','Pferd','#FCE7D2','#E2F3E0'],
    ['🚜','Traktor','#E8F4DB','#FCE9C6'],['🐧','Pinguin','#D9EAF9','#F3F5FF']
  ];
  function enhancedScratch(){
    const scenes=(currentWorld?[currentWorld]:WORLDS).flatMap(w=>[w.id==='hof'?2:w.id==='wald'?1:0,w.id==='hof'?0:w.id==='wald'?0:1,3].map((index,i)=>{
      const m=w.items[index];return [m.emoji,m.name,w.bg,'#fff6d8',w.covers[i],m];
    }));
    const sheets = [
      ['hof','🐴','Pferd mit Fohlen','pferd-fohlen'],
      ['zauber','🦄','Einhorn mit Regenbogen','einhorn-regenbogen'],
      ['haus','🐱','Katze mit Wollknäuel','katze-wollknaeuel'],
      ['hof','🐴','Pony','pferd-pony'],
      ['haus','🐶','Hund mit Knochen','hund-knochen'],
      ['wald','🐰','Hase mit Karotte','hase-karotte'],
      ['zauber','🦄','Mama und Baby-Einhorn','einhorn-baby'],
      ['hof','🐄','Kuh','kuh'],
      ['hof','🐔','Hühner','huehner'],
      ['hof','🚜','Traktor','traktor'],
      ['stadt','🚒','Feuerwehrauto','feuerwehrauto']
    ].filter(([world]) => !currentWorld || currentWorld.id === world)
     .map(([,icon,name,file]) => [icon,name,'#fff1dc','#e7efff','✨',null,'motifs/malkiste-'+file+'.png']);
    const magic=[...sheets,...scenes,...(currentWorld?[]:oldMagic)];
    let selected=0,pointer=null,last=null,completed=false,moves=0;
    frame('Zauberbilder','Wische mit dem Finger und entdecke die Überraschung.',
      '<div class="activity-area scratch-wrap bw-magic-game">'
      +'<div class="scratch-tabs bw-magic-tabs" id="bw-magic-tabs" aria-label="Zauberbild wählen"></div>'
      +'<div class="scratch-stage bw-magic-stage"><canvas id="scratch-bg" width="900" height="570" aria-hidden="true"></canvas>'
      +'<canvas id="scratch-cover" width="900" height="570" aria-label="Bild durch Wischen freirubbeln"></canvas></div>'
      +'<div class="message-pill bw-game-message" id="bw-magic-message" role="status">Wisch die Farbe weg!</div>'
      +'<div class="bw-game-actions"><button class="big-btn primary" id="bw-magic-next">✨ Nächstes Bild</button>'
      +'<button class="big-btn" id="bw-magic-reveal">👀 Aufdecken</button></div></div>');
    const back=document.getElementById('scratch-bg'),cover=document.getElementById('scratch-cover');
    const b=back.getContext('2d'),c=cover.getContext('2d',{willReadFrequently:true}),msg=document.getElementById('bw-magic-message');
    const tabs=document.getElementById('bw-magic-tabs');
    const probe=document.createElement('canvas');probe.width=60;probe.height=38;const pctx=probe.getContext('2d',{willReadFrequently:true});
    if(!b||!c||!pctx){msg.textContent='Auf diesem Gerät können Zauberbilder leider nicht gezeichnet werden.';return;}
    function refreshTabs(){tabs.querySelectorAll('button').forEach(t=>t.classList.toggle('active',Number(t.dataset.magic)===selected));}
    function paint(){
      const [emoji,name,c1,c2]=magic[selected];completed=false;pointer=null;last=null;moves=0;
      const gradient=b.createLinearGradient(0,0,900,570);gradient.addColorStop(0,c1);gradient.addColorStop(1,c2);
      b.fillStyle=gradient;b.fillRect(0,0,900,570);
      for(let i=0;i<18;i++){const x=(i*137+43)%900,y=(i*89+71)%540;
        b.fillStyle=i%2?'#FFFFFF88':'#FDF6C688';b.beginPath();b.arc(x,y,9+i%4*5,0,Math.PI*2);b.fill();}
      b.textAlign='center';b.textBaseline='middle';
      b.font='310px "Apple Color Emoji","Segoe UI Emoji",sans-serif';b.fillText(emoji,450,268);
      if(magic[selected][6]){
        const scene=selected, img=new Image();
        img.onload=()=>{
          if(!back.isConnected || selected!==scene)return;
          const scale=Math.min(870/img.naturalWidth,460/img.naturalHeight);
          const width=img.naturalWidth*scale, height=img.naturalHeight*scale;
          b.fillStyle=gradient;
          b.fillRect(0,0,900,478);
          b.drawImage(img,(900-width)/2,8+(460-height)/2,width,height);
        };
        img.src=magic[selected][6];
      }else if(magic[selected][5]){
        const scene=selected,img=new Image();img.onload=()=>{if(!back.isConnected||selected!==scene)return;b.fillStyle=gradient;b.fillRect(200,48,500,420);b.drawImage(img,245,65,410,410)};img.src=motifUrl(magic[selected][5]);
      }
      b.font='bold 48px ui-rounded,system-ui,sans-serif';b.fillStyle='#50617A';b.fillText(name,450,514);
      c.globalCompositeOperation='source-over';c.clearRect(0,0,900,570);
      const layer=c.createLinearGradient(0,0,900,570);layer.addColorStop(0,'#AAA9E7');layer.addColorStop(1,'#90C9DB');
      c.fillStyle=layer;c.fillRect(0,0,900,570);
      for(let x=35;x<900;x+=123)for(let y=38;y<570;y+=100){
        c.fillStyle=((x+y)%2)?'#FFFFFF77':'#F7ECFF88';c.beginPath();c.arc(x,y,13,0,Math.PI*2);c.fill();
      }
      if(magic[selected][4]){
        c.font='70px system-ui';c.textAlign='center';
        for(let row=0;row<4;row++)for(let col=0;col<6;col++)c.fillText(magic[selected][4],65+col*155+(row%2)*22,85+row*145);
      }
      c.globalCompositeOperation='destination-out';c.lineCap='round';c.lineJoin='round';c.lineWidth=String(settings.ageBand)==='2'?155:125;
      msg.textContent='Wisch mit dem Finger!';document.getElementById('bw-magic-reveal').hidden=false;refreshTabs();
    }
    function coords(ev){
      const r=cover.getBoundingClientRect();
      if(!r.width||!r.height)return {x:450,y:285};
      return {x:Math.max(0,Math.min(900,(ev.clientX-r.left)/r.width*900)),
              y:Math.max(0,Math.min(570,(ev.clientY-r.top)/r.height*570))};
    }
    function stroke(from,to){
      c.beginPath();c.moveTo(from.x,from.y);c.lineTo(to.x,to.y);c.stroke();
      if(from.x===to.x&&from.y===to.y){c.beginPath();c.arc(to.x,to.y,c.lineWidth/2,0,Math.PI*2);c.fill();}
    }
    function uncover(){
      if(completed)return;
      completed=true;if(worldMotion())back.animate?.([{transform:'scale(.96)'},{transform:'scale(1)'}],{duration:440});c.clearRect(0,0,900,570);
      msg.textContent='Hurra! Das ist '+magic[selected][1]+'!';document.getElementById('bw-magic-reveal').hidden=true;beep();
    }
    function inspectProgress(){
      if(completed)return;
      try{
        pctx.clearRect(0,0,60,38);pctx.drawImage(cover,0,0,60,38);
        const pixels=pctx.getImageData(0,0,60,38).data;let cleared=0;
        for(let i=3;i<pixels.length;i+=4)if(pixels[i]<90)cleared++;
        if(cleared/2280>=.55)uncover();
      }catch{/* Wischen bleibt auch ohne Pixelzugriff möglich. */}
    }
    cover.addEventListener('pointerdown',ev=>{
      if(completed||pointer!==null||(ev.pointerType==='mouse'&&ev.button!==0))return;
      ev.preventDefault();pointer=ev.pointerId;last=coords(ev);stroke(last,last);
      try{cover.setPointerCapture(pointer);}catch{}beep('pop');
    });
    cover.addEventListener('pointermove',ev=>{
      if(ev.pointerId!==pointer||completed)return;ev.preventDefault();
      const now=coords(ev);stroke(last,now);last=now;
      if(++moves%8===0)inspectProgress();
    });
    const finish=ev=>{if(ev.pointerId!==pointer)return;pointer=null;last=null;inspectProgress();};
    ['pointerup','pointercancel','lostpointercapture'].forEach(type=>cover.addEventListener(type,finish));
    tabs.innerHTML=magic.map((a,i)=>'<button type="button" class="chip bw-magic-tab" data-magic="'+i+'" aria-label="'+a[1]+' wählen"><span aria-hidden="true">'+a[0]+'</span><small>'+a[1]+'</small></button>').join('');
    tabs.querySelectorAll('button').forEach(t=>t.addEventListener('click',()=>{selected=Number(t.dataset.magic);paint();}));
    on('bw-magic-next','click',()=>{selected=(selected+1)%magic.length;paint();});
    on('bw-magic-reveal','click',uncover);
    paint();
  }
  /* render() resolves puzzle dynamically; scratch is cached in EXTRA_PAGES. */
  puzzle=enhancedPuzzle;
  EXTRA_PAGES.scratch=enhancedScratch;
  window.bwMiniGamesPlus={version:'2.14.2',gridFor:gridFor,animalCount:legacyAnimals.length+24,magicCount:oldMagic.length+18};
})();
