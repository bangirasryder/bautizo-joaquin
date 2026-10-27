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

    /* ---------- Corona ovalada de la portada ---------- */
    function buildWreath(svg) {
        const cx = 100, cy = 130, rx = 80, ry = 110;
        const point = t => [cx + rx * Math.cos(t), cy + ry * Math.sin(t)];
        const tangent = t => Math.atan2(ry * Math.cos(t), -rx * Math.sin(t)) * 180 / Math.PI;

        el('ellipse', { cx, cy, rx: rx - 7, ry: ry - 7, fill: 'none', stroke: 'url(#gold)', 'stroke-width': 1.2 }, svg);
        el('ellipse', { cx, cy, rx: rx + 6, ry: ry + 6, fill: 'none', stroke: 'url(#gold)', 'stroke-width': .9 }, svg);

        // Hojas y florecitas siguiendo el óvalo
        const steps = 32;
        for (let i = 0; i < steps; i++) {
            const t = (i / steps) * Math.PI * 2;
            // Dejamos libre la parte superior para la cruz
            if (Math.abs(t - Math.PI * 1.5) < 0.18) continue;
            const [x, y] = point(t);
            if (i % 3 === 0) {
                floret(svg, x, y, 1);
            } else {
                const side = i % 2 ? 1 : -1;
                el('path', {
                    d: 'M0 0c3-3 8-3 11 0-3 3-8 3-11 0z',
                    fill: '#a5d3c8', stroke: '#b8925a', 'stroke-width': .4,
                    transform: `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${(tangent(t) + side * 35).toFixed(0)})`
                }, svg);
            }
        }

        const [tx, ty] = point(Math.PI * 1.5);
        el('use', { href: '#i-cross', x: tx - 4.5, y: ty - 7, width: 9, height: 13.5 }, svg);
    }

    // Florecita azul de cinco pétalos con centro dorado
    function floret(parent, x, y, scale) {
        const g = el('g', { transform: `translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${scale})` }, parent);
        for (let p = 0; p < 5; p++) {
            el('ellipse', { cx: 0, cy: -2.5, rx: 1.9, ry: 2.5, fill: '#e2f3f3', stroke: '#6fb3bd', 'stroke-width': .5, transform: `rotate(${p * 72})` }, g);
        }
        el('circle', { r: 1.1, fill: '#c9a86a' }, g);
    }

    /* ---------- Marco de encaje de la foto (como la tarjeta impresa) ---------- */
    function buildLaceFrame(svg) {
        const cx = 120, cy = 135;
        const TAU = Math.PI * 2;
        const rand = seeded(11);

        // Contorno festoneado alrededor de un óvalo. dir = 1: lóbulos hacia afuera; -1: hacia adentro.
        // Con "alternate" los lóbulos alternan grande y pequeño, como el encaje de la tarjeta.
        function scallop(rx, ry, lobes, amp, dir, alternate) {
            const n = lobes * 20;
            let d = '';
            for (let i = 0; i <= n; i++) {
                const t = (i / n) * TAU - Math.PI / 2;
                const u = (i / n) * lobes;
                const lobe = Math.floor(u) % lobes;
                const bump = Math.pow(Math.sin((u % 1) * Math.PI), 0.6) * (alternate && lobe % 2 ? 0.55 : 1);
                const k = 1 + dir * amp * bump;
                d += (i ? 'L' : 'M') + (cx + rx * k * Math.cos(t)).toFixed(2) + ' ' + (cy + ry * k * Math.sin(t)).toFixed(2);
            }
            return d + 'Z';
        }

        const outer = scallop(104, 119, 26, 0.085, 1, true);
        const inner = scallop(78, 98, 40, 0.035, -1, false);

        // Foto recortada por el borde interior
        const defs = el('defs', {}, svg);
        const clip = el('clipPath', { id: 'photo-clip' }, defs);
        el('path', { d: inner }, clip);
        el('rect', { x: 30, y: 30, width: 180, height: 210, fill: '#f4f8f7', 'clip-path': 'url(#photo-clip)' }, svg);
        el('image', {
            href: svg.dataset.photo, x: 34, y: 16, width: 172, height: 235,
            preserveAspectRatio: 'xMidYMid slice', 'clip-path': 'url(#photo-clip)'
        }, svg);

        // Banda de encaje blanca con filo dorado por fuera y por dentro
        el('path', { d: outer + inner, 'fill-rule': 'evenodd', fill: '#fffdf8' }, svg);
        el('path', { d: outer, fill: 'none', stroke: 'url(#gold)', 'stroke-width': 1.3, 'stroke-linejoin': 'round' }, svg);
        el('path', { d: scallop(100, 115, 26, 0.085, 1, true), fill: 'none', stroke: '#e6d3ad', 'stroke-width': .5 }, svg);
        el('path', { d: inner, fill: 'none', stroke: 'url(#gold)', 'stroke-width': 1.3, 'stroke-linejoin': 'round' }, svg);

        // Enredadera dorada ondulada que sube por ambos lados hasta la cruz
        const mid = (t, wob) => [cx + (91 + wob) * Math.cos(t), cy + (108.5 + wob) * Math.sin(t)];
        const gap = 0.2;
        const from = -Math.PI / 2 + gap, to = Math.PI * 1.5 - gap;
        const steps = 260;
        const along = [];
        let vine = '';
        for (let i = 0; i <= steps; i++) {
            const t = from + (to - from) * (i / steps);
            const wob = 3.2 * Math.sin((i / steps) * Math.PI * 34);
            const [x, y] = mid(t, wob);
            along.push({ t, x, y, wob });
            vine += (i ? 'L' : 'M') + x.toFixed(2) + ' ' + y.toFixed(2);
        }
        el('path', { d: vine, fill: 'none', stroke: 'url(#gold)', 'stroke-width': .75, 'stroke-linecap': 'round' }, svg);

        // Hojas, flores y botones a lo largo de la enredadera
        for (let i = 3; i < along.length - 3; i += 4) {
            const p = along[i], q = along[i + 1];
            const ang = Math.atan2(q.y - p.y, q.x - p.x) * 180 / Math.PI;
            const kind = Math.round((i - 3) / 4) % 4;
            if (kind === 1 || kind === 3) {
                const side = kind === 1 ? -1 : 1;
                el('path', {
                    d: 'M0 0c2.8-3 7.6-3.2 10.6 0-3 3-7.8 3-10.6 0z',
                    fill: rand() > 0.5 ? '#a9d0c0' : '#b9dccd', stroke: '#b8925a', 'stroke-width': .35,
                    transform: `translate(${p.x.toFixed(1)} ${p.y.toFixed(1)}) rotate(${(ang + side * 55).toFixed(0)})`
                }, svg);
            } else if (kind === 0) {
                const [fx, fy] = mid(p.t, p.wob > 0 ? p.wob + 3.5 : p.wob - 3.5);
                floret(svg, fx, fy, 0.95);
            } else {
                // Botón dorado de tres puntitos
                const g = el('g', { fill: '#c9a86a', transform: `translate(${p.x.toFixed(1)} ${p.y.toFixed(1)}) rotate(${ang.toFixed(0)})` }, svg);
                el('circle', { cx: 0, cy: -2.2, r: .8 }, g);
                el('circle', { cx: 1.4, cy: -3.4, r: .7 }, g);
                el('circle', { cx: -1.2, cy: -3.5, r: .7 }, g);
            }
        }

        // Puntitos de encaje cerca del borde exterior
        for (let i = 0; i < 26; i++) {
            const t = ((i + 0.5) / 26) * TAU - Math.PI / 2;
            const k = i % 2 ? 1.025 : 1.055;
            el('circle', { cx: (cx + 104 * k * Math.cos(t)).toFixed(1), cy: (cy + 119 * k * Math.sin(t)).toFixed(1), r: .9, fill: 'none', stroke: '#c9a86a', 'stroke-width': .35 }, svg);
        }

        // Cruz dorada arriba, dentro de la banda
        el('use', { href: '#i-cross', x: cx - 4.5, y: cy - 108.5 - 7, width: 9, height: 13.5 }, svg);
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
        const lookahead = 1.2;   // segundos programados por adelantado (aguanta pausas del navegador)
        let ctx, master, timer, nextTime = 0, index = 0, playing = false;
        const voices = new Set();   // osciladores programados que aún no terminan

        function setup() {
            ctx = new (window.AudioContext || window.webkitAudioContext)();
            master = ctx.createGain();
            master.gain.value = 0;

            // Limitador para que las notas que coinciden nunca saturen
            const limiter = ctx.createDynamicsCompressor();
            limiter.threshold.value = -12;
            limiter.knee.value = 6;
            limiter.ratio.value = 8;
            limiter.connect(ctx.destination);

            // Eco muy ligero para dar sensación de caja musical sin empastar las notas
            const delay = ctx.createDelay();
            const feedback = ctx.createGain();
            const wet = ctx.createGain();
            const tone = ctx.createBiquadFilter();
            delay.delayTime.value = 0.23;
            feedback.gain.value = 0.12;
            wet.gain.value = 0.18;
            tone.type = 'lowpass';
            tone.frequency.value = 2200;
            master.connect(limiter);
            master.connect(delay);
            delay.connect(tone);
            tone.connect(feedback);
            feedback.connect(delay);
            tone.connect(wet);
            wet.connect(limiter);
        }

        function advance() {
            nextTime += melody[index][1] * beat;
            index++;
            if (index === melody.length) {
                index = 0;
                nextTime += beat * 2;
            }
        }

        function pluck(midi, dur, time) {
            const f = 440 * Math.pow(2, (midi + 12 - 69) / 12);
            // La cola de cada nota termina poco después de la siguiente
            const tail = Math.min(1.4, dur * beat + 0.55);
            const out = ctx.createGain();
            out.gain.setValueAtTime(0.0001, time);
            out.gain.exponentialRampToValueAtTime(0.16, time + 0.008);
            out.gain.exponentialRampToValueAtTime(0.0001, time + tail);
            out.connect(master);
            [[1, 1], [2, 0.16], [4.2, 0.04]].forEach(([mult, amp]) => {
                const osc = ctx.createOscillator();
                const g = ctx.createGain();
                osc.type = 'sine';
                osc.frequency.value = f * mult;
                g.gain.value = amp;
                osc.connect(g).connect(out);
                osc.start(time);
                osc.stop(time + tail + 0.05);
                voices.add(osc);
                osc.onended = () => voices.delete(osc);
            });
        }

        function schedule() {
            if (!playing || ctx.state !== 'running') return;
            // Si el navegador congeló el temporizador (al hacer scroll o cambiar de app),
            // se saltan las notas atrasadas en lugar de sonarlas todas juntas.
            while (nextTime < ctx.currentTime + 0.02) advance();
            while (nextTime < ctx.currentTime + lookahead) {
                pluck(melody[index][0], melody[index][1], nextTime);
                advance();
            }
        }

        return {
            get playing() { return playing; },
            play() {
                if (!ctx) setup();
                playing = true;
                clearInterval(timer);
                // Esperar a que el audio esté realmente activo antes de programar notas
                ctx.resume().then(() => {
                    if (!playing) return;
                    nextTime = ctx.currentTime + 0.1;
                    master.gain.cancelScheduledValues(ctx.currentTime);
                    master.gain.setTargetAtTime(0.6, ctx.currentTime, 0.4);
                    clearInterval(timer);
                    timer = setInterval(schedule, 100);
                    schedule();
                });
            },
            pause() {
                if (!ctx) return;
                playing = false;
                clearInterval(timer);
                master.gain.cancelScheduledValues(ctx.currentTime);
                master.gain.setTargetAtTime(0, ctx.currentTime, 0.15);
                // Cancelar las notas ya programadas para que no se sumen al reanudar
                const stopAt = ctx.currentTime + 0.25;
                voices.forEach(osc => { try { osc.stop(stopAt); } catch (e) { /* ya detenido */ } });
                voices.clear();
                setTimeout(() => { if (!playing) ctx.suspend(); }, 600);
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
    document.querySelectorAll('[data-lace-frame]').forEach(buildLaceFrame);
    buildParticles();
    setupBook();
})();
