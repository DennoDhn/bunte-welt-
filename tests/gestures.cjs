const {readFileSync}=require('node:fs');
const vm=require('node:vm');
const assert=require('node:assert/strict');
const handlers={};
class Element { constructor(editable=false){this.editable=editable;} closest(){return this.editable?this:null;} }
const context=vm.createContext({Element,activePage:'draw',document:{addEventListener(type,handler,options){assert.equal(options.passive,false);handlers[type]=handler;}}});
vm.runInContext(readFileSync('gestures.js','utf8'),context);
function event(type,{touches=2,editable=false,cancelable=true}={}){let blocked=false;handlers[type]({target:new Element(editable),touches:Array(touches),cancelable,preventDefault(){blocked=true;}});return blocked;}
assert.equal(event('touchstart'),true,'pinch starts blocked');
assert.equal(event('touchmove'),true,'pinch motion blocked');
assert.equal(event('touchstart',{touches:1}),false,'single-finger painting allowed');
assert.equal(event('gesturestart'),true,'Safari gesture blocked');
assert.equal(event('gesturechange'),true);
assert.equal(event('dblclick'),true);
assert.equal(event('touchstart',{editable:true}),false,'form editing retained');
assert.equal(event('gesturestart',{cancelable:false}),false);
context.activePage='parents';
assert.equal(event('gesturestart'),false,'parent-area zoom retained');
console.log('PASS: child zoom prevention, single-touch painting and parent accessibility');
context.activePage='draw';let clock=1000,clicks=0;context.Date={now:()=>clock};
const button=new Element();button.closest=selector=>selector==='button'?button:null;button.click=()=>clicks++;
function tapEnd(x=20){let blocked=false;handlers.touchend({target:button,touches:[],changedTouches:[{clientX:x,clientY:20}],cancelable:true,preventDefault(){blocked=true;}});return blocked;}
assert.equal(tapEnd(),false);clock+=150;assert.equal(tapEnd(),true);assert.equal(clicks,1,'second button activation preserved');
clock=2000;tapEnd();clock+=150;let blocked=false;
handlers.touchmove({type:'touchmove',target:button,touches:[{clientX:20,clientY:60}],cancelable:true,preventDefault(){blocked=true;}});
assert.equal(blocked,true,'second tap plus drag prevented');assert.equal(tapEnd(),true);assert.equal(clicks,1,'drag does not activate button again');
console.log('PASS: double-tap and double-tap-drag on buttons');
