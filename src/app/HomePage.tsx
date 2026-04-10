'use client';

import { useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Script from 'next/script';
import { useI18n } from '@/lib/i18n';

// Three.js is loaded via CDN script tag — declare the global
declare global {
  interface Window {
    THREE?: any; // eslint-disable-line
  }
}

// ── Data ──────────────────────────────────────────────────────────────────────

const STATS = [
  { target: 2400000, label: 'Active Jobs Listed' },
  { target: 850000, label: 'Companies Hiring' },
  { target: 98, label: 'Match Accuracy' },
  { target: 12, label: 'Days Avg. to Hire' },
];

const JOBS = [
  { company: 'NeuralTech Labs', title: 'Senior AI Engineer', tags: ['Remote', 'ML', 'Python'], salary: '$185k - $240k' },
  { company: 'QuantumFlow Inc', title: 'Full-Stack Architect', tags: ['Hybrid', 'React', 'Rust'], salary: '$160k - $210k' },
  { company: 'CyberNova Systems', title: 'Security Operations Lead', tags: ['On-site', 'SOC', 'Zero Trust'], salary: '$170k - $220k' },
  { company: 'DataPulse Analytics', title: 'VP of Engineering', tags: ['Remote', 'Leadership', 'Scale'], salary: '$220k - $300k' },
];

const MARQUEE_COMPANIES = [
  'NeuralTech Labs', 'QuantumFlow', 'CyberNova', 'DataPulse',
  'Synthwave AI', 'NovaByte', 'ArcTech', 'Vertex Dynamics',
  'Phantom Digital', 'Zenith Systems',
];

const STEPS = [
  { num: '01', icon: '🚀', title: 'Build Your Profile', desc: 'Import your resume, showcase your skills, and set your preferences. Our AI parses everything in seconds.' },
  { num: '02', icon: '🤖', title: 'AI Smart Matching', desc: 'Our engine analyzes 200+ signals to surface roles that truly fit your skills, goals, and lifestyle.' },
  { num: '03', icon: '✨', title: 'Apply & Interview', desc: 'One-click apply, AI interview prep, and real-time tracking. Land offers faster than ever.' },
];

const TESTIMONIALS = [
  { text: '"WorkWave matched me with a role at a top AI lab in just 8 days. The salary transparency alone saved me from lowball offers."', initials: 'AK', name: 'Alex Kim', role: 'ML Engineer at NeuralTech' },
  { text: '"The AI matching is unreal. Every recommended role felt handpicked. I got 3 offers within two weeks."', initials: 'SR', name: 'Sarah Reyes', role: 'Staff Engineer at QuantumFlow' },
  { text: '"As a hiring manager, WorkWave cut our time-to-hire by 60%. The candidate quality is consistently excellent."', initials: 'MJ', name: 'Marcus Johnson', role: 'VP Engineering at DataPulse' },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatStatValue(current: number, target: number): string {
  if (target === 98) return `${Math.round(current)}%`;
  if (target === 12) return `${Math.round(current)}`;
  if (target >= 1000000) {
    const val = current / 1000000;
    return current >= target
      ? `${(target / 1000000).toFixed(1).replace(/\.0$/, '')}M`
      : `${val.toFixed(1)}M`;
  }
  if (target >= 1000) return `${Math.round(current / 1000)}K`;
  return `${Math.round(current)}`;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function HomePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const threeInitialized = useRef(false);
  const { t } = useI18n();

  const initThreeJS = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || threeInitialized.current) return;
    const THREE = window.THREE;
    if (!THREE) return;

    threeInitialized.current = true;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 50;

    const PARTICLE_COUNT = 600;
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const velocities: { x: number; y: number }[] = [];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 100;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 100;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 50;
      velocities.push({ x: (Math.random() - 0.5) * 0.02, y: (Math.random() - 0.5) * 0.02 });
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const mat = new THREE.PointsMaterial({ size: 0.3, color: 0x22d3ee, transparent: true, opacity: 0.7, blending: THREE.AdditiveBlending });
    scene.add(new THREE.Points(geo, mat));

    const CONN_LIMIT = 100;
    const lineMat = new THREE.LineBasicMaterial({ color: 0x8b5cf6, transparent: true, opacity: 0.12, blending: THREE.AdditiveBlending });
    const lineGeo = new THREE.BufferGeometry();
    const linePositions = new Float32Array(CONN_LIMIT * CONN_LIMIT * 3);
    lineGeo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    scene.add(new THREE.LineSegments(lineGeo, lineMat));

    const mouse = { x: 0, y: 0 };
    const onMouseMove = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth - 0.5) * 100;
      mouse.y = -(e.clientY / window.innerHeight - 0.5) * 100;
    };
    document.addEventListener('mousemove', onMouseMove);

    let animId: number;
    function animate() {
      animId = requestAnimationFrame(animate);
      const p = geo.attributes.position.array as Float32Array;

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        p[i * 3] += velocities[i].x;
        p[i * 3 + 1] += velocities[i].y;
        const dx = p[i * 3] - mouse.x;
        const dy = p[i * 3 + 1] - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 15) {
          const f = 0.02 * (1 - dist / 15);
          velocities[i].x += dx * f * 0.01;
          velocities[i].y += dy * f * 0.01;
        }
        if (Math.abs(p[i * 3]) > 50) velocities[i].x *= -1;
        if (Math.abs(p[i * 3 + 1]) > 50) velocities[i].y *= -1;
      }
      geo.attributes.position.needsUpdate = true;

      const lp = lineGeo.attributes.position.array as Float32Array;
      let li = 0;
      const subset = Math.min(PARTICLE_COUNT, CONN_LIMIT);
      for (let i = 0; i < subset; i++) {
        for (let j = i + 1; j < subset; j++) {
          const dx = p[i * 3] - p[j * 3];
          const dy = p[i * 3 + 1] - p[j * 3 + 1];
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 18) {
            lp[li * 6] = p[i * 3];
            lp[li * 6 + 1] = p[i * 3 + 1];
            lp[li * 6 + 2] = 0;
            lp[li * 6 + 3] = p[j * 3];
            lp[li * 6 + 4] = p[j * 3 + 1];
            lp[li * 6 + 5] = 0;
            li++;
          }
        }
      }
      for (let k = li; k < linePositions.length / 6; k++) {
        lp[k * 6] = lp[k * 6 + 1] = lp[k * 6 + 2] = lp[k * 6 + 3] = lp[k * 6 + 4] = lp[k * 6 + 5] = 0;
      }
      lineGeo.attributes.position.needsUpdate = true;
      renderer.render(scene, camera);
    }
    animate();

    const onResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animId);
      document.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
    };
  }, []);

  // Initialize Three.js on mount (if script already loaded) or on script load
  useEffect(() => {
    if (window.THREE) {
      initThreeJS();
    }
  }, [initThreeJS]);

  // Scroll reveal & counter animations
  useEffect(() => {
    // Fade-up observer
    const fadeEls = document.querySelectorAll('.ww-fade-up');
    const fadeObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e, i) => {
          if (e.isIntersecting) {
            setTimeout(() => e.target.classList.add('ww-visible'), i * 80);
            fadeObs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    fadeEls.forEach((el) => fadeObs.observe(el));

    // Animated counters
    const counterEls = document.querySelectorAll<HTMLElement>('.ww-stat-number');
    const counterObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          const target = parseInt(el.dataset.target || '0', 10);
          let current = 0;
          const totalSteps = 50;
          const stepTime = 1500 / totalSteps;
          const increment = target / totalSteps;

          function tick() {
            current += increment;
            if (current >= target) current = target;
            el.textContent = formatStatValue(current, target);
            if (current < target) setTimeout(tick, stepTime);
          }
          tick();
          counterObs.unobserve(el);
        });
      },
      { threshold: 0.5 }
    );
    counterEls.forEach((el) => counterObs.observe(el));

    // 3D tilt on job cards
    const tiltCards = document.querySelectorAll<HTMLElement>('.ww-tilt');
    const onMove = (card: HTMLElement, e: MouseEvent) => {
      const r = card.getBoundingClientRect();
      const cx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      const cy = ((e.clientY - r.top) / r.height - 0.5) * 2;
      card.style.transform = `perspective(800px) rotateY(${cx * 8}deg) rotateX(${-cy * 8}deg) scale3d(1.02,1.02,1.02)`;
      card.style.transition = 'none';
    };
    const onLeave = (card: HTMLElement) => {
      card.style.transform = '';
      card.style.transition = 'transform 0.5s ease';
    };
    const handlers = Array.from(tiltCards).map((card) => {
      const move = (e: MouseEvent) => onMove(card, e);
      const leave = () => onLeave(card);
      card.addEventListener('mousemove', move);
      card.addEventListener('mouseleave', leave);
      return { card, move, leave };
    });

    return () => {
      fadeObs.disconnect();
      counterObs.disconnect();
      handlers.forEach(({ card, move, leave }) => {
        card.removeEventListener('mousemove', move);
        card.removeEventListener('mouseleave', leave);
      });
    };
  }, []);

  // Build marquee items (duplicated for seamless loop)
  const marqueeItems = [...MARQUEE_COMPANIES, ...MARQUEE_COMPANIES].flatMap((name, i) => [
    <span key={`name-${i}`} className="ww-marquee-item">{name}</span>,
    <span key={`dot-${i}`} className="ww-marquee-item">•</span>,
  ]);

  return (
    <>
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"
        strategy="afterInteractive"
        onLoad={initThreeJS}
      />

      <style jsx global>{`
        /* ── WorkWave Landing Scoped Styles ──────────────────────────── */
        .ww-landing { background: #0a0a0f; color: #e2e8f0; font-family: 'Inter', sans-serif; overflow-x: hidden; }

        /* Hero */
        .ww-hero { position: relative; min-height: 100vh; display: flex; align-items: center; justify-content: center; text-align: center; overflow: hidden; }
        .ww-hero-canvas { position: absolute; inset: 0; z-index: 0; }
        .ww-hero-overlay { position: absolute; inset: 0; background: radial-gradient(ellipse at center, transparent 0%, #0a0a0f 75%); z-index: 1; }
        .ww-hero-content { position: relative; z-index: 2; max-width: 820px; padding: 0 20px; }
        .ww-hero-badge { display: inline-flex; align-items: center; gap: 8px; padding: 6px 16px 6px 8px; border-radius: 100px; border: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.04); font-size: 0.8rem; color: #94a3b8; margin-bottom: 32px; backdrop-filter: blur(8px); }
        .ww-hero-badge .ww-dot { width: 6px; height: 6px; border-radius: 50%; background: #14b8a6; box-shadow: 0 0 8px #14b8a6; }
        .ww-hero h1 { font-size: clamp(2.5rem, 6vw, 4.5rem); font-weight: 900; line-height: 1.05; margin-bottom: 24px; letter-spacing: -1.5px; color: #e2e8f0; }
        .ww-hero h1 .ww-gradient { background: linear-gradient(135deg, #fff 0%, #94a3b8 50%, #22d3ee 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .ww-hero p { font-size: 1.15rem; color: #94a3b8; max-width: 550px; margin: 0 auto 48px; line-height: 1.7; }
        .ww-hero-buttons { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; }
        .ww-hero-glow { position: absolute; width: 500px; height: 500px; border-radius: 50%; filter: blur(120px); opacity: 0.15; z-index: 0; pointer-events: none; }
        .ww-glow-cyan { background: #22d3ee; top: -100px; left: -100px; }
        .ww-glow-purple { background: #8b5cf6; bottom: -100px; right: -100px; }

        /* Buttons */
        .ww-btn { padding: 14px 32px; border-radius: 10px; font-weight: 600; font-size: 0.95rem; border: none; cursor: pointer; transition: all 0.3s; font-family: 'Inter', sans-serif; display: inline-flex; align-items: center; justify-content: center; }
        .ww-btn-primary { background: linear-gradient(135deg, #22d3ee, #8b5cf6); color: #fff; box-shadow: 0 0 20px rgba(34,211,238,0.3); }
        .ww-btn-primary:hover { box-shadow: 0 0 35px rgba(34,211,238,0.5); transform: translateY(-2px); }
        .ww-btn-ghost { background: transparent; border: 1px solid rgba(255,255,255,0.08); color: #e2e8f0; }
        .ww-btn-ghost:hover { border-color: #94a3b8; background: rgba(255,255,255,0.03); }

        /* Sections */
        .ww-section { padding: 100px 40px; max-width: 1200px; margin: 0 auto; }
        .ww-section-label { display: inline-block; font-size: 0.8rem; font-weight: 600; text-transform: uppercase; letter-spacing: 2px; color: #22d3ee; margin-bottom: 12px; }
        .ww-section-title { font-size: clamp(1.8rem, 4vw, 2.8rem); font-weight: 800; margin-bottom: 16px; color: #e2e8f0; }
        .ww-section-sub { color: #94a3b8; max-width: 550px; margin-bottom: 60px; line-height: 1.7; }

        /* Stats */
        .ww-stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 24px; }
        .ww-stat-card { background: rgba(255,255,255,0.04); backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 32px; text-align: center; transition: transform 0.3s, border-color 0.3s; }
        .ww-stat-card:hover { border-color: rgba(34,211,238,0.3); transform: translateY(-4px); }
        .ww-stat-number { font-size: 2.8rem; font-weight: 900; background: linear-gradient(135deg, #22d3ee, #8b5cf6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .ww-stat-label { color: #94a3b8; font-size: 0.95rem; margin-top: 4px; }

        /* Jobs */
        .ww-jobs-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 24px; }
        .ww-job-card { background: rgba(255,255,255,0.04); backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 28px; transition: border-color 0.4s; cursor: pointer; position: relative; overflow: hidden; }
        .ww-job-card::before { content: ''; position: absolute; inset: 0; background: linear-gradient(135deg, rgba(34,211,238,0.06), transparent 40%, rgba(139,92,246,0.06)); opacity: 0; transition: opacity 0.4s; border-radius: 16px; pointer-events: none; }
        .ww-job-card:hover::before { opacity: 1; }
        .ww-job-card:hover { border-color: rgba(34,211,238,0.3); }
        .ww-job-company { font-size: 0.85rem; color: #22d3ee; font-weight: 600; margin-bottom: 8px; }
        .ww-job-title { font-size: 1.15rem; font-weight: 700; margin-bottom: 12px; color: #e2e8f0; }
        .ww-job-tags { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 16px; }
        .ww-job-tag { font-size: 0.75rem; padding: 4px 10px; border-radius: 20px; background: rgba(139,92,246,0.15); color: #8b5cf6; font-weight: 500; }
        .ww-job-salary { font-size: 1rem; font-weight: 700; color: #fff; }

        /* Marquee */
        .ww-marquee-section { padding: 60px 0; overflow: hidden; border-top: 1px solid rgba(255,255,255,0.08); border-bottom: 1px solid rgba(255,255,255,0.08); }
        .ww-marquee-track { display: flex; gap: 60px; animation: wwMarquee 25s linear infinite; width: max-content; }
        .ww-marquee-item { font-size: 1.4rem; font-weight: 700; color: rgba(255,255,255,0.12); white-space: nowrap; letter-spacing: -0.5px; transition: color 0.3s; }
        .ww-marquee-item:hover { color: rgba(255,255,255,0.3); }
        @keyframes wwMarquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }

        /* Steps */
        .ww-steps-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 32px; }
        .ww-step-card { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 36px; position: relative; transition: border-color 0.3s; }
        .ww-step-card:hover { border-color: rgba(34,211,238,0.2); }
        .ww-step-num { font-size: 3rem; font-weight: 900; background: linear-gradient(135deg, #22d3ee, #8b5cf6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; opacity: 0.35; position: absolute; top: 16px; right: 24px; }
        .ww-step-icon { font-size: 2.2rem; margin-bottom: 20px; display: block; }
        .ww-step-card h3 { font-size: 1.2rem; font-weight: 700; margin-bottom: 10px; color: #e2e8f0; }
        .ww-step-card p { color: #94a3b8; line-height: 1.6; font-size: 0.95rem; }

        /* Testimonials */
        .ww-testimonials-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px; }
        .ww-test-card { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 32px; transition: border-color 0.3s; }
        .ww-test-card:hover { border-color: rgba(139,92,246,0.3); }
        .ww-test-text { font-size: 1rem; line-height: 1.7; color: #e2e8f0; margin-bottom: 24px; font-style: italic; }
        .ww-test-author { display: flex; align-items: center; gap: 12px; }
        .ww-test-avatar { width: 44px; height: 44px; border-radius: 50%; background: linear-gradient(135deg, #22d3ee, #8b5cf6); display: flex; align-items: center; justify-content: center; font-weight: 700; color: #fff; font-size: 0.85rem; flex-shrink: 0; }
        .ww-test-name { font-weight: 600; font-size: 0.95rem; color: #e2e8f0; }
        .ww-test-role { font-size: 0.8rem; color: #94a3b8; }

        /* CTA */
        .ww-cta { text-align: center; padding: 120px 40px; position: relative; overflow: hidden; }
        .ww-cta::before { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse at center, rgba(34,211,238,0.06) 0%, transparent 60%); pointer-events: none; }
        .ww-cta h2 { font-size: clamp(2rem, 4vw, 3rem); font-weight: 900; margin-bottom: 16px; position: relative; color: #e2e8f0; }
        .ww-cta p { color: #94a3b8; margin-bottom: 36px; font-size: 1.1rem; position: relative; }

        /* Animations */
        .ww-fade-up { opacity: 0; transform: translateY(40px); transition: opacity 0.7s ease, transform 0.7s ease; }
        .ww-fade-up.ww-visible { opacity: 1; transform: translateY(0); }

        /* Responsive */
        @media (max-width: 768px) {
          .ww-section { padding: 60px 20px; }
          .ww-hero-buttons { flex-direction: column; align-items: center; }
          .ww-cta { padding: 80px 20px; }
          .ww-pricing-grid { grid-template-columns: 1fr; }
          .ww-pricing-section { padding: 80px 20px; }
        }

        /* Pricing */
        .ww-pricing-section { padding: 100px 40px; max-width: 1000px; margin: 0 auto; text-align: center; position: relative; }
        .ww-pricing-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; max-width: 900px; margin: 0 auto; }
        .ww-pricing-card { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 20px; padding: 40px 32px; text-align: left; position: relative; transition: border-color 0.3s, transform 0.3s; }
        .ww-pricing-card:hover { border-color: rgba(34,211,238,0.2); transform: translateY(-4px); }
        .ww-pricing-card.ww-featured { border-color: rgba(139,92,246,0.3); }
        .ww-pricing-card.ww-featured::before { content: ''; position: absolute; top: -1px; left: 50%; transform: translateX(-50%); width: 200px; height: 2px; background: linear-gradient(90deg, transparent, #8b5cf6, #22d3ee, transparent); }
        .ww-pricing-badge { position: absolute; top: -14px; left: 50%; transform: translateX(-50%); padding: 4px 16px; border-radius: 100px; background: linear-gradient(135deg, #8b5cf6, #22d3ee); color: #fff; font-size: 0.75rem; font-weight: 700; white-space: nowrap; }
        .ww-pricing-name { font-size: 1.25rem; font-weight: 700; color: #e2e8f0; margin-bottom: 8px; }
        .ww-pricing-price { font-size: 3rem; font-weight: 900; margin-bottom: 8px; background: linear-gradient(135deg, #22d3ee, #8b5cf6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; line-height: 1.1; }
        .ww-pricing-period { font-size: 0.85rem; color: #94a3b8; }
        .ww-pricing-features { list-style: none; padding: 0; margin: 28px 0 32px; }
        .ww-pricing-features li { display: flex; align-items: flex-start; gap: 10px; padding: 8px 0; font-size: 0.9rem; color: #94a3b8; line-height: 1.5; }
        .ww-pricing-features li .ww-check { width: 18px; height: 18px; border-radius: 50%; background: rgba(34,211,238,0.15); color: #22d3ee; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 0.65rem; margin-top: 2px; }
        .ww-pricing-btn { display: block; width: 100%; padding: 14px; border-radius: 10px; font-weight: 600; font-size: 0.95rem; border: none; cursor: pointer; transition: all 0.3s; font-family: 'Inter', sans-serif; text-align: center; text-decoration: none; }
        .ww-pricing-btn-outline { background: transparent; border: 1px solid rgba(255,255,255,0.12); color: #e2e8f0; }
        .ww-pricing-btn-outline:hover { border-color: #22d3ee; background: rgba(34,211,238,0.05); }
        .ww-pricing-btn-primary { background: linear-gradient(135deg, #22d3ee, #8b5cf6); color: #fff; box-shadow: 0 0 20px rgba(34,211,238,0.2); }
        .ww-pricing-btn-primary:hover { box-shadow: 0 0 35px rgba(34,211,238,0.4); transform: translateY(-2px); }
      `}</style>

      <div className="ww-landing">
        {/* Hero */}
        <section className="ww-hero">
          <canvas ref={canvasRef} className="ww-hero-canvas" />
          <div className="ww-hero-overlay" />
          <div className="ww-hero-glow ww-glow-cyan" />
          <div className="ww-hero-glow ww-glow-purple" />
          <div className="ww-hero-content">
            <div className="ww-hero-badge">
              <span className="ww-dot" />
              Now live — Phase 2 rolling out
            </div>
            <h1>
              <span className="ww-gradient">Find your next</span>
              <br />
              career wave
            </h1>
            <p>The job platform built for people who prefer signal over noise. Curated roles. Real data. Zero spam.</p>
            <div className="ww-hero-buttons">
              <Link href="/jobs" className="ww-btn ww-btn-primary">Browse Jobs</Link>
              <Link href="/companies" className="ww-btn ww-btn-ghost">For Companies →</Link>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="ww-section">
          <div className="ww-stats-grid">
            {STATS.map((stat) => (
              <div key={stat.label} className="ww-stat-card ww-fade-up">
                <div className="ww-stat-number" data-target={stat.target}>0</div>
                <div className="ww-stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Featured Jobs */}
        <section className="ww-section" id="ww-jobs">
          <div className="ww-section-label ww-fade-up">Featured Positions</div>
          <h2 className="ww-section-title ww-fade-up">Hot Jobs Right Now</h2>
          <p className="ww-section-sub ww-fade-up">Curated roles from top companies, matched to your skills and ambition.</p>
          <div className="ww-jobs-grid">
            {JOBS.map((job) => (
              <div key={job.title} className="ww-job-card ww-fade-up ww-tilt">
                <div className="ww-job-company">{job.company}</div>
                <div className="ww-job-title">{job.title}</div>
                <div className="ww-job-tags">
                  {job.tags.map((tag) => (
                    <span key={tag} className="ww-job-tag">{tag}</span>
                  ))}
                </div>
                <div className="ww-job-salary">{job.salary}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Company Marquee */}
        <div className="ww-marquee-section">
          <div className="ww-marquee-track">{marqueeItems}</div>
        </div>

        {/* How It Works */}
        <section className="ww-section">
          <div className="ww-section-label ww-fade-up">How It Works</div>
          <h2 className="ww-section-title ww-fade-up">Three Steps to Your New Role</h2>
          <p className="ww-section-sub ww-fade-up">Our AI does the heavy lifting so you can focus on what matters.</p>
          <div className="ww-steps-grid">
            {STEPS.map((step) => (
              <div key={step.num} className="ww-step-card ww-fade-up">
                <span className="ww-step-num">{step.num}</span>
                <span className="ww-step-icon">{step.icon}</span>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Testimonials */}
        <section className="ww-section">
          <div className="ww-section-label ww-fade-up">Success Stories</div>
          <h2 className="ww-section-title ww-fade-up">Loved by Professionals</h2>
          <p className="ww-section-sub ww-fade-up">Real people, real results. Here is what our community says.</p>
          <div className="ww-testimonials-grid">
            {TESTIMONIALS.map((t) => (
              <div key={t.initials} className="ww-test-card ww-fade-up">
                <p className="ww-test-text">{t.text}</p>
                <div className="ww-test-author">
                  <div className="ww-test-avatar">{t.initials}</div>
                  <div>
                    <div className="ww-test-name">{t.name}</div>
                    <div className="ww-test-role">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Pricing */}
        <section className="ww-pricing-section">
          <div className="ww-section-label ww-fade-up">💎 Pricing</div>
          <h2 className="ww-section-title ww-fade-up">{String(t('pricing.title'))}</h2>
          <p className="ww-section-sub ww-fade-up" style={{ margin: '0 auto 60px' }}>{String(t('pricing.subtitle'))}</p>
          <div className="ww-pricing-grid">
            {/* Free Plan */}
            <div className="ww-pricing-card ww-fade-up">
              <div className="ww-pricing-name">{String(t('pricing.free.name'))}</div>
              <div className="ww-pricing-price">$0</div>
              <ul className="ww-pricing-features">
                {(t('pricing.free.features') as unknown as string[]).map((feat: string, i: number) => (
                  <li key={i}>
                    <span className="ww-check">✓</span>
                    {feat}
                  </li>
                ))}
              </ul>
              <Link href="/auth/register" className="ww-pricing-btn ww-pricing-btn-outline">
                {String(t('pricing.getStarted'))}
              </Link>
            </div>
            {/* Premium Plan */}
            <div className="ww-pricing-card ww-featured ww-fade-up">
              <div className="ww-pricing-badge">{String(t('pricing.premium.badge'))}</div>
              <div className="ww-pricing-name">{String(t('pricing.premium.name'))}</div>
              <div className="ww-pricing-price">
                $9.99<span className="ww-pricing-period">{String(t('pricing.premium.period'))}</span>
              </div>
              <ul className="ww-pricing-features">
                {(t('pricing.premium.features') as unknown as string[]).map((feat: string, i: number) => (
                  <li key={i}>
                    <span className="ww-check">✓</span>
                    {feat}
                  </li>
                ))}
              </ul>
              <Link href="/auth/register" className="ww-pricing-btn ww-pricing-btn-primary">
                {String(t('pricing.getStarted'))}
              </Link>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="ww-cta">
          <h2 className="ww-fade-up">
            Ready to <span className="ww-gradient">Wave</span> Your Future?
          </h2>
          <p className="ww-fade-up">Join the platform that is redefining how the world works in 2026.</p>
          <Link href="/auth/register" className="ww-btn ww-btn-primary ww-fade-up">
            Create Free Account
          </Link>
        </section>
      </div>
    </>
  );
}
