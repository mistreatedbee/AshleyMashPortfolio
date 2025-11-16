import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';

// --- INTERFACE AND CONSTANTS -------------------------------------------------

interface HeroProps {
  name?: string;
  title?: string;
  description?: string;
  coreTechnologies?: string[];
  orbitTechnologies?: string[];
  avatarSrc?: string;
  featuredImages?: { src: string; alt: string }[];
  showTypingEffect?: boolean;
  showOrbitAnimation?: boolean;
  onTechnologyClick?: (tech: string) => void;
}

const DEFAULT_PROPS = {
  name: "Ashley Mashigo",
  title: "Software Engineer & IT Specialist",
  description: "I design, build and maintain scalable web and mobile applications with clean architecture and pragmatic engineering. I focus on performance, automation and real-world reliability.",
  coreTechnologies: ['JavaScript', 'React', 'React Native', 'Node.js', 'Python', 'MySQL', 'MongoDB', 'Firebase', 'Docker', 'MQL4'],
  orbitTechnologies: ['javascript', 'typescript', 'react', 'react-native', 'nodejs', 'python', 'java', 'cpp', 'csharp', 'kotlin', 'swift', 'go', 'rust', 'php', 'mysql', 'mongodb', 'firebase', 'docker', 'git'],
  avatarSrc: "/assets/images/avatar-1.jpeg",
  featuredImages: [
    { src: "/assets/images/healthcare.jpg", alt: "Healthcare App Preview" },
    { src: "/assets/images/socialmedia.png", alt: "Social Media App Preview" },
  ],
  showTypingEffect: true,
  showOrbitAnimation: true,
} as const;

const TYPING_SPEED = 24;
const COPY_FEEDBACK_DURATION = 2000;
const NEON_COLOR = '#06b6d4'; // Tailwind cyan-500
const NEON_SHADOW = `0 0 5px ${NEON_COLOR}, 0 0 15px ${NEON_COLOR}, 0 0 25px ${NEON_COLOR}55`;

// --- HELPER COMPONENTS (Moved outside Hero for better performance) -------------

interface TechIconProps {
  tech: string;
  size?: 'small' | 'medium';
  imageErrors: Set<string>;
  handleTechClick: (tech: string) => void;
  handleImageError: (tech: string) => void;
}

const TechnologyIcon: React.FC<TechIconProps> = ({ tech, size = 'medium', imageErrors, handleTechClick, handleImageError }) => {
  const iconSize = size === 'small' ? 'w-6 h-6' : 'w-12 h-12';
  
  if (imageErrors.has(tech)) {
    return (
      <button 
        className={`${iconSize} rounded bg-slate-600 flex items-center justify-center text-xs text-slate-400 cursor-pointer hover:scale-110 transition-transform duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 neon-glow`}
        onClick={() => handleTechClick(tech)}
        title={tech}
        type="button"
        aria-label={`Copy ${tech} to clipboard`}
      >
        {tech.slice(0, 3).toUpperCase()}
      </button>
    );
  }

  return (
    <div className="tech-icon group relative">
      <img
        src={`/assets/icons/${tech}.svg`}
        className={`${iconSize} hover:scale-110 transition-transform duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-400 rounded neon-glow`}
        alt={tech}
        onError={() => handleImageError(tech)}
        onClick={() => handleTechClick(tech)}
        loading="lazy"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleTechClick(tech);
          }
        }}
      />
      <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition text-xs text-cyan-300 capitalize bg-slate-800 px-2 py-1 rounded pointer-events-none z-10 neon-text whitespace-nowrap">
        {tech.replace('-', ' ')}
      </span>
    </div>
  );
};

const TechnologyPill: React.FC<{ tech: string; handleTechClick: (tech: string) => void }> = ({ tech, handleTechClick }) => (
  <button
    onClick={() => handleTechClick(tech)}
    className="skill-pill px-4 py-2 bg-slate-700/50 hover:bg-cyan-500/20 border border-slate-600 hover:border-cyan-400 rounded-full text-slate-300 hover:text-cyan-300 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-800"
    aria-label={`Copy ${tech} to clipboard`}
    type="button"
  >
    {tech}
  </button>
);

