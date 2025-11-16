import React, { useState } from "react";

// --- TypeScript Interfaces ---

interface SocialLinks {
  github?: string;
  linkedin?: string;
  twitter?: string;
  email?: string;
}

interface NavLink {
  label: string;
  href: string;
}

interface FooterProps {
  name?: string;
  title?: string;
  socialLinks?: SocialLinks;
  navLinks?: NavLink[];
  showNewsletter?: boolean;
  showBackToTop?: boolean;
}

// --- Inline SVG Icons (Replacing image paths) ---

const Icon = ({ path, label, href }: { path: string; label: string; href: string }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="group relative text-slate-400 hover:text-cyan-400 transition-colors duration-300"
    aria-label={label}
  >
    <svg
      className="w-7 h-7 transition-transform duration-300 group-hover:scale-110"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d={path} />
    </svg>
    <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-xs bg-slate-800 px-2 py-1 rounded-md whitespace-nowrap text-cyan-300 pointer-events-none">
      {label}
    </span>
  </a>
);

// Paths derived from Lucide icons
const ICONS = {
    github: "M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.4 5.4 0 0 0 20 4.77 5.07 5.07 0 0 0 19.9 2.1c0 0-1.4.3-4.5 3.5a13.2 13.2 0 0 0-6 0c-3.1-3.2-4.5-3.5-4.5-3.5A5.07 5.07 0 0 0 4 4.77a5.4 5.4 0 0 0 0 3.87c0 5.42 3.3 6.57 6.44 7A3.37 3.37 0 0 0 9 18.13V22",
    linkedin: "M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2zM4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z",
    twitter: "M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.5 5 4c1.3 1.2 3 2 5 2C8 3.5 10 2 10 2c-3.2 1.3-5 5.5-5 5.5", // Using the path for 'X' or Bird
    email: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6",
    arrowUp: "M5 10l7-7m0 0l7 7m-7-7v18",
};

// --- Footer Component ---

