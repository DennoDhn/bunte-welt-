/* Meine bunte Welt: werbefreie Lernspiele, ohne TTS und ohne externe Bibliotheken.
   Sprachclips sind echte Audio-Dateien im Audio-Paket oder lokale Eltern-Uploads. */
'use strict';

const BW_ABC = [
  ['A','Apfel','🍎'],['B','Ball','⚽'],['C','Clown','🤡'],['D','Dino','🦕'],
  ['E','Ente','🦆'],['F','Fisch','🐟'],['G','Giraffe','🦒'],['H','Haus','🏠'],
  ['I','Igel','🦔'],['J','Jacke','🧥'],['K','Katze','🐈'],['L','Löwe','🦁'],
  ['M','Maus','🐭'],['N','Nase','👃'],['O','Oma','👵'],['P','Pferd','🐴'],
  ['Q','Qualle','🪼'],['R','Regen','🌧️'],['S','Sonne','☀️'],['T','Tiger','🐯'],
  ['U','Uhr','⏰'],['V','Vogel','🐦'],['W','Wolke','☁️'],['X','Xylophon','🎹'],
  ['Y','Yoga','🧘'],['Z','Zebra','🦓']
];
const BW_WORDS = [
  ['OMA','👵'],['MAMA','👩'],['PAPA','👨'],['EIS','🍦'],['AUTO','🚗'],
  ['HUND','🐶'],['BALL','⚽'],['ENTE','🦆'],['HAUS','🏠'],['SONNE','☀️']
];
const bwAudioUrls = new Map();
const bwAudioMissing = new Set();
let bwCurrentVoice = null;

