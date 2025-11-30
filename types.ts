import React from 'react';

export interface SimulationState {
  velocity: number; // Fraction of light speed (0 to 0.995)
  gamma: number;    // Lorentz factor
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export enum ViewMode {
  HOME = 'HOME',
  SIMULATION = 'SIMULATION',
  THEORY = 'THEORY',
  TUTOR = 'TUTOR',
  EXPERIMENTS = 'EXPERIMENTS',
  QUIZ = 'QUIZ'
}

export interface NavItem {
  id: ViewMode;
  label: string;
  icon: React.ReactNode;
}

export type VoicePersona = 'HEADMASTER' | 'SISTER' | 'REBEL';

// --- User & Analytics Types ---

export type LearningStyleType = 'Visual' | 'Auditory' | 'Kinesthetic' | 'Multi-Sensory';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  gender: string;
  age: number;
  education: string;
  country: string;
  learningStyle?: LearningStyleType;
  learningScores?: {
    visual: number;
    auditory: number;
    kinesthetic: number;
  };
  loginTime: number;
}

export interface AnalyticsEvent {
  userId: string;
  timestamp: number;
  eventType: 'PAGE_VIEW' | 'CLICK' | 'SLIDER_CHANGE' | 'AR_SESSION' | 'DWELL_TIME' | 'QUIZ_COMPLETE';
  target?: string; // e.g., "TwinParadox", "VelocitySlider"
  value?: number; // e.g., 0.95 (velocity), 120 (seconds)
  metadata?: any;
}

