import * as THREE from 'https://cdn.skypack.dev/three@0.136.0';


const CONFIG = {
    particleCount: 120,
    connectionDistance: 150,
    mouseDistance: 200,
    color: 0x00F0FF, // Electric Blue
    bgColor: 0x0A0A0A
};

const canvas = document.getElementById('neural-bg');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));


const particles = [];
const particleGeometry = new THREE.SphereGeometry(1.5, 8, 8);
const particleMaterial = new THREE.MeshBasicMaterial({ color: CONFIG.color });

for (let i = 0; i < CONFIG.particleCount; i++) {
    const mesh = new THREE.Mesh(particleGeometry, particleMaterial);
    

    mesh.position.x = (Math.random() - 0.5) * window.innerWidth * 1.5;
    mesh.position.y = (Math.random() - 0.5) * window.innerHeight * 1.5;
    mesh.position.z = (Math.random() - 0.5) * 400;


    mesh.userData = {
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8
    };

    scene.add(mesh);
    particles.push(mesh);
}


const lineMaterial = new THREE.LineBasicMaterial({ 
    color: CONFIG.color, 
    transparent: true, 
    opacity: 0.3 
});


let mouse = new THREE.Vector2(0, 0);
let target = new THREE.Vector2(0, 0);

window.addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX - window.innerWidth / 2);
    mouse.y = -(event.clientY - window.innerHeight / 2);
});

camera.position.z = 500;


function animate() {
    requestAnimationFrame(animate);


    target.x += (mouse.x - target.x) * 0.05;
    target.y += (mouse.y - target.y) * 0.05;


    particles.forEach(p => {
        p.position.x += p.userData.vx;
        p.position.y += p.userData.vy;


        if (Math.abs(p.position.x) > window.innerWidth) p.userData.vx *= -1;
        if (Math.abs(p.position.y) > window.innerHeight) p.userData.vy *= -1;


        const dx = p.position.x - target.x;
        const dy = p.position.y - target.y;
        const dist = Math.sqrt(dx*dx + dy*dy);

        if (dist < CONFIG.mouseDistance) {
            const force = (CONFIG.mouseDistance - dist) / CONFIG.mouseDistance;
            p.position.x += dx * force * 0.03;
            p.position.y += dy * force * 0.03;
        }
    });






    



    


    




    
    const positions = [];
    const opacities = [];
    
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const p1 = particles[i];
            const p2 = particles[j];
            const dx = p1.position.x - p2.position.x;
            const dy = p1.position.y - p2.position.y;
            const dz = p1.position.z - p2.position.z;
            const dist = Math.sqrt(dx*dx + dy*dy + dz*dz);

            if (dist < CONFIG.connectionDistance) {
                positions.push(p1.position.x, p1.position.y, p1.position.z);
                positions.push(p2.position.x, p2.position.y, p2.position.z);


            }
        }
    }


    const oldLines = scene.getObjectByName('connections');
    if (oldLines) scene.remove(oldLines);

    if (positions.length > 0) {
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        const lines = new THREE.LineSegments(geometry, lineMaterial);
        lines.name = 'connections';
        scene.add(lines);
    }

    renderer.render(scene, camera);
}


window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();