function bwVoiceKeyForLetter(letter) { return 'abc-' + letter.toLowerCase(); }
function bwVoiceKeyForWord(word) { return 'wort-' + word.toLowerCase(); }
function bwOpenVoiceDb() {
  return new Promise((resolve,reject)=>{
    if(!('indexedDB' in window)) return reject(new Error('IndexedDB nicht verfügbar'));
    const req=indexedDB.open('bw-human-voice',1);
    req.onupgradeneeded=()=>{if(!req.result.objectStoreNames.contains('clips'))req.result.createObjectStore('clips',{keyPath:'key'});};
    req.onsuccess=()=>resolve(req.result);
    req.onerror=()=>reject(req.error);
  });
}
async function bwAudioEntries(){
  const db=await bwOpenVoiceDb();
  return new Promise((resolve,reject)=>{
    const tx=db.transaction('clips','readonly');
    const req=tx.objectStore('clips').getAll();
    req.onsuccess=()=>resolve(req.result||[]);
    req.onerror=()=>reject(req.error);
    tx.oncomplete=()=>db.close();
  });
}
async function bwAudioSave(key,blob){
  const db=await bwOpenVoiceDb();
  return new Promise((resolve,reject)=>{
    const tx=db.transaction('clips','readwrite');
    tx.objectStore('clips').put({key,blob,updated:Date.now()});
    tx.oncomplete=()=>{db.close();resolve();};
    tx.onerror=()=>{db.close();reject(tx.error);};
  });
}
function bwRememberAudio(key,blob) {
  if(bwAudioUrls.has(key)) URL.revokeObjectURL(bwAudioUrls.get(key));
  bwAudioUrls.set(key,URL.createObjectURL(blob));bwAudioMissing.delete(key);
}
async function bwWarmVoiceClips(){
  try{for(const item of await bwAudioEntries())if(item.blob)bwRememberAudio(item.key,item.blob);}catch(e){console.warn('Sprachpaket nicht geladen:',e);}
}
function bwPlayVoice(key,notice){
  if(!settings.sound||settings.quiet){if(notice)notice.textContent='Ton ist im Elternbereich ausgeschaltet.';return;}
  if(bwCurrentVoice){bwCurrentVoice.pause();bwCurrentVoice.currentTime=0;}
  if(bwAudioMissing.has(key)){if(notice)notice.textContent='Hier fehlt noch eine echte Sprachaufnahme.';return;}
  const url=bwAudioUrls.get(key)||new URL('audio/lernen/'+key+'.mp3',document.baseURI).href;
  const audio=new Audio(url);
  bwCurrentVoice=audio;
  audio.preload='auto';
  audio.addEventListener('error',()=>{
    if(!bwAudioUrls.has(key))bwAudioMissing.add(key);
    if(bwCurrentVoice===audio&&notice)notice.textContent='Hier fehlt noch eine echte Sprachaufnahme.';
  },{once:true});
  audio.play().catch(()=>{
    if(bwCurrentVoice===audio&&notice)notice.textContent='Zum Anhören bitte erneut auf den Lautsprecher tippen.';
  });
}
function bwStopVoice(){if(bwCurrentVoice){bwCurrentVoice.pause();bwCurrentVoice=null;}}
function bwShuffle(items){
  const copy=[...items];for(let i=copy.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[copy[i],copy[j]]=[copy[j],copy[i]];}return copy;
}
function bwLearningTitle(title,help,body){
  frame(title,help,'<section class="bw-learn"><div class="bw-learn-content">'+body+'</div></section>');
  bwWarmVoiceClips();
  cleanup.push(bwStopVoice);
}
function bwLearnNav(){
  return '<div class="bw-learn-nav"><button type="button" data-learn-nav="alphabet">ABC entdecken</button><button type="button" data-learn-nav="letterfind">Buchstaben finden</button><button type="button" data-learn-nav="wordbuild">Wörter tippen</button><button type="button" data-learn-nav="counting">Zählen</button></div>';
}
function bwBindLearnNav(){
  app.querySelectorAll('[data-learn-nav]').forEach(el=>el.addEventListener('click',()=>route(el.dataset.learnNav)));
}
function bwAlphabet(){
  let index=Math.min(25,Math.max(0,Number(store.get('learn-abc-'+v2Profile(),0))||0));
  bwLearningTitle('Mein ABC','Entdecke die Buchstaben von A bis Z.',
    '<div class="bw-learn-progress" id="bw-abc-progress"></div>'+
    '<div class="bw-letter-card"><span id="bw-letter-upper" class="bw-letter-upper">A</span>'+
    '<div class="bw-letter-word"><span id="bw-letter-picture" class="bw-word-picture"></span>'+
    '<strong id="bw-letter-word"></strong><span id="bw-letter-lower" class="bw-lowercase"></span></div></div>'+
    '<div class="bw-learn-actions"><button id="bw-abc-back" class="bw-learn-secondary">← Zurück</button>'+
    '<button id="bw-abc-listen" class="bw-learn-speaker">🔊 Anhören</button>'+
    '<button id="bw-abc-next" class="bw-learn-primary">Weiter →</button></div>'+
    '<p class="bw-learn-notice" id="bw-abc-message" role="status"></p>'+bwLearnNav());
  const show=()=>{
    const [letter,word,emoji]=BW_ABC[index];
    document.getElementById('bw-abc-progress').textContent='Buchstabe '+(index+1)+' von 26';
    document.getElementById('bw-letter-upper').textContent=letter;
    document.getElementById('bw-letter-picture').textContent=emoji;
    document.getElementById('bw-letter-word').textContent=word;
    document.getElementById('bw-letter-lower').textContent=letter.toLowerCase();
    document.getElementById('bw-abc-back').disabled=index===0;
    document.getElementById('bw-abc-next').textContent=index===25?'Wieder von vorn ↻':'Weiter →';
    document.getElementById('bw-abc-message').textContent='';
    store.set('learn-abc-'+v2Profile(),index);
  };
  on('bw-abc-back','click',()=>{index=Math.max(0,index-1);bwStopVoice();show();});
  on('bw-abc-next','click',()=>{index=(index+1)%BW_ABC.length;bwStopVoice();show();});
  on('bw-abc-listen','click',()=>bwPlayVoice(bwVoiceKeyForLetter(BW_ABC[index][0]),document.getElementById('bw-abc-message')));
  bwBindLearnNav();show();
}
function bwLetterFind(){
  let rounds=0,solved=false,timer=0;
  bwLearningTitle('Buchstaben finden','Welcher Buchstabe wird gesucht?',
    '<div class="bw-learn-progress" id="bw-find-progress"></div>'+
    '<div class="bw-find-head"><div class="bw-find-target" id="bw-find-target"></div><button id="bw-find-listen" class="bw-learn-speaker">🔊 Anhören</button></div>'+
    '<div class="bw-choices" id="bw-find-choices"></div><p class="bw-learn-notice" id="bw-find-message" role="status"></p>'+bwLearnNav());
  const message=document.getElementById('bw-find-message');
  let target=null;
  const next=()=>{
    solved=false;rounds++;
    const easy=settings.easy||settings.ageBand==='2';
    const pool=easy?BW_ABC.slice(0,8):BW_ABC;
    target=pool[Math.floor(Math.random()*pool.length)];
    const wrong=bwShuffle(pool.filter(x=>x!==target)).slice(0,easy?2:3);
    const letters=bwShuffle([target,...wrong]);
    document.getElementById('bw-find-progress').textContent='Runde '+rounds+' · Ohne Zeitlimit';
    document.getElementById('bw-find-target').textContent='Finde das '+target[0];
    document.getElementById('bw-find-choices').innerHTML=letters.map(item=>
      '<button type="button" class="bw-letter-choice" data-letter="'+item[0]+'" aria-label="Buchstabe '+item[0]+'">'+item[0]+'</button>'
    ).join('');
    message.textContent='';
  };
  on('bw-find-listen','click',()=>bwPlayVoice(bwVoiceKeyForLetter(target[0]),message));
  document.getElementById('bw-find-choices').addEventListener('click',event=>{
    const b=event.target.closest('[data-letter]');if(!b||solved)return;
    if(b.dataset.letter!==target[0]){message.textContent='Versuch es noch einmal.';b.classList.add('bw-try-again');return;}
    solved=true;b.classList.add('bw-right');message.textContent='Ja, das ist das '+target[0]+'!';
    beep();timer=window.setTimeout(next,1100);
  });
  cleanup.push(()=>clearTimeout(timer));
  bwBindLearnNav();next();
}
function bwWordBuild(){
  let wordIndex=Number(store.get('learn-word-'+v2Profile(),0))||0;
  let typed='',solved=false,tiles=[],timer=0;
  bwLearningTitle('Wörter tippen','Baue kleine Wörter mit großen Buchstabentasten.',
    '<div class="bw-learn-progress" id="bw-build-progress"></div>'+
    '<div class="bw-build-art" id="bw-build-art"></div><div class="bw-build-line" id="bw-build-line"></div>'+
    '<div class="bw-build-tiles" id="bw-build-tiles"></div>'+
    '<div class="bw-learn-actions"><button id="bw-build-undo" class="bw-learn-secondary">← Löschen</button>'+
    '<button id="bw-build-hear" class="bw-learn-speaker">🔊 Wort hören</button>'+
    '<button id="bw-build-hint" class="bw-learn-secondary">👀 Hilfe</button></div>'+
    '<p class="bw-learn-notice" id="bw-build-message" role="status"></p>'+bwLearnNav());
  const status=document.getElementById('bw-build-message');
  let current=null;
  const display=()=>{
    document.getElementById('bw-build-line').textContent=typed+'_'.repeat(current[0].length-typed.length);
    document.getElementById('bw-build-tiles').innerHTML=tiles.map((tile,i)=>
      '<button class="bw-build-tile" data-tile="'+i+'" '+(tile.used?'disabled':'')+'>'+tile.char+'</button>'
    ).join('');
  };
  const next=()=>{
    current=BW_WORDS[(wordIndex+BW_WORDS.length)%BW_WORDS.length];
    typed='';solved=false;
    tiles=bwShuffle([...current[0]].map((char,i)=>({char,id:i,used:false})));
    document.getElementById('bw-build-art').textContent=current[1];
    document.getElementById('bw-build-progress').textContent='Wort '+((wordIndex%BW_WORDS.length)+1)+' von '+BW_WORDS.length;
    status.textContent='';
    display();store.set('learn-word-'+v2Profile(),wordIndex);
  };
  document.getElementById('bw-build-tiles').addEventListener('click',e=>{
    const button=e.target.closest('[data-tile]');if(!button||solved)return;
    const tile=tiles[Number(button.dataset.tile)];if(!tile||tile.used)return;
    tile.used=true;typed+=tile.char;display();
    if(typed.length!==current[0].length)return;
    if(typed===current[0]){solved=true;beep();status.textContent='Super! '+current[0]+' ist richtig.';wordIndex++;timer=setTimeout(next,1700);}
    else{status.textContent='Fast! Versuch es noch mal.';timer=setTimeout(()=>{typed='';tiles.forEach(t=>t.used=false);display();},1100);}
  });
  on('bw-build-undo','click',()=>{if(solved||!typed)return;const char=typed.slice(-1);const tile=tiles.filter(t=>t.used&&t.char===char).pop();if(tile)tile.used=false;typed=typed.slice(0,-1);status.textContent='';display();});
  on('bw-build-hear','click',()=>bwPlayVoice(bwVoiceKeyForWord(current[0]),status));
  on('bw-build-hint','click',()=>{status.textContent='So sieht es aus: '+current[0];});
  cleanup.push(()=>clearTimeout(timer));bwBindLearnNav();next();
}
function bwCounting(){
  let number=1,round=0,solved=false,timer=0;
  const symbols=['🍎','⭐','🐥','🌸','🐞','🍓'];
  bwLearningTitle('Zahlen entdecken','Wie viele Dinge kannst du zählen?',
    '<div class="bw-learn-progress" id="bw-count-progress"></div><div class="bw-count-items" id="bw-count-items"></div>'+
    '<div class="bw-choices" id="bw-count-choices"></div><p class="bw-learn-notice" id="bw-count-message" role="status"></p>'+bwLearnNav());
  const status=document.getElementById('bw-count-message');
  const next=()=>{
    solved=false;round++;
    const max=settings.easy||settings.ageBand==='2'?3:6;
    number=1+Math.floor(Math.random()*max);
    const symbol=symbols[Math.floor(Math.random()*symbols.length)];
    document.getElementById('bw-count-progress').textContent='Wie viele sind das? · Runde '+round;
    document.getElementById('bw-count-items').innerHTML=Array.from({length:number},()=>
      '<span aria-hidden="true">'+symbol+'</span>').join('');
    const guesses=bwShuffle([number,...bwShuffle(Array.from({length:max},(_,i)=>i+1).filter(n=>n!==number)).slice(0,2)]);
    document.getElementById('bw-count-choices').innerHTML=guesses.map(n=>'<button class="bw-letter-choice" data-number="'+n+'">'+n+'</button>').join('');
    status.textContent='';
  };
  document.getElementById('bw-count-choices').addEventListener('click',e=>{
    const b=e.target.closest('[data-number]');if(!b||solved)return;
    if(Number(b.dataset.number)!==number){status.textContent='Zähle noch einmal ganz in Ruhe.';return;}
    solved=true;b.classList.add('bw-right');status.textContent='Richtig! Das sind '+number+'.';beep();timer=setTimeout(next,1100);
  });
  cleanup.push(()=>clearTimeout(timer));bwBindLearnNav();next();
}
function bwInstallLearningAudioManager(){
  const panel=app.querySelector('.panel');if(!panel)return;
  const wrap=document.createElement('section');wrap.className='bw-audio-admin';
  wrap.innerHTML='<h2>Echte Sprachaufnahmen für die Lernspiele</h2>'+
    '<p>Keine KI und keine Computerstimme. Hier lassen sich professionell eingesprochene MP3-, OGG-, WAV- oder M4A-Dateien hinzufügen. Alle Aufnahmen bleiben auf diesem Gerät und funktionieren auch offline.</p>'+
    '<p>Dateinamen: <code>abc-a.mp3</code> bis <code>abc-z.mp3</code> (zum Beispiel gesprochen „A wie Apfel“) und <code>wort-oma.mp3</code>, <code>wort-mama.mp3</code> usw. für die Wörter.</p>'+
    '<label class="bw-audio-import">Sprachdateien auswählen<input id="bw-audio-upload" type="file" multiple accept=".mp3,.ogg,.wav,.m4a,audio/*"></label>'+
    '<p id="bw-audio-state" role="status">Aufnahmen werden geprüft …</p>';
  panel.append(wrap);
  const state=wrap.querySelector('#bw-audio-state');
  const valid=new Set([...BW_ABC.map(row=>bwVoiceKeyForLetter(row[0])),...BW_WORDS.map(row=>bwVoiceKeyForWord(row[0]))]);
  const refresh=async()=>{try{const clips=await bwAudioEntries();state.textContent=clips.filter(c=>valid.has(c.key)).length+' von '+valid.size+' Sprachaufnahmen auf diesem Gerät vorhanden.';}catch{state.textContent='Lokaler Audiospeicher ist nicht verfügbar.';}};
  wrap.querySelector('#bw-audio-upload').addEventListener('change',async e=>{
    let count=0,errors=0;
    for(const file of e.target.files){
      const key=file.name.toLowerCase().replace(/\.(mp3|ogg|wav|m4a)$/,'');
      if(!valid.has(key)||!/\.(mp3|ogg|wav|m4a)$/i.test(file.name)||file.size>6000000||!file.size){errors++;continue;}
      try{await bwAudioSave(key,file);bwRememberAudio(key,file);count++;}catch{errors++;}
    }
    e.target.value='';
    await refresh();if(errors)state.textContent+=' '+errors+' Datei(en) übersprungen.';if(count)toast(count+' Sprachaufnahme(n) gespeichert.');
  });
  refresh();
}
