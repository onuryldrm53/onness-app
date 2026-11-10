import React, { useState } from 'react';
import { Language } from '../types';

interface ExerciseVisualProps {
  postureId: string;
  name: string;
  target?: string;
  customPhotoUrl?: string;
  variant?: 'thumb' | 'hero';
  className?: string;
  lang?: Language;
}

export const ExerciseVisual: React.FC<ExerciseVisualProps> = ({
  postureId,
  name,
  target,
  customPhotoUrl,
  variant = 'thumb',
  className = '',
  lang = 'tr'
}) => {
  const [gifFailed, setGifFailed] = useState(false);

  // If user uploaded a custom photo, display it
  if (customPhotoUrl) {
    return (
      <div className={`relative w-full h-full overflow-hidden bg-[#080f18] touch-pan-y ${className}`}>
        <img
          src={customPhotoUrl}
          alt={name}
          className="w-full h-full object-cover object-[center_35%]"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#101926]/90 via-[#101926]/20 to-transparent pointer-events-none" />
      </div>
    );
  }

  const isHero = variant === 'hero';
  const gifSrc = `/exercises/${postureId}.gif`;

  // Display matched SmartWorkout demonstration GIF
  if (!gifFailed) {
    return (
      <div className={`relative w-full h-full overflow-hidden bg-[#141a22] flex items-center justify-center select-none touch-pan-y ${className}`}>
        <img
          src={gifSrc}
          alt={name}
          className={`w-full h-full ${isHero ? 'object-contain' : 'object-cover'} object-center block`}
          loading="lazy"
          onError={() => setGifFailed(true)}
        />
        {/* Subtle vignette gradient in hero view */}
        {isHero && (
          <div className="absolute inset-0 bg-gradient-to-t from-[#101926] via-transparent to-transparent pointer-events-none opacity-80" />
        )}
      </div>
    );
  }

  // Fallback to high-detail anatomical SVG graphic if GIF fails to load
  const renderSvgGraphic = () => {
    switch (postureId) {
      // 1. PIKE PUSH-UP
      case 'pike':
        return (
          <svg viewBox="0 0 320 180" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="pikeBg" x1="0" y1="0" x2="320" y2="180" gradientUnits="userSpaceOnUse">
                <stop stopColor="#08101a" />
                <stop offset="1" stopColor="#0f1f17" />
              </linearGradient>
              <filter id="deltsGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>
            <rect width="320" height="180" fill="url(#pikeBg)" />
            {/* Ground grid */}
            <line x1="30" y1="150" x2="290" y2="150" stroke="#1c2c22" strokeWidth="2" strokeDasharray="4 4" />
            <line x1="100" y1="150" x2="140" y2="150" stroke="#759667" strokeWidth="3" strokeLinecap="round" />
            <line x1="220" y1="150" x2="250" y2="150" stroke="#759667" strokeWidth="3" strokeLinecap="round" />

            {/* Inverted V Figure */}
            {/* Feet */}
            <circle cx="235" cy="148" r="4" fill="#a4b89d" />
            {/* Legs */}
            <path d="M235 148 L175 65" stroke="#a4b89d" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
            {/* Hip Apex */}
            <circle cx="175" cy="65" r="9" fill="#759667" />
            {/* Torso descending */}
            <path d="M175 65 L125 118" stroke="#e2eaf4" strokeWidth="8" strokeLinecap="round" />
            {/* Target Deltoid Glow (Shoulder) */}
            <circle cx="125" cy="118" r="10" fill="#759667" filter="url(#deltsGlow)" />
            <circle cx="125" cy="118" r="6" fill="#b9e3a6" />
            {/* Head dipped forward between hands */}
            <circle cx="112" cy="132" r="7" fill="#cbd5e1" />
            {/* Arms planted to floor */}
            <path d="M125 118 L118 150" stroke="#759667" strokeWidth="6" strokeLinecap="round" />

            {/* Force & Angle indicators */}
            <path d="M165 75 A 30 30 0 0 1 185 85" stroke="#759667" strokeWidth="2" strokeDasharray="2 2" />
            <text x="190" y="80" fill="#759667" fontSize="10" fontWeight="bold">90° V</text>
            <path d="M112 110 L102 125" stroke="#92b683" strokeWidth="2" markerEnd="url(#arrow)" />
            <text x="50" y="125" fill="#759667" fontSize="10" fontWeight="bold">OMUZ İTİŞİ</text>
          </svg>
        );

      // 2. CHAIR / BENCH TRICEPS DIPS
      case 'dips':
        return (
          <svg viewBox="0 0 320 180" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="dipsBg" x1="0" y1="0" x2="320" y2="180" gradientUnits="userSpaceOnUse">
                <stop stopColor="#09111c" />
                <stop offset="1" stopColor="#142419" />
              </linearGradient>
              <filter id="tricepsGlow">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>
            <rect width="320" height="180" fill="url(#dipsBg)" />
            <line x1="30" y1="150" x2="290" y2="150" stroke="#1c2c22" strokeWidth="2" strokeDasharray="4 4" />

            {/* Bench / Chair Prop */}
            <rect x="70" y="95" width="65" height="10" rx="3" fill="#243447" stroke="#759667" strokeWidth="1.5" />
            <rect x="75" y="105" width="8" height="45" fill="#1b2838" />
            <rect x="120" y="105" width="8" height="45" fill="#1b2838" />

            {/* Hands on Bench edge */}
            <circle cx="132" cy="95" r="4.5" fill="#759667" />
            {/* Forearm vertical up to elbow */}
            <path d="M132 95 L145 92" stroke="#a4b89d" strokeWidth="6" strokeLinecap="round" />
            {/* Elbow 90 degrees */}
            <circle cx="145" cy="92" r="5" fill="#e2eaf4" />
            {/* Upper arm (Triceps target glow) */}
            <path d="M145 92 L152 70" stroke="#759667" strokeWidth="8" strokeLinecap="round" filter="url(#tricepsGlow)" />
            <path d="M145 92 L152 70" stroke="#b9e3a6" strokeWidth="4" strokeLinecap="round" />
            {/* Shoulder */}
            <circle cx="152" cy="70" r="7" fill="#759667" />
            {/* Head */}
            <circle cx="152" cy="52" r="8" fill="#cbd5e1" />
            {/* Upright Torso close to bench */}
            <path d="M152 70 L154 115" stroke="#e2eaf4" strokeWidth="8" strokeLinecap="round" />
            {/* Hips & Legs extended forward */}
            <circle cx="154" cy="115" r="7" fill="#759667" />
            <path d="M154 115 L195 130 L235 150" stroke="#a4b89d" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="235" cy="150" r="4.5" fill="#cbd5e1" />

            {/* 90-degree callout */}
            <path d="M138 90 L145 90 L145 83" stroke="#759667" strokeWidth="2" fill="none" />
            <text x="160" y="85" fill="#759667" fontSize="10" fontWeight="bold">90° TRICEPS</text>
            <path d="M155 125 L155 105" stroke="#92b683" strokeWidth="2" strokeDasharray="2 2" />
          </svg>
        );

      // 3. DIAMOND PUSH-UP
      case 'diamond':
        return (
          <svg viewBox="0 0 320 180" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="diamondBg" x1="0" y1="0" x2="320" y2="180" gradientUnits="userSpaceOnUse">
                <stop stopColor="#08101a" />
                <stop offset="1" stopColor="#15261b" />
              </linearGradient>
              <filter id="diamondGlow">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>
            <rect width="320" height="180" fill="url(#diamondBg)" />
            <line x1="30" y1="150" x2="290" y2="150" stroke="#1c2c22" strokeWidth="2" strokeDasharray="4 4" />

            {/* Plank silhouette */}
            {/* Feet */}
            <circle cx="245" cy="146" r="4.5" fill="#a4b89d" />
            {/* Legs & Torso in straight alignment */}
            <path d="M245 146 L180 125 L115 105" stroke="#e2eaf4" strokeWidth="8" strokeLinecap="round" />
            {/* Head */}
            <circle cx="95" cy="98" r="8" fill="#cbd5e1" />
            {/* Arms descending to diamond grip */}
            <path d="M115 105 L125 125 L135 150" stroke="#759667" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
            {/* Triceps & Chest activation highlight */}
            <circle cx="125" cy="108" r="9" fill="#759667" filter="url(#diamondGlow)" />
            <circle cx="125" cy="108" r="5" fill="#b9e3a6" />

            {/* Diamond Hand Symbol Overlay */}
            <g transform="translate(135, 142)">
              <polygon points="0,-8 7,0 0,8 -7,0" fill="#759667" stroke="#b9e3a6" strokeWidth="1.5" />
            </g>
            <text x="155" y="152" fill="#759667" fontSize="10" fontWeight="bold">ELMAS TUTUŞ (◇)</text>
            <text x="60" y="80" fill="#92b683" fontSize="10" fontWeight="bold">İÇ GÖĞÜS & ARKA KOL</text>
          </svg>
        );

      // 4. FLOOR TOWEL ROW
      case 'row':
        return (
          <svg viewBox="0 0 320 180" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="rowBg" x1="0" y1="0" x2="320" y2="180" gradientUnits="userSpaceOnUse">
                <stop stopColor="#08101a" />
                <stop offset="1" stopColor="#122218" />
              </linearGradient>
              <filter id="latGlow">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>
            <rect width="320" height="180" fill="url(#rowBg)" />
            <line x1="30" y1="140" x2="290" y2="140" stroke="#1c2c22" strokeWidth="2" strokeDasharray="4 4" />

            {/* Prone body on floor */}
            <path d="M240 135 L170 130 L115 125" stroke="#e2eaf4" strokeWidth="8" strokeLinecap="round" />
            {/* Feet */}
            <circle cx="240" cy="135" r="4" fill="#a4b89d" />
            {/* Head lifted slightly */}
            <circle cx="98" cy="115" r="7.5" fill="#cbd5e1" />
            {/* Glowing Lats (Back Wings) */}
            <ellipse cx="145" cy="122" rx="16" ry="9" fill="#759667" filter="url(#latGlow)" transform="rotate(-5 145 122)" />
            <ellipse cx="145" cy="122" rx="10" ry="5" fill="#b9e3a6" transform="rotate(-5 145 122)" />

            {/* Arms pulled back with towel */}
            <path d="M125 122 L110 108 L90 120" stroke="#a4b89d" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
            {/* Towel stretched tight */}
            <path d="M85 118 L95 122" stroke="#759667" strokeWidth="4" strokeLinecap="round" />
            {/* Tension Arrows */}
            <path d="M80 108 L70 108" stroke="#759667" strokeWidth="2" />
            <path d="M100 108 L110 108" stroke="#759667" strokeWidth="2" />
            <text x="140" y="95" fill="#759667" fontSize="10" fontWeight="bold">KANAT KASLARI (LATS)</text>
            <text x="45" y="145" fill="#92b683" fontSize="9" fontWeight="bold">◄ GERİLİM İLE ÇEKİŞ ►</text>
          </svg>
        );

      // 5. SUPERMAN HOLD
      case 'superman':
        return (
          <svg viewBox="0 0 320 180" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="superBg" x1="0" y1="0" x2="320" y2="180" gradientUnits="userSpaceOnUse">
                <stop stopColor="#08101a" />
                <stop offset="1" stopColor="#142419" />
              </linearGradient>
              <filter id="superGlow">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>
            <rect width="320" height="180" fill="url(#superBg)" />
            {/* Floor baseline */}
            <line x1="30" y1="145" x2="290" y2="145" stroke="#1c2c22" strokeWidth="2" strokeDasharray="4 4" />

            {/* Arched body (belly touching floor, extremities arched up) */}
            {/* Lower Back & Glutes glow */}
            <circle cx="160" cy="130" r="14" fill="#759667" filter="url(#superGlow)" />
            <circle cx="160" cy="130" r="8" fill="#b9e3a6" />

            {/* Smooth arched curve from feet to hands */}
            <path d="M255 105 Q 160 145 65 105" stroke="#e2eaf4" strokeWidth="8" strokeLinecap="round" fill="none" />
            {/* Head */}
            <circle cx="95" cy="100" r="7.5" fill="#cbd5e1" />
            {/* Feet lifted */}
            <circle cx="255" cy="105" r="4.5" fill="#759667" />
            {/* Hands extended */}
            <circle cx="65" cy="105" r="4" fill="#759667" />

            {/* Upward elevation arrows */}
            <path d="M65 95 L65 80" stroke="#759667" strokeWidth="2" strokeDasharray="2 2" />
            <path d="M255 95 L255 80" stroke="#759667" strokeWidth="2" strokeDasharray="2 2" />
            <text x="125" y="80" fill="#759667" fontSize="10" fontWeight="bold">BEL & ALT SIRT YAYI</text>
            <text x="125" y="165" fill="#92b683" fontSize="9" fontWeight="bold">STATİK KAVİS TUTUŞU</text>
          </svg>
        );

      // 6. Y-T-W RAISES
      case 'ytw':
        return (
          <svg viewBox="0 0 320 180" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="ytwBg" x1="0" y1="0" x2="320" y2="180" gradientUnits="userSpaceOnUse">
                <stop stopColor="#08101a" />
                <stop offset="1" stopColor="#122017" />
              </linearGradient>
            </defs>
            <rect width="320" height="180" fill="url(#ytwBg)" />

            {/* 3 Letters demonstration cards */}
            {/* Y Card */}
            <g transform="translate(30, 35)">
              <rect width="80" height="110" rx="12" fill="#0c1724" stroke="#1f3226" />
              <text x="40" y="28" fill="#759667" fontSize="16" fontWeight="900" textAnchor="middle">Y</text>
              {/* Stick figure Y */}
              <circle cx="40" cy="50" r="6" fill="#cbd5e1" />
              <line x1="40" y1="56" x2="40" y2="85" stroke="#e2eaf4" strokeWidth="3" />
              <line x1="40" y1="62" x2="22" y2="40" stroke="#759667" strokeWidth="3" strokeLinecap="round" />
              <line x1="40" y1="62" x2="58" y2="40" stroke="#759667" strokeWidth="3" strokeLinecap="round" />
              <text x="40" y="100" fill="#a4b89d" fontSize="8" fontWeight="bold" textAnchor="middle">45° Üst Trapez</text>
            </g>

            {/* T Card */}
            <g transform="translate(120, 35)">
              <rect width="80" height="110" rx="12" fill="#0c1724" stroke="#759667" strokeWidth="1.5" />
              <text x="40" y="28" fill="#759667" fontSize="16" fontWeight="900" textAnchor="middle">T</text>
              <circle cx="40" cy="50" r="6" fill="#cbd5e1" />
              <line x1="40" y1="56" x2="40" y2="85" stroke="#e2eaf4" strokeWidth="3" />
              <line x1="40" y1="65" x2="16" y2="65" stroke="#759667" strokeWidth="3" strokeLinecap="round" />
              <line x1="40" y1="65" x2="64" y2="65" stroke="#759667" strokeWidth="3" strokeLinecap="round" />
              <text x="40" y="100" fill="#759667" fontSize="8" fontWeight="bold" textAnchor="middle">90° Arka Omuz</text>
            </g>

            {/* W Card */}
            <g transform="translate(210, 35)">
              <rect width="80" height="110" rx="12" fill="#0c1724" stroke="#1f3226" />
              <text x="40" y="28" fill="#759667" fontSize="16" fontWeight="900" textAnchor="middle">W</text>
              <circle cx="40" cy="50" r="6" fill="#cbd5e1" />
              <line x1="40" y1="56" x2="40" y2="85" stroke="#e2eaf4" strokeWidth="3" />
              <path d="M22 55 L30 70 L40 65 L50 70 L58 55" stroke="#759667" strokeWidth="3" fill="none" strokeLinecap="round" />
              <text x="40" y="100" fill="#a4b89d" fontSize="8" fontWeight="bold" textAnchor="middle">Kürek Kemiği</text>
            </g>

            <text x="160" y="165" fill="#759667" fontSize="10" fontWeight="bold" textAnchor="middle">ARKA OMUZ & POSTÜR AÇILARI</text>
          </svg>
        );

      // 7. FOREARM PLANK
      case 'plank':
        return (
          <svg viewBox="0 0 320 180" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="plankBg" x1="0" y1="0" x2="320" y2="180" gradientUnits="userSpaceOnUse">
                <stop stopColor="#08101a" />
                <stop offset="1" stopColor="#122418" />
              </linearGradient>
              <filter id="coreGlow">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>
            <rect width="320" height="180" fill="url(#plankBg)" />
            <line x1="30" y1="150" x2="290" y2="150" stroke="#1c2c22" strokeWidth="2" strokeDasharray="4 4" />

            {/* Horizontal guide alignment line */}
            <line x1="75" y1="112" x2="255" y2="112" stroke="#759667" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />

            {/* Forearm planted flat on mat */}
            <path d="M78 148 L105 148" stroke="#759667" strokeWidth="5" strokeLinecap="round" />
            {/* Vertical upper arm to shoulder */}
            <path d="M105 148 L105 115" stroke="#a4b89d" strokeWidth="6" strokeLinecap="round" />
            <circle cx="105" cy="115" r="5" fill="#759667" />
            {/* Head neutral */}
            <circle cx="85" cy="112" r="7.5" fill="#cbd5e1" />

            {/* Rigid straight torso line */}
            <path d="M105 115 L180 115 L245 130 L255 148" stroke="#e2eaf4" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
            {/* Core activation zone glowing */}
            <rect x="135" y="108" width="45" height="14" rx="7" fill="#759667" filter="url(#coreGlow)" />
            <rect x="135" y="108" width="45" height="14" rx="7" stroke="#b9e3a6" strokeWidth="1.5" />

            {/* Feet */}
            <circle cx="255" cy="148" r="4.5" fill="#cbd5e1" />

            <text x="140" y="85" fill="#759667" fontSize="11" fontWeight="bold">KARIN DUVARI KİLİDİ</text>
            <text x="140" y="100" fill="#a4b89d" fontSize="9">DÜZ OMURGA • 180° HİZALAMA</text>
          </svg>
        );

      // 8. DEAD BUG
      case 'deadbug':
        return (
          <svg viewBox="0 0 320 180" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="deadbugBg" x1="0" y1="0" x2="320" y2="180" gradientUnits="userSpaceOnUse">
                <stop stopColor="#08101a" />
                <stop offset="1" stopColor="#132219" />
              </linearGradient>
              <filter id="absGlow">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>
            <rect width="320" height="180" fill="url(#deadbugBg)" />
            {/* Floor line */}
            <line x1="30" y1="140" x2="290" y2="140" stroke="#1c2c22" strokeWidth="2" strokeDasharray="4 4" />

            {/* Torso on floor */}
            <path d="M100 135 L200 135" stroke="#e2eaf4" strokeWidth="8" strokeLinecap="round" />
            <circle cx="85" cy="132" r="7.5" fill="#cbd5e1" />

            {/* Glowing Deep Core */}
            <circle cx="150" cy="133" r="12" fill="#759667" filter="url(#absGlow)" />
            <circle cx="150" cy="133" r="6" fill="#b9e3a6" />

            {/* Static arm up */}
            <path d="M115 135 L115 80" stroke="#a4b89d" strokeWidth="5" strokeLinecap="round" />
            {/* Static leg bent 90 */}
            <path d="M185 135 L185 95 L220 95" stroke="#a4b89d" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />

            {/* Extending opposite arm back */}
            <path d="M115 135 L60 115" stroke="#759667" strokeWidth="5" strokeLinecap="round" />
            {/* Extending opposite leg out straight */}
            <path d="M185 135 L260 125" stroke="#759667" strokeWidth="5" strokeLinecap="round" />

            <path d="M55 110 L45 110" stroke="#92b683" strokeWidth="2" />
            <path d="M265 125 L275 125" stroke="#92b683" strokeWidth="2" />
            <text x="135" y="65" fill="#759667" fontSize="10" fontWeight="bold">ÇAPRAZ ZIT AÇILMA</text>
            <text x="135" y="160" fill="#a4b89d" fontSize="9" fontWeight="bold">BEL YERE YAPIŞIK</text>
          </svg>
        );

      // 9. MOUNTAIN CLIMBER
      case 'climber':
        return (
          <svg viewBox="0 0 320 180" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="climberBg" x1="0" y1="0" x2="320" y2="180" gradientUnits="userSpaceOnUse">
                <stop stopColor="#08101a" />
                <stop offset="1" stopColor="#15261b" />
              </linearGradient>
            </defs>
            <rect width="320" height="180" fill="url(#climberBg)" />
            <line x1="30" y1="150" x2="290" y2="150" stroke="#1c2c22" strokeWidth="2" strokeDasharray="4 4" />

            {/* Pushup position arms */}
            <path d="M110 100 L110 150" stroke="#e2eaf4" strokeWidth="6" strokeLinecap="round" />
            <circle cx="110" cy="100" r="5" fill="#759667" />
            <circle cx="95" cy="90" r="7.5" fill="#cbd5e1" />

            {/* Back angle */}
            <path d="M110 100 L185 110" stroke="#e2eaf4" strokeWidth="8" strokeLinecap="round" />

            {/* Driven knee to chest */}
            <path d="M185 110 L140 120 L135 135" stroke="#759667" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="140" cy="120" r="5" fill="#b9e3a6" />

            {/* Extended rear leg */}
            <path d="M185 110 L220 130 L255 148" stroke="#a4b89d" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />

            {/* Motion dashes */}
            <path d="M130 115 L120 115" stroke="#759667" strokeWidth="3" strokeLinecap="round" />
            <path d="M130 122 L115 122" stroke="#759667" strokeWidth="3" strokeLinecap="round" />

            <text x="145" y="75" fill="#759667" fontSize="11" fontWeight="bold">DİZ ÇEKİŞİ & KONDİSYON</text>
            <text x="145" y="90" fill="#a4b89d" fontSize="9">TEMPOLU CORE KONTROLÜ</text>
          </svg>
        );

      // 10. CAT - COW
      case 'catcow':
        return (
          <svg viewBox="0 0 320 180" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="catcowBg" x1="0" y1="0" x2="320" y2="180" gradientUnits="userSpaceOnUse">
                <stop stopColor="#08101a" />
                <stop offset="1" stopColor="#112217" />
              </linearGradient>
            </defs>
            <rect width="320" height="180" fill="url(#catcowBg)" />
            <line x1="30" y1="150" x2="290" y2="150" stroke="#1c2c22" strokeWidth="2" strokeDasharray="4 4" />

            {/* Tabletop arms & knees */}
            <line x1="100" y1="120" x2="100" y2="150" stroke="#a4b89d" strokeWidth="5" strokeLinecap="round" />
            <line x1="210" y1="120" x2="210" y2="150" stroke="#a4b89d" strokeWidth="5" strokeLinecap="round" />

            {/* Cat spine (arched up, dashed) */}
            <path d="M100 120 Q 155 75 210 120" stroke="#759667" strokeWidth="5" strokeLinecap="round" fill="none" />
            {/* Cow spine (dipped down) */}
            <path d="M100 120 Q 155 140 210 120" stroke="#92b683" strokeWidth="4" strokeLinecap="round" strokeDasharray="4 3" fill="none" />

            {/* Head movement */}
            <circle cx="85" cy="130" r="7" fill="#cbd5e1" />
            <circle cx="85" cy="105" r="7" fill="#cbd5e1" stroke="#759667" strokeWidth="1.5" strokeDasharray="2 2" />

            <text x="155" y="60" fill="#759667" fontSize="11" fontWeight="bold" textAnchor="middle">KEDİ (YUKARI) - DEVE (AŞAĞI)</text>
            <text x="155" y="165" fill="#a4b89d" fontSize="9" fontWeight="bold" textAnchor="middle">OMURGA MOBİLİTESİ & DERİN NEFES</text>
          </svg>
        );

      // 11. CHILD'S POSE
      case 'child':
        return (
          <svg viewBox="0 0 320 180" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="childBg" x1="0" y1="0" x2="320" y2="180" gradientUnits="userSpaceOnUse">
                <stop stopColor="#08101a" />
                <stop offset="1" stopColor="#122419" />
              </linearGradient>
            </defs>
            <rect width="320" height="180" fill="url(#childBg)" />
            <line x1="30" y1="150" x2="290" y2="150" stroke="#1c2c22" strokeWidth="2" strokeDasharray="4 4" />

            {/* Folded legs onto heels */}
            <path d="M235 148 L200 148 L220 125" stroke="#a4b89d" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
            {/* Torso folded over thighs */}
            <path d="M220 125 L160 135 L120 142" stroke="#e2eaf4" strokeWidth="7" strokeLinecap="round" />
            {/* Forehead on floor */}
            <circle cx="112" cy="144" r="6.5" fill="#cbd5e1" />
            {/* Arms reaching far forward along mat */}
            <path d="M135 138 L80 148" stroke="#759667" strokeWidth="5" strokeLinecap="round" />
            <circle cx="78" cy="148" r="3.5" fill="#b9e3a6" />

            {/* Lat extension stretch glow */}
            <path d="M160 130 L110 138" stroke="#759667" strokeWidth="2" strokeDasharray="3 2" />
            <text x="145" y="90" fill="#759667" fontSize="11" fontWeight="bold">OMUZ & KANAT GERİLMESİ</text>
            <text x="145" y="105" fill="#a4b89d" fontSize="9">TAM RAHATLAMA VE DİNLENME</text>
          </svg>
        );

      // 12. DOORFRAME ROW
      case 'door':
        return (
          <svg viewBox="0 0 320 180" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="doorBg" x1="0" y1="0" x2="320" y2="180" gradientUnits="userSpaceOnUse">
                <stop stopColor="#08101a" />
                <stop offset="1" stopColor="#132319" />
              </linearGradient>
            </defs>
            <rect width="320" height="180" fill="url(#doorBg)" />
            <line x1="30" y1="155" x2="290" y2="155" stroke="#1c2c22" strokeWidth="2" strokeDasharray="4 4" />

            {/* Vertical Doorframe */}
            <rect x="75" y="30" width="16" height="125" rx="2" fill="#1b2838" stroke="#759667" strokeWidth="2" />

            {/* Body leaning back at 45 degree angle */}
            {/* Feet planted at door base */}
            <circle cx="115" cy="153" r="5" fill="#a4b89d" />
            {/* Legs and torso straight incline */}
            <path d="M115 153 L165 115 L205 75" stroke="#e2eaf4" strokeWidth="8" strokeLinecap="round" />
            {/* Head */}
            <circle cx="218" cy="62" r="8" fill="#cbd5e1" />

            {/* Hands gripping doorframe pulling back */}
            <path d="M195 82 L150 92 L91 92" stroke="#759667" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="91" cy="92" r="5" fill="#b9e3a6" />

            {/* Pull arrow toward door */}
            <path d="M170 65 L145 75" stroke="#759667" strokeWidth="2.5" strokeDasharray="2 2" />

            <text x="140" y="45" fill="#759667" fontSize="11" fontWeight="bold">KAPI PERVAZI ROW</text>
            <text x="140" y="60" fill="#a4b89d" fontSize="9">VÜCUT AĞIRLIĞIYLA ÇEKİŞ</text>
          </svg>
        );

      // 13. BENCH / DESK TRICEPS
      case 'benchtriceps':
        return (
          <svg viewBox="0 0 320 180" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="benchBg" x1="0" y1="0" x2="320" y2="180" gradientUnits="userSpaceOnUse">
                <stop stopColor="#08101a" />
                <stop offset="1" stopColor="#132419" />
              </linearGradient>
            </defs>
            <rect width="320" height="180" fill="url(#benchBg)" />
            <line x1="30" y1="150" x2="290" y2="150" stroke="#1c2c22" strokeWidth="2" strokeDasharray="4 4" />

            {/* Desk / Bench */}
            <rect x="65" y="100" width="60" height="12" rx="2" fill="#243447" stroke="#759667" strokeWidth="1.5" />
            <rect x="75" y="112" width="8" height="38" fill="#1b2838" />

            {/* Hands pushing on desk edge */}
            <circle cx="125" cy="100" r="4.5" fill="#759667" />
            {/* Elbows extension */}
            <path d="M125 100 L145 90 L160 75" stroke="#759667" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="145" cy="90" r="5" fill="#b9e3a6" />
            {/* Torso & Feet */}
            <circle cx="160" cy="58" r="8" fill="#cbd5e1" />
            <path d="M160 75 L190 115 L235 150" stroke="#e2eaf4" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />

            <text x="150" y="45" fill="#759667" fontSize="11" fontWeight="bold">MASA / SEHPA TRICEPS</text>
            <text x="150" y="60" fill="#a4b89d" fontSize="9">DİRSEK KİLİTLEME ODAKLI</text>
          </svg>
        );

      // 14. PLANK SHOULDER TAPS
      case 'taps':
        return (
          <svg viewBox="0 0 320 180" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="tapsBg" x1="0" y1="0" x2="320" y2="180" gradientUnits="userSpaceOnUse">
                <stop stopColor="#08101a" />
                <stop offset="1" stopColor="#15261c" />
              </linearGradient>
            </defs>
            <rect width="320" height="180" fill="url(#tapsBg)" />
            <line x1="30" y1="150" x2="290" y2="150" stroke="#1c2c22" strokeWidth="2" strokeDasharray="4 4" />

            {/* High plank stance */}
            {/* Supporting left arm planted straight */}
            <path d="M100 105 L100 150" stroke="#e2eaf4" strokeWidth="6" strokeLinecap="round" />
            <circle cx="100" cy="105" r="6" fill="#759667" />
            <circle cx="85" cy="95" r="7.5" fill="#cbd5e1" />

            {/* Torso and legs */}
            <path d="M100 105 L175 115 L245 145" stroke="#e2eaf4" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />

            {/* Right arm lifting to tap opposite shoulder */}
            <path d="M115 105 L130 130 L102 108" stroke="#759667" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="102" cy="108" r="4.5" fill="#b9e3a6" />

            {/* Anti-rotation cross guide */}
            <ellipse cx="140" cy="115" rx="20" ry="8" fill="#759667" fillOpacity="0.2" stroke="#759667" strokeDasharray="2 2" />

            <text x="145" y="70" fill="#759667" fontSize="11" fontWeight="bold">OMUZ DOKUNUŞU (TAP)</text>
            <text x="145" y="85" fill="#a4b89d" fontSize="9">ANTİ-ROTASYON & DENGE</text>
          </svg>
        );

      // 15. SWIMMER FLUTTER
      case 'swimmer':
        return (
          <svg viewBox="0 0 320 180" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="swimBg" x1="0" y1="0" x2="320" y2="180" gradientUnits="userSpaceOnUse">
                <stop stopColor="#08101a" />
                <stop offset="1" stopColor="#102217" />
              </linearGradient>
            </defs>
            <rect width="320" height="180" fill="url(#swimBg)" />
            <line x1="30" y1="140" x2="290" y2="140" stroke="#1c2c22" strokeWidth="2" strokeDasharray="4 4" />

            {/* Prone body */}
            <path d="M105 130 L170 130 L220 130" stroke="#e2eaf4" strokeWidth="8" strokeLinecap="round" />
            <circle cx="100" cy="120" r="7.5" fill="#cbd5e1" />

            {/* Alternating elevated left arm */}
            <path d="M110 128 L65 105" stroke="#759667" strokeWidth="5" strokeLinecap="round" />
            {/* Elevated right leg */}
            <path d="M210 130 L265 108" stroke="#759667" strokeWidth="5" strokeLinecap="round" />

            {/* Ripple flutter waves */}
            <path d="M60 98 Q 70 94 80 98" stroke="#759667" strokeWidth="2" fill="none" />
            <path d="M255 100 Q 265 96 275 100" stroke="#759667" strokeWidth="2" fill="none" />

            <text x="160" y="70" fill="#759667" fontSize="11" fontWeight="bold" textAnchor="middle">YÜZÜCÜ ÇIRPINIŞI (SWIMMER)</text>
            <text x="160" y="85" fill="#a4b89d" fontSize="9" fontWeight="bold" textAnchor="middle">ARKA ZİNCİR ÇAPRAZ AKTİVASYON</text>
          </svg>
        );

      // 16. HOLLOW BODY HOLD
      case 'hollow':
        return (
          <svg viewBox="0 0 320 180" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="hollowBg" x1="0" y1="0" x2="320" y2="180" gradientUnits="userSpaceOnUse">
                <stop stopColor="#08101a" />
                <stop offset="1" stopColor="#122419" />
              </linearGradient>
              <filter id="hollowGlow">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>
            <rect width="320" height="180" fill="url(#hollowBg)" />
            <line x1="30" y1="145" x2="290" y2="145" stroke="#1c2c22" strokeWidth="2" strokeDasharray="4 4" />

            {/* Crescent concave dish curve */}
            {/* Lower back firmly pressed to floor at midpoint */}
            <circle cx="160" cy="138" r="14" fill="#759667" filter="url(#hollowGlow)" />
            <circle cx="160" cy="138" r="7" fill="#b9e3a6" />

            {/* Curved body from hands to feet */}
            <path d="M65 110 Q 160 148 260 110" stroke="#e2eaf4" strokeWidth="8" strokeLinecap="round" fill="none" />
            <circle cx="110" cy="120" r="7.5" fill="#cbd5e1" />

            <path d="M160 148 L160 156" stroke="#759667" strokeWidth="2.5" />
            <text x="160" y="168" fill="#759667" fontSize="9" fontWeight="bold" textAnchor="middle">BEL YERE BASILI</text>

            <text x="160" y="65" fill="#759667" fontSize="11" fontWeight="bold" textAnchor="middle">HOLLOW BODY KİLİDİ</text>
            <text x="160" y="80" fill="#a4b89d" fontSize="9" fontWeight="bold" textAnchor="middle">GİMNASTİK KARIN SIKIŞTIRMASI</text>
          </svg>
        );

      // 17. REST / RECOVERY
      case 'rest':
      default:
        return (
          <svg viewBox="0 0 320 180" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="restBg" x1="0" y1="0" x2="320" y2="180" gradientUnits="userSpaceOnUse">
                <stop stopColor="#08101a" />
                <stop offset="1" stopColor="#132419" />
              </linearGradient>
            </defs>
            <rect width="320" height="180" fill="url(#restBg)" />

            {/* Zen restorative pulse circle */}
            <circle cx="160" cy="90" r="42" fill="#759667" fillOpacity="0.12" stroke="#759667" strokeWidth="2" strokeDasharray="4 4" />
            <circle cx="160" cy="90" r="28" fill="#759667" fillOpacity="0.2" stroke="#b9e3a6" strokeWidth="2" />
            <path d="M148 90 L156 98 L174 80" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />

            <text x="160" y="150" fill="#759667" fontSize="11" fontWeight="bold" textAnchor="middle">DİNLENME & KAS YENİLENMESİ</text>
            <text x="160" y="165" fill="#a4b89d" fontSize="9" fontWeight="bold" textAnchor="middle">BİR SONRAKİ SET İÇİN GÜÇ TOPLA</text>
          </svg>
        );
    }
  };

  return (
    <div className={`relative w-full h-full overflow-hidden select-none touch-pan-y ${className}`}>
      {renderSvgGraphic()}

      {/* Hero mode overlay accents */}
      {isHero && (
        <div className="absolute inset-0 bg-gradient-to-t from-[#101926] via-transparent to-transparent pointer-events-none" />
      )}
    </div>
  );
};