const Footer: React.FC<FooterProps> = ({
  name = "Ashley Mashigo",
  title = "Software Engineer • IT Specialist • Full-Stack Developer",
  socialLinks = {
    github: "https://github.com/ashleymashigo",
    linkedin: "https://linkedin.com/in/ashleymashigo",
    twitter: "https://twitter.com/ashleymashigo",
    email: "mailto:ashley.mashigo@example.com",
  },
  navLinks = [
    { label: "Home", href: "#home" },
    { label: "About", href: "#about" },
    { label: "Projects", href: "#projects" },
    { label: "Contact", href: "#contact" },
  ],
  showNewsletter = true,
  showBackToTop = true,
}) => {
  const [email, setEmail] = useState<string>("");
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      // In a real app, you would make an API call here.
      console.log(`Subscribing ${email}...`);
      setIsSubscribed(true);
      setEmail("");
      setTimeout(() => setIsSubscribed(false), 3000); // Reset message after 3 seconds
    }
  };

  const scrollToTop = () => {
    // This uses window.scrollTo which is fine for simple navigation
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative mt-20 py-10 border-t border-cyan-800/50 bg-slate-900/80 backdrop-blur-xl">

      {/* Glowing top bar for visual effect */}
      <div className="absolute -top-[2px] left-0 w-full h-[2px] bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-600 animate-pulse-slow"></div>

      <div className="container mx-auto px-6 max-w-7xl">

        {/* Top Section: Main Content */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-8 pb-8 border-b border-slate-700/50">

          {/* Left Side: Branding and Description */}
          <div className="text-slate-300 text-center md:text-left order-2 md:order-1">
            <div className="text-xl font-bold tracking-wider text-cyan-300">
              © {new Date().getFullYear()} {name}
            </div>
            <div className="text-sm text-slate-400 mt-1 font-medium">
              {title}
            </div>
            <div className="text-xs text-slate-500 mt-2 max-w-xs">
              Building innovative solutions with passion and precision.
            </div>
          </div>

          {/* Center: Navigation Links */}
          <div className="flex flex-wrap justify-center gap-4 md:gap-8 order-1 md:order-2">
            {navLinks.map((link, index) => (
              <a
                key={index}
                href={link.href}
                className="text-slate-400 hover:text-cyan-400 transition-colors duration-300 text-base font-semibold border-b border-transparent hover:border-cyan-400"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        {/* Middle Section: Newsletter Signup (Optional) */}
        {showNewsletter && (
          <div className="flex flex-col items-center gap-4 mb-8">
            <h3 className="text-cyan-300 text-lg font-bold tracking-wide">Stay Updated</h3>
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="px-4 py-2 w-72 bg-slate-800/50 border border-slate-600 rounded-lg text-slate-300 placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition"
                required
              />
              <button
                type="submit"
                className="px-6 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-medium rounded-lg shadow-lg shadow-cyan-500/30 transition-colors duration-300"
              >
                Subscribe
              </button>
            </form>
            {isSubscribed && (
              <p className="text-green-400 text-sm mt-2 flex items-center gap-1 animate-pulse">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                Thanks for subscribing!
              </p>
            )}
          </div>
        )}

        {/* Bottom Section: Social Icons, Legal Links and Back to Top */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-4">

            {/* Social Icons */}
            <div className="flex items-center gap-6 order-2 md:order-1">
                {socialLinks.github && <Icon path={ICONS.github} label="GitHub" href={socialLinks.github} />}
                {socialLinks.linkedin && <Icon path={ICONS.linkedin} label="LinkedIn" href={socialLinks.linkedin} />}
                {socialLinks.twitter && <Icon path={ICONS.twitter} label="Twitter/X" href={socialLinks.twitter} />}
                {socialLinks.email && <Icon path={ICONS.email} label="Email" href={socialLinks.email} />}

                {/* Custom AM Icon (Placeholder for Logo/Portfolio Home) */}
                <a href="#home" className="group relative" aria-label="Portfolio Home">
                    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-cyan-500/10 border border-cyan-400/50 text-cyan-300 font-extrabold text-sm transition-all duration-300 group-hover:scale-110 group-hover:border-cyan-400 group-hover:text-cyan-200 shadow-lg shadow-cyan-500/20">
                    AM
                    </div>
                </a>
            </div>

            {/* Legal Links and Back to Top (Grouped) */}
            <div className="flex items-center gap-6 order-1 md:order-2">
                <div className="flex gap-4 text-xs text-slate-500">
                    <a href="/privacy" className="hover:text-slate-400 transition">Privacy Policy</a>
                    <a href="/terms" className="hover:text-slate-400 transition">Terms of Service</a>
                </div>
                {showBackToTop && (
                    <button
                        onClick={scrollToTop}
                        className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors duration-300 text-sm font-medium p-2 rounded-full border border-cyan-400/20 hover:border-cyan-400/50"
                        aria-label="Back to Top"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={ICONS.arrowUp} />
                        </svg>
                        Top
                    </button>
                )}
            </div>
        </div>
      </div>

      {/* Custom CSS for animation */}
      <style>
        {`
          @keyframes pulse-slow {
            0%, 100% { opacity: 0.6; }
            50% { opacity: 1; }
          }
          .animate-pulse-slow {
            animation: pulse-slow 5s ease-in-out infinite;
          }
        `}
      </style>
    </footer>
  );
};

// Main App component to demonstrate the Footer
const App: React.FC = () => {
    return (
        <div className="min-h-[150vh] bg-slate-900 font-sans text-white">
            <header className="p-8 text-center text-4xl font-bold text-cyan-400">
                Portfolio Page Content Above
                <div className="mt-4 text-sm text-slate-500">Scroll down to see the sticky footer in action.</div>
            </header>
            <main className="container mx-auto p-6 max-w-7xl">
                {/* Dummy content to ensure scrolling works for "Back to Top" button */}
                <div className="h-96 w-full bg-slate-800/50 rounded-lg p-6 mb-12">
                    Content Block 1
                </div>
                <div className="h-96 w-full bg-slate-800/50 rounded-lg p-6 mb-12">
                    Content Block 2
                </div>
                <div className="h-96 w-full bg-slate-800/50 rounded-lg p-6">
                    Content Block 3
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default App;
