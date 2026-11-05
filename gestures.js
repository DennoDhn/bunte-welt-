/* The child activity area behaves like a drawing app; parent settings keep normal zoom. */
(() => {
 'use strict';
 const childArea = () => typeof activePage !== 'undefined' && activePage !== 'parents';
 let lastTap=0,lastX=0,lastY=0,repeatDrag=false;
 const editable = target => target instanceof Element && !!target.closest('input,textarea,select,[contenteditable="true"]');
 function stopGesture(event) {
  if (childArea() && !editable(event.target) && event.cancelable) event.preventDefault();
 }
 function stopMultiTouch(event) {
  if (event.touches.length > 1) {stopGesture(event);return;}
  const touch=event.touches[0];
  if(touch && event.target instanceof Element && event.target.closest('button') && Date.now()-lastTap<500){
   if(Math.hypot(touch.clientX-lastX,touch.clientY-lastY)>8)repeatDrag=true;
   if(event.type==='touchmove')stopGesture(event);
  }
 }
 function stopDoubleTap(event) {
  if(!childArea() || editable(event.target) || event.touches.length || event.changedTouches.length!==1)return;
  const touch=event.changedTouches[0],now=Date.now();
  const button=event.target.closest('button');
  if(button && repeatDrag){event.preventDefault();repeatDrag=false;lastTap=0;return;}
  if(button && now-lastTap<350 && Math.hypot(touch.clientX-lastX,touch.clientY-lastY)<32 && event.cancelable){
   // Cancel Safari's second-tap zoom, but preserve the second button action.
   event.preventDefault();button.click();lastTap=0;
  }else{lastTap=now;lastX=touch.clientX;lastY=touch.clientY;}
 }
 document.addEventListener('touchend', stopDoubleTap, {passive:false,capture:true});
 document.addEventListener('touchstart', stopMultiTouch, {passive:false,capture:true});
 document.addEventListener('touchmove', stopMultiTouch, {passive:false,capture:true});
 document.addEventListener('gesturestart', stopGesture, {passive:false,capture:true});
 document.addEventListener('gesturechange', stopGesture, {passive:false,capture:true});
 document.addEventListener('dblclick', stopGesture, {passive:false,capture:true});
})();
