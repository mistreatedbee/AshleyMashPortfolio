import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';

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

// Constants for better maintainability
const DEFAULT_PROPS = {
  name: "Ashley Mashigo",
  title: "Software Engineer & IT Specialist",
  description: "I design, build and maintain scalable web and mobile applications with clean architecture and pragmatic engineering. I focus on performance, automation and real-world reliability.",
  coreTechnologies: ['JavaScript', 'React', 'React Native', 'Node.js', 'Python', 'MySQL', 'MongoDB', 'Firebase', 'Docker', 'MQL4'],
  orbitTechnologies: ['javascript','typescript','react','react-native','nodejs','python','java','cpp','csharp','kotlin','swift','go','rust','php','mysql','mongodb','firebase','docker','git'],
  // These paths are correct for assets in public/assets/images
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

  // Memoized values for better performance
  const fullHeadingText = useMemo(() => `${name} — ${title}`, [name, title]);
  const displayedOrbitTechnologies = useMemo(() => 
    orbitTechnologies.slice(0, 6), [orbitTechnologies]
  );

  // Typing effect with proper cleanup
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

  // Technology click handler with error handling
  const handleTechClick = useCallback(async (tech: string) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(tech);
        setCopiedTech(tech);
        setTimeout(() => setCopiedTech(null), COPY_FEEDBACK_DURATION);
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = tech;
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

  // Image error handlers
  const handleImageError = useCallback((tech: string) => {
    setImageErrors(prev => new Set(prev).add(tech));
  }, []);

  const handleAvatarError = useCallback(() => {
    setAvatarError(true);
  }, []);

  // Avatar interaction handlers
  const handleAvatarEnter = useCallback(() => setIsAvatarHovered(true), []);
  const handleAvatarLeave = useCallback(() => setIsAvatarHovered(false), []);

  // Sub-components for better organization
  const AnimatedBackground = () => (
    <>
      <div className="blob blob-a animate-pulse" aria-hidden="true" />
      <div className="blob blob-b animate-pulse delay-1000" aria-hidden="true" />
      <div className="blob blob-c animate-pulse delay-2000" aria-hidden="true" />
    </>
  );

  const CallToActionButtons = () => (
    <div className="mt-8 flex flex-wrap gap-4 items-center">
      <a
        href="#projects"
        className="px-6 py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-sky-400 text-black font-semibold hover:from-cyan-600 hover:to-sky-500 transition-all duration-300 transform hover:scale-105 shadow-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-slate-900"
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
        href="/resume.pdf" // Adjust this if your PDF is in 'public/assets/'
        target="_blank"
        rel="noopener noreferrer"
        className="px-6 py-3 rounded-lg border border-slate-400/50 text-slate-300 hover:bg-slate-400/10 hover:border-slate-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-900"
      >
        Download CV
      </a>
    </div>
  );

  const TechnologyPill = ({ tech }: { tech: string }) => (
    <button
      onClick={() => handleTechClick(tech)}
      className="skill-pill px-4 py-2 bg-slate-700/50 hover:bg-cyan-500/20 border border-slate-600 hover:border-cyan-400 rounded-full text-slate-300 hover:text-cyan-300 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-800"
      aria-label={`Copy ${tech} to clipboard`}
      type="button"
    >
      {tech}
    </button>
  );

  const TechnologyIcon = ({ tech, size = 'medium' }: { tech: string; size?: 'small' | 'medium' }) => {
    const iconSize = size === 'small' ? 'w-6 h-6' : 'w-12 h-12';
    
    if (imageErrors.has(tech)) {
      return (
        <button 
          className={`${iconSize} rounded bg-slate-600 flex items-center justify-center text-xs text-slate-400 cursor-pointer hover:scale-110 transition-transform duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-400`}
          onClick={() => handleTechClick(tech)}
          title={tech}
          type="button"
          aria-label={`Copy ${tech} to clipboard`}
        >
          {tech.slice(0, 3)}
        </button>
      );
    }

    return (
      <div className="tech-icon group relative">
        <img
          src={`/assets/icons/${tech}.svg`} // ⭐️ FIX APPLIED HERE: Added '/assets' for correct path
          className={`${iconSize} hover:scale-110 transition-transform duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-400 rounded`}
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
        <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition text-xs text-cyan-300 capitalize bg-slate-800 px-2 py-1 rounded pointer-events-none z-10">
          {tech.replace('-', ' ')}
        </span>
      </div>
    );
  };

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
          className="w-36 h-36 rounded-full avatar-pulse border-4 border-cyan-400/30 shadow-lg bg-slate-600 flex items-center justify-center text-white text-lg font-semibold"
          aria-label="Avatar placeholder"
        >
          {name.split(' ').map(n => n[0]).join('')}
        </div>
      ) : (
        <img
          src={avatarSrc}
          alt={`${name} Avatar`}
          className="w-36 h-36 rounded-full avatar-pulse border-4 border-cyan-400/30 shadow-lg"
          loading="eager"
          onError={handleAvatarError}
        />
      )}
      {isAvatarHovered && (
        <div className="absolute inset-0 rounded-full bg-cyan-400/20 animate-ping" aria-hidden="true" />
      )}
    </div>
  );

  const FeaturedProject = ({ img, index }: { img: { src: string; alt: string }; index: number }) => {
    const [imageError, setImageError] = useState(false);

    if (imageError) {
      return (
        <div className="relative group overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 bg-slate-700 h-24 flex items-center justify-center">
          <div className="text-slate-400 text-sm text-center px-2">
            Image not available
          </div>
        </div>
      );
    }

    return (
      <div className="relative group overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
        <img
          src={img.src}
          className="w-full h-24 object-cover transition-transform duration-300 group-hover:scale-110"
          alt={img.alt}
          loading="lazy"
          onError={() => setImageError(true)}
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
          <span className="text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            View Project
          </span>
        </div>
      </div>
    );
  };

  const CopyFeedbackToast = () => (
    <div 
      className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-fade-in"
      role="alert"
      aria-live="polite"
    >
      Copied &quot;{copiedTech}&quot; to clipboard!
    </div>
  );

  return (
    <header className="relative overflow-visible py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-black">
      <AnimatedBackground />

      <div className="container mx-auto px-6 flex flex-col lg:flex-row items-start gap-8 relative z-10">
        {/* Main Content */}
        <div className="flex-1">
          <div className="kicker mb-2 text-cyan-400">Hello — I&apos;m</div>
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
            <h2 id="core-technologies-heading" className="kicker text-cyan-400">
              Core Technologies
            </h2>
            <div className="mt-4 flex flex-wrap gap-3">
              {coreTechnologies.map((tech) => (
                <TechnologyPill key={tech} tech={tech} />
              ))}
            </div>
          </section>

          {/* Tech Icons Grid */}
          <section aria-labelledby="tech-stack-heading" className="mt-10">
            <h2 id="tech-stack-heading" className="kicker text-cyan-400">
              Tech Stack
            </h2>
            <div 
              className="mt-4 grid grid-cols-6 md:grid-cols-9 lg:grid-cols-10 gap-4"
              role="list"
              aria-label="Technology icons"
            >
              {orbitTechnologies.map((tech) => (
                <div key={tech} role="listitem">
                  <TechnologyIcon tech={tech} />
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="w-full lg:w-96 shrink-0">
          <div className="relative p-6 rounded-2xl flex flex-col items-center bg-gradient-to-b from-white/5 to-white/1 border border-white/10 backdrop-blur-sm shadow-xl">
            <AvatarSection />

            <div className="mt-4 text-center">
              <div className="font-semibold text-white text-xl">{name}</div>
              <div className="text-sm text-slate-400 mt-1">{title}</div>
            </div>

            <div className="mt-4 text-sm text-slate-300 text-center">
              {isAvatarHovered ? "Nice to meet you!" : "Hover or focus the avatar for a surprise"}
            </div>

            {/* Orbiting Icons */}
            {showOrbitAnimation && (
              <div className="absolute -left-16 top-6 flex flex-col gap-3 animate-bounce" aria-hidden="true">
                {displayedOrbitTechnologies.map((tech, index) => (
                  <div
                    key={tech}
                    className="tech-icon animate-pulse"
                    style={{ animationDelay: `${index * 0.2}s` }}
                  >
                    <TechnologyIcon tech={tech} size="small" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Featured Preview */}
          <section aria-labelledby="featured-projects-heading" className="mt-8">
            <h3 id="featured-projects-heading" className="kicker text-cyan-400">
              Featured Projects
            </h3>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {featuredImages.map((img, index) => (
                <FeaturedProject key={index} img={img} index={index} />
              ))}
            </div>
          </section>

          {/* Quick Stats */}
          <section aria-labelledby="quick-stats-heading" className="mt-8 p-4 rounded-lg bg-white/5 border border-white/10">
            <h3 id="quick-stats-heading" className="kicker text-cyan-400 mb-3">
              Quick Stats
            </h3>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-cyan-300">4+</div>
                <div className="text-xs text-slate-400">Years Experience</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-cyan-300">18+</div>
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

// Separate styles component for better organization
const HeroStyles: React.FC = () => (
  <style jsx>{`
    @keyframes fade-in {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in {
      animation: fade-in 0.3s ease-out;
    }
    .glitch {
      position: relative;
      color: white;
      text-shadow: 0.05em 0 0 rgba(255, 0, 0, 0.75), -0.025em -0.05em 0 rgba(0, 255, 0, 0.75), 0.025em 0.05em 0 rgba(0, 0, 255, 0.75);
    }
    .glitch::before, .glitch::after {
      content: attr(data-text);
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
    .glitch::before {
      animation: glitch-1 0.5s infinite;
      color: rgba(255, 0, 0, 0.75);
      z-index: -1;
    }
    .glitch::after {
      animation: glitch-2 0.5s infinite;
      color: rgba(0, 255, 0, 0.75);
      z-index: -2;
    }
    @keyframes glitch-1 {
      0%, 100% { transform: translate(0); }
      20% { transform: translate(-2px, 2px); }
      40% { transform: translate(-2px, -2px); }
      60% { transform: translate(2px, 2px); }
      80% { transform: translate(2px, -2px); }
    }
    @keyframes glitch-2 {
      0%, 100% { transform: translate(0); }
      20% { transform: translate(2px, -2px); }
      40% { transform: translate(2px, 2px); }
      60% { transform: translate(-2px, -2px); }
      80% { transform: translate(-2px, 2px); }
    }
    .blob {
      position: absolute;
      border-radius: 50%;
      background: linear-gradient(45deg, rgba(6, 182, 212, 0.3), rgba(14, 165, 233, 0.3));
      filter: blur(40px);
      animation: blob-move 10s infinite ease-in-out;
    }
    .blob-a { width: 200px; height: 200px; top: 10%; left: 10%; }
    .blob-b { width: 150px; height: 150px; top: 50%; right: 10%; animation-delay: 2s; }
    .blob-c { width: 100px; height: 100px; bottom: 10%; left: 50%; animation-delay: 4s; }
    @keyframes blob-move {
      0%, 100% { transform: translate(0, 0) scale(1); }
      33% { transform: translate(30px, -30px) scale(1.1); }
      66% { transform: translate(-20px, 20px) scale(0.9); }
    }
    .ring {
      position: absolute;
      top: -4px;
      left: -4px;
      width: calc(100% + 8px);
      height: calc(100% + 8px);
      border: 2px solid rgba(6, 182, 212, 0.5);
      border-radius: 50%;
      animation: ring-pulse 2s infinite;
    }
    @keyframes ring-pulse {
      0% { transform: scale(1); opacity: 1; }
      100% { transform: scale(1.2); opacity: 0; }
    }
    .avatar-pulse {
      animation: avatar-pulse 3s infinite;
    }
    @keyframes avatar-pulse {
      0%, 100% { box-shadow: 0 0 0 0 rgba(6, 182, 212, 0.4); }
      50% { box-shadow: 0 0 0 10px rgba(6, 182, 212, 0); }
    }
    .kicker {
      font-size: 0.875rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .skill-pill {
      font-size: 0.875rem;
      font-weight: 500;
    }
    .tech-icon {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  `}</style>
);

export default Hero;
