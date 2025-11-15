import React, { useState, useEffect } from 'react';

interface SkillMapping {
  [key: string]: string;
}

interface SkillGroups {
  [key: string]: string[];
}

interface SkillsProps {
  mapping?: SkillMapping;
  groups?: SkillGroups;
  title?: string;
  description?: string;
  showSearch?: boolean;
  showCopyFeedback?: boolean;
}

const defaultMapping: SkillMapping = {
  'JavaScript': '/public/icons/javascript.svg',
  'TypeScript': '/public/icons/typescript.svg',
  'React': '/public/icons/react.svg',
  'React Native': '/public/icons/react-native.svg',
  'Node.js': '/public/icons/nodejs.svg',
  'Python': '/public/icons/python.svg',
  'MySQL': '/public/icons/mysql.svg',
  'MongoDB': '/public/icons/mongodb.svg',
  'Firebase': '/public/icons/firebase.svg',
  'Docker': '/public/icons/docker.svg',
  'PHP': '/public/icons/php.svg',
  'Git': '/public/icons/git.svg',
  'Java': '/public/icons/java.svg',
  'C++': '/public/icons/cpp.svg',
  'C#': '/public/icons/csharp.svg',
  'Kotlin': '/public/icons/kotlin.svg',
  'Swift': '/public/icons/swift.svg',
  'Dart': '/public/icons/dart.svg',
  'Go': '/public/icons/go.svg',
  'Rust': '/public/icons/rust.svg',
  'Ruby': '/public/icons/ruby.svg',
  'SQL': '/public/icons/sql.svg',
  'HTML': '/public/icons/html.svg',
  'CSS': '/public/icons/css.svg',
  'Linux': '/public/icons/linux.svg',
  'Tailwind': '/public/icons/tailwind.svg',
  'Vite': '/public/icons/vite.svg',
  'Express': '/public/icons/express.svg', // Added for completeness
  'Firestore': '/public/icons/firestore.svg',
  'Redis': '/public/icons/redis.svg',
  'VS Code': '/public/icons/vscode.svg',
  'Postman': '/public/icons/postman.svg',
  'Software Engineering': '/public/icons/software.svg',
  'System Design': '/public/icons/system.svg',
  'Full Stack': '/public/icons/fullstack.svg',
  'Mobile Development': '/public/icons/mobile.svg',
};

const defaultGroups: SkillGroups = {
  'Core': ['Software Engineering', 'System Design', 'Full Stack', 'Mobile Development'],
  'Frontend': ['HTML', 'CSS', 'Tailwind', 'JavaScript', 'TypeScript', 'React', 'React Native'],
  'Backend': ['Node.js', 'Express', 'Python', 'PHP', 'Java', 'C++', 'C#'],
  'Databases': ['MySQL', 'MongoDB', 'Firestore', 'Redis', 'SQL'],
  'Tools': ['Git', 'Docker', 'VS Code', 'Postman', 'Vite', 'Tailwind'],
};

const Skills: React.FC<SkillsProps> = ({
  mapping = defaultMapping,
  groups = defaultGroups,
  title = "Skills & Technologies",
  description = "Click a skill to copy it to clipboard.",
  showSearch = true,
  showCopyFeedback = true,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedSkill, setCopiedSkill] = useState<string | null>(null);
  const [filteredGroups, setFilteredGroups] = useState(groups);

  useEffect(() => {
    if (searchTerm) {
      const filtered: SkillGroups = {};
      Object.entries(groups).forEach(([category, skills]) => {
        const filteredSkills = skills.filter(skill =>
          skill.toLowerCase().includes(searchTerm.toLowerCase())
        );
        if (filteredSkills.length > 0) {
          filtered[category] = filteredSkills;
        }
      });
      setFilteredGroups(filtered);
    } else {
      setFilteredGroups(groups);
    }
  }, [searchTerm, groups]);

  const handleCopy = async (skill: string) => {
    try {
      await navigator.clipboard.writeText(skill);
      if (showCopyFeedback) {
        setCopiedSkill(skill);
        setTimeout(() => setCopiedSkill(null), 2000);
      }
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <section id="skills" className="py-20 bg-gradient-to-b from-transparent to-black/5">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-cyan-300 mb-4">{title}</h2>
        <p className="text-slate-300 mb-6">{description}</p>

        {/* Search Bar */}
        {showSearch && (
          <div className="mb-8">
            <input
              type="text"
              placeholder="Search skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full max-w-md px-4 py-2 bg-slate-800/50 border border-slate-600 rounded-lg text-slate-300 placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition"
            />
          </div>
        )}

        {/* Copy Feedback Toast */}
        {copiedSkill && (
          <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-fade-in">
            Copied "{copiedSkill}" to clipboard!
          </div>
        )}

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(filteredGroups).map(([category, skills]) => (
            <div
              key={category}
              className="p-6 bg-white/3 rounded-xl border border-white/5 hover:border-cyan-400/30 transition-all duration-300 group"
            >
              <h4 className="font-semibold text-cyan-300 mb-4 group-hover:text-cyan-200 transition">{category}</h4>
              <div className="flex flex-wrap gap-3">
                {skills.map((skill) => (
                  <button
                    key={skill}
                    onClick={() => handleCopy(skill)}
                    className="skill-pill flex items-center gap-2 px-3 py-2 bg-slate-700/50 hover:bg-cyan-500/20 border border-slate-600 hover:border-cyan-400/50 rounded-lg text-slate-300 hover:text-cyan-300 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    aria-label={`Copy ${skill} to clipboard`}
                  >
                    {mapping[skill] ? (
                      <img
                        src={mapping[skill]}
                        className="w-5 h-5"
                        alt={`${skill} icon`}
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'; // Hide if icon fails to load
                        }}
                      />
                    ) : (
                      <div className="w-5 h-5 bg-cyan-400/20 rounded-full flex items-center justify-center text-xs font-bold text-cyan-300">
                        {skill.charAt(0)}
                      </div>
                    )}
                    <span className="text-sm font-medium">{skill}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* No Results Message */}
        {Object.keys(filteredGroups).length === 0 && searchTerm && (
          <div className="text-center mt-8">
            <p className="text-slate-400">No skills found matching "{searchTerm}".</p>
          </div>
        )}
      </div>

      {/* Custom CSS for animations (add to your global styles or use Tailwind) */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </section>
  );
};

export default Skills;
