import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Simulation } from './components/Simulation';
import { ChatTutor } from './components/ChatTutor';
import { Theory } from './components/Theory';
import { ExperimentsView } from './components/ExperimentsView';
import { Home } from './components/Home';
import { LoginPage } from './components/LoginPage';
import { QuestionnairePage } from './components/QuestionnairePage';
import { QuizPage } from './components/QuizPage';
import { ViewMode } from './types';
import { HashRouter } from 'react-router-dom';
import { db } from './services/databaseService';
import { AnalyticsProvider } from './contexts/AnalyticsContext';

const AppContent: React.FC = () => {
  const [currentMode, setMode] = useState<ViewMode>(ViewMode.HOME);
  const [velocity, setVelocity] = useState(0); 
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hasStyle, setHasStyle] = useState(false);

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await fetch('http://192.168.0.27:5000/me', {
          credentials: 'include', // important! sends the session cookie
        });

        if (res.ok) {
          const user = await res.json();
          if (user) setIsLoggedIn(true);
          if (user?.learningStyle) setHasStyle(true);
        }
      } catch (err) {
        console.log('Not logged in');
      }
    };

    checkLogin();
  }, []);

  // Auto-scroll to top when navigation state changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentMode, isLoggedIn, hasStyle]);


  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleQuestionnaireComplete = () => {
    setHasStyle(true);
  };

  const handleSkipAll = () => {
    setIsLoggedIn(true);
    setHasStyle(true);
  };

  const handleSkipQuestionnaire = () => {
    setHasStyle(true);
  };

  if (!isLoggedIn) {
    return <LoginPage onLoginSuccess={handleLogin} onSkip={handleSkipAll} />;
  }

  if (!hasStyle) {
    return <QuestionnairePage onComplete={handleQuestionnaireComplete} onSkip={handleSkipQuestionnaire} />;
  }

  const renderContent = () => {
    switch (currentMode) {
      case ViewMode.HOME:
        return <Home setMode={setMode} />;
      case ViewMode.SIMULATION:
        return <Simulation velocity={velocity} setVelocity={setVelocity} />;
      case ViewMode.EXPERIMENTS:
        return <ExperimentsView />;
      case ViewMode.THEORY:
        return <Theory />;
      case ViewMode.QUIZ:
        return <QuizPage />;
      case ViewMode.TUTOR:
        return <ChatTutor />;
      default:
        return <Home setMode={setMode} />;
    }
  };

  return (
      <div className="min-h-screen bg-space-900 text-slate-100 font-sans selection:bg-cyan-500/30">
        <Navbar currentMode={currentMode} setMode={setMode} />
        
        <main className="py-8 animate-in fade-in duration-300">
          {renderContent()}
        </main>

        <footer className="border-t border-space-800 py-8 mt-auto">
          <div className="max-w-7xl mx-auto px-4 text-center text-slate-600 text-sm">
            <p>Relativity In Motion</p>
          </div>
        </footer>
      </div>
  );
};

const App: React.FC = () => {
  return (
    <HashRouter>
       <AnalyticsProvider>
          <AppContent />
       </AnalyticsProvider>
    </HashRouter>
  );
}

export default App;
