// scroll reveal
  const revealEls = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  revealEls.forEach(el=>io.observe(el));

  // Subtle scroll-linked 3D tilt and parallax.
  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  if(!motionPreference.matches){
    const depthEls = [...document.querySelectorAll('.problem-cell, .step, .plan, .hero-model')];
    depthEls.forEach((el,index)=>{
      el.classList.add('scroll-depth');
      el.dataset.depthDirection = index % 2 === 0 ? '1' : '-1';
    });

    let depthFrame = 0;
    const updateDepth = ()=>{
      const viewportHeight = window.innerHeight;
      depthEls.forEach(el=>{
        if(el.offsetParent === null) return;
        const rect = el.getBoundingClientRect();
        if(rect.bottom < -120 || rect.top > viewportHeight + 120) return;

        const range = viewportHeight / 2 + rect.height / 2;
        const raw = (rect.top + rect.height / 2 - viewportHeight / 2) / range;
        const progress = Math.max(-1,Math.min(1,raw));
        const direction = Number(el.dataset.depthDirection);

        el.style.setProperty('--scroll-y',`${(-progress * 10).toFixed(2)}px`);
        el.style.setProperty('--scroll-rx',`${(progress * 4).toFixed(2)}deg`);
        el.style.setProperty('--scroll-ry',`${(progress * direction * 2.2).toFixed(2)}deg`);
      });
      depthFrame = 0;
    };

    const requestDepthUpdate = ()=>{
      if(!depthFrame) depthFrame = requestAnimationFrame(updateDepth);
    };

    window.addEventListener('scroll',requestDepthUpdate,{passive:true});
    window.addEventListener('resize',requestDepthUpdate);
    requestDepthUpdate();
  }
