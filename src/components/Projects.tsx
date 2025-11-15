import React, { useState } from 'react';

const data = [
  {
    title:'Mobile Health — Patient–Doctor App',
    desc:'Location-based booking, virtual consults, doctor dashboard, notifications.',
    tech:['React Native','Firebase','Node.js'],
    img:'/assets/images/healthcare.jpg'
  },
  {
    title:'Socials — Social Marketplace App',
    desc:'Marketplace, jobs, events, accommodation listings.',
    tech:['React Native','Firebase'],
    img:'/assets/images/socialmedia.png'
  },
  {
    title:'Vehicle Marketplace',
    desc:'Cars marketplace with admin dashboard and RBAC.',
    tech:['PHP','MySQL','JS'],
    img:'/assets/images/carmarketplace.png'
  },
  {
    title:'Forex Trading Bot (MQL4)',
    desc:'Automated EA implementing smart money concepts.',
    tech:['MQL4','Python'],
    img:'/assets/images/Aiforextradingbot.jpg'
  },
  {
    title:'Restaurant Websites',
    desc:'Responsive websites with ordering systems.',
    tech:['HTML','Tailwind','JS'],
    img:'/assets/images/restaurant.png'
  },
  {
    title:'Sneaker Store',
    desc:'E-commerce store for sneakers with product pages and cart.',
    tech:['HTML','CSS','JS'],
    img:'/assets/images/sneakerspaza.jpg'
  },
  {
    title:'Service Link App',
    desc:'Service provider listing & booking app.',
    tech:['React Native','Firebase'],
    img:'/assets/images/servicerprovider.png'
  }
];

const iconMap = {
  'React Native': '/assets/icons/react-native.svg',
  'React': '/assets/icons/react.svg',
  'Firebase': '/assets/icons/firebase.svg',
  'Node.js': '/assets/icons/nodejs.svg',
  'PHP': '/assets/icons/php.svg',
  'MySQL': '/assets/icons/mysql.svg',
  'JS': '/assets/icons/javascript.svg',
  'MQL4': '/assets/icons/mongodb.svg',
  'Python': '/assets/icons/python.svg',
  'HTML': '/assets/icons/html.svg',
  'Tailwind': '/assets/icons/tailwind.svg',
  'Java': '/assets/icons/java.svg',
  'C++': '/assets/icons/cpp.svg',
  'C#': '/assets/icons/csharp.svg',
  'Kotlin': '/assets/icons/kotlin.svg',
  'Swift': '/assets/icons/swift.svg',
  'Dart': '/assets/icons/dart.svg',
  'Go': '/assets/icons/go.svg',
  'Rust': '/assets/icons/rust.svg',
  'Ruby': '/assets/icons/ruby.svg',
  'SQL': '/assets/icons/sql.svg',
  'CSS': '/assets/icons/css.svg',
  'Vite': '/assets/icons/vite.svg',
  'Express': '/assets/icons/express.svg',
  'Firestore': '/assets/icons/firestore.svg',
  'Redis': '/assets/icons/redis.svg',
  'VS Code': '/assets/icons/vscode.svg',
  'Postman': '/assets/icons/postman.svg',
  'Software Engineering': '/assets/icons/software.svg',
  'System Design': '/assets/icons/system.svg',
  'Full Stack': '/assets/icons/fullstack.svg',
  'Mobile Development': '/assets/icons/mobile.svg',
};

const Projects = () => {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="projects" className="py-20">
      <div className="container mx-auto px-6">
        <h2 className="text-xl font-bold text-cyan-300">Selected Projects</h2>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((p, idx) => (
            <div key={p.title} className="card tilt p-4 cursor-pointer" onClick={()=>setOpen(idx)}>
              <img src={p.img} alt={p.title} className="project-img mb-3" />
              <h3 className="font-semibold">{p.title}</h3>
              <p className="text-slate-300 mt-2">{p.desc}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {p.tech.map(t => (
                  <span key={t} className="skill-pill flex items-center gap-2">
                    <img src={iconMap[t] || '/assets/icons/javascript.svg'} className="w-5 h-5" alt={t} />
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {open !== null && (
        <div className="modal-backdrop" onClick={()=>setOpen(null)}>
          <div className="bg-[#071a2a] p-6 rounded-xl border border-white/6 w-[90%] max-w-3xl z-60">
            <h3 className="font-bold">{data[open].title}</h3>
            <img src={data[open].img} className="my-4 rounded-md" alt="" />
            <p className="text-slate-200 mt-2">{data[open].desc}</p>
            <div className="mt-4 flex gap-2">
              {data[open].tech.map(t => <span key={t} className="skill-pill">{t}</span>)}
            </div>
            <div className="mt-4 text-right">
              <button onClick={()=>setOpen(null)} className="px-4 py-2 rounded-md border">Close</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Projects;
