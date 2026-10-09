/* CFS homepage options (Local Ember design preview): menu, phone sticky bar, soft reveals,
   form ready state, preview-only form, plus per-option hooks (scale reveal, count-up). */
(function(){
  var body=document.body, reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var btn=document.querySelector('[data-menu-btn]');
  function setOpen(o){
    if(!btn) return;
    btn.setAttribute('aria-expanded', o?'true':'false');
    btn.setAttribute('aria-label', o?'Close menu':'Open menu');
    body.classList.toggle('nav-open', o);
  }
  if(btn){
    btn.addEventListener('click',function(){ setOpen(btn.getAttribute('aria-expanded')!=='true'); });
    document.querySelectorAll('[data-nav] a').forEach(function(a){ a.addEventListener('click',function(){ setOpen(false); }); });
    document.addEventListener('keydown',function(e){ if(e.key==='Escape') setOpen(false); });
    window.addEventListener('resize',function(){ if(window.innerWidth>960) setOpen(false); });
  }
  /* Phone sticky bar: Call + Free Consultation, shown once the hero buttons scroll away. */
  var bar=document.querySelector('[data-mbar]'), anchor=document.querySelector('[data-hero-ctas]');
  if(bar && anchor && 'IntersectionObserver' in window){
    new IntersectionObserver(function(es){
      es.forEach(function(e){
        var past=!e.isIntersecting && e.boundingClientRect.top<0;
        bar.classList.toggle('is-in', past); body.classList.toggle('mbar-on', past);
      });
    }).observe(anchor);
  }
  /* Stagger: children of [data-stagger] get a small delay (ms value in the attribute, default 50). */
  document.querySelectorAll('[data-stagger]').forEach(function(p){
    var step=parseInt(p.getAttribute('data-stagger'),10)||50;
    Array.prototype.forEach.call(p.querySelectorAll(':scope > .reveal'),function(c,i){ c.style.transitionDelay=(i*step)+'ms'; });
  });
  /* Soft fade-up reveals, once per element. */
  var rs=document.querySelectorAll('.reveal');
  if(!reduce && 'IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('is-in'); io.unobserve(e.target);} }); },{rootMargin:'0px 0px -6% 0px'});
    rs.forEach(function(r){ io.observe(r); });
  } else { rs.forEach(function(r){ r.classList.add('is-in'); }); }
  requestAnimationFrame(function(){ body.classList.add('is-loaded'); });
  /* Option 1: scroll-linked scale reveal. The headline holds, then the studio photo grows to fill the frame. */
  var sr=document.querySelector('[data-scale-reveal]');
  if(sr){
    if(reduce){ sr.style.setProperty('--p',1); }
    else {
      var tick=false;
      var upd=function(){
        tick=false;
        var r=sr.getBoundingClientRect(), vh=window.innerHeight;
        var p=(vh - r.top)/(vh*0.9); p=Math.max(0,Math.min(1,p));
        sr.style.setProperty('--p',p.toFixed(3));
      };
      window.addEventListener('scroll',function(){ if(!tick){ tick=true; requestAnimationFrame(upd);} },{passive:true});
      window.addEventListener('resize',upd); upd();
    }
  }
  /* Option 3: numbers count up once when visible. */
  var cs=document.querySelectorAll('[data-count]');
  if(cs.length && !reduce && 'IntersectionObserver' in window){
    var co=new IntersectionObserver(function(es){ es.forEach(function(e){
      if(!e.isIntersecting) return; co.unobserve(e.target);
      var el=e.target, to=parseFloat(el.getAttribute('data-count')), dec=(el.getAttribute('data-count').split('.')[1]||'').length, t0=null;
      el.textContent=(0).toFixed(dec);
      function step(t){ if(!t0) t0=t; var k=Math.min(1,(t-t0)/900); k=1-Math.pow(1-k,3); el.textContent=(to*k).toFixed(dec); if(k<1) requestAnimationFrame(step); }
      requestAnimationFrame(step);
    }); },{threshold:.6});
    cs.forEach(function(c){ co.observe(c); });
  }
  /* Form: send button lights up once first name + phone are filled (never disabled). Preview only: nothing is sent. */
  document.querySelectorAll('form[data-preview-form]').forEach(function(f){
    var need=f.querySelectorAll('[data-need]');
    function chk(){ var ok=true; need.forEach(function(i){ if(!i.value.trim()) ok=false; }); f.classList.toggle('is-ready',ok); }
    need.forEach(function(i){ i.addEventListener('input',chk); }); chk();
    f.addEventListener('submit',function(e){
      e.preventDefault();
      var n=f.querySelector('[data-form-note]');
      if(n){ n.hidden=false; n.focus(); }
    });
  });
  var y=document.querySelector('[data-year]'); if(y) y.textContent=new Date().getFullYear();
})();
