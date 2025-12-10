import React, { useState, useEffect } from 'react';
import { MockBackend } from '../services/mockDataService';
import { DeviceMetrics as MetricsType } from '../types';
import { Heart, Activity, Moon, Wind, Flame, Watch, Footprints } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, XAxis, Tooltip } from 'recharts';

const DeviceMetrics: React.FC = () => {
    const [metrics, setMetrics] = useState<MetricsType | null>(null);

    useEffect(() => {
        MockBackend.getAthleteProfile().then(p => {
            if (p.deviceMetrics) setMetrics(p.deviceMetrics);
        });
    }, []);

    // Mock trend data for the chart
    const trendData = [
        { time: '06:00', hr: 55 }, { time: '09:00', hr: 85 }, { time: '12:00', hr: 72 },
        { time: '15:00', hr: 90 }, { time: '18:00', hr: 145 }, { time: '21:00', hr: 65 }
    ];

    if (!metrics) return <div>Syncing device...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                    <Watch className="text-blue-500" /> Device Telemetry
                </h2>
                <div className="flex items-center gap-2 text-sm text-green-500">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"/> Live Sync
                </div>
            </div>

            {/* Main Vitals Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-rose-50 dark:bg-rose-900/20 p-4 rounded-xl border border-rose-100 dark:border-rose-900/30">
                    <div className="flex items-center gap-2 text-rose-600 mb-2">
                        <Heart size={18} /> <span className="text-sm font-medium">Resting HR</span>
                    </div>
                    <p className="text-2xl font-bold text-slate-800 dark:text-white">{metrics.heartRateResting} <span className="text-sm font-normal text-slate-500">bpm</span></p>
                </div>
                <div className="bg-sky-50 dark:bg-sky-900/20 p-4 rounded-xl border border-sky-100 dark:border-sky-900/30">
                    <div className="flex items-center gap-2 text-sky-600 mb-2">
                        <Wind size={18} /> <span className="text-sm font-medium">SpO2</span>
                    </div>
                    <p className="text-2xl font-bold text-slate-800 dark:text-white">{metrics.spO2}%</p>
                </div>
                <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-xl border border-indigo-100 dark:border-indigo-900/30">
                    <div className="flex items-center gap-2 text-indigo-600 mb-2">
                        <Moon size={18} /> <span className="text-sm font-medium">Sleep</span>
                    </div>
                    <p className="text-2xl font-bold text-slate-800 dark:text-white">{metrics.sleepHours}h <span className="text-sm font-normal text-slate-500">({metrics.sleepQuality}%)</span></p>
                </div>
                <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-xl border border-orange-100 dark:border-orange-900/30">
                    <div className="flex items-center gap-2 text-orange-600 mb-2">
                        <Activity size={18} /> <span className="text-sm font-medium">VO2 Max</span>
                    </div>
                    <p className="text-2xl font-bold text-slate-800 dark:text-white">{metrics.vo2Max}</p>
                </div>
            </div>

            {/* Secondary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
                    <h3 className="font-semibold text-slate-800 dark:text-white mb-4">Heart Rate Trend (Today)</h3>
                    <div className="h-48 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={trendData}>
                                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none' }} />
                                <XAxis dataKey="time" hide />
                                <Line type="monotone" dataKey="hr" stroke="#e11d48" strokeWidth={3} dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col justify-center space-y-6">
                     <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="bg-slate-100 dark:bg-slate-700 p-3 rounded-full">
                                <Footprints className="text-slate-600 dark:text-slate-300" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">Steps Today</p>
                                <p className="text-xl font-bold text-slate-800 dark:text-white">{metrics.steps.toLocaleString()}</p>
                            </div>
                        </div>
                        <div className="radial-progress text-emerald-500 text-xs" style={{"--value":70} as any}>70%</div>
                     </div>

                     <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="bg-orange-100 dark:bg-orange-900/30 p-3 rounded-full">
                                <Flame className="text-orange-600 dark:text-orange-400" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">Calories Burned</p>
                                <p className="text-xl font-bold text-slate-800 dark:text-white">{metrics.caloriesBurned}</p>
                            </div>
                        </div>
                     </div>

                     <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-full">
                                <Activity className="text-purple-600 dark:text-purple-400" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">Stress Level</p>
                                <p className="text-xl font-bold text-slate-800 dark:text-white">{metrics.stressLevel}</p>
                            </div>
                        </div>
                     </div>
                </div>
            </div>
        </div>
    );
};

export default DeviceMetrics;