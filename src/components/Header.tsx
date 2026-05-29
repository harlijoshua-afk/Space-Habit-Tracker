/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CommanderProfile } from '../types';
import { Coins, Heart, Star, LogOut } from 'lucide-react';

interface HeaderProps {
  profile: CommanderProfile | null;
  onLogout: () => void;
  isMockUser: boolean;
}

export default function Header({ profile, onLogout, isMockUser }: HeaderProps) {
  const hp = profile?.hp ?? 100;
  const level = profile?.level ?? 1;
  const gold = profile?.gold ?? 150;
  const xp = profile?.xp ?? 750;
  
  // Calculate horizontal XP progress bar percentage
  const xpPercent = Math.min(100, Math.max(0, (xp % 1000) / 10));

  // HP Bar color based on health level
  const hpBarColor = hp > 60 
    ? 'bg-gradient-to-r from-emerald-500 to-teal-400 shadow-[0_0_8px_rgba(16,185,129,0.5)]' 
    : hp > 30 
    ? 'bg-gradient-to-r from-amber-500 to-orange-400 shadow-[0_0_8px_rgba(245,158,11,0.5)]' 
    : 'bg-gradient-to-r from-rose-600 to-red-500 shadow-[0_0_12px_rgba(225,29,72,0.8)]';

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-xl border-b border-primary/25 shadow-[0_4px_30px_rgba(0,0,0,0.8)]">
      <div className="max-w-md mx-auto w-full px-4 pt-3 pb-3 flex flex-col gap-2.5">
        
        {/* Top bar layer */}
        <div className="flex justify-between items-center">
          {/* Left info: avatar and rank title */}
          <div className="flex items-center gap-3">
            <button 
              id="profile-avatar-btn"
              onClick={onLogout}
              style={{ width: '44px', height: '44px' }}
              title={`${profile ? profile.displayName : 'Commander'} - Tap to Log Out`}
              className="w-11 h-11 rounded-full border border-primary/40 overflow-hidden shadow-[0_0_12px_rgba(34,211,238,0.4)] transition-all active:scale-95 duration-100 flex-shrink-0 relative bg-slate-900 group"
            >
              {profile?.photoURL ? (
                <img 
                  src={profile.photoURL} 
                  alt="Commander Profile" 
                  className="w-full h-full object-cover group-hover:opacity-75 transition-opacity"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-primary font-bold text-lg font-mono">
                  C
                </div>
              )}
              <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 flex items-center justify-center text-[10px] text-primary select-none font-bold font-mono transition-opacity">
                <LogOut className="w-3.5 h-3.5" />
              </div>
            </button>
  
            <div className="flex flex-col justify-center min-w-0">
              <h1 className="text-sm font-display-lg font-black tracking-wider text-primary drop-shadow-[0_0_8px_rgba(34,211,238,0.5)] leading-tight uppercase select-none">
                {profile?.displayName ? profile.displayName.split(' ')[0] : 'COMMANDER'}
              </h1>
              <span className="text-[10px] font-mono text-outline leading-tight truncate uppercase">
                {profile ? `${profile.rank}` : 'UNINITIALIZED'}
              </span>
            </div>
          </div>

          {/* Right actions/indicators */}
          <div className="flex items-center gap-2">
            {isMockUser && (
              <span className="text-[9px] font-mono border border-amber-500/30 px-1.5 py-0.5 rounded text-amber-400 bg-amber-500/10 uppercase font-bold select-none">
                LOCAL SIM
              </span>
            )}
            <span className="text-[10px] font-label-caps text-primary border border-primary/30 px-2 py-0.5 rounded bg-primary/5 flex items-center gap-1 font-mono font-black select-none">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
              ACTIVE COCKPIT
            </span>
          </div>
        </div>

        {/* HUD Stats Multi-meter checklist bar */}
        <div className="grid grid-cols-2 gap-3 bg-slate-900/50 border border-outline-variant/20 rounded-lg p-2 font-mono text-[10px] select-none">
          {/* Left Column: HP bar & Gold Coins */}
          <div className="flex flex-col gap-1.5 justify-center">
            {/* HP Bar */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center text-[9px]">
                <span className="text-rose-400 flex items-center gap-1 font-black">
                  <Heart className="w-3 h-3 fill-rose-400/20 text-rose-400" /> HP INTEGRITY
                </span>
                <span className="text-rose-400 font-bold">{hp}/100</span>
              </div>
              <div className="h-2 w-full bg-slate-950 rounded overflow-hidden p-[1px] border border-slate-800">
                <div 
                  className={`h-full rounded-sm transition-all duration-300 ${hpBarColor}`}
                  style={{ width: `${hp}%` }}
                />
              </div>
            </div>
          </div>

          {/* Right Column: Level & XP Bar */}
          <div className="flex flex-col gap-1.5 justify-center border-l border-outline-variant/20 pl-3">
            {/* Level & XP */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center text-[9px]">
                <span className="text-cyan-400 flex items-center gap-1 font-black leading-none">
                  <Star className="w-3 h-3 fill-cyan-400/25 text-cyan-400" /> LVL {level}
                </span>
                <span className="text-cyan-300 font-bold">{xp % 1000}/1000 XP</span>
              </div>
              <div className="h-2 w-full bg-slate-950 rounded overflow-hidden p-[1px] border border-slate-850">
                <div 
                  className="h-full bg-gradient-to-r from-cyan-500 to-sky-400 rounded-sm transition-all duration-300 shadow-[0_0_8px_rgba(34,211,238,0.5)]"
                  style={{ width: `${xpPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Coins & Fuel inline line */}
        <div className="flex justify-between items-center font-mono text-[10px] px-1 select-none border-t border-outline-variant/10 pt-1">
          <span className="flex items-center gap-1.5 text-amber-450 font-bold">
            <Coins className="w-3.5 h-3.5 fill-amber-400/10 text-amber-450" /> 
            CREDITS: <span className="text-white font-black text-xs">{gold} GOLD COINS</span>
          </span>
          <span className="text-primary-container text-[9px] font-bold">
            WARP DRIVE PROPULSION: {profile?.fuel ?? 98}% FUEL
          </span>
        </div>
      </div>
    </header>
  );
}
