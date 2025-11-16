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

// --- Inline SVG Icons (Lucide Paths) ---

const ICONS = {
    github: "M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.4 5.4 0 0 0 20 4.77 5.07 5.07 0 0 0 19.9 2.1c0 0-1.4.3-4.5 3.5a13.2 13.2 0 0 0-6 0c-3.1-3.2-4.5-3.5-4.5-3.5A5.07 5.07 0 0 0 4 4.77a5.4 5.4 0 0 0 0 3.87c0 5.42 3.3 6.57 6.44 7A3.37 3.37 0 0 0 9 18.13V22",
    linkedin: "M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2zM4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z",
    twitter: "M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.5 5 4c1.3 1.2 3 2 5 2C8 3.5 10 2 10 2c-3.2 1.3-5 5.5-5 5.5",
    email: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6",
    arrowUp: "M5 10l7-7m0 0l7 7m-7-7v18",
};

const Icon = ({ path, label, href }: { path: string; label: string; href: string }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="group relative text-slate-500 hover:text-cyan-400 transition-colors duration-300"
    aria-label={label}
  >
    <svg
      className="w-6 h-6 transition-transform duration-300 group-hover:scale-110"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d={path} />
    </svg>
  </a>
);

// --- Footer Component ---

const Footer: React.FC<FooterProps> = ({
  name = "Ashley Mashigo",
  title = "Software Engineer | Full-Stack Developer",
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
      console.log(`Subscribing ${email}...`);
      setIsSubscribed(true);
      setEmail("");
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative pt-16 pb-8 bg-gray-950/90 backdrop-blur-md font-mono text-white/90 border-t border-cyan-500/10">

      {/* Main Container */}
      <div className="container mx-auto px-6 max-w-6xl">

        {/* Logo and Tagline */}
        <div className="flex flex-col items-center justify-center text-center pb-12 border-b border-gray-800/50">
          <div className="text-3xl font-extrabold text-cyan-400 mb-1 tracking-widest">
            {name.toUpperCase()}
          </div>
          <p className="text-sm text-slate-400 mb-6">
            {title}
          </p>

          {/* Navigation Links */}
          <nav className="flex flex-wrap justify-center gap-x-8 gap-y-3">
            {navLinks.map((link, index) => (
              <a
                key={index}
                href={link.href}
                className="text-slate-300 hover:text-cyan-400 transition-colors duration-200 text-sm font-medium tracking-wide border-b border-transparent hover:border-cyan-400/50"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        {/* Newsletter Section */}
        {showNewsletter && (
          <div className="flex flex-col items-center py-10 border-b border-gray-800/50">
            <h3 className="text-lg font-semibold text-cyan-400 mb-4">Get the Latest Dev Insights</h3>
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email address"
                className="flex-grow px-4 py-2 bg-gray-800/70 border border-gray-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
                required
              />
              <button
                type="submit"
                className="px-6 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-medium rounded-lg shadow-lg shadow-cyan-500/30 transition-colors duration-300"
              >
                Sign Up
              </button>
            </form>
            {isSubscribed && (
              <p className="text-green-400 text-xs mt-3 flex items-center gap-1 animate-pulse">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                Success! You're in the loop.
              </p>
            )}
          </div>
        )}

        {/* Bottom Bar: Copyright, Socials, Back to Top */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-slate-500">
            
            {/* Copyright */}
            <div className="flex flex-col sm:flex-row gap-4 items-center">
                <div className="order-2 sm:order-1">
                    &copy; {new Date().getFullYear()} {name}. All rights reserved.
                </div>
                <div className="order-1 sm:order-2 flex gap-4 text-xs">
                    <a href="/privacy" className="hover:text-cyan-400 transition">Privacy</a>
                    <a href="/terms" className="hover:text-cyan-400 transition">Terms</a>
                </div>
            </div>

            {/* Social and Back to Top */}
            <div className="flex items-center gap-6">
                {/* Social Icons */}
                <div className="flex gap-4">
                    {socialLinks.github && <Icon path={ICONS.github} label="GitHub" href={socialLinks.github} />}
                    {socialLinks.linkedin && <Icon path={ICONS.linkedin} label="LinkedIn" href={socialLinks.linkedin} />}
                    {socialLinks.twitter && <Icon path={ICONS.twitter} label="Twitter/X" href={socialLinks.twitter} />}
                    {socialLinks.email && <Icon path={ICONS.email} label="Email" href={socialLinks.email} />}
                </div>

                {/* Back to Top */}
                {showBackToTop && (
                    <button
                        onClick={scrollToTop}
                        className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 transition-colors duration-300 text-xs font-medium p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50"
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
    </footer>
  );
};

// Main App component to demonstrate the Footer
const App: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-950 font-sans text-white">
            <header className="p-12 text-center text-4xl font-extrabold tracking-tight text-cyan-400 bg-gray-900 shadow-xl shadow-gray-900/50">
                <h1 id="home">Portfolio Demonstration Layout</h1>
                <p className="mt-2 text-base text-slate-500 font-medium">This is where the main content would go.</p>
            </header>
            
            {/* Minimal content to ensure the page has scrollability for the 'Back to Top' button */}
            <main className="container mx-auto p-12 max-w-7xl">
                <div className="h-[100vh] bg-gray-800/20 border border-gray-700 rounded-xl p-8 flex items-center justify-center text-slate-400">
                    Scroll down to see the footer and its 'Back to Top' functionality.
                </div>
            </main>
            
            <Footer />
        </div>
    );
};

export default App;
