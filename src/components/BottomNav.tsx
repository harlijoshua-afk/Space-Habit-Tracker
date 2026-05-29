/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { TabType } from '../types';
import { Compass, LayoutGrid, Activity, Award } from 'lucide-react';

interface BottomNavProps {
  currentTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export default function BottomNav({ currentTab, onTabChange }: BottomNavProps) {
  const tabs = [
    { key: 'HELM' as TabType, label: 'HELM', icon: Compass },
    { key: 'HANGAR' as TabType, label: 'HANGAR', icon: LayoutGrid },
    { key: 'ANALYTICS' as TabType, label: 'ANALYTICS', icon: Activity },
    { key: 'REWARDS' as TabType, label: 'REWARDS', icon: Award }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950 border-t border-primary/25 shadow-[0_-5px_30px_rgba(34,211,238,0.25)] rounded-t-xl">
      <div className="max-w-md mx-auto w-full flex justify-around items-center px-1 pb-4 sm:pb-2 pt-1 font-mono">
        {tabs.map((tab) => {
          const isActive = currentTab === tab.key;
          const Icon = tab.icon;

          return (
            <button
              key={tab.key}
              id={`nav-tab-${tab.key.toLowerCase()}`}
              onClick={() => onTabChange(tab.key)}
              style={{ minHeight: '44px' }}
              className={`flex flex-col items-center justify-center pt-2.5 pb-3 w-full transition-all duration-150 ease-out active:scale-90 relative ${
                isActive 
                  ? 'bg-primary/10 text-primary font-bold' 
                  : 'text-on-surface-variant/60 hover:text-primary'
              }`}
            >
              {/* Highlight bar above active tab */}
              {isActive && (
                <div role="presentation" className="absolute top-0 left-0 right-0 h-[2px] bg-primary shadow-[0_0_10px_rgba(34,211,238,1)]" />
              )}
              
              <Icon 
                className={`w-5 h-5 mb-1 ${
                  isActive ? 'stroke-[2.5px] drop-shadow-[0_0_8px_rgba(34,211,238,0.7)]' : 'stroke-[1.8px]'
                }`} 
              />
              <span className="text-[10px] tracking-widest font-mono font-medium leading-none">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
