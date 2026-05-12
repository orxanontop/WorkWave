'use client';

import Link from 'next/link';
import {
  ArrowRight,
  BadgeCheck,
  Bell,
  BriefcaseBusiness,
  Building2,
  CalendarClock,
  Check,
  CircleDollarSign,
  Clock3,
  FileText,
  MapPin,
  MessageSquare,
  Search,
  SlidersHorizontal,
  Sparkles,
  Star,
  UserRound,
  Zap,
} from 'lucide-react';

const FEATURE_TILES = [
  {
    title: 'Jobs',
    subtitle: 'Live roles matched to your city, skills, and salary range.',
    icon: BriefcaseBusiness,
    preview: 'jobs',
  },
  {
    title: 'Companies',
    subtitle: 'Verified employers with open roles and transparent details.',
    icon: Building2,
    preview: 'companies',
  },
  {
    title: 'Profiles',
    subtitle: 'A focused applicant profile built for faster applications.',
    icon: UserRound,
    preview: 'profile',
  },
  {
    title: 'Alerts',
    subtitle: 'Shortlists, saved searches, and application updates in one place.',
    icon: Bell,
    preview: 'alerts',
  },
] as const;

const SIGNALS = [
  { icon: Search, label: 'Search' },
  { icon: MapPin, label: 'Local' },
  { icon: BadgeCheck, label: 'Verified' },
  { icon: CircleDollarSign, label: 'Salary' },
] as const;

const JOB_ROWS = [
  { role: 'Product Designer', company: 'Northstar Labs', meta: 'Hybrid' },
  { role: 'Frontend Engineer', company: 'Bluepeak Studio', meta: 'Remote' },
  { role: 'Operations Lead', company: 'CivicWorks', meta: 'On-site' },
] as const;

