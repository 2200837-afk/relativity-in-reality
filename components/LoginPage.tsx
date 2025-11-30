import React, { useState } from 'react';
import { Button } from './Button';
import { db } from '../services/databaseService';
import { UserProfile } from '../types';
import { Atom } from 'lucide-react';

interface LoginPageProps {
  onLoginSuccess: () => void;
  onSkip?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, onSkip }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    gender: 'Male',
    age: '',
    education: 'High School',
    country: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch('http://192.168.0.27:5000/login', {
        method: 'POST',
        credentials: 'include', // important for cookies
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.name,
          email: formData.email,
          gender: formData.gender,
          age: parseInt(formData.age),
          education: formData.education,
          country: formData.country,
          loginTime: Date.now()
        })
      });

      const data = await res.json();
      if (data.success) {
        onLoginSuccess(); // tells App.tsx the user is logged in
      } else {
        alert('Login failed');
      }
    } catch (err) {
      console.error(err);
      alert('Login failed, check backend');
    }
  };


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-space-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-space-800 rounded-2xl border border-space-700 shadow-2xl p-8 animate-in fade-in zoom-in-95 duration-500">
        
        <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-tr from-cyan-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-[0_0_25px_rgba(6,182,212,0.5)] mx-auto mb-4">
               <Atom size={40} className="text-white animate-spin-slow" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Relativity In Motion</h1>
            <p className="text-slate-400">Please complete your profile to begin the experience.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Full Name</label>
            <input 
              required
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-space-900 border border-space-600 rounded-lg px-4 py-3 text-white focus:border-cyan-500 focus:outline-none transition-colors"
              placeholder="Albert Einstein"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Email Address</label>
            <input 
              required
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-space-900 border border-space-600 rounded-lg px-4 py-3 text-white focus:border-cyan-500 focus:outline-none transition-colors"
              placeholder="albert@relativity.com"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Gender</label>
                <select 
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full bg-space-900 border border-space-600 rounded-lg px-4 py-3 text-white focus:border-cyan-500 focus:outline-none transition-colors"
                >
                    <option>Male</option>
                    <option>Female</option>
                    <option>Non-binary</option>
                    <option>Prefer not to say</option>
                </select>
             </div>
             <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Age</label>
                <input 
                  required
                  name="age"
                  type="number"
                  min="1"
                  max="120"
                  value={formData.age}
                  onChange={handleChange}
                  className="w-full bg-space-900 border border-space-600 rounded-lg px-4 py-3 text-white focus:border-cyan-500 focus:outline-none transition-colors"
                />
             </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Education Level</label>
            <select 
              name="education"
              value={formData.education}
              onChange={handleChange}
              className="w-full bg-space-900 border border-space-600 rounded-lg px-4 py-3 text-white focus:border-cyan-500 focus:outline-none transition-colors"
            >
                <option>High School</option>
                <option>Undergraduate</option>
                <option>Postgraduate</option>
                <option>PhD</option>
                <option>Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Country</label>
            <input 
              required
              name="country"
              type="text"
              value={formData.country}
              onChange={handleChange}
              className="w-full bg-space-900 border border-space-600 rounded-lg px-4 py-3 text-white focus:border-cyan-500 focus:outline-none transition-colors"
              placeholder="Switzerland"
            />
          </div>

          <Button type="submit" variant="primary" className="w-full mt-6 py-4 text-lg">
             Proceed to Learning Style &rarr;
          </Button>
          {onSkip && (
            <Button type="button" variant="outline" className="w-full mt-3" onClick={onSkip}>
              Skip & Continue as Guest/Tester
            </Button>
          )}
        </form>
      </div>
    </div>
  );
};
