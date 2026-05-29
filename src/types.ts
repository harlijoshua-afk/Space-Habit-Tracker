/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface CommanderProfile {
  uid: string;
  displayName: string;
  photoURL: string;
  xp: number;
  level: number;
  gold: number;
  hp: number;
  fuel: number;
  warpStreak: number;
  rank: string;
  lastActive: string;
  unlockedUpgrades: string[];
  unlockedLoot: string[];
}

export type HabitHealth = 'OPTIMAL' | 'DEGRADED' | 'STANDBY' | 'MAXIMUM';
export type HabitStatus = 'ACTIVE' | 'PENDING' | 'SECURED' | 'CHARGING';

export interface HabitItem {
  id: string;
  title: string;
  category: string; // e.g., 'Physical', 'Mental', 'Work', 'Skills'
  cycleTime: string; // e.g., '14:00', '08:00'
  status: HabitStatus;
  streak: number;
  maxStreak: number;
  health: HabitHealth;
  description: string;
  progress: number; // 0 to 100
  xpReward: number;
  completedToday: boolean;
}

export interface ConsoleLog {
  id: string;
  time: string; // e.g. "08:00"
  text: string;
  badge: string; // "+10 XP", "WARN", etc.
  type: 'XP' | 'WARN' | 'INFO';
  createdAt: string;
}

export type TabType = 'HELM' | 'HANGAR' | 'ANALYTICS' | 'REWARDS';

export interface ToastMessage {
  id: string;
  text: string;
  type: 'success' | 'warning' | 'info';
}
