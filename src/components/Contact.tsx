import React, { useState, useRef } from 'react';

// --- TypeScript Interfaces ---

interface ContactInfo {
  email: string;
  phone: string;
  location: string;
  mapEmbed?: string; // For Google Maps embed URL
}

interface SocialLink {
  name: string;
  url: string;
  iconType: keyof typeof ICONS; // Use keys from the ICONS map
}

interface ContactProps {
  title?: string;
  contactInfo?: ContactInfo;
  socialLinks?: SocialLink[];
  showMap?: boolean;
  onSubmit?: (formData: { name: string; email: string; message: string }) => Promise<void>;
}

// --- Inline SVG Icon Paths (Lucide and custom) ---

const ICONS = {
    // Contact Info Icons
    email: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6", // Mail
    phone: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-4.9-4.9A19.79 19.79 0 0 1 2 4.18 2 2 0 0 1 4.18 2h3a2 2 0 0 1 2 1.72 17 17 0 0 0 .58 4.75 2 2 0 0 1-.43 2.13l-.57.57a17 17 0 0 0 9.87 9.87l.57-.57a2 2 0 0 1 2.13-.43 17 17 0 0 0 4.75.58 2 2 0 0 1 1.72 2z", // Phone
    location: "M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0zM12 11a1 1 0 1 0 0-2 1 1 0 0 0 0 2z", // MapPin
    
    // Social Media Icons
    github: "M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.4 5.4 0 0 0 20 4.77 5.07 5.07 0 0 0 19.9 2.1c0 0-1.4.3-4.5 3.5a13.2 13.2 0 0 0-6 0c-3.1-3.2-4.5-3.5-4.5-3.5A5.07 5.07 0 0 0 4 4.77a5.4 5.4 0 0 0 0 3.87c0 5.42 3.3 6.57 6.44 7A3.37 3.37 0 0 0 9 18.13V22",
    linkedin: "M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2zM4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z",
    send: "M22 2L11 13M22 2L15 22 11 13 2 9 22 2z", // Send
    check: "M5 13l4 4L19 7", // Check for success
};

const SvgIcon: React.FC<{ iconType: keyof typeof ICONS; className: string; stroke?: string }> = ({ iconType, className, stroke = "currentColor" }) => (
    <svg
        className={className}
        fill="none"
        stroke={stroke}
        strokeWidth={2}
        viewBox="0 0 24 24"
        aria-hidden="true"
    >
        <path strokeLinecap="round" strokeLinejoin="round" d={ICONS[iconType]} />
    </svg>
);

// --- Contact Component ---

