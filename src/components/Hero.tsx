import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { Zap, Copy, FileText, Code } from "lucide-react";

// --- INTERFACE AND DEFAULTS --------------------------------------------------

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
  description:
    "I design, build and maintain scalable web and mobile applications with clean architecture and pragmatic engineering. I focus on performance, automation and real-world reliability.",
  coreTechnologies: [
    "JavaScript",
    "React",
    "React Native",
    "Node.js",
    "Python",
    "MySQL",
    "MongoDB",
    "Firebase",
    "Docker",
    "MQL4",
  ],
  orbitTechnologies: [
    "javascript", "typescript", "react", "nodejs", "python",
    "java", "cpp", "csharp", "kotlin", "swift", "go", "rust",
    "php", "mysql", "mongodb", "firebase", "docker", "git",
    "kubernetes", "aws", "azure", "gcp", "tensorflow", "pytorch",
  ],
  avatarSrc: "https://placehold.co/144x144/1e293b/94a3b8?text=AVATAR",
  featuredImages: [
    { src: "https://placehold.co/400x150/0f172a/06b6d4?text=Healthcare+System", alt: "Healthcare System" },
    { src: "https://placehold.co/400x150/0f172a/06b6d4?text=Social+Media+API", alt: "Social Media API" },
  ],
  showTypingEffect: true,
  showOrbitAnimation: true,
} as const;

const TYPING_SPEED = 30;
const COPY_FEEDBACK_DURATION = 2000;
const ORBIT_RADIUS = 200;

// --- REUSABLE HELPER COMPONENTS (Moved outside Hero for performance) ------------

const CallToActionButtons = () => (
  <div className="mt-8 flex flex-wrap gap-4 items-center">
    <a
      href="#projects"
      className="px-6 py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-600 text-black font-bold shadow-neon"
    >
      <Code className="inline w-4 h-4 mr-2" />
      View Projects
    </a>

    <a
      href="#contact"
      className="px-6 py-3 rounded-lg border border-cyan-500 text-cyan-300 transition-colors hover:bg-cyan-500/10"
    >
      Contact Me
    </a>

    <a
      href="/resume.pdf"
      target="_blank"
      rel="noopener noreferrer"
      className="px-6 py-3 rounded-lg border border-slate-400 text-slate-300 transition-colors hover:border-slate-300/80"
      aria-label="Download CV"
    >
      <FileText className="inline w-4 h-4 mr-2" />
      Download CV
    </a>
  </div>
);

const TechnologyPill: React.FC<{ tech: string; copiedTech: string | null; onClick: (tech: string) => void }> = ({ tech, copiedTech, onClick }) => (
  <button
    onClick={() => onClick(tech)}
    className="skill-pill px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-full text-slate-300 hover:text-cyan-300 hover:border-cyan-400 transition-all text-sm"
    aria-label={`Copy ${tech} to clipboard`}
  >
    {tech}
    {copiedTech === tech && (
      <Copy className="inline w-3 h-3 ml-2 text-green-400" aria-hidden="true" />
    )}
  </button>
);

const TechnologyIcon: React.FC<{
  tech: string;
  size?: "small" | "medium";
  imageErrors: Set<string>;
  onClick: (tech: string) => void;
  onError: (tech: string) => void;
}> = ({ tech, size = "medium", imageErrors, onClick, onError }) => {
  const classSize = size === "small" ? "w-6 h-6" : "w-10 h-10";
  const containerSize = size === "small" ? "w-8 h-8" : "w-12 h-12";

  if (imageErrors.has(tech)) {
    return (
      <button
        onClick={() => onClick(tech)}
        className={`${containerSize} bg-slate-600 flex items-center justify-center rounded-md text-xs font-bold text-white cursor-pointer`}
        aria-label={`Copy fallback text for ${tech} to clipboard`}
      >
        {tech.slice(0, 3).toUpperCase()}
      </button>
    );
  }

  // Use a button wrapper for correct a11y for interactive images
  return (
    <button
      onClick={() => onClick(tech)}
      className={`${containerSize} flex items-center justify-center bg-transparent`}
      aria-label={`Copy ${tech} icon to clipboard`}
    >
      <img
        src={`/assets/icons/${tech}.svg`}
        alt={`${tech} icon`}
        onError={() => onError(tech)}
        className={`${classSize} transition-transform hover:scale-110`}
      />
    </button>
  );
};

