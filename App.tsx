import React, { useEffect, useState, useCallback, useRef } from 'react';

type Lang = 'en' | 'pl';
type SoundType = 'hover' | 'click' | 'switch';

// Silnik audio generujący dźwięki syntezowane
const createAudioEngine = () => {
  let audioCtx: AudioContext | null = null;

  const getCtx = () => {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioCtx;
  };

  return (type: SoundType) => {
    const ctx = getCtx();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'hover') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now);
      gain.gain.setValueAtTime(0.015, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc.start(now);
      osc.stop(now + 0.08);
    } else if (type === 'click') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(220, now + 0.1);
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      osc.start(now);
      osc.stop(now + 0.12);
    } else if (type === 'switch') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(900, now + 0.15);
      gain.gain.setValueAtTime(0.02, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      osc.start(now);
      osc.stop(now + 0.15);
    }
  };
};

const playSound = createAudioEngine();

interface TileProps {
  icon: string;
  title: string;
  children: React.ReactNode;
  className?: string;
  defaultOpen?: boolean;
  muted: boolean;
}

const Tile: React.FC<TileProps> = ({ icon, title, children, className = "", defaultOpen = false, muted }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const handleClick = () => {
    if (!muted) playSound('click');
    setIsOpen(!isOpen);
  };

  const handleMouseEnter = () => {
    if (!muted && !isOpen) playSound('hover');
  };

  return (
    <div 
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      className={`glass-card rounded-2xl cursor-pointer overflow-hidden relative group transition-all duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)]
        ${isOpen ? 'ring-1 ring-sky-500/30 bg-slate-900/80' : 'hover:bg-slate-800/50 hover:scale-[1.02]'}
        ${className}
      `}
    >
      <div className={`absolute inset-0 bg-gradient-to-br from-sky-500/10 to-transparent opacity-0 transition-opacity duration-500 ${!isOpen && 'group-hover:opacity-100'}`} />

      <div className="flex flex-col p-6">
        <div className={`flex items-center gap-4 transition-all duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] ${isOpen ? 'mb-4' : 'mb-0 h-24 justify-center'}`}>
          <span className={`transition-all duration-500 ${isOpen ? 'text-3xl' : 'text-5xl drop-shadow-[0_0_15px_rgba(56,189,248,0.3)]'}`}>
            {icon}
          </span>
          <h3 className={`font-bold text-white transition-all duration-500 ${isOpen ? 'text-xl' : 'text-xl tracking-wider'}`}>
            {title}
          </h3>
          <div className={`ml-auto transition-transform duration-500 ${isOpen ? 'rotate-180 text-sky-400' : 'text-slate-600'}`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        <div className={`grid transition-all duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
          <div className="overflow-hidden">
            <div className="pt-2 border-t border-white/5 text-slate-400 text-sm md:text-base leading-relaxed">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [lang, setLang] = useState<Lang>('en');
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const toggleLang = () => {
    if (!muted) playSound('switch');
    setLang(lang === 'en' ? 'pl' : 'en');
  };

  const t = {
    en: {
      sub: "Gamer • Tech Enthusiast",
      setupTitle: "Setup",
      animeTitle: "Anime",
      pocketTitle: "Pocket",
      doingTitle: "Activity",
      doingDesc: "Mostly gaming and hanging out on Discord talking to people. Not doing anything big right now, just chilling lol. And I love Hatsune Miku as you can see :P",
      schoolTitle: "My (Online) School",
      schoolSummary: "Many people ask how it's like to study online from home, so here is my answer...",
      schoolDesc: "Basically, I don't have to study that much, so I have time for whatever I want, but let's focus on how the learning actually works. I'm mostly self-taught using the internet or AI tools. To pass a subject, I take exams consisting of two parts: written and oral. The written part is a simple worksheet where you complete the tasks and get a percentage score once you finish. The oral part is more interesting because you actually talk to an examiner. There are 3 ways to do it: \n\n1. Topics, which are available on the platform as a PDF with questions to prepare for. During the exam, they pick about 3 random ones. There's also a 'lifebuoy' option you can use to swap a question lol. \n\n2. Project or Presentation, which is my go-to choice. I create a presentation on a topic from the curriculum, and the examiner grades my performance as well as my knowledge. \n\n3. Discussion, but I haven't tried this one yet, so I can't say much about it. \n\nOnce you pass, you get a grade from 1 to 6 at the end of the year. That's pretty much it! :3",
      langSwitch: "PL",
      visitProfile: "Visit profile",
      satisfied: "Very satisfied",
      batteryRip: "battery RIP",
      socialsTitle: "Socials"
    },
    pl: {
      sub: "Gracz • Pasjonat Technologii",
      setupTitle: "Setup",
      animeTitle: "Anime",
      pocketTitle: "Kieszeń",
      doingTitle: "Aktywność",
      doingDesc: "Głównie gram i siedzę na Discordzie gadając z ludźmi. Niczego wielkiego obecnie nie robię, po prostu chill mam xD. No i lubię Hatsune Miku jak widać :P",
      schoolTitle: "Szkoła w chmurze",
      schoolSummary: "Wiele osób pyta mnie, jak tam jest, więc odpowiadam tutaj...",
      schoolDesc: "Głównie to dużo nie muszę się uczyć, mam czas na co chcę, ale skupmy się na tym, jak tam się uczę. Ogółem to właściwie uczę się całkowicie sam z neta lub z pomocą AI. Aby zdać dany przedmiot, mam egzaminy, które dzielą się na dwie części: ustną oraz pisemną. Pisemny to po prostu karta z zadaniami, gdzie wypełniasz je, a po zakończeniu otrzymujesz wynik procentowy. Ustny za to jest ciekawszy, ponieważ rozmawiasz z egzaminatorem. Do wyboru są 3 formy: \n\n1. Zagadnienia, które znajdziesz na platformie w formie pliku PDF z tematami do nauki. Podczas egzaminu egzaminator losuje około 3 zagadnienia i musisz na nie odpowiedzieć. Jest też koło ratunkowe, którego możesz użyć, co pozwala na zmianę pytania (xD). \n\n2. Projekt lub prezentacja, z czego ja zazwyczaj korzystam. Robisz prezentację na temat zgodny z podstawą programową, a egzaminator ocenia twoją wypowiedź oraz wiedzę. \n\n3. Dyskusja, lecz z tej opcji nie korzystałem, więc się nie wypowiem. \n\nPo zdaniu egzaminów otrzymujesz ocenę od 1 do 6 na koniec roku. I tyle! :3",
      langSwitch: "EN",
      visitProfile: "Odwiedź profil",
      satisfied: "Bardzo zadowolony",
      batteryRip: "bateria RIP",
      socialsTitle: "Socials"
    }
  };

  const current = t[lang];

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 selection:bg-sky-500/30 overflow-x-hidden relative pb-20">
      
      {/* Język / Audio Switcher */}
      <div className="fixed top-6 right-6 z-50 flex items-center gap-3 animate-blur-in delay-3">
        <button 
          onClick={() => setMuted(!muted)}
          className={`p-2 rounded-full glass-card transition-all cursor-pointer ${muted ? 'text-slate-600' : 'text-sky-400 hover:text-sky-300'}`}
          title={muted ? "Unmute" : "Mute"}
        >
          {muted ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" /></svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>
          )}
        </button>
        <button 
          onClick={toggleLang}
          onMouseEnter={() => !muted && playSound('hover')}
          className="px-4 py-2 rounded-full glass-card text-xs font-bold tracking-widest text-sky-400 hover:text-white hover:bg-sky-500/10 transition-all cursor-pointer"
        >
          {current.langSwitch}
        </button>
      </div>

      <main className={`max-w-5xl mx-auto px-4 pt-4 md:pt-8 transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        
        {/* --- HEADER SECTION --- */}
        <div className="animate-blur-in delay-1 relative mb-12 group">
          <div className="w-full h-48 sm:h-72 rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-[#0f172a] relative z-0">
            <img 
              src="https://cdn.discordapp.com/banners/1344498850093858857/a_e14766dd49e59c318c5f77352d0b762e.webp?size=600&animated=true" 
              alt="Banner" 
              className="w-full h-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/40 to-transparent"></div>
          </div>

          <div className="flex flex-col md:flex-row items-end -mt-16 md:-mt-20 px-6 relative z-10 gap-6">
             <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-sky-600 to-blue-600 rounded-full blur opacity-75 animate-pulse"></div>
                <div className="w-32 h-32 md:w-48 md:h-48 rounded-full border-[6px] border-[#020617] overflow-hidden bg-[#0f172a] shadow-2xl shrink-0 relative z-10">
                  <img 
                    src="https://cdn.discordapp.com/avatars/1344498850093858857/a_36aa094b1081ba2a02607b295381600e.webp?size=240&animated=true" 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                </div>
             </div>
            <div className="mb-4 md:mb-8">
              <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none bg-gradient-to-r from-white via-sky-200 to-sky-500 bg-clip-text text-transparent drop-shadow-lg animate-text-shimmer">
                Vabix
              </h1>
              <p className="text-sky-400/80 font-mono text-sm md:text-base tracking-widest uppercase mt-2 font-semibold">
                {current.sub}
              </p>
            </div>
          </div>
        </div>

        {/* --- TILE GRID --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 animate-blur-in delay-2 items-start perspective-1000">
          
          <Tile icon="🌐" title={current.socialsTitle} className="sm:col-span-2" muted={muted}>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                <div className="w-10 h-10 rounded-lg overflow-hidden bg-[#5865F2] shrink-0">
                  <img src="https://repository-images.githubusercontent.com/486722660/7ef9a610-b65a-48b7-ba4a-f4da081b90ad" alt="Discord" className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 uppercase font-bold">Discord</div>
                  <div className="text-white font-mono">vabiix</div>
                </div>
              </div>
              <a href="https://steamcommunity.com/profiles/76561198954882498/" target="_blank" rel="noreferrer" className="flex items-center gap-4 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer group/link">
                <div className="w-10 h-10 rounded-lg overflow-hidden bg-[#171a21] shrink-0">
                  <img src="https://static.vecteezy.com/system/resources/previews/020/336/432/non_2x/steam-logo-steam-icon-free-free-vector.jpg" alt="Steam" className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 uppercase font-bold">Steam</div>
                  <div className="text-sky-400 group-hover/link:text-sky-300 group-hover/link:underline">{current.visitProfile}</div>
                </div>
              </a>
            </div>
          </Tile>

          <Tile icon="⚡" title={current.setupTitle} muted={muted}>
            <ul className="space-y-3 text-sm">
              <li className="flex justify-between border-b border-white/5 pb-2"><span className="text-slate-500">CPU</span> <span className="text-sky-200">Ryzen 5 5600x</span></li>
              <li className="flex justify-between border-b border-white/5 pb-2"><span className="text-slate-500">GPU</span> <span className="text-sky-200">RTX 4070 Palit</span></li>
              <li className="flex justify-between border-b border-white/5 pb-2"><span className="text-slate-500">RAM</span> <span className="text-sky-200">32GB 5200MHz</span></li>
              <li className="flex justify-between border-b border-white/5 pb-2"><span className="text-slate-500">Storage</span> <span className="text-sky-200 text-right">3TB SSD + 3TB HDD</span></li>
              <li className="pt-2 text-white/80"><span className="text-slate-500 text-xs block mb-1">Peripherals</span> G502 X & Redragon Gloria Pro</li>
            </ul>
          </Tile>

          <Tile icon="⛩️" title={current.animeTitle} muted={muted}>
            <div className="space-y-2">
              {["Vinland Saga", "Death Note", "Code Geass"].map((anime, idx) => (
                <div key={anime} className="flex items-center gap-3 p-2 rounded hover:bg-white/5 transition-colors">
                  <span className="text-xl font-black text-white/10">0{idx + 1}</span>
                  <span className="text-sky-100 font-medium">{anime}</span>
                </div>
              ))}
            </div>
          </Tile>

          <Tile icon="🎮" title={current.doingTitle} className="sm:col-span-2" muted={muted}>
             <p className="text-slate-300">{current.doingDesc}</p>
          </Tile>

          <Tile icon="☁️" title={current.schoolTitle} className="lg:col-span-3" muted={muted}>
            <p className="text-sky-400/80 text-xs font-bold uppercase tracking-widest mb-4">
              {current.schoolSummary}
            </p>
            <div className="whitespace-pre-wrap border-t border-white/5 pt-4">
              {current.schoolDesc}
            </div>
          </Tile>

          <Tile icon="📱" title={current.pocketTitle} className="lg:col-span-3" muted={muted}>
            <div className="space-y-4 max-w-md">
              <div>
                <span className="text-xs text-sky-500 font-bold uppercase tracking-wider">Daily</span>
                <div className="text-white font-medium text-lg">OnePlus 12</div>
                <p className="text-[10px] text-slate-500 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> {current.satisfied}
                </p>
              </div>
              <div className="space-y-1 border-t border-white/10 pt-4 opacity-60">
                <div className="text-sm text-slate-400">Xiaomi Mi 11 Lite 5G NE</div>
                <div className="text-sm text-slate-500 line-through decoration-red-500/50">
                  iPhone 11 Pro <span className="no-underline text-xs text-red-400 ml-1">({current.batteryRip})</span>
                </div>
              </div>
            </div>
          </Tile>

        </div>
        
        {/* Footer */}
        <div className="mt-20 text-center pb-8 opacity-20 hover:opacity-100 transition-opacity duration-500">
           <div className="w-1 h-12 bg-gradient-to-b from-sky-500 to-transparent mx-auto mb-4"></div>
           <p className="text-xs text-slate-500 uppercase tracking-[0.3em]">Vabix Online © 2024</p>
        </div>

      </main>

      {/* Tło - Ambient Lights */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-sky-600/10 blur-[100px] rounded-full animate-float-slow"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-800/10 blur-[120px] rounded-full animate-float-medium"></div>
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }}></div>
      </div>
    </div>
  );
};

export default App;
