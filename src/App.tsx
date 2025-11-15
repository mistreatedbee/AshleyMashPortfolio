import React from 'react';
import CustomCursor from './components/CustomCursor';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Gallery from './components/Gallery';
import Contact from './components/Contact';
import Footer from './components/Footer';

import './index.css';

function App() {
  return (
    <div className="min-h-screen">
      <CustomCursor />
      <Navbar />
      <main className="pt-28">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Gallery />
        <Contact />
        <Footer />
      </main>
      
    </div>
  );
}

export default App;
