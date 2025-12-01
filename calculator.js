import { data } from './data.js';

const stageContainer = document.getElementById('calc-stage');
const painContainer = document.getElementById('calc-pain');
const resultContainer = document.getElementById('calc-result');

let selectedStage = null;
let selectedPain = null;

function initCalculator() {

    data.calculator.stages.forEach(stage => {
        const div = document.createElement('div');
        div.className = 'relative';
        div.innerHTML = `
            <input type="radio" name="stage" id="${stage.id}" value="${stage.id}" class="custom-radio sr-only peer">
            <label for="${stage.id}" class="block w-full p-4 border border-white/10 rounded cursor-pointer text-gray-400 hover:bg-white/5 peer-checked:border-eb-blue peer-checked:text-white peer-checked:bg-eb-blue/10 transition-all flex items-center justify-between group">
                <span>${stage.label}</span>
                <i data-lucide="check-circle" class="w-4 h-4 opacity-0 peer-checked:opacity-100 text-eb-blue transition-opacity"></i>
            </label>
        `;
        div.querySelector('input').addEventListener('change', (e) => {
            selectedStage = e.target.value;
            updateResult();
        });
        stageContainer.appendChild(div);
    });


    data.calculator.pains.forEach(pain => {
        const div = document.createElement('div');
        div.className = 'relative';
        div.innerHTML = `
            <input type="radio" name="pain" id="${pain.id}" value="${pain.id}" class="custom-radio sr-only peer">
            <label for="${pain.id}" class="block w-full p-4 border border-white/10 rounded cursor-pointer text-gray-400 hover:bg-white/5 peer-checked:border-eb-blue peer-checked:text-white peer-checked:bg-eb-blue/10 transition-all flex items-center justify-between">
                <span>${pain.label}</span>
                <i data-lucide="check-circle" class="w-4 h-4 opacity-0 peer-checked:opacity-100 text-eb-blue transition-opacity"></i>
            </label>
        `;
        div.querySelector('input').addEventListener('change', (e) => {
            selectedPain = e.target.value;
            updateResult();
        });
        painContainer.appendChild(div);
    });
    
    lucide.createIcons();
}

function updateResult() {
    if (!selectedStage || !selectedPain) return;

    let recommendationKey = 'recommendation_100k';


    if (selectedStage === 'b-plus' || selectedStage === 'ipo' || selectedPain === 'culture' || selectedPain === 'talent') {
        recommendationKey = 'recommendation_500k';
    }

    const result = data.calculator.logic[recommendationKey];


    resultContainer.style.opacity = 0;
    resultContainer.style.transform = 'translateY(10px)';
    
    setTimeout(() => {
        resultContainer.innerHTML = `
            <div class="w-16 h-16 bg-black rounded-full flex items-center justify-center border border-white/10 mb-4 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
                <i data-lucide="${result.icon}" class="${result.color} w-8 h-8"></i>
            </div>
            <h3 class="text-2xl font-bold text-white mb-1">${result.title}</h3>
            <div class="text-3xl font-bold ${result.color} mb-3">${result.price}<span class="text-sm text-gray-500 font-normal">/年</span></div>
            <p class="text-sm text-gray-400 mb-6 max-w-xs mx-auto leading-relaxed">${result.desc}</p>
            <a href="#contact" class="px-6 py-2 border border-white/20 text-white hover:bg-white hover:text-black transition-colors text-sm uppercase tracking-widest">
                预约方案详解
            </a>
        `;
        lucide.createIcons();

        resultContainer.style.opacity = 1;
        resultContainer.style.transform = 'translateY(0)';
    }, 300);
}

document.addEventListener('DOMContentLoaded', initCalculator);
