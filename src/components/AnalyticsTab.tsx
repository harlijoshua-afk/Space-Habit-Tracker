/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { HabitItem, CommanderProfile } from '../types';
import { BarChart3, Activity, Award, CheckCircle2, TrendingUp, AlertCircle, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface AnalyticsProps {
  habits: HabitItem[];
  profile: CommanderProfile | null;
}

export default function AnalyticsTab({ habits, profile }: AnalyticsProps) {
  const completedTodayCount = habits.filter(h => h.completedToday).length;
  const totalCount = habits.length;
  const overallCompletionsPct = totalCount > 0 ? Math.round((completedTodayCount / totalCount) * 100) : 0;

  // Active streak calculations and coin multiplier
  const streakMultiplier = profile && profile.warpStreak >= 7 
    ? 1.5 
    : profile && profile.warpStreak >= 3 
    ? 1.2 
    : 1.0;

  // Categorized habits information
  const categories = [
    { name: 'Health', color: 'text-emerald-400', barBg: 'bg-emerald-500', desc: 'Fitness & Hydration' },
    { name: 'Mind', color: 'text-purple-400', barBg: 'bg-purple-500', desc: 'Meditation & Cortex Rest' },
    { name: 'School', color: 'text-amber-400', barBg: 'bg-amber-500', desc: 'Logs & Knowledge intake' },
    { name: 'Skills', color: 'text-cyan-400', barBg: 'bg-cyan-500', desc: 'Coding & Piloting Drills' }
  ];

  // Map weekly stats. Mon-Sat is historical data, Sun (or Today) is dynamically driven by the current state
  const weeklyData = [
    { day: 'Mon', completed: 4, total: 5, label: '80%' },
    { day: 'Tue', completed: 3, total: 5, label: '60%' },
    { day: 'Wed', completed: 5, total: 5, label: '100% MAX' },
    { day: 'Thu', completed: 2, total: 5, label: '40%' },
    { day: 'Fri', completed: 4, total: 5, label: '80%' },
    { day: 'Sat', completed: 5, total: 5, label: '100% MAX' },
    { day: 'Sun', completed: completedTodayCount, total: totalCount || 5, label: `${overallCompletionsPct}% Today`, isToday: true }
  ];

  return (
    <div className="space-y-5 flex flex-col pb-6 select-none">
      
      {/* Tab Headings */}
      <div className="bg-slate-900/40 border border-primary/10 rounded-xl p-3.5 flex items-center justify-between">
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <BarChart3 className="w-4 h-4 text-primary" />
            <span className="font-mono text-[9px] text-primary/70 tracking-widest uppercase font-black">
              TELEMETRY ARCHIVE
            </span>
          </div>
          <h1 className="font-display-lg text-2xl font-black text-on-surface uppercase tracking-tight leading-none">
            Analytics Hub
          </h1>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] font-mono text-outline">COMPLETIONS</span>
          <span className="text-lg font-mono font-black text-primary">{completedTodayCount}/{totalCount} Secure</span>
        </div>
      </div>

      {/* 1. Multiplier State Card */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 to-[#0c1524] border border-primary/25 rounded-xl p-4 shadow-[0_0_20px_rgba(34,211,238,0.15)]">
        <div className="absolute top-0 right-0 -mr-6 -mt-6 w-20 h-20 bg-primary/5 rounded-full blur-xl pointer-events-none" />
        
        <header className="flex justify-between items-center mb-3">
          <h3 className="text-[10px] font-mono text-outline uppercase tracking-wider font-bold">
            CONSECUTIVE MULTIPLIER MECHANIC
          </h3>
          <span className={`text-[9px] font-mono font-black px-2 py-0.5 rounded flex items-center gap-1 ${
            streakMultiplier > 1.0 ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30' : 'bg-slate-800 text-outline border border-slate-700/50'
          }`}>
            <Sparkles className="w-3 h-3 text-amber-400 fill-amber-400/20" /> {streakMultiplier}x BOOST
          </span>
        </header>

        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="text-xs text-on-surface-variant font-medium leading-relaxed">
              Consecutive days of SECURING starship calibrations grants an interactive coin multiplier boost:
            </span>
            <ul className="text-[10px] font-mono text-outline leading-tight space-y-1 mt-2">
              <li className="flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-primary" /> 3+ Day Streak: <span className="text-white font-bold">1.2x Gold Coin boost</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-primary" /> 7+ Day Streak: <span className="text-white font-bold">1.5x Gold Coin boost</span>
              </li>
              <li className="flex items-center gap-1.5 text-rose-400">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" /> Missing 1 day resets multiplier immediately back to 1.0x!
              </li>
            </ul>
          </div>
          
          {/* Circular Streak visualization */}
          <div className="flex flex-col items-center justify-center bg-slate-950/80 border border-outline-variant/35 rounded-xl p-3 text-center min-w-[70px] flex-shrink-0">
            <span className="text-[9px] font-mono text-outline font-bold uppercase tracking-widest leading-none">STREAK</span>
            <span className="text-2xl font-mono font-black text-amber-400 my-0.5">{profile?.warpStreak ?? 0}</span>
            <span className="text-[8px] font-mono text-slate-400 uppercase tracking-tight">CYCLES</span>
          </div>
        </div>
      </div>

      {/* 2. Historical Weekly Bar Chart */}
      <section className="bg-slate-900/50 border border-outline-variant/30 rounded-xl p-4">
        <header className="flex justify-between items-center mb-4 border-b border-outline-variant/15 pb-2">
          <div className="flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-primary" />
            <h3 className="text-xs font-mono font-bold text-on-surface uppercase tracking-wider">
              Weekly Completion History
            </h3>
          </div>
          <span className="text-[9px] font-mono text-cyan-300">CALIBRATIONS COMPLETED</span>
        </header>

        {/* Bar chart canvas */}
        <div className="flex items-end justify-between h-36 px-2 pt-4">
          {weeklyData.map((data, idx) => {
            const heightPct = data.total > 0 ? (data.completed / data.total) * 100 : 0;
            
            return (
              <div key={idx} className="flex flex-col items-center flex-grow group relative h-full justify-end">
                {/* Micro tooltip absolute positioning */}
                <div className="absolute bottom-full mb-1.5 scale-0 group-hover:scale-100 transition-all duration-150 origin-bottom bg-slate-950 border border-primary/40 rounded px-2 py-0.5 text-center text-[8px] font-mono z-20 text-white shadow-lg whitespace-nowrap">
                  <span>{data.completed}/{data.total} ({data.label})</span>
                </div>
                
                {/* Progress bar pillar */}
                <div className="w-6 bg-slate-950 border border-slate-800 rounded-t-sm h-28 flex items-end overflow-hidden">
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${heightPct}%` }}
                    transition={{ duration: 0.8, delay: idx * 0.05 }}
                    className={`w-full rounded-t-sm transition-all ${
                      data.isToday 
                        ? 'bg-gradient-to-t from-cyan-600 to-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.7)] animate-pulse'
                        : 'bg-gradient-to-t from-indigo-950 to-primary/60'
                    }`}
                  />
                </div>
                
                {/* X Axis labels */}
                <span className={`text-[10px] font-mono mt-2 font-bold ${
                  data.isToday ? 'text-primary' : 'text-outline/70'
                }`}>
                  {data.day}
                </span>
                
                {/* Mini today dot indicator */}
                {data.isToday && (
                  <div className="w-1 h-1 rounded-full bg-primary mt-1 animate-ping" />
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. Category Breakdown (Health, Mind, School, Skills) */}
      <section className="bg-slate-900/50 border border-outline-variant/30 rounded-xl p-4">
        <header className="flex items-center gap-1.5 mb-4 border-b border-outline-variant/15 pb-2">
          <Award className="w-4 h-4 text-primary" />
          <h2 className="text-xs font-mono font-bold text-on-surface uppercase tracking-wider">
            Category Breakdown Metrics
          </h2>
        </header>

        <div className="grid grid-cols-1 gap-3.5">
          {categories.map((cat, i) => {
            // Compute real statistics from available habits
            const catHabits = habits.filter(h => h.category.toLowerCase() === cat.name.toLowerCase());
            const catTotal = catHabits.length;
            const catCompleted = catHabits.filter(h => h.completedToday).length;
            const completionPct = catTotal > 0 ? Math.round((catCompleted / catTotal) * 100) : 0;
            const maxStreak = catTotal > 0 ? Math.max(...catHabits.map(h => h.streak)) : 0;

            return (
              <div 
                key={i} 
                className="bg-slate-950/60 border border-outline-variant/20 rounded-lg p-3 flex flex-col justify-between"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className={`text-xs font-mono font-black uppercase ${cat.color}`}>
                      {cat.name}
                    </h3>
                    <p className="text-[10px] text-outline mt-0.5 leading-none font-medium">
                      {cat.desc}
                    </p>
                  </div>
                  
                  {/* Status Indicator */}
                  <div className="flex items-center gap-1 text-[10px] font-mono font-bold text-slate-350">
                    {catTotal === 0 ? (
                      <span className="text-[9px] text-[#8e9aa5] bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700/50">
                        EMPTY ARRAY
                      </span>
                    ) : completionPct === 100 ? (
                      <span className="text-[9px] text-emerald-400 bg-emerald-950/20 px-1.5 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1 uppercase">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" /> SECURED
                      </span>
                    ) : (
                      <span className="text-[9px] text-amber-400 bg-amber-950/20 px-1.5 py-0.5 rounded border border-amber-500/20 flex items-center gap-1 uppercase">
                        <AlertCircle className="w-3 h-3 text-amber-400" /> {catTotal - catCompleted} PENDING
                      </span>
                    )}
                  </div>
                </div>

                {/* Progress level indicators */}
                <div className="flex items-center gap-3 font-mono text-[10px]">
                  {/* Left: Progress bar */}
                  <div className="flex-grow flex items-center gap-1.5">
                    <div className="h-2 flex-grow bg-slate-900 border border-outline-variant/15 rounded-full overflow-hidden p-[1px]">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${completionPct}%` }}
                        transition={{ duration: 0.5, delay: i * 0.1 }}
                        className={`h-full rounded-full ${cat.barBg}`}
                      />
                    </div>
                    <span className="w-8 text-right text-white font-bold leading-none">{completionPct}%</span>
                  </div>

                  {/* Right: Numeric counters */}
                  <div className="border-l border-outline-variant/20 pl-2.5 flex items-center gap-3 text-outline">
                    <div>
                      HABITS: <span className="text-white font-bold">{catTotal}</span>
                    </div>
                    <div>
                      MAX STREAK: <span className="text-amber-400 font-bold">{maxStreak}d</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
