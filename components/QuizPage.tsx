import React, { useState } from 'react';
import { Button } from './Button';
import { CheckCircle, XCircle, Award, RotateCcw } from 'lucide-react';
import { usePageTracking, useAnalytics } from '../contexts/AnalyticsContext';
import { db } from '../services/databaseService';

interface Question {
  id: number;
  text: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    text: "According to the Second Postulate of Special Relativity, the speed of light in a vacuum is:",
    options: [
      "Faster if the source is moving towards you",
      "Slower if the source is moving away from you",
      "Constant for all observers, regardless of motion",
      "Dependent on the gravity of nearby stars"
    ],
    correctIndex: 2,
    explanation: "The speed of light (c) is a universal constant (approx 300,000 km/s) and remains the same for all observers, no matter how fast they are moving."
  },
  {
    id: 2,
    text: "In the Twin Paradox, why does the traveling twin return younger than the earthbound twin?",
    options: [
      "Biology works differently in space",
      "The traveling twin accelerates (changes inertial frames), breaking symmetry",
      "The earthbound twin was closer to the sun's gravity",
      "Time dilation only affects mechanical clocks, not humans"
    ],
    correctIndex: 1,
    explanation: "While velocity is relative, acceleration is absolute. The traveling twin turns around to return, switching inertial frames, which distinguishes their timeline from the Earth twin."
  },
  {
    id: 3,
    text: "What happens to the length of an object as it approaches the speed of light?",
    options: [
      "It expands in all directions",
      "It contracts (shrinks) only in the direction of motion",
      "It contracts in all directions",
      "Its length remains unchanged"
    ],
    correctIndex: 1,
    explanation: "This is Length Contraction. Objects appear shorter along the axis of travel relative to a stationary observer."
  },
  {
    id: 4,
    text: "If a spaceship travels towards a star at 0.5c, what color shift will the astronaut observe?",
    options: [
      "Redshift (Lower frequency)",
      "Blueshift (Higher frequency)",
      "No shift (Green stays Green)",
      "Grayscale shift"
    ],
    correctIndex: 1,
    explanation: "Doppler Effect: Moving towards a light source compresses the waves, increasing frequency and shifting visible light towards the Blue/Violet end of the spectrum."
  },
  {
    id: 5,
    text: "In the Train-Tunnel paradox, why does the tunnel observer think the train fits inside?",
    options: [
      "The tunnel gets longer",
      "The train gets shorter due to length contraction",
      "The driver brakes just in time",
      "It's an optical illusion"
    ],
    correctIndex: 1,
    explanation: "From the tunnel's perspective (stationary), the moving train undergoes length contraction, making it physically shorter than its rest length."
  },
  {
    id: 6,
    text: "Two events happen simultaneously in a stationary frame. To a moving observer, they are:",
    options: [
      "Always simultaneous",
      "Never simultaneous",
      "Not necessarily simultaneous (Relativity of Simultaneity)",
      "Backwards in time"
    ],
    correctIndex: 2,
    explanation: "Simultaneity is relative. Observers in relative motion will disagree on the timing of events separated by space."
  },
  {
    id: 7,
    text: "As an object with mass approaches the speed of light, its relativistic mass (energy required to accelerate it):",
    options: [
      "Decreases to zero",
      "Remains constant",
      "Increases towards infinity",
      "Fluctuates randomly"
    ],
    correctIndex: 2,
    explanation: "As v approaches c, the gamma factor approaches infinity. This means it would take infinite energy to accelerate a massive object to the speed of light."
  },
  {
    id: 8,
    text: "What is the Gamma factor (γ) at 0 velocity?",
    options: [
      "0",
      "1",
      "Infinity",
      "0.5"
    ],
    correctIndex: 1,
    explanation: "At rest (v=0), gamma = 1 / sqrt(1 - 0) = 1. This means time flows normally and length is normal."
  },
  {
    id: 9,
    text: "If you could travel at 99.9% the speed of light, how would the universe look ahead of you?",
    options: [
      "Pitch black",
      "Stars would spread out evenly",
      "Stars would cluster in front of you (Aberration) and shift color",
      "Everything would look blurry"
    ],
    correctIndex: 2,
    explanation: "Relativistic Aberration causes the field of view to warp, making stars appear to bunch up in the direction of travel."
  },
  {
    id: 10,
    text: "Which equation famously relates mass and energy in relativity?",
    options: [
      "F = ma",
      "E = mc²",
      "a² + b² = c²",
      "PV = nRT"
    ],
    correctIndex: 1,
    explanation: "Einstein's E=mc² shows that mass and energy are interchangeable."
  }
];

