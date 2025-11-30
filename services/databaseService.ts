import { UserProfile, AnalyticsEvent, LearningStyleType } from "../types";

// Keys for LocalStorage
const USER_KEY = 'rim_user_profile';
const ANALYTICS_KEY = 'rim_analytics_logs';

class DatabaseService {
  private user: UserProfile | null = null;

  constructor() {
    this.loadUser();
  }

  private loadUser() {
    const stored = localStorage.getItem(USER_KEY);
    if (stored) {
      this.user = JSON.parse(stored);
    }
  }

  public getUser(): UserProfile | null {
    return this.user;
  }

  public saveUser(profile: UserProfile) {
    this.user = profile;
    localStorage.setItem(USER_KEY, JSON.stringify(profile));
  }

  public updateUserStyle(style: LearningStyleType, scores: { visual: number, auditory: number, kinesthetic: number }) {
    if (this.user) {
      this.user.learningStyle = style;
      this.user.learningScores = scores;
      this.saveUser(this.user);
    }
  }

  public logout() {
    this.user = null;
    localStorage.removeItem(USER_KEY);
  }

  public logEvent(event: Omit<AnalyticsEvent, 'userId' | 'timestamp'>) {
    if (!this.user) return; // Don't log anonymous events if we strictly want user data

    const fullEvent: AnalyticsEvent = {
      ...event,
      userId: this.user.id,
      timestamp: Date.now()
    };

    // Retrieve existing logs
    const logsStr = localStorage.getItem(ANALYTICS_KEY);
    const logs: AnalyticsEvent[] = logsStr ? JSON.parse(logsStr) : [];
    
    logs.push(fullEvent);
    
    // In a real app, we would batch send these to a cloud DB.
    // For now, we keep them in local storage.
    try {
        localStorage.setItem(ANALYTICS_KEY, JSON.stringify(logs));
        console.log(`[Analytics] ${event.eventType} - ${event.target}`, event.value || '');
    } catch (e) {
        console.error("Storage full, could not save analytic event");
    }
  }

  public getExportData() {
    return {
      user: this.getUser(),
      analytics: JSON.parse(localStorage.getItem(ANALYTICS_KEY) || '[]')
    };
  }
}

export const db = new DatabaseService();