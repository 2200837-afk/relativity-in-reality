import React, { useState, useRef, useEffect } from 'react';
import { chatWithEinstein } from '../services/geminiService';
import { Button } from './Button';
import { Send, User, Sparkles } from 'lucide-react';
import { ChatMessage } from '../types';

export const ChatTutor: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init',
      role: 'model',
      text: 'Greetings! I am Albert Einstein (or at least, a digital approximation). I am here to help you understand the strange and beautiful nature of our universe. What puzzles you about relativity?',
      timestamp: new Date()
    }
  ]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    // Prepare history for Gemini
    const history = messages.map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));

    const responseText = await chatWithEinstein(history, userMsg.text);

    const aiMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: responseText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, aiMsg]);
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-[600px] w-full max-w-4xl mx-auto bg-space-800 rounded-xl border border-space-700 shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-space-700 bg-space-900 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden flex items-center justify-center">
             <img src="https://picsum.photos/seed/einstein/200/200" alt="Einstein" className="w-full h-full object-cover grayscale opacity-80" />
        </div>
        <div>
          <h2 className="font-bold text-white">Professor Einstein</h2>
          <p className="text-xs text-cyan-400 flex items-center gap-1">
            <Sparkles size={10} /> Online • Powered by Gemini 2.5
          </p>
        </div>
      </div>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-space-900/50"
      >
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-cyan-600' : 'bg-slate-700'}`}>
              {msg.role === 'user' ? <User size={14} /> : <span className="font-serif italic font-bold">E</span>}
            </div>
            <div 
              className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-cyan-900/50 text-cyan-50 border border-cyan-800' 
                  : 'bg-space-700 text-slate-100 border border-space-600'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
           <div className="flex items-start gap-3">
             <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center shrink-0">
                <span className="font-serif italic font-bold">E</span>
             </div>
             <div className="bg-space-700 px-4 py-3 rounded-2xl border border-space-600">
               <div className="flex gap-1">
                 <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                 <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                 <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
               </div>
             </div>
           </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 bg-space-800 border-t border-space-700">
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about time dilation, mass increase..."
            className="flex-1 bg-space-900 border border-space-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors"
          />
          <Button type="submit" variant="primary" disabled={loading || !input.trim()}>
            <Send size={18} />
          </Button>
        </form>
      </div>
    </div>
  );
};