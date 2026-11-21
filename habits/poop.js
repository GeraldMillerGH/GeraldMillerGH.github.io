/* Silly celebrations for June's poop button. Each tap picks a different show.
   Call window.poopParty(tileElement, countToday). Everything is emoji + Web Animations; no files, no sound. */
(function(){
  var css='#poopfx{position:fixed;inset:0;pointer-events:none;overflow:hidden;z-index:50}'+
    '#poopfx .e{position:absolute;left:0;top:0;line-height:1;will-change:transform;user-select:none}'+
    '#poopfx .cap{position:absolute;left:0;right:0;text-align:center;font-weight:800;font-size:2rem;color:#fff;'+
    'text-shadow:0 2px 0 #7a4a1f,0 0 12px rgba(0,0,0,.5);padding:0 16px}'+
    '#poopfx .drip{position:absolute;border-radius:50% 50% 50% 50%/60% 60% 40% 40%;background:#8b5a2b}'+
    '#poopdim{position:fixed;inset:0;background:var(--bg,#1b1a18);opacity:0;pointer-events:none;z-index:40;transition:opacity .35s ease}'+
    '#poopdim.on{opacity:.7}.poopstar{position:relative;z-index:45}'+
    '#poopfx .stack{position:absolute;left:0;top:0;display:flex;flex-direction:column;align-items:center;line-height:1}';
  var st=document.createElement('style');st.textContent=css;document.head.appendChild(st);

  var layer=null, running=0, last=-1, dim=null, star=null;
  // While a show runs, the rest of the page fades back; the poop button stays bright on top.
  function dimOn(tile){
    if(!dim){dim=document.createElement('div');dim.id='poopdim';document.body.appendChild(dim)}
    star=tile;tile.classList.add('poopstar');void dim.offsetWidth;dim.classList.add('on');
  }
  function dimOff(){if(running)return;if(dim)dim.classList.remove('on');var t=star;setTimeout(function(){if(!running&&t)t.classList.remove('poopstar')},350)}
  function L(){if(!layer){layer=document.createElement('div');layer.id='poopfx';document.body.appendChild(layer)}return layer}
  function r(a,b){return a+Math.random()*(b-a)}
  function ri(a,b){return Math.floor(r(a,b+1))}
  function pick(a){return a[Math.floor(Math.random()*a.length)]}
  function W(){return window.innerWidth} function H(){return window.innerHeight}
  function wait(ms){return new Promise(function(res){setTimeout(res,ms)})}
  function emo(ch,size){var e=document.createElement('div');e.className='e';e.textContent=ch;e.style.fontSize=size+'px';L().appendChild(e);return e}
  function at(x,y,size,rot,sc){return 'translate('+(x-size/2)+'px,'+(y-size/2)+'px) rotate('+(rot||0)+'deg) scale('+(sc==null?1:sc)+')'}
  function anim(el,frames,opts){var a=el.animate(frames,opts);return a.finished.then(function(){},function(){})}
  function gone(el,a){return a.then(function(){el.remove()})}
  function center(el){var b=el.getBoundingClientRect();return {x:b.left+b.width/2,y:b.top+b.height/2,w:b.width,h:b.height}}

  var LINES=['Royal flush!','Splendid deposit!','Poop-tastic!','Ka-PLOOSH!','Plop plop hooray!','Mission accomplished!',
    'The eagle has landed!','Bombs away!','Brown-ie points!','Nailed it!','Smells like victory!','Gold medal poop!',
    'Turd-ific!','Bye bye, poop!','Splash zone!','Excellent work, captain!','Ta-da!','Unstoppable!'];
  var COUNT_LINES={2:['Double trouble!','Two-time champion!','Poop, the sequel!'],3:['Hat trick!','Three-peat!','Triple scoop!'],
    4:['Poop-a-palooza!','Four alarm poop!'],5:['Legendary pooper!','Poop machine!']};
  function line(n){var c=COUNT_LINES[Math.min(n,5)];return c&&Math.random()<.7?pick(c):pick(LINES)}
  function caption(text,y){
    var c=document.createElement('div');c.className='cap';c.textContent=text;c.style.top=(y||H()*.28)+'px';L().appendChild(c);
    return gone(c,anim(c,[{transform:'scale(.2) rotate(-12deg)',opacity:0},{transform:'scale(1.25) rotate(4deg)',opacity:1,offset:.25},
      {transform:'scale(1) rotate(0)',opacity:1,offset:.4},{transform:'scale(1) translateY(-10px)',opacity:1,offset:.85},{transform:'scale(.9) translateY(-30px)',opacity:0}],
      {duration:2200,easing:'ease-out'}));
  }
  function burst(x,y,chars,n,spread,size){
    var all=[];for(var i=0;i<n;i++){(function(){
      var s=size*r(.6,1.2),e=emo(pick(chars),s),ang=r(-Math.PI*.95,-Math.PI*.05),d=spread*r(.5,1.1),
        dx=Math.cos(ang)*d,dy=Math.sin(ang)*d,rot=r(-200,200);
      all.push(gone(e,anim(e,[{transform:at(x,y,s,0,.3),opacity:1},{transform:at(x+dx,y+dy,s,rot/2,1),opacity:1,offset:.45},
        {transform:at(x+dx*1.3,y+dy*.4+spread*.8,s,rot,.8),opacity:0}],{duration:r(800,1300),easing:'cubic-bezier(.2,.7,.4,1)'})));
    })()}return Promise.all(all);
  }

  /* 1. Down the toilet: the button (or a poop) swirls into a toilet that pops up, then it splashes. Lots of random twists. */
  function toilet(tile,n){
    var b=center(tile), ts=r(110,160), tx=W()/2+r(-W()*.15,W()*.15), ty=H()-ts*.75-r(20,60);
    var T=emo(pick(['🚽','🚽','🚽','🚽','🛁']),ts);
    var up=anim(T,[{transform:at(tx,H()+ts,ts,0)},{transform:at(tx,ty-10,ts,0)},{transform:at(tx,ty,ts,0)}],{duration:420,easing:'ease-out',fill:'forwards'});
    var mouthY=ty-ts*.18, buttonGoes=Math.random()<.5, twist=pick(['plain','bounce','escape','spin','parade']);
    // Travellers are made only when their trip starts, so nothing sits in the corner while the toilet rises.
    var travellers=[];
    if(buttonGoes){
      travellers.push({make:function(t){
        var ghost=tile.cloneNode(true);ghost.querySelectorAll('.minus').forEach(function(m){m.remove()});
        ghost.style.cssText='position:absolute;left:0;top:0;width:'+b.w+'px;height:'+b.h+'px;margin:0;transform:'+'translate('+(b.x-b.w/2)+'px,'+(b.y-b.h/2)+'px)';
        ghost.className+=' e';L().appendChild(ghost);tile.style.visibility='hidden';t.w=b.w;t.h=b.h;return ghost;
      }});
    }else{
      var k=twist==='parade'?Math.min(Math.max(n,2),5):1;
      for(var i=0;i<k;i++){travellers.push({make:function(t){t.w=t.h=r(46,64);return emo('💩',t.w)}})}
    }
    function pos(t,x,y,rot,sc){return 'translate('+(x-t.w/2)+'px,'+(y-t.h/2)+'px) rotate('+rot+'deg) scale('+sc+')'}
    var dir=Math.random()<.5?-1:1, turns=dir*360*ri(1,4), arcX=r(-W()*.3,W()*.3);
    var trips=travellers.map(function(t,i){
      return up.then(function(){return wait(i*260)}).then(function(){
        t.el=t.make(t);
        var fr=[{transform:pos(t,b.x,b.y,0,1),offset:0},
          {transform:pos(t,(b.x+tx)/2+arcX,Math.min(b.y,mouthY)-r(80,180),turns*.25,buttonGoes?.8:1.1),offset:.35},
          {transform:pos(t,tx,mouthY-20,turns*.5,buttonGoes?.6:1),offset:.6}];
        if(twist==='bounce')fr.push({transform:pos(t,tx+r(-30,30),mouthY-90,turns*.6,buttonGoes?.6:1),offset:.72},{transform:pos(t,tx,mouthY,turns*.75,buttonGoes?.5:.9),offset:.84});
        if(twist==='escape')fr.push({transform:pos(t,tx,mouthY+10,turns*.6,.4),offset:.68},{transform:pos(t,tx+dir*40,mouthY-110,turns*.55,buttonGoes?.7:1.2),offset:.8},{transform:pos(t,tx,mouthY,turns*.8,.4),offset:.9});
        if(twist==='spin')fr.push({transform:pos(t,tx,mouthY,turns*3,.5),offset:.9});
        fr.push({transform:pos(t,tx,mouthY+8,turns*(twist==='spin'?4:1.2),0),offset:1});
        return gone(t.el,anim(t.el,fr,{duration:twist==='plain'||twist==='parade'?1100:1700,easing:'ease-in-out',fill:'forwards'}));
      });
    });
    return Promise.all(trips).then(function(){
      if(buttonGoes){tile.style.visibility='';tile.animate([{transform:'translateY(40px) scale(.6)',opacity:0},{transform:'translateY(-8px) scale(1.08)',opacity:1,offset:.6},{transform:'none'}],{duration:500,easing:'ease-out'})}
      var shake=anim(T,[0,1,2,3,4,5].map(function(i){return {transform:at(tx+(i%2?6:-6),ty,ts,i%2?7:-7)}}).concat([{transform:at(tx,ty,ts,0)}]),{duration:500,fill:'forwards'});
      var splash=burst(tx,mouthY,pick([['💦','💧'],['💦','🫧'],['🫧','✨'],['💦','🌈','⭐'],['🧻','💦']]),ri(7,14),r(110,190),r(22,34));
      caption(line(n),ty-ts-60);
      return Promise.all([shake,splash]);
    }).then(function(){return gone(T,anim(T,[{transform:at(tx,ty,ts,0)},{transform:at(tx,ty-14,ts,0)},{transform:at(tx,H()+ts,ts,0)}],{duration:450,easing:'ease-in',fill:'forwards'}))});
  }

  /* 2. Poop rain, with the odd surprise mixed in */
  function rain(tile,n){
    var k=ri(16,26)+n*6, extras=pick([['🦄'],['👑'],['🌈'],['🧻'],['⭐'],['🍦']]), all=[];
    for(var i=0;i<k;i++){(function(i){
      var s=r(26,64),x=r(0,W()),e=emo(Math.random()<.12?extras[0]:'💩',s),sway=r(-60,60),rot=r(-360,360);
      all.push(gone(e,anim(e,[{transform:at(x,-s,s,0)},{transform:at(x+sway,H()*.6,s,rot*.6),offset:.7},{transform:at(x+sway*1.4,H()+s,s,rot)}],
        {duration:r(1200,2300),delay:r(0,900),easing:'cubic-bezier(.4,0,.9,.6)',fill:'backwards'})));
    })(i)}
    caption(line(n));return Promise.all(all);
  }

  /* 3. Fart-powered rocket */
  function rocket(tile,n){
    var b=center(tile), s=r(56,80), e=emo('💩',s), wig=r(-120,120), dur=r(1300,1900), all=[];
    var path=[0,.15,.3,.45,.6,.75,.9].map(function(p){return {x:b.x+Math.sin(p*Math.PI*r(1,3))*wig,y:b.y-(b.y+s*2)*p*p,p:p}});
    all.push(gone(e,anim(e,[{transform:at(b.x,b.y,s,0)},{transform:at(b.x-8,b.y+6,s,-10,.9),offset:.12},{transform:at(b.x+8,b.y+6,s,10,.9),offset:.2}]
      .concat(path.slice(1).map(function(q){return {transform:at(q.x,q.y,s,r(-25,25),1+q.p*.4),offset:.2+q.p*.8/.9}})),{duration:dur,easing:'ease-in',fill:'forwards'})));
    path.forEach(function(q,i){if(!i)return;all.push(wait(200+dur*q.p*.85).then(function(){
      var ps=r(30,50),p=emo(pick(['💨','💨','💨','☁️']),ps);
      return gone(p,anim(p,[{transform:at(q.x,q.y+s*.6,ps,0,.4),opacity:1},{transform:at(q.x+r(-30,30),q.y+s*.6+40,ps,0,1.6),opacity:0}],{duration:900,easing:'ease-out'}));
    }))});
    caption(line(n),H()*.5);return Promise.all(all);
  }

  /* 4. Big star poop gets crowned, confetti */
  function crown(tile,n){
    var s=r(140,190), x=W()/2, y=H()*.48, e=emo('💩',s), hatS=s*.5, hat=emo(pick(['👑','👑','🎩','🎉','🧢','🎓']),hatS), all=[];
    all.push(gone(e,anim(e,[{transform:at(x,y,s,0,0)},{transform:at(x,y,s,-8,1.2),offset:.12},{transform:at(x,y,s,6,1),offset:.2},
      {transform:at(x,y,s,0,1),offset:.85},{transform:at(x,y,s,0,0)}],{duration:2600,easing:'ease-out'})));
    all.push(gone(hat,anim(hat,[{transform:at(x,-hatS,hatS,-30)},{transform:at(x,-hatS,hatS,-30),offset:.2},{transform:at(x+8,y-s*.55,hatS,12),offset:.4},
      {transform:at(x+8,y-s*.5,hatS,12),offset:.85},{transform:at(x,y-s*.3,hatS,0,0)}],{duration:2600,easing:'ease-out'})));
    all.push(wait(900).then(function(){return burst(x,y-s*.2,['🎉','✨','⭐','🎊','💛'],ri(14,22),r(150,230),r(20,30))}));
    caption(line(n),y+s*.6);return Promise.all(all);
  }

  /* 5. Parade of poops in hats */
  function parade(tile,n){
    var k=ri(5,9)+Math.min(n,4), s=r(44,60), y=H()-s*1.6-r(0,80), ltr=Math.random()<.5, dur=r(3000,4200), all=[];
    var hats=['👑','🎩','🎉','🧢','🎓','🌸','⭐','🎀','🪖',''];
    for(var i=0;i<k;i++){(function(i){
      var d=document.createElement('div');d.className='stack';d.style.fontSize=s+'px';
      d.innerHTML='<span style="font-size:.55em;margin-bottom:-.25em"></span><span>💩</span>';d.firstChild.textContent=pick(hats);
      L().appendChild(d);
      var x0=ltr?-s*2:W()+s*2, x1=ltr?W()+s*2:-s*2, fr=[];
      for(var j=0;j<=10;j++){var p=j/10;fr.push({transform:'translate('+(x0+(x1-x0)*p)+'px,'+(y-(j%2?s*.35:0))+'px) rotate('+(j%2?(ltr?8:-8):0)+'deg)'})}
      all.push(gone(d,anim(d,fr,{duration:dur,delay:i*r(220,340),fill:'backwards'})));
    })(i)}
    caption(line(n));return Promise.all(all);
  }

  /* 6. The button melts like pudding, drips, then pops back */
  function melt(tile,n){
    var b=tile.getBoundingClientRect(), all=[];
    tile.style.transformOrigin='50% 100%';
    all.push(anim(tile,[{transform:'none'},{transform:'scaleY(.82) scaleX(1.06) skewX(4deg)',offset:.25},{transform:'scaleY(.45) scaleX(1.18) skewX(-5deg)',offset:.55},
      {transform:'scaleY(.4) scaleX(1.2)',offset:.7},{transform:'scaleY(1.15) scaleX(.95)',offset:.88},{transform:'none'}],{duration:2200,easing:'ease-in-out'}));
    for(var i=0;i<ri(5,9);i++){(function(){
      var d=document.createElement('div');d.className='drip';var w=r(8,16),x=r(b.left+10,b.right-10),y=b.bottom-4;
      d.style.width=w+'px';d.style.height=w*1.3+'px';L().appendChild(d);
      all.push(gone(d,anim(d,[{transform:'translate('+x+'px,'+y+'px) scaleY(.2)'},{transform:'translate('+x+'px,'+(y+10)+'px) scaleY(1.6)',offset:.3},
        {transform:'translate('+x+'px,'+(H()+20)+'px) scaleY(1)'}],{duration:r(900,1600),delay:r(300,1000),easing:'ease-in',fill:'backwards'})));
    })()}
    caption(line(n),b.top-70);return Promise.all(all);
  }

  var SHOWS=[toilet,toilet,toilet,rain,rocket,crown,parade,melt];
  window.poopParty=function(tile,n){
    if(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches){caption(line(n));return}
    if(running>=2){caption(line(n));return}
    var i;do{i=Math.floor(Math.random()*SHOWS.length)}while(last>-1&&SHOWS[i]===SHOWS[last]);
    last=i;running++;dimOn(tile);
    var done=function(){running--;tile.style.visibility='';dimOff()};
    Promise.resolve().then(function(){return SHOWS[i](tile,n)}).then(done,done);
  };
  // Preview hook: poopParty.show('toilet'|'rain'|'rocket'|'crown'|'parade'|'melt', tile, n)
  window.poopParty.show=function(name,tile,n){return {toilet:toilet,rain:rain,rocket:rocket,crown:crown,parade:parade,melt:melt}[name](tile,n||1)};
})();