const CallToActionButtons: React.FC = () => (
  <div className="mt-8 flex flex-wrap gap-4 items-center">
    <a
      href="#projects"
      className="px-6 py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-sky-400 text-black font-semibold hover:from-cyan-600 hover:to-sky-500 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-slate-900 neon-border-cta"
    >
      View Projects
    </a>
    <a
      href="#contact"
      className="px-6 py-3 rounded-lg border border-cyan-400/50 text-cyan-300 hover:bg-cyan-400/10 hover:border-cyan-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-900"
    >
      Contact Me
    </a>
    <a
      href="/resume.pdf"
      target="_blank"
      rel="noopener noreferrer"
      className="px-6 py-3 rounded-lg border border-slate-400/50 text-slate-300 hover:bg-slate-400/10 hover:border-slate-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-900"
      aria-label="Download CV (PDF)"
    >
      Download CV
    </a>
  </div>
);

const FeaturedProject: React.FC<{ img: { src: string; alt: string }; index: number }> = ({ img }) => {
  const [imageError, setImageError] = useState(false);

  if (imageError) {
    return (
      <a href="#" className="relative group overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 bg-slate-700 h-24 flex items-center justify-center neon-border">
        <div className="text-slate-400 text-sm text-center px-2">
          Image not available: {img.alt}
        </div>
      </a>
    );
  }

  return (
    <a href="#" className="relative group overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 neon-border" aria-label={`View project: ${img.alt}`}>
      <img
        src={img.src}
        className="w-full h-24 object-cover transition-transform duration-300 group-hover:scale-110"
        alt={img.alt}
        loading="lazy"
        onError={() => setImageError(true)}
      />
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
        <span className="text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 neon-text">
          {img.alt}
        </span>
      </div>
    </a>
  );
};

// --- HERO COMPONENT ----------------------------------------------------------

