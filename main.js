// Initialize 3D background
const initBackground = () => {
    const canvas = document.getElementById('bg-canvas');
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene = new THREE.Scene();
    // Add a slight blue tint to the scene
    scene.background = new THREE.Color(0x1a1f25);
    
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 50;

    // Create particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 2000; // Increased particle count
    const posArray = new Float32Array(particlesCount * 3);

    for(let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 100;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    // Create multiple particle systems with different colors from the logo
    const particlesMaterials = [
        new THREE.PointsMaterial({
            size: 0.15,
            color: 0x6B8499, // Logo color
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending
        }),
        new THREE.PointsMaterial({
            size: 0.1,
            color: 0x8BA1B4, // Lighter shade
            transparent: true,
            opacity: 0.3,
            blending: THREE.AdditiveBlending
        }),
        new THREE.PointsMaterial({
            size: 0.05,
            color: 0x4A6275, // Darker shade
            transparent: true,
            opacity: 0.4,
            blending: THREE.AdditiveBlending
        })
    ];

    // Create multiple particle systems
    const particleSystems = particlesMaterials.map(material => {
        const particles = new THREE.Points(particlesGeometry, material);
        scene.add(particles);
        return particles;
    });

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0x6B8499, 0.2);
    scene.add(ambientLight);

    // Add point light
    const pointLight = new THREE.PointLight(0x6B8499, 0.5);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);

    // Add smooth mouse movement
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    document.addEventListener('mousemove', (e) => {
        // Calculate target position with reduced sensitivity
        targetX = (e.clientX - window.innerWidth / 2) * 0.002;  // Reduced from 0.01
        targetY = (e.clientY - window.innerHeight / 2) * 0.002; // Reduced from 0.01
    });

    // Add parallax effect
    let scrollY = 0;
    window.addEventListener('scroll', () => {
        scrollY = window.pageYOffset;
    });

    const animate = () => {
        requestAnimationFrame(animate);

        // Smooth mouse movement
        mouseX += (targetX - mouseX) * 0.05;
        mouseY += (targetY - mouseY) * 0.05;

        // Update particle systems with scroll position
        particleSystems.forEach((particles, index) => {
            particles.rotation.y += 0.0002 * (index + 1);
            particles.rotation.x += 0.0001 * (index + 1);
            
            // Smooth particle movement with reduced range
            gsap.to(particles.position, {
                x: mouseX * (5 + index * 3),  // Reduced from 20 + index * 10
                y: mouseY * (5 + index * 3),  // Reduced from 20 + index * 10
                duration: 3,                   // Increased from 2
                ease: "power1.out",           // Changed easing
                overwrite: true
            });

            // Add parallax effect based on scroll
            const parallaxSpeed = 0.0005 * (index + 1);
            particles.position.y = scrollY * parallaxSpeed;
        });

        // Animate point light with scroll
        pointLight.position.y = -scrollY * 0.01;
        pointLight.position.x = mouseX * 3;  // Reduced from 10

        renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
};

// Custom cursor
const initCursor = () => {
    const cursor = document.querySelector('.cursor');
    const cursorGlow = document.querySelector('.cursor-glow');
    let cursorX = 0;
    let cursorY = 0;
    let targetX = 0;
    let targetY = 0;

    const updateCursor = () => {
        const dx = targetX - cursorX;
        const dy = targetY - cursorY;
        
        cursorX += dx * 0.1;
        cursorY += dy * 0.1;
        
        cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
        cursorGlow.style.transform = `translate(${cursorX - 10}px, ${cursorY - 10}px)`;
        
        requestAnimationFrame(updateCursor);
    };

    document.addEventListener('mousemove', (e) => {
        targetX = e.clientX;
        targetY = e.clientY;
    });

    updateCursor();
};

// Intro animation
const initIntro = () => {
    const introContent = document.querySelector('.intro-content');
    const companyName = document.querySelector('.company-name');
    const sloganSpans = document.querySelectorAll('.slogan span');
    const introLogo = document.querySelector('.intro-logo');

    // Add logo animation
    gsap.from(introLogo, {
        opacity: 0,
        scale: 0.8,
        duration: 1,
        ease: "power2.out"
    });

    gsap.to(introContent, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power2.out"
    });

    gsap.to(companyName.querySelector('::after'), {
        width: '100%',
        duration: 1.5,
        delay: 0.5,
        ease: "power2.inOut"
    });

    sloganSpans.forEach((span, index) => {
        gsap.to(span, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            delay: 1 + (index * 0.2),
            ease: "power2.out"
        });
    });

    // Add typing effect
    const typeText = (element, text, speed = 100) => {
        let i = 0;
        element.textContent = '';
        const typing = setInterval(() => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(typing);
            }
        }, speed);
    };

    const sloganText = document.querySelector('.slogan');
    typeText(sloganText, 'Connecting Communities Digitally', 100);
};

