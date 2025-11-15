import React, { useState } from 'react';

const data = [
  {title:'Mobile Health — Patient–Doctor App', desc:'Location-based booking, virtual consults, doctor dashboard, notifications.', tech:['React Native','Firebase','Node.js'], img:'/public/images/healthcare.jpg'},
  {title:'Socials — Social Marketplace App', desc:'Marketplace, jobs, events, accommodation listings.', tech:['React Native','Firebase'], img:'/public/images/socialmedia.png'},
  {title:'Vehicle Marketplace', desc:'Cars marketplace with admin dashboard and RBAC.', tech:['PHP','MySQL','JS'], img:'/public/images/carmarketplace.png'},
  {title:'Forex Trading Bot (MQL4)', desc:'Automated EA implementing smart money concepts.', tech:['MQL4','Python'], img:'/public/images/Aiforextradingbot.jpg'},
  {title:'Restaurant Websites', desc:'Responsive websites with ordering systems.', tech:['HTML','Tailwind','JS'], img:'/public/images/restaurant.png'},
  {title:'Sneaker Store', desc:'E-commerce store for sneakers with product pages and cart.', tech:['HTML','CSS','JS'], img:'/public/images/sneakerspaza.jpg'},
  {title:'Service Link App', desc:'Service provider listing & booking app.', tech:['React Native','Firebase'], img:'/public/images/servicerprovider.png'}
];

const iconMap = {
  'React Native': '/public/icons/react-native.svg',
  'React': '/public/icons/react.svg',
  'Firebase': '/public/icons/firebase.svg',
  'Node.js': '/public/icons/nodejs.svg',
  'PHP': '/public/icons/php.svg',
  'MySQL': '/public/icons/mysql.svg',
  'JS': '/public/icons/javascript.svg',
  'MQL4': '/public/icons/mongodb.svg',
  'Python': '/public/icons/python.svg',
  'HTML': '/public/icons/html.svg',
  'Tailwind': '/public/icons/tailwind.svg',
  'Java': '/public/icons/java.svg',
  'C++': '/public/icons/cpp.svg',
  'C#': '/public/icons/csharp.svg',
  'Kotlin': '/public/icons/kotlin.svg',
  'Swift': '/public/icons/swift.svg',
  'Dart': '/public/icons/dart.svg',
  'Go': '/public/icons/go.svg',
  'Rust': '/public/icons/rust.svg',
  'Ruby': '/public/icons/ruby.svg',
  'SQL': '/public/icons/sql.svg'
};

const Projects = ()=>{
  const [open, setOpen] = useState(null);
  return (
    <section id="projects" className="py-20">
      <div className="container mx-auto px-6">
        <h2 className="text-xl font-bold text-cyan-300">Selected Projects</h2>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((p,idx)=>(
            <div key={p.title} className="card tilt p-4 cursor-pointer" onClick={()=>setOpen(idx)}>
              <img src={p.img} alt={p.title} className="project-img mb-3" />
              <h3 className="font-semibold">{p.title}</h3>
              <p className="text-slate-300 mt-2">{p.desc}</p>
              <div className="mt-3 flex flex-wrap gap-2">{p.tech.map(t=> <span key={t} className="skill-pill flex items-center gap-2"><img src={iconMap[t]||'/public/icons/javascript.svg'} className="w-5 h-5" alt={t} />{t}</span>)}</div>
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
            <div className="mt-4 flex gap-2">{data[open].tech.map(t=> <span key={t} className="skill-pill">{t}</span>)}</div>
            <div className="mt-4 text-right"><button onClick={()=>setOpen(null)} className="px-4 py-2 rounded-md border">Close</button></div>
          </div>
        </div>
      )}
    </section>
  )
}

export default Projects;
