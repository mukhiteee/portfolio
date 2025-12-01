
        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Intersection Observer for fade-in animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        document.querySelectorAll('.fade-in').forEach(el => {
            observer.observe(el);
        });

        // Form submission
        document.getElementById('contactForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                budget: document.getElementById('budget').value,
                brief: document.getElementById('brief').value,
                contact: document.getElementById('contact').value
            };

            // Create WhatsApp message
            const message = `Hi! I'm ${formData.name}.%0A%0AProject: ${formData.brief}%0ABudget: ${formData.budget}%0AContact me via: ${formData.contact}%0AEmail: ${formData.email}`;
            const whatsappURL = `https://wa.me/2348012345678?text=${message}`;
            
            window.open(whatsappURL, '_blank');
            
            // Reset form
            this.reset();
            alert('Opening WhatsApp... Your message has been prepared!');
        });

        // Code typing animation
        const codeLines = document.querySelectorAll('.code-line');
        codeLines.forEach((line, index) => {
            line.style.opacity = '0';
            setTimeout(() => {
                line.style.transition = 'opacity 0.5s ease';
                line.style.opacity = '1';
            }, index * 200);
        });

        // Mobile menu toggle
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const navLinks = document.querySelector('.nav-links');
        
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
            if (navLinks.style.display === 'flex') {
                navLinks.style.position = 'absolute';
                navLinks.style.top = '100%';
                navLinks.style.left = '0';
                navLinks.style.right = '0';
                navLinks.style.background = 'var(--panel)';
                navLinks.style.flexDirection = 'column';
                navLinks.style.padding = '1rem';
                navLinks.style.gap = '1rem';
            }
        });

        // Copy to clipboard functionality
        document.querySelectorAll('.contact-details a').forEach(link => {
            link.addEventListener('click', function(e) {
                if (this.href.startsWith('mailto:') || this.href.startsWith('tel:')) {
                    return;
                }
                
                e.preventDefault();
                const text = this.textContent;
                navigator.clipboard.writeText(text).then(() => {
                    const originalText = this.textContent;
                    this.textContent = 'Copied!';
                    this.style.color = 'var(--accent2)';
                    setTimeout(() => {
                        this.textContent = originalText;
                        this.style.color = '';
                    }, 2000);
                });
            });
        });

        // Parallax effect on hero code card
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const codeCard = document.querySelector('.code-card');
            if (codeCard && scrolled < window.innerHeight) {
                codeCard.style.transform = `translateY(${scrolled * 0.3}px)`;
            }
        });

        // Add hover glow effect to cards
        document.querySelectorAll('.skill-card, .package-card, .portfolio-card').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                card.style.setProperty('--mouse-x', `${x}px`);
                card.style.setProperty('--mouse-y', `${y}px`);
            });
        });