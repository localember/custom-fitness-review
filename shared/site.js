/* Custom Fitness Specialists preview: mobile menu, sticky phone bar, reveals, preview-only form. */
(function(){
  var btn=document.querySelector('[data-menu-btn]'), body=document.body;
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
    window.addEventListener('resize',function(){ if(window.innerWidth>1080) setOpen(false); });
  }
  /* Sticky Call + Free Consultation bar on phones, shown once the hero buttons scroll away. */
  var bar=document.querySelector('[data-mbar]'), anchor=document.querySelector('[data-hero-ctas]');
  if(bar && anchor && 'IntersectionObserver' in window){
    new IntersectionObserver(function(es){
      es.forEach(function(e){
        var past=!e.isIntersecting && e.boundingClientRect.top<0;
        bar.classList.toggle('is-in', past); body.classList.toggle('mbar-on', past);
      });
    }).observe(anchor);
  }
  /* Soft reveals */
  var rs=document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('is-in'); io.unobserve(e.target);} }); },{rootMargin:'0px 0px -8% 0px'});
    rs.forEach(function(r){ io.observe(r); });
  } else { rs.forEach(function(r){ r.classList.add('is-in'); }); }
  /* Preview form: not connected. Nothing is sent. */
  document.querySelectorAll('form[data-preview-form]').forEach(function(f){
    f.addEventListener('submit',function(e){
      e.preventDefault();
      var n=f.querySelector('[data-form-note]');
      if(n){ n.hidden=false; n.focus(); }
    });
  });
})();
