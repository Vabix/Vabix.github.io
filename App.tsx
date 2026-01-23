import React, { useEffect, useState, useRef, useMemo } from 'react';

// --- TYPY I KONFIGURACJA ---

type Lang = 'en' | 'pl';
type SoundType = 'hover' | 'click' | 'switch';

interface TranslationData {
  sub: string;
  setupTitle: string;
  animeTitle: string;
  pocketTitle: string;
  doingTitle: string;
  doingDesc: string;
  schoolTitle: string;
  schoolSummary: string;
  schoolDesc: string;
  langSwitch: string;
  visitProfile: string;
  satisfied: string;
  batteryRip: string;
  socialsTitle: string;
  footer: string;
}

const TRANSLATIONS: Record<Lang, TranslationData> = {
  en: {
    sub: "Gamer • Tech Enthusiast • Developer",
    setupTitle: "Battle Station",
    animeTitle: "Watchlist",
    pocketTitle: "Everyday Carry",
    doingTitle: "Current Status",
    doingDesc: "Mostly gaming and hanging out on Discord. Not doing anything massive right now, just vibing. Big fan of Hatsune Miku as you can see! :P",
    schoolTitle: "Cloud Schooling",
    schoolSummary: "People often ask how studying from home works, so here's the breakdown...",
    schoolDesc: "Essentially, I have a lot of freedom. I'm mostly self-taught using internet resources and AI tools. Passing subjects involves two parts: written and oral exams.\n\n1. The written part is a standard worksheet—complete tasks, get a score.\n\n2. The oral part is where it gets real. You talk to an examiner. I usually choose the 'Project' path: I create a presentation on a curriculum topic, and they grade my knowledge and performance.\n\nIt's efficient and gives me time to focus on what actually matters to me.",
    langSwitch: "PL",
    visitProfile: "Open Profile",
    satisfied: "Rock solid",
    batteryRip: "battery critical",
    socialsTitle: "Connect",
    footer: "Vabix Online © 2024"
  },
  pl: {
    sub: "Gracz • Pasjonat Technologii • Deweloper",
    setupTitle: "Stanowisko",
    animeTitle: "Anime",
    pocketTitle: "W kieszeni",
    doingTitle: "Status",
    doingDesc: "Głównie gram i siedzę na Discordzie. Niczego wielkiego obecnie nie robię, po prostu chilluje. No i jestem fanem Hatsune Miku jak widać :P",
    schoolTitle: "Szkoła w Chmurze",
    schoolSummary: "Często pytacie jak wygląda nauka zdalna, więc oto odpowiedź...",
    schoolDesc: "W skrócie: mam dużo swobody. Uczę się sam z internetu i przy pomocy AI. Aby zdać przedmiot, muszę zaliczyć część pisemną i ustną.\n\n1. Pisemny to klasyczna karta pracy z zadaniami.\n\n2. Ustny jest ciekawszy – rozmawiam z egzaminatorem. Zazwyczaj wybieram formę 'Projektu': robię prezentację na wybrany temat, a egzaminator ocenia moją wiedzę i sposób wypowiedzi.\n\nTo efektywny system, który daje mi czas na rozwijanie własnych pasji.",
    langSwitch: "EN",
    visitProfile: "Odwiedź profil",
    satisfied: "Bardzo zadowolony",
    batteryRip: "bateria RIP",
    socialsTitle: "Social Media",
    footer: "Vabix Online © 2024"
  }
};

// --- CUSTOM HOOK: AUDIO ENGINE ---

const useAudio = (muted: boolean) => {
  const audioCtxRef = useRef<AudioContext | null>(null);

  const initAudio = () => {
    if (!audioCtxRef.current) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      audioCtxRef.current = new AudioContextClass();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  };

  const play = (type: SoundType) => {
    if (muted) return;
    initAudio();
    const ctx = audioCtxRef.current!;
    const now = ctx.currentTime;
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);

    // Randomize pitch slightly for organic feel
    const randomDetune = (Math.random() - 0.5) * 50; 

    if (type === 'hover') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now);
      osc.detune.setValueAtTime(randomDetune, now);
      gain.gain.setValueAtTime(0.01, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      osc.start(now);
      osc.stop(now + 0.05);
    } else if (type === 'click') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(110, now + 0.15);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      osc.start(now);
      osc.stop(now + 0.15);
    } else if (type === 'switch') {
      osc.type = 'square';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(1200, now + 0.1);
      gain.gain.setValueAtTime(0.02, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
      osc.start(now);
      osc.stop(now + 0.1);
    }
  };

  return play;
};

// --- KOMPONENTY UI ---

// Icon wrapper for consistent sizing
const IconWrapper: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <div className={`flex items-center justify-center shrink-0 ${className}`}>{children}</div>
);

