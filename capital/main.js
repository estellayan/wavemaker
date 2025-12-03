import { projects, categories, stats } from './data.js';

gsap.registerPlugin(ScrollTrigger);


const categoryIcons = {
    'hardware': 'https://r2.flowith.net/files/jpeg/FUNRI-intelligent_hardware_icon_generation_index_2@1024x1024.jpeg',
    'robotics': 'https://r2.flowith.net/files/jpeg/0QA8W-robot_race_icon_index_1@1024x1024.jpeg',
    'semiconductor': 'https://r2.flowith.net/files/jpeg/X7DM7-semiconductor_acquisition_icon_index_3@1024x1024.jpeg',
    'consumer_med': null // No specific icon provided, fallback to default style
};

document.addEventListener('DOMContentLoaded', () => {
    initHeroCanvas();
    renderProjects('all');
    renderFilters();
    renderCharts();
    initAnimations();
    initPartners();
    initModalEvents();
});

/* --- 1. Filters & Project Rendering --- */
function renderFilters() {
    const filterContainer = document.getElementById('filter-container');
    filterContainer.innerHTML = categories.map(cat => `
        <button 
            class="btn-filter px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 border border-gray-700 text-gray-400 hover:border-amber-500 hover:text-amber-500 ${cat.id === 'all' ? 'active bg-amber-500/10 border-amber-500 text-amber-500' : ''}"
            data-filter="${cat.id}"
            onclick="window.filterProjects('${cat.id}')"
        >
            ${cat.label}
        </button>
    `).join('');
}

window.filterProjects = (categoryId) => {

    document.querySelectorAll('[data-filter]').forEach(btn => {
        const isActive = btn.dataset.filter === categoryId;
        btn.classList.toggle('active', isActive);
        btn.classList.toggle('bg-amber-500/10', isActive);
        btn.classList.toggle('border-amber-500', isActive);
        btn.classList.toggle('text-amber-500', isActive);
        if (!isActive) {
            btn.classList.remove('bg-amber-500/10', 'border-amber-500', 'text-amber-500');
        }
    });

    const grid = document.getElementById('project-grid');
    

    gsap.to(grid.children, {
        opacity: 0,
        y: 10,
        duration: 0.3,
        stagger: 0.05,
        onComplete: () => {
            renderProjects(categoryId);

            gsap.fromTo(grid.children, 
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.4, stagger: 0.05, clearProps: 'all' }
            );
        }
    });
};

function renderProjects(filter) {
    const grid = document.getElementById('project-grid');
    const filtered = filter === 'all' 
        ? projects 
        : projects.filter(p => p.category === filter);

    grid.innerHTML = filtered.map(p => {
        const iconUrl = categoryIcons[p.category];
        const iconHtml = iconUrl 
            ? `<div class="absolute top-0 right-0 w-24 h-24 opacity-10 pointer-events-none transition-opacity group-hover:opacity-20">
                 <img src="${iconUrl}" class="w-full h-full object-cover rounded-bl-3xl mask-image-gradient" alt="Category Icon">
               </div>` 
            : `<div class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-amber-500/10 to-transparent rounded-bl-full -mr-6 -mt-6 transition-all group-hover:from-amber-500/20"></div>`;

        return `
        <div class="glass-panel p-6 rounded-xl card-hover flex flex-col h-full relative overflow-hidden group border border-gray-800 hover:border-amber-500/50 transition-colors">
            ${iconHtml}
            
            <div class="flex justify-between items-start mb-4 relative z-10">
                <span class="text-[10px] font-bold tracking-wider uppercase text-amber-500 border border-amber-500/20 px-2 py-1 rounded bg-amber-500/5 shadow-sm shadow-amber-500/10">${p.round}</span>
                <span class="text-xs text-gray-400 font-mono">${p.amount}</span>
            </div>
            
            <h3 class="text-xl font-bold text-white mb-2 group-hover:text-amber-400 transition-colors cursor-pointer relative z-10" onclick="window.openModal(${p.id})">${p.title}</h3>
            
            <p class="text-sm text-gray-400 leading-relaxed mb-6 flex-grow pt-2 relative z-10">
                ${p.short_desc}
            </p>
            
            <div class="space-y-4 border-t border-gray-700/50 pt-4 mt-auto relative z-10">
                <div class="flex flex-wrap gap-2">
                    ${p.tags.slice(0, 3).map(t => `<span class="tag text-[10px]">${t}</span>`).join('')}
                </div>
                <div class="flex justify-between items-end">
                    <div class="text-xs text-gray-500">
                        <div class="flex items-center gap-1 mb-1"><i data-lucide="landmark" class="w-3 h-3 text-amber-600"></i> ${p.investors[0]}</div>
                    </div>
                    <button onclick="window.openModal(${p.id})" class="text-xs text-amber-500 font-semibold hover:underline flex items-center gap-1">
                        详情 <i data-lucide="maximize-2" class="w-3 h-3"></i>
                    </button>
                </div>
            </div>
        </div>
    `}).join('');

    lucide.createIcons();
}

