/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent } from 'react';
import { HabitItem, ConsoleLog } from '../types';
import { PlusCircle, Terminal, X, Zap, Cpu, Hammer } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HangarProps {
  habits: HabitItem[];
  logs: ConsoleLog[];
  onAddHabit: (habit: HabitItem) => void;
  onCalibrateSystem: (id: string) => void;
}

export default function HangarTab({ habits, logs, onAddHabit, onCalibrateSystem }: HangarProps) {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Manual');
  const [cycleTime, setCycleTime] = useState('12:00');
  const [description, setDescription] = useState('');
  const [xpReward, setXpReward] = useState(10);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!title) return;

    const newHabit: HabitItem = {
      id: `custom_${Date.now()}`,
      title,
      category,
      cycleTime,
      status: 'PENDING',
      streak: 0,
      maxStreak: 10,
      health: 'STANDBY',
      description: description || `Diagnostic scan configuration for ${title}.`,
      progress: 0,
      xpReward,
      completedToday: false
    };

    onAddHabit(newHabit);
    setIsOpenModal(false);
    
    // Reset forms
    setTitle('');
    setDescription('');
    setCategory('Manual');
    setCycleTime('12:00');
    setXpReward(10);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header with Initiate New System button */}
      <div className="relative border-b border-outline-variant/30 pb-4">
        <h2 className="text-3xl font-display-lg text-primary-fixed drop-shadow-[0_0_15px_rgba(162,238,255,0.4)] font-black select-none">
          Ship Systems Hangar
        </h2>
        <p className="text-[11px] font-mono text-on-surface-variant font-medium mt-1 uppercase tracking-widest leading-normal">
          MAINTENANCE PROTOCOLS ENGAGED. MONITORING CORE ROUTINES.
        </p>

        <button
          onClick={() => setIsOpenModal(true)}
          style={{ minHeight: '44px' }}
          className="mt-4 bg-primary text-on-primary text-[11px] font-label-caps font-black px-4 py-2 rounded-lg border border-primary hover:bg-primary-fixed transition-all duration-300 shadow-[0_0_15px_rgba(34,211,238,0.4)] hover:shadow-[0_0_25px_rgba(34,211,238,0.7)] flex items-center gap-1.5 active:scale-95"
        >
          <PlusCircle className="w-4 h-4" />
          INITIATE NEW SYSTEM
        </button>
      </div>

      {/* 2. Systems Grid containing fuel cells matching visual mockups */}
      <div className="grid grid-cols-1 gap-4 select-none">
        {habits.map((item) => {
          let cardBorderClass = 'border-outline-variant/30';
          let healthText = 'STANDBY';
          let textThemeColor = 'text-on-surface-variant';
          let barFillColor = 'bg-slate-800';
          let ledColor = 'bg-outline-variant';

          // Set levels matching visual mockups
          if (item.health === 'OPTIMAL') {
            cardBorderClass = 'border-primary/45';
            healthText = 'OPTIMAL';
            textThemeColor = 'text-primary';
            barFillColor = 'bg-primary shadow-[0_0_8px_rgba(34,211,238,0.8)]';
            ledColor = 'bg-primary shadow-[0_0_8px_#22d3ee]';
          } else if (item.health === 'DEGRADED') {
            cardBorderClass = 'border-tertiary-container/45';
            healthText = 'DEGRADED';
            textThemeColor = 'text-tertiary-container';
            barFillColor = 'bg-tertiary-container shadow-[0_0_8px_rgba(255,175,117,0.8)]';
            ledColor = 'bg-tertiary-container shadow-[0_0_8px_#ffaf75]';
          } else if (item.health === 'MAXIMUM') {
            cardBorderClass = 'border-secondary-container/50';
            healthText = 'MAXIMUM';
            textThemeColor = 'text-secondary-fixed';
            barFillColor = 'bg-secondary shadow-[0_0_8px_rgba(111,0,190,0.8)]';
            ledColor = 'bg-secondary shadow-[0_0_8px_#6f00be]';
          }

          // Generate fuel bars representation (5 segments total per mockup design)
          const targetFilledCount = item.progress / 20;

          return (
            <div 
              key={item.id}
              className={`bg-slate-900/60 backdrop-blur-md border rounded-xl p-4 flex flex-col relative overflow-hidden shadow-[0_4px_15px_rgba(0,0,0,0.4)] ${cardBorderClass}`}
            >
              {/* LED Blinking Node matching Screenshot Pulse */}
              <div className={`absolute top-3 right-3 w-2.5 h-2.5 rounded-full ${ledColor} animate-pulse`} />

              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded bg-primary/15 flex items-center justify-center border border-primary/30 glow-cyan">
                    <Cpu className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xs font-display-lg font-bold text-on-surface uppercase tracking-wider">
                      {item.title}
                    </h3>
                    <p className="text-[10px] font-mono text-outline leading-none">
                      CATEGORY: {item.category} • STREAK: {item.streak} CYCLES
                    </p>
                  </div>
                </div>
              </div>

              {/* Progress Cell / Fuel indicator bars */}
              <div className="flex-grow flex flex-col justify-end gap-2 mt-4">
                <div className="flex justify-between items-center text-[10px] font-mono text-on-surface-variant">
                  <span>SYSTEM INTEGRITY</span>
                  <span className={`${textThemeColor} font-bold`}>{healthText} ({item.progress}%)</span>
                </div>

                {/* Fuel Cell Segment Block progress bar */}
                <div className="h-2.5 w-full bg-slate-950 rounded-full overflow-hidden flex gap-0.5 border border-outline-variant/30 p-[1px]">
                  {[1, 2, 3, 4, 5].map((segIdx) => {
                    const isSegmentFilled = segIdx <= targetFilledCount;
                    return (
                      <div 
                        key={segIdx}
                        className={`h-full flex-1 rounded-sm transition-all duration-300 ${
                          isSegmentFilled ? barFillColor : 'bg-slate-900'
                        }`}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Tap to Calibrate/Validate action */}
              <div className="mt-4 pt-2.5 border-t border-outline-variant/10 flex justify-between items-center">
                <span className="text-[10px] font-mono text-outline-variant uppercase">
                  ACTIVE AT: {item.cycleTime}
                </span>

                <button
                  onClick={() => onCalibrateSystem(item.id)}
                  style={{ minHeight: '32px' }}
                  className={`px-3 py-1 rounded text-[10px] font-label-caps font-black border transition-all flex items-center gap-1 active:scale-95 ${
                    item.completedToday
                      ? 'bg-slate-950/40 border-primary/40 text-primary cursor-default'
                      : 'bg-primary/10 border-primary text-primary hover:bg-primary hover:text-slate-950 cursor-pointer shadow-[0_0_8px_rgba(34,211,238,0.25)]'
                  }`}
                >
                  <Hammer className="w-3 h-3" />
                  {item.completedToday ? 'OPTIMIZED' : 'CALIBRATE'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Recent Logs scrolling telemetry list readout */}
      <div className="border border-outline-variant/30 rounded-xl bg-slate-950/45 p-4 shadow-lg select-none">
        <h3 className="text-[11px] font-label-caps text-primary border-b border-outline-variant/30 pb-2 mb-2 flex items-center gap-2 font-mono font-black">
          <Terminal className="w-4 h-4 text-primary" />
          RECENT SYSTEM LOGS
        </h3>

        <div className="flex flex-col gap-1.5 font-mono text-xs max-h-48 overflow-y-auto">
          {logs.map((log) => {
            const isWarn = log.type === 'WARN';
            return (
              <div 
                key={log.id} 
                className="flex justify-between items-center border-b border-outline-variant/5 py-1 text-on-surface-variant hover:text-white transition-colors"
              >
                <span className="w-18 text-outline text-[11px] font-bold">&gt; [{log.time}]</span>
                <span className="flex-grow truncate text-[11px]">{log.text}</span>
                <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${
                  isWarn 
                    ? 'text-amber-400 bg-amber-400/10' 
                    : 'text-primary bg-primary/10'
                }`}>
                  {log.badge}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Visual custom habit builder creation dialog popup */}
      <AnimatePresence>
        {isOpenModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
              onClick={() => setIsOpenModal(false)}
            />
            
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-primary/40 rounded-xl p-5 w-full max-w-sm relative z-10 shadow-[0_0_30px_rgba(34,211,238,0.4)]"
            >
              <button 
                style={{ minWidth: '40px', minHeight: '40px' }}
                className="absolute top-2 right-2 text-outline hover:text-white flex items-center justify-center rounded-full"
                onClick={() => setIsOpenModal(false)}
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-lg font-display-lg font-bold text-primary border-b border-outline-variant/20 pb-2 mb-4 uppercase tracking-wider">
                Initiate New System
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-[10px] font-label-caps text-outline mb-1 uppercase font-mono tracking-wider">
                    SYSTEM TITLE
                  </label>
                  <input 
                    type="text" 
                    value={title} 
                    onChange={e => setTitle(e.target.value)} 
                    placeholder="e.g. Shield Deflectors"
                    className="w-full bg-slate-950 border border-outline-variant/40 rounded-lg py-2 px-3 text-sm text-white focus:outline-none focus:border-primary transition-all font-mono"
                    required
                  />
                </div>

                {/* Grid category and cycle hour */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-label-caps text-outline mb-1 uppercase font-mono tracking-wider">
                      MODULE COGNITION
                    </label>
                    <select
                      value={category}
                      onChange={e => setCategory(e.target.value)}
                      className="w-full bg-slate-950 border border-outline-variant/40 rounded-lg py-2 select-none px-2 text-xs text-white focus:outline-none focus:border-primary transition-all font-mono"
                    >
                      <option value="Physical">Physical</option>
                      <option value="Mental">Mental</option>
                      <option value="Work">Work</option>
                      <option value="Skills">Skills</option>
                      <option value="Tactical">Tactical</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-label-caps text-outline mb-1 uppercase font-mono tracking-wider">
                      CYCLE HOUR
                    </label>
                    <input 
                      type="text" 
                      value={cycleTime} 
                      onChange={e => setCycleTime(e.target.value)} 
                      placeholder="e.g. 08:00"
                      className="w-full bg-slate-950 border border-outline-variant/40 rounded-lg py-1.5 px-3 text-xs text-white focus:outline-none focus:border-primary transition-all font-mono text-center"
                      required
                    />
                  </div>
                </div>

                {/* Description info */}
                <div>
                  <label className="block text-[10px] font-label-caps text-outline mb-1 uppercase font-mono tracking-wider">
                    COMMAND OBJECTIVE DESCRIPTION
                  </label>
                  <textarea 
                    value={description} 
                    onChange={e => setDescription(e.target.value)} 
                    placeholder="Specify action rules..."
                    rows={2}
                    className="w-full bg-slate-950 border border-outline-variant/40 rounded-lg py-2 px-3 text-xs text-white focus:outline-none focus:border-primary transition-all font-mono"
                  />
                </div>

                {/* XP Reward selection */}
                <div>
                  <label className="block text-[10px] font-label-caps text-outline mb-1 uppercase font-mono tracking-wider">
                    XP ENERGY REWARD: {xpReward} XP
                  </label>
                  <input
                    type="range"
                    min="5"
                    max="30"
                    step="5"
                    value={xpReward}
                    onChange={e => setXpReward(Number(e.target.value))}
                    className="w-full accent-primary bg-slate-950 rounded-lg h-2 cursor-pointer"
                  />
                </div>

                {/* Actions button */}
                <button
                  type="submit"
                  style={{ minHeight: '44px' }}
                  className="w-full bg-primary text-slate-950 text-[11px] font-label-caps font-black py-2 rounded-lg cursor-pointer transition-all uppercase shadow-[0_0_15px_rgba(34,211,238,0.3)] hover:shadow-[0_0_25px_rgba(34,211,238,0.6)] hover:bg-primary-container font-mono active:scale-95 flex items-center justify-center gap-1.5"
                >
                  <Zap className="w-4 h-4 fill-slate-950" />
                  INITIALIZE COGNITIVE BLOCK
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
