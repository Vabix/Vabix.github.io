import React, { useEffect, useState, useRef, useCallback } from 'react';

// --- TYPY I DANE ---
type Lang = 'en' | 'pl';
type SoundType = 'hover' | 'click' | 'switch' | 'on';

const TEXTS = {
  en: {
    sub: "Gamer • Tech Enthusiast • Developer",
    setupTitle: "Battle Station",
    animeTitle: "Watchlist",
    pocketTitle: "Tech Stack",
    doingTitle: "Current Status",
    doingDesc: "Currently grinding rank in FPS games and hanging out on Discord. Exploring React ecosystems and messing around with AI agents. Always down for a chat about tech!",
    schoolTitle: "Cloud Education",
    schoolSummary: "Remote learning experience & methodology",
    schoolDesc: "Studying remotely gives me the flexibility to balance coding, gaming, and life. \n\nI rely heavily on self-guided learning via AI tools and documentation. My exams are a mix of written tasks and oral defenses. \n\n• **Oral Exams:** I usually pick the 'Project Presentation' path—building something practical to demonstrate knowledge.\n• **Written:** Standard worksheets, but done from the comfort of my setup.\n\nIt's all about self-discipline vs. absolute freedom.",
    langSwitch: "PL",
    visitProfile: "View Profile",
    satisfied: "Daily Driver",
    batteryRip: "Backup / RIP Battery",
    socialsTitle: "Connect",
    online: "Online in Poland",
    specs: "Specifications"
  },
  pl: {
    sub: "Gracz • Pasjonat Technologii • Developer",
    setupTitle: "Stanowisko",
    animeTitle: "Oglądane",
    pocketTitle: "Sprzęt",
    doingTitle: "Status",
    doingDesc: "Głównie grinduję rangi w FPS-ach i siedzę na Discordzie. Eksploruję ekosystem Reacta i bawię się agentami AI. Zawsze chętny na pogaduchy o technologii!",
    schoolTitle: "Szkoła w Chmurze",
    schoolSummary: "Jak wygląda nauka zdalna i egzaminy?",
    schoolDesc: "Nauka zdalna daje mi elastyczność w łączeniu kodowania, grania i życia. \n\nOpieram się głównie na samokształceniu z pomocą AI i dokumentacji. Egzaminy to miks pisemnych i ustnych. \n\n• **Ustne:** Zazwyczaj wybieram 'Projekt' – tworzę prezentację lub coś praktycznego, by wykazać się wiedzą.\n• **Pisemne:** Standardowe karty pracy, ale robione z wygodnego fotela.\n\nTo ciągła walka samodyscypliny z absolutną wolnością.",
    langSwitch: "EN",
    visitProfile: "Zobacz profil",
    satisfied: "Główny telefon",
    batteryRip: "Zapasowy / Bateria RIP",
    socialsTitle: "Kontakt",
    online: "Czas w Polsce",
    specs: "Specyfikacja"
  }
};

// --- IKONY (Komponenty dla czystości) ---
const Icons = {
  Chevron: ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
  ),
  Discord: () => (
    <svg className="w-full h-full" viewBox="0 0 127.14 96.36" fill="currentColor"><path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.09,105.09,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.11,77.11,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.89,105.89,0,0,0,126.6,80.22c1.24-23.28-5.83-47.57-18.9-72.15ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.45-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.45-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z"/></svg>
  ),
  Steam: () => (
    <svg className="w-full h-full" viewBox="0 0 24 24" fill="currentColor"><path d="M11.979 0C5.666 0 .546 4.935.036 11.176l5.77 8.441 2.214-2.214c-.036-.346-.056-.699-.056-1.059 0-4.971 4.029-9 9-9s9 4.029 9 9-4.029 9-9 9c-3.134 0-5.903-1.606-7.568-4.053L.262 21.056C2.083 23.49 5.257 25.32 11.979 24c6.627 0 12-5.373 12-12s-5.373-12-12-12zm-4.73 13.743c0-2.341 1.898-4.239 4.239-4.239 2.341 0 4.239 1.898 4.239 4.239s-1.898 4.239-4.239 4.239c-2.341 0-4.239-1.898-4.239-4.239zm1.06 0c0 1.756 1.423 3.179 3.179 3.179 1.756 0 3.179-1.423 3.179-3.179s-1.423-3.179-3.179-3.179c-1.756 0-3.179 1.423-3.179 3.179z"/></svg>
  ),
  SoundOn: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>
  ),
  SoundOff: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" /></svg>
  )
};