/* --- 2. Modal Logic --- */
window.openModal = (id) => {
    const p = projects.find(proj => proj.id === id);
    if (!p) return;

    const modal = document.getElementById('project-modal');
    const content = document.getElementById('modal-content');
    
    const iconUrl = categoryIcons[p.category];
    
    content.innerHTML = `
        <div class="relative">
            ${iconUrl ? `
            <div class="absolute top-0 right-0 w-64 h-64 opacity-5 pointer-events-none">
                <img src="${iconUrl}" class="w-full h-full object-cover mask-image-gradient" alt="Background Icon">
            </div>` : ''}
            
            <div class="p-8 relative z-10">
                <button onclick="window.closeModal()" class="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors bg-black/20 rounded-full p-1 hover:bg-amber-500/20">
                    <i data-lucide="x" class="w-6 h-6"></i>
                </button>
                
                <div class="mb-6 pr-10">
                    <div class="flex items-center gap-3 mb-3">
                        <span class="text-xs font-bold tracking-wider uppercase text-amber-500 border border-amber-500/30 px-2 py-0.5 rounded bg-amber-500/10">${p.round}</span>
                        <span class="text-gray-400 text-sm font-mono">${p.amount}</span>
                    </div>
                    <h3 class="text-3xl md:text-4xl font-bold text-white mb-2">${p.title}</h3>
                    <div class="h-1 w-20 bg-amber-500/50 rounded-full"></div>
                </div>

                <div class="grid md:grid-cols-3 gap-8 mb-8">
                    <div class="col-span-2">
                        <h4 class="text-sm font-semibold text-amber-500 mb-3 uppercase tracking-wider">项目详情</h4>
                        <p class="text-gray-300 leading-relaxed text-sm md:text-base">${p.detail}</p>
                    </div>
                    <div class="space-y-6">
                        <div class="bg-black/30 p-5 rounded-xl border border-gray-700/50">
                            <h4 class="text-sm font-semibold text-amber-500 mb-4 uppercase tracking-wider">投资/并购方</h4>
                            <ul class="space-y-3">
                                ${p.investors.map(inv => `
                                    <li class="flex items-start gap-2 text-sm text-gray-300">
                                        <i data-lucide="check-circle-2" class="w-4 h-4 text-amber-500 mt-0.5 shrink-0"></i> 
                                        <span>${inv}</span>
                                    </li>
                                `).join('')}
                            </ul>
                        </div>
                    </div>
                </div>

                <div class="border-t border-gray-700/50 pt-6 flex flex-wrap gap-2">
                    ${p.tags.map(t => `<span class="px-3 py-1.5 rounded-full bg-gray-800/50 text-gray-300 text-xs border border-gray-700 font-medium hover:border-amber-500/30 transition-colors cursor-default">${t}</span>`).join('')}
                </div>
            </div>
        </div>
    `;

    modal.classList.remove('hidden');

    gsap.to(modal.querySelector('#modal-backdrop'), { opacity: 1, duration: 0.3 });
    gsap.to(content, { scale: 1, opacity: 1, duration: 0.3, ease: "back.out(1.2)" });
    
    lucide.createIcons();
};