const Hero: React.FC<HeroProps> = (props) => {
  const {
    name = DEFAULT_PROPS.name,
    title = DEFAULT_PROPS.title,
    description = DEFAULT_PROPS.description,
    coreTechnologies = DEFAULT_PROPS.coreTechnologies,
    orbitTechnologies = DEFAULT_PROPS.orbitTechnologies,
    avatarSrc = DEFAULT_PROPS.avatarSrc,
    featuredImages = DEFAULT_PROPS.featuredImages,
    showTypingEffect = DEFAULT_PROPS.showTypingEffect,
    showOrbitAnimation = DEFAULT_PROPS.showOrbitAnimation,
    onTechnologyClick,
  } = props;

  const headingRef = useRef<HTMLHeadingElement>(null);
  const typingIntervalRef = useRef<NodeJS.Timeout>();
  const [copiedTech, setCopiedTech] = useState<string | null>(null);
  const [isAvatarHovered, setIsAvatarHovered] = useState(false);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
  const [avatarError, setAvatarError] = useState(false);

  const fullHeadingText = useMemo(() => `${name} — ${title}`, [name, title]);
  const displayedOrbitTechnologies = useMemo(() => 
    orbitTechnologies.slice(0, 6), [orbitTechnologies]
  );

  // --- TYPING EFFECT ---
  useEffect(() => {
    if (!showTypingEffect || !headingRef.current) return;

    const el = headingRef.current;
    el.textContent = '';
    let currentIndex = 0;

    const typeCharacter = () => {
      if (currentIndex < fullHeadingText.length) {
        el.textContent = fullHeadingText.slice(0, currentIndex + 1);
        currentIndex++;
      } else {
        clearInterval(typingIntervalRef.current);
      }
    };

    typingIntervalRef.current = setInterval(typeCharacter, TYPING_SPEED);

    return () => {
      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current);
      }
    };
  }, [fullHeadingText, showTypingEffect]);

  // --- HANDLERS ---
  const handleTechClick = useCallback(async (tech: string) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(tech);
        setCopiedTech(tech);
        setTimeout(() => setCopiedTech(null), COPY_FEEDBACK_DURATION);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = tech;
        textArea.style.position = 'fixed';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        setCopiedTech(tech);
        setTimeout(() => setCopiedTech(null), COPY_FEEDBACK_DURATION);
      }
    } catch (error) {
      console.error('Failed to copy text: ', error);
    }

    onTechnologyClick?.(tech);
  }, [onTechnologyClick]);

  const handleImageError = useCallback((tech: string) => {
    setImageErrors(prev => new Set(prev).add(tech));
  }, []);

  const handleAvatarError = useCallback(() => {
    setAvatarError(true);
  }, []);

  const handleAvatarEnter = useCallback(() => setIsAvatarHovered(true), []);
  const handleAvatarLeave = useCallback(() => setIsAvatarHovered(false), []);

  // --- SUB-COMPONENTS (Defined as functions using state/props from Hero) ---

  const AnimatedBackground = () => (
    <>
      <div className="absolute inset-0 opacity-10" aria-hidden="true">
        <div className="grid-bg"></div>
      </div>
      <div className="particle particle-1" aria-hidden="true"></div>
      <div className="particle particle-2" aria-hidden="true"></div>
      <div className="particle particle-3" aria-hidden="true"></div>
      <div className="particle particle-4" aria-hidden="true"></div>
      <div className="particle particle-5" aria-hidden="true"></div>
      <div className="blob blob-a animate-pulse" aria-hidden="true" />
      <div className="blob blob-b animate-pulse delay-1000" aria-hidden="true" />
      <div className="blob blob-c animate-pulse delay-2000" aria-hidden="true" />
      <div className="scan-line" aria-hidden="true"></div>
    </>
  );

  const AvatarSection = () => (
    <div
      className="avatar-anim inline-block relative cursor-pointer"
      onMouseEnter={handleAvatarEnter}
      onMouseLeave={handleAvatarLeave}
      onFocus={handleAvatarEnter}
      onBlur={handleAvatarLeave}
      tabIndex={0}
      role="button"
      aria-label="Avatar with animation effect"
    >
      <div className={`ring ${isAvatarHovered ? 'animate-spin' : ''}`} aria-hidden="true" />
      {avatarError ? (
        <div 
          className="w-36 h-36 rounded-full avatar-pulse border-4 border-cyan-400/30 shadow-lg bg-slate-600 flex items-center justify-center text-white text-lg font-semibold neon-glow"
          aria-label="Avatar placeholder"
        >
          {name.split(' ').map(n => n[0]).join('')}
        </div>
      ) : (
        <img
          src={avatarSrc}
          alt={`${name} Avatar`}
          className="w-36 h-36 rounded-full avatar-pulse border-4 border-cyan-400/30 shadow-lg neon-glow object-cover"
          loading="eager"
          onError={handleAvatarError}
        />
      )}
      {isAvatarHovered && (
        <div className="absolute inset-0 rounded-full bg-cyan-400/20 animate-ping" aria-hidden="true" />
      )}
    </div>
  );

  const CopyFeedbackToast = () => (
    <div 
      className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-fade-in neon-border-success"
      role="alert"
      aria-live="polite"
    >
      Copied "**{copiedTech}**" to clipboard!
    </div>
  );

  // --- MAIN RENDER ---

  return (
    <header className="relative overflow-visible py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-black">
      <AnimatedBackground />

      <div className="container mx-auto px-6 flex flex-col lg:flex-row items-start gap-8 relative z-10">
        {/* Main Content */}
        <div className="flex-1">
          <div className="kicker mb-2 text-cyan-400 neon-text">Hello — I&apos;m</div>
          <h1
            ref={headingRef}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight glitch text-white"
            data-text={fullHeadingText}
            aria-live={showTypingEffect ? "polite" : "off"}
          >
            {!showTypingEffect && fullHeadingText}
          </h1>
        
          <p className="mt-4 text-slate-200 max-w-2xl text-lg leading-relaxed">
            {description}
          </p>

          <CallToActionButtons />

          {/* Core Technologies */}
          <section aria-labelledby="core-technologies-heading" className="mt-10">
            <h2 id="core-technologies-heading" className="kicker text-cyan-400 neon-text">
              Core Technologies
            </h2>
            <div className="mt-4 flex flex-wrap gap-3">
              {coreTechnologies.map((tech) => (
                <TechnologyPill key={tech} tech={tech} handleTechClick={handleTechClick} />
              ))}
            </div>
          </section>

          {/* Tech Icons Grid (Orbit technologies repurposed into a grid) */}
          <section aria-labelledby="tech-stack-heading" className="mt-10">
            <h2 id="tech-stack-heading" className="kicker text-cyan-400 neon-text">
              Tech Stack
            </h2>
            <div 
              className="mt-4 grid grid-cols-6 md:grid-cols-9 lg:grid-cols-10 gap-4"
              role="list"
              aria-label="Technology icons"
            >
              {orbitTechnologies.map((tech) => (
                <div key={tech} role="listitem">
                  <TechnologyIcon 
                    tech={tech} 
                    handleTechClick={handleTechClick} 
                    handleImageError={handleImageError} 
                    imageErrors={imageErrors} 
                  />
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="w-full lg:w-96 shrink-0">
          <div className="relative p-6 rounded-2xl flex flex-col items-center bg-gradient-to-b from-white/5 to-white/1 border border-white/10 backdrop-blur-sm shadow-xl neon-border">
            <AvatarSection />

            <div className="mt-4 text-center">
              <div className="font-semibold text-white text-xl neon-text">{name}</div>
              <div className="text-sm text-slate-400 mt-1">{title}</div>
            </div>

            <div className="mt-4 text-sm text-slate-300 text-center">
              {isAvatarHovered ? "Nice to meet you!" : "Hover or focus the avatar for a surprise"}
            </div>

            {/* Orbiting Icons (Replaced with bouncing icons for a simpler implementation without complex orbit CSS) */}
            {showOrbitAnimation && (
              <div className="absolute -left-16 top-6 flex flex-col gap-3" aria-hidden="true">
                {displayedOrbitTechnologies.map((tech, index) => (
                  <div
                    key={tech}
                    className="tech-icon animate-pulse"
                    style={{ animationDelay: `${index * 0.2}s` }}
                  >
                    <TechnologyIcon 
                      tech={tech} 
                      size="small" 
                      handleTechClick={handleTechClick} 
                      handleImageError={handleImageError} 
                      imageErrors={imageErrors} 
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Featured Preview */}
          <section aria-labelledby="featured-projects-heading" className="mt-8">
            <h3 id="featured-projects-heading" className="kicker text-cyan-400 neon-text">
              Featured Projects
            </h3>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {featuredImages.map((img, index) => (
                <FeaturedProject key={index} img={img} index={index} />
              ))}
            </div>
          </section>

          {/* Quick Stats */}
          <section aria-labelledby="quick-stats-heading" className="mt-8 p-4 rounded-lg bg-white/5 border border-white/10 neon-border">
            <h3 id="quick-stats-heading" className="kicker text-cyan-400 mb-3 neon-text">
              Quick Stats
            </h3>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-cyan-300 neon-text">4+</div>
                <div className="text-xs text-slate-400">Years Experience</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-cyan-300 neon-text">18+</div>
                <div className="text-xs text-slate-400">Projects Completed</div>
              </div>
            </div>
          </section>
        </aside>
      </div>

      {copiedTech && <CopyFeedbackToast />}

      <HeroStyles />
    </header>
  );
};

export default Hero;

// --- STYLES COMPONENT (Completed CSS for all custom classes) -------------------

const HeroStyles: React.FC = () => (
  <style>
    {`
      /* Keyframes */
      @keyframes fade-in {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      @keyframes neon-flicker {
        0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% { box-shadow: ${NEON_SHADOW}; }
        20%, 24%, 55% { box-shadow: 0 0 1px ${NEON_COLOR}, 0 0 5px ${NEON_COLOR}99; }
      }
      @keyframes scan-line-move {
        0% { transform: translateY(0); }
        100% { transform: translateY(100vh); }
      }
      @keyframes blob-move-a {
        0%, 100% { transform: translate(0, 0) scale(1); }
        33% { transform: translate(-50vw, -20vh) scale(1.2); }
        66% { transform: translate(20vw, 30vh) scale(0.8); }
      }
      @keyframes blob-move-b {
        0%, 100% { transform: translate(0, 0) scale(1); }
        33% { transform: translate(50vw, 20vh) scale(0.9); }
        66% { transform: translate(-20vw, -30vh) scale(1.1); }
      }
      @keyframes blob-move-c {
        0%, 100% { transform: translate(0, 0) scale(1); }
        33% { transform: translate(-10vw, 50vh) scale(1.1); }
        66% { transform: translate(40vw, -40vh) scale(0.9); }
      }
      
      /* Base Classes */
      .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
      .kicker { text-transform: uppercase; font-size: 0.875rem; font-weight: 600; letter-spacing: 0.05em; }

      /* Neon Effects */
      .neon-text { text-shadow: 0 0 5px ${NEON_COLOR}99; }
      .neon-glow { box-shadow: 0 0 3px ${NEON_COLOR}99; }
      .neon-border { border-color: ${NEON_COLOR}55 !important; }
      .neon-border:hover { box-shadow: ${NEON_SHADOW}; }
      .neon-border-success { border: 1px solid #10b981; box-shadow: 0 0 5px #10b981; }

      /* CTA Neon Border (More prominent effect) */
      .neon-border-cta { 
        box-shadow: 0 0 10px #0ea5e9; 
        transition: all 0.3s;
      }
      .neon-border-cta:hover { 
        box-shadow: 0 0 15px #0ea5e9, 0 0 30px #0ea5e9aa; 
      }

      /* Background Grid */
      .grid-bg {
        --grid-color: rgba(6, 182, 212, 0.1); /* Cyan/Slate */
        background-image: linear-gradient(to right, var(--grid-color) 1px, transparent 1px),
                          linear-gradient(to bottom, var(--grid-color) 1px, transparent 1px);
        background-size: 40px 40px;
        height: 100%;
        width: 100%;
        position: absolute;
      }
      
      /* Holographic Blobs */
      .blob {
        position: absolute;
        width: 300px;
        height: 300px;
        border-radius: 50%;
        opacity: 0.15;
        filter: blur(100px);
        transition: transform 1s ease-out;
        mix-blend-mode: screen;
      }
      .blob-a { background-color: #06b6d4; top: 10%; left: 10%; animation: blob-move-a 20s infinite alternate; }
      .blob-b { background-color: #3b82f6; top: 50%; right: 10%; animation: blob-move-b 25s infinite alternate; }
      .blob-c { background-color: #6366f1; bottom: 10%; left: 40%; animation: blob-move-c 30s infinite alternate; }

      /* Avatar Ring */
      .ring {
        position: absolute;
        inset: -10px;
        border: 2px dashed ${NEON_COLOR}77;
        border-radius: 50%;
        animation: spin 10s linear infinite;
        opacity: 0.5;
        transition: opacity 0.3s;
      }
      .avatar-anim:hover .ring {
        animation: spin 3s linear infinite;
        opacity: 1;
        border-style: solid;
        border-color: ${NEON_COLOR};
        box-shadow: ${NEON_SHADOW};
      }
      
      /* Glitch Effect (Simplistic CSS Glitch for H1) */
      .glitch {
        animation: neon-flicker 4s infinite step-end;
        text-shadow: ${NEON_SHADOW};
        color: #fff;
        position: relative;
      }
      
      /* Scan Line */
      .scan-line {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 2px;
        background: linear-gradient(to right, transparent, ${NEON_COLOR}, transparent);
        opacity: 0.2;
        animation: scan-line-move 10s linear infinite;
        pointer-events: none;
      }
      
      /* Particles (Small pulsing dots) */
      .particle {
        position: absolute;
        background: ${NEON_COLOR};
        border-radius: 50%;
        opacity: 0.8;
        animation: pulse 4s infinite alternate;
        pointer-events: none;
      }
      .particle-1 { top: 5%; left: 5%; width: 4px; height: 4px; animation-delay: 0.5s; }
      .particle-2 { top: 80%; left: 90%; width: 6px; height: 6px; animation-delay: 1.5s; }
      .particle-3 { top: 30%; left: 40%; width: 3px; height: 3px; animation-delay: 2.5s; }
      .particle-4 { top: 60%; left: 15%; width: 5px; height: 5px; animation-delay: 3.5s; }
      .particle-5 { top: 10%; right: 20%; width: 7px; height: 7px; animation-delay: 4.5s; }
    `}
  </style>
);
