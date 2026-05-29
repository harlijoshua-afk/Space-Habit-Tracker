/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { 
  subscribeToAuth, 
  loginWithGoogle, 
  logoutUser, 
  fetchCommanderProfile, 
  saveCommanderProfile, 
  fetchHabits, 
  saveHabit, 
  fetchConsoleEvents, 
  addConsoleEvent, 
  isMockFirebase,
  AuthUserState
} from './utils/firebase';
import { CommanderProfile, HabitItem, ConsoleLog, TabType, ToastMessage } from './types';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import HelmTab from './components/HelmTab';
import HangarTab from './components/HangarTab';
import AnalyticsTab from './components/AnalyticsTab';
import RewardsTab from './components/RewardsTab';
import Toast from './components/Toast';
import { LogIn, Rocket, ShieldAlert, Cpu, Terminal } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [user, setUser] = useState<AuthUserState | null>(null);
  const [profile, setProfile] = useState<CommanderProfile | null>(null);
  const [habits, setHabits] = useState<HabitItem[]>([]);
  const [logs, setLogs] = useState<ConsoleLog[]>([]);
  const [currentTab, setCurrentTab] = useState<TabType>('HELM');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [hyperspaceWarping, setHyperspaceWarping] = useState(false);
  const [customCallsign, setCustomCallsign] = useState('Commander Joshua');

  // 1. Subscribe to Authentication changes on mount
  useEffect(() => {
    const unsubscribe = subscribeToAuth(async (authUser) => {
      setUser(authUser);
      if (authUser) {
        setLoading(true);
        try {
          // Fetch Profile or write default
          const pData = await fetchCommanderProfile(authUser.uid, authUser.displayName, authUser.photoURL);
          setProfile(pData);
          
          // Fetch Habits
          const hData = await fetchHabits(authUser.uid);
          setHabits(hData);

          // Fetch Event Logs
          const lData = await fetchConsoleEvents(authUser.uid);
          setLogs(lData);
        } catch (e) {
          console.error("Failed to load user statistics from backend database:", e);
        } finally {
          setLoading(false);
        }
      } else {
        setProfile(null);
        setHabits([]);
        setLogs([]);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Show floating alert notifications
  const triggerToast = (text: string, type: 'success' | 'warning' | 'info' = 'success') => {
    const id = `toast_${Date.now()}`;
    setToasts(prev => [...prev, { id, text, type }]);
    
    // Auto-dismiss after 3.2 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3200);
  };

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // 2. Cockpit Setup Login operation control
  const handleLogin = async (callsign?: string) => {
    try {
      const authUser = await loginWithGoogle(callsign || customCallsign);
      triggerToast(`Commander ${authUser.displayName} connected. Biometrics match!`, 'success');
    } catch (err) {
      triggerToast('Biometrics handshake failed: Credentials rejected', 'warning');
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      setUser(null);
      setProfile(null);
      triggerToast('Commander logged out. Terminating link secure.', 'info');
    } catch (err) {
      triggerToast('Handshake override failed.', 'warning');
    }
  };

  // Add a console telemetry log
  const handleAddLog = async (text: string, type: 'XP' | 'WARN' | 'INFO', reward: number) => {
    if (!user) return;
    
    const now = new Date();
    const minPadding = now.getMinutes() < 10 ? `0${now.getMinutes()}` : now.getMinutes();
    const timeLabel = `${now.getHours()}:${minPadding}`;
    
    const badgeLabel = type === 'XP' 
      ? `+${reward} XP` 
      : type === 'WARN' 
      ? 'WARN' 
      : 'INFO';

    const newLog: ConsoleLog = {
      id: `log_${Date.now()}`,
      time: timeLabel,
      text,
      badge: badgeLabel,
      type,
      createdAt: now.toISOString()
    };

    setLogs(prev => [newLog, ...prev]);
    await addConsoleEvent(user.uid, newLog);
  };

  // 3. Increment stats & complete systems habit
  const handleToggleHabit = async (id: string, customBonusXp = 0, customBonusCoins = 0) => {
    if (!user || !profile) return;

    const updatedHabits = habits.map(async (habit) => {
      if (habit.id === id) {
        const nextCompleted = !habit.completedToday;
        const xpReward = habit.xpReward + customBonusXp;
        
        // Calculate dynamic stardust gold coin reward based on consecutive streak multiplier (Category A/C)
        const streakMultiplier = profile.warpStreak >= 7 ? 1.5 : profile.warpStreak >= 3 ? 1.2 : 1.0;
        const goldReward = Math.round((15 + customBonusCoins) * streakMultiplier);

        let nextStreak = habit.streak;
        let nextStatus = habit.status;
        let nextHealth = habit.health;
        let nextProgress = habit.progress;

        if (nextCompleted) {
          nextStreak += 1;
          nextStatus = 'SECURED';
          nextHealth = nextStreak > 20 ? 'MAXIMUM' : 'OPTIMAL';
          nextProgress = 100; // Complete
          
          const finalXp = profile.xp + xpReward;
          const finalGold = profile.gold + goldReward;
          const finalHp = Math.min(100, profile.hp + 5); // Completed task heals ship cockpit systems

          // Automatic Level-up calculation base (every 1000 XP)
          const nextLevel = Math.floor(finalXp / 1000) + 1;
          const hasLeveledUp = nextLevel > profile.level;

          triggerToast(`Calibrated ${habit.title}: +${xpReward} XP & +${goldReward} Coins!`, 'success');
          handleAddLog(`${habit.title} calibration secure. All systems optimal.`, 'XP', xpReward);

          const updatedProfile = {
            ...profile,
            xp: finalXp,
            level: nextLevel,
            gold: finalGold,
            hp: finalHp,
            fuel: Math.min(100, profile.fuel + 1) // Completed task gives small fuel core restoration
          };
          
          if (hasLeveledUp) {
            triggerToast(`PROMOTED: Commander is now Level ${nextLevel}! Avatar gear upgraded.`, 'success');
            handleAddLog(`Commander promoted to Level ${nextLevel}. Class unlocked.`, 'INFO', 0);
          }

          // Re-evaluate rank thresholds based on stardust levels
          if (updatedProfile.xp >= 2000 && profile.xp < 2000) {
            updatedProfile.rank = 'Elite Commodore';
            triggerToast('COMMENDATION LEVEL: Promoted to Elite Commodore!', 'success');
          } else if (updatedProfile.xp >= 4000 && profile.xp < 4000) {
            updatedProfile.rank = 'High Fleet Admiral';
            triggerToast('COMMENDATION LEVEL: Promoted to High Fleet Admiral!', 'success');
          }

          setProfile(updatedProfile);
          await saveCommanderProfile(user.uid, updatedProfile);
        } else {
          nextStreak = Math.max(0, nextStreak - 1);
          nextStatus = 'PENDING';
          nextHealth = 'STANDBY';
          nextProgress = 0;

          // Missing/unchecking unsecures calibrations, triggers Boss attack and drops streak multiplier (Category A/C/D)
          const nextHp = Math.max(10, profile.hp - 15); // Decreases health by 15. Minimal clamp at 10.

          triggerToast(`WARNING: Sector Boss attacked cockpit shield! Core lost -15 HP. Multiplier drop!`, 'warning');
          handleAddLog(`${habit.title} system calibrations offline. Integrity threat detected!`, 'WARN', 0);

          const updatedProfile = {
            ...profile,
            xp: Math.max(0, profile.xp - xpReward),
            gold: Math.max(0, profile.gold - goldReward),
            hp: nextHp,
            warpStreak: 0, // Instantly drop streak multiplier back to 1.0x as required by checklist
            fuel: Math.max(50, profile.fuel - 1)
          };
          setProfile(updatedProfile);
          await saveCommanderProfile(user.uid, updatedProfile);
        }

        const nextHabit: HabitItem = {
          ...habit,
          completedToday: nextCompleted,
          streak: nextStreak,
          status: nextStatus,
          health: nextHealth,
          progress: nextProgress
        };

        // Persist to cloud/local
        await saveHabit(user.uid, nextHabit);
        return nextHabit;
      }
      return habit;
    });

    // Resolve habits array
    Promise.all(updatedHabits).then(res => setHabits(res));
  };

  // Add custom newly initiated systems habits
  const handleAddHabit = async (newHabit: HabitItem) => {
    if (!user) return;
    setHabits(prev => [...prev, newHabit]);
    await saveHabit(user.uid, newHabit);
    triggerToast(`System initiated: ${newHabit.title} online!`, 'success');
    handleAddLog(`${newHabit.title} telemetry sync established on Tab ${newHabit.cycleTime}.`, 'INFO', 0);
  };

  // Calibrate System manual trigger for Hangar screen
  const handleCalibrateSystem = (id: string) => {
    handleToggleHabit(id);
  };

  // Spend accrued experience points in REWARDS store
  const handleSpendXp = async (amount: number, id: string, rewardLabel: string): Promise<boolean> => {
    if (!user || !profile) return false;

    if (profile.xp < amount) {
      triggerToast('Insufficient stardust energy XP levels.', 'warning');
      return false;
    }

    const unlockedUpgrades = profile.unlockedUpgrades || [];
    if (unlockedUpgrades.includes(id)) return true;

    const updatedProfile: CommanderProfile = {
      ...profile,
      xp: profile.xp - amount,
      unlockedUpgrades: [...unlockedUpgrades, id]
    };

    setProfile(updatedProfile);
    await saveCommanderProfile(user.uid, updatedProfile);
    
    triggerToast(`${rewardLabel} installed. Shield/propulsion indices upgraded!`, 'success');
    handleAddLog(`${rewardLabel} offline subsystem integrated successfully.`, 'INFO', 0);
    return true;
  };

  // Spend accrued gold coins in REWARDS Loot Shop
  const handleSpendCoins = async (amount: number, id: string, rewardLabel: string): Promise<boolean> => {
    if (!user || !profile) return false;

    if (profile.gold < amount) {
      triggerToast('Insufficient stardust gold coins.', 'warning');
      return false;
    }

    const unlockedLoot = profile.unlockedLoot || [];
    if (unlockedLoot.includes(id)) return true;

    const updatedProfile: CommanderProfile = {
      ...profile,
      gold: profile.gold - amount,
      unlockedLoot: [...unlockedLoot, id]
    };

    setProfile(updatedProfile);
    await saveCommanderProfile(user.uid, updatedProfile);
    
    triggerToast(`${rewardLabel} purchased from Stitch Loot Store!`, 'success');
    handleAddLog(`Purchased Loot Shop item: ${rewardLabel}.`, 'INFO', 0);
    return true;
  };

  // Initiate dynamic hyperspace warp jump when all daily calibrations completed
  const handleInitiateWarp = async () => {
    if (!user || !profile) return;

    // Trigger on-screen hyper warp effect
    setHyperspaceWarping(true);
    triggerToast('COORDINATES SYNCHRONIZED... COMPUTING HYPERSURFACE DRIVE', 'info');

    setTimeout(async () => {
      const finalStreak = profile.warpStreak + 1;
      const updatedProfile: CommanderProfile = {
        ...profile,
        warpStreak: finalStreak,
        fuel: 100, // Refuels reactor cores fully!
        xp: profile.xp + 50 // Hyperspace jump bonus XP!
      };

      // Reset completions for tomorrow's logging
      const resetHabits = habits.map(async (habit) => {
        const nextHabit: HabitItem = {
          ...habit,
          completedToday: false,
          status: 'PENDING',
          progress: habit.title === 'Physical Calibration' ? 80 : habit.title === 'Knowledge Intake' ? 20 : 0,
          health: habit.title === 'Physical Calibration' ? 'OPTIMAL' : habit.title === 'Knowledge Intake' ? 'DEGRADED' : 'STANDBY'
        };
        await saveHabit(user.uid, nextHabit);
        return nextHabit;
      });

      Promise.all(resetHabits).then(res => setHabits(res));
      setProfile(updatedProfile);
      await saveCommanderProfile(user.uid, updatedProfile);

      setHyperspaceWarping(false);
      triggerToast(`JUMP VELOCITY ACQUIRED! Warp Cycle ${finalStreak} logged secure. Reactor refueled!`, 'success');
      handleAddLog(`Subspace wormhole transited. Streak logged cycle ${finalStreak}.`, 'XP', 50);
    }, 2800);
  };

  // Standard loading screens
  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] text-cyan-400 flex flex-col justify-center items-center font-mono">
        <Rocket className="w-10 h-10 animate-spin mb-4 text-primary" />
        <p className="text-xs uppercase tracking-widest animate-pulse">Computing stardate connections...</p>
      </div>
    );
  }

  // 4. Immersive cyber-futurism login overlay screen
  if (!user || !profile) {
    return (
      <div className="min-h-screen bg-[#020617] flex justify-center items-center p-4 relative overflow-hidden scanline-overlay">
        {/* Animated background laser loops */}
        <div className="absolute inset-0 bg-radial pointer-events-none bg-gradient-to-t from-cyan-950/25 via-[#020617] to-purple-950/15" />
        
        <div className="w-full max-w-sm bg-slate-900 border border-primary/45 rounded-2xl p-6 shadow-[0_0_40px_rgba(34,211,238,0.3)] relative z-10 text-center select-none backdrop-blur-md">
          {/* Logo element from mockup headers */}
          <div className="w-16 h-16 mx-auto mb-4 rounded-full border border-primary/45 flex items-center justify-center glow-cyan bg-slate-950/80">
            <Rocket className="w-8 h-8 text-primary animate-pulse" />
          </div>

          <h1 className="text-xl font-display-lg font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">
            STARSHIP COMMAND
          </h1>
          <p className="text-[10px] font-mono text-on-surface-variant uppercase tracking-widest block mt-1.5 leading-tight">
            SECURE NAVIGATION MATRIX COCKPIT
          </p>

          <div className="my-6 border border-outline-variant/35 rounded-xl p-4 bg-slate-950/50 text-left space-y-3 font-mono text-xs">
            <div className="flex justify-between items-center text-[10px] text-outline border-b border-outline-variant/20 pb-1.5 font-bold">
              <span>SECURITY IDENT_PROTO: SYSLOG_A</span>
              <span className="text-primary animate-pulse">● LIVE_FEED</span>
            </div>
            <p className="text-[11px] text-on-surface-variant/85 leading-normal">
              &gt; Handshake protocol initialized...<br />
              &gt; Load telemetry trackers from Firestore...<br />
              &gt; Separation filters active.<br />
              &gt; Sync level streaks: OPTIMAL.
            </p>
          </div>

          <div className="mb-4 text-left font-mono">
            <label className="block text-[10px] text-outline uppercase font-black tracking-wider mb-2 pl-1 select-none">
              PILOT CALLSIGN HANDLE:
            </label>
            <input
              type="text"
              value={customCallsign}
              onChange={(e) => setCustomCallsign(e.target.value)}
              placeholder="e.g., Joshua, Alpha-Pilot"
              maxLength={18}
              className="w-full bg-slate-950 border border-primary/30 text-white rounded-xl px-3 py-2.5 text-xs outline-none focus:border-primary focus:shadow-[0_0_8px_rgba(34,211,238,0.35)] transition-all font-mono"
            />
          </div>

          {/* Touch target ready login launch button */}
          <button
            onClick={() => handleLogin(customCallsign)}
            style={{ minHeight: '44px' }}
            className="w-full bg-primary hover:bg-primary-container text-slate-950 text-xs font-label-caps font-black py-2.5 px-4 rounded-xl cursor-pointer transition-all uppercase flex items-center justify-center gap-2 glow-cyan hover:glow-cyan-intense active:scale-95 text-[11px] font-mono shadow-[0_4px_15px_rgba(34,211,238,0.3)]"
          >
            <LogIn className="w-4 h-4" />
            INITIALIZE COCKPIT INTEGRITY LINK
          </button>

          {isMockFirebase && (
            <span className="block mt-4 text-[9px] font-mono text-amber-500 uppercase leading-snug tracking-wider">
              FALLBACK PILOT MODE SIMULATION ENABLED
            </span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] flex justify-center items-start scanline-overlay relative overflow-x-hidden selection:bg-primary/20 select-none pb-24 text-on-surface">
      
      {/* Immersive portal warp flash overlay */}
      <AnimatePresence>
        {hyperspaceWarping && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white z-50 flex flex-col justify-center items-center pointer-events-auto"
          >
            <motion.div 
              animate={{ scale: [1, 2, 12, 0], opacity: [0.6, 1, 0] }}
              transition={{ duration: 2.8, ease: 'easeInOut' }}
              className="w-24 h-24 rounded-full bg-primary blur-md"
            />
            <h2 className="absolute text-slate-950 font-display-lg text-lg font-black tracking-widest uppercase animate-pulse">
              TRANSITING INTEGRATION TENSION...
            </h2>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Persistent top app bar HUD banner */}
      <Header 
        profile={profile} 
        onLogout={handleLogout} 
        isMockUser={isMockFirebase} 
      />

      {/* Fixed mobile phone shell constraint wrapper matches precise dimensions (max-w-md / 480px) */}
      <div className="w-full max-w-md min-h-screen flex flex-col px-4 pt-20 pb-20 justify-start">
        
        {/* Dynamic routing page display */}
        <main className="flex-grow pt-3 pb-8 relative z-10 select-none">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTab}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.15 }}
            >
              {currentTab === 'HELM' && (
                <HelmTab 
                  habits={habits}
                  profile={profile}
                  onToggleHabit={handleToggleHabit}
                  onInitiateWarp={handleInitiateWarp}
                  onAddLog={handleAddLog}
                />
              )}

              {currentTab === 'HANGAR' && (
                <HangarTab 
                  habits={habits}
                  logs={logs}
                  onAddHabit={handleAddHabit}
                  onCalibrateSystem={handleCalibrateSystem}
                />
              )}

              {currentTab === 'ANALYTICS' && (
                <AnalyticsTab 
                  habits={habits}
                  profile={profile}
                />
              )}

              {currentTab === 'REWARDS' && (
                <RewardsTab 
                  profile={profile}
                  onSpendXp={handleSpendXp}
                  onSpendCoins={handleSpendCoins}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Floating dynamic alert toasts list */}
      <Toast toasts={toasts} onDismiss={dismissToast} />

      {/* Fixed bottom navigation tabs bar */}
      <BottomNav 
        currentTab={currentTab} 
        onTabChange={setCurrentTab} 
      />
    </div>
  );
}
