const fs=require('node:fs');
const vm=require('node:vm');
const assert=require('node:assert/strict');
const source=fs.readFileSync('mini-games-plus.js','utf8');
function extract(name){
 const start=source.indexOf('function '+name+'(');
 assert(start>=0,'Missing '+name);
 const open=source.indexOf('{',start);
 let depth=0,end=-1;
 for(let i=open;i<source.length;i++){if(source[i]==='{')depth++;if(source[i]==='}'&&!--depth){end=i+1;break;}}
 assert(end>open,'Unclosed '+name);
 return source.slice(start,end);
}
const context={Math};
vm.createContext(context);
vm.runInContext(extract('snapDistance')+'\n'+extract('snapAllowed'),context);
const rect={left:100,top:100,right:200,bottom:200,width:100,height:100};
for(const [x,y,expected] of [[150,150,true],[100,100,true],[235,150,true],[236,150,false],[150,65,true],[150,64,false],[235,235,false],[0,0,false]]){
 assert.equal(context.snapAllowed(x,y,rect),expected,'Snap geometry '+x+','+y);
}
const narrow={left:10,top:10,right:50,bottom:90,width:40,height:80};
assert.equal(context.snapAllowed(64,30,narrow),true);
assert.equal(context.snapAllowed(65,30,narrow),false);
assert(source.includes('clearTargets();'),'Target highlighting must clean up');
assert(source.includes('pointercancel')&&source.includes('lostpointercapture'),'Cancellation cleanup');
assert(source.includes('window.addEventListener(\'blur\',endDrag)'),'Window blur cleanup');
assert(source.includes('saveProgress();selected=null'),'Successful placement must persist');
assert(source.includes('validIndices(saved.placed,saved.parts)'),'Restored pieces must be validated');
console.log('Puzzle snap geometry and lifecycle regression checks passed');