// --- HOOKI ---

// Hook Audio: Singleton pattern z lazy loadingiem kontekstu
const useSound = (muted: boolean) => {
  const audioCtxRef = useRef<AudioContext | null>(null);

  const play = useCallback((type: SoundType) => {
    if (muted) return;
    
    // Inicjalizacja przy pierwszym użyciu (wymóg przeglądarek)
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    
    if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
    }

    const ctx = audioCtxRef.current;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    // Nowoczesne brzmienia interfejsu (krótsze, mniej inwazyjne)
    switch (type) {
      case 'hover':
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, now);
        gain.gain.setValueAtTime(0.01, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
        break;
      case 'click':
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.linearRampToValueAtTime(100, now + 0.1);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.1);
        break;
      case 'switch':
        osc.type = 'square';
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.exponentialRampToValueAtTime(800, now + 0.1);
        gain.gain.setValueAtTime(0.02, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.15);
        break;
    }
  }, [muted]);

  return play;
};

// Hook Czasu Lokalnego (Polska)
const usePolandTime = () => {
    const [time, setTime] = useState("");
    
    useEffect(() => {
        const update = () => {
            setTime(new Date().toLocaleTimeString('pl-PL', { 
                timeZone: 'Europe/Warsaw', 
                hour: '2-digit', 
                minute: '2-digit' 
            }));
        };
        update();
        const i = setInterval(update, 1000);
        return () => clearInterval(i);
    }, []);
    return time;
};

// --- KOMPONENTY ---

interface TileProps {
  icon: string;
  title: string;
  children: React.ReactNode;
  className?: string;
  defaultOpen?: boolean;
  muted: boolean;
  onPlay: (type: SoundType) => void;
}

const Tile: React.FC<TileProps> = ({ icon, title, children, className = "", defaultOpen = false, muted, onPlay }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const divRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  // Spotlight effect logic
  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    setOpacity(1);
  };

  const handleMouseEnter = () => {
    setOpacity(1);
    if (!isOpen) onPlay('hover');
  };

  const handleMouseLeave = () => {
    setOpacity(0);
  };

  const toggle = () => {
    onPlay('click');
    setIsOpen(!isOpen);
  };

  return (
    <button
      ref={divRef}
      onClick={toggle}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } }}
      className={`
        relative group rounded-3xl text-left outline-none focus-visible:ring-2 focus-visible:ring-sky-400
        bg-slate-900/40 backdrop-blur-md border border-white/5 overflow-hidden transition-all duration-300
        ${isOpen ? 'ring-1 ring-sky-500/30 bg-slate-800/60' : 'hover:bg-slate-800/40'}
        ${className}
      `}
      aria-expanded={isOpen}
      aria-label={`${title} tile`}
    >
      {/* Spotlight Gradient */}
      <div 
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(56,189,248,0.1), transparent 40%)`
        }}
      />
      
      {/* Content */}
      <div className="flex flex-col p-6 relative z-10 h-full">
        <div className={`flex items-center gap-4 transition-all duration-500 ${isOpen ? 'mb-4' : 'mb-0 h-full'}`}>
          <div className={`
             flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-500/20 to-blue-600/20 
             border border-white/10 text-2xl shadow-inner shadow-sky-500/10 shrink-0 transition-transform duration-500
             ${isOpen ? 'scale-100' : 'scale-110 group-hover:scale-125'}
          `}>
            {icon}
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-slate-100 text-lg tracking-tight truncate">{title}</h3>
            {!isOpen && <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold group-hover:text-sky-400 transition-colors">More info</p>}
          </div>

          <div className={`transition-transform duration-500 text-slate-500 ${isOpen ? 'rotate-180 text-sky-400' : 'group-hover:text-slate-300'}`}>
            <Icons.Chevron className="w-5 h-5" />
          </div>
        </div>

        <div 
          className={`grid transition-all duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
        >
          <div className="overflow-hidden">
            <div className="pt-2 text-slate-400 text-sm leading-relaxed border-t border-white/5 mt-2">
              {children}
            </div>
          </div>
        </div>
      </div>
    </button>
  );
};

