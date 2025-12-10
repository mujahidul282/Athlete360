import React, { useState, useEffect } from 'react';
import { GeminiService } from '../services/geminiService';
import { MockBackend } from '../services/mockDataService';
import { TrainingSession, AthleteProfile } from '../types';
import { Dumbbell, Clock, PlayCircle, RefreshCw, Zap, CheckCircle } from 'lucide-react';

const TrainingCenter: React.FC = () => {
    const [plan, setPlan] = useState<TrainingSession[]>([]);
    const [loading, setLoading] = useState(false);
    const [profile, setProfile] = useState<AthleteProfile | null>(null);

    useEffect(() => {
        MockBackend.getAthleteProfile().then(setProfile);
    }, []);

    const generatePlan = async () => {
        if (!profile) return;
        setLoading(true);
        try {
            const newPlan = await GeminiService.generateTrainingPlan(profile.sport);
            setPlan(newPlan);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                        <Dumbbell className="text-emerald-500" /> AI Training Coach
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400">Personalized sessions for {profile?.sport}</p>
                </div>
                <button 
                    onClick={generatePlan} 
                    disabled={loading}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-emerald-200 dark:shadow-none disabled:opacity-50"
                >
                    {loading ? <RefreshCw className="animate-spin" /> : <Zap />}
                    {plan.length > 0 ? 'Regenerate Plan' : 'Generate Weekly Plan'}
                </button>
            </div>

            {plan.length === 0 && !loading && (
                <div className="bg-white dark:bg-slate-800 rounded-xl p-12 text-center border-2 border-dashed border-slate-200 dark:border-slate-700">
                    <Dumbbell size={48} className="mx-auto text-slate-300 mb-4" />
                    <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300">No Active Training Plan</h3>
                    <p className="text-slate-500 mb-6">Ask the AI Coach to build a specific routine for your goals.</p>
                </div>
            )}

            {loading && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[1,2,3].map(i => (
                        <div key={i} className="bg-white dark:bg-slate-800 h-64 rounded-xl animate-pulse" />
                    ))}
                </div>
            )}

            <div className="grid grid-cols-1 gap-8">
                {plan.map((session, index) => (
                    <div key={index} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
                        <div className="bg-slate-50 dark:bg-slate-700/50 p-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-bold text-slate-800 dark:text-white">{session.day}</h3>
                                <p className="text-emerald-600 font-medium text-sm">{session.focus}</p>
                            </div>
                            <div className="flex items-center gap-2 text-slate-500 text-sm">
                                <Clock size={16} /> {session.estimatedDuration} mins
                            </div>
                        </div>
                        <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {session.drills.map((drill, dIndex) => (
                                <div key={dIndex} className="group relative rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
                                    <div className="aspect-video bg-slate-200 dark:bg-slate-800 relative">
                                        <img 
                                            src={drill.imageUrl} 
                                            alt={drill.name} 
                                            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" 
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1517836357463-c25dfe94c0de?auto=format&fit=crop&q=80&w=800';
                                            }}
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
                                            <PlayCircle className="text-white" size={32} />
                                        </div>
                                    </div>
                                    <div className="p-3">
                                        <div className="flex justify-between items-start mb-1">
                                            <h4 className="font-semibold text-slate-800 dark:text-white text-sm">{drill.name}</h4>
                                            <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                                                drill.category === 'Physical' ? 'bg-red-100 text-red-600' :
                                                drill.category === 'Technical' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'
                                            }`}>{drill.category}</span>
                                        </div>
                                        <p className="text-xs text-slate-500 line-clamp-2 mb-2">{drill.instructions}</p>
                                        <div className="text-xs font-mono text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800 p-1.5 rounded text-center border border-slate-200 dark:border-slate-700">
                                            {drill.durationMin} mins
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TrainingCenter;