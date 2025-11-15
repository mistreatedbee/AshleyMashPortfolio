import React from 'react';

const Navbar: React.FC = () => {
  return (
    <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-[94%] max-w-6xl backdrop-blur-md bg-white/4 border border-white/6 rounded-xl p-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-sky-400">Ashley</div>
        <div className="hidden md:flex gap-6 ml-6 text-slate-200">
          <a href="#about" className="hover:text-white transition">About</a>
          <a href="#skills" className="hover:text-white transition">Skills</a>
          <a href="#projects" className="hover:text-white transition">Projects</a>
          <a href="#gallery" className="hover:text-white transition">Gallery</a>
          <a href="#contact" className="hover:text-white transition">Contact</a>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button className="px-3 py-1 rounded-md border border-white/6 hover:scale-105 transition">Resume</button>
        <button className="px-3 py-1 rounded-md bg-gradient-to-r from-cyan-400 to-sky-500 text-black">Hire Me</button>
      </div>
    </nav>
  );
}

export default Navbar;
