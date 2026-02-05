'use client';

import { Mail, Github, Linkedin, MapPin, Download, Award, Code, Shield, CheckCircle, Clock, Calendar, Users, Download as DownloadIcon, Camera, Briefcase, GraduationCap, Heart, Zap, Search, ChevronRight, ExternalLink } from 'lucide-react';
import { useEffect, useState, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function AboutContent() {
  const searchParams = useSearchParams();
  const isAdmin = searchParams.get('admin') === 'true';
  const [activeSection, setActiveSection] = useState<string>('overview');
  const [aboutData, setAboutData] = useState<any>(null);
  const [liveStats, setLiveStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Define sections for navigation
  const navigation = [
    { id: 'overview', label: 'Overview', icon: Users },
    { id: 'philosophy', label: 'Philosophy', icon: Zap },
    { id: 'experience', label: 'Experience', icon: Briefcase },
    { id: 'stack', label: 'Tech Stack', icon: Code },
    { id: 'contact', label: 'Contact', icon: Mail },
  ];

  useEffect(() => {
    const loadData = async () => {
      try {
        const [aboutRes, statsRes] = await Promise.all([
          fetch('/About.json'),
          fetch('/api/stats')
        ]);

        const about = await aboutRes.json();
        const stats = await statsRes.json();

        setAboutData(about);
        setLiveStats(stats);
      } catch (err) {
        console.error("Failed to load page data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Handle scroll to update active section
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;
      for (const section of navigation) {
        const element = document.getElementById(section.id);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetHeight = element.offsetHeight;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section.id);
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 100,
        behavior: 'smooth'
      });
      setActiveSection(id);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        setAboutData({
          ...aboutData,
          profile: {
            ...aboutData.profile,
            avatar: data.path
          }
        });
      }
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a192f]">
        <div className="relative">
          <div className="w-20 h-20 border-2 border-[var(--accent)]/20 rounded-full"></div>
          <div className="absolute inset-0 w-20 h-20 border-t-2 border-[var(--accent)] rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center text-[var(--accent)] font-mono text-xs">LOADING</div>
        </div>
      </div>
    );
  }

  if (!aboutData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a192f] text-red-500 font-mono italic">
        [ERROR]: Failed to initialize portfolio kernel.
      </div>
    );
  }

  const stats = [
    { icon: Calendar, value: `${aboutData.stats?.experience || 0}+`, label: 'Years Exp' },
    { icon: Code, value: `${liveStats?.modules || aboutData.stats?.projects || 0}+`, label: 'Applications' },
    { icon: DownloadIcon, value: `${(liveStats?.totalDownloads || 0).toLocaleString()}+`, label: 'Downloads' },
    { icon: Award, value: `${aboutData.certifications?.length || 0}`, label: 'Certificates' }
  ];

  return (
    <div className="min-h-screen bg-[#0a192f] text-gray-300 selection:bg-[var(--accent)]/30 selection:text-[var(--accent)]">
      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[var(--accent)]/5 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[20%] right-[-5%] w-[30%] h-[30%] bg-blue-500/5 blur-[100px] rounded-full"></div>
        <div className="absolute top-[30%] right-[10%] w-[20%] h-[20%] bg-purple-500/5 blur-[80px] rounded-full"></div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 py-12 relative z-10">
        <div className="flex flex-col lg:flex-row gap-12">

          {/* LEFT SIDEBAR - Navigation */}
          <aside className="lg:w-1/4">
            <div className="lg:sticky lg:top-24 space-y-8">
              {/* Identity Card */}
              <div className="p-6 rounded-2xl bg-[#112240]/40 border border-gray-800/50 backdrop-blur-xl">
                <div className="relative mb-6 group inline-block">
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[var(--accent)] to-teal-500 p-[1px] transform rotate-3 transition-transform group-hover:rotate-0">
                    <div className="w-full h-full rounded-2xl bg-[#0a192f] overflow-hidden">
                      {aboutData.profile?.avatar ? (
                        <img
                          src={aboutData.profile?.avatar}
                          alt={aboutData.profile?.name}
                          className="w-full h-full object-cover transform -rotate-3 transition-transform group-hover:rotate-0"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-3xl">👨‍💻</div>
                      )}
                    </div>
                  </div>

                  {isAdmin && (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute -bottom-2 -right-2 p-2 bg-[var(--accent)] text-[var(--primary)] rounded-lg shadow-xl hover:scale-110 transition-all z-10"
                    >
                      <Camera size={16} />
                    </button>
                  )}
                  <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
                </div>

                <h2 className="text-xl font-bold text-white mb-1">{aboutData.profile?.name}</h2>
                <p className="text-sm text-[var(--accent)] font-mono mb-4">{aboutData.profile?.title}</p>

                <div className="space-y-3 pb-6 border-b border-gray-800/50">
                  <div className="flex items-center gap-3 text-xs">
                    <MapPin size={14} className="text-gray-500" />
                    <span>{aboutData.profile?.location}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <Mail size={14} className="text-gray-500" />
                    <span className="truncate">{aboutData.profile?.email?.replace(/[\[\]]/g, '')}</span>
                  </div>
                </div>

                <div className="pt-6 flex gap-3">
                  <a href={aboutData.profile?.github} target="_blank" className="p-2 rounded-lg bg-gray-800/50 hover:bg-[var(--accent)]/20 hover:text-[var(--accent)] transition-all">
                    <Github size={18} />
                  </a>
                  <a href={aboutData.profile?.linkedin?.startsWith('http') ? aboutData.profile.linkedin : `https://${aboutData.profile?.linkedin}`} target="_blank" className="p-2 rounded-lg bg-gray-800/50 hover:bg-blue-500/20 hover:text-blue-400 transition-all">
                    <Linkedin size={18} />
                  </a>
                </div>
              </div>

              {/* Navigation Menu */}
              <nav className="space-y-1">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeSection === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => scrollToSection(item.id)}
                      className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all group ${isActive
                        ? 'bg-[var(--accent)]/10 text-[var(--accent)] border-r-2 border-[var(--accent)]'
                        : 'hover:bg-gray-800/30'
                        }`}
                    >
                      <Icon size={18} className={isActive ? 'text-[var(--accent)]' : 'text-gray-500 group-hover:text-gray-300'} />
                      <span className="text-sm font-medium">{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* MAIN CONTENT Area */}
          <main className="lg:w-3/4 space-y-32">

            {/* OVERVIEW SECTION */}
            <section id="overview" className="scroll-mt-24 space-y-12">
              <div className="space-y-6">
                <div className="inline-block px-3 py-1 bg-[var(--accent)]/10 text-[var(--accent)] text-[10px] font-bold uppercase tracking-widest rounded-md border border-[var(--accent)]/20">
                  System.Overview // Profile
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight">
                  {(aboutData.profile?.headline || "Crafting Digital [[Experiences]] with Precision & Security.")
                    .split(/\[\[(.*?)\]\]/g)
                    .map((part: string, i: number) => (
                      i % 2 === 1 ? (
                        <span key={i} className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent)] to-blue-400">
                          {part}
                        </span>
                      ) : (
                        part
                      )
                    ))
                  }
                </h1>
                <p className="text-lg text-gray-400 leading-relaxed max-w-4xl">
                  {aboutData.profile?.bio}
                </p>
                <div className="bg-[#112240]/50 p-6 rounded-2xl border-l-4 border-[var(--accent)] italic text-gray-300 relative">
                  <div className="absolute top-4 right-6 opacity-10"><Zap size={40} /></div>
                  "{aboutData.profile?.quote}"
                </div>
              </div>

              {/* Grid Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.map((stat, idx) => {
                  const Icon = stat.icon;
                  return (
                    <div key={idx} className="p-6 rounded-2xl bg-[#112240]/30 border border-gray-800/50 hover:border-[var(--accent)]/30 transition-all group">
                      <Icon className="text-[var(--accent)] mb-3 group-hover:scale-110 transition-transform" size={24} />
                      <div className="text-2xl font-black text-white">{stat.value}</div>
                      <div className="text-[10px] uppercase tracking-wider text-gray-500 mt-1">{stat.label}</div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* PHILOSOPHY SECTION */}
            <section id="philosophy" className="scroll-mt-24 space-y-12">
              <div className="space-y-4">
                <div className="flex items-center gap-4 text-[var(--accent)]">
                  <Zap size={20} />
                  <span className="font-bold uppercase tracking-[0.2em] text-xs">Core Philosophy</span>
                  <div className="h-[1px] flex-grow bg-gray-800"></div>
                </div>
                <h2 className="text-3xl font-bold text-white">How I Think & Build</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {(aboutData.philosophy || []).map((item: any, idx: number) => (
                  <div key={idx} className="group p-8 rounded-2xl bg-[#112240]/20 border border-gray-800/50 hover:bg-[var(--accent)]/5 hover:border-[var(--accent)]/30 transition-all">
                    <div className="text-4xl mb-6 group-hover:scale-110 transition-transform inline-block">{item.icon}</div>
                    <h3 className="text-lg font-bold text-white mb-3">{item.title}</h3>
                    <p className="text-sm text-gray-400 mb-6">{item.description}</p>
                    <ul className="space-y-2">
                      {(item.points || []).map((p: string, i: number) => (
                        <li key={i} className="flex items-center gap-2 text-xs text-gray-500">
                          <CheckCircle size={10} className="text-[var(--accent)]" />
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Verification Steps - Horizontal scroll or grid */}
              <div className="p-10 rounded-3xl bg-gradient-to-br from-[#112240] to-transparent border border-gray-800/50">
                <h3 className="text-xl font-bold text-white mb-10 flex items-center gap-3">
                  <Shield size={20} className="text-[var(--accent)]" />
                  Execution Pipeline
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-8 relative">
                  {(aboutData.verificationProcess || []).map((step: any, idx: number) => (
                    <div key={idx} className="relative z-10 space-y-4">
                      <div className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center text-[var(--accent)] font-bold border border-gray-700">
                        {step.step}
                      </div>
                      <h4 className="text-sm font-bold text-white uppercase">{step.title}</h4>
                      <p className="text-[10px] text-gray-500 leading-relaxed">{step.description}</p>
                    </div>
                  ))}
                  <div className="hidden md:block absolute top-5 left-10 right-10 h-[1px] bg-gray-800 z-0"></div>
                </div>
              </div>
            </section>

            {/* EXPERIENCE SECTION */}
            <section id="experience" className="scroll-mt-24 space-y-12">
              <div className="space-y-4">
                <div className="flex items-center gap-4 text-blue-400">
                  <Briefcase size={20} />
                  <span className="font-bold uppercase tracking-[0.2em] text-xs">Career Path</span>
                  <div className="h-[1px] flex-grow bg-gray-800"></div>
                </div>
                <h2 className="text-3xl font-bold text-white">Professional Journey</h2>
              </div>

              <div className="relative pl-8 border-l border-gray-800 space-y-16">
                {(aboutData.experience || []).map((exp: any, idx: number) => (
                  <div key={idx} className="relative">
                    <div className="absolute -left-[41px] top-1 w-4 h-4 rounded-full bg-[#0a192f] border-2 border-[var(--accent)] z-10"></div>
                    <div className="space-y-4">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                        <div>
                          <span className="text-xs font-mono text-[var(--accent)] bg-[var(--accent)]/10 px-2 py-1 rounded mb-2 inline-block">
                            {exp.period}
                          </span>
                          <h3 className="text-xl font-bold text-white">{exp.role}</h3>
                          <div className="text-gray-400 font-medium">{exp.company}</div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 max-w-2xl italic leading-relaxed">
                        "{exp.description}"
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                        {(exp.achievements || []).map((ach: string, i: number) => (
                          <div key={i} className="flex items-start gap-2 text-xs text-gray-400 bg-gray-800/20 p-3 rounded-lg border border-gray-800/30">
                            <ChevronRight size={14} className="text-[var(--accent)] flex-shrink-0 mt-0.5" />
                            {ach}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* TECH STACK SECTION */}
            <section id="stack" className="scroll-mt-24 space-y-12">
              <div className="space-y-4">
                <div className="flex items-center gap-4 text-purple-400">
                  <Zap size={20} />
                  <span className="font-bold uppercase tracking-[0.2em] text-xs">Technology Arsenal</span>
                  <div className="h-[1px] flex-grow bg-gray-800"></div>
                </div>
                <h2 className="text-3xl font-bold text-white">The Tools I Master</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(aboutData.techStack || {}).map(([category, techs]: [any, any]) => (
                  <div key={category} className="p-6 rounded-2xl bg-[#112240]/20 border border-gray-800/50 hover:bg-[#112240]/40 transition-all">
                    <h3 className="text-xs font-black uppercase tracking-widest text-[var(--accent)] mb-6">{category}</h3>
                    <div className="flex flex-wrap gap-2">
                      {(techs || []).map((t: string, i: number) => (
                        <span key={i} className="px-3 py-1 bg-gray-800/50 text-xs text-gray-400 rounded-md border border-gray-700/50 hover:border-[var(--accent)]/50 transition-colors">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Certifications Block */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-white flex items-center gap-3">
                    <GraduationCap size={20} className="text-[var(--accent)]" />
                    Board Certifications
                  </h3>
                  <div className="space-y-3">
                    {(aboutData.certifications || []).map((cert: any, i: number) => (
                      <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-gray-800/20 border border-gray-800/50">
                        <span className="text-sm font-medium text-gray-300">{cert.name}</span>
                        <span className="text-[10px] font-mono text-gray-500">{cert.year}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-white flex items-center gap-3">
                    <Heart size={20} className="text-pink-500" />
                    Beyond the IDE
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {(aboutData.personalInterests || []).map((interest: string, i: number) => (
                      <div key={i} className="px-4 py-2 rounded-xl bg-gray-800/20 border border-gray-800/50 text-xs text-gray-400">
                        {interest}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* CONTACT SECTION */}
            <section id="contact" className="scroll-mt-24 pb-32">
              <div className="p-12 rounded-[2rem] bg-gradient-to-br from-[#112240] to-transparent border border-[var(--accent)]/10 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[var(--accent)]/30 to-transparent"></div>

                <h2 className="text-4xl font-black text-white mb-6">Let's Build Something <span className="text-[var(--accent)]">Secure</span> Together.</h2>
                <p className="text-gray-400 max-w-2xl mx-auto mb-10">
                  Available for full-time roles, architectural consulting, and high-impact freelance collaborations.
                </p>

                <div className="flex flex-wrap justify-center gap-4">
                  <a href={`mailto:${aboutData.profile?.email?.replace(/[\[\]]/g, '')}`} className="px-8 py-4 bg-gradient-to-r from-[var(--accent)] to-teal-500 text-[var(--primary)] font-black rounded-2xl hover:shadow-[0_0_30px_rgba(0,212,170,0.4)] transition-all">
                    Hire Me Now
                  </a>
                  <a href="/downloads" className="px-8 py-4 bg-gray-800 font-bold rounded-2xl border border-gray-700 hover:bg-gray-700 transition-all">
                    Explore Ecosystem
                  </a>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-16 pt-16 border-t border-gray-800/50 text-left">
                  {(aboutData.contactChannels || []).map((c: any, i: number) => (
                    <div key={i} className="space-y-4">
                      <div className="text-[10px] font-black uppercase text-gray-500 tracking-widest">{c.title}</div>
                      <p className="text-[10px] text-gray-500">{c.description}</p>
                      <div className="text-xs font-bold text-[var(--accent)]">{c.email || c.note || "Open Repo"}</div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

          </main>
        </div>
      </div>
    </div>
  );
}

export default function AboutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#0a192f]">
        <div className="w-16 h-16 border-4 border-[var(--accent)] border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <AboutContent />
    </Suspense>
  );
}