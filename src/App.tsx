/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as React from "react";
import { useState, useEffect, useRef, useCallback, ReactNode } from "react";
import { 
  Phone, 
  ShieldCheck, 
  Zap, 
  Wrench, 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  MapPin, 
  Star, 
  ChevronRight,
  Menu,
  X,
  UserCheck,
  Home as HomeIcon,
  CheckCircle,
  Clock,
  Instagram,
  Facebook,
  ChevronDown
} from "lucide-react";
import { HashRouter, Routes, Route, Link, useLocation } from "react-router-dom";

// --- Custom Hooks ---
const useScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
};

// Scroll reveal hook using Intersection Observer
const useScrollReveal = () => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    const elements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  });
};

// Animated counter hook
const useCounter = (target: number, duration = 2000, start = false) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
};

// --- Navbar Component ---

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const services = [
    { title: "Installation", path: "/services/installation" },
    { title: "Maintenance", path: "/services/maintenance" },
    { title: "Repair", path: "/services/repair" },
  ];

  const navLinkClass = (path: string) =>
    `relative text-xs font-black uppercase tracking-widest transition-colors group ${
      location.pathname === path ? 'text-primary' : 'text-slate-600 hover:text-primary'
    }`;

  return (
    <nav className={`fixed w-full z-[100] transition-all duration-500 ${
      scrolled ? 'bg-white/97 backdrop-blur-md border-b border-gray-100 shadow-sm py-0' : 'bg-transparent py-2'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <Link to="/" className="flex items-center">
            <img src="/logo.png" alt="Performance Energy Solutions" className="h-14 w-auto object-contain" />
          </Link>

          <div className="hidden lg:flex items-center space-x-8">
            {['/', '/about', '/gallery', '/contact'].map((path, i) => {
              const labels: Record<string, string> = { '/': 'Home', '/about': 'About', '/gallery': 'Gallery', '/contact': 'Contact Us' };
              return (
                <Link key={path} to={path} className={navLinkClass(path)}>
                  {labels[path]}
                  <span className={`absolute -bottom-1 left-0 h-[2px] bg-action transition-all duration-300 ${
                    location.pathname === path ? 'w-full' : 'w-0 group-hover:w-full'
                  }`} />
                </Link>
              );
            })}

            {/* Services Dropdown */}
            <div
              className="relative group"
              onMouseEnter={() => setIsServicesOpen(true)}
              onMouseLeave={() => setIsServicesOpen(false)}
            >
              <button className={`flex items-center gap-1 font-black text-xs uppercase tracking-widest transition-colors py-8 ${
                scrolled ? 'text-slate-600 hover:text-primary' : 'text-white/90 hover:text-white'
              }`}>
                Services <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${isServicesOpen ? 'rotate-180' : ''}`} />
              </button>
              {isServicesOpen && (
                <div className="absolute top-full left-0 w-48 bg-white border border-slate-100 shadow-xl rounded-b-xl overflow-hidden py-2">
                  {services.map((service) => (
                    <Link
                      key={service.path}
                      to={service.path}
                      className="block px-6 py-3 text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 hover:text-primary transition-colors"
                    >
                      {service.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <a href="https://etail.mysynchrony.com/eapply/eapply.action?uniqueId=287888F10090B2C3873347796F2DA7DE169BFA96C73A4429&client=Generac" target="_blank" rel="noopener noreferrer" className={`relative text-xs font-black uppercase tracking-widest transition-colors group ${
              scrolled ? 'text-slate-600 hover:text-primary' : 'text-white/90 hover:text-white'
            }`}>
              Financing
              <span className="absolute -bottom-1 left-0 h-[2px] bg-action w-0 group-hover:w-full transition-all duration-300" />
            </a>

            <div className="flex items-center gap-4 pl-4 border-l border-slate-200">
              <a href="tel:2253130555" className={`flex items-center gap-2 font-bold transition-colors ${
                scrolled ? 'text-slate-900' : 'text-white'
              }`}>
                <Phone className="w-4 h-4 text-action fill-action/20" />
                (225) 313-0555
              </a>
              <Link to="/contact" className="bg-action hover:bg-action-hover text-white px-6 py-2.5 rounded-sm font-bold text-xs uppercase tracking-widest transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-action/30">
                Get My Quote
              </Link>
            </div>
          </div>

          <button onClick={() => setIsOpen(!isOpen)} className={`lg:hidden transition-colors ${scrolled ? 'text-slate-500' : 'text-white'}`}>
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-white border-b border-slate-200 lg:hidden flex flex-col shadow-xl overflow-hidden">
          <div className="p-6 flex flex-col gap-4">
            <Link to="/" onClick={() => setIsOpen(false)} className="text-slate-600 font-bold uppercase text-xs tracking-widest p-2">Home</Link>
            <Link to="/about" onClick={() => setIsOpen(false)} className="text-slate-600 font-bold uppercase text-xs tracking-widest p-2">About</Link>
            <div className="flex flex-col gap-2 p-2">
              <div className="text-slate-400 font-black uppercase text-[10px] tracking-widest border-b border-slate-100 pb-1 mb-1">Services</div>
              {services.map(s => (
                <Link key={s.path} to={s.path} onClick={() => setIsOpen(false)} className="text-slate-600 font-bold uppercase text-xs tracking-widest pl-4 p-2">{s.title}</Link>
              ))}
            </div>
            <Link to="/gallery" onClick={() => setIsOpen(false)} className="text-slate-600 font-bold uppercase text-xs tracking-widest p-2">Gallery</Link>
            <a href="https://etail.mysynchrony.com/eapply/eapply.action?uniqueId=287888F10090B2C3873347796F2DA7DE169BFA96C73A4429&client=Generac" target="_blank" rel="noopener noreferrer" onClick={() => setIsOpen(false)} className="text-slate-600 font-bold uppercase text-xs tracking-widest p-2">Financing</a>
            <Link to="/contact" onClick={() => setIsOpen(false)} className="text-slate-600 font-bold uppercase text-xs tracking-widest p-2">Contact Us</Link>
            <a href="tel:2253130555" className="bg-slate-50 p-4 rounded text-primary font-black text-xl text-center tracking-tighter mt-4">(225) 313-0555</a>
            <Link to="/contact" onClick={() => setIsOpen(false)} className="bg-action text-white p-4 font-black uppercase tracking-widest text-sm rounded text-center">Get My Custom Plan</Link>
          </div>
        </div>
      )}
    </nav>
  );
};



const Hero = () => {
  const [loaded, setLoaded] = useState(false);
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Trigger entrance
    const t = setTimeout(() => setLoaded(true), 100);
    // Parallax on scroll
    const handleScroll = () => {
      if (bgRef.current) {
        bgRef.current.style.transform = `translateY(${window.scrollY * 0.35}px)`;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => { clearTimeout(t); window.removeEventListener('scroll', handleScroll); };
  }, []);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-slate-900">
      {/* Parallax Background */}
      <div ref={bgRef} className="absolute inset-0 z-0 will-change-transform scale-110">
        <img
          src="/hero.webp"
          alt="Luxury home during storm"
          className="w-full h-full object-cover object-bottom opacity-55"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent" />
      </div>

      {/* Animated background grid */}
      <div className="absolute inset-0 z-[1] opacity-10"
        style={{ backgroundImage: 'linear-gradient(rgba(0,71,171,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(0,71,171,0.15) 1px, transparent 1px)', backgroundSize: '80px 80px' }} />

      {/* Floating badge top-right */}
      <div className={`absolute top-32 right-8 z-10 hidden lg:flex transition-all duration-1000 delay-700 ${
        loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}>
        <div className="relative w-28 h-28">
          <svg viewBox="0 0 100 100" className="w-full h-full spin-slow">
            <defs>
              <path id="circle" d="M 50,50 m -37,0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" />
            </defs>
            <text className="fill-white/50 text-[8px] font-black uppercase tracking-[0.3em]" fontSize="8.5">
              <textPath href="#circle">SOUTH LOUISIANA • LICENSED & INSURED • SINCE 2018 •</textPath>
            </text>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <ShieldCheck className="w-10 h-10 text-action" strokeWidth={1.5} />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full py-32 pt-40">
        <div className="max-w-4xl">
          {/* Label */}
          <div className={`flex items-center gap-3 mb-8 transition-all duration-700 ${
            loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}>
            <div className="h-[1px] w-8 bg-action" />
            <span className="text-action font-black uppercase tracking-[0.3em] text-[10px]">Authorized Dealer — Generac · Kohler · Cummins</span>
          </div>

          {/* Animated H1 */}
          <h1 className="text-5xl md:text-6xl lg:text-[80px] font-black text-white leading-[0.95] mb-8 tracking-tighter">
            {[{ text: 'Power Outages', delay: '0.1s' }, { text: "Don't Give You", delay: '0.25s' }, { text: 'Options—', delay: '0.4s' }].map((line, i) => (
              <div key={i} className="overflow-hidden">
                <span className="inline-block" style={{
                  opacity: loaded ? 1 : 0,
                  transform: loaded ? 'translateY(0) skewY(0deg)' : 'translateY(60px) skewY(2deg)',
                  transition: `all 0.9s cubic-bezier(0.16,1,0.3,1) ${line.delay}`
                }}>{line.text}</span>
              </div>
            ))}
            <div className="overflow-hidden">
              <span className="inline-block text-action" style={{
                opacity: loaded ? 1 : 0,
                transform: loaded ? 'translateY(0)' : 'translateY(60px)',
                transition: 'all 0.9s cubic-bezier(0.16,1,0.3,1) 0.55s'
              }}>We Do.</span>
            </div>
          </h1>

          <p className={`text-lg md:text-xl text-slate-200 mb-10 max-w-2xl leading-relaxed font-medium transition-all duration-700 delay-700 ${
            loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            We help homeowners choose the <span className="text-action font-bold">right</span> generator for their home—not just the one a company wants to sell.
          </p>

          <div className={`grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 mb-12 max-w-2xl text-left transition-all duration-700 delay-[800ms] ${
            loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            {[
              { icon: <ShieldCheck className="w-5 h-5 text-action" />, text: 'Generac, Kohler, Cummins & More' },
              { icon: <UserCheck className="w-5 h-5 text-action" />, text: 'No Pressure—Just Honest Recommendations' },
              { icon: <HomeIcon className="w-5 h-5 text-action" />, text: 'Matched to Your Home & Budget' },
              { icon: <CheckCircle className="w-5 h-5 text-action" />, text: 'Local, Full-Service Authorized Dealer' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-white text-sm font-bold">
                <div className="bg-action/15 p-2 rounded-full border border-action/30">{item.icon}</div>
                {item.text}
              </div>
            ))}
          </div>

          <div className={`flex flex-col sm:flex-row gap-4 mb-16 justify-start transition-all duration-700 delay-[900ms] ${
            loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            <Link to="/contact" className="btn-primary py-5 px-12 group">
              Get My Custom Generator Plan
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a href="tel:2253130555" className="btn-ghost py-5 px-12">
              <Phone className="w-5 h-5" />
              Call Now
            </a>
          </div>

          {/* Bottom Partner Bar */}
          <div className={`pt-10 border-t border-white/10 flex flex-wrap items-center justify-start gap-x-12 gap-y-8 transition-all duration-700 delay-[1s] ${
            loaded ? 'opacity-100' : 'opacity-0'
          }`}>
            <div className="flex flex-col">
              <div className="text-xl font-black text-white">GENERAC</div>
              <div className="text-[8px] font-bold text-slate-400 tracking-widest uppercase">Authorized Dealer</div>
            </div>
            <div className="flex flex-col">
              <div className="text-xl font-black text-white italic tracking-tighter">KOHLER</div>
              <div className="text-[8px] font-bold text-slate-400 tracking-widest uppercase">Authorized Dealer</div>
            </div>
            <div className="flex flex-col">
              <div className="text-xl font-bold text-white flex items-center italic">CUMMINS</div>
              <div className="text-[8px] font-bold text-slate-400 tracking-widest uppercase">Authorized Dealer</div>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-action" />
              <span className="text-[10px] font-bold text-white uppercase tracking-widest">Licensed & Insured</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-action" />
              <span className="text-[10px] font-bold text-white uppercase tracking-widest">Satisfaction Guaranteed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className={`absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 transition-all duration-700 delay-[1.2s] ${
        loaded ? 'opacity-100' : 'opacity-0'
      }`}>
        <span className="text-[9px] font-bold text-white/40 uppercase tracking-[0.3em]">Scroll</span>
        <div className="w-[1px] h-10 bg-gradient-to-b from-white/40 to-transparent" />
      </div>
    </section>
  );
};

// --- Marquee Ticker ---
const MarqueeTicker = () => {
  const items = [
    '⚡ Generator Installation', '✓ 500+ Homes Protected', '⚡ Routine Maintenance', '✓ Brand-Neutral Advice',
    '⚡ Emergency Repairs', '✓ 5-Star Google Rating', '⚡ Generac Authorized Dealer', '✓ South Louisiana Experts',
    '⚡ Generator Installation', '✓ 500+ Homes Protected', '⚡ Routine Maintenance', '✓ Brand-Neutral Advice',
    '⚡ Emergency Repairs', '✓ 5-Star Google Rating', '⚡ Generac Authorized Dealer', '✓ South Louisiana Experts',
  ];
  return (
    <div className="bg-action py-3 overflow-hidden">
      <div className="marquee-track">
        {items.map((item, i) => (
          <span key={i} className="text-white font-black uppercase tracking-widest text-[11px] mx-8 shrink-0">{item}</span>
        ))}
      </div>
    </div>
  );
};


const ComparisonSection = () => {
  return (
    <section id="comparison" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
           <div className="flex items-center justify-center gap-4 mb-4">
              <div className="h-[1px] w-12 bg-slate-200"></div>
              <span className="text-primary font-black uppercase tracking-widest text-[10px]">Why Choose Performance Energy?</span>
              <div className="h-[1px] w-12 bg-slate-200"></div>
           </div>
           <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tighter">
             Expert Guidance.<br />
             <span className="text-primary">The Right Choice For Your Home.</span>
           </h2>
           <p className="text-slate-500 max-w-2xl mx-auto font-medium">
             We're not tied to just one brand or one solution. Our job is to evaluate your home—your power needs and your budget—to recommend the system that <span className="text-primary font-black">truly fits.</span>
           </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="relative z-10 bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
            {/* Performance Energy - Now Full Width */}
            <div className="p-12 md:p-16 bg-gradient-to-br from-white to-primary/5 relative">
               <div className="absolute top-0 left-0 w-full h-1.5 bg-primary"></div>
               <div className="grid md:grid-cols-3 gap-12">
                  <div className="flex flex-col items-center text-center">
                     <div className="w-16 h-16 bg-white rounded-2xl shadow-lg border border-slate-100 flex items-center justify-center mb-6">
                        <Star className="text-primary w-8 h-8 font-thin" strokeWidth={1.5} />
                     </div>
                     <h4 className="font-black text-slate-900 uppercase tracking-tight mb-3">Brand-Neutral</h4>
                     <p className="text-xs text-slate-500 font-semibold leading-relaxed">We offer all the best brands so you get the absolute best solution for your specific home.</p>
                  </div>
                  <div className="flex flex-col items-center text-center">
                     <div className="w-16 h-16 bg-white rounded-2xl shadow-lg border border-slate-100 flex items-center justify-center mb-6">
                        <Wrench className="text-primary w-8 h-8 font-thin" strokeWidth={1.5} />
                     </div>
                     <h4 className="font-black text-slate-900 uppercase tracking-tight mb-3">Custom Sizing</h4>
                     <p className="text-xs text-slate-500 font-semibold leading-relaxed">Detailed load calculations based on your actual needs—no guesswork, just precision.</p>
                  </div>
                  <div className="flex flex-col items-center text-center">
                     <div className="w-16 h-16 bg-white rounded-2xl shadow-lg border border-slate-100 flex items-center justify-center mb-6">
                        <UserCheck className="text-primary w-8 h-8 font-thin" strokeWidth={1.5} />
                     </div>
                     <h4 className="font-black text-slate-900 uppercase tracking-tight mb-3">Home-First</h4>
                     <p className="text-xs text-slate-500 font-semibold leading-relaxed">Education-based guidance with zero pressure. We guide you through every step.</p>
                  </div>
               </div>
            </div>
          </div>
        </div>

        <div className="mt-16 max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-6 bg-primary p-6 rounded-xl text-white relative">
           <div className="flex items-center gap-4 border-r border-white/20 pr-8">
              <div className="w-10 h-10 border border-white/40 rounded-full flex items-center justify-center shrink-0">
                 <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <div>
                 <p className="text-sm font-black uppercase tracking-tight">Local. Trusted. Full-Service.</p>
                 <p className="text-[10px] font-medium text-white/70">Proudly serving homeowners across South Louisiana.</p>
              </div>
           </div>
           <Link to="/contact" className="btn-primary ml-auto py-5 shadow-2xl flex-1 md:flex-none">
              See Which Generator Is Right For Me <ChevronRight className="w-5 h-5" />
           </Link>
           <Zap className="hidden lg:block w-20 h-20 text-white/5 absolute -right-4 -bottom-4" />
        </div>
      </div>
    </section>
  );
};

const ServicesSection = () => {
  const services = [
    {
      title: "Installation",
      link: "/services/installation",
      img: "/IMG_1723.jpg",
      icon: <HomeIcon className="w-5 h-5" />,
      desc: "Custom-fit generator systems designed for your home's specific power needs.",
      bulletPoints: ["Expert system sizing", "Professional installation", "Code-compliant & safe"]
    },
    {
      title: "Maintenance",
      link: "/services/maintenance",
      img: "/IMG_1725.jpg",
      icon: <Clock className="w-5 h-5" />,
      desc: "Routine maintenance keeps your generator ready when you need it most.",
      bulletPoints: ["Scheduled maintenance plans", "System performance testing", "Peace of mind all year long"]
    },
    {
      title: "Repair",
      link: "/services/repair",
      img: "/IMG_1726.jpg",
      icon: <Wrench className="w-5 h-5" />,
      desc: "Fast diagnostics and reliable repairs to get your system back up and running.",
      bulletPoints: ["Troubleshooting & diagnostics", "Parts replacement", "Fast, dependable service"]
    }
  ];

  return (
    <section id="services" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
        <div className="flex items-center justify-center gap-4 mb-4">
           <Zap className="text-action w-4 h-4 fill-action" />
           <span className="text-primary font-black uppercase tracking-widest text-[10px]">Our Services</span>
           <Zap className="text-action w-4 h-4 fill-action" />
        </div>
        <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tighter">
          Complete Generator Solutions<br />
          <span className="text-primary">Start to Finish.</span>
        </h2>
        <p className="text-slate-500 max-w-2xl mx-auto font-medium">
          From helping you choose the right system to expert installation and ongoing support, we’re with you every step of the way.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-3 gap-8">
        {services.map((s, i) => (
          <Link to={s.link} key={i} className="flex flex-col bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all group block">
            <div className="h-48 relative overflow-hidden">
               <img src={s.img} alt={s.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
               <div className="absolute inset-0 bg-primary/10 group-hover:bg-transparent transition-colors"></div>
               <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-12 h-12 bg-primary rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                  <div className="text-white">{s.icon}</div>
               </div>
            </div>
            <div className="p-8 pt-10 text-center flex flex-col flex-grow">
               <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-4">{s.title}</h3>
               <p className="text-xs text-slate-500 leading-relaxed mb-8 font-medium">{s.desc}</p>
               <div className="space-y-3 text-left max-w-fit mx-auto mb-6">
                  {s.bulletPoints.map((point, pi) => (
                    <div key={pi} className="flex items-center gap-2">
                       <CheckCircle2 className="w-4 h-4 text-primary" />
                       <span className="text-[11px] font-bold text-slate-700">{point}</span>
                    </div>
                  ))}
               </div>
               <div className="mt-auto pt-4 flex items-center justify-center text-primary font-bold text-xs uppercase tracking-widest group-hover:text-action transition-colors">
                 Learn More <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
               </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
         <div className="bg-primary rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-8 text-white">
            <div className="flex items-center gap-6">
               <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-white" />
               </div>
               <div>
                  <h4 className="text-xl font-black uppercase tracking-tight">Stay Ready. Stay Protected.</h4>
                  <p className="text-sm font-medium text-white/70">Schedule a Free Home Power Assessment today.</p>
               </div>
            </div>
            <Link to="/contact" className="btn-primary py-5 group shadow-2xl">
               Get My Free Assessment <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
         </div>
      </div>
    </section>
  );
};

// --- Lightbox Component ---
const Lightbox = ({ src, onClose }: { src: string | null; onClose: () => void }) => {
  if (!src) return null;
  return (
    <div 
      className="fixed inset-0 z-[200] bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm cursor-zoom-out"
      onClick={onClose}
    >
      <button 
        onClick={onClose}
        className="absolute top-6 right-6 text-white bg-black/50 hover:bg-white/20 rounded-full p-2 transition-colors z-[210]"
      >
        <X className="w-8 h-8" />
      </button>
      <img 
        src={src} 
        alt="Enlarged gallery view" 
        className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl cursor-default relative z-[205]"
        onClick={(e) => e.stopPropagation()}
        referrerPolicy="no-referrer"
      />
    </div>
  );
};

const GallerySection = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <section id="gallery" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="h-[1px] w-12 bg-slate-200"></div>
          <span className="text-primary font-black uppercase tracking-widest text-[10px]">Real Installs. Real Protection.</span>
          <div className="h-[1px] w-12 bg-slate-200"></div>
        </div>
        <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tighter">
          Real Work. <span className="text-primary">Real Results.</span>
        </h2>
        <p className="text-slate-500 max-w-2xl mx-auto font-medium">
          We take pride in every installation we complete. Here’s a look at some of our recent work across South Louisiana.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-4 auto-rows-[200px]">
         <div className="md:col-span-2 md:row-span-2 relative group overflow-hidden rounded-2xl shadow-lg cursor-zoom-in" onClick={() => setSelectedImage("/IMG_1895.jpg")}>
            <img src="/IMG_1895.jpg" alt="Baton Rouge install" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" referrerPolicy="no-referrer" />
         </div>
         <div className="md:col-span-2 relative group overflow-hidden rounded-2xl shadow-md cursor-zoom-in" onClick={() => setSelectedImage("/unnamed.jpg")}>
            <img src="/unnamed.jpg" alt="Prairieville install" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" referrerPolicy="no-referrer" />
         </div>
         <div className="md:col-span-1 relative group overflow-hidden rounded-2xl shadow-md cursor-zoom-in" onClick={() => setSelectedImage("/unnamed-2.jpg")}>
            <img src="/unnamed-2.jpg" alt="ATS install" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" referrerPolicy="no-referrer" />
         </div>
         <div className="md:col-span-1 relative group overflow-hidden rounded-2xl shadow-md cursor-zoom-in" onClick={() => setSelectedImage("/unnamed-3.jpg")}>
            <img src="/unnamed-3.jpg" alt="Detail work" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" referrerPolicy="no-referrer" />
         </div>
      </div>
      <Lightbox src={selectedImage} onClose={() => setSelectedImage(null)} />
    </section>
  );
};

const StatsSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStarted(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const count500 = useCounter(500, 2000, started);

  return (
    <section className="py-12 bg-white" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 bg-primary rounded-2xl p-10 text-white grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative overflow-hidden">
        {/* Decorative zap */}
        <Zap className="absolute -right-8 -bottom-8 w-64 h-64 text-white/5 zap-bg" />

        <div className="flex items-center gap-6 border-r border-white/10 pr-6 last:border-0">
          <div className="w-12 h-12 bg-orange-600 rounded-xl flex items-center justify-center shrink-0">
            <HomeIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-3xl font-black text-white">{started ? count500 : 0}+</p>
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/60">Generators Installed</p>
            <p className="text-[8px] font-medium text-white/40">Across South Louisiana</p>
          </div>
        </div>

        <div className="flex items-center gap-6 border-r border-white/10 pr-6 last:border-0">
          <div className="flex flex-col gap-1 items-center shrink-0">
            <UserCheck className="w-6 h-6 text-orange-600" />
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-2.5 h-2.5 fill-orange-600 text-orange-600" />)}
            </div>
          </div>
          <div>
            <p className="text-3xl font-black text-white">5★</p>
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/60">Google Rating</p>
            <div className="flex gap-0.5 mt-1">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-2 h-2 fill-orange-600 text-orange-600" />)}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6 border-r border-white/10 pr-6 last:border-0">
          <div className="w-12 h-12 border-2 border-orange-600 rounded-full flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <p className="text-3xl font-black text-white">100%</p>
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/60">Satisfaction</p>
            <p className="text-[8px] font-medium text-white/40 italic">Our Commitment To You</p>
          </div>
        </div>

        <div className="flex items-center gap-6 border-r border-white/10 pr-6 last:border-0">
          <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center border border-white/10 shrink-0">
            <ShieldCheck className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <p className="text-sm font-black text-white uppercase tracking-tight">Local. Licensed. Insured.</p>
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/60 mt-1">Trusted & Dependable</p>
          </div>
        </div>
      </div>
    </section>
  );
};


const FinancingSection = () => {
  return (
    <section id="financing" className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2 relative">
             <div className="rounded-3xl overflow-hidden shadow-2xl relative z-10 aspect-[4/3]">
                <img 
                  src="/image2-4.jpeg" 
                  alt="Family enjoying a powered home" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
             </div>
             <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl"></div>
             <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-action/5 rounded-full blur-3xl"></div>
          </div>
          <div className="lg:w-1/2">
             <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-8">
                <Calendar className="w-8 h-8 text-primary" />
             </div>
             <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tighter leading-none">
                Power Now.<br />
                <span className="text-primary tracking-tight">Pay Over Time.</span>
             </h2>
             <p className="text-lg text-slate-500 font-medium mb-10 max-w-lg leading-relaxed">
                Flexible financing options make it easy to get the reliable backup power your home deserves—without the upfront stress.
             </p>
             <a href="https://etail.mysynchrony.com/eapply/eapply.action?uniqueId=287888F10090B2C3873347796F2DA7DE169BFA96C73A4429&client=Generac" target="_blank" rel="noopener noreferrer" className="btn-primary py-5 px-12 group inline-flex items-center">
                View Financing Options <ChevronRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
             </a>
          </div>
        </div>
      </div>
    </section>
  );
};

const MapSection = () => {
  const cities = ["Baton Rouge", "Prairieville", "Denham Springs", "Gonzales"];
  
  return (
    <section className="py-24 bg-slate-50 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-16">
          <div className="lg:w-1/3">
             <div className="flex items-center gap-3 mb-6">
                <MapPin className="text-action w-6 h-6 fill-action" />
                <span className="text-primary font-black uppercase tracking-widest text-xs">Service Area</span>
             </div>
             <h2 className="text-4xl font-black text-slate-900 mb-8 tracking-tighter leading-tight">
                Proudly Serving<br />South Louisiana
             </h2>
             <div className="space-y-4 mb-10">
                {cities.map((city, i) => (
                  <div key={i} className="flex items-center gap-3">
                     <CheckCircle2 className="w-5 h-5 text-action" />
                     <span className="text-lg font-bold text-slate-700">{city}</span>
                  </div>
                ))}
             </div>

          </div>
          <div className="lg:w-2/3">
             <div className="bg-white p-4 rounded-3xl shadow-xl overflow-hidden aspect-video relative group">
                {/* Interactive Google Map */}
                <iframe
                  title="South Louisiana Service Area"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d441029.3562623321!2d-91.44280590858102!3d30.342171440788645!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8626a760e58d56b3%3A0xc39f28a50965e6d6!2sBaton%20Rouge%2C%20LA!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus"
                  width="100%"
                  height="100%"
                  style={{ border: 0, borderRadius: '1rem' }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full"
                ></iframe>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const UrgencyBar = () => {
  return (
    <section className="relative py-24 overflow-hidden bg-slate-900 text-center">
      <div className="absolute inset-0 opacity-40">
         <img 
           src="/x3lCMzILM6Y55Ctgob.jpg" 
           alt="Stormy sky" 
           className="w-full h-full object-cover"
           referrerPolicy="no-referrer"
         />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
         <h2 className="text-5xl md:text-7xl font-black text-white mb-12 tracking-tighter">
           Don't Wait Until<br />the Next Storm.
         </h2>
         <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link to="/contact" className="bg-action hover:bg-action-hover text-white py-5 px-12 rounded-md font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 shadow-2xl transition-all grow sm:grow-0">
               <Calendar className="w-5 h-5" />
               Get My Quote
            </Link>
            <a href="tel:2253130555" className="btn-ghost py-4 flex-1 sm:flex-none flex items-center justify-center gap-3">
               <Phone className="w-5 h-5" />
               Call Now
            </a>
         </div>
      </div>
    </section>
  );
};

const LeadForm = () => {
  return (
    <div className="bg-white rounded-3xl p-10 text-slate-900 shadow-2xl relative border border-slate-100 overflow-hidden">
      <div className="bg-action/10 py-2 px-4 rounded-full max-w-fit mb-6">
         <span className="text-action text-[10px] font-black uppercase tracking-widest">Fast Quote Response</span>
      </div>
      <h3 className="text-2xl font-black text-slate-900 mb-2 tracking-tight uppercase">Get Your Fast Quote</h3>
      <p className="text-slate-500 font-medium text-xs mb-8">Fill out the form below and we'll get back to you quickly.</p>
      
      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <div className="relative">
           <UserCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
           <input type="text" placeholder="Name" className="w-full bg-slate-50 border border-slate-100 rounded-xl py-4 pl-12 pr-4 text-sm font-semibold outline-none focus:border-primary transition-colors" />
        </div>
        <div className="relative">
           <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
           <input type="text" placeholder="Zip Code" className="w-full bg-slate-50 border border-slate-100 rounded-xl py-4 pl-12 pr-4 text-sm font-semibold outline-none focus:border-primary transition-colors" />
        </div>
        <div className="relative">
           <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
           <input type="tel" placeholder="Phone" className="w-full bg-slate-50 border border-slate-100 rounded-xl py-4 pl-12 pr-4 text-sm font-semibold outline-none focus:border-primary transition-colors" />
        </div>
        <div className="relative">
           <HomeIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
           <select className="w-full bg-slate-50 border border-slate-100 rounded-xl py-4 pl-12 pr-10 text-sm font-semibold outline-none appearance-none cursor-pointer text-slate-400">
             <option>Home Size (Optional)</option>
             <option>Under 2,000 sq ft</option>
             <option>2,000 - 3,500 sq ft</option>
             <option>Over 3,500 sq ft</option>
           </select>
           <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 rotate-90" />
        </div>
        
        <button className="w-full btn-primary py-5 shadow-action/20 mt-4">
          Get My Quote
        </button>
        
        <div className="flex items-center justify-center gap-2 mt-6 pt-6 border-t border-slate-50">
           <ShieldCheck className="w-4 h-4 text-orange-600" />
           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Your information is secure and never shared.</p>
        </div>
      </form>
    </div>
  );
};

const Footer = () => {
  return (
    <footer className="bg-black pt-24 pb-12 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-20 mb-20">
          <div className="lg:w-1/3">
             <div className="flex items-center mb-8 bg-white/95 p-4 rounded-xl max-w-fit">
                <img src="/logo.png" alt="Performance Energy Solutions" className="h-12 w-auto object-contain" />
             </div>
             <p className="text-slate-400 text-sm font-medium leading-relaxed mb-10 pr-10">
                Reliable backup power solutions for homes and businesses across South Louisiana. Licensed, insured, and dedicated to your peace of mind.
             </p>
             <div className="flex gap-4">
                <a href="https://www.facebook.com/profile.php?id=100070781741732" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors border border-white/10">
                   <Facebook className="w-5 h-5 text-white" />
                </a>
             </div>
          </div>

          <div className="lg:w-1/3 grid grid-cols-2 gap-10">
             <div>
                <h4 className="text-[10px] font-black uppercase tracking-widest text-primary mb-6">Services</h4>
                <div className="flex flex-col gap-4 text-xs font-bold text-slate-400">
                   <Link to="/services/installation" className="hover:text-white transition-colors">Generator Installation</Link>
                   <Link to="/services/maintenance" className="hover:text-white transition-colors">Generator Maintenance</Link>
                   <Link to="/services/repair" className="hover:text-white transition-colors">Generator Repairs</Link>
                </div>
             </div>
             <div>
                <h4 className="text-[10px] font-black uppercase tracking-widest text-primary mb-6">Explore</h4>
                <div className="flex flex-col gap-4 text-xs font-bold text-slate-400">
                   <Link to="/about" className="hover:text-white transition-colors">About Us</Link>
                   <Link to="/gallery" className="hover:text-white transition-colors">Project Gallery</Link>
                   <a href="https://etail.mysynchrony.com/eapply/eapply.action?uniqueId=287888F10090B2C3873347796F2DA7DE169BFA96C73A4429&client=Generac" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Financing Options</a>
                   <Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link>
                </div>
             </div>
          </div>

          <div className="lg:w-1/3">
             <div className="bg-white/5 p-8 rounded-3xl border border-white/10">
                <div className="text-center mb-6">
                  <h4 className="text-sm font-black uppercase tracking-widest text-white mb-2">Service Status</h4>
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Throughout South Louisiana</span>
                  </div>
                </div>
                <Link to="/contact" className="btn-primary w-full py-4 text-[10px]">Get My Fast Quote</Link>
             </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col md:flex-row justify-between items-center gap-6 border-t border-white/10 pt-12">
           <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">© 2026 PERFORMANCE ENERGY SOLUTIONS. ALL RIGHTS RESERVED. LIC #84932</p>
           <div className="flex items-center gap-8">
              <p className="text-[10px] font-bold text-slate-600 hover:text-white cursor-pointer uppercase tracking-widest transition-colors">Privacy Policy</p>
              <p className="text-[10px] font-bold text-slate-600 hover:text-white cursor-pointer uppercase tracking-widest transition-colors">Terms of Service</p>
           </div>
        </div>
      </div>
      
      {/* Fixed Sticky CTA Bar */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-slate-100 z-[100] shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
         <div className="max-w-7xl mx-auto px-8 h-20 flex items-center justify-between">
            <div className="flex items-center gap-8">
               <a href="tel:2253130555" className="flex items-center gap-3 text-slate-900 hover:text-primary transition-colors">
                  <Phone className="w-5 h-5 text-action fill-action" />
                  <span className="text-xl font-black tracking-tight">(225) 313-0555</span>
               </a>
            </div>
            <Link to="/contact" className="bg-action hover:bg-action-hover text-white h-14 px-10 rounded-md font-black uppercase tracking-widest text-xs flex items-center gap-3 transition-all shrink-0">
               <Calendar className="w-4 h-4" />
               Get My Free Quote
            </Link>
         </div>
      </div>
    </footer>
  );
};

// --- Page Components ---

const PageHeader = ({ title, subtitle, bgImage = "/hero.webp" }: { title: string; subtitle?: string; bgImage?: string }) => (
  <div className="pt-40 pb-20 bg-slate-900 relative overflow-hidden">
    <div className="absolute inset-0 opacity-20">
      <img 
        src={bgImage} 
        alt="" 
        className="w-full h-full object-cover"
        referrerPolicy="no-referrer"
      />
    </div>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
      <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase mb-4">{title}</h1>
      {subtitle && <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">{subtitle}</p>}
    </div>
  </div>
);

const Home = () => {
  return (
    <>
      <Hero />
      <MarqueeTicker />
      <ComparisonSection />
      <ServicesSection />
      <GallerySection />
      <StatsSection />
      <FinancingSection />
      <MapSection />
      <UrgencyBar />
    </>
  );
};

const AboutPage = () => (
  <div className="bg-white">
    <PageHeader title="Who We Are" subtitle="Your Trusted Energy Partners" bgImage="/image2-4.jpeg" />
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          <div className="lg:w-1/2">
            <h2 className="text-4xl font-black text-slate-900 mb-6 tracking-tighterUppercase">Experience & <span className="text-primary">Reliability.</span></h2>
            <p className="text-slate-600 text-lg font-medium leading-relaxed mb-8">
              Performance Energy Solutions was founded on a simple principle: South Louisiana homeowners deserve better options when it comes to backup power.
            </p>
            <p className="text-slate-600 mb-10 leading-relaxed">
              We aren't just salespeople; we are expert technicians and consultants. We understand the specific load requirements of modern homes and the unique challenges of our local weather. Our brand-neutral approach ensures you get the generator that fits your budget and power needs perfectly.
            </p>
            <div className="grid grid-cols-2 gap-8">
              <div className="bg-slate-50 p-6 rounded-2xl">
                <ShieldCheck className="w-8 h-8 text-primary mb-4" />
                <h4 className="font-black text-slate-900 uppercase tracking-tight mb-2">Licensed & Insured</h4>
                <p className="text-xs text-slate-500 font-medium">Compliance and safety in every single project we touch.</p>
              </div>
              <div className="bg-slate-50 p-6 rounded-2xl">
                <Star className="w-8 h-8 text-action mb-4" />
                <h4 className="font-black text-slate-900 uppercase tracking-tight mb-2">Expert Team</h4>
                <p className="text-xs text-slate-500 font-medium">Certified technicians trained in Generac, Kohler, and Cummins.</p>
              </div>
            </div>
          </div>
          <div className="lg:w-1/2 rounded-3xl overflow-hidden shadow-2xl relative">
            <img 
              src="/Untitled-design-9-1.png" 
              alt="Our professional team" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-primary/10"></div>
          </div>
        </div>
      </div>
    </section>
  </div>
);

const ServicePage = ({ type }: { type: 'installation' | 'maintenance' | 'repair' }) => {
  const content = {
    installation: {
      title: "Generator Installation",
      subtitle: "Custom-Fit Power Solutions",
      desc: "Our installation process begins with a detailed load calculation. We don't guess—we measure exactly what your home needs to keep running during the storm.",
      img: "/IMG_1723.jpg"
    },
    maintenance: {
      title: "Routine Maintenance",
      subtitle: "Always Ready for Action",
      desc: "A generator is an investment in peace of mind. Our maintenance plans ensure your system is tested and ready to fire the second the grid goes down.",
      img: "/IMG_1725.jpg"
    },
    repair: {
      title: "Reliable Repairs",
      subtitle: "Diagnostics & Solutions",
      desc: "If your system isn't performing, our expert technicians can diagnose and repair all major brands quickly and effectively.",
      img: "/IMG_1726.jpg"
    }
  };

  const current = content[type];

  return (
    <div className="bg-white">
      <PageHeader title={current.title} subtitle={current.subtitle} bgImage={current.img} />
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="lg:w-1/2">
              <h2 className="text-4xl font-black text-slate-900 mb-6 tracking-tighterUppercase">Expert <span className="text-primary">{current.title}</span></h2>
              <p className="text-slate-600 text-lg font-medium leading-relaxed mb-8">{current.desc}</p>
              <div className="space-y-4 mb-10">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-primary" />
                  <span className="font-bold text-slate-700">Detailed On-site Evaluation</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-primary" />
                  <span className="font-bold text-slate-700">Brand-Neutral Selection</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-primary" />
                  <span className="font-bold text-slate-700">Certified Technical Support</span>
                </div>
              </div>
              <Link to="/contact" className="btn-primary py-5 inline-flex">Start Your Project <ChevronRight className="w-5 h-5 ml-2" /></Link>
            </div>
            <div className="lg:w-1/2 rounded-3xl overflow-hidden shadow-2xl">
              <img 
                src={current.img} 
                alt={current.title} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const GalleryPage = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const images = [
    { src: "/IMG_1895.jpg", span: "md:col-span-2 md:row-span-2" },
    { src: "/unnamed.jpg", span: "md:col-span-2" },
    { src: "/unnamed-2.jpg", span: "md:col-span-1" },
    { src: "/unnamed-3.jpg", span: "md:col-span-1" },
    { src: "/IMG_1723.jpg", span: "md:col-span-2" },
    { src: "/IMG_1725.jpg", span: "md:col-span-1" },
    { src: "/IMG_1726.jpg", span: "md:col-span-1" },
    { src: "/IMG_1983.JPG", span: "md:col-span-2 md:row-span-2" },
    { src: "/IMG_1984.JPG", span: "md:col-span-2" },
    { src: "/IMG_1985.JPG", span: "md:col-span-1" },
    { src: "/IMG_2025 (1).JPG", span: "md:col-span-1" },
    { src: "/IMG_2026 (1).JPG", span: "md:col-span-2" },
    { src: "/IMG_2027 (1).JPG", span: "md:col-span-2" },
    { src: "/IMG_2028 (1).JPG", span: "md:col-span-4" },
    { src: "/Untitled-design-6-1.png", span: "md:col-span-2" },
    { src: "/Untitled-design-7-1.png", span: "md:col-span-2" },
    { src: "/image2-4.jpeg", span: "md:col-span-2 md:row-span-2" },
    { src: "/Untitled-design-8-1-scaled.png", span: "md:col-span-2" },
    { src: "/Untitled-design-9-1.png", span: "md:col-span-2" },
    { src: "/4-1.png", span: "md:col-span-2" },
    { src: "/5-1.png", span: "md:col-span-2" },
    { src: "/7-1.png", span: "md:col-span-4" }
  ];

  return (
    <div className="bg-white">
      <PageHeader title="Project Gallery" subtitle="Real Installs. Real Results." bgImage="/IMG_1895.jpg" />
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[250px]">
             {images.map((img, i) => (
               <div 
                 key={i} 
                 className={`${img.span} relative group overflow-hidden rounded-2xl shadow-lg cursor-zoom-in`}
                 onClick={() => setSelectedImage(img.src)}
               >
                 <img src={img.src} alt={`Gallery Installation ${i + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" referrerPolicy="no-referrer" />
                 <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/20 transition-colors duration-500"></div>
               </div>
             ))}
           </div>
        </div>
      </section>
      <Lightbox src={selectedImage} onClose={() => setSelectedImage(null)} />
    </div>
  );
};

const FinancingPage = () => (
  <div className="bg-white">
    <PageHeader title="Financing" subtitle="Power Now, Pay Later" bgImage="/Untitled-design-8-1-scaled.png" />
    <FinancingSection />
  </div>
);

const ContactPage = () => (
  <div className="bg-white">
    <PageHeader title="Contact Us" subtitle="Start Your Custom Plan" bgImage="/unnamed-3.jpg" />
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-16">
          <div className="lg:w-1/2">
            <div className="bg-slate-950 p-12 rounded-3xl text-white relative overflow-hidden h-full">
              <h2 className="text-4xl font-black tracking-tighter mb-8 italic">Ready to Secure Your Peace of Mind?</h2>
              <div className="space-y-8 relative z-10">
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center">
                    <Phone className="w-6 h-6 text-primary fill-primary" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Call Now</p>
                    <p className="text-2xl font-black">(225) 313-0555</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-action fill-action" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Visit Us</p>
                    <p className="text-2xl font-black">Baton Rouge, LA</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <a href="https://www.facebook.com/profile.php?id=100070781741732" target="_blank" rel="noopener noreferrer" className="w-14 h-14 bg-[#1877F2]/10 hover:bg-[#1877F2]/20 transition-colors rounded-2xl flex items-center justify-center">
                    <Facebook className="w-6 h-6 text-[#1877F2]" />
                  </a>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Follow Us</p>
                    <a href="https://www.facebook.com/profile.php?id=100070781741732" target="_blank" rel="noopener noreferrer" className="text-2xl font-black hover:text-[#1877F2] transition-colors">Facebook</a>
                  </div>
                </div>
              </div>
              <div className="mt-16 pt-12 border-t border-white/10">
                <p className="text-slate-400 text-sm font-medium leading-relaxed">
                  Serving Baton Rouge, Prairieville, Denham Springs, Gonzales, and surrounding areas across South Louisiana.
                </p>
              </div>
              <Zap className="absolute -bottom-10 -right-10 w-64 h-64 text-white/5" />
            </div>
            
          </div>
          <div className="lg:w-1/2">
            <LeadForm />
          </div>
        </div>

        <div className="mt-16 w-full h-[450px] bg-slate-100 rounded-3xl overflow-hidden shadow-xl border border-slate-100">
          <iframe
            title="South Louisiana Service Area"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d441029.3562623321!2d-91.44280590858102!3d30.342171440788645!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8626a760e58d56b3%3A0xc39f28a50965e6d6!2sBaton%20Rouge%2C%20LA!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full h-full"
          ></iframe>
        </div>
      </div>
    </section>
  </div>
);

const Layout = ({ children, hideFooter = false }: { children: ReactNode; hideFooter?: boolean }) => {
  useScrollToTop();
  useScrollReveal();
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        {children}
      </main>
      {!hideFooter && <Footer />}
    </div>
  );
};

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/about" element={<Layout><AboutPage /></Layout>} />
        <Route path="/services/installation" element={<Layout><ServicePage type="installation" /></Layout>} />
        <Route path="/services/maintenance" element={<Layout><ServicePage type="maintenance" /></Layout>} />
        <Route path="/services/repair" element={<Layout><ServicePage type="repair" /></Layout>} />
        <Route path="/gallery" element={<Layout><GalleryPage /></Layout>} />
        <Route path="/financing" element={<Layout><FinancingPage /></Layout>} />
        <Route path="/contact" element={<Layout hideFooter={true}><ContactPage /></Layout>} />
      </Routes>
    </HashRouter>
  );
}

