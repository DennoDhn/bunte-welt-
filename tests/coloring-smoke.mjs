import { webkit } from 'playwright';

const browser=await webkit.launch({headless:true});
const context=await browser.newContext({
 viewport:{width:810,height:1080},deviceScaleFactor:2,hasTouch:true,
 userAgent:'Mozilla/5.0 (iPad; CPU OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1'
});
const page=await context.newPage();page.setDefaultTimeout(15000);
const errors=[];page.on('pageerror',e=>errors.push(String(e)));
function sampleCanvas(){
 return page.locator('#studio-canvas').evaluate(c=>{
  const x=Math.floor(c.width*.48),y=Math.floor(c.height*.48);
  return Array.from(c.getContext('2d').getImageData(x,y,1,1).data);
 });
}
async function tapCanvas(){
 const p=await page.locator('#studio-canvas').evaluate(c=>{
  const r=c.getBoundingClientRect();return{x:r.left+r.width*.48,y:r.top+r.height*.48};
 });
 await page.touchscreen.tap(p.x,p.y);
}
try{
 await page.goto('http://127.0.0.1:8765/',{waitUntil:'load'});
 await page.locator('[data-game="color"]').first().click();
 await page.waitForFunction(()=>document.getElementById('studio-save-state')?.textContent?.includes('Neues Blatt'),null,{timeout:20000});
 const horseBefore=await sampleCanvas();await tapCanvas();await page.waitForTimeout(150);
 const horseAfter=await sampleCanvas();
 if(JSON.stringify(horseBefore)===JSON.stringify(horseAfter))
  throw new Error('Fingermalen auf Pferd ohne sichtbare Farbe: '+horseBefore);
 console.log('Malkiste-Pferd: Farbstrich sichtbar');

 await page.locator('#studio-motifs').click();
 const picker=page.locator('#motif-options');
 if(!await picker.isVisible())throw new Error('Bilderauswahl oeffnet nicht');
 await page.setViewportSize({width:900,height:480});
 const grid=page.locator('#motif-grid');
 const dims=await grid.evaluate(el=>[el.scrollHeight,el.clientHeight]);
 if(dims[0]<=dims[1])throw new Error('Bildauswahl hat keine scrollbare Flaeche: '+dims);
 await page.locator('#motif-scrollbar').evaluate(el=>{el.value='100';el.dispatchEvent(new Event('input',{bubbles:true}));});
 const pos=await grid.evaluate(el=>el.scrollTop);
 if(pos<20)throw new Error('Ziehregler verschiebt Bildauswahl nicht: '+pos);
 console.log('Bildergalerie: Ziehregler laesst sich bedienen');

 await page.locator('[data-sheet="malkiste-unicorn"]').click({force:true});
 await page.waitForFunction(()=>/Neues Blatt|Bild gesichert/.test(document.getElementById('studio-save-state')?.textContent||''),null,{timeout:20000});
 const outlineCount=await page.locator('#studio-outline').evaluate(c=>{
  const d=c.getContext('2d').getImageData(0,0,c.width,c.height).data;
  let n=0;for(let i=3;i<d.length;i+=256)if(d[i]>0)n++;return n;
 });
 if(outlineCount<100)throw new Error('Einhorn-Konturen fehlen: '+outlineCount);
 console.log('Malkiste-Einhorn: Originalkonturen geladen');

 await page.locator('#studio-home').click();
 await page.locator('[data-game="draw"]').first().click();
 await page.waitForFunction(()=>document.getElementById('studio-save-state')?.textContent?.includes('Bereit'),null,{timeout:15000});
 const before=await sampleCanvas();await tapCanvas();await page.waitForTimeout(150);
 const after=await sampleCanvas();
 if(JSON.stringify(before)===JSON.stringify(after))throw new Error('Freies Malen nicht moeglich');
 console.log('Freies Malen: Fingerstrich sichtbar');
 if(errors.length)throw new Error('Browser-JavaScript-Fehler: '+errors.join(' | '));
 console.log('WebKit iPad smoke OK — Pferd, Einhorn, Fingerfarben, Bilderschieber, freies Malen.');
}finally{await context.close();await browser.close();}
