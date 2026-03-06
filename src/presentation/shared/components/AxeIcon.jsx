import React from 'react';

/**
 * AxeIcon - A premium, animated SVG component representing a glowing axe with veins.
 * Used as a decorative icon or brand element across the application.
 * 
 * @param {Object} props
 * @param {string} [props.className] - Optional CSS classes
 * @param {string|number} [props.size] - Optional size (applied to container)
 * @returns {JSX.Element}
 */
const AxeIcon = ({ className = '', size = '100%' }) => {
  return (
    <div 
      className={`axe-icon-container ${className}`} 
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
            overflow: hidden;
          }

          /* Vein Styles */
          .vein {
              stroke: #00e5ff;
              fill: none;
              stroke-linecap: round;
              stroke-linejoin: round;
              filter: url(#axe-glow);
              animation: axe-pulse-vein 2s infinite alternate ease-in-out;
          }

          .vein-core {
              stroke: #ffffff;
              fill: none;
              stroke-linecap: round;
              animation: axe-pulse-core 2s infinite alternate ease-in-out;
          }

          /* Blue Flame Styles */
          .flame-outer {
              fill: #0066ff;
              filter: url(#axe-strongGlow);
              animation: axe-flicker 0.6s infinite alternate ease-in-out;
              opacity: 0.7;
              transform-origin: center;
          }

          .flame-inner {
              fill: #00e5ff;
              filter: url(#axe-glow);
              animation: axe-flicker-fast 0.3s infinite alternate ease-in-out;
              transform-origin: center;
          }

          /* Pulsing Crystal Core */
          .crystal-core {
              fill: #e0ffff;
              filter: url(#axe-intenseGlow);
              animation: axe-pulse-crystal 1.5s infinite alternate;
          }

          /* Floating Embers */
          .ember {
              fill: #00e5ff;
              filter: url(#axe-glow);
              animation: axe-float-up 3s infinite linear;
              opacity: 0;
          }

          /* Animation Keyframes */
          @keyframes axe-pulse-vein {
              0% { stroke-width: 2px; opacity: 0.6; filter: url(#axe-glow) drop-shadow(0 0 5px #00e5ff); }
              100% { stroke-width: 4px; opacity: 1; filter: url(#axe-strongGlow) drop-shadow(0 0 15px #00e5ff); }
          }

          @keyframes axe-pulse-core {
              0% { stroke-width: 0.5px; opacity: 0.5; }
              100% { stroke-width: 2px; opacity: 1; }
          }

          @keyframes axe-pulse-crystal {
              0% { transform: scale(0.95); opacity: 0.8; }
              100% { transform: scale(1.05); opacity: 1; }
          }

          @keyframes axe-flicker {
              0% { opacity: 0.5; transform: scale(0.98) rotate(-1deg); }
              100% { opacity: 0.9; transform: scale(1.02) rotate(1deg); }
          }

          @keyframes axe-flicker-fast {
              0% { opacity: 0.7; transform: scale(0.95); }
              100% { opacity: 1; transform: scale(1.05); }
          }

          @keyframes axe-float-up {
              0% { transform: translateY(0) scale(1); opacity: 0; }
              20% { opacity: 1; }
              80% { opacity: 0.8; }
              100% { transform: translateY(-100px) scale(0.5); opacity: 0; }
          }

          .axe-svg-root {
              width: 100%;
              height: 100%;
              max-width: 900px;
              max-height: 95vh;
              filter: drop-shadow(0 0 30px rgba(0, 229, 255, 0.1));
          }
        `}
      </style>
      
      <svg 
        viewBox="-50 0 1000 1050" 
        xmlns="http://www.w3.org/2000/svg"
        className="axe-svg-root"
      >
        <defs>
          <filter id="axe-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="axe-strongGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="12" result="blur" />
            <feComponentTransfer in="blur" result="glow">
              <feFuncA type="linear" slope="1.5" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="axe-intenseGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="20" result="blur1" />
            <feGaussianBlur stdDeviation="8" result="blur2" />
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
          
          <polygon points="380,900 420,900 400,980" fill="url(#metalMain)" stroke="#3a404d"/>
          <polygon points="400,900 420,900 400,980" fill="url(#metalDark)" />

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
          <path className="vein" d="M 440 320 Q 520 280 600 240 T 730 190" />
          <path className="vein-core" d="M 440 320 Q 520 280 600 240 T 730 190" />
          <path className="vein" d="M 450 350 Q 550 340 650 370 T 770 370" />
          <path className="vein-core" d="M 450 350 Q 550 340 650 370 T 770 370" />
          <path className="vein" d="M 440 380 Q 520 440 580 490 T 670 590" />
          <path className="vein-core" d="M 440 380 Q 520 440 580 490 T 670 590" />
          <path className="vein" d="M 560 260 Q 610 200 660 145" />
          <path className="vein-core" d="M 560 260 Q 610 200 660 145" />
          <path className="vein" d="M 610 360 Q 640 420 700 460" />
          <path className="vein-core" d="M 610 360 Q 640 420 700 460" />

          {/* Left Spike Veins */}
          <path className="vein" d="M 360 330 Q 280 310 200 330 T 110 345" />
          <path className="vein-core" d="M 360 330 Q 280 310 200 330 T 110 345" />
          <path className="vein" d="M 360 380 Q 280 410 220 460" />
          <path className="vein-core" d="M 360 380 Q 280 410 220 460" />

          {/* Handle Veins */}
          <path className="vein" d="M 400 460 Q 380 550 415 650 T 395 850" />
          <path className="vein-core" d="M 400 460 Q 380 550 415 650 T 395 850" />

          {/* Crystal Core */}
          <g transform="translate(400, 350)">
              <polygon points="0,-45 35,0 0,45 -35,0" fill="#00e5ff" className="crystal-core" />
              <polygon points="0,-30 15,0 0,30 -15,0" fill="#ffffff" />
          </g>

          {/* Flames */}
          <g transform="translate(680, 110)">
              <path className="flame-outer" d="M 0 0 Q 30 -40 -10 -80 Q 40 -60 50 -100 Q 40 -50 70 -30 Z" />
              <path className="flame-inner" d="M 10 -10 Q 20 -30 0 -60 Q 25 -40 30 -70 Q 25 -30 45 -20 Z" />
          </g>

          <g transform="translate(775, 345) rotate(45)">
              <path className="flame-outer" d="M 0 0 Q 40 -30 10 -90 Q 50 -60 70 -110 Q 50 -40 80 -10 Z" />
              <path className="flame-inner" d="M 10 -10 Q 25 -25 5 -65 Q 35 -40 45 -80 Q 35 -25 55 -5 Z" />
          </g>

          <g transform="translate(605, 640) rotate(120)">
              <path className="flame-outer" d="M 0 0 Q 30 -40 -10 -80 Q 40 -60 50 -100 Q 40 -50 70 -30 Z" />
              <path className="flame-inner" d="M 10 -10 Q 20 -30 0 -60 Q 25 -40 30 -70 Q 25 -30 45 -20 Z" />
          </g>

          <g transform="translate(85, 340) rotate(-60)">
              <path className="flame-outer" d="M 0 0 Q 30 -40 -20 -90 Q 40 -60 40 -110 Q 30 -40 60 -20 Z" />
              <path className="flame-inner" d="M 10 -10 Q 20 -30 -10 -60 Q 25 -40 25 -80 Q 20 -30 40 -10 Z" />
          </g>

          <g transform="translate(400, 220) rotate(-10)">
              <path className="flame-outer" d="M 0 0 Q 20 -50 -20 -100 Q 40 -70 30 -130 Q 30 -60 60 -40 Z" />
              <path className="flame-inner" d="M 5 -10 Q 15 -35 -10 -70 Q 25 -50 20 -90 Q 20 -40 40 -25 Z" />
          </g>

          {/* Embers */}
          <circle cx="680" cy="80" r="3" className="ember" style={{ animationDelay: '0s', animationDuration: '2s' }} />
          <circle cx="750" cy="250" r="4" className="ember" style={{ animationDelay: '1s', animationDuration: '3.5s' }} />
          <circle cx="800" cy="400" r="2" className="ember" style={{ animationDelay: '0.5s', animationDuration: '2.5s' }} />
          <circle cx="650" cy="680" r="5" className="ember" style={{ animationDelay: '2s', animationDuration: '4s' }} />
          <circle cx="50" cy="300" r="3" className="ember" style={{ animationDelay: '1.5s', animationDuration: '3s' }} />
          <circle cx="150" cy="200" r="4" className="ember" style={{ animationDelay: '0.2s', animationDuration: '2.8s' }} />
          <circle cx="420" cy="150" r="3" className="ember" style={{ animationDelay: '0.8s', animationDuration: '3.2s' }} />
        </g>
      </svg>
    </div>
  );
};

export default AxeIcon;