window.closeModal = () => {
    const modal = document.getElementById('project-modal');
    const content = document.getElementById('modal-content');
    
    gsap.to(content, { scale: 0.95, opacity: 0, duration: 0.2 });
    gsap.to(modal.querySelector('#modal-backdrop'), { 
        opacity: 0, 
        duration: 0.2, 
        onComplete: () => modal.classList.add('hidden') 
    });
};

function initModalEvents() {
    const modal = document.getElementById('project-modal');
    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.id === 'modal-backdrop') {
            window.closeModal();
        }
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') window.closeModal();
    });
}

/* --- 3. Charts --- */
function renderCharts() {

    const ctxRadar = document.getElementById('trackChart').getContext('2d');
    new Chart(ctxRadar, {
        type: 'radar',
        data: {
            labels: stats.chartData.labels,
            datasets: [{
                label: '资源深度',
                data: stats.chartData.data,
                backgroundColor: 'rgba(245, 158, 11, 0.25)',
                borderColor: '#F59E0B',
                pointBackgroundColor: '#F59E0B',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: '#F59E0B',
                borderWidth: 2,
                pointRadius: 3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                r: {
                    angleLines: { color: 'rgba(255, 255, 255, 0.05)' },
                    grid: { color: 'rgba(255, 255, 255, 0.05)' },
                    pointLabels: { color: '#9CA3AF', font: { size: 10, family: "'Inter', sans-serif" } },
                    ticks: { display: false, backdropColor: 'transparent' },
                    suggestedMin: 40,
                    suggestedMax: 100
                }
            },
            plugins: { legend: { display: false } }
        }
    });


    const ctxBar = document.getElementById('dealStatsChart').getContext('2d');
    new Chart(ctxBar, {
        type: 'bar',
        data: {
            labels: stats.dealStats.labels,
            datasets: [{
                data: stats.dealStats.data,
                backgroundColor: [
                    'rgba(245, 158, 11, 0.9)', 
                    'rgba(245, 158, 11, 0.7)',
                    'rgba(245, 158, 11, 0.5)',
                    'rgba(245, 158, 11, 0.3)'
                ],
                borderRadius: 3,
                barThickness: 18,
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: { 
                    grid: { display: false },
                    ticks: { color: '#6B7280', font: { size: 9 } },
                    border: { display: false }
                },
                y: { display: false }
            },
            plugins: { legend: { display: false } }
        }
    });
}

/* --- 4. Canvas Wave Animation --- */
function initHeroCanvas() {
    const canvas = document.getElementById('hero-canvas');
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.2;
            this.vy = (Math.random() - 0.5) * 0.2;
            this.size = Math.random() * 2 + 0.5;
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;
        }
        draw() {
            ctx.fillStyle = 'rgba(245, 158, 11, 0.2)';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    for (let i = 0; i < 60; i++) particles.push(new Particle());

    function animate() {
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => {
            p.update();
            p.draw();
            particles.forEach(p2 => {
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const dist = Math.sqrt(dx*dx + dy*dy);
                if (dist < 100) {
                    ctx.strokeStyle = `rgba(245, 158, 11, ${0.1 - dist/1000})`;
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                }
            });
        });
        requestAnimationFrame(animate);
    }
    animate();
}

/* --- 5. General Interactions --- */
function initAnimations() {

    window.addEventListener('scroll', () => {
        const nav = document.querySelector('nav');
        if (window.scrollY > 20) nav.classList.add('scrolled');
        else nav.classList.remove('scrolled');
    });


    gsap.utils.toArray('section').forEach(section => {
        gsap.from(section.children, {
            y: 40,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: "power2.out",
            scrollTrigger: {
                trigger: section,
                start: "top 90%",
                toggleActions: "play none none reverse"
            }
        });
    });
}

function initPartners() {
    const container = document.getElementById('partners-list');
    container.innerHTML = stats.partners.map(p => `
        <div class="px-4 py-2 rounded border border-gray-800 bg-gray-900/50 text-gray-400 text-sm font-medium hover:border-amber-500/50 hover:text-amber-500 hover:bg-amber-500/5 transition-all cursor-default select-none whitespace-nowrap">
            ${p}
        </div>
    `).join('');
}