interface TileProps {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  className?: string;
  defaultOpen?: boolean;
  muted: boolean;
  onInteract: (type: SoundType) => void;
}

const Tile: React.FC<TileProps> = ({ icon, title, children, className = "", defaultOpen = false, muted, onInteract }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const contentRef = useRef<HTMLDivElement>(null);

  const toggle = () => {
    onInteract('click');
    setIsOpen(!isOpen);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggle();
    }
  };

  return (
    <div 
      role="button"
      tabIndex={0}
      aria-expanded={isOpen}
      onClick={toggle}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => !isOpen && onInteract('hover')}
      className={`
        glass-card relative group transition-all duration-500 ease-out outline-none
        rounded-2xl border border-white/5 overflow-hidden
        ${isOpen ? 'bg-slate-900/90 ring-1 ring-sky-500/50 shadow-[0_0_30px_-5px_rgba(14,165,233,0.15)]' : 'hover:bg-slate-800/40 hover:border-white/10 hover:-translate-y-1 hover:shadow-xl'}
        ${className}
      `}
    >
      {/* Background Glow Effect */}
      <div className={`absolute inset-0 bg-gradient-to-br from-sky-500/10 via-transparent to-transparent opacity-0 transition-opacity duration-700 ${isOpen || 'group-hover:opacity-100'}`} />

      <div className="flex flex-col p-6 relative z-10">
        <div className={`flex items-center gap-4 transition-all duration-500 ${isOpen ? 'mb-4' : 'mb-0 h-24 justify-center'}`}>
          <div className={`transition-all duration-500 ${isOpen ? 'scale-75 text-sky-400' : 'scale-125 text-white drop-shadow-[0_0_15px_rgba(56,189,248,0.5)]'}`}>
            {icon}
          </div>
          
          <h3 className={`font-bold text-white tracking-wide transition-all duration-500 ${isOpen ? 'text-lg opacity-100 translate-x-0' : 'text-xl opacity-0 -translate-x-4 absolute left-1/2'}`}>
            {isOpen && title}
          </h3>
           {/* Fallback title for closed state if we wanted one, but icon is enough */}
           {!isOpen && <h3 className="sr-only">{title}</h3>}

          <div className={`ml-auto text-sky-500/50 transition-transform duration-500 ${isOpen ? 'rotate-180 text-sky-400' : 'group-hover:text-sky-400'}`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        <div 
          className="grid transition-all duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)]"
          style={{ gridTemplateRows: isOpen ? '1fr' : '0fr', opacity: isOpen ? 1 : 0 }}
        >
          <div className="overflow-hidden">
            <div className="pt-2 border-t border-white/10 text-slate-300 text-sm md:text-base leading-relaxed animate-in fade-in slide-in-from-top-2 duration-500 delay-100 fill-mode-both">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- GŁÓWNA APLIKACJA ---

const App: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Persisted State
  const [lang, setLang] = useState<Lang>(() => (localStorage.getItem('vabix_lang') as Lang) || 'en');
  const [muted, setMuted] = useState(() => localStorage.getItem('vabix_muted') === 'true');

  const playSound = useAudio(muted);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    localStorage.setItem('vabix_lang', lang);
  }, [lang]);

  useEffect(() => {
    localStorage.setItem('vabix_muted', String(muted));
  }, [muted]);

  const toggleLang = () => {
    playSound('switch');
    setLang(prev => prev === 'en' ? 'pl' : 'en');
  };

  const toggleMute = () => {
    setMuted(!muted);
    // Don't play sound immediately on mute toggle logic, but visual feedback is enough
  };

  const t = TRANSLATIONS[lang];

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 font-sans selection:bg-sky-500/30 selection:text-white overflow-x-hidden relative pb-24">
      
      {/* --- Fixed Controls --- */}
      <div className="fixed top-6 right-6 z-50 flex items-center gap-3 animate-fade-in-down">
        <button 
          onClick={toggleMute}
          className={`
            p-2.5 rounded-full glass-card transition-all duration-300 cursor-pointer border border-white/5
            ${muted ? 'text-slate-500 hover:text-slate-300 bg-slate-900/50' : 'text-sky-400 hover:text-white hover:bg-sky-500/20 shadow-[0_0_15px_rgba(14,165,233,0.3)]'}
          `}
          aria-label={muted ? "Unmute" : "Mute"}
        >
          {muted ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" /></svg>
          ) : (
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>
          )}
        </button>
        <button 
          onClick={toggleLang}
          onMouseEnter={() => playSound('hover')}
          className="px-5 py-2 rounded-full glass-card border border-white/5 text-xs font-bold tracking-widest text-sky-400 hover:text-white hover:bg-sky-500/20 hover:border-sky-500/30 transition-all cursor-pointer shadow-lg hover:shadow-sky-500/20"
        >
          {t.langSwitch}
        </button>
      </div>

      <main className={`max-w-6xl mx-auto px-4 sm:px-6 pt-6 md:pt-12 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        
        {/* --- Header Section --- */}
        <div className="relative mb-16 group">
          {/* Banner */}
          <div className="w-full h-48 sm:h-80 rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl bg-slate-900 relative z-0">
            <img 
              src="https://cdn.discordapp.com/banners/1344498850093858857/a_e14766dd49e59c318c5f77352d0b762e.webp?size=1024&animated=true" 
              alt="Banner" 
              className="w-full h-full object-cover opacity-80 transition-transform duration-1000 ease-in-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/50 to-transparent"></div>
          </div>

          {/* Profile Info */}
          <div className="flex flex-col md:flex-row items-end -mt-16 md:-mt-24 px-6 md:px-12 relative z-10 gap-6 md:gap-8">
             <div className="relative group/avatar">
                <div className="absolute -inset-1 bg-gradient-to-tr from-sky-500 to-blue-600 rounded-full blur-md opacity-50 group-hover/avatar:opacity-100 transition-opacity duration-500 animate-pulse-slow"></div>
                <div className="w-32 h-32 md:w-52 md:h-52 rounded-full border-[6px] border-[#020617] overflow-hidden bg-slate-800 shadow-2xl relative z-10">
                  <img 
                    src="https://cdn.discordapp.com/avatars/1344498850093858857/a_36aa094b1081ba2a02607b295381600e.webp?size=512&animated=true" 
                    alt="Vabix" 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover/avatar:scale-110"
                  />
                </div>
             </div>
            <div className="mb-2 md:mb-10 text-center md:text-left flex-1">
              <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-none text-white drop-shadow-xl">
                Vabix<span className="text-sky-500">.</span>
              </h1>
              <div className="flex flex-wrap gap-2 justify-center md:justify-start mt-3">
                 {t.sub.split(' • ').map((tag, i) => (
                    <span key={i} className="px-3 py-1 rounded-md bg-white/5 border border-white/5 text-xs font-mono text-sky-200/80 uppercase tracking-wider">
                       {tag}
                    </span>
                 ))}
              </div>
            </div>
          </div>
        </div>

        {/* --- Grid Layout --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 items-start">
          
          {/* Socials */}
          <Tile 
             icon={<svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>}
             title={t.socialsTitle} 
             className="sm:col-span-2" 
             muted={muted} onInteract={playSound}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <a href="https://discord.com" target="_blank" rel="noreferrer" className="flex items-center gap-4 p-3 rounded-xl bg-[#5865F2]/10 border border-[#5865F2]/20 hover:bg-[#5865F2]/20 hover:border-[#5865F2]/40 transition-all group/discord">
                <div className="w-10 h-10 rounded-lg bg-[#5865F2] flex items-center justify-center text-white shadow-lg shadow-[#5865F2]/20">
                   {/* Discord Icon SVG */}
                   <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.118.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.086 2.157 2.419 0 1.334-.956 2.42-2.157 2.42zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.086 2.157 2.419 0 1.334-.946 2.42-2.157 2.42z"/></svg>
                </div>
                <div>
                  <div className="text-[10px] text-indigo-300 uppercase font-bold tracking-wider">Discord</div>
                  <div className="text-white font-mono font-medium">vabiix</div>
                </div>
              </a>
              <a href="https://steamcommunity.com/profiles/76561198954882498/" target="_blank" rel="noreferrer" className="flex items-center gap-4 p-3 rounded-xl bg-slate-800/50 border border-white/5 hover:bg-slate-700/50 hover:border-sky-500/30 transition-all group/steam">
                <div className="w-10 h-10 rounded-lg bg-[#171a21] flex items-center justify-center text-white shadow-lg">
                   {/* Steam Icon SVG */}
                   <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M11.979 0C5.666 0 .502 4.909.043 11.127L5.5 13.398a4.503 4.503 0 0 1 3.518-2.029c.176 0 .35.013.522.035l3.235-4.66C12.564 6.305 12.276 6 11.979 6c-2.761 0-5 2.239-5 5s2.239 5 5 5c2.762 0 5-2.239 5-5s-2.238-5-5-5zm5.793 6.634c-.035-.116-.084-.225-.133-.334a9.932 9.932 0 0 1 1.764 1.343c.895.895 1.583 1.956 2.016 3.123l-4.502 1.87c-.203-2.316-1.571-4.321-3.663-5.385l4.518-1.879v1.262z"/></svg>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Steam</div>
                  <div className="text-sky-400 group-hover/steam:underline decoration-sky-500/50 underline-offset-2">{t.visitProfile}</div>
                </div>
              </a>
            </div>
          </Tile>

          {/* PC Spec */}
          <Tile 
             icon={<svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
             title={t.setupTitle} 
             muted={muted} onInteract={playSound}
          >
            <ul className="space-y-3 text-sm">
              {[
                { label: "CPU", val: "Ryzen 5 5600x" },
                { label: "GPU", val: "RTX 4070 Palit" },
                { label: "RAM", val: "32GB 5200MHz" },
                { label: "Data", val: "6TB Total" }
              ].map((item, i) => (
                <li key={i} className="flex justify-between border-b border-white/5 pb-2 last:border-0">
                  <span className="text-slate-500 font-medium">{item.label}</span> 
                  <span className="text-sky-200 font-mono">{item.val}</span>
                </li>
              ))}
              <li className="pt-2 mt-2 border-t border-dashed border-white/10 text-white/80">
                <span className="text-slate-500 text-[10px] uppercase font-bold block mb-1">Gear</span> 
                G502 X & Redragon Gloria Pro
              </li>
            </ul>
          </Tile>

          {/* Anime List */}
          <Tile 
             icon={<svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>}
             title={t.animeTitle} 
             muted={muted} onInteract={playSound}
          >
            <div className="space-y-2">
              {["Vinland Saga", "Death Note", "Code Geass"].map((anime, idx) => (
                <div key={anime} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors group/anime">
                  <span className="text-lg font-black text-white/5 group-hover/anime:text-sky-500/20 transition-colors">0{idx + 1}</span>
                  <span className="text-slate-200 group-hover/anime:text-sky-300 font-medium transition-colors">{anime}</span>
                </div>
              ))}
            </div>
          </Tile>

          {/* Activity / Status */}
          <Tile 
             icon={<svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
             title={t.doingTitle} 
             className="sm:col-span-2 xl:col-span-1" 
             muted={muted} onInteract={playSound}
          >
             <div className="relative pl-4 border-l-2 border-sky-500/30">
               <p className="text-slate-300 italic">"{t.doingDesc}"</p>
             </div>
          </Tile>

          {/* School */}
          <Tile 
             icon={<svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>}
             title={t.schoolTitle} 
             className="lg:col-span-3 xl:col-span-2" 
             muted={muted} onInteract={playSound}
          >
            <p className="text-sky-400 text-xs font-bold uppercase tracking-widest mb-4 bg-sky-950/30 inline-block px-2 py-1 rounded">
              {t.schoolSummary}
            </p>
            <div className="whitespace-pre-wrap text-slate-300/90 font-light">
              {t.schoolDesc}
            </div>
          </Tile>

          {/* Phone / Pocket */}
          <Tile 
             icon={<svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>}
             title={t.pocketTitle} 
             className="lg:col-span-3 xl:col-span-1" 
             muted={muted} onInteract={playSound}
          >
            <div className="space-y-5">
              <div className="relative group/phone">
                <div className="absolute -left-3 top-0 bottom-0 w-1 bg-gradient-to-b from-green-500 to-transparent rounded-full opacity-50 group-hover/phone:opacity-100 transition-opacity"></div>
                <span className="text-[10px] text-sky-500 font-bold uppercase tracking-wider block mb-1">Daily Driver</span>
                <div className="text-white font-medium text-xl group-hover/phone:text-sky-300 transition-colors">OnePlus 12</div>
                <div className="flex items-center gap-2 mt-1">
                   <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                   <p className="text-[10px] text-slate-400">{t.satisfied}</p>
                </div>
              </div>
              
              <div className="space-y-1 border-t border-white/5 pt-4 opacity-50 hover:opacity-100 transition-opacity">
                <div className="text-sm text-slate-400">Xiaomi Mi 11 Lite 5G NE</div>
                <div className="text-sm text-slate-600 line-through flex justify-between">
                   <span>iPhone 11 Pro</span>
                   <span className="no-underline text-[10px] text-red-500 font-mono border border-red-900/50 bg-red-950/30 px-1 rounded">
                     {t.batteryRip}
                   </span>
                </div>
              </div>
            </div>
          </Tile>

        </div>
        
        {/* --- Footer --- */}
        <footer className="mt-24 flex flex-col items-center justify-center opacity-40 hover:opacity-100 transition-opacity duration-700">
           <div className="w-px h-16 bg-gradient-to-b from-sky-500/50 to-transparent mb-6"></div>
           <p className="text-[10px] text-slate-500 uppercase tracking-[0.4em] font-medium">{t.footer}</p>
        </footer>

      </main>

      {/* --- Ambient Background --- */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        {/* Animated Orbs */}
        <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] bg-sky-600/5 blur-[120px] rounded-full animate-float-slow mix-blend-screen"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-blue-800/10 blur-[150px] rounded-full animate-float-medium mix-blend-screen"></div>
        
        {/* Grain Texture */}
        <div className="absolute inset-0 opacity-[0.035]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }}></div>
      </div>
    </div>
  );
};

export default App;