const FeaturedProject: React.FC<{ img: { src: string; alt: string } }> = ({ img }) => {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div className="h-24 bg-slate-700 rounded-lg flex items-center justify-center">
        <Zap className="w-4 h-4 text-red-500 mr-2" aria-hidden="true" />
        <span className="text-slate-300">{img.alt} (Error)</span>
      </div>
    );
  }

  return (
    <a href="#" className="relative group rounded-lg overflow-hidden shadow-lg block" aria-label={`View featured project: ${img.alt}`}>
      <img
        src={img.src}
        alt={img.alt}
        className="w-full h-24 object-cover group-hover:scale-110 transition-transform duration-500"
        onError={() => setError(true)}
      />
      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
        <span className="text-white font-bold text-sm">{img.alt}</span>
      </div>
    </a>
  );
};

// --- MAIN COMPONENT ----------------------------------------------------------

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
  const [isNameTyped, setIsNameTyped] = useState(false);

  const fullHeadingText = useMemo(() => `${name} — ${title}`, [name, title]);
  const displayedOrbitTechnologies = useMemo(
    () => orbitTechnologies.slice(0, 8),
    [orbitTechnologies]
  );

  // ---------------------------------------------
  // 🚀 SCI-FI TYPING + GLITCH EFFECT
  // ---------------------------------------------
  useEffect(() => {
    if (!showTypingEffect || !headingRef.current) return;

    const el = headingRef.current;
    el.textContent = "";
    let currentIndex = 0;
    setIsNameTyped(false);

    const scrambleDuration = 500;
    const scrambleStart = Date.now();
    let scrambleInterval: NodeJS.Timeout;

    const scramble = () => {
      if (Date.now() - scrambleStart < scrambleDuration) {
        el.textContent = Array.from({ length: fullHeadingText.length }, () =>
          String.fromCharCode(33 + Math.floor(Math.random() * 94))
        ).join("");
      } else {
        clearInterval(scrambleInterval);
        startTyping();
      }
    };

    scrambleInterval = setInterval(scramble, 50);

    const startTyping = () => {
      const typeCharacter = () => {
        if (currentIndex < fullHeadingText.length) {
          const prefix = fullHeadingText.slice(0, currentIndex + 1);
          const suffixLength = fullHeadingText.length - (currentIndex + 1);

          const suffix = Array.from({ length: suffixLength }, () =>
            String.fromCharCode(33 + Math.floor(Math.random() * 94))
          ).join("");

          el.textContent = prefix + suffix;
          currentIndex++;
        } else {
          clearInterval(typingIntervalRef.current);
          el.textContent = fullHeadingText;
          setIsNameTyped(true); // → activates CSS glitch
        }
      };

      typingIntervalRef.current = setInterval(typeCharacter, TYPING_SPEED);
    };

    return () => {
      clearInterval(scrambleInterval);
      if (typingIntervalRef.current)
        clearInterval(typingIntervalRef.current);
    };
  }, [fullHeadingText, showTypingEffect]);

  // ---------------------------------------------
  // 📋 Copy to clipboard (Modern API)
  // ---------------------------------------------
  const handleTechClick = useCallback(
    (tech: string) => {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(tech)
          .then(() => {
            setCopiedTech(tech);
            setTimeout(() => setCopiedTech(null), COPY_FEEDBACK_DURATION);
            onTechnologyClick?.(tech);
          })
          .catch(err => {
            console.error("Could not copy text to clipboard:", err);
            // Fallback for older browsers (optional, but good practice)
            // The original logic using document.execCommand could be here.
          });
      } else {
        // Fallback for older browsers/environments
        const textarea = document.createElement("textarea");
        textarea.value = tech;
        textarea.style.position = 'fixed'; // Prevent scrolling to the bottom
        document.body.appendChild(textarea);
        textarea.select();
        try {
            document.execCommand("copy");
            setCopiedTech(tech);
            setTimeout(() => setCopiedTech(null), COPY_FEEDBACK_DURATION);
            onTechnologyClick?.(tech);
        } catch (err) {
            console.error("Fallback copy failed:", err);
        } finally {
            textarea.remove();
        }
      }
    },
    [onTechnologyClick]
  );

  const handleImageError = useCallback(
    (tech: string) =>
      setImageErrors((prev) => new Set(prev).add(tech)),
    []
  );

  const handleAvatarError = useCallback(() => setAvatarError(true), []);

  // Avatar hover
  const handleAvatarEnter = useCallback(() => setIsAvatarHovered(true), []);
  const handleAvatarLeave = useCallback(() => setIsAvatarHovered(false), []);

  const AvatarSection = () => (
    <div
      className="relative inline-block cursor-pointer"
      onMouseEnter={handleAvatarEnter}
      onMouseLeave={handleAvatarLeave}
    >
      <div className={`ring-outer ${isAvatarHovered ? "animate-spin-slow" : ""}`} />

      {avatarError ? (
        <div className="w-36 h-36 rounded-full bg-slate-600 border-4 border-cyan-400/50 flex items-center justify-center text-4xl font-bold text-white">
          {name[0]}
        </div>
      ) : (
        <img
          src={avatarSrc}
          alt={`Avatar of ${name}`}
          className="w-36 h-36 rounded-full border-4 border-cyan-400 shadow-neon-sm object-cover"
          onError={handleAvatarError}
        />
      )}
    </div>
  );

  const CopyFeedbackToast = () =>
    copiedTech && (
      <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-3 rounded-lg shadow-xl z-50 animate-fade-in-out">
        <Copy className="inline w-4 h-4 mr-2" aria-hidden="true" />
        Copied "**{copiedTech}**"
      </div>
    );

  // --------------------------------------------------
  // MAIN RENDER
  // --------------------------------------------------
  return (
    <header className="relative py-24 min-h-screen bg-black text-white overflow-hidden" role="banner">
      {/* Background */}
      <div className="absolute inset-0 background-grid opacity-10" aria-hidden="true" />

      <div className="container mx-auto px-6 flex flex-col lg:flex-row gap-16 relative z-10">
        <div className="flex-1">
          <p className="kicker text-cyan-400 flex items-center mb-2">
            <Zap className="w-4 h-4 mr-2" aria-hidden="true" />
            Hello — I'm
          </p>

          <h1
            ref={headingRef}
            className={`text-4xl md:text-5xl lg:text-7xl font-extrabold digital-distortion ${
              isNameTyped ? "glitch-static" : ""
            }`}
            data-text={fullHeadingText}
          >
            {!showTypingEffect && fullHeadingText}
          </h1>

          <p className="mt-6 text-slate-300 max-w-2xl text-xl border-l-4 border-cyan-500/50 pl-4">
            {description}
          </p>

          <CallToActionButtons />

          <section className="mt-14" aria-labelledby="core-tech-heading">
            <h2 id="core-tech-heading" className="kicker text-cyan-400">
              <Code className="inline w-4 h-4 mr-2" aria-hidden="true" />
              Core Technologies
            </h2>

            <div className="mt-4 flex flex-wrap gap-3">
              {coreTechnologies.map((tech) => (
                <TechnologyPill key={tech} tech={tech} copiedTech={copiedTech} onClick={handleTechClick} />
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="w-full lg:w-96 shrink-0 mt-12 lg:mt-0" aria-label="Profile and Featured Projects">
          <div className="relative p-8 rounded-2xl border border-cyan-500/20 bg-white/5 flex flex-col items-center">
            <AvatarSection />

            <div className="mt-6 text-center">
              <div className="text-white text-2xl font-extrabold">{name}</div>
              <div className="text-cyan-400 text-sm font-mono mt-2">
                {title}
              </div>
            </div>

            {showOrbitAnimation && (
              <div className="orbit-container absolute inset-0 pointer-events-none" aria-hidden="true">
                {displayedOrbitTechnologies.map((tech, i) => {
                  const angle = (360 / displayedOrbitTechnologies.length) * i;
                  const centerX = 160; // Center of sidebar container minus padding/border offset
                  const centerY = 160;

                  return (
                    <div
                      key={tech}
                      className="orbit-item absolute"
                      style={{
                        "--orbit-angle": `${angle}deg`,
                        "--orbit-radius": `${ORBIT_RADIUS}px`,
                        "--orbit-delay": `${i * 0.15}s`,
                        // Position based on container center
                        top: `${centerY}px`,
                        left: `${centerX}px`,
                      } as React.CSSProperties}
                    >
                      {/* The TechnologyIcon handles the actual rendering and interaction */}
                      <TechnologyIcon
                        tech={tech}
                        size="small"
                        imageErrors={imageErrors}
                        onClick={handleTechClick}
                        onError={handleImageError}
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="mt-6 grid gap-4" role="group" aria-label="Featured Projects">
            {featuredImages.map((img, i) => (
              <FeaturedProject key={i} img={img} />
            ))}
          </div>
        </aside>
      </div>

      {CopyFeedbackToast()}
    </header>
  );
};

export default Hero;
