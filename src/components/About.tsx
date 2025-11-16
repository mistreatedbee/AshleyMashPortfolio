import React, { useEffect, useState } from 'react';

// --- Sub-Components ---

interface CounterProps {
  to: number;
  label: string;
  suffix?: string;
}

const Counter: React.FC<CounterProps> = ({ to, label, suffix = '' }) => {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = Math.max(1, Math.floor(to / 50));
    const id = setInterval(() => {
      start += step;
      if (start >= to) {
        setVal(to);
        clearInterval(id);
      } else {
        setVal(start);
      }
    }, 20);
    return () => clearInterval(id);
  }, [to]);
  return (
    <div className="text-center">
      <div className="text-2xl font-bold text-cyan-300">{val}{suffix}</div>
      <div className="text-sm text-slate-400">{label}</div>
    </div>
  );
};

interface SkillProps {
  name: string;
  level: number; // 0-100
}

const SkillBar: React.FC<SkillProps> = ({ name, level }) => {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const timer = setTimeout(() => setProgress(level), 500);
    return () => clearTimeout(timer);
  }, [level]);

  return (
    <div className="mb-4">
      <div className="flex justify-between text-sm text-slate-300 mb-1">
        <span>{name}</span>
        <span>{progress}%</span>
      </div>
      <div className="w-full bg-slate-700 rounded-full h-2">
        <div
          className="bg-gradient-to-r from-cyan-400 to-green-400 h-2 rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

// --- Main Component ---

interface AboutProps {
  profileImage?: string;
  bio?: string;
  education?: Array<{ institution: string; degree: string; year: string }>;
  strengths?: string[];
  skills?: SkillProps[];
  stats?: Array<{ to: number; label: string; suffix?: string }>;
  experience?: Array<{ role: string; company: string; period: string; description: string }>;
}

const About: React.FC<AboutProps> = ({
  // ⭐️ FIX APPLIED HERE: Changed from "/public/images/avatar-1.jpeg" to "/assets/images/avatar-1.jpeg"
  profileImage = "/assets/images/avatar-1.jpeg", // Placeholder image path
  bio = "I'm a Software Engineer and IT Specialist from Nelspruit. I build performant systems, mobile apps and backend services. I focus on architecture, automation and delivering quality.",
  education = [
    { institution: "Eduvos", degree: "BSc Software Engineering", year: "2025" },
    { institution: "Rob Ferreira High School", degree: "Matric", year: "2021" },
    { institution: "Curro Nelspruit", degree: "High School", year: "2017–2019" },
  ],
  strengths = [
    "System Design & Architecture",
    "Full-Stack Development",
    "Mobile Apps & APIs",
    "Automation & Tooling",
  ],
  skills = [
    { name: "JavaScript/TypeScript", level: 90 },
    { name: "React/Vue", level: 85 },
    { name: "Node.js", level: 80 },
    { name: "Python", level: 75 },
    { name: "Database Design", level: 85 },
  ],
  stats = [
    { to: 4, label: "Years learning" },
    { to: 12, label: "Technologies" },
    { to: 18, label: "Projects (approx)" },
    { to: 999, label: "Cups of coffee" },
  ],
  experience = [
    { role: "Software Engineer Intern", company: "Tech Company", period: "2023–Present", description: "Developed scalable web applications and automated CI/CD pipelines." },
    { role: "IT Specialist", company: "Local Firm", period: "2022–2023", description: "Managed IT infrastructure and provided technical support." },
  ],
}) => {
  return (
    <section id="about" className="py-20 bg-gradient-to-b from-transparent to-black/10">
      <div className="container mx-auto px-6">
        {/* Header with Profile Image */}
        <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
          <div className="relative">
            <img
              src={profileImage}
              alt="Profile"
              className="w-32 h-32 rounded-full border-4 border-cyan-400/30 shadow-lg"
            />
            <div className="absolute inset-0 rounded-full bg-cyan-400/20 animate-pulse"></div>
          </div>
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-bold text-cyan-300 mb-4">About Me</h2>
            <p className="text-slate-200 max-w-2xl leading-relaxed">{bio}</p>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Left Column: Education and Experience */}
          <div className="space-y-8">
            {/* Education Timeline */}
            <div className="p-6 bg-white/3 rounded-xl border border-white/5">
              <h3 className="text-xl font-semibold text-cyan-300 mb-4">Education</h3>
              <div className="space-y-4">
                {education.map((item, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="w-3 h-3 bg-cyan-400 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-medium text-slate-200">{item.degree}</h4>
                      <p className="text-slate-400 text-sm">{item.institution} • {item.year}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Experience */}
            <div className="p-6 bg-white/3 rounded-xl border border-white/5">
              <h3 className="text-xl font-semibold text-cyan-300 mb-4">Experience</h3>
              <div className="space-y-4">
                {experience.map((item, index) => (
                  <div key={index} className="border-l-2 border-cyan-400/50 pl-4">
                    <h4 className="font-medium text-slate-200">{item.role}</h4>
                    <p className="text-cyan-400 text-sm">{item.company} • {item.period}</p>
                    <p className="text-slate-400 text-sm mt-1">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Strengths, Skills, and Stats */}
          <div className="space-y-8">
            {/* Strengths */}
            <div className="p-6 bg-white/3 rounded-xl border border-white/5">
              <h3 className="text-xl font-semibold text-cyan-300 mb-4">Strengths</h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {strengths.map((strength, index) => (
                  <li key={index} className="flex items-center gap-2 text-slate-300">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    {strength}
                  </li>
                ))}
              </ul>
            </div>

            {/* Skills */}
            <div className="p-6 bg-white/3 rounded-xl border border-white/5">
              <h3 className="text-xl font-semibold text-cyan-300 mb-4">Skills</h3>
              {skills.map((skill, index) => (
                <SkillBar key={index} name={skill.name} level={skill.level} />
              ))}
            </div>

            {/* Stats */}
            <div className="p-6 bg-white/3 rounded-xl border border-white/5">
              <h3 className="text-xl font-semibold text-cyan-300 mb-4">Stats</h3>
              <div className="grid grid-cols-2 gap-6">
                {stats.map((stat, index) => (
                  <Counter key={index} to={stat.to} label={stat.label} suffix={stat.suffix} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <p className="text-slate-400 mb-4">Interested in collaborating?</p>
          <a
            href="#contact"
            className="inline-block px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors duration-300"
          >
            Get In Touch
          </a>
        </div>
      </div>
    </section>
  );
};

export default About;