// Add this new function for menu handling
const initMenu = () => {
    const navToggle = document.querySelector('.nav-toggle');
    const body = document.body;
    const navLinks = document.querySelectorAll('.nav-link');
    let isMenuOpen = false;

    const toggleMenu = () => {
        isMenuOpen = !isMenuOpen;
        body.classList.toggle('menu-open');
        navToggle.classList.toggle('nav-active');

        // Stagger nav links animation
        navLinks.forEach((link, index) => {
            if (isMenuOpen) {
                gsap.to(link, {
                    opacity: 1,
                    y: 0,
                    duration: 0.5,
                    delay: 0.3 + (index * 0.1),
                    ease: "power2.out"
                });
            } else {
                gsap.to(link, {
                    opacity: 0,
                    y: 20,
                    duration: 0.3,
                    ease: "power2.in"
                });
            }
        });
    };

    navToggle.addEventListener('click', toggleMenu);

    // Close menu when clicking links
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (isMenuOpen) toggleMenu();
        });
    });

    // Handle scroll
    let lastScroll = 0;
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > lastScroll && currentScroll > 100) {
            // Scrolling down
            navbar.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScroll = currentScroll;
    });
};

// Update the scroll animation function
const initScrollAnimation = () => {
    const downloadSection = document.querySelector('#download .section-content');
    const downloadContainer = document.querySelector('.download-container');
    const downloadButtons = document.querySelectorAll('.download-btn');
    const qrContainer = document.querySelector('.qr-container');
    
    gsap.set(downloadContainer, { opacity: 0, y: 30 });
    gsap.set(downloadButtons, { opacity: 0, y: 20 });
    gsap.set(qrContainer, { opacity: 0, scale: 0.9 });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Animate download container
                gsap.to(downloadContainer, {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    ease: "power2.out"
                });

                // Animate buttons with stagger
                gsap.to(downloadButtons, {
                    opacity: 1,
                    y: 0,
                    duration: 0.5,
                    stagger: 0.2,
                    delay: 0.3,
                    ease: "power2.out"
                });

                // Animate QR container
                gsap.to(qrContainer, {
                    opacity: 1,
                    scale: 1,
                    duration: 0.8,
                    delay: 0.6,
                    ease: "power2.out"
                });

                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    observer.observe(downloadSection);

    const contactSection = document.querySelector('#contact .section-content');
    const contactCards = document.querySelectorAll('.contact-card');
    const socialIcons = document.querySelectorAll('.social-icon');

    if (contactSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Animate contact cards
                    gsap.to(contactCards, {
                        opacity: 1,
                        y: 0,
                        duration: 0.5,
                        stagger: 0.2,
                        ease: "power2.out"
                    });

                    // Animate social icons
                    gsap.to(socialIcons, {
                        opacity: 1,
                        scale: 1,
                        duration: 0.3,
                        stagger: 0.1,
                        ease: "back.out(1.7)",
                        delay: 0.5
                    });

                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        observer.observe(contactSection);
    }
};

// Update the initBackToTop function
const initBackToTop = () => {
    const backToTop = document.querySelector('.back-to-top');
    
    // Show/hide button based on scroll position
    const updateButtonVisibility = () => {
        if (window.pageYOffset > 300) { // Reduced from 500 to be more responsive
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    };

    // Initial check
    updateButtonVisibility();
    
    // Update on scroll
    window.addEventListener('scroll', updateButtonVisibility);

    // Smooth scroll to top
    backToTop.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Using GSAP for smoother scrolling
        gsap.to(window, {
            duration: 1,
            scrollTo: {
                y: 0,
                autoKill: false
            },
            ease: "power2.inOut"
        });
    });
};

