/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CommanderProfile } from '../types';
import { Award, ShieldAlert, Check, Cpu, Battery, Orbit, Shield, Zap, Sparkles, Scroll, Coffee, Trophy, Compass, Heart, Coins } from 'lucide-react';
import { motion } from 'motion/react';

interface RewardsProps {
  profile: CommanderProfile;
  onSpendXp: (amount: number, id: string, label: string) => Promise<boolean> | boolean;
  onSpendCoins: (amount: number, id: string, label: string) => Promise<boolean> | boolean;
}

export default function RewardsTab({ profile, onSpendXp, onSpendCoins }: RewardsProps) {
  // 1. Spendable XP Upgrades list
  const xpUpgrades = [
    {
      id: 'shield_matrix',
      title: 'Titanium Shield Matrix',
      description: 'Increases deflector defensive integrity shielding parameters.',
      costXp: 180,
      benefit: 'Deflector capacity +15%',
      icon: Shield
    },
    {
      id: 'plutonium_cells',
      title: 'Plutonium Fuel Core',
      description: 'Upgrades backup propulsion engines with sustainable star-matter power.',
      costXp: 250,
      benefit: 'Max fuel cells capacity +1',
      icon: Battery
    },
    {
      id: 'warp_coils',
      title: 'Chromosphere Warp Coils',
      description: 'Engine modifications allowing accelerated coordinates jump calculations.',
      costXp: 350,
      benefit: 'Warp calculations +25% speed',
      icon: Orbit
    },
    {
      id: 'cortex_chip',
      title: 'Cortex Coprocessor',
      description: 'A cybernetic cognitive microchip focusing on deep star chart calculations.',
      costXp: 400,
      benefit: 'Neural rest cycle XP multiplier',
      icon: Cpu
    }
  ];

  // 2. Spendable COIN Loot Items list
  const coinLootItems = [
    {
      id: 'plasma_deflector',
      title: 'Plasma Deflector Shield',
      description: 'Stitch-grade high-energy shield that blocks solar radiation storms.',
      costCoins: 100,
      icon: ShieldAlert
    },
    {
      id: 'cyber_elixir',
      title: 'Hyper-Drive Focus Elixir',
      description: 'Stitch-synthesized organic concentrate to boost reaction times by 40%.',
      costCoins: 150,
      icon: Zap
    },
    {
      id: 'stardate_scroll',
      title: 'Starlight Homework Scroll',
      description: 'An ancient parchment logging advanced subspace propulsion equations.',
      costCoins: 200,
      icon: Scroll
    },
    {
      id: 'coffee_break',
      title: 'Bridge Crew Coffee Break',
      description: 'Trigger a real-life physical rest block. Secure mental wellness.',
      costCoins: 300,
      icon: Coffee
    }
  ];

  // 3. Permanent Achievements (Trophy Room) check
  const permanentBadges = [
    {
      id: 'streak_master',
      title: '7-Day Streak Master',
      requirement: 'Reach a Warp Streak >= 7 Cycles to unlock.',
      benefit: 'Unlocks Master Badge Crest',
      unlocked: profile.warpStreak >= 7,
      icon: Trophy,
      color: 'from-amber-600 to-amber-400 text-amber-300'
    },
    {
      id: 'hydration_hero',
      title: 'Hydration Hero',
      requirement: 'Complete Hydration Array calibration protocol regularly.',
      benefit: 'Unlocks Thermal Shield Emblem',
      unlocked: profile.xp > 750 || profile.warpStreak > 0, // Hydration Hero unlocked
      icon: Heart,
      color: 'from-sky-600 to-cyan-400 text-cyan-300'
    },
    {
      id: 'cadet_crest',
      title: 'Alpha Cadet Crest',
      requirement: 'Achieve Player Level >= 2 to prove basic pilot navigation safety.',
      benefit: 'Unlocks cadet gear models',
      unlocked: profile.level >= 2 || profile.xp >= 1000,
      icon: Compass,
      color: 'from-emerald-600 to-teal-400 text-emerald-300'
    },
    {
      id: 'cosmic_citadel',
      title: 'Citadel Sovereign',
      requirement: 'Achieve Player Level >= 5 to unlock the ultimate commanding keys.',
      benefit: 'Unlocks Cosmic Citadel backdrop',
      unlocked: profile.level >= 5 || profile.xp >= 4000,
      icon: Sparkles,
      color: 'from-purple-600 to-fuchsia-400 text-purple-300'
    }
  ];

  return (
    <div className="space-y-6 flex flex-col select-none">
      
      {/* Page Headers */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-1.5">
          <Award className="w-4 h-4 text-primary animate-pulse" />
          <span className="font-mono text-[10px] text-primary/70 tracking-widest uppercase font-black">
            COMMANDER REWARD LOCKER
          </span>
        </div>
        <h1 className="font-display-lg text-2xl font-black text-on-surface uppercase tracking-tight leading-none">
          Loot & Trophy Room
        </h1>
        <p className="text-xs text-on-surface-variant font-medium mt-0.5">
          Acquire ship systems, spend gold coins on active loot, and view trophies.
        </p>
      </div>

      {/* Spendable stats header */}
      <div className="bg-slate-900/60 border border-outline-variant/30 rounded-xl p-3.5 flex justify-between items-center font-mono text-xs">
        <div className="flex flex-col gap-0.5">
          <span className="text-[9px] text-outline font-bold">SPENDABLE REWARD BALANCES:</span>
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 font-bold">
            <span className="text-primary flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> {profile.xp} XP ENERGY
            </span>
            <span className="text-amber-400 flex items-center gap-1">
              <Coins className="w-3.5 h-3.5 fill-amber-400/10" /> {profile.gold} GOLD COINS
            </span>
          </div>
        </div>
        <div className="text-right flex flex-col items-end">
          <span className="text-[9px] text-slate-400 font-bold uppercase leading-none">COMMANDER LEVEL</span>
          <span className="text-2xl font-black text-white leading-tight">LVL {profile.level}</span>
        </div>
      </div>

      {/* Category: Reward Loot Shop (COINS) */}
      <section className="bg-slate-900/40 border border-outline-variant/30 rounded-xl p-4">
        <header className="flex items-center justify-between mb-4 border-b border-outline-variant/15 pb-2.5">
          <div className="flex items-center gap-2">
            <Coins className="w-4 h-4 text-amber-400 fill-amber-400/10" />
            <h3 className="text-xs font-mono text-on-surface uppercase font-black tracking-wider leading-none">
              Reward Loot Shop (Coins)
            </h3>
          </div>
          <span className="text-[9px] font-mono text-amber-300 tracking-wide border border-amber-500/30 px-1.5 py-0.5 rounded bg-amber-500/5">
            4 LOCKS AVAILABLE
          </span>
        </header>

        <div className="grid grid-cols-2 gap-3.5">
          {coinLootItems.map((item) => {
            const Icon = item.icon;
            const isUnlocked = profile.unlockedLoot?.includes(item.id);

            return (
              <div 
                key={item.id}
                className={`bg-slate-950/70 border rounded-xl p-3 flex flex-col justify-between transition-all duration-150 h-36 relative ${
                  isUnlocked 
                    ? 'border-amber-500/30 opacity-75' 
                    : 'border-outline-variant/20 hover:border-amber-400/40'
                }`}
              >
                {/* Loot Indicator Icon */}
                <div className="flex justify-between items-start mb-1">
                  <div className={`p-1.5 rounded-lg border flex items-center justify-center ${
                    isUnlocked ? 'bg-amber-400/15 border-amber-400/40 text-amber-400' : 'bg-slate-900 border-outline-variant/35 text-slate-400'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  {isUnlocked && (
                    <span className="text-[8px] font-mono text-amber-300 font-black tracking-tight border border-amber-500/40 px-1 py-0.2 rounded bg-amber-500/10">
                      OWNED
                    </span>
                  )}
                </div>

                <div>
                  <h4 className="text-[11px] font-mono font-black text-white leading-tight truncate">
                    {item.title}
                  </h4>
                  <p className="text-[9px] font-mono text-outline leading-tight mt-0.5 line-clamp-2 h-6">
                    {item.description}
                  </p>
                </div>

                {/* Coin Touch Purchase Button >= 44x44 */}
                {!isUnlocked ? (
                  <button
                    onClick={() => onSpendCoins(item.costCoins, item.id, item.title)}
                    style={{ minHeight: '32px' }}
                    className={`w-full mt-2 text-[9px] py-1 px-2 border rounded-md font-mono font-black flex items-center justify-center gap-1 active:scale-95 transition-all ${
                      profile.gold >= item.costCoins
                        ? 'bg-amber-400 hover:bg-amber-500 border-amber-500 text-slate-950 cursor-pointer shadow-[0_0_8px_rgba(245,158,11,0.3)]'
                        : 'bg-slate-900 border-slate-800 text-outline-key cursor-not-allowed opacity-50'
                    }`}
                  >
                    <Coins className="w-3 h-3 fill-slate-950/20 text-slate-950" /> {item.costCoins} COINS
                  </button>
                ) : (
                  <div className="w-full text-center py-1 mt-2 bg-amber-500/5 border border-amber-500/10 rounded-md text-[9px] font-mono text-amber-300 font-bold">
                    INSTALLED SECURE
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Category: Spendable XP Modules */}
      <section className="bg-slate-900/40 border border-outline-variant/30 rounded-xl p-4">
        <header className="flex items-center justify-between mb-4 border-b border-outline-variant/15 pb-2.5">
          <div className="flex items-center gap-2">
            <Orbit className="w-4 h-4 text-primary" />
            <h3 className="text-xs font-mono text-on-surface uppercase font-black tracking-wider leading-none">
              Tactical Modules (XP)
            </h3>
          </div>
          <span className="text-[9px] font-mono text-primary border border-primary/25 px-1.5 py-0.5 rounded bg-primary/5">
            SPENDABLE ENERGY
          </span>
        </header>

        <div className="space-y-3.5">
          {xpUpgrades.map((upgrade) => {
            const Icon = upgrade.icon;
            const isUnlocked = profile.unlockedUpgrades?.includes(upgrade.id);

            return (
              <div 
                key={upgrade.id}
                className={`border rounded-xl p-3 flex gap-3 transition-all relative ${
                  isUnlocked 
                    ? 'bg-slate-950/40 border-primary/20 opacity-70' 
                    : 'bg-slate-900/40 border-outline-variant/10 hover:border-primary/20'
                }`}
              >
                <div className={`w-10 h-10 rounded-lg border flex items-center justify-center flex-shrink-0 ${
                  isUnlocked ? 'bg-primary/10 border-primary/30 text-primary' : 'bg-slate-950/60 border-outline-variant/30 text-outline'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>

                <div className="flex-grow min-w-0 pr-16 select-none">
                  <h4 className="text-[11px] font-mono font-black text-white leading-tight">
                    {upgrade.title}
                  </h4>
                  <p className="text-[9px] font-mono text-outline mt-0.5 leading-snug">
                    {upgrade.description}
                  </p>
                  <span className="text-[9px] font-mono text-primary font-bold block mt-0.5">
                    EFFECT: {upgrade.benefit}
                  </span>
                </div>

                {isUnlocked ? (
                  <div className="absolute top-2.5 right-2.5 text-[8px] font-mono text-primary border border-primary/30 rounded px-1.5 py-0.2 bg-primary/10 font-bold uppercase select-none">
                    INSTALLED
                  </div>
                ) : (
                  <button
                    onClick={() => onSpendXp(upgrade.costXp, upgrade.id, upgrade.title)}
                    style={{ minHeight: '44px' }}
                    className={`absolute bottom-2 right-2 px-3.5 py-1 text-[9px] font-mono font-black border rounded-lg transition-all flex items-center justify-center active:scale-90 ${
                      profile.xp >= upgrade.costXp
                        ? 'bg-primary border-primary text-slate-950 cursor-pointer shadow-[0_0_8px_#22d3ee]'
                        : 'bg-slate-950/50 border-slate-800 text-outline-variant cursor-not-allowed opacity-50'
                    }`}
                  >
                    {upgrade.costXp} XP
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Category: Permanent Trophy Room & Badges */}
      <section className="bg-slate-950/60 border border-primary/25 rounded-xl p-4 shadow-[0_4px_25px_rgba(0,0,0,0.5)]">
        <header className="flex items-center gap-2 mb-4 border-b border-outline-variant/15 pb-2.5 select-none">
          <Trophy className="w-4.5 h-4.5 text-amber-400 fill-amber-400/10 animate-pulse" />
          <h2 className="text-xs font-mono font-black text-on-surface uppercase tracking-wider leading-none">
            Lockbox Trophy Room
          </h2>
        </header>

        <p className="text-[10px] text-outline leading-tight mb-4 select-none">
          Unlike spendable gold and modules, these achievements represent **permanent credentials** verifying cockpit mastery. Remain on display.
        </p>

        <div className="grid grid-cols-2 gap-3.5 select-none text-left">
          {permanentBadges.map((badge) => {
            const Icon = badge.icon;
            
            return (
              <div 
                key={badge.id}
                className={`border rounded-xl p-3 flex flex-col justify-between h-32 relative transition-all duration-300 ${
                  badge.unlocked 
                    ? `bg-slate-900/60 shadow-[0_0_12px_rgba(34,211,238,0.1)] border-primary/30` 
                    : 'bg-slate-950 border-outline-variant/10 opacity-35 grayscale'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className={`w-8 h-8 rounded-lg border-2 flex items-center justify-center ${
                    badge.unlocked 
                      ? `bg-gradient-to-br ${badge.color} border-current/25 shadow-md` 
                      : 'bg-slate-900 border-slate-800 text-slate-500'
                  }`}>
                    <Icon className="w-4 h-4 stroke-[2.2px]" />
                  </div>

                  <span className={`text-[8px] font-mono font-black border rounded px-1 tracking-tight select-none ${
                    badge.unlocked ? 'border-primary/40 text-primary bg-primary/10' : 'border-slate-800 text-slate-500'
                  }`}>
                    {badge.unlocked ? 'UNLOCKED' : 'LOCKED'}
                  </span>
                </div>

                <div className="mt-2">
                  <h4 className="text-[10px] font-mono font-black text-white leading-tight">
                    {badge.title}
                  </h4>
                  <p className="text-[8px] font-mono text-outline leading-tight mt-0.5 min-h-[16px]">
                    {badge.unlocked ? badge.benefit : badge.requirement}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
