import React, { useState, useEffect } from 'react';
import { Button } from './Button';
import { ViewMode } from '../types';
import { ArrowRight, Clock, TrainFront, Zap, Users } from 'lucide-react';

interface HomeProps {
  setMode: (mode: ViewMode) => void;
}

const PARADOXES = [
  {
    id: 1,
    title: "The Twin Paradox",
    subtitle: "One stays. One leaves. Only one returns young.",
    desc: "If you travel at light speed, time slows down for you. Return to Earth to find your twin is now an old man while you haven't aged a day.",
    icon: <Users size={48} className="text-purple-400" />,
    color: "from-purple-900/50 to-blue-900/50",
    bg: "./home_image/twin.png"
  },
  {
    id: 2,
    title: "Train in a Tunnel",
    subtitle: "Physics breaks common sense.",
    desc: "A train is longer than a tunnel. But if it moves fast enough, it fits inside. Or does the tunnel shrink? It depends on who you ask.",
    icon: <TrainFront size={48} className="text-cyan-400" />,
    color: "from-cyan-900/50 to-teal-900/50",
    bg: "./home_image/traintunnel.png"
  },
  {
    id: 3,
    title: "Time Dilation",
    subtitle: "Moving clocks tick slower.",
    desc: "Time is not absolute. It stretches and squeezes based on your speed. Explore the math that redefined the universe.",
    icon: <Clock size={48} className="text-pink-400" />,
    color: "from-pink-900/50 to-rose-900/50",
    bg: "./home_image/timedilation.png"
  }
];

export const Home: React.FC<HomeProps> = ({ setMode }) => {
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % PARADOXES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const activeItem = PARADOXES[activeIdx];

  return (
    <div className="relative min-h-[calc(100vh-64px)] flex flex-col items-center justify-center overflow-hidden">
      
      {/* Background Effects */}
      <div className="absolute inset-0 z-0">
         <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px] animate-pulse"></div>
         <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600/20 rounded-full blur-[100px] animate-pulse delay-1000"></div>
         
         {/* Stars */}
         <div className="absolute inset-0 opacity-50" style={{backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '50px 50px'}}></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 w-full grid lg:grid-cols-2 gap-12 items-center">
        
        {/* Left Column: Intro */}
        <div className="space-y-8 text-center lg:text-left">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-purple-200 leading-tight">
            Reality is <br/>
            <span className="text-cyan-400">Relative.</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed">
            Experience the mind-bending physics of Einstein's Special Relativity. 
            Visualize time dilation, warp through space, and solve the universe's greatest paradoxes right in your browser.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Button size="lg" onClick={() => setMode(ViewMode.EXPERIMENTS)} className="flex items-center gap-2 group">
              Start Exploring <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => setMode(ViewMode.SIMULATION)}>
              Launch Warp Drive
            </Button>
          </div>
        </div>

        {/* Right Column: Paradox Carousel */}
        <div className="relative h-[400px] w-full">
            {PARADOXES.map((item, idx) => (
                <div 
                    key={item.id}
                    className={`absolute inset-0 transition-all duration-700 ease-in-out transform ${
                        idx === activeIdx 
                        ? 'opacity-100 translate-x-0 scale-100' 
                        : 'opacity-0 translate-x-8 scale-95 pointer-events-none'
                    }`}
                >
                    <div
                        className={`h-full border border-white/10 backdrop-blur-sm rounded-3xl p-8 flex flex-col justify-center items-start shadow-2xl relative overflow-hidden group hover:border-white/30 transition-colors`}
                        style={{
                          backgroundImage: `url(${item.bg})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }}
                      >
                        {/* Color overlay (keep this for readability) */}
                        <div className={`absolute inset-0 bg-[#0a1a2f]/25`} />

                        {/* <div className="absolute top-0 right-0 p-32 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div> */}
                        
                        <div className="mb-6 p-4 bg-black/30 rounded-2xl border border-white/10">
                            {item.icon}
                        </div>
                        
                        <h2 className="text-3xl font-bold text-white mb-2
                                      drop-shadow-[0_0_6px_rgba(255,255,255,0.9)]
                                      drop-shadow-[0_0_16px_rgba(0,200,255,0.6)]
                                      ">{item.title}</h2>
                        <h3 className={`text-lg font-medium text-cyan-200 mb-4
                                      ${idx === activeIdx ? "drop-shadow-[0_0_18px_rgba(0,240,255,0.8)]" : ""}`}>{item.subtitle}</h3>
                        <p className="text-gray-50 leading-relaxed mb-8 drop-shadow-[0_0_6px_rgba(0,200,255,0.6)] drop-shadow-[0_0_16px_rgba(255,255,255,1)]">
                            {item.desc}
                        </p>
                        
                        <div className="flex gap-2 mt-auto">
                            {PARADOXES.map((_, i) => (
                                <button 
                                    key={i}
                                    onClick={() => setActiveIdx(i)}
                                    className={`w-12 h-1 rounded-full transition-all duration-300 ${i === activeIdx ? 'bg-white' : 'bg-white/20'}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            ))}
        </div>

      </div>

      <div className="absolute bottom-8 left-0 right-0 text-center text-slate-500 text-sm animate-bounce">
        Scroll to learn more
      </div>
    </div>
  );
};