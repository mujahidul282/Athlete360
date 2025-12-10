import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MockBackend } from '../services/mockDataService';
import { UserRole, AthleteProfile } from '../types';
import { User, Activity, Heart, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';

interface OnboardingProps {
    onLogin: () => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onLogin }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState<Partial<AthleteProfile>>({
    role: UserRole.ATHLETE,
    avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${Date.now()}`,
    medical: {
        allergies: 'None',
        conditions: 'None',
        bloodGroup: 'Unknown',
        lastCheckup: new Date().toISOString().split('T')[0]
    }
  });

  const [password, setPassword] = useState('');

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateMedical = (field: string, value: any) => {
      setFormData(prev => ({
          ...prev,
          medical: { ...prev.medical!, [field]: value }
      }));
  }

  const handleFinish = async () => {
    setLoading(true);
    try {
        const fullProfile = {
            ...formData,
            id: `u_${Date.now()}`,
            password: password || 'password', // In real app, hash this
        } as AthleteProfile;

        await MockBackend.register(fullProfile);
        onLogin();
        navigate('/');
    } catch (e) {
        console.error(e);
        alert("Something went wrong creating your profile.");
    } finally {
        setLoading(false);
    }
  };

  const steps = [
    { title: "Personal", icon: <User size={20}/> },
    { title: "Sport", icon: <Activity size={20}/> },
    { title: "Medical", icon: <Heart size={20}/> },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center p-4">
        {/* Progress Bar */}
        <div className="w-full max-w-2xl mb-8">
            <div className="flex justify-between relative z-10">
                {steps.map((s, i) => (
                    <div key={i} className="flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                            step > i + 1 ? 'bg-emerald-600 text-white' : 
                            step === i + 1 ? 'bg-emerald-600 text-white shadow-lg ring-4 ring-emerald-100 dark:ring-emerald-900' : 
                            'bg-slate-200 dark:bg-slate-700 text-slate-400'
                        }`}>
                            {step > i + 1 ? <CheckCircle size={20}/> : s.icon}
                        </div>
                        <span className="mt-2 text-xs font-medium text-slate-600 dark:text-slate-400">{s.title}</span>
                    </div>
                ))}
            </div>
            <div className="absolute top-[4.5rem] left-0 w-full h-1 bg-slate-200 dark:bg-slate-800 -z-0 hidden sm:block">
                 {/* Decorative line bar could go here properly positioned */}
            </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col min-h-[500px]">
            <div className="p-8 flex-1">
                {step === 1 && (
                    <div className="space-y-6 animate-fade-in">
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Let's get to know you</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="label">Full Name</label>
                                <input type="text" className="input-field" value={formData.name || ''} onChange={(e) => updateField('name', e.target.value)} placeholder="John Doe" />
                            </div>
                            <div>
                                <label className="label">Email Address</label>
                                <input type="email" className="input-field" value={formData.email || ''} onChange={(e) => updateField('email', e.target.value)} placeholder="john@example.com" />
                            </div>
                            <div>
                                <label className="label">Password</label>
                                <input type="password" className="input-field" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Create a strong password" />
                            </div>
                            <div>
                                <label className="label">Age</label>
                                <input type="number" className="input-field" value={formData.age || ''} onChange={(e) => updateField('age', parseInt(e.target.value))} />
                            </div>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-6 animate-fade-in">
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Your Athletic Profile</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="label">Primary Sport</label>
                                <input type="text" className="input-field" value={formData.sport || ''} onChange={(e) => updateField('sport', e.target.value)} placeholder="e.g. Cricket, Athletics" />
                            </div>
                            <div>
                                <label className="label">Role / Position</label>
                                <input type="text" className="input-field" value={formData.role === UserRole.ATHLETE ? '' : formData.role} onChange={(e) => updateField('role', e.target.value)} placeholder="e.g. Bowler, Sprinter" />
                            </div>
                            <div>
                                <label className="label">Height (cm)</label>
                                <input type="number" className="input-field" value={formData.heightCm || ''} onChange={(e) => updateField('heightCm', parseInt(e.target.value))} />
                            </div>
                            <div>
                                <label className="label">Weight (kg)</label>
                                <input type="number" className="input-field" value={formData.weightKg || ''} onChange={(e) => updateField('weightKg', parseInt(e.target.value))} />
                            </div>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-6 animate-fade-in">
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Medical & Health</h2>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="label">Blood Group</label>
                                <select className="input-field" value={formData.medical?.bloodGroup} onChange={(e) => updateMedical('bloodGroup', e.target.value)}>
                                    <option>A+</option><option>A-</option><option>B+</option><option>B-</option><option>O+</option><option>O-</option><option>AB+</option><option>AB-</option>
                                </select>
                            </div>
                            <div>
                                <label className="label">Last Physical Checkup</label>
                                <input type="date" className="input-field" value={formData.medical?.lastCheckup} onChange={(e) => updateMedical('lastCheckup', e.target.value)} />
                            </div>
                            <div className="md:col-span-2">
                                <label className="label">Known Allergies</label>
                                <textarea className="input-field h-20" value={formData.medical?.allergies} onChange={(e) => updateMedical('allergies', e.target.value)} placeholder="List any allergies..." />
                            </div>
                            <div className="md:col-span-2">
                                <label className="label">Existing Conditions / Previous Major Injuries</label>
                                <textarea className="input-field h-24" value={formData.medical?.conditions} onChange={(e) => updateMedical('conditions', e.target.value)} placeholder="Describe any relevant medical history..." />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Footer Buttons */}
            <div className="p-6 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                {step > 1 ? (
                    <button onClick={() => setStep(s => s - 1)} className="text-slate-500 hover:text-slate-800 dark:hover:text-white font-medium flex items-center gap-2">
                        <ArrowLeft size={18} /> Back
                    </button>
                ) : (
                    <button onClick={() => navigate('/login')} className="text-slate-500 hover:text-slate-800 dark:hover:text-white font-medium">
                        Cancel
                    </button>
                )}

                {step < 3 ? (
                    <button onClick={() => setStep(s => s + 1)} className="bg-slate-800 dark:bg-white text-white dark:text-slate-900 px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:opacity-90 transition-opacity">
                        Next Step <ArrowRight size={18} />
                    </button>
                ) : (
                    <button onClick={handleFinish} disabled={loading} className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200 dark:shadow-none">
                        {loading ? 'Creating Profile...' : 'Complete Setup'} <CheckCircle size={18} />
                    </button>
                )}
            </div>
        </div>

        <style>{`
            .label { @apply block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5; }
            .input-field { @apply w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all; }
        `}</style>
    </div>
  );
};

export default Onboarding;