const App: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [lang, setLang] = useState<Lang>('en');
  const [muted, setMuted] = useState(false);
  const playSound = useSound(muted);
  const time = usePolandTime();

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const toggleLang = () => {
    playSound('switch');
    setLang(prev => prev === 'en' ? 'pl' : 'en');
  };

  const t = TEXTS[lang];

  return (
    <div className="min-h-screen bg-[#050505] text-slate-300 selection:bg-sky-500/30 overflow-x-hidden relative font-sans">
      
      {/* Background Noise & Gradient */}
      <div className="fixed inset-0 pointer-events-none z-0">
         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
         <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-sky-900/20 blur-[120px] rounded-full mix-blend-screen animate-pulse-slow"></div>
         <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-900/10 blur-[100px] rounded-full mix-blend-screen"></div>
      </div>

      {/* Navbar / Controls */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center p-6 pointer-events-none">
         <div className="pointer-events-auto flex items-center gap-2 px-4 py-2 rounded-full glass-card bg-black/20 border border-white/5 backdrop-blur-sm">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
            <span className="text-xs font-mono font-medium text-slate-400">{t.online}: <span className="text-slate-200">{time}</span></span>
         </div>

         <div className="pointer-events-auto flex gap-3">
            <button 
              onClick={() => setMuted(!muted)}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 border border-white/5 transition-all text-slate-400 hover:text-white"
              aria-label={muted ? "Unmute" : "Mute"}
            >
              {muted ? <Icons.SoundOff /> : <Icons.SoundOn />}
            </button>
            <button 
              onClick={toggleLang}
              onMouseEnter={() => playSound('hover')}
              className="px-4 h-10 rounded-full bg-white/5 hover:bg-sky-500/20 border border-white/5 hover:border-sky-500/30 text-xs font-bold tracking-widest text-slate-300 hover:text-sky-300 transition-all uppercase"
            >
              {t.langSwitch}
            </button>
         </div>
      </nav>

      <main className={`max-w-6xl mx-auto px-4 pt-32 pb-20 relative z-10 transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        
        {/* --- HERO SECTION --- */}
        <div className="mb-16 flex flex-col md:flex-row items-center md:items-end gap-8 text-center md:text-left animate-slide-up">
           <div className="relative group cursor-none">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-sky-500 to-blue-600 rounded-full blur opacity-50 group-hover:opacity-100 transition duration-500"></div>
              <div className="w-32 h-32 md:w-40 md:h-40 relative rounded-full overflow-hidden border-4 border-[#050505] bg-zinc-800">
                <img 
                  src="https://cdn.discordapp.com/avatars/1344498850093858857/a_36aa094b1081ba2a02607b295381600e.webp?size=240&animated=true" 
                  alt="Vabix Avatar" 
                  className="w-full h-full object-cover"
                />
              </div>
           </div>

           <div className="flex-1 pb-2">
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter text-white mb-2 leading-[0.9]">
                Vabix<span className="text-sky-500">.</span>
              </h1>
              <p className="text-sky-400/80 font-mono text-sm md:text-base tracking-[0.2em] uppercase font-semibold">
                {t.sub}
              </p>
           </div>
        </div>

        {/* --- BENTO GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[minmax(180px,auto)]">
          
          {/* Socials - Large Tile */}
          <Tile icon="🌐" title={t.socialsTitle} className="lg:col-span-2 lg:row-span-1" muted={muted} onPlay={playSound} defaultOpen>
            <div className="flex gap-3 mt-2">
              <a href="https://discord.com" target="_blank" rel="noreferrer" className="flex-1 group/btn relative overflow-hidden rounded-xl bg-[#5865F2]/10 hover:bg-[#5865F2] border border-[#5865F2]/20 hover:border-[#5865F2] transition-all p-3 flex items-center gap-3">
                <div className="w-8 h-8 text-[#5865F2] group-hover/btn:text-white transition-colors">
                   <Icons.Discord />
                </div>
                <div>
                   <div className="text-[10px] uppercase font-bold text-slate-400 group-hover/btn:text-white/80">Discord</div>
                   <div className="font-bold text-white">vabiix</div>
                </div>
              </a>
              <a href="https://steamcommunity.com/profiles/76561198954882498/" target="_blank" rel="noreferrer" className="flex-1 group/btn relative overflow-hidden rounded-xl bg-[#171a21]/50 hover:bg-[#171a21] border border-white/10 hover:border-white/20 transition-all p-3 flex items-center gap-3">
                <div className="w-8 h-8 text-slate-300 group-hover/btn:text-white transition-colors">
                   <Icons.Steam />
                </div>
                <div>
                   <div className="text-[10px] uppercase font-bold text-slate-400 group-hover/btn:text-white/80">Steam</div>
                   <div className="font-bold text-sky-400 group-hover/btn:text-sky-300">{t.visitProfile}</div>
                </div>
              </a>
            </div>
          </Tile>

          {/* Status - Small Tile */}
          <Tile icon="🎮" title={t.doingTitle} className="lg:col-span-2" muted={muted} onPlay={playSound}>
             <p className="text-slate-300 leading-relaxed">{t.doingDesc}</p>
          </Tile>

          {/* Setup - Tall Tile on Desktop */}
          <Tile icon="⚡" title={t.setupTitle} className="lg:col-span-1 lg:row-span-2" muted={muted} onPlay={playSound} defaultOpen>
            <div className="space-y-4">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 border-b border-white/5 pb-1">{t.specs}</div>
              {[
                { l: "CPU", v: "Ryzen 5 5600x" },
                { l: "GPU", v: "RTX 4070 Palit" },
                { l: "RAM", v: "32GB 5200MHz" },
                { l: "SSD", v: "3TB NVMe" },
              ].map((item, i) => (
                <div key={i} className="flex justify-between items-center group/item hover:bg-white/5 p-1 rounded transition-colors">
                  <span className="text-slate-500 text-sm">{item.l}</span>
                  <span className="text-sky-100 font-mono text-xs bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">{item.v}</span>
                </div>
              ))}
              <div className="pt-4 mt-2 border-t border-white/5">
                 <div className="text-slate-500 text-xs mb-1">Peripherals</div>
                 <div className="text-white text-sm">G502 X & Redragon Gloria</div>
              </div>
            </div>
          </Tile>

          {/* School - Wide Tile */}
          <Tile icon="☁️" title={t.schoolTitle} className="lg:col-span-3" muted={muted} onPlay={playSound}>
            <div className="flex flex-col md:flex-row gap-6">
               <div className="flex-1">
                 <p className="text-sky-400 text-xs font-bold uppercase tracking-widest mb-3 border-l-2 border-sky-500 pl-3">
                   {t.schoolSummary}
                 </p>
                 <div className="whitespace-pre-wrap text-slate-300">
                   {t.schoolDesc.split('\n\n')[0]}
                 </div>
               </div>
               <div className="flex-1 bg-white/5 p-4 rounded-xl border border-white/5 text-sm text-slate-400">
                  {t.schoolDesc.split('\n\n').slice(1).join('\n\n')}
               </div>
            </div>
          </Tile>

          {/* Anime - Standard Tile */}
          <Tile icon="⛩️" title={t.animeTitle} className="lg:col-span-2" muted={muted} onPlay={playSound}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {["Vinland Saga", "Death Note", "Code Geass"].map((anime, idx) => (
                <div key={anime} className="bg-slate-900/50 border border-white/5 p-3 rounded-lg flex items-center gap-3 group/anime hover:border-sky-500/30 transition-colors">
                  <span className="text-xl font-black text-white/5 group-hover/anime:text-sky-500/20 transition-colors">0{idx + 1}</span>
                  <span className="text-sky-100 text-sm font-medium">{anime}</span>
                </div>
              ))}
            </div>
          </Tile>

          {/* Phone - Standard Tile */}
          <Tile icon="📱" title={t.pocketTitle} className="lg:col-span-2" muted={muted} onPlay={playSound}>
            <div className="flex items-start gap-4">
              <div className="w-16 h-24 bg-gradient-to-tr from-slate-800 to-slate-700 rounded-lg border border-white/10 shrink-0 flex items-center justify-center">
                 <span className="text-2xl">1+</span>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-sky-500 font-bold uppercase tracking-wider">{t.satisfied}</div>
                <div className="text-white font-medium text-lg">OnePlus 12</div>
                <div className="text-[10px] text-slate-500 pt-2 border-t border-white/5 mt-2">
                  History: Xiaomi Mi 11 Lite <span className="mx-1">•</span> iPhone 11 Pro <span className="text-red-400/50">({t.batteryRip})</span>
                </div>
              </div>
            </div>
          </Tile>

        </div>
        
        {/* Footer */}
        <footer className="mt-24 text-center border-t border-white/5 pt-8">
           <div className="inline-flex items-center gap-2 text-xs text-slate-600 uppercase tracking-widest font-semibold hover:text-sky-500 transition-colors cursor-default">
             <span>Vabix Online</span>
             <span className="w-1 h-1 rounded-full bg-current"></span>
             <span>2024</span>
           </div>
        </footer>

      </main>
    </div>
  );
};

export default App;
