import React, { useState } from "react";

const Footer = ({
  name = "Ashley Mashigo",
  title = "Software Engineer • IT Specialist • Full-Stack Developer",
  socialLinks = {
    github: "https://github.com/",
    linkedin: "https://linkedin.com/",
    twitter: "https://twitter.com/",
    email: "mailto:your.email@example.com",
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
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    // Simulate subscription (replace with actual API call)
    if (email) {
      setIsSubscribed(true);
      setEmail("");
      setTimeout(() => setIsSubscribed(false), 3000); // Reset after 3 seconds
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative mt-20 py-10 border-t border-white/10 bg-black/20 backdrop-blur-xl">
      
      {/* Glowing top bar */}
      <div className="absolute -top-[2px] left-0 w-full h-[2px] bg-gradient-to-r from-yellow-400 via-green-500 to-red-600 animate-pulse"></div>

      <div className="container mx-auto px-6">
        
        {/* Top Section: Main Content */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-8">
          
          {/* Left Side: Branding and Description */}
          <div className="text-slate-300 text-center md:text-left">
            <div className="text-lg font-semibold tracking-wide">
              © {new Date().getFullYear()} {name}
            </div>
            <div className="text-sm text-slate-400 mt-1">
              {title}
            </div>
            <div className="text-xs text-slate-500 mt-2">
              Building innovative solutions with passion and precision.
            </div>
          </div>

          {/* Center: Navigation Links */}
          <div className="flex flex-wrap justify-center gap-4 md:gap-6">
            {navLinks.map((link, index) => (
              <a
                key={index}
                href={link.href}
                className="text-slate-400 hover:text-cyan-300 transition-colors duration-300 text-sm font-medium"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Right Side: Social Icons */}
          <div className="flex items-center gap-4">
            <a
              href={socialLinks.github}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative"
              aria-label="GitHub"
            >
              <img
                src="/public/icons/github.svg"
                className="w-7 h-7 transition-transform duration-300 group-hover:scale-125"
                alt="GitHub"
              />
              <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition text-xs text-slate-400">
                GitHub
              </span>
            </a>

            <a
              href={socialLinks.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative"
              aria-label="LinkedIn"
            >
              <img
                src="/public/icons/linkedin.svg"
                className="w-7 h-7 transition-transform duration-300 group-hover:scale-125"
                alt="LinkedIn"
              />
              <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition text-xs text-slate-400">
                LinkedIn
              </span>
            </a>

            <a
              href={socialLinks.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative"
              aria-label="Twitter"
            >
              <img
                src="/public/icons/twitter.svg"
                className="w-7 h-7 transition-transform duration-300 group-hover:scale-125"
                alt="Twitter"
              />
              <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition text-xs text-slate-400">
                Twitter
              </span>
            </a>

            <a
              href={socialLinks.email}
              className="group relative"
              aria-label="Email"
            >
              <img
                src="/public/icons/email.svg"
                className="w-7 h-7 transition-transform duration-300 group-hover:scale-125"
                alt="Email"
              />
              <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition text-xs text-slate-400">
                Email
              </span>
            </a>

            {/* Custom AM Icon */}
            <a href="#home" className="group relative" aria-label="Portfolio">
              <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#0A0F24] border border-cyan-400/30 text-cyan-300 font-bold text-sm transition-all duration-300 group-hover:scale-125 group-hover:border-cyan-400 group-hover:text-cyan-200">
                AM
              </div>
              <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition text-xs text-slate-400">
                Portfolio
              </span>
            </a>
          </div>
        </div>

        {/* Middle Section: Newsletter Signup (Optional) */}
        {showNewsletter && (
          <div className="flex flex-col items-center gap-4 mb-8">
            <h3 className="text-slate-300 text-sm font-medium">Stay Updated</h3>
            <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="px-3 py-2 bg-slate-800/50 border border-slate-600 rounded-md text-slate-300 placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition"
                required
              />
              <button
                type="submit"
                className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-md transition-colors duration-300"
              >
                Subscribe
              </button>
            </form>
            {isSubscribed && (
              <p className="text-green-400 text-xs">Thanks for subscribing!</p>
            )}
          </div>
        )}

        {/* Bottom Section: Legal Links and Back to Top */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex gap-6 text-xs text-slate-500">
            <a href="/privacy" className="hover:text-slate-400 transition">Privacy Policy</a>
            <a href="/terms" className="hover:text-slate-400 transition">Terms of Service</a>
          </div>
          {showBackToTop && (
            <button
              onClick={scrollToTop}
              className="flex items-center gap-2 text-slate-400 hover:text-cyan-300 transition-colors duration-300 text-sm"
              aria-label="Back to Top"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              Back to Top
            </button>
          )}
        </div>
      </div>

      {/* Glow line at bottom */}
      <div className="mt-8 h-[1px] w-full bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent"></div>
    </footer>
  );
};

export default Footer;