export const QuizPage: React.FC = () => {
  usePageTracking("QuizPage");
  const { trackClick } = useAnalytics();

  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const currentQuestion = QUESTIONS[currentQuestionIdx];

  const handleSelect = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
  };

  const handleSubmit = () => {
    if (selectedOption === null) return;
    
    setIsAnswered(true);
    const isCorrect = selectedOption === currentQuestion.correctIndex;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      trackClick('quiz-answer-correct');
    } else {
      trackClick('quiz-answer-incorrect');
    }
  };

  const handleNext = () => {
    if (currentQuestionIdx < QUESTIONS.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setQuizFinished(true);
      db.logEvent({
          eventType: 'QUIZ_COMPLETE',
          target: 'RelativityMastery',
          value: score + (selectedOption === currentQuestion.correctIndex ? 1 : 0) // Add last point if correct
      });
    }
  };

  const handleRetry = () => {
    setCurrentQuestionIdx(0);
    setScore(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setQuizFinished(false);
    trackClick('quiz-retry');
  };

  if (quizFinished) {
    const finalScore = score;
    const percentage = (finalScore / QUESTIONS.length) * 100;
    
    let grade = "Cadet";
    let color = "text-slate-400";
    if (percentage >= 100) { grade = "Time Lord"; color = "text-cyan-400"; }
    else if (percentage >= 80) { grade = "Professor"; color = "text-purple-400"; }
    else if (percentage >= 60) { grade = "Physicist"; color = "text-green-400"; }
    else if (percentage >= 40) { grade = "Student"; color = "text-yellow-400"; }

    return (
      <div className="min-h-[600px] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-space-800 rounded-2xl border border-space-700 p-8 text-center animate-in zoom-in-95">
           <div className="w-20 h-20 bg-space-900 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-space-700">
               <Award size={40} className={color} />
           </div>
           
           <h2 className="text-3xl font-bold text-white mb-2">Quiz Complete!</h2>
           <p className="text-slate-400 mb-6">You scored</p>
           
           <div className={`text-6xl font-bold mb-4 ${color}`}>
              {percentage}%
           </div>
           
           <div className="bg-space-900 p-4 rounded-lg border border-space-600 mb-8">
              <div className="text-sm text-slate-500 uppercase tracking-widest">Rank Achieved</div>
              <div className={`text-2xl font-bold mt-1 ${color}`}>{grade}</div>
           </div>

           <Button onClick={handleRetry} className="w-full flex items-center justify-center gap-2">
              <RotateCcw size={18} /> Retry Quiz
           </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4 md:py-12">
      
      {/* Progress Header */}
      <div className="flex justify-between items-center mb-6">
         <div>
            <h1 className="text-2xl font-bold text-white">Relativity Mastery</h1>
            <p className="text-sm text-slate-400">Question {currentQuestionIdx + 1} of {QUESTIONS.length}</p>
         </div>
         <div className="text-cyan-400 font-mono text-lg font-bold">
            Score: {score}
         </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-space-800 rounded-full mb-8 overflow-hidden">
         <div 
            className="h-full bg-cyan-500 transition-all duration-300"
            style={{ width: `${((currentQuestionIdx) / QUESTIONS.length) * 100}%` }}
         ></div>
      </div>

      {/* Question Card */}
      <div className="bg-space-800 rounded-2xl border border-space-700 p-6 md:p-8 shadow-xl">
         <h2 className="text-xl md:text-2xl font-medium text-white mb-8 leading-relaxed">
            {currentQuestion.text}
         </h2>

         <div className="space-y-3">
            {currentQuestion.options.map((option, idx) => {
               let stateClass = "bg-space-900 border-space-600 hover:bg-space-700";
               
               if (isAnswered) {
                  if (idx === currentQuestion.correctIndex) {
                     stateClass = "bg-green-900/40 border-green-500 text-green-100";
                  } else if (idx === selectedOption) {
                     stateClass = "bg-red-900/40 border-red-500 text-red-100 opacity-50";
                  } else {
                     stateClass = "bg-space-900 border-space-600 opacity-50";
                  }
               } else if (selectedOption === idx) {
                  stateClass = "bg-cyan-900/40 border-cyan-500 text-cyan-100";
               }

               return (
                  <button
                    key={idx}
                    onClick={() => handleSelect(idx)}
                    disabled={isAnswered}
                    className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-center justify-between group ${stateClass}`}
                  >
                     <span className="font-medium">{option}</span>
                     {isAnswered && idx === currentQuestion.correctIndex && <CheckCircle size={20} className="text-green-500" />}
                     {isAnswered && idx === selectedOption && idx !== currentQuestion.correctIndex && <XCircle size={20} className="text-red-500" />}
                  </button>
               )
            })}
         </div>

         {/* Explanation & Next Button */}
         {isAnswered && (
            <div className="mt-8 pt-6 border-t border-space-600 animate-in fade-in slide-in-from-bottom-2">
                <div className={`p-4 rounded-lg mb-6 ${selectedOption === currentQuestion.correctIndex ? 'bg-green-900/20 border border-green-500/30' : 'bg-red-900/20 border border-red-500/30'}`}>
                    <h3 className="font-bold mb-2 flex items-center gap-2">
                       {selectedOption === currentQuestion.correctIndex ? <span className="text-green-400">Correct!</span> : <span className="text-red-400">Incorrect</span>}
                    </h3>
                    <p className="text-slate-300 text-sm leading-relaxed">
                       {currentQuestion.explanation}
                    </p>
                </div>
                
                <div className="flex justify-end">
                    <Button onClick={handleNext} size="lg" className="flex items-center gap-2">
                       {currentQuestionIdx === QUESTIONS.length - 1 ? "Finish Quiz" : "Next Question"}
                    </Button>
                </div>
            </div>
         )}

         {!isAnswered && (
             <div className="mt-8 flex justify-end">
                <Button 
                   onClick={handleSubmit} 
                   disabled={selectedOption === null}
                   size="lg"
                >
                   Submit Answer
                </Button>
             </div>
         )}
      </div>
    </div>
  );
};