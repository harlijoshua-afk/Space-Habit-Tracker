/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  getDoc, 
  getDocFromServer,
  setDoc, 
  updateDoc, 
  collection, 
  getDocs, 
  addDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  limit 
} from 'firebase/firestore';
import { CommanderProfile, HabitItem, ConsoleLog } from '../types';
import firebaseConfig from '../../firebase-applet-config.json';

// Detect if configuration is set to placeholders
export const isMockFirebase = 
  !firebaseConfig.apiKey || 
  firebaseConfig.apiKey.includes('placeholder-api-key') ||
  firebaseConfig.projectId.includes('placeholder-project');

let app;
let db: any = null;
let auth: any = null;
let googleProvider: any = null;

if (!isMockFirebase) {
  try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
    auth = getAuth(app);
    googleProvider = new GoogleAuthProvider();

    // Call getDocFromServer to validate connection per guidelines
    const testConnection = async () => {
      try {
        await getDocFromServer(doc(db, 'test', 'connection'));
      } catch (error) {
        if (error instanceof Error && error.message.includes('the client is offline')) {
          console.error("Please check your Firebase configuration: Client is offline.");
        }
      }
    };
    testConnection();
  } catch (err) {
    console.warn("Failed to initialize live Firebase, falling back to local simulation:", err);
  }
}

export { db, auth };

