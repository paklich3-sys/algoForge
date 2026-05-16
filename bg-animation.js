/**
 * AlgoForge — shared Three.js background animation
 * Used on blog/, cases/, news/ pages.
 * Requires: Three.js loaded BEFORE this script.
 * Requires: <canvas id="three-canvas"> in the page body.
 */
(function () {
    'use strict';

    const canvas = document.getElementById('three-canvas');
    if (!canvas || typeof THREE === 'undefined') return;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 30;

    // --- Particle System ---
    const particleCount = 1200;
    const positions = new Float32Array(particleCount * 3);
    const colors    = new Float32Array(particleCount * 3);
    const sizes     = new Float32Array(particleCount);

    const colorPalette = [
        new THREE.Color('#00ff88'),
        new THREE.Color('#00d4ff'),
        new THREE.Color('#a855f7'),
        new THREE.Color('#ec4899'),
    ];

    for (let i = 0; i < particleCount; i++) {
        positions[i * 3]     = (Math.random() - 0.5) * 80;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 80;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 80;

        const c = colorPalette[Math.floor(Math.random() * colorPalette.length)];
        colors[i * 3]     = c.r;
        colors[i * 3 + 1] = c.g;
        colors[i * 3 + 2] = c.b;

        sizes[i] = Math.random() * 2 + 0.5;
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color',    new THREE.BufferAttribute(colors, 3));
    particleGeometry.setAttribute('size',     new THREE.BufferAttribute(sizes, 1));

    const particleMaterial = new THREE.PointsMaterial({
        size: 0.15,
        vertexColors: true,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // --- Connection Lines ---
    const lineGeometry  = new THREE.BufferGeometry();
    const linePositions = [];
    const lineColors_l  = [];
    const maxDist = 12;

    function updateLines() {
        linePositions.length = 0;
        lineColors_l.length  = 0;

        const pos = particleGeometry.attributes.position.array;
        const col = particleGeometry.attributes.color.array;

        for (let i = 0; i < particleCount; i++) {
            for (let j = i + 1; j < particleCount; j++) {
                const dx   = pos[i * 3] - pos[j * 3];
                const dy   = pos[i * 3 + 1] - pos[j * 3 + 1];
                const dz   = pos[i * 3 + 2] - pos[j * 3 + 2];
                const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

                if (dist < maxDist) {
                    linePositions.push(pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2]);
                    linePositions.push(pos[j * 3], pos[j * 3 + 1], pos[j * 3 + 2]);
                    const alpha = 1 - dist / maxDist;
                    lineColors_l.push(col[i * 3] * alpha, col[i * 3 + 1] * alpha, col[i * 3 + 2] * alpha);
                    lineColors_l.push(col[j * 3] * alpha, col[j * 3 + 1] * alpha, col[j * 3 + 2] * alpha);
                }
            }
        }

        lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
        lineGeometry.setAttribute('color',    new THREE.Float32BufferAttribute(lineColors_l, 3));
    }

    const lineMaterial = new THREE.LineBasicMaterial({
        vertexColors: true,
        transparent: true,
        opacity: 0.15,
        blending: THREE.AdditiveBlending,
    });

    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lines);

    // --- Floating Geometries ---
    const torus = new THREE.Mesh(
        new THREE.TorusGeometry(3, 0.08, 16, 100),
        new THREE.MeshBasicMaterial({ color: 0x00ff88, transparent: true, opacity: 0.15, wireframe: true })
    );
    torus.position.set(-20, 10, -10);
    scene.add(torus);

    const icosa = new THREE.Mesh(
        new THREE.IcosahedronGeometry(2.5, 0),
        new THREE.MeshBasicMaterial({ color: 0x00d4ff, transparent: true, opacity: 0.1, wireframe: true })
    );
    icosa.position.set(20, -8, -5);
    scene.add(icosa);

    const octa = new THREE.Mesh(
        new THREE.OctahedronGeometry(2, 0),
        new THREE.MeshBasicMaterial({ color: 0xa855f7, transparent: true, opacity: 0.12, wireframe: true })
    );
    octa.position.set(15, 15, -15);
    scene.add(octa);

    // --- Mouse tracking ---
    let mouseX = 0, mouseY = 0;
    let targetMouseX = 0, targetMouseY = 0;

    document.addEventListener('mousemove', (e) => {
        targetMouseX = (e.clientX / window.innerWidth)  * 2 - 1;
        targetMouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    let scrollY = 0;
    window.addEventListener('scroll', () => { scrollY = window.pageYOffset; });

    // --- Animation Loop ---
    let frameCount = 0;

    function animate() {
        requestAnimationFrame(animate);
        frameCount++;

        mouseX += (targetMouseX - mouseX) * 0.05;
        mouseY += (targetMouseY - mouseY) * 0.05;

        particles.rotation.x = mouseY * 0.3 + frameCount * 0.0002;
        particles.rotation.y = mouseX * 0.3 + frameCount * 0.0003;

        const pos = particleGeometry.attributes.position.array;
        for (let i = 0; i < particleCount; i++) {
            pos[i * 3 + 1] += Math.sin(frameCount * 0.001 + i) * 0.005;
        }
        particleGeometry.attributes.position.needsUpdate = true;

        if (frameCount % 3 === 0) {
            updateLines();
            lineGeometry.attributes.position.needsUpdate = true;
            lineGeometry.attributes.color.needsUpdate    = true;
        }

        lines.rotation.x = mouseY * 0.3 + frameCount * 0.0002;
        lines.rotation.y = mouseX * 0.3 + frameCount * 0.0003;

        torus.rotation.x   = frameCount * 0.003;
        torus.rotation.y   = frameCount * 0.005;
        torus.position.y   = 10 + Math.sin(frameCount * 0.008) * 3;

        icosa.rotation.x   = frameCount * 0.004;
        icosa.rotation.z   = frameCount * 0.006;
        icosa.position.y   = -8 + Math.sin(frameCount * 0.006) * 2.5;

        octa.rotation.y    = frameCount * 0.005;
        octa.rotation.z    = frameCount * 0.003;
        octa.position.y    = 15 + Math.cos(frameCount * 0.007) * 2;

        camera.position.x += (mouseX * 3 - camera.position.x) * 0.02;
        camera.position.y += (mouseY * 2 - camera.position.y) * 0.02;
        camera.lookAt(scene.position);

        const scrollOffset = scrollY * 0.002;
        particles.position.y = -scrollOffset * 5;
        lines.position.y     = -scrollOffset * 5;

        renderer.render(scene, camera);
    }

    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
})();