// Add this new function
const initScrollProgress = () => {
    const progressBar = document.querySelector('.scroll-progress-bar');
    const dots = document.querySelectorAll('.scroll-dot');
    const sections = document.querySelectorAll('section');

    // Update progress bar and dots on scroll
    window.addEventListener('scroll', () => {
        const windowHeight = window.innerHeight;
        const fullHeight = document.documentElement.scrollHeight - windowHeight;
        const scrolled = window.pageYOffset;
        
        const progress = (scrolled / fullHeight) * 100;
        progressBar.style.height = `${progress}%`;

        // Update active dot based on current section
        sections.forEach((section, index) => {
            const rect = section.getBoundingClientRect();
            if (rect.top < windowHeight/2 && rect.bottom > windowHeight/2) {
                dots.forEach(dot => dot.classList.remove('active'));
                dots[index].classList.add('active');
            }
        });
    });

    // Smooth scroll to section when clicking dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            sections[index].scrollIntoView({ behavior: 'smooth' });
        });
    });
};

// Add this new function
const initPageLoader = () => {
    const loader = document.querySelector('.page-loader');
    const loaderBar = document.querySelector('.loader-bar');
    const mainContent = document.querySelector('main');
    
    // Simulate loading progress
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 30;
        if (progress > 100) progress = 100;
        loaderBar.style.width = `${progress}%`;
        
        if (progress === 100) {
            clearInterval(interval);
            setTimeout(() => {
                loader.classList.add('loaded');
                mainContent.classList.add('visible');
            }, 500);
        }
    }, 500);
};

// Add this new function
const initTilt = () => {
    VanillaTilt.init(document.querySelectorAll(".feature-card"), {
        max: 15,
        speed: 400,
        glare: true,
        "max-glare": 0.2,
        scale: 1.05,
        perspective: 1000,
    });
};

// Add this new function
const initSectionReveal = () => {
    const sections = document.querySelectorAll('.section');
    
    sections.forEach(section => {
        const content = section.querySelector('.section-content');
        const title = section.querySelector('.section-title');
        
        gsap.set(content, { 
            opacity: 0,
            y: 50
        });
        
        gsap.set(title, {
            opacity: 0,
            y: 30
        });

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Animate title first
                    gsap.to(title, {
                        opacity: 1,
                        y: 0,
                        duration: 0.8,
                        ease: "power2.out"
                    });
                    
                    // Then animate content
                    gsap.to(content, {
                        opacity: 1,
                        y: 0,
                        duration: 1,
                        delay: 0.2,
                        ease: "power2.out"
                    });

                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        observer.observe(section);
    });
};

// Add this new function for smooth scrolling
const initSmoothScroll = () => {
    // Smooth scroll for navigation links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            
            gsap.to(window, {
                duration: 1.5,
                scrollTo: {
                    y: target,
                    offsetY: 50
                },
                ease: "power4.inOut"
            });
        });
    });

    // Update scroll dots click behavior
    const dots = document.querySelectorAll('.scroll-dot');
    const sections = document.querySelectorAll('section');
    
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            gsap.to(window, {
                duration: 1.5,
                scrollTo: {
                    y: sections[index],
                    offsetY: 50
                },
                ease: "power4.inOut"
            });
        });
    });

    // Update back to top button
    const backToTop = document.querySelector('.back-to-top');
    backToTop.addEventListener('click', (e) => {
        e.preventDefault();
        gsap.to(window, {
            duration: 1.5,
            scrollTo: {
                y: 0
            },
            ease: "power4.inOut"
        });
    });
};

// Add this new function
const initPhoneMockup = () => {
    const mockup = document.createElement('div');
    mockup.className = 'phone-mockup';
    document.querySelector('.intro-content').appendChild(mockup);

    // Create phone frame
    const phone = document.createElement('div');
    phone.className = 'phone-frame';
    mockup.appendChild(phone);

    // Add logo screen
    const screen = document.createElement('div');
    screen.className = 'phone-screen';
    phone.appendChild(screen);

    // Add logo container
    const logoContainer = document.createElement('div');
    logoContainer.className = 'phone-logo-container';
    screen.appendChild(logoContainer);

    // Add logo
    const logo = document.createElement('img');
    logo.src = 'images/logo.png';
    logo.alt = 'MyWard Logo';
    logo.className = 'phone-logo';
    logoContainer.appendChild(logo);
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initPageLoader();
    setTimeout(() => {
        initBackground();
        initCursor();
        initIntro();
        initMenu();
        initScrollAnimation();
        initBackToTop();
        initScrollProgress();
        initTilt();
        initSectionReveal();
        initSmoothScroll();
        initPhoneMockup();
    }, 2000);
});
