'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const root=path.join(__dirname,'..');
const read=file=>fs.readFileSync(path.join(root,file),'utf8');
const learning=read('learning-games.js');
const context=vm.createContext({console,Map,Set,URL,Promise,Math,Date,Array,Object,String,Number});
vm.runInContext(learning,context,{filename:'learning-games.js'});

test('26 unterschiedliche Buchstaben mit kindgerechten Beispielwörtern',()=>{
  const rows=vm.runInContext('BW_ABC.map(row=>[...row])',context);
  assert.equal(rows.length,26);
  assert.equal(rows.map(row=>row[0]).join(''),'ABCDEFGHIJKLMNOPQRSTUVWXYZ');
  for(const [letter,word,picture] of rows){
    assert.equal(word.toUpperCase().startsWith(letter),true,letter+' -> '+word);
    assert.ok(picture.length>0);
  }
});

test('Wortspiel hat eindeutige kindgerechte Aufgaben und echte Buchstabentasten',()=>{
  const rows=vm.runInContext('BW_WORDS.map(row=>[...row])',context);
  assert.ok(rows.length>=8);
  for(const [word,picture] of rows){
    assert.match(word,/^[A-Z]+$/);
    assert.ok(picture.length>0);
  }
  assert.equal(new Set(rows.map(row=>row[0])).size,rows.length);
});

test('Sprachschlüssel entsprechen dem Dokumentations-Paket',()=>{
  assert.equal(context.bwVoiceKeyForLetter('A'),'abc-a');
  assert.equal(context.bwVoiceKeyForLetter('Z'),'abc-z');
  assert.equal(context.bwVoiceKeyForWord('OMA'),'wort-oma');
  assert.equal(context.bwVoiceKeyForWord('SONNE'),'wort-sonne');
  const docs=read('docs/LERN-AUDIO.md');
  assert.match(docs,/abc-a\.mp3/);
  assert.match(docs,/abc-z\.mp3/);
  assert.match(docs,/wort-sonne\.mp3/);
});

test('Neue Lernspiele verwenden keine synthetische Sprachausgabe',()=>{
  assert.doesNotMatch(learning,/speechSynthesis|SpeechSynthesisUtterance|responsivevoice|textToSpeech/i);
  assert.match(learning,/new Audio\(/);
  assert.match(learning,/bwOpenVoiceDb/);
});

test('Routen, Homepage und Cache enthalten die vier Lernspiele',()=>{
  const app=read('app.js'),home=read('v2.js'),index=read('index.html'),sw=read('sw.js');
  for(const id of ['alphabet','letterfind','wordbuild','counting']){
    assert.match(app,new RegExp("['\\\"]"+id+"['\\\"]"));
  }
  assert.match(home,/'alphabet'/);
  assert.ok(index.indexOf('learning-games.js?v=2.18.0')<index.indexOf('app.js?v=2.18.0'));
  assert.match(index,/learning-games\.css\?v=2\.18\.0/);
  assert.match(sw,/learning-games\.js\?v=2\.18\.0/);
  assert.match(sw,/learning-games\.css\?v=2\.18\.0/);
});

test('Zufallsauswahl lässt alle Elemente unverändert',()=>{
  const items=['A','B','C','D'];
  for(let i=0;i<30;i++){
    const value=context.bwShuffle(items);
    assert.deepEqual([...value].sort(),items);
    assert.notEqual(value,items);
  }
});
