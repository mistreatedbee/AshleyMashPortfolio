import React, { useState, useRef } from 'react';

interface ContactInfo {
  email: string;
  phone: string;
  location: string;
  mapSrc?: string;
  mapEmbed?: string; // For Google Maps embed
}

interface SocialLink {
  name: string;
  url: string;
  icon: string; // Path to icon
}

interface ContactProps {
  title?: string;
  contactInfo?: ContactInfo;
  socialLinks?: SocialLink[];
  showMap?: boolean;
  onSubmit?: (formData: { name: string; email: string; message: string }) => Promise<void>;
}

const Contact: React.FC<ContactProps> = ({
  title = "Contact",
  contactInfo = {
    email: "ashleymashigo013@gmail.com",
    phone: "+27 73 153 1188",
    location: "South Africa, Mpumalanga · Ehlanzeni · City of Mbombela",
    mapSrc: "/public/images/map.png",
    mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.902!2d30.9833!3d-25.4667!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1ee8c5b5b5b5b5b5%3A0x1ee8c5b5b5b5b5b5!2sMbombela%2C%20South%20Africa!5e0!3m2!1sen!2s!4v1234567890!5m2!1sen!2s", // Placeholder embed URL
  },
  socialLinks = [
    { name: "GitHub", url: "https://github.com/", icon: "/public/icons/github.svg" },
    { name: "LinkedIn", url: "https://linkedin.com/", icon: "/public/icons/linkedin.svg" },
    { name: "Email", url: "mailto:ashleymashigo013@gmail.com", icon: "/public/icons/email.svg" },
  ],
  showMap = true,
  onSubmit,
}) => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const formRef = useRef<HTMLFormElement>(null);

  const validateForm = () => {
    const newErrors = { name: '', email: '', message: '' };
    if (!formData.name.trim()) newErrors.name = 'Name is required.';
    if (!formData.email.trim()) newErrors.email = 'Email is required.';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid.';
    if (!formData.message.trim()) newErrors.message = 'Message is required.';
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      if (onSubmit) {
        await onSubmit(formData);
      } else {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
      setSent(true);
      setToastMessage('Message sent — I will reply soon!');
      setFormData({ name: '', email: '', message: '' });
      formRef.current?.reset();
    } catch (error) {
      setToastMessage('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => {
        setSent(false);
        setToastMessage('');
      }, 5000);
    }
  };

  return (
    <section id="contact" className="py-20 bg-gradient-to-b from-transparent to-black/10">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-cyan-300 mb-4">{title}</h2>
        <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Contact Form */}
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="p-6 bg-white/3 rounded-xl border border-white/5 hover:border-cyan-400/30 transition-all duration-300"
          >
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-300 mb-2">Your name</label>
              <input
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className={`w-full p-3 bg-slate-800/50 border rounded-md text-slate-300 placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition ${
                  errors.name ? 'border-red-400' : 'border-slate-600'
                }`}
                placeholder="Enter your name"
              />
              {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className={`w-full p-3 bg-slate-800/50 border rounded-md text-slate-300 placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition ${
                  errors.email ? 'border-red-400' : 'border-slate-600'
                }`}
                placeholder="Enter your email"
              />
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-300 mb-2">Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                className={`w-full p-3 bg-slate-800/50 border rounded-md text-slate-300 placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition h-32 resize-none ${
                  errors.message ? 'border-red-400' : 'border-slate-600'
                }`}
                placeholder="Enter your message"
              />
              {errors.message && <p className="text-red-400 text-xs mt-1">{errors.message}</p>}
            </div>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-4 py-3 rounded-md bg-gradient-to-r from-cyan-400 to-sky-500 text-black font-semibold hover:from-cyan-500 hover:to-sky-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Sending...' : 'Send message'}
            </button>
          </form>
          
          {/* Contact Info and Map */}
          <div className="space-y-6">
            <div className="p-6 bg-white/3 rounded-xl border border-white/5 hover:border-cyan-400/30 transition-all duration-300">
              <h4 className="font-semibold text-cyan-300 mb-4">Contact Info</h4>
              <div className="space-y-3 text-slate-300">
                <div className="flex items-center gap-3">
                  <img src="/public/icons/email.svg" alt="Email" className="w-5 h-5" />
                  <div><strong>Email:</strong> <a href={`mailto:${contactInfo.email}`} className="hover:text-cyan-300 transition">{contactInfo.email}</a></div>
                </div>
                <div className="flex items-center gap-3">
                  <img src="/public/icons/phone.svg" alt="Phone" className="w-5 h-5" />
                  <div><strong>Phone:</strong> <a href={`tel:${contactInfo.phone}`} className="hover:text-cyan-300 transition">{contactInfo.phone}</a></div>
                </div>
                <div className="flex items-center gap-3">
                  <img src="/public/icons/location.svg" alt="Location" className="w-5 h-5" />
                  <div><strong>Location:</strong> {contactInfo.location}</div>
                </div>
              </div>
              
              {/* Social Links */}
              <div className="mt-6">
                <h5 className="font-medium text-slate-300 mb-3">Connect with me</h5>
                <div className="flex gap-4">
                  {socialLinks.map((link, index) => (
                    <a
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative"
                      aria-label={link.name}
                    >
                      <img
                        src={link.icon}
                        className="w-8 h-8 transition-transform duration-300 group-hover:scale-110"
                        alt={link.name}
                      />
                      <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition text-xs text-slate-400">
                        {link.name}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Map */}
            {showMap && (
              <div className="p-6 bg-white/3 rounded-xl border border-white/5">
                <h4 className="font-semibold text-cyan-300 mb-4">Location</h4>
                {contactInfo.mapEmbed ? (
                  <iframe
                    src={contactInfo.mapEmbed}
                    width="100%"
                    height="200"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="rounded-md"
                    title="Location Map"
                  ></iframe>
                ) : (
                  <img src={contactInfo.mapSrc} alt="Map" className="w-full h-48 object-cover rounded-md" />
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* Toast Notification */}
        {sent && toastMessage && (
          <div className="fixed right-6 bottom-6 bg-cyan-500 text-black px-6 py-3 rounded-lg shadow-lg z-50 animate-bounce-in">
            {toastMessage}
          </div>
        )}
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes bounce-in {
          0% { opacity: 0; transform: scale(0.3); }
          50% { opacity: 1; transform: scale(1.05); }
          70% { transform: scale(0.9); }
          100% { opacity: 1; transform: scale(1); }
        }
        .animate-bounce-in {
          animation: bounce-in 0.6s ease-out;
        }
      `}</style>
    </section>
  );
};

export default Contact;
