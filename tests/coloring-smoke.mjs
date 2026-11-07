import { webkit } from 'playwright';
const browser=await webkit.launch({headless:true});
const context=await browser.newContext({viewport:{width:810,height:1080},deviceScaleFactor:2,hasTouch:true,userAgent:'Mozilla/5.0 (iPad; CPU OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1'});
const page=await context.newPage(),errors=[];
page.on('pageerror',e=>errors.push(String(e)));
try{
 await page.goto('http://127.0.0.1:8765/',{waitUntil:'load'});
 await page.locator('[data-game="color"]').first().click();
 await page.waitForFunction(()=>document.getElementById('studio-save-state')?.textContent?.includes('Neues Blatt'),{timeout:30000});
 const beforeLines=await page.locator('#studio-outline').evaluate(c=>c.toDataURL());
 const canvas=page.locator('#studio-canvas'),before=await canvas.evaluate(c=>c.toDataURL());
 await page.locator('[data-c="#DF5264"]').first().click();
 const r=await canvas.boundingBox();if(!r)throw Error('Malfläche nicht sichtbar');
 await page.touchscreen.tap(r.x+r.width*.45,r.y+r.height*.5);
 await page.waitForTimeout(350);
 if(before===await canvas.evaluate(c=>c.toDataURL()))throw Error('Finger trägt keine Farbe auf');
 if(beforeLines!==await page.locator('#studio-outline').evaluate(c=>c.toDataURL()))throw Error('Konturen wurden übermalt');
 await page.locator('#studio-motifs').click();
 const grid=page.locator('#motif-grid');if(await grid.locator('[data-sheet]').count()!==11)throw Error('Nicht 11 Motive');
 const size=await grid.evaluate(e=>[e.scrollHeight,e.clientHeight]);if(size[0]<=size[1])throw Error('Bildbrowser nicht scrollbar: '+size);
 await page.locator('#motif-scrollbar').evaluate(el=>{el.value='100';el.dispatchEvent(new Event('input',{bubbles:true}));});
 if(await grid.evaluate(e=>e.scrollTop)<10)throw Error('Schieberegler reagiert nicht');
 await page.locator('[data-sheet="malkiste-unicorn-baby"]').click({force:true});
 await page.waitForFunction(()=>/Neues Blatt|Bild gesichert/.test(document.getElementById('studio-save-state')?.textContent||''),{timeout:25000});
 if(beforeLines===await page.locator('#studio-outline').evaluate(c=>c.toDataURL()))throw Error('Motivwechsel erfolglos');
 if(errors.length)throw Error('JS-Fehler: '+errors.join(' | '));
 console.log('iPad-WebKit: Farbe, Konturen, 11 CC0-Bilder, Scrollen OK');
}finally{await context.close();await browser.close();}
