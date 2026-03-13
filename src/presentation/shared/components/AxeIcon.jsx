import React from 'react';

/**
 * AxeIcon - A premium, animated SVG component representing a glowing axe with veins.
 * This version features:
 * 1. Bidirectional "Pulsing Flow" animation: Light flows from the jewel to the tips and back.
 * 2. Optional hover-only animation trigger.
 * 3. Enhanced glow and premium whole-body pulse.
 * 
 * @param {Object} props
 * @param {string} [props.className] - Optional CSS classes
 * @param {string|number} [props.size] - Optional size (applied to container)
 * @param {boolean} [props.playOnHover] - If true, animations only run when hovered
 * @returns {JSX.Element}
 */
const AxeIcon = ({ className = '', size = '100%', playOnHover = false }) => {
  return (
    <div 
      className={`axe-icon-container ${playOnHover ? 'play-on-hover' : ''} ${className}`} 
      style={{ 
        width: size, 
        height: size, 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        position: 'relative'
      }}
    >
      <style>
        {`
          .axe-icon-container {
            overflow: visible;
          }

          /* Vein Styles */
          .vein {
              stroke: #00e5ff;
              fill: none;
              stroke-linecap: round;
              stroke-linejoin: round;
              filter: url(#axe-strongGlow);
              stroke-dasharray: 1000;
              stroke-dashoffset: 1000;
              stroke-width: 3.5px;
              animation: axe-bidirectional-flow 4s ease-in-out infinite;
          }

          .vein-core {
              stroke: #ffffff;
              fill: none;
              stroke-linecap: round;
              stroke-dasharray: 1000;
              stroke-dashoffset: 1000;
              stroke-width: 1.5px;
              animation: axe-bidirectional-flow 4s ease-in-out infinite;
          }

          /* Sequential Delays starting from Jewel outwards */
          .vein-handle { animation-delay: 0.2s; }
          .vein-inner { animation-delay: 0s; }
          .vein-outer { animation-delay: 0.5s; }

          @keyframes axe-bidirectional-flow {
              0% { stroke-dashoffset: 1000; opacity: 0.2; }
              45%, 55% { stroke-dashoffset: 0; opacity: 1; }
              100% { stroke-dashoffset: 1000; opacity: 0.2; }
          }

          /* Crystal Core (Jewel) */
          .crystal-core {
              fill: #00e5ff;
              filter: url(#axe-intenseGlow);
              animation: axe-pulse-crystal 2s infinite alternate ease-in-out;
          }

          .crystal-shimmer {
              fill: #ffffff;
              animation: axe-pulse-crystal 2s infinite alternate-reverse ease-in-out;
          }

          @keyframes axe-pulse-crystal {
              0% { transform: scale(0.85); opacity: 0.6; filter: blur(1px) drop-shadow(0 0 10px #00e5ff); }
              100% { transform: scale(1.15); opacity: 1; filter: blur(0px) drop-shadow(0 0 35px #00e5ff); }
          }
          
          .jewel-group {
              transform-origin: center;
              transform-box: fill-box;
          }

          .axe-svg-root {
              width: 100%;
              height: 100%;
              max-width: 900px;
              max-height: 95vh;
              filter: drop-shadow(0 0 50px rgba(0, 229, 255, 0.25));
              animation: axe-body-pulse 6s infinite ease-in-out;
          }

          @keyframes axe-body-pulse {
              0%, 100% { transform: scale(1); filter: drop-shadow(0 0 40px rgba(0, 229, 255, 0.15)); }
              50% { transform: scale(1.015); filter: drop-shadow(0 0 70px rgba(0, 229, 255, 0.4)); }
          }

          /* Hover Only Logic */
          .play-on-hover .vein,
          .play-on-hover .vein-core,
          .play-on-hover .crystal-core,
          .play-on-hover .crystal-shimmer,
          .play-on-hover .axe-svg-root {
              animation-play-state: paused;
          }

          .play-on-hover:hover .vein,
          .play-on-hover:hover .vein-core,
          .play-on-hover:hover .crystal-core,
          .play-on-hover:hover .crystal-shimmer,
          .play-on-hover:hover .axe-svg-root {
              animation-play-state: running;
          }
        `}
      </style>
      
      <svg 
        viewBox="-50 -50 1100 1200" 
        xmlns="http://www.w3.org/2000/svg"
        className="axe-svg-root"
      >
        <defs>
          <filter id="axe-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="axe-strongGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="15" result="blur" />
            <feComponentTransfer in="blur" result="glow">
              <feFuncA type="linear" slope="2.5" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="axe-intenseGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="25" result="blur1" />
            <feGaussianBlur stdDeviation="10" result="blur2" />
            <feMerge>
              <feMergeNode in="blur1" />
              <feMergeNode in="blur2" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <linearGradient id="metalMain" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3a404d" />
            <stop offset="50%" stopColor="#1f232b" />
            <stop offset="100%" stopColor="#0f1115" />
          </linearGradient>

          <linearGradient id="metalDark" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1f232b" />
            <stop offset="100%" stopColor="#08090b" />
          </linearGradient>

          <linearGradient id="edgeHighlight" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#8ba1b5" />
            <stop offset="50%" stopColor="#465466" />
            <stop offset="100%" stopColor="#1f232b" />
          </linearGradient>

          <linearGradient id="handleGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#111" />
            <stop offset="50%" stopColor="#2a2a2a" />
            <stop offset="100%" stopColor="#050505" />
          </linearGradient>
        </defs>

        <g transform="translate(60, 20)">
          {/* Handle */}
          <rect x="380" y="150" width="40" height="750" rx="8" fill="url(#handleGrad)" stroke="#1a1a1a" strokeWidth="2"/>
          
          <path d="M 375 200 L 425 210 L 425 230 L 375 220 Z" fill="#222" stroke="#444"/>
          <path d="M 375 450 L 425 460 L 425 480 L 375 470 Z" fill="#222" stroke="#444"/>
          <path d="M 375 700 L 425 710 L 425 730 L 375 720 Z" fill="#222" stroke="#444"/>
          
          {/* Handle Tip */}
          <polygon points="380,900 420,900 400,1020" fill="url(#metalMain)" stroke="#3a404d" strokeWidth="2"/>
          <polygon points="400,900 420,900 400,1020" fill="url(#metalDark)" />

          {/* Axe Head Base */}
          <polygon points="350,230 450,230 470,470 330,470" fill="#15171a" stroke="#2a3038" strokeWidth="3"/>

          {/* Right Main Blade */}
          <path d="M 450 250 L 680 120 C 730 180 770 240 780 350 C 770 450 720 550 600 650 L 450 450 Z" fill="url(#metalMain)" stroke="#2a3038" strokeWidth="2"/>
          <path d="M 450 250 L 650 160 C 680 220 710 280 720 350 C 710 420 680 480 580 580 L 450 450 Z" fill="url(#metalDark)" />
          <path d="M 680 120 C 730 180 770 240 780 350 C 770 450 720 550 600 650 L 580 580 C 680 480 710 420 720 350 C 710 280 680 220 650 160 Z" fill="url(#edgeHighlight)" />
          <path d="M 470 280 C 530 250 580 220 610 230 C 630 290 640 350 590 440 C 550 420 500 380 470 360 Z" fill="#08090a" stroke="#1f232b"/>

          {/* Left Back Spike */}
          <path d="M 350 270 L 220 200 L 260 290 L 80 340 L 240 380 L 180 480 L 350 430 Z" fill="url(#metalMain)" stroke="#2a3038" strokeWidth="2"/>
          <path d="M 350 270 L 280 290 L 180 340 L 270 370 L 350 430 Z" fill="url(#metalDark)" />
          <path d="M 220 200 L 260 290 L 280 290 L 260 230 Z" fill="url(#edgeHighlight)"/>
          <path d="M 80 340 L 240 380 L 270 370 L 180 340 Z" fill="url(#edgeHighlight)"/>

          {/* Veins */}
          <path className="vein vein-inner" d="M 440 320 Q 520 280 600 240 T 730 190" />
          <path className="vein-core vein-inner" d="M 440 320 Q 520 280 600 240 T 730 190" />
          
          <path className="vein vein-inner" d="M 450 350 Q 550 340 650 370 T 770 370" />
          <path className="vein-core vein-inner" d="M 450 350 Q 550 340 650 370 T 770 370" />
          
          <path className="vein vein-inner" d="M 440 380 Q 520 440 580 490 T 670 590" />
          <path className="vein-core vein-inner" d="M 440 380 Q 520 440 580 490 T 670 590" />
          
          <path className="vein vein-outer" d="M 560 260 Q 610 200 660 145" />
          <path className="vein-core vein-outer" d="M 560 260 Q 610 200 660 145" />
          
          <path className="vein vein-outer" d="M 610 360 Q 640 420 700 460" />
          <path className="vein-core vein-outer" d="M 610 360 Q 640 420 700 460" />

          {/* Left Spike */}
          <path className="vein vein-inner" d="M 360 330 Q 280 310 200 330 T 110 345" />
          <path className="vein-core vein-inner" d="M 360 330 Q 280 310 200 330 T 110 345" />
          
          <path className="vein vein-inner" d="M 360 380 Q 280 410 220 460" />
          <path className="vein-core vein-inner" d="M 360 380 Q 280 410 220 460" />

          {/* Handle Vein */}
          <path className="vein vein-handle" d="M 400 460 Q 380 550 415 650 T 400 850" />
          <path className="vein-core vein-handle" d="M 400 460 Q 380 550 415 650 T 400 850" />

          {/* Crystal Core (Jewel) at center of axe head */}
          <g transform="translate(400, 350)" className="jewel-group">
              <polygon points="-35,0 0,-45 35,0 0,45" className="crystal-core" />
              <polygon points="-15,0 0,-20 15,0 0,20" className="crystal-shimmer" />
          </g>
        </g>
      </svg>
    </div>
  );
};

export default AxeIcon;