// ---- error logging definitions conforming to guidelines ----
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const currentAuth = auth;
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: currentAuth?.currentUser?.uid || null,
      email: currentAuth?.currentUser?.email || null,
      emailVerified: currentAuth?.currentUser?.emailVerified || null,
      isAnonymous: currentAuth?.currentUser?.isAnonymous || null,
      tenantId: currentAuth?.currentUser?.tenantId || null,
      providerInfo: currentAuth?.currentUser?.providerData?.map((provider: any) => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// ---- Authentication operations ----

export interface AuthUserState {
  uid: string;
  displayName: string;
  photoURL: string;
  email: string;
}

export async function loginWithGoogle(displayName?: string): Promise<AuthUserState> {
  const chosenName = displayName?.trim() || 'Commander Joshua';
  
  // High fidelity default avatar representing Starship pilot
  const mockUser: AuthUserState = {
    uid: 'simulated-commander-uid-4592',
    displayName: chosenName,
    photoURL: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB4SSuHTHTHJgcNEflJ05n3VIMIs9JH8TDMDE09ul1OWoFyMNdVZE3ecBNW7VG4jIwDx5n134M55EWWkwE9H7t_19qVME-41_u9SyMjisAXtMopdpvPpjNx8bjXuxoKOYJmcA5TXVi49nehw0g8el0PySmCVYmMmwWBjLhsPR7aJSbSNnDMKRrUMcrHgiJzQrtSX6Y90mvQ0v9kEz3Mu9eqKs6vHz8ezwh6yxiQfD21lXhb5y-S0C0ydu1zzRNAgOfMFlSkjQGfNRs',
    email: 'harlijoshua@gmail.com'
  };
  
  saveLocalUser(mockUser);
  
  // Custom custom event to notify lock step login immediately
  window.dispatchEvent(new Event('auth_state_changed'));
  
  return mockUser;
}

export async function logoutUser(): Promise<void> {
  localStorage.removeItem('starship_commander_user');
  window.dispatchEvent(new Event('auth_state_changed'));
}

export function subscribeToAuth(callback: (user: AuthUserState | null) => void) {
  const checkAuth = () => {
    const saved = localStorage.getItem('starship_commander_user');
    if (saved) {
      try {
        callback(JSON.parse(saved));
      } catch (e) {
        callback(null);
      }
    } else {
      callback(null);
    }
  };

  // Run on start
  checkAuth();

  // Return a listener that can be fired when we log in/out
  const handleStorageChange = (e: StorageEvent) => {
    if (e.key === 'starship_commander_user') {
      checkAuth();
    }
  };
  window.addEventListener('storage', handleStorageChange);
  
  const handleAuthNotification = () => {
    checkAuth();
  };
  window.addEventListener('auth_state_changed', handleAuthNotification);

  return () => {
    window.removeEventListener('storage', handleStorageChange);
    window.removeEventListener('auth_state_changed', handleAuthNotification);
  };
}

function saveLocalUser(user: AuthUserState) {
  localStorage.setItem('starship_commander_user', JSON.stringify(user));
}

// ---- Data persistence fallback manager ----

// Default initial state matching mockups
export const defaultHabits: HabitItem[] = [
  {
    id: 'physical_calibration',
    title: 'Physical Calibration',
    category: 'Health',
    cycleTime: '14:00',
    status: 'ACTIVE',
    streak: 12,
    maxStreak: 30,
    health: 'OPTIMAL',
    description: '45 Min. Cardiovascular Drill as scheduled inside Sector Alpha.',
    progress: 80, // OPTIMAL = 4 segments out of 5
    xpReward: 10,
    completedToday: false
  },
  {
    id: 'knowledge_intake',
    title: 'Knowledge Intake',
    category: 'School',
    cycleTime: '19:00',
    status: 'PENDING',
    streak: 2,
    maxStreak: 10,
    health: 'DEGRADED',
    description: 'Deep starlight data documentation logs and tactical book study.',
    progress: 20, // DEGRADED = 1 segment out of 5
    xpReward: 15,
    completedToday: false
  },
  {
    id: 'hydration_array',
    title: 'Hydration Array',
    category: 'Health',
    cycleTime: '08:00',
    status: 'PENDING',
    streak: 8,
    maxStreak: 15,
    health: 'STANDBY',
    description: 'All-day hydration protocol targeting ship-wide thermal safety.',
    progress: 0, // STANDBY = 0 segments out of 5
    xpReward: 10,
    completedToday: false
  },
  {
    id: 'neural_rest',
    title: 'Neural Rest',
    category: 'Mind',
    cycleTime: '06:00',
    status: 'SECURED',
    streak: 45,
    maxStreak: 60,
    health: 'MAXIMUM',
    description: '15 Min. Deep Space meditation module focusing on cortex recovery.',
    progress: 100, // MAXIMUM = 5 segments out of 5
    xpReward: 15,
    completedToday: true
  },
  {
    id: 'warp_mechanics',
    title: 'Warp Drive Coding',
    category: 'Skills',
    cycleTime: '11:00',
    status: 'PENDING',
    streak: 5,
    maxStreak: 20,
    health: 'OPTIMAL',
    description: 'Calibrate hyperspace thruster sub-routines and terminal commands.',
    progress: 40,
    xpReward: 20,
    completedToday: false
  }
];

export const defaultLogs: ConsoleLog[] = [
  {
    id: 'log_3',
    time: '08:00',
    text: 'Physical Calibration sequence complete.',
    badge: '+10 XP',
    type: 'XP',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    id: 'log_2',
    time: '07:30',
    text: 'Hydration Array offline. Intervention required.',
    badge: 'WARN',
    type: 'WARN',
    createdAt: new Date(Date.now() - 3600000 * 2.5).toISOString()
  },
  {
    id: 'log_1',
    time: '06:00',
    text: 'Neural Rest cycle terminated successfully.',
    badge: '+15 XP',
    type: 'XP',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString()
  }
];

export const defaultProfile = (uid: string, displayName: string, photoURL: string): CommanderProfile => ({
  uid,
  displayName,
  photoURL,
  xp: 750,
  level: 1,
  gold: 350, // Support purchasing from store right away
  hp: 100,
  fuel: 98,
  warpStreak: 12,
  rank: 'Vanguard Commander',
  lastActive: new Date().toISOString(),
  unlockedUpgrades: [],
  unlockedLoot: []
});

// Synchronous fetch commands supporting offline fallback

export async function fetchCommanderProfile(uid: string, displayName: string, photoURL: string): Promise<CommanderProfile> {
  const path = `users/${uid}`;
  if (isMockFirebase || !db) {
    const saved = localStorage.getItem(`starship_profile_${uid}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    const fresh = defaultProfile(uid, displayName, photoURL);
    localStorage.setItem(`starship_profile_${uid}`, JSON.stringify(fresh));
    return fresh;
  }

  try {
    const userDocRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userDocRef);
    if (userSnap.exists()) {
      return userSnap.data() as CommanderProfile;
    } else {
      const fresh = defaultProfile(uid, displayName, photoURL);
      await setDoc(userDocRef, fresh);
      return fresh;
    }
  } catch (error) {
    return handleFirestoreError(error, OperationType.GET, path);
  }
}

export async function saveCommanderProfile(uid: string, profile: CommanderProfile): Promise<void> {
  const path = `users/${uid}`;
  if (isMockFirebase || !db) {
    localStorage.setItem(`starship_profile_${uid}`, JSON.stringify(profile));
    return;
  }

  try {
    const userDocRef = doc(db, 'users', uid);
    await setDoc(userDocRef, profile);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function fetchHabits(uid: string): Promise<HabitItem[]> {
  const path = `users/${uid}/missions`;
  if (isMockFirebase || !db) {
    const saved = localStorage.getItem(`starship_habits_${uid}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    localStorage.setItem(`starship_habits_${uid}`, JSON.stringify(defaultHabits));
    return defaultHabits;
  }

  try {
    const missionsCol = collection(db, 'users', uid, 'missions');
    const qSnapshot = await getDocs(missionsCol);
    if (qSnapshot.empty) {
      // Seed initial habits into cloud
      for (const h of defaultHabits) {
        await setDoc(doc(db, 'users', uid, 'missions', h.id), h);
      }
      return defaultHabits;
    }
    const list: HabitItem[] = [];
    qSnapshot.forEach((d) => {
      list.push(d.data() as HabitItem);
    });
    return list;
  } catch (error) {
    return handleFirestoreError(error, OperationType.GET, path);
  }
}

export async function saveHabit(uid: string, habit: HabitItem): Promise<void> {
  const path = `users/${uid}/missions/${habit.id}`;
  if (isMockFirebase || !db) {
    const habits = await fetchHabits(uid);
    const updated = habits.map(h => h.id === habit.id ? habit : h);
    localStorage.setItem(`starship_habits_${uid}`, JSON.stringify(updated));
    return;
  }

  try {
    const hDoc = doc(db, 'users', uid, 'missions', habit.id);
    await setDoc(hDoc, habit);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function fetchConsoleEvents(uid: string): Promise<ConsoleLog[]> {
  const path = `users/${uid}/events`;
  if (isMockFirebase || !db) {
    const saved = localStorage.getItem(`starship_events_${uid}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    localStorage.setItem(`starship_events_${uid}`, JSON.stringify(defaultLogs));
    return defaultLogs;
  }

  try {
    const eventsCol = collection(db, 'users', uid, 'events');
    const q = query(eventsCol, orderBy('createdAt', 'desc'), limit(15));
    const qSnapshot = await getDocs(q);
    if (qSnapshot.empty) {
      // Seed default logs
      for (const l of defaultLogs) {
        await setDoc(doc(db, 'users', uid, 'events', l.id), l);
      }
      return defaultLogs;
    }
    const list: ConsoleLog[] = [];
    qSnapshot.forEach((d) => {
      list.push(d.data() as ConsoleLog);
    });
    return list;
  } catch (error) {
    return handleFirestoreError(error, OperationType.GET, path);
  }
}

export async function addConsoleEvent(uid: string, log: ConsoleLog): Promise<void> {
  const path = `users/${uid}/events/${log.id}`;
  if (isMockFirebase || !db) {
    const logs = await fetchConsoleEvents(uid);
    const updated = [log, ...logs].slice(0, 30); // Max 30 kept on screen
    localStorage.setItem(`starship_events_${uid}`, JSON.stringify(updated));
    return;
  }

  try {
    const eDoc = doc(db, 'users', uid, 'events', log.id);
    await setDoc(eDoc, log);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}