const Contact: React.FC<ContactProps> = ({
  title = "Get In Touch",
  contactInfo = {
    email: "ashleymashigo013@gmail.com",
    phone: "+27 73 153 1188",
    location: "South Africa, Mpumalanga · Ehlanzeni · City of Mbombela",
    mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.902!2d30.9833!3d-25.4667!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1ee8c5b5b5b5b5b5%3A0x1ee8c5b5b5b5b5b5!2sMbombela%2C%20South%20Africa!5e0!3m2!1sen!2s!4v1234567890!5m2!1sen!2s",
  },
  socialLinks = [
    { name: "GitHub", url: "https://github.com/ashleymashigo", iconType: 'github' },
    { name: "LinkedIn", url: "https://linkedin.com/in/ashleymashigo", iconType: 'linkedin' },
    { name: "Email", url: "mailto:ashleymashigo013@gmail.com", iconType: 'email' },
  ],
  showMap = true,
  onSubmit,
}) => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
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
      setToastMessage('Message sent — I will reply soon!');
      setFormData({ name: '', email: '', message: '' });
      formRef.current?.reset();
    } catch (error) {
      setToastMessage('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => {
        setToastMessage('');
      }, 5000);
    }
  };

  const InputField = ({ name, label, type = 'text', placeholder, error }: { name: keyof typeof formData; label: string; type?: string; placeholder: string; error: string }) => (
    <div className="mb-4">
      <label htmlFor={name} className="block text-sm font-medium text-slate-300 mb-2">{label}</label>
      <input
        id={name}
        name={name}
        type={type}
        value={formData[name]}
        onChange={handleInputChange}
        required
        className={`w-full p-3 bg-gray-800/70 border rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition ${
          error ? 'border-red-500' : 'border-gray-700'
        }`}
        placeholder={placeholder}
      />
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  );

  const TextAreaField = ({ name, label, placeholder, error }: { name: 'message'; label: string; placeholder: string; error: string }) => (
    <div className="mb-6">
      <label htmlFor={name} className="block text-sm font-medium text-slate-300 mb-2">{label}</label>
      <textarea
        id={name}
        name={name}
        value={formData[name]}
        onChange={handleInputChange}
        required
        className={`w-full p-3 bg-gray-800/70 border rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition h-32 resize-none ${
          error ? 'border-red-500' : 'border-gray-700'
        }`}
        placeholder={placeholder}
      />
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  );

  return (
    <section id="contact" className="py-20 bg-gray-950/90 min-h-screen font-sans text-white">
      <div className="container mx-auto px-6 max-w-7xl">
        <header className="text-center mb-12">
            <h2 className="text-4xl font-extrabold text-cyan-400 mb-2 tracking-tight">
                {title}
            </h2>
            <p className="text-lg text-slate-400">
                Let's discuss your project or opportunity.
            </p>
        </header>
        
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Contact Form */}
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="p-8 bg-gray-900 rounded-xl shadow-2xl border border-gray-800/80"
          >
            <h3 className="text-2xl font-semibold text-white mb-6">Send a Message</h3>
            <InputField 
                name="name" 
                label="Your Name" 
                placeholder="John Doe" 
                error={errors.name} 
            />
            <InputField 
                name="email" 
                label="Email Address" 
                type="email" 
                placeholder="john.doe@example.com" 
                error={errors.email} 
            />
            <TextAreaField 
                name="message" 
                label="Your Message" 
                placeholder="I'm interested in discussing..." 
                error={errors.message} 
            />
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-4 px-4 py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-sky-600 text-black font-bold text-lg shadow-lg shadow-cyan-500/30 hover:from-cyan-600 hover:to-sky-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                    <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                </>
              ) : (
                <>
                    <SvgIcon iconType="send" className="w-5 h-5" stroke="black" />
                    Send Message
                </>
              )}
            </button>
          </form>
          
          {/* Contact Info and Map */}
          <div className="space-y-8">
            {/* Info Card */}
            <div className="p-8 bg-gray-900 rounded-xl shadow-2xl border border-gray-800/80">
              <h4 className="text-xl font-semibold text-cyan-400 mb-6">My Contact Details</h4>
              <div className="space-y-6 text-slate-300">
                <div className="flex items-start gap-4">
                    <SvgIcon iconType="email" className="w-6 h-6 text-cyan-500 flex-shrink-0 mt-1" />
                    <div>
                        <div className="font-medium text-white">Email Address</div>
                        <a href={`mailto:${contactInfo.email}`} className="text-sm text-slate-400 hover:text-cyan-300 transition break-all">{contactInfo.email}</a>
                    </div>
                </div>
                <div className="flex items-start gap-4">
                    <SvgIcon iconType="phone" className="w-6 h-6 text-cyan-500 flex-shrink-0 mt-1" />
                    <div>
                        <div className="font-medium text-white">Phone Number</div>
                        <a href={`tel:${contactInfo.phone}`} className="text-sm text-slate-400 hover:text-cyan-300 transition">{contactInfo.phone}</a>
                    </div>
                </div>
                <div className="flex items-start gap-4">
                    <SvgIcon iconType="location" className="w-6 h-6 text-cyan-500 flex-shrink-0 mt-1" />
                    <div>
                        <div className="font-medium text-white">My Location</div>
                        <div className="text-sm text-slate-400">{contactInfo.location}</div>
                    </div>
                </div>
              </div>
              
              {/* Social Links */}
              <div className="mt-8 pt-6 border-t border-gray-800">
                <h5 className="font-medium text-white mb-4">Connect with me directly</h5>
                <div className="flex gap-6">
                  {socialLinks.map((link, index) => (
                    <a
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative text-slate-400 hover:text-cyan-400 transition-colors duration-300 p-2 rounded-full hover:bg-cyan-500/10"
                      aria-label={link.name}
                    >
                      <SvgIcon iconType={link.iconType} className="w-6 h-6 group-hover:scale-105" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Map (Optional) */}
            {showMap && contactInfo.mapEmbed && (
              <div className="p-8 bg-gray-900 rounded-xl shadow-2xl border border-gray-800/80">
                <h4 className="text-xl font-semibold text-cyan-400 mb-4">My General Area</h4>
                <div className="aspect-video">
                  <iframe
                    src={contactInfo.mapEmbed}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="rounded-lg shadow-inner shadow-gray-950/50"
                    title="Location Map"
                  ></iframe>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Toast Notification */}
        {toastMessage && (
          <div className={`fixed right-6 bottom-6 px-6 py-3 rounded-lg shadow-2xl z-50 transition-all duration-300 transform ${
              toastMessage.includes('sent') ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
          } ${toastMessage ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
          >
            <div className="flex items-center gap-3">
                <SvgIcon iconType={toastMessage.includes('sent') ? 'check' : 'github'} className="w-5 h-5" stroke="white" />
                {toastMessage}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

// Main App component to demonstrate the Contact section
const App: React.FC = () => {
    // Note: I'm intentionally adding a min-height to allow scrolling, so the fixed footer is visible.
    return (
        <div className="min-h-[120vh] bg-gray-950 font-sans">
            <header className="p-12 text-center text-3xl font-bold bg-gray-900 text-white">
                Website Header Area
            </header>
            <Contact />
        </div>
    );
};

export default App;
