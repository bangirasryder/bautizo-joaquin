/* =========================================================
   Invitación · Bautizo de Joaquín Valle Amaguaña
   ========================================================= */
(() => {
    'use strict';

    const SVG_NS = 'http://www.w3.org/2000/svg';
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Aleatorio con semilla: las ilustraciones salen iguales en cada carga
    function seeded(seed) {
        return () => {
            seed = (seed * 16807) % 2147483647;
            return (seed - 1) / 2147483646;
        };
    }

    function el(tag, attrs = {}, parent) {
        const node = document.createElementNS(SVG_NS, tag);
        for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, v);
        if (parent) parent.appendChild(node);
        return node;
    }

    /* ---------- Hortensia ---------- */
    function buildHydrangea() {
        const symbol = document.getElementById('i-hydrangea');
        const rand = seeded(7);
        const tones = ['#bfe6e2', '#a7dcd7', '#93d0cb', '#d6f1ed', '#7fc3bf', '#b4e1dc'];

        // Hojas doradas por detrás
        el('path', { fill: 'url(#gold)', d: 'M30 62c-12 2-22 10-26 16 12 1 22-5 26-16z' }, symbol);
        el('path', { fill: 'url(#gold)', d: 'M68 62c12 1 22 8 27 15-12 2-22-4-27-15z' }, symbol);
        el('path', { fill: 'url(#gold)', opacity: '.8', d: 'M50 66c-4 6-4 12 0 14 4-3 4-8 0-14z' }, symbol);

        const florets = [];
        for (let i = 0; i < 42; i++) {
            const a = rand() * Math.PI * 2;
            const r = Math.sqrt(rand());
            florets.push({ x: 50 + Math.cos(a) * r * 38, y: 38 + Math.sin(a) * r * 26, s: 6 + rand() * 3, rot: rand() * 90 });
        }
        florets.sort((p, q) => p.y - q.y);

        for (const f of florets) {
            const g = el('g', { transform: `translate(${f.x.toFixed(1)} ${f.y.toFixed(1)}) rotate(${f.rot.toFixed(0)})` }, symbol);
            const fill = tones[Math.floor(rand() * tones.length)];
            for (let p = 0; p < 4; p++) {
                el('ellipse', {
                    cx: 0, cy: (-f.s * 0.42).toFixed(2), rx: (f.s * 0.32).toFixed(2), ry: (f.s * 0.44).toFixed(2),
                    fill, stroke: '#c9a86a', 'stroke-width': '.3', transform: `rotate(${p * 90})`
                }, g);
            }
            el('circle', { r: '.9', fill: '#c9a86a' }, g);
        }
    }

    /* ---------- Corona ovalada alrededor de la foto ---------- */
    function buildWreath(svg) {
        const lace = svg.dataset.wreath === 'lace';
        const cx = 100, cy = 130;
        const rx = lace ? 86 : 80, ry = lace ? 116 : 110;
        const point = (t, ox = 0, oy = 0) => [cx + (rx + ox) * Math.cos(t), cy + (ry + oy) * Math.sin(t)];
        const tangent = t => Math.atan2(ry * Math.cos(t), -rx * Math.sin(t)) * 180 / Math.PI;

        if (lace) {
            // Encaje blanco festoneado
            const n = 54;
            for (let i = 0; i < n; i++) {
                const t = (i / n) * Math.PI * 2;
                const [x, y] = point(t, 7, 7);
                el('circle', { cx: x.toFixed(1), cy: y.toFixed(1), r: 5.4, fill: '#fffdf8', stroke: '#c9a86a', 'stroke-width': '.6' }, svg);
            }
            el('ellipse', { cx, cy, rx: rx + 3, ry: ry + 3, fill: 'none', stroke: '#fffdf8', 'stroke-width': 12 }, svg);
            for (let i = 0; i < n; i++) {
                const t = ((i + 0.5) / n) * Math.PI * 2;
                const [x, y] = point(t, 7, 7);
                el('circle', { cx: x.toFixed(1), cy: y.toFixed(1), r: 1.1, fill: '#b9e2de' }, svg);
            }
        }

        el('ellipse', { cx, cy, rx: rx - 7, ry: ry - 7, fill: 'none', stroke: 'url(#gold)', 'stroke-width': lace ? 1.6 : 1.2 }, svg);
        el('ellipse', { cx, cy, rx: rx + (lace ? 9.5 : 6), ry: ry + (lace ? 9.5 : 6), fill: 'none', stroke: 'url(#gold)', 'stroke-width': .9 }, svg);

        // Hojas y florecitas siguiendo el óvalo
        const steps = lace ? 40 : 32;
        for (let i = 0; i < steps; i++) {
            const t = (i / steps) * Math.PI * 2;
            // Dejamos libre la parte superior para la cruz
            if (Math.abs(t - Math.PI * 1.5) < 0.18) continue;
            const [x, y] = point(t, 0, 0);
            const ang = tangent(t);
            if (i % 3 === 0) {
                const g = el('g', { transform: `translate(${x.toFixed(1)} ${y.toFixed(1)})` }, svg);
                for (let p = 0; p < 5; p++) {
                    el('ellipse', { cx: 0, cy: -2.6, rx: 1.9, ry: 2.6, fill: '#d6f0ee', stroke: '#6fb9b5', 'stroke-width': .45, transform: `rotate(${p * 72})` }, g);
                }
                el('circle', { r: 1.2, fill: '#c9a86a' }, g);
            } else {
                const side = i % 2 ? 1 : -1;
                el('path', {
                    d: 'M0 0c3-3 8-3 11 0-3 3-8 3-11 0z',
                    fill: '#a5d3c8', stroke: '#b8925a', 'stroke-width': .4,
                    transform: `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${(ang + side * 35).toFixed(0)})`
                }, svg);
            }
        }

        // Cruz en lo alto de la corona
        const [tx, ty] = point(Math.PI * 1.5);
        el('use', { href: '#i-cross', x: tx - 4.5, y: ty - 7, width: 9, height: 13.5 }, svg);
    }

    /* ---------- Destellos de fondo ---------- */
    function buildParticles() {
        if (reduceMotion) return;
        const box = document.getElementById('particles');
        const colors = ['#f3e2b8', '#cdece8', '#fff6dd', '#b9e2de', '#e8d3a2'];
        const count = window.innerWidth < 720 ? 14 : 24;
        for (let i = 0; i < count; i++) {
            const p = document.createElement('span');
            const size = 4 + Math.random() * 7;
            p.className = 'particle';
            p.style.width = p.style.height = `${size}px`;
            p.style.left = `${Math.random() * 100}%`;
            p.style.background = colors[i % colors.length];
            p.style.boxShadow = `0 0 ${size * 1.5}px ${colors[i % colors.length]}`;
            p.style.setProperty('--drift', `${(Math.random() - 0.5) * 120}px`);
            p.style.animationDuration = `${10 + Math.random() * 10}s`;
            p.style.animationDelay = `${-Math.random() * 18}s`;
            box.appendChild(p);
        }
    }

    /* ---------- Lluvia de pétalos al abrir ---------- */
    function burstPetals() {
        if (reduceMotion) return;
        const box = document.getElementById('petals');
        const rect = document.getElementById('book').getBoundingClientRect();
        const ox = rect.left + rect.width / 2;
        const oy = rect.top + rect.height / 2;
        const colors = ['#bfe6e2', '#93d0cb', '#f1dca9', '#d8b878', '#ffffff', '#a7dcd7'];
        for (let i = 0; i < 36; i++) {
            const p = document.createElement('span');
            const angle = Math.random() * Math.PI * 2;
            const dist = 160 + Math.random() * Math.max(window.innerWidth, window.innerHeight) * 0.45;
            p.className = 'petal';
            p.style.left = `${ox}px`;
            p.style.top = `${oy}px`;
            p.style.background = colors[i % colors.length];
            p.style.setProperty('--s', `${7 + Math.random() * 8}px`);
            p.style.setProperty('--dx', `${Math.cos(angle) * dist}px`);
            p.style.setProperty('--dy', `${Math.sin(angle) * dist + 120}px`);
            p.style.setProperty('--rot', `${(Math.random() - 0.5) * 720}deg`);
            p.style.setProperty('--t', `${2.2 + Math.random() * 1.6}s`);
            p.style.animationDelay = `${0.35 + Math.random() * 0.3}s`;
            box.appendChild(p);
            p.addEventListener('animationend', () => p.remove());
        }
    }

    /* ---------- Caja musical: Canción de cuna de Brahms ---------- */
    const MusicBox = (() => {
        // [nota MIDI, duración en tiempos]
        const melody = [
            [64, .5], [64, .5], [67, 2], [64, .5], [64, .5], [67, 2],
            [64, .5], [67, .5], [72, 1], [71, 1.5], [69, .5], [69, 1], [67, 1],
            [62, .5], [64, .5], [65, 1], [62, 1], [62, .5], [64, .5], [65, 2],
            [62, .5], [65, .5], [71, .5], [69, .5], [67, 1], [71, 1], [72, 3],
            [60, .5], [60, .5], [72, 2], [69, .5], [65, .5], [67, 2],
            [64, .5], [60, .5], [65, 1], [67, 1], [69, 1], [67, 2],
            [60, .5], [60, .5], [72, 2], [69, .5], [65, .5], [67, 2],
            [64, .5], [60, .5], [65, 1], [64, .5], [62, .5], [60, 4]
        ];
        const beat = 0.46;
        let ctx, master, timer, nextTime = 0, index = 0, playing = false;

        function setup() {
            ctx = new (window.AudioContext || window.webkitAudioContext)();
            master = ctx.createGain();
            master.gain.value = 0;

            // Eco suave para dar sensación de caja musical
            const delay = ctx.createDelay();
            const feedback = ctx.createGain();
            const tone = ctx.createBiquadFilter();
            delay.delayTime.value = 0.31;
            feedback.gain.value = 0.28;
            tone.type = 'lowpass';
            tone.frequency.value = 2600;
            master.connect(ctx.destination);
            master.connect(delay);
            delay.connect(tone);
            tone.connect(feedback);
            feedback.connect(delay);
            tone.connect(ctx.destination);
        }

        function pluck(midi, time) {
            const f = 440 * Math.pow(2, (midi + 12 - 69) / 12);
            const out = ctx.createGain();
            out.gain.setValueAtTime(0.0001, time);
            out.gain.exponentialRampToValueAtTime(0.22, time + 0.008);
            out.gain.exponentialRampToValueAtTime(0.0001, time + 2.2);
            out.connect(master);
            [[1, 1], [2, 0.18], [4.2, 0.05]].forEach(([mult, amp]) => {
                const osc = ctx.createOscillator();
                const g = ctx.createGain();
                osc.type = 'sine';
                osc.frequency.value = f * mult;
                g.gain.value = amp;
                osc.connect(g).connect(out);
                osc.start(time);
                osc.stop(time + 2.3);
            });
        }

        function schedule() {
            while (nextTime < ctx.currentTime + 0.25) {
                const [note, dur] = melody[index];
                pluck(note, nextTime);
                nextTime += dur * beat;
                index++;
                if (index === melody.length) {
                    index = 0;
                    nextTime += beat * 2;
                }
            }
        }

        return {
            get playing() { return playing; },
            play() {
                if (!ctx) setup();
                ctx.resume();
                playing = true;
                nextTime = Math.max(nextTime, ctx.currentTime + 0.05);
                master.gain.cancelScheduledValues(ctx.currentTime);
                master.gain.setTargetAtTime(0.55, ctx.currentTime, 0.4);
                clearInterval(timer);
                timer = setInterval(schedule, 60);
                schedule();
            },
            pause() {
                if (!ctx) return;
                playing = false;
                master.gain.setTargetAtTime(0, ctx.currentTime, 0.25);
                clearInterval(timer);
                setTimeout(() => { if (!playing) ctx.suspend(); }, 900);
            }
        };
    })();

    /* ---------- Apertura del libro ---------- */
    function setupBook() {
        const book = document.getElementById('book');
        const cover = document.getElementById('cover');
        const toggleBtn = document.getElementById('toggleBtn');
        const toggleText = document.getElementById('toggleText');
        const toggleIcon = document.getElementById('toggleIcon');
        const musicBtn = document.getElementById('musicBtn');
        const musicText = document.getElementById('musicText');
        const hint = document.getElementById('hint');
        const stacked = window.matchMedia('(max-width: 720px)');
        let open = false;

        toggleBtn.classList.add('is-calling');

        function setMusic(on) {
            on ? MusicBox.play() : MusicBox.pause();
            musicBtn.setAttribute('aria-pressed', String(on));
            musicText.innerHTML = on ? 'Pausar<span class="btn__extra"> música</span>' : 'Música';
        }

        function setOpen(next) {
            open = next;
            book.classList.toggle('is-open', open);
            toggleBtn.classList.remove('is-calling');
            toggleBtn.setAttribute('aria-expanded', String(open));
            toggleText.innerHTML = open ? 'Cerrar<span class="btn__extra"> invitación</span>' : 'Abrir invitación';
            toggleIcon.setAttribute('href', open ? '#i-book-close' : '#i-envelope');
            cover.setAttribute('tabindex', open ? '-1' : '0');
            hint.textContent = open
                ? (stacked.matches ? 'Desliza hacia abajo para ver a mis padres y padrinos' : '¡Te esperamos para celebrar juntos!')
                : 'Pulsa el botón para abrir la invitación';

            if (open) {
                musicBtn.hidden = false;
                burstPetals();
                if (!MusicBox.playing) setMusic(true);
                // En celular, la página con la foto se acomoda para llenar la pantalla
                if (stacked.matches) {
                    setTimeout(() => {
                        const top = book.getBoundingClientRect().top + window.scrollY - 10;
                        window.scrollTo({ top, behavior: reduceMotion ? 'auto' : 'smooth' });
                    }, 500);
                }
            } else {
                window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
            }
        }

        toggleBtn.addEventListener('click', () => setOpen(!open));
        cover.addEventListener('click', () => { if (!open) setOpen(true); });
        cover.addEventListener('keydown', e => {
            if (!open && (e.key === 'Enter' || e.key === ' ')) {
                e.preventDefault();
                setOpen(true);
            }
        });
        musicBtn.addEventListener('click', () => setMusic(!MusicBox.playing));

        // Pausar la música si se cambia de pestaña
        document.addEventListener('visibilitychange', () => {
            if (document.hidden && MusicBox.playing) setMusic(false);
        });
    }

    buildHydrangea();
    document.querySelectorAll('[data-wreath]').forEach(buildWreath);
    buildParticles();
    setupBook();
})();
