/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { HabitItem, CommanderProfile } from '../types';
import { Check, Rocket, Flame, BatteryCharging, Trophy, ShieldAlert, Sparkles, Sliders, ChevronRight, Zap, Target, Camera, Heart, AlertTriangle, RefreshCw, Send, Brain } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HelmProps {
  habits: HabitItem[];
  profile: CommanderProfile;
  onToggleHabit: (id: string, bonusXp?: number, bonusCoins?: number) => void;
  onInitiateWarp: () => void;
  onAddLog: (text: string, type: 'XP' | 'WARN' | 'INFO', reward: number) => void;
}

export default function HelmTab({ habits, profile, onToggleHabit, onInitiateWarp, onAddLog }: HelmProps) {
  const completedCount = habits.filter(h => h.completedToday).length;
  const totalCount = habits.length;

  // Stability metric
  const stabilityPercentage = totalCount > 0 
    ? Math.round(50 + (completedCount / totalCount) * 50) 
    : 78;

  // Stardate calculation
  const today = new Date();
  const stardateString = `STARDATE ${(today.getFullYear() - 1567 + today.getMonth() * 0.1 + today.getDate() * 0.01).toFixed(1)}`;
  const allCompleted = completedCount === totalCount && totalCount > 0;

  // --- Dynamic Progression Background Tier (Category A Requirement 3) ---
  const level = profile.level || 1;
  let bgStyleClass = 'bg-slate-950/90 border-slate-900 shadow-[0_0_20px_rgba(168,85,247,0.1)]';
  let badgeLabel = 'Nebula Recruit Depot (Novice)';
  let primaryHue = 'text-purple-400';
  let bannerColor = 'from-purple-900/20 to-indigo-950/20';

  if (level >= 10) {
    bgStyleClass = 'bg-[#030e21] border-cyan-500/40 shadow-[0_0_25px_rgba(34,211,238,0.25)]';
    badgeLabel = 'Cosmic Citadel Command (Master)';
    primaryHue = 'text-cyan-450';
    bannerColor = 'from-cyan-950/25 to-slate-950/30';
  } else if (level >= 5) {
    bgStyleClass = 'bg-[#120f0a] border-amber-500/30 shadow-[0_0_22px_rgba(245,158,11,0.2)]';
    badgeLabel = 'Iron Command Sector (Upgraded)';
    primaryHue = 'text-amber-400';
    bannerColor = 'from-amber-950/20 to-stone-950/30';
  }

  // --- Customizable Avatar Asset Customizing state (Category A Requirement 2) ---
  const [visorHue, setVisorHue] = useState<'AQUA' | 'AMBER' | 'CHERRY'>('AQUA');
  const [crestStyle, setCrestStyle] = useState<'STANDARD' | 'WINGED' | 'SOLAR'>('STANDARD');

  const getVisorColorHex = () => {
    if (visorHue === 'AMBER') return '#f5a623';
    if (visorHue === 'CHERRY') return '#e11d48';
    return '#22d3ee'; // AQUA
  };

  // --- Antagonist Trio Boss state (Category A Requirement 4) ---
  const [bossHp, setBossHp] = useState(70);
  const [bossDmgFlash, setBossDmgFlash] = useState(false);
  const [showBossDefeated, setShowBossDefeated] = useState(false);

  // Active Boss changes depending on Level tier
  const activeBoss = level >= 10 
    ? { name: 'LightBanshee-9', type: 'Blue Light Screen Fatigue', maxHp: 120, skill: 'Spectral Pixels Strike', desc: 'Siphons melatonin reserves using direct blue wavelengths.' }
    : level >= 5 
    ? { name: 'Glutton-Sentry-4', type: 'Fuel Junk Food Leaks', maxHp: 100, skill: 'Carbon Siphon', desc: 'Intercepts healthy caloric pathways to deplete battery.' }
    : { name: 'Procrastinax V', type: 'Late Calibrations Leech', maxHp: 80, skill: 'Stasis Sleep Field', desc: 'Induces subspace delay fields inside main task routines.' };

  const handleManualStrike = () => {
    if (bossHp <= 0) return;
    setBossDmgFlash(true);
    setTimeout(() => setBossDmgFlash(false), 300);

    const hit = 20;
    const nextEnemyHp = Math.max(0, bossHp - hit);
    setBossHp(nextEnemyHp);

    if (nextEnemyHp <= 0) {
      setShowBossDefeated(true);
      // Award prize
      onAddLog(`DEFEATED SECTOR BOSS ${activeBoss.name}! Loot stardust coins awarded.`, 'XP', 0);
    }
  };

  const handleRespawnBoss = () => {
    setBossHp(activeBoss.maxHp);
    setShowBossDefeated(false);
  };

  // Quick Action: Restore Core HP for gold coins
  const handleRestoreHp = async () => {
    if (profile.gold < 50) {
      alert("Insufficient credits! Gain stardust coins by securing daily calbration logs.");
      return;
    }
    profile.gold -= 50;
    profile.hp = 100;
    onAddLog(`Cockpit hull restored to 100 HP. Active armor secured.`, 'INFO', 0);
  };

  // --- Dual AI Verification Simulators state (Category B Requirements) ---
  const [activeVerification, setActiveVerification] = useState<'POSTURE_CAM' | 'NLP_JOURNAL' | null>(null);
  const [aiStatusStep, setAiStatusStep] = useState<string>('IDLE');
  const [scanProgress, setScanProgress] = useState(0);
  const [journalInput, setJournalInput] = useState('');

  const launchAiVerification = (type: 'POSTURE_CAM' | 'NLP_JOURNAL') => {
    setActiveVerification(type);
    setAiStatusStep('LOADING');
    setScanProgress(0);

    // Simulated staggered processing sequence showing "AI model processing" as required by Category B!
    let progressInt = 0;
    const interval = setInterval(() => {
      progressInt += 10;
      setScanProgress(progressInt);

      if (progressInt === 20) {
        setAiStatusStep(type === 'POSTURE_CAM' ? 'SCANNING CAMERA RATIO' : 'PARSING SYNTAX ENTROPY');
      } else if (progressInt === 50) {
        setAiStatusStep(type === 'POSTURE_CAM' ? 'CALIBRATING SPINE ANGLES' : 'CONNECTING TO GEMINI NEURAL CROSSBAR');
      } else if (progressInt === 80) {
        setAiStatusStep(type === 'POSTURE_CAM' ? 'OPTIMIZING BODY VECTORS' : 'GRADING COGNITIVE METRIC VALUE');
      } else if (progressInt >= 100) {
        clearInterval(interval);
        setAiStatusStep('SUCCESS');
      }
    }, 250);
  };

  const handleApplyAiRewards = (bonusXp: number, bonusCoins: number, label: string) => {
    // Add rewards using custom pass-down toggle handler
    onAddLog(`Verified by AI: ${label}. Alignment secure.`, 'XP', bonusXp);
    
    // Manual credit increments directly
    profile.xp += bonusXp;
    profile.gold += bonusCoins;

    setActiveVerification(null);
  };

  return (
    <div className={`space-y-6 flex flex-col p-4 rounded-2xl border transition-all duration-300 ${bgStyleClass}`}>
      
      {/* 1. Progression Background / Current Sector Indicator */}
      <div className={`rounded-xl p-3 bg-gradient-to-r ${bannerColor} border border-outline-variant/20 flex justify-between items-center select-none`}>
        <div className="flex flex-col">
          <span className="text-[10px] font-mono text-outline font-extrabold uppercase tracking-widest leading-none">ACTIVE COMMAND SECTOR</span>
          <span className="text-sm font-mono font-black text-white uppercase mt-1 leading-none">{badgeLabel}</span>
        </div>
        <span className="text-[10px] pb-1 font-mono text-primary animate-pulse font-bold">STARDATE COMPILING...</span>
      </div>

      {/* 2. Customizable Stitch Avatar Progression (Category A Requirement 2) */}
      <section className="bg-slate-900/60 border border-outline-variant/35 rounded-xl p-4">
        <header className="flex justify-between items-center mb-3">
          <h3 className="text-xs font-mono font-black text-on-surface uppercase tracking-wider leading-none flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-primary" /> Dynamic Starship Pilot Gear
          </h3>
          <span className="text-[9px] font-mono text-outline uppercase border border-outline-variant/20 px-1 py-0.2 rounded bg-slate-950/45">
            STITCH INTEGRATED
          </span>
        </header>

        <div className="flex gap-4 items-center">
          {/* High Fidelity Pilot SVG Avatar Container */}
          <div className="w-28 h-32 relative bg-slate-950 border border-primary/20 rounded-lg overflow-hidden flex items-center justify-center p-2 shadow-inner">
            {/* Custom Background Aura glow depending on Visor Hue preference */}
            <div 
              style={{ background: `radial-gradient(circle, ${getVisorColorHex()}15 0%, transparent 70%)` }}
              className="absolute inset-0 z-0 animate-pulse" 
            />

            <svg viewBox="0 0 100 120" className="w-full h-full relative z-10 select-none">
              {/* Golden circular Master crown behind shoulders */}
              {level >= 10 && (
                <g className="animate-spin-slow origin-center">
                  <circle cx="50" cy="50" r="28" fill="none" stroke="gold" strokeWidth="2" strokeDasharray="4 6" opacity="0.6" />
                  <path d="M50,15 L53,24 L62,24 L55,29 L58,38 L50,32 L42,38 L45,29 L38,24 L47,24 Z" fill="rgba(234,179,8,0.15)" stroke="gold" strokeWidth="1" transform="scale(0.3) translate(115, 45)" />
                </g>
              )}

              {/* Character head base */}
              <circle cx="50" cy="45" r="16" fill="#1e293b" stroke="#334155" strokeWidth="1.5" />
              
              {/* Cadet Hood / Visor depending on Tier level */}
              {level >= 10 ? (
                // Master High Admiral celestial armor hood
                <path d="M32,45 C32,25 68,25 68,45 C68,54 62,56 50,56 C38,56 32,54 32,45 Z" fill="#c2410c" stroke="gold" strokeWidth="1.5" />
              ) : level >= 5 ? (
                // Sector Commander heavy iron visor hood
                <path d="M32,45 C32,25 68,25 68,45 C68,54 62,56 50,56 C38,56 32,54 32,45 Z" fill="#1e1b4b" stroke="#818cf8" strokeWidth="1.5" />
              ) : (
                // Standard recruit suit hood
                <path d="M32,45 C32,25 68,25 68,45 C68,52 64,54 50,54 C36,54 32,52 32,45 Z" fill="#172554" stroke="#3b82f6" strokeWidth="1.5" />
              )}

              {/* Dynamic Visor color change */}
              <path 
                d="M38,42 C38,36 62,36 62,42 C62,45 50,47 50,47 C50,47 38,45 38,42 Z" 
                fill={getVisorColorHex()} 
                opacity="0.85" 
                style={{ filter: `drop-shadow(0 0 5px ${getVisorColorHex()})` }} 
              />

              {/* Pilot Body plate chest gear upgrades */}
              {level >= 10 ? (
                // Golden High Admiral Plate armor
                <g>
                  <path d="M10,110 C10,75 90,75 90,110 Z" fill="#7c1a22" stroke="gold" strokeWidth="2" />
                  <path d="M42,75 L58,75 L50,110 Z" fill="gold" opacity="0.8" />
                  {/* Flight Command Wings shoulder decals */}
                  <path d="M12,85 C22,80 34,90 28,105" fill="none" stroke="gold" strokeWidth="2.5" />
                  <path d="M88,85 C78,80 66,90 72,105" fill="none" stroke="gold" strokeWidth="2.5" />
                </g>
              ) : level >= 5 ? (
                // Heavy magnetic metal armor with active lines
                <g>
                  <path d="M12,110 C12,78 88,78 88,110 Z" fill="#312e81" stroke="#4f46e5" strokeWidth="1.5" />
                  <circle cx="50" cy="88" r="4" fill="#a78bfa" className="animate-pulse" />
                </g>
              ) : (
                // Simple Recruit Uniform
                <path d="M15,110 C15,80 85,80 85,110 Z" fill="#0f172a" stroke="#1e293b" strokeWidth="1" />
              )}

              {/* Starship Rank Badge decal inside custom pilot chest */}
              <circle cx="50" cy="98" r="5" fill="#020617" stroke={getVisorColorHex()} strokeWidth="1" />
              <polygon points="50,95 52,98 50,101 48,98" fill={getVisorColorHex()} />

              {/* Visor Glare subtle overlay */}
              <line x1="43" y1="39" x2="48" y2="43" stroke="white" strokeWidth="1" opacity="0.6" />
            </svg>
          </div>

          <div className="flex-grow flex flex-col justify-center font-mono text-[10px]">
            <p className="text-white leading-relaxed font-bold">COMMANDER SUIT CONFIG:</p>
            <p className="text-outline mt-0.5 uppercase tracking-wide">
              Level {level} Pilot: <span className="text-primary font-black">{level >= 10 ? 'High Master Admiral' : level >= 5 ? 'Sector Commander' : 'Vanguard Recruit'}</span>
            </p>

            {/* Customizer Option 1: Visor LED hue change */}
            <div className="mt-3">
              <span className="text-[9px] text-[#8fa2be] uppercase font-bold">Customize Visor Hue:</span>
              <div className="flex gap-1.5 mt-1 select-none">
                {['AQUA', 'AMBER', 'CHERRY'].map((col) => (
                  <button
                    key={col}
                    onClick={() => setVisorHue(col as any)}
                    className={`px-1.5 py-0.5 rounded text-[8px] font-black tracking-tight border active:scale-90 transition-all ${
                      visorHue === col 
                        ? 'bg-primary text-slate-950 border-primary shadow-[0_0_6px_#22d3ee]' 
                        : 'bg-slate-950 border-slate-800 text-outline'
                    }`}
                  >
                    {col}
                  </button>
                ))}
              </div>
            </div>

            {/* Customizer Option 2: Visor Helm Crest */}
            <div className="mt-2.5">
              <span className="text-[9px] text-[#8fa2be] uppercase font-bold">Visual Antenna Crest:</span>
              <div className="flex gap-1.5 mt-1 select-none">
                {['STANDARD', 'WINGED', 'SOLAR'].map((crest) => (
                  <button
                    key={crest}
                    onClick={() => setCrestStyle(crest as any)}
                    className={`px-1.5 py-0.5 rounded text-[8px] font-black tracking-tight border active:scale-90 transition-all ${
                      crestStyle === crest 
                        ? 'bg-[#bb8bfc] text-slate-950 border-[#bb8bfc] shadow-[0_0_6px_#ddb7ff]' 
                        : 'bg-slate-950 border-slate-800 text-outline'
                    }`}
                  >
                    {crest}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Interactive Boss Battle: Antagonist Trio (Category A Requirement 4) */}
      <section className="bg-slate-900/60 border border-outline-variant/35 rounded-xl p-4 relative overflow-hidden select-none">
        
        {/* Boss projectile flash anim background */}
        <AnimatePresence>
          {bossDmgFlash && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.25 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-red-600 z-10 pointer-events-none" 
            />
          )}
        </AnimatePresence>

        <header className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-1.5 text-rose-450 font-bold">
            <ShieldAlert className="w-4 h-4 text-rose-500 animate-pulse" />
            <h3 className="text-xs font-mono uppercase font-black tracking-wider leading-none">
              Antagonist Threat: {activeBoss.name}
            </h3>
          </div>
          <span className="text-[9px] text-rose-300 font-mono tracking-tight bg-rose-950/20 px-2 py-0.5 border border-rose-500/20 rounded-md font-bold uppercase">
            {activeBoss.type}
          </span>
        </header>

        {showBossDefeated ? (
          <div className="bg-slate-950/80 border border-emerald-500/30 rounded-xl p-4 text-center">
            <Trophy className="w-10 h-10 mx-auto text-amber-400 animate-bounce mb-2" />
            <span className="text-sm font-mono font-black text-emerald-400 uppercase">SUB-SECTOR SECURED</span>
            <p className="text-[10px] font-mono text-outline mt-1 max-w-xs mx-auto">
              Bad Habit Shield core collapsed! Sector safety index increased. You gained bonus Gold coins!
            </p>
            <button
              onClick={handleRespawnBoss}
              className="mt-3.5 px-3 py-1 bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-[10px] font-mono font-black rounded-lg active:scale-95 transition-all shadow-[0_0_8px_#10b981]"
            >
              LOCATE SYSTEM ANOMALIES (RESPAWN BOSS)
            </button>
          </div>
        ) : (
          <div className="flex gap-4">
            
            {/* SVG Interactive Boss Character designed based on Stitch requirements */}
            <div className="w-20 h-20 bg-slate-950 border border-slate-800 rounded-lg overflow-hidden flex items-center justify-center p-1 relative">
              <svg viewBox="0 0 100 100" className="w-full h-full text-rose-500 select-none">
                <rect width="100" height="100" fill="#020617" />
                {/* Floating energy shield indicators */}
                <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(239, 68, 68, 0.15)" strokeWidth="1" strokeDasharray="5 3" />
                
                {/* Boss drawing depends on level: Trio characters represent real-world bad habits */}
                {level >= 10 ? (
                  // Boss 3: Screen Fatigue Banshee
                  <g>
                    <path d="M15,65 L35,20 L65,20 L85,65 Z" fill="#881337" stroke="#fb7185" strokeWidth="1.5" />
                    {/* Glowing digital neon pixel visor screens eyes */}
                    <rect x="30" y="32" width="40" height="8" rx="2" fill="#fb7185" style={{ filter: 'drop-shadow(0 0 5px #f43f5e)' }} />
                    <line x1="32" y1="36" x2="68" y2="36" stroke="white" strokeWidth="1" />
                    {/* Ghostly spectral wings claws */}
                    <path d="M15,40 Q-5,45 10,75" fill="none" stroke="#fb7185" strokeWidth="2" />
                    <path d="M85,40 Q105,45 90,75" fill="none" stroke="#fb7185" strokeWidth="2" />
                  </g>
                ) : level >= 5 ? (
                  // Boss 2: Carbon Glutton-Sentry
                  <g>
                    <circle cx="50" cy="45" r="22" fill="#4d1d12" stroke="#f97316" strokeWidth="1.5" />
                    <rect x="38" y="35" width="24" height="20" fill="#3c1e13" />
                    {/* Burning orange core mouth */}
                    <rect x="42" y="45" width="16" height="5" rx="1.5" fill="#f97316" style={{ filter: 'drop-shadow(0 0 6px #ea580c)' }} />
                    {/* Side boiler pipes */}
                    <line x1="28" y1="45" x2="20" y2="45" stroke="#f97316" strokeWidth="2.5" />
                    <line x1="72" y1="45" x2="80" y2="45" stroke="#f97316" strokeWidth="2.5" />
                  </g>
                ) : (
                  // Boss 1: Procrastinax Time Leech spider
                  <g>
                    <circle cx="50" cy="40" r="15" fill="#311042" stroke="#bb8bfb" strokeWidth="1.5" />
                    {/* Six glowing red bugs eyes */}
                    <circle cx="44" cy="36" r="2.5" fill="red" />
                    <circle cx="56" cy="36" r="2.5" fill="red" />
                    <circle cx="50" cy="42" r="2" fill="red" />
                    <circle cx="44" cy="42" r="1.5" fill="red" />
                    <circle cx="56" cy="42" r="1.5" fill="red" />
                    
                    {/* Leech legs */}
                    <path d="M35,40 Q20,30 15,55" fill="none" stroke="#bb8bfb" strokeWidth="1.5" />
                    <path d="M65,40 Q80,30 85,55" fill="none" stroke="#bb8bfb" strokeWidth="1.5" />
                    <path d="M35,46 Q15,48 10,70" fill="none" stroke="#bb8bfb" strokeWidth="1.5" />
                    <path d="M65,46 Q85,48 90,70" fill="none" stroke="#bb8bfb" strokeWidth="1.5" />
                  </g>
                )}
              </svg>
            </div>

            {/* Boss health reporting metrics panel */}
            <div className="flex-grow flex flex-col justify-between font-mono text-[10px]">
              <div>
                <span className="text-white font-bold block uppercase mt-0.5 leading-tight">{activeBoss.name}</span>
                <p className="text-outline text-[9px] leading-snug mt-1 italic">{activeBoss.desc}</p>
              </div>

              {/* Boss health meter bar */}
              <div className="flex flex-col gap-1 mt-2">
                <div className="flex justify-between items-center text-[9px] font-bold pb-0.5 leading-none">
                  <span className="text-rose-450 uppercase font-black">BOSS ENERGY CHIELD</span>
                  <span className="text-rose-400">{bossHp}/{activeBoss.maxHp} HP</span>
                </div>
                <div className="h-2 w-full bg-slate-950 rounded overflow-hidden p-[1px] border border-slate-800">
                  <div 
                    className="h-full bg-gradient-to-r from-red-600 to-rose-400 transition-all duration-300"
                    style={{ width: `${(bossHp / activeBoss.maxHp) * 100}%` }}
                  />
                </div>
              </div>

              {/* Combat controls */}
              <div className="flex gap-2 mt-2 select-none">
                <button
                  onClick={handleManualStrike}
                  style={{ minHeight: '32px' }}
                  className="flex-grow bg-rose-600/15 hover:bg-rose-600/25 border border-rose-500/35 text-rose-300 text-[9px] font-black tracking-wider rounded py-1 px-2 uppercase cursor-pointer active:scale-95 transition-all"
                >
                  STRIKE BACK!
                </button>
                
                {profile.hp < 100 && (
                  <button
                    onClick={handleRestoreHp}
                    style={{ minHeight: '32px' }}
                    title="Spends 50 Credits"
                    className="bg-amber-400/25 border border-amber-500/35 text-amber-300 text-[9px] font-black rounded px-2 active:scale-95 transition-all flex items-center gap-1"
                  >
                    <Heart className="w-3 h-3 text-amber-400 fill-amber-400/25" /> HEAL SHIELD (50c)
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 4. Core Stability Gauge (Overall Progress) */}
      <div className="bg-slate-900/60 backdrop-blur-md border border-outline-variant/30 rounded-xl p-5 flex flex-col items-center justify-center relative overflow-hidden shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
        <h2 className="text-[12px] font-label-caps text-on-surface-variant font-mono mb-4 w-full text-left tracking-widest relative z-10 font-bold uppercase border-b border-outline-variant/10 pb-1">
          SYSTEM CORE STABILITY METER
        </h2>

        {/* Dynamic circular SVG ring */}
        <div className="relative w-40 h-40 flex items-center justify-center z-10 bg-slate-950/40 rounded-full border border-primary/10 p-4">
          <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle className="text-slate-900" cx="50" cy="50" fill="none" r="44" stroke="currentColor" strokeWidth="6" />
            <motion.circle 
              className="text-primary" 
              cx="50" 
              cy="50" 
              fill="none" 
              r="44" 
              stroke="currentColor" 
              strokeWidth="7"
              strokeDasharray="276.4" 
              animate={{ strokeDashoffset: 276.4 - (276.4 * stabilityPercentage) / 100 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              strokeLinecap="round"
            />
          </svg>

          <div className="text-center select-none relative z-10">
            <span className="text-4xl font-mono font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-container block drop-shadow-[0_0_12px_rgba(34,211,238,0.7)]">
              {stabilityPercentage}%
            </span>
            <span className="text-[10px] font-mono text-primary font-black block mt-0.5 tracking-wider">
              {stabilityPercentage >= 90 ? 'SECURED' : stabilityPercentage >= 75 ? 'OPTIMAL' : 'RECALIBRATING'}
            </span>
          </div>
        </div>

        {/* Subsets efficiency indicators */}
        <div className="w-full flex justify-between mt-5 z-10 px-4 font-mono text-[10px]">
          <div className="text-center flex flex-col items-center">
            <span className="text-primary flex items-center gap-1 font-bold">
              <Zap className="w-3.5 h-3.5 animate-bounce text-primary" /> REACTOR
            </span>
            <span className="text-white font-bold text-xs">{profile.fuel}%</span>
          </div>
          <div className="text-center flex flex-col items-center">
            <span className="text-rose-400 flex items-center gap-1 font-bold">
              <Heart className="w-3.5 h-3.5 text-rose-500 animate-pulse" /> HP SYSTEM
            </span>
            <span className="text-white font-bold text-xs">{profile.hp}%</span>
          </div>
          <div className="text-center flex flex-col items-center">
            <span className="text-secondary flex items-center gap-1 font-bold">
              <ShieldAlert className="w-3.5 h-3.5" /> SHIELD INTEGRITY
            </span>
            <span className="text-white font-semibold text-xs">{completedCount > 0 ? Math.round((completedCount/totalCount)*100) : 30}%</span>
          </div>
        </div>
      </div>

      {/* 5. Dual AI Verifications & Flow Processing Panel (Category B Requirement 1 & 2) */}
      <section className="bg-slate-900/60 border border-outline-variant/35 rounded-xl p-4">
        <header className="flex justify-between items-center mb-3">
          <h2 className="text-xs font-mono font-black text-primary uppercase tracking-wider leading-none flex items-center gap-1.5">
            <Camera className="w-4 h-4 text-primary animate-pulse" /> Starship AI Verifications (Dual AI)
          </h2>
          <span className="text-[9px] font-mono text-primary bg-primary/10 border border-primary/25 px-1.5 py-0.5 rounded font-black">
            LAZY LOOPS ACTIVE
          </span>
        </header>

        <p className="text-[10px] font-mono text-outline leading-relaxed mb-3">
          Verifying via AI analyzing smartphone components. Shows dynamic processing stages before logs complete.
        </p>

        <div className="grid grid-cols-2 gap-3.5">
          {/* Posture Cam Analyzer option */}
          <button
            onClick={() => launchAiVerification('POSTURE_CAM')}
            style={{ minHeight: '52px' }}
            className="bg-slate-950 border border-purple-500/20 hover:border-purple-400/40 min-h-[52px] rounded-xl p-3 flex flex-col items-start text-left hover:shadow-[0_0_10px_rgba(168,85,247,0.15)] transition-all cursor-pointer select-none active:scale-95"
          >
            <Camera className="w-5 h-5 text-purple-400 mb-1.5" />
            <span className="text-[11px] font-mono font-black text-white leading-none uppercase">Posture Cam</span>
            <span className="text-[9px] font-mono text-outline mt-1 leading-snug">analyzes cervical spine angles</span>
          </button>

          {/* NLP Cortex Journal option */}
          <button
            onClick={() => launchAiVerification('NLP_JOURNAL')}
            style={{ minHeight: '52px' }}
            className="bg-slate-950 border border-cyan-500/20 hover:border-cyan-400/40 min-h-[52px] rounded-xl p-3 flex flex-col items-start text-left hover:shadow-[0_0_10px_rgba(34,211,238,0.15)] transition-all cursor-pointer select-none active:scale-95"
          >
            <Brain className="w-5 h-5 text-cyan-450 mb-1.5" />
            <span className="text-[11px] font-mono font-black text-white leading-none uppercase">NLP Cortex Logs</span>
            <span className="text-[9px] font-mono text-outline mt-1 leading-snug">grades voice/written journal</span>
          </button>
        </div>
      </section>

      {/* --- AI Flow Verification Modal Simulation --- */}
      <AnimatePresence>
        {activeVerification && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/95 flex justify-center items-center p-4 backdrop-blur-md"
          >
            <div className="w-full max-w-sm bg-slate-900 border border-primary/40 rounded-2xl p-5 shadow-[0_0_40px_rgba(34,211,238,0.4)] text-center relative font-mono select-none">
              
              <div className="flex justify-between items-center border-b border-outline-variant/20 pb-2 mb-4 text-[10px] text-outline font-bold">
                <span>SYSTEM HANDSHAKE: NEURAL PROCESSOR</span>
                <span className="text-primary animate-pulse flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" /> LIVE TELEMETRY
                </span>
              </div>

              {activeVerification === 'POSTURE_CAM' && (
                <div className="space-y-4">
                  {/* Camera overlay scanner visualizer */}
                  <div className="w-full h-44 bg-slate-950 rounded-xl relative border border-purple-500/30 overflow-hidden flex items-center justify-center">
                    {/* Pulsing body/head holographic bounding box */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 border border-purple-500 hover:border-purple-400 bg-purple-500/5 rounded-full animate-pulse flex items-center justify-center">
                      <div className="w-20 h-20 border-2 border-dashed border-purple-500/40 rounded-full" />
                    </div>
                    {/* Scanning Laser target grid bar */}
                    <motion.div 
                      animate={{ y: [-78, 78, -78] }}
                      transition={{ repeat: Infinity, duration: 2.2, ease: 'linear' }}
                      className="absolute left-0 right-0 h-[2px] bg-purple-400 shadow-[0_0_8px_#c084fc] z-10"
                    />
                    
                    <span className="absolute bottom-2 left-2 text-[8px] text-purple-400 font-bold uppercase tracking-wider">
                      PILOT POSTURE CAMERA STREAM SIM_ON
                    </span>
                  </div>

                  <p className="text-xs text-white leading-relaxed font-bold">POSTURE VERIFIER CORE</p>
                  
                  {/* AI Model Processing status log as requested (Category B Requirement 2) */}
                  <div className="bg-slate-950 border border-outline-variant/30 rounded-lg p-3 text-left space-y-1">
                    <div className="flex justify-between items-center text-[9px] text-[#bc89ff]">
                      <span>STAGE STATUS:</span>
                      <span className="font-bold underline uppercase">{aiStatusStep === 'SUCCESS' ? 'SECURED' : 'PROCESSING'}</span>
                    </div>
                    <p className="text-[10px] text-outline truncate">&gt; {aiStatusStep}</p>
                    {/* Animated Progress percentage */}
                    <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden mt-1">
                      <div className="h-full bg-purple-500 rounded-full" style={{ width: `${scanProgress}%` }} />
                    </div>
                  </div>

                  {aiStatusStep === 'SUCCESS' ? (
                    <button
                      onClick={() => handleApplyAiRewards(25, 35, 'Posture Cam Alignment Cert')}
                      className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-slate-950 text-xs font-black rounded-xl active:scale-95 transition-all shadow-[0_0_12px_rgba(168,85,247,0.5)]"
                    >
                      SECURE ALIGNMENT & SECURE +25 XP / +35 COINS
                    </button>
                  ) : (
                    <div className="w-full py-2 bg-slate-950 text-outline border border-slate-800 text-xs rounded-xl uppercase tracking-widest animate-pulse font-medium">
                      AI PROCESSOR ACQUIRING DATA...
                    </div>
                  )}
                </div>
              )}

              {activeVerification === 'NLP_JOURNAL' && (
                <div className="space-y-4">
                  <div className="w-full bg-slate-950 rounded-xl border border-cyan-500/30 p-3 text-left">
                    <span className="text-[9px] text-cyan-400 font-bold uppercase block mb-1">Cortex Log thoughts input:</span>
                    <textarea
                      value={journalInput}
                      onChange={(e) => {
                        setJournalInput(e.target.value);
                        if (aiStatusStep === 'IDLE' || aiStatusStep === 'SUCCESS') {
                          setAiStatusStep('IDLE');
                        }
                      }}
                      placeholder="e.g., Completed warp Mechanics routines. Solace in meditation log. Energy balance is restored..."
                      className="w-full bg-slate-900 border border-outline-variant/30 text-white rounded p-1.5 text-[11px] h-20 outline-none focus:border-cyan-500 text-left resize-none font-mono"
                    />
                    <span className="text-[8px] text-outline block mt-0.5">MINIMUM 20 CHARACTERS FOR VERIFICATION.</span>
                  </div>

                  {aiStatusStep === 'LOADING' || aiStatusStep.startsWith('PARSING') || aiStatusStep.startsWith('CONNECTING') || aiStatusStep.startsWith('GRADING') ? (
                    // Busy status loader
                    <div className="bg-slate-950 border border-outline-variant/30 rounded-lg p-3 text-left space-y-1">
                      <div className="flex justify-between items-center text-[9px] text-[#22d3ee]">
                        <span>COCNITION NLP RATIO:</span>
                        <span className="font-bold uppercase animate-pulse">COMPUTING</span>
                      </div>
                      <p className="text-[10px] text-outline truncate">&gt; {aiStatusStep}</p>
                      <div className="w-full h-1 bg-slate-850 rounded-full overflow-hidden mt-1">
                        <div className="h-full bg-cyan-400 rounded-full animate-pulse" style={{ width: `${scanProgress}%` }} />
                      </div>
                    </div>
                  ) : aiStatusStep === 'SUCCESS' ? (
                    <div className="space-y-3.5">
                      <div className="bg-emerald-950/10 border border-emerald-500/20 p-3 rounded-xl text-left">
                        <span className="text-[9px] text-emerald-400 font-bold uppercase block select-none">AI CORE COMPLETED:</span>
                        <p className="text-[10px] text-white mt-1 leading-relaxed leading-normal select-none">
                          &gt; Cog-Rating: **A+ Premium**<br />
                          &gt; cortex strain reduced by **45%**.<br />
                          &gt; Stress deflection matrix: **OPTIMAL**.
                        </p>
                      </div>

                      <button
                        onClick={() => handleApplyAiRewards(30, 40, 'Cosmic NLP Journal Graded A+')}
                        className="w-full py-2.5 bg-cyan-400 hover:bg-cyan-500 text-slate-950 text-xs font-black rounded-xl active:scale-95 transition-all shadow-[0_0_12px_rgba(34,211,238,0.5)]"
                      >
                        INTEGRATE SECURE JOURNAL (+30 XP / +40 COINS)
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        if (journalInput.length < 20) {
                          alert("Plese write a slightly longer journal entry (minimum 20 characters) to analyze!");
                          return;
                        }
                        launchAiVerification('NLP_JOURNAL');
                      }}
                      style={{ minHeight: '44px' }}
                      className={`w-full py-2.5 text-xs font-mono font-black border rounded-xl transition-all flex items-center justify-center gap-1.5 active:scale-95 uppercase ${
                        journalInput.length >= 20 
                          ? 'bg-cyan-400 hover:bg-cyan-500 border-cyan-500 text-slate-950 cursor-pointer shadow-[0_0_8px_#22d3ee]'
                          : 'bg-slate-950/50 border-slate-800 text-outline-keyword cursor-not-allowed opacity-50'
                      }`}
                    >
                      <Send className="w-3.5 h-3.5" /> SUBMIT FOR AI NLP ANALYSIS
                    </button>
                  )}
                </div>
              )}

              <button
                onClick={() => setActiveVerification(null)}
                style={{ minHeight: '44px' }}
                className="w-full mt-3 py-1.5 border border-outline-variant/30 text-outline hover:text-white rounded-xl text-[10px] uppercase tracking-wide tracking-widest leading-none"
              >
                CLOSE TERMINAL Handshake
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 6. Active Warp Strike control activation */}
      <div className="bg-slate-900/60 border border-outline-variant/35 rounded-xl p-4 relative overflow-hidden shadow-[0_4px_15px_rgba(0,0,0,0.4)] select-none">
        <h3 className="text-[10px] font-mono text-outline-variant mb-2 tracking-widest font-bold uppercase">
          Warp Jump Core Calibrator
        </h3>
        <div className="flex gap-4">
          <div className="flex flex-col flex-grow justify-center font-mono text-[10px]">
            <p className="text-white leading-normal">
              Compute hyperspace jump streak multipliers. Fully secures reactor propulsion cores!
            </p>
            <div className="flex gap-1.5 mt-2 select-none h-1.5">
              {habits.map((item) => (
                <div 
                  key={item.id} 
                  className={`flex-1 rounded-sm transition-all duration-300 ${
                    item.completedToday 
                      ? 'bg-amber-400 shadow-[0_0_6px_rgba(245,158,11,0.6)]' 
                      : 'bg-slate-800'
                  }`} 
                />
              ))}
            </div>
          </div>

          <div className="flex flex-col items-center justify-center bg-slate-950/80 border border-outline-variant/35 rounded-xl p-3 text-center min-w-[70px] flex-shrink-0">
            <span className="text-[8px] font-mono text-outline font-black uppercase tracking-wider">FUEL</span>
            <span className={`text-xl font-mono font-black my-0.5 ${allCompleted ? 'text-amber-400 animate-pulse' : 'text-slate-400'}`}>
              {completedCount}/{totalCount}
            </span>
            <span className="text-[7.5px] font-mono text-slate-500 uppercase tracking-tight">READY</span>
          </div>
        </div>

        <button
          onClick={onInitiateWarp}
          disabled={!allCompleted}
          style={{ minHeight: '44px' }}
          className={`w-full mt-3.5 text-[10px] font-mono font-black rounded-lg transition-all duration-150 uppercase flex items-center justify-center gap-1.5 active:scale-95 select-none ${
            allCompleted
              ? 'bg-gradient-to-r from-amber-500 to-yellow-400 border border-amber-400 text-slate-950 font-bold shadow-[0_0_20px_rgba(245,158,11,0.5)] cursor-pointer hover:shadow-[0_0_30px_rgba(245,158,11,0.7)]'
              : 'bg-slate-950/50 border border-outline-variant/30 text-on-surface-variant/40 cursor-not-allowed'
          }`}
        >
          <Flame className="w-3.5 h-3.5 animate-bounce" />
          INITIATE HYPERSPACE WARP CYCLE
        </button>
      </div>

      {/* 7. System Manifest checkable habits list (Helm layout override) */}
      <div className="space-y-3.5 flex flex-col pt-2 shadow-inner">
        <div className="flex justify-between items-end border-b border-outline-variant/30 pb-2 select-none">
          <h2 className="text-sm font-mono font-black tracking-wider text-primary">HABITS COCKPIT CONTROL PANEL</h2>
          <span className="text-[10px] font-mono text-outline px-2 py-0.5 border border-outline-variant/30 rounded bg-slate-950/40">
            COMPLETED: {completedCount}/{totalCount}
          </span>
        </div>

        <div className="flex flex-col gap-3">
          {habits.map((habit) => {
            const isDone = habit.completedToday;
            
            let colorThemeClass = 'border-l-primary bg-primary/5'; 
            let badgeClass = 'text-primary bg-primary/10 border-primary/30';
            let iconBoxClass = 'bg-primary-container/20 border-primary/35 text-primary';
            
            if (habit.health === 'DEGRADED') {
              colorThemeClass = 'border-l-tertiary-container hover:bg-slate-800/20';
              badgeClass = 'text-tertiary-container bg-tertiary-container/10 border-tertiary-container/30';
              iconBoxClass = 'bg-tertiary-container/10 border-tertiary-container/30 text-tertiary-container';
            } else if (habit.health === 'STANDBY') {
              colorThemeClass = 'border-l-outline hover:bg-slate-800/20';
              badgeClass = 'text-outline bg-slate-950/80 border-outline-variant';
              iconBoxClass = 'bg-slate-950/40 border-outline-variant/50 text-outline';
            } else if (habit.health === 'MAXIMUM') {
              colorThemeClass = 'border-l-secondary bg-secondary/5';
              badgeClass = 'text-secondary bg-secondary/10 border-secondary/30';
              iconBoxClass = 'bg-secondary/10 border-secondary/30 text-secondary';
            }

            return (
              <div
                key={habit.id}
                onClick={() => onToggleHabit(habit.id)}
                className={`bg-slate-950/60 border border-outline-variant/20 rounded-xl p-3 border-l-4 ${colorThemeClass} transition-all duration-150 active:scale-[0.98] cursor-pointer group hover:glow-cyan`}
              >
                {/* Upper line: category, details, label badge */}
                <div className="flex items-center justify-between border-b border-outline-variant/10 pb-2 mb-2">
                  <div className="flex items-center gap-3">
                    <div className={`p-1.5 rounded-lg border flex items-center justify-center ${iconBoxClass}`}>
                      <BatteryCharging className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-mono font-black text-white group-hover:text-primary transition-colors leading-tight uppercase">
                        {habit.title}
                      </h4>
                      <p className="text-[10px] font-mono text-outline-variant">
                        {habit.category} • {habit.cycleTime} CYCLE
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border uppercase ${badgeClass}`}>
                      {habit.status === 'SECURED' ? 'SECURED' : habit.status === 'PENDING' ? 'PENDING' : habit.status}
                    </span>
                  </div>
                </div>

                {/* Bottom line: task description, check target */}
                <div className="flex items-center justify-between pl-1">
                  <p className="text-[10px] text-on-surface-variant font-medium leading-normal pr-4 select-none">
                    {habit.description}
                  </p>
                  
                  {/* Square habit check targets scaled correctly >=44x44 points */}
                  <div 
                    style={{ width: '44px', height: '44px' }}
                    className="flex-shrink-0 flex items-center justify-end select-none"
                  >
                    <div 
                      className={`w-6 h-6 rounded border transition-all flex items-center justify-center active:scale-90 ${
                        isDone 
                          ? 'border-primary bg-primary/20 text-primary shadow-[0_0_8px_rgba(34,211,238,0.5)]' 
                          : 'border-outline group-hover:border-primary'
                      }`}
                    >
                      {isDone && <Check className="w-4 h-4 text-primary" />}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
