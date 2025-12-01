import { data } from './data.js';

document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();

    injectPainPoints();
    injectServiceDetails();
    injectMediaMatrix();
    initTypingEffect();
    initCounterAnimation();

    gsap.registerPlugin(ScrollTrigger);


    gsap.from("header h1", { duration: 1, y: 50, opacity: 0, ease: "power3.out" });
    gsap.from("header p", { duration: 1, y: 30, opacity: 0, delay: 0.3, ease: "power3.out" });


    gsap.from(".service-card", {
        scrollTrigger: {
            trigger: "#services",
            start: "top 75%"
        },
        duration: 0.8,
        y: 100,
        opacity: 0,
        stagger: 0.2,
        ease: "power3.out"
    });


    gsap.to("#book-visual div", {
        scrollTrigger: {
            trigger: "#case-study",
            scrub: 1,
            start: "top bottom",
            end: "bottom top"
        },
        rotationY: -25,
        ease: "none"
    });
});

function injectPainPoints() {
    const grid = document.getElementById('pain-points-grid');
    data.painPoints.forEach(point => {
        const card = document.createElement('div');
        card.className = "flip-card h-72 bg-transparent perspective-1000 cursor-pointer group";
        card.innerHTML = `
            <div class="flip-card-inner relative w-full h-full border border-white/10 bg-black shadow-lg">
                <!-- Front -->
                <div class="flip-card-front flex flex-col items-center justify-center p-8 text-center bg-eb-gray/20">
                    <div class="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-6 text-eb-blue">
                        <i data-lucide="${point.icon}"></i>
                    </div>
                    <h3 class="text-xl font-bold mb-4">${point.title}</h3>
                    <p class="text-sm text-gray-400 leading-relaxed">${point.front}</p>
                    <span class="absolute bottom-6 text-xs text-eb-blue opacity-50 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                        <i data-lucide="rotate-cw" class="w-3 h-3"></i> 查看对策
                    </span>
                </div>
                <!-- Back -->
                <div class="flip-card-back flex flex-col items-center justify-center p-8 text-center bg-eb-blue/10 border border-eb-blue/30">
                    <h3 class="text-lg font-bold mb-4 text-eb-blue">外脑解决方案</h3>
                    <p class="text-sm text-gray-200 leading-relaxed">${point.back}</p>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
    lucide.createIcons();
}

function injectServiceDetails() {

    const p1 = data.services.plan100k;
    document.getElementById('plan-100k-title').innerText = p1.title;
    document.getElementById('plan-100k-sub').innerText = p1.subtitle;
    document.getElementById('plan-100k-price').innerText = p1.price;
    document.getElementById('plan-100k-unit').innerText = p1.unit;
    document.getElementById('plan-100k-desc').innerText = p1.desc;
    
    const list100k = document.getElementById('plan-100k-list');
    p1.features.forEach(item => {
        list100k.innerHTML += `<li class="flex items-center gap-3 text-sm text-gray-300"><i data-lucide="check" class="w-4 h-4 text-gray-500 flex-shrink-0"></i> ${item}</li>`;
    });


    const p2 = data.services.plan500k;
    document.getElementById('plan-500k-title').innerText = p2.title;
    document.getElementById('plan-500k-sub').innerText = p2.subtitle;
    document.getElementById('plan-500k-price').innerText = p2.price;
    document.getElementById('plan-500k-unit').innerText = p2.unit;
    document.getElementById('plan-500k-tag').innerText = p2.tag;
    document.getElementById('plan-500k-desc').innerText = p2.desc;
    
    const list500k = document.getElementById('plan-500k-list');
    p2.features.forEach(item => {
        const isHighlight = item.includes("书稿") || item.includes("问答") || item.includes("100");
        const style = isHighlight ? "text-white font-bold" : "text-gray-300";
        const iconColor = isHighlight ? "text-eb-gold" : "text-eb-blue";
        list500k.innerHTML += `<li class="flex items-center gap-3 text-sm ${style}"><i data-lucide="check" class="w-4 h-4 ${iconColor} flex-shrink-0"></i> ${item}</li>`;
    });
}

function injectMediaMatrix() {
    const marquee = document.getElementById('matrix-marquee');
    const marquee2 = document.getElementById('matrix-marquee-2');
    
    let allItems = [];
    data.matrix.categories.forEach(cat => {
        allItems = [...allItems, ...cat.items];
    });


    allItems.sort(() => Math.random() - 0.5);

    const html = allItems.map(item => `<span class="opacity-50 hover:opacity-100 transition-opacity cursor-default">${item}</span>`).join('<span class="text-eb-blue/30">•</span>');

    marquee.innerHTML = html;
    marquee2.innerHTML = html;
}

function initTypingEffect() {
    const textElement = document.getElementById('typing-text');
    const phrases = data.hero.slogans;
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;

    function type() {
        const currentPhrase = phrases[phraseIndex];
        
        if (isDeleting) {
            textElement.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 50;
        } else {
            textElement.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 100;
        }

        textElement.innerHTML += '<span class="cursor-blink">|</span>';

        if (!isDeleting && charIndex === currentPhrase.length) {
            isDeleting = true;
            typeSpeed = 2000;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typeSpeed = 500;
        }

        setTimeout(type, typeSpeed);
    }

    type();
}

function initCounterAnimation() {
    const counters = document.querySelectorAll('.counter');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.getAttribute('data-target'));
                const duration = 2000;
                const startTime = performance.now();

                function update(currentTime) {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);

                    const ease = 1 - Math.pow(1 - progress, 4);
                    
                    let currentVal = Math.floor(ease * target);
                    entry.target.innerText = currentVal;

                    if (progress < 1) {
                        requestAnimationFrame(update);
                    } else {
                        entry.target.innerText = target + (target > 10 ? "+" : "");
                    }
                }
                
                requestAnimationFrame(update);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(c => observer.observe(c));
}
