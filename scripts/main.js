    /* ========= Helpers ========= */
    const q = s => document.querySelector(s);
    const qa = s => Array.from(document.querySelectorAll(s));

    /* ========= Typing effect ========== */
    (function typing(){
      const txt = "Hello, I'm Mukhiteee.";
      const out = q('#typing');
      let i = 0;
      function step(){
        out.textContent = txt.slice(0, i);
        i++;
        if(i <= txt.length) setTimeout(step, 60);
      }
      // Delay a little so header animation finishes
      setTimeout(step, 400);
    })();

    
    /* ========= IntersectionObserver reveal for .reveal ========= */
    (function revealOnScroll(){
      const obs = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          if(e.isIntersecting){
            e.target.classList.add('is-visible');
            // trigger skill bars only when skills section becomes visible
            if(e.target.id === 'skills' || e.target.closest('#skills')){
              qa('.skills-card').forEach(card=>{
                const val = +card.getAttribute('data-skill') || 70;
                const bar = card.querySelector('.skill-bar > span');
                if(bar) setTimeout(()=> bar.style.width = val + '%', 120);
              });
            }
            // unobserve to avoid re-running
            obs.unobserve(e.target);
          }
        })
      }, { threshold: 0.12 });

      qa('.reveal').forEach(el => obs.observe(el));
    })();

    
    /* ========= Smooth parallax for hero avatar (subtle) ========= */
    (function parallax(){
      const avatar = q('.avatar');
      if(!avatar) return;
      window.addEventListener('scroll', () => {
        const y = window.scrollY;
        // subtle translate
        avatar.style.transform = `translateY(${Math.min(20, y * 0.04)}px)`;
      }, { passive:true });
    })();

    /* ========= Nav highlight & click -> smooth scroll ========= */
    (function navHighlight(){
      const navButtons = qa('.nav-btn');
      navButtons.forEach(btn=>{
        btn.addEventListener('click', () => {
          const target = document.querySelector(btn.dataset.target);
          if(target) target.scrollIntoView({behavior:'smooth', block:'start'});
        });
      });

      // highlight based on sections visible
      const sections = qa('main section, footer');
      const obs = new IntersectionObserver((entries)=>{
        entries.forEach(e=>{
          if(e.isIntersecting){
            const id = '#' + (e.target.id || e.target.querySelector('section')?.id || '');
            // set active by index of navButtons matching data-target
            navButtons.forEach(nb => nb.classList.toggle('is-active', nb.dataset.target === ('#' + (e.target.id || '')) ));
          }
        });
      }, { threshold: 0.35 });
      sections.forEach(s => obs.observe(s));
    })();

    /* ========= Theme toggle that preserves choice in localStorage ========= */
    (function themeToggle(){
      const root = document.documentElement;
      const btn = q('#themeToggle');
      const current = localStorage.getItem('site-theme') || 'dark';
      if(current === 'light') root.classList.add('light'), btn.setAttribute('aria-pressed','true');
      btn.addEventListener('click', () => {
        const isLight = root.classList.toggle('light');
        btn.setAttribute('aria-pressed', String(isLight));
        localStorage.setItem('site-theme', isLight ? 'light' : 'dark');
      });
    })();

    /* ========= Simple particle system (canvas) ========= */
    (function particles(){
      const canvas = q('#particles');
      if(!canvas) return;
      const ctx = canvas.getContext('2d');
      const DPR = window.devicePixelRatio || 1;
      let w, h, particles = [];

      function reset(){
        w = canvas.width = innerWidth * DPR;
        h = canvas.height = innerHeight * DPR;
        canvas.style.width = innerWidth + 'px';
        canvas.style.height = innerHeight + 'px';
        particles = [];
        for(let i=0;i<45;i++){
          particles.push({
            x: Math.random()*w,
            y: Math.random()*h,
            r: (Math.random()*1.8 + 0.6) * DPR,
            vx: (Math.random()-0.5)*0.25,
            vy: (Math.random()*0.5 + 0.02),
            alpha: 0.12 + Math.random()*0.25
          });
        }
      }
      function draw(){
        ctx.clearRect(0,0,w,h);
        particles.forEach(p=>{
          p.x += p.vx;
          p.y += p.vy;
          if(p.y > h + 60*DPR) { p.y = -40*DPR; p.x = Math.random()*w }
          ctx.beginPath();
          ctx.fillStyle = 'rgba(120,160,255,' + p.alpha + ')';
          ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
          ctx.fill();
        });
        requestAnimationFrame(draw);
      }
      addEventListener('resize', reset);
      reset(); draw();
    })();

    /* ========= Contact form validation + submit stub with shake on invalid ========= */
    (function contactForm(){
      const form = q('#contactForm');
      if(!form) return;
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = form.name.value.trim();
        const email = form.email.value.trim();
        const message = form.message.value.trim();
        const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        if(!name || !email || !message || !isEmail){
          const invalids = [];
          if(!name) invalids.push(form.name);
          if(!email || !isEmail) invalids.push(form.email);
          if(!message) invalids.push(form.message);
          invalids.forEach(el => el.classList.add('shake'));
          setTimeout(()=> invalids.forEach(el => el.classList.remove('shake')), 450);
          return;
        }
        // If valid -> do a subtle success animation and clear (stub)
        form.querySelector('button[type="submit"]').textContent = 'Sent ✓';
        setTimeout(()=> {
          form.reset();
          form.querySelector('button[type="submit"]').textContent = 'Send';
        }, 1200);
      });
    })();

    /* ========= small UX: Explore button scrolls to projects, CV triggers download link ========= */
    q('#exploreBtn').addEventListener('click', ()=> document.querySelector('#projects').scrollIntoView({behavior:'smooth'}));
    q('#cvBtn').addEventListener('click', ()=> {
      // try to download CV if available at /assets/mukhiteee-cv.pdf else fallback to avatar
      const link = document.createElement('a');
      link.href = 'assets/mukhiteee-cv.pdf';
      link.download = 'Mukhiteee-CV.pdf';
      document.body.appendChild(link);
      link.click();
      link.remove();
    });

    /* ========= accessibility: allow keyboard nav on nav buttons ========= */
    qa('.nav-btn').forEach(b => {
      b.addEventListener('keydown', (e) => {
        if(e.key === 'Enter' || e.key === ' ') b.click();
      });
    });

    /* ========= tiny performance safety: pause heavy animations on reduced-motion ========= */
    (function reduceMotion(){
      if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){
        qa('.reveal').forEach(el => el.style.transition = 'none');
        // stop particles
        const canvas = document.querySelector('#particles');
        if(canvas){ canvas.style.display = 'none' }
      }
    })();
