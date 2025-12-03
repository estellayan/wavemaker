import { projects, categories, stats } from './data.js';

gsap.registerPlugin(ScrollTrigger);

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

    grid.innerHTML = filtered.map(p => `
        <div class="glass-panel p-6 rounded-xl card-hover flex flex-col h-full relative overflow-hidden group border border-gray-800 hover:border-amber-500/50 transition-colors">
            <div class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-amber-500/10 to-transparent rounded-bl-full -mr-6 -mt-6 transition-all group-hover:from-amber-500/20"></div>
            
            <div class="flex justify-between items-start mb-4 relative z-10">
                <span class="text-[10px] font-bold tracking-wider uppercase text-amber-500 border border-amber-500/20 px-2 py-1 rounded bg-amber-500/5">${p.round}</span>
                <span class="text-xs text-gray-400 font-mono">${p.amount}</span>
            </div>
            
            <h3 class="text-xl font-bold text-white mb-2 group-hover:text-amber-400 transition-colors cursor-pointer" onclick="window.openModal(${p.id})">${p.title}</h3>
            
            <p class="text-sm text-gray-400 leading-relaxed mb-6 flex-grow pt-2">
                ${p.short_desc}
            </p>
            
            <div class="space-y-4 border-t border-gray-700/50 pt-4 mt-auto">
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
    `).join('');

    lucide.createIcons();
}

/* --- 2. Modal Logic --- */
window.openModal = (id) => {
    const p = projects.find(proj => proj.id === id);
    if (!p) return;

    const modal = document.getElementById('project-modal');
    const content = document.getElementById('modal-content');
    
    content.innerHTML = `
        <div class="relative p-8">
            <button onclick="window.closeModal()" class="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors">
                <i data-lucide="x" class="w-6 h-6"></i>
            </button>
            
            <div class="mb-6">
                <div class="flex items-center gap-3 mb-2">
                    <span class="text-xs font-bold tracking-wider uppercase text-amber-500 border border-amber-500/30 px-2 py-0.5 rounded bg-amber-500/10">${p.round}</span>
                    <span class="text-gray-400 text-sm">${p.amount}</span>
                </div>
                <h3 class="text-3xl font-bold text-white">${p.title}</h3>
            </div>

            <div class="grid md:grid-cols-3 gap-6 mb-8">
                <div class="col-span-2">
                    <h4 class="text-sm font-semibold text-gray-300 mb-2">项目详情</h4>
                    <p class="text-gray-400 leading-relaxed text-sm">${p.detail}</p>
                </div>
                <div class="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                    <h4 class="text-sm font-semibold text-gray-300 mb-3">投资方 / 收购方</h4>
                    <ul class="space-y-2">
                        ${p.investors.map(inv => `
                            <li class="flex items-center gap-2 text-sm text-gray-400">
                                <i data-lucide="check-circle" class="w-3 h-3 text-amber-500"></i> ${inv}
                            </li>
                        `).join('')}
                    </ul>
                </div>
            </div>

            <div class="border-t border-gray-700 pt-6 flex flex-wrap gap-2">
                ${p.tags.map(t => `<span class="px-3 py-1 rounded-full bg-gray-800 text-gray-300 text-xs border border-gray-700">${t}</span>`).join('')}
            </div>
        </div>
    `;

    modal.classList.remove('hidden');

    gsap.to(modal.querySelector('#modal-backdrop'), { opacity: 1, duration: 0.3 });
    gsap.to(content, { scale: 1, opacity: 1, duration: 0.3, ease: "back.out(1.7)" });
    
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
                label: '资源深度指数',
                data: stats.chartData.data,
                backgroundColor: 'rgba(245, 158, 11, 0.2)',
                borderColor: '#F59E0B',
                pointBackgroundColor: '#F59E0B',
                pointBorderColor: '#fff',
                borderWidth: 2,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                r: {
                    angleLines: { color: 'rgba(255, 255, 255, 0.1)' },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' },
                    pointLabels: { color: '#9CA3AF', font: { size: 11 } },
                    ticks: { display: false },
                    suggestedMin: 50,
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
                    'rgba(245, 158, 11, 0.8)', 
                    'rgba(245, 158, 11, 0.6)',
                    'rgba(245, 158, 11, 0.4)',
                    'rgba(245, 158, 11, 0.2)'
                ],
                borderRadius: 4,
                barThickness: 20
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: { 
                    grid: { display: false },
                    ticks: { color: '#9CA3AF', font: { size: 10 } }
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
            this.vx = (Math.random() - 0.5) * 0.3;
            this.vy = (Math.random() - 0.5) * 0.3;
            this.size = Math.random() * 2;
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;
        }
        draw() {
            ctx.fillStyle = 'rgba(245, 158, 11, 0.3)';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    for (let i = 0; i < 70; i++) particles.push(new Particle());

    function animate() {
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => {
            p.update();
            p.draw();
            particles.forEach(p2 => {
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const dist = Math.sqrt(dx*dx + dy*dy);
                if (dist < 120) {
                    ctx.strokeStyle = `rgba(245, 158, 11, ${0.15 - dist/800})`;
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
        if (window.scrollY > 50) nav.classList.add('scrolled');
        else nav.classList.remove('scrolled');
    });

    gsap.utils.toArray('section').forEach(section => {
        gsap.from(section.children, {
            y: 30,
            opacity: 0,
            duration: 0.6,
            stagger: 0.1,
            scrollTrigger: {
                trigger: section,
                start: "top 85%",
            }
        });
    });
}

function initPartners() {
    const container = document.getElementById('partners-list');
    container.innerHTML = stats.partners.map(p => `
        <div class="px-4 py-2 rounded border border-gray-800 bg-gray-900/50 text-gray-400 text-sm font-medium hover:border-amber-500/50 hover:text-amber-500 transition-all cursor-default select-none">
            ${p}
        </div>
    `).join('');
}
