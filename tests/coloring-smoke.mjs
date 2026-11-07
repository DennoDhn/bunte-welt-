import { webkit } from 'playwright';

const browser = await webkit.launch({headless:true});
const context = await browser.newContext({
 viewport:{width:810,height:1080},deviceScaleFactor:2,hasTouch:true,
 userAgent:'Mozilla/5.0 (iPad; CPU OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1'
});
const page=await context.newPage();
const errors=[];
page.on('pageerror',error=>errors.push(String(error)));
try {
 await page.goto('http://127.0.0.1:8765/',{waitUntil:'load'});
 await page.locator('[data-game="color"]').first().click();
 await page.locator('#motif-picker summary').click();
 await page.locator('[data-template="fish"]').click();
 await page.locator('.color-dot[data-color="#F16A79"]').click();
 const fish=page.locator('#color-svg [data-colorpart="body"]');
 await fish.click({force:true});
 const fill=await fish.getAttribute('fill');
 if(fill!=='#F16A79')throw new Error('SVG-Fuellung funktioniert nicht: '+fill);

 await page.locator('#motif-picker summary').click();
 await page.locator('#template-slider').evaluate(slider=>{slider.value='100';slider.dispatchEvent(new Event('input',{bubbles:true}));});
 const scrolled=await page.locator('#templates').evaluate(el=>el.scrollLeft);
 if(scrolled<100)throw new Error('Bilderleiste ist nicht verschiebbar: '+scrolled);
 await page.locator('[data-template="malkiste-horse"]').click();
 await page.waitForFunction(()=>document.getElementById('color-bitmap')?.width>=400 && document.getElementById('color-bitmap')?.height>=400,null,{timeout:15000});
 const pixelBefore=await page.locator('#color-bitmap').evaluate(c=>{
  const x=Math.floor(c.width*260/720),y=Math.floor(c.height*600/1000);const d=c.getContext('2d').getImageData(x,y,1,1).data;return Array.from(d);
 });
 const coords=await page.locator('#color-bitmap').evaluate(c=>{
  const r=c.getBoundingClientRect();return{x:r.left+r.width*(260/720),y:r.top+r.height*(600/1000)};
 });
 await page.touchscreen.tap(coords.x,coords.y);
 await page.waitForTimeout(250);
 const pixelAfter=await page.locator('#color-bitmap').evaluate(c=>{
  const x=Math.floor(c.width*260/720),y=Math.floor(c.height*600/1000);const d=c.getContext('2d').getImageData(x,y,1,1).data;return Array.from(d);
 });
 if(JSON.stringify(pixelBefore)===JSON.stringify(pixelAfter)){
  throw new Error('Malkiste-Farbfuellung nicht sichtbar: '+JSON.stringify(pixelBefore));
 }

 await page.locator('#back').click();
 await page.locator('[data-game="draw"]').first().click();
 await page.locator('#studio-motifs').click();
 const grid=page.locator('#motif-grid');
 const dims=await grid.evaluate(el=>[el.scrollHeight,el.clientHeight]);
 if(dims[0]<=dims[1])throw new Error('Bildergalerie zu klein oder nicht scrollbar: '+dims);
 await page.locator('#motif-scrollbar').evaluate(slider=>{slider.value='100';slider.dispatchEvent(new Event('input',{bubbles:true}));});
 const pos=await grid.evaluate(el=>el.scrollTop);
 if(pos<20)throw new Error('Bildergalerie-Slider scrollt nicht: '+pos);
 await page.locator('#motif-prev').click();
 await page.locator('[data-sheet="malkiste-unicorn"]').click({force:true});
 await page.waitForFunction(()=>document.getElementById('studio-save-state')?.textContent?.includes('Neues Blatt'),{timeout:15000});
 if(errors.length)throw new Error('JavaScript-Fehler: '+errors.join(' | '));
 console.log('WebKit iPad smoke OK — SVG-Fuellen, Malkiste-PNG-Fuellen, Bildleisten-Slider, Malstudio.');
}finally{await context.close();await browser.close();}