function TilePreview({ type }: { type: (typeof FEATURE_TILES)[number]['preview'] }) {
  if (type === 'jobs') {
    return (
      <div className="ww-preview-list">
        {JOB_ROWS.map((job) => (
          <div key={job.role} className="ww-preview-job">
            <span className="ww-preview-dot" />
            <div>
              <span className="ww-preview-title">{job.role}</span>
              <span className="ww-preview-muted">{job.company}</span>
            </div>
            <span className="ww-preview-pill">{job.meta}</span>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'companies') {
    return (
      <div className="ww-preview-dashboard">
        <div className="ww-preview-sidebar">
          <span />
          <span />
          <span />
        </div>
        <div className="ww-preview-main">
          <div className="ww-preview-chart">
            <span />
            <span />
            <span />
            <span />
          </div>
          <div className="ww-preview-bars">
            <span />
            <span />
          </div>
        </div>
      </div>
    );
  }

  if (type === 'profile') {
    return (
      <div className="ww-preview-profile">
        <div className="ww-preview-avatar">
          <UserRound size={28} />
        </div>
        <div className="ww-preview-profile-lines">
          <span />
          <span />
          <span />
        </div>
        <div className="ww-preview-skills">
          <span>React</span>
          <span>SQL</span>
          <span>Ops</span>
        </div>
      </div>
    );
  }

  return (
    <div className="ww-preview-alerts">
      {[CalendarClock, Clock3, Check].map((Icon, index) => (
        <div key={index} className="ww-preview-alert">
          <Icon size={17} />
          <span />
        </div>
      ))}
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      <style jsx global>{`
        .ww-landing {
          --ww-bg: #10131c;
          --ww-bg-soft: rgba(255, 255, 255, 0.04);
          --ww-panel: rgba(255, 255, 255, 0.075);
          --ww-panel-strong: rgba(255, 255, 255, 0.11);
          --ww-text: #f8fafc;
          --ww-heading: #f8fafc;
          --ww-muted: #cbd5e1;
          --ww-muted-soft: #94a3b8;
          --ww-border: rgba(226, 232, 240, 0.16);
          --ww-border-strong: rgba(103, 232, 249, 0.42);
          --ww-accent: #67e8f9;
          --ww-accent-strong: #22d3ee;
          --ww-purple: #c4b5fd;
          --ww-shadow: 0 24px 60px rgba(0, 0, 0, 0.35);
          --ww-brand-gradient: linear-gradient(135deg, #67e8f9, #c4b5fd);
          min-height: calc(100vh - 4rem);
          overflow: hidden;
          background:
            radial-gradient(circle at 16% 8%, rgba(34, 211, 238, 0.14), transparent 29rem),
            radial-gradient(circle at 86% 5%, rgba(139, 92, 246, 0.14), transparent 27rem),
            var(--ww-bg);
          color: var(--ww-text);
        }

        .ww-loader {
          --ww-bg: #10131c;
          --ww-heading: #f8fafc;
          --ww-accent: #67e8f9;
          --ww-brand-gradient: linear-gradient(135deg, #67e8f9, #c4b5fd);
          position: fixed;
          inset: 0;
          z-index: 80;
          overflow: hidden;
          pointer-events: none;
          background:
            radial-gradient(circle at 50% 48%, rgba(34, 211, 238, 0.18), transparent 18rem),
            radial-gradient(circle at 60% 51%, rgba(139, 92, 246, 0.18), transparent 20rem),
            linear-gradient(135deg, #0d1b2a 0%, #10131c 48%, #1c1635 100%),
            var(--ww-bg);
          animation: wwLoaderVeil 2.95s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }

        .ww-loader-brand {
          --ww-loader-left: max(1rem, calc((100vw - 1280px) / 2 + 2rem));
          position: fixed;
          left: 50%;
          top: 50%;
          display: inline-flex;
          align-items: center;
          gap: 0.85rem;
          transform: translate(-50%, -50%) scale(1.08);
          transform-origin: left center;
          animation: wwLoaderBrand 1.05s 1.28s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }

        .ww-loader-logo {
          display: grid;
          width: 4rem;
          height: 4rem;
          place-items: center;
          border-radius: 1.25rem;
          background: var(--ww-brand-gradient);
          color: #ffffff;
          font-size: 1.6rem;
          font-weight: 900;
          box-shadow: 0 24px 70px rgba(34, 211, 238, 0.34);
          animation:
            wwLogoPop 380ms cubic-bezier(0.22, 1, 0.36, 1) both,
            wwLogoBreath 780ms 380ms ease-in-out infinite alternate;
        }

        .ww-loader-name {
          display: inline-flex;
          align-items: center;
          gap: 0.01em;
          background: var(--ww-brand-gradient);
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          color: var(--ww-heading);
          font-size: clamp(2rem, 4vw, 2.7rem);
          font-weight: 900;
          letter-spacing: 0;
          white-space: nowrap;
        }

        .ww-loader-name span {
          display: inline-block;
          background: var(--ww-brand-gradient);
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          color: var(--ww-heading);
          opacity: 0;
          transform: translateY(0.35em);
          animation: wwTypeLetter 120ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }

        .ww-loader-name span:nth-child(1) { animation-delay: 220ms; }
        .ww-loader-name span:nth-child(2) { animation-delay: 300ms; }
        .ww-loader-name span:nth-child(3) { animation-delay: 380ms; }
        .ww-loader-name span:nth-child(4) { animation-delay: 460ms; }
        .ww-loader-name span:nth-child(5) { animation-delay: 540ms; }
        .ww-loader-name span:nth-child(6) { animation-delay: 620ms; }
        .ww-loader-name span:nth-child(7) { animation-delay: 700ms; }
        .ww-loader-name span:nth-child(8) { animation-delay: 780ms; }

        .ww-loader-name::after {
          content: '';
          width: 0.08em;
          height: 0.95em;
          margin-left: 0.08em;
          border-radius: 999px;
          background: var(--ww-accent);
          box-shadow: 0 0 18px rgba(103, 232, 249, 0.55);
          animation:
            wwCaretBlink 520ms steps(1, end) infinite,
            wwCaretOut 180ms 1.08s ease-out forwards;
        }

        html:not(.dark) .ww-landing {
          --ww-bg: #ffffff;
          --ww-bg-soft: rgba(15, 23, 42, 0.035);
          --ww-panel: rgba(255, 255, 255, 0.88);
          --ww-panel-strong: rgba(248, 250, 252, 0.96);
          --ww-text: #0f172a;
          --ww-heading: #0b1220;
          --ww-muted: #475569;
          --ww-muted-soft: #64748b;
          --ww-border: rgba(15, 23, 42, 0.12);
          --ww-border-strong: rgba(8, 145, 178, 0.36);
          --ww-accent: #0e7490;
          --ww-accent-strong: #0891b2;
          --ww-purple: #6d28d9;
          --ww-shadow: 0 18px 52px rgba(15, 23, 42, 0.1);
          --ww-brand-gradient: linear-gradient(135deg, #0891b2, #7c3aed);
          background:
            radial-gradient(circle at 16% 8%, rgba(8, 145, 178, 0.12), transparent 29rem),
            radial-gradient(circle at 86% 5%, rgba(124, 58, 237, 0.12), transparent 27rem),
            var(--ww-bg);
        }

        html:not(.dark) .ww-loader {
          --ww-bg: #ffffff;
          --ww-heading: #0b1220;
          --ww-accent: #0e7490;
          --ww-brand-gradient: linear-gradient(135deg, #0891b2, #7c3aed);
          background:
            radial-gradient(circle at 50% 48%, rgba(8, 145, 178, 0.15), transparent 18rem),
            radial-gradient(circle at 60% 51%, rgba(124, 58, 237, 0.15), transparent 20rem),
            linear-gradient(135deg, #f8fafc 0%, #eefaff 48%, #f4f0ff 100%),
            var(--ww-bg);
        }

        .ww-landing-shell {
          width: min(100% - 2rem, 1280px);
          margin: 0 auto;
          padding: 4.25rem 0 7rem;
          opacity: 0;
          animation: wwShellReveal 0.65s 2.58s ease-out forwards;
        }

        .ww-reference-hero {
          display: flex;
          min-height: 34rem;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
        }

        .ww-announce {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          margin-bottom: 2rem;
          padding: 0.35rem 0.85rem 0.35rem 0.42rem;
          border: 1px solid var(--ww-border);
          border-radius: 999px;
          background: var(--ww-bg-soft);
          color: var(--ww-muted);
          font-size: 0.82rem;
          font-weight: 600;
          box-shadow: var(--ww-shadow);
          backdrop-filter: blur(16px);
          animation: wwFadeUp 0.62s 2.68s ease-out both;
        }

        .ww-announce strong {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          border-radius: 999px;
          background: var(--ww-brand-gradient);
          color: #ffffff;
          padding: 0.25rem 0.55rem;
          font-size: 0.75rem;
        }

        .ww-reference-title {
          max-width: 850px;
          color: var(--ww-heading);
          font-size: clamp(2.75rem, 7vw, 5.9rem);
          font-weight: 900;
          line-height: 0.96;
          letter-spacing: 0;
          animation: wwTitleReveal 0.78s 2.8s cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        .ww-reference-title span {
          display: block;
          background: var(--ww-brand-gradient);
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .ww-reference-copy {
          max-width: 640px;
          margin: 1.25rem auto 0;
          color: var(--ww-muted);
          font-size: clamp(1rem, 2vw, 1.18rem);
          line-height: 1.75;
          animation: wwFadeUp 0.62s 2.98s ease-out both;
        }

        .ww-hero-actions {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 1rem;
          margin-top: 2rem;
          animation: wwFadeUp 0.62s 3.12s ease-out both;
        }

        .ww-action {
          display: inline-flex;
          min-height: 3rem;
          align-items: center;
          justify-content: center;
          gap: 0.55rem;
          border-radius: 0.75rem;
          padding: 0 1.4rem;
          font-size: 0.94rem;
          font-weight: 800;
          text-decoration: none;
          transition: transform 180ms ease, border-color 180ms ease, background 180ms ease, box-shadow 180ms ease;
        }

        .ww-action:hover {
          transform: translateY(-2px);
        }

        .ww-action-primary {
          background: var(--ww-brand-gradient);
          color: #ffffff;
          box-shadow: 0 16px 42px rgba(34, 211, 238, 0.22);
        }

        .ww-action-primary svg {
          animation: wwArrowNudge 1.6s 1.6s ease-in-out infinite;
        }

        .ww-action-secondary {
          border: 1px solid var(--ww-border);
          background: var(--ww-panel);
          color: var(--ww-heading);
        }

        .ww-action-secondary:hover {
          border-color: var(--ww-border-strong);
          background: var(--ww-panel-strong);
        }

        .ww-signal-row {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 1.1rem;
          margin-top: 2rem;
          color: var(--ww-muted-soft);
          animation: wwFadeUp 0.62s 3.26s ease-out both;
        }

        .ww-signal {
          display: inline-flex;
          align-items: center;
          gap: 0.42rem;
          font-size: 0.78rem;
          font-weight: 800;
          text-transform: uppercase;
        }

        .ww-signal svg {
          color: var(--ww-accent);
          animation: wwSignalGlow 2.4s ease-in-out infinite;
        }

        .ww-tile-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 1.35rem;
          margin-top: 1.5rem;
        }

        .ww-feature-tile {
          min-height: 16rem;
          border: 1px solid var(--ww-border);
          border-radius: 0.9rem;
          background: var(--ww-panel);
          box-shadow: var(--ww-shadow);
          overflow: hidden;
          transition: transform 220ms ease, border-color 220ms ease, background 220ms ease;
          animation: wwTileReveal 0.72s cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        .ww-feature-tile:nth-child(1) { animation-delay: 3.42s; }
        .ww-feature-tile:nth-child(2) { animation-delay: 3.5s; }
        .ww-feature-tile:nth-child(3) { animation-delay: 3.58s; }
        .ww-feature-tile:nth-child(4) { animation-delay: 3.66s; }

        .ww-feature-tile:hover {
          transform: translateY(-5px);
          border-color: var(--ww-border-strong);
          background: var(--ww-panel-strong);
        }

        .ww-tile-heading {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          padding: 1.15rem 1.25rem 0;
          color: var(--ww-heading);
        }

        .ww-tile-heading h2 {
          font-size: 1.05rem;
          font-weight: 900;
        }

        .ww-tile-heading svg {
          color: var(--ww-accent);
        }

        .ww-tile-subtitle {
          padding: 0.5rem 1.25rem 0;
          color: var(--ww-muted);
          font-size: 0.88rem;
          line-height: 1.55;
        }

        .ww-tile-preview {
          padding: 1.1rem 1.25rem 1.25rem;
        }

        .ww-preview-list,
        .ww-preview-alerts {
          display: grid;
          gap: 0.7rem;
        }

        .ww-preview-job,
        .ww-preview-alert {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          min-height: 3rem;
          border: 1px solid var(--ww-border);
          border-radius: 0.7rem;
          background: rgba(255, 255, 255, 0.04);
          padding: 0.7rem;
        }

        html:not(.dark) .ww-preview-job,
        html:not(.dark) .ww-preview-alert {
          background: rgba(15, 23, 42, 0.035);
        }

        .ww-preview-dot {
          width: 0.75rem;
          height: 0.75rem;
          flex: 0 0 auto;
          border-radius: 999px;
          background: var(--ww-brand-gradient);
          animation: wwDotPulse 1.9s ease-in-out infinite;
        }

        .ww-preview-title,
        .ww-preview-muted {
          display: block;
        }

        .ww-preview-title {
          color: var(--ww-heading);
          font-size: 0.8rem;
          font-weight: 850;
        }

        .ww-preview-muted {
          color: var(--ww-muted-soft);
          font-size: 0.72rem;
        }

        .ww-preview-pill {
          margin-left: auto;
          border-radius: 999px;
          background: rgba(34, 211, 238, 0.14);
          color: var(--ww-accent);
          padding: 0.25rem 0.48rem;
          font-size: 0.66rem;
          font-weight: 850;
        }

        .ww-preview-dashboard {
          display: grid;
          min-height: 10rem;
          grid-template-columns: 0.52fr 1fr;
          gap: 0.75rem;
        }

        .ww-preview-sidebar,
        .ww-preview-main,
        .ww-preview-chart,
        .ww-preview-profile,
        .ww-preview-alerts {
          border: 1px solid var(--ww-border);
          border-radius: 0.85rem;
          background: rgba(255, 255, 255, 0.04);
        }

        html:not(.dark) .ww-preview-sidebar,
        html:not(.dark) .ww-preview-main,
        html:not(.dark) .ww-preview-chart,
        html:not(.dark) .ww-preview-profile,
        html:not(.dark) .ww-preview-alerts {
          background: rgba(15, 23, 42, 0.035);
        }

        .ww-preview-sidebar {
          padding: 1rem 0.7rem;
        }

        .ww-preview-sidebar span,
        .ww-preview-profile-lines span,
        .ww-preview-alert span,
        .ww-preview-bars span {
          display: block;
          height: 0.5rem;
          border-radius: 999px;
          background: rgba(203, 213, 225, 0.36);
        }

        html:not(.dark) .ww-preview-sidebar span,
        html:not(.dark) .ww-preview-profile-lines span,
        html:not(.dark) .ww-preview-alert span,
        html:not(.dark) .ww-preview-bars span {
          background: rgba(15, 23, 42, 0.16);
        }

        .ww-preview-sidebar span + span {
          margin-top: 0.8rem;
        }

        .ww-preview-sidebar span:nth-child(1) { width: 58%; }
        .ww-preview-sidebar span:nth-child(2) { width: 86%; }
        .ww-preview-sidebar span:nth-child(3) { width: 70%; }

        .ww-preview-main {
          display: grid;
          gap: 0.75rem;
          padding: 0.75rem;
        }

        .ww-preview-chart {
          display: flex;
          align-items: end;
          gap: 0.5rem;
          min-height: 5.4rem;
          padding: 0.75rem;
        }

        .ww-preview-chart span {
          width: 100%;
          border-radius: 0.4rem 0.4rem 0 0;
          background: var(--ww-brand-gradient);
          opacity: 0.72;
          transform-origin: bottom;
          animation: wwChartBeat 2.4s ease-in-out infinite;
        }

        .ww-preview-chart span:nth-child(1) { height: 34%; }
        .ww-preview-chart span:nth-child(2) { height: 62%; animation-delay: 160ms; }
        .ww-preview-chart span:nth-child(3) { height: 46%; animation-delay: 320ms; }
        .ww-preview-chart span:nth-child(4) { height: 82%; animation-delay: 480ms; }

        .ww-preview-bars {
          display: grid;
          gap: 0.48rem;
        }

        .ww-preview-bars span:nth-child(1) { width: 86%; }
        .ww-preview-bars span:nth-child(2) { width: 62%; }

        .ww-preview-profile {
          display: grid;
          place-items: center;
          gap: 0.85rem;
          min-height: 10rem;
          padding: 1rem;
        }

        .ww-preview-avatar {
          display: grid;
          width: 3.75rem;
          height: 3.75rem;
          place-items: center;
          border-radius: 999px;
          background: var(--ww-brand-gradient);
          color: #ffffff;
          animation: wwSoftFloat 3.2s ease-in-out infinite;
        }

        .ww-preview-profile-lines {
          width: min(100%, 10rem);
        }

        .ww-preview-profile-lines span {
          margin: 0.45rem auto 0;
        }

        .ww-preview-profile-lines span:nth-child(1) { width: 80%; }
        .ww-preview-profile-lines span:nth-child(2) { width: 60%; }
        .ww-preview-profile-lines span:nth-child(3) { width: 70%; }

        .ww-preview-skills {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 0.4rem;
        }

        .ww-preview-skills span {
          border-radius: 999px;
          background: rgba(139, 92, 246, 0.16);
          color: var(--ww-purple);
          padding: 0.25rem 0.5rem;
          font-size: 0.68rem;
          font-weight: 850;
        }

        .ww-preview-alerts {
          padding: 0.8rem;
        }

        .ww-preview-alert {
          min-height: 2.8rem;
          animation: wwAlertLift 3s ease-in-out infinite;
        }

        .ww-preview-alert:nth-child(2) { animation-delay: 160ms; }
        .ww-preview-alert:nth-child(3) { animation-delay: 320ms; }

        .ww-preview-alert svg {
          color: var(--ww-accent);
        }

        .ww-preview-alert span {
          flex: 1;
        }

        .ww-preview-alert:nth-child(1) span { max-width: 78%; }
        .ww-preview-alert:nth-child(2) span { max-width: 60%; }
        .ww-preview-alert:nth-child(3) span { max-width: 86%; }

        .ww-command-strip {
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 1.35rem;
          margin-top: 1.35rem;
        }

        .ww-command-panel {
          border: 1px solid var(--ww-border);
          border-radius: 0.9rem;
          background: var(--ww-panel);
          box-shadow: var(--ww-shadow);
          padding: 1.25rem;
          animation: wwTileReveal 0.72s 3.82s cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        .ww-command-panel:nth-child(2) {
          animation-delay: 3.9s;
        }

        .ww-command-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          color: var(--ww-muted);
          font-size: 0.8rem;
          font-weight: 800;
          text-transform: uppercase;
        }

        .ww-command-body {
          display: grid;
          gap: 0.75rem;
          margin-top: 1rem;
        }

        .ww-command-item {
          display: flex;
          align-items: center;
          gap: 0.7rem;
          border: 1px solid var(--ww-border);
          border-radius: 0.75rem;
          background: rgba(255, 255, 255, 0.035);
          padding: 0.82rem;
          color: var(--ww-heading);
          font-size: 0.9rem;
          font-weight: 800;
        }

        html:not(.dark) .ww-command-item {
          background: rgba(15, 23, 42, 0.035);
        }

        .ww-command-item svg {
          color: var(--ww-accent);
        }

        .ww-command-item span {
          margin-left: auto;
          color: var(--ww-muted-soft);
          font-size: 0.78rem;
        }

        @keyframes wwLoaderVeil {
          0%, 86% {
            opacity: 1;
            visibility: visible;
          }
          100% {
            opacity: 0;
            visibility: hidden;
          }
        }

        @keyframes wwLoaderBrand {
          0% {
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%) scale(1.08);
          }
          100% {
            left: var(--ww-loader-left);
            top: 2rem;
            transform: translate(0, -50%) scale(0.62);
          }
        }

        @keyframes wwLogoPop {
          from {
            opacity: 0;
            transform: scale(0.72);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes wwLogoBreath {
          from {
            box-shadow: 0 18px 54px rgba(34, 211, 238, 0.22);
          }
          to {
            box-shadow: 0 26px 76px rgba(139, 92, 246, 0.36);
          }
        }

        @keyframes wwTypeLetter {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes wwCaretBlink {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0;
          }
        }

        @keyframes wwCaretOut {
          to {
            opacity: 0;
            transform: scaleY(0.65);
          }
        }

        @keyframes wwShellReveal {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes wwTitleReveal {
          from {
            opacity: 0;
            filter: blur(10px);
            transform: translateY(22px) scale(0.985);
          }
          to {
            opacity: 1;
            filter: blur(0);
            transform: translateY(0) scale(1);
          }
        }

        @keyframes wwTileReveal {
          from {
            opacity: 0;
            filter: blur(8px);
            transform: translateY(24px) scale(0.985);
          }
          to {
            opacity: 1;
            filter: blur(0);
            transform: translateY(0) scale(1);
          }
        }

        @keyframes wwArrowNudge {
          0%, 100% {
            transform: translateX(0);
          }
          50% {
            transform: translateX(4px);
          }
        }

        @keyframes wwSignalGlow {
          0%, 100% {
            opacity: 0.75;
            transform: translateY(0);
          }
          50% {
            opacity: 1;
            transform: translateY(-1px);
          }
        }

        @keyframes wwDotPulse {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(103, 232, 249, 0);
            transform: scale(1);
          }
          50% {
            box-shadow: 0 0 0 0.35rem rgba(103, 232, 249, 0.12);
            transform: scale(1.08);
          }
        }

        @keyframes wwChartBeat {
          0%, 100% {
            transform: scaleY(0.9);
            opacity: 0.58;
          }
          50% {
            transform: scaleY(1);
            opacity: 0.82;
          }
        }

        @keyframes wwSoftFloat {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-6px);
          }
        }

        @keyframes wwAlertLift {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-3px);
          }
        }

        @keyframes wwFadeUp {
          from {
            opacity: 0;
            transform: translateY(18px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 1024px) {
          .ww-tile-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .ww-command-strip {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 640px) {
          .ww-loader-brand {
            --ww-loader-left: 1rem;
          }

          .ww-landing-shell {
            width: min(100% - 1.25rem, 1280px);
            padding: 3rem 0 5rem;
          }

          .ww-reference-hero {
            min-height: 31rem;
          }

          .ww-reference-title {
            font-size: clamp(2.45rem, 15vw, 4.6rem);
          }

          .ww-hero-actions {
            width: 100%;
          }

          .ww-action {
            width: 100%;
          }

          .ww-signal-row {
            gap: 0.85rem;
          }

          .ww-tile-grid {
            grid-template-columns: 1fr;
          }

          .ww-feature-tile {
            min-height: auto;
          }

          .ww-command-item {
            align-items: flex-start;
            flex-wrap: wrap;
          }

          .ww-command-item span {
            width: 100%;
            margin-left: 2rem;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .ww-loader {
            display: none;
          }

          .ww-loader,
          .ww-loader-brand,
          .ww-loader-logo,
          .ww-loader-name,
          .ww-loader-name span,
          .ww-loader-name::after,
          .ww-landing-shell,
          .ww-announce,
          .ww-reference-title,
          .ww-reference-copy,
          .ww-hero-actions,
          .ww-signal-row,
          .ww-feature-tile,
          .ww-command-panel,
          .ww-action-primary svg,
          .ww-signal svg,
          .ww-preview-dot,
          .ww-preview-chart span,
          .ww-preview-avatar,
          .ww-preview-alert {
            animation: none;
          }

          .ww-landing-shell,
          .ww-announce,
          .ww-reference-title,
          .ww-reference-copy,
          .ww-hero-actions,
          .ww-signal-row,
          .ww-feature-tile,
          .ww-command-panel {
            opacity: 1;
            transform: none;
          }
        }
      `}</style>

      <div className="ww-loader" aria-hidden="true">
        <div className="ww-loader-brand">
          <span className="ww-loader-logo">W</span>
          <span className="ww-loader-name">
            <span>W</span>
            <span>o</span>
            <span>r</span>
            <span>k</span>
            <span>W</span>
            <span>a</span>
            <span>v</span>
            <span>e</span>
          </span>
        </div>
      </div>

      <div className="ww-landing">
        <div className="ww-landing-shell">
          <section className="ww-reference-hero" aria-labelledby="landing-title">
            <div className="ww-announce">
              <strong>
                <Sparkles size={13} />
                New
              </strong>
              Faster local job matching is live
            </div>

            <h1 id="landing-title" className="ww-reference-title">
              Find your next role
              <span>with less noise</span>
            </h1>

            <p className="ww-reference-copy">
              WorkWave brings local jobs, verified companies, clear salary signals, and application tracking into one focused workspace.
            </p>

            <div className="ww-hero-actions">
              <Link href="/jobs" className="ww-action ww-action-primary">
                Browse Jobs
                <ArrowRight size={18} />
              </Link>
              <Link href="/companies" className="ww-action ww-action-secondary">
                Explore Companies
              </Link>
            </div>

            <div className="ww-signal-row" aria-label="WorkWave platform highlights">
              {SIGNALS.map(({ icon: Icon, label }) => (
                <span key={label} className="ww-signal">
                  <Icon size={18} />
                  {label}
                </span>
              ))}
            </div>
          </section>

          <section className="ww-tile-grid" aria-label="WorkWave feature previews">
            {FEATURE_TILES.map(({ title, subtitle, icon: Icon, preview }) => (
              <article key={title} className="ww-feature-tile">
                <div className="ww-tile-heading">
                  <h2>{title}</h2>
                  <Icon size={21} />
                </div>
                <p className="ww-tile-subtitle">{subtitle}</p>
                <div className="ww-tile-preview">
                  <TilePreview type={preview} />
                </div>
              </article>
            ))}
          </section>

          <section className="ww-command-strip" aria-label="Primary WorkWave workflows">
            <div className="ww-command-panel">
              <div className="ww-command-header">
                <span>For job seekers</span>
                <Star size={18} />
              </div>
              <div className="ww-command-body">
                <div className="ww-command-item">
                  <SlidersHorizontal size={18} />
                  Filter by location, salary, and work model
                  <span>Fast search</span>
                </div>
                <div className="ww-command-item">
                  <FileText size={18} />
                  Save a profile and apply without rebuilding forms
                  <span>One profile</span>
                </div>
              </div>
            </div>

            <div className="ww-command-panel">
              <div className="ww-command-header">
                <span>For employers</span>
                <Zap size={18} />
              </div>
              <div className="ww-command-body">
                <div className="ww-command-item">
                  <BriefcaseBusiness size={18} />
                  Post roles and review applicants in one dashboard
                  <span>Hiring flow</span>
                </div>
                <div className="ww-command-item">
                  <MessageSquare size={18} />
                  Keep candidate communication close to the role
                  <span>Direct thread</span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
