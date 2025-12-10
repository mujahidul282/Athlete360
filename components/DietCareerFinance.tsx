import React, { useEffect, useState } from 'react';
import { MockBackend } from '../services/mockDataService';
import { GeminiService } from '../services/geminiService';
import { DietLog, DietAnalysis, FinancialRecord, CareerGoal, CoachingGig } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { CheckCircle, Circle, DollarSign, Target, Utensils, Users, IndianRupee } from 'lucide-react';

const DietSection: React.FC = () => {
  const [logs, setLogs] = useState<DietLog[]>([]);
  const [analysis, setAnalysis] = useState<DietAnalysis | null>(null);

  useEffect(() => {
    MockBackend.getDietLogs().then(async (data) => {
        setLogs(data);
        const result = await GeminiService.analyzeDiet(data);
        setAnalysis(result);
    });
  }, []);

  const data = [
    { name: 'Protein', value: logs.reduce((a,b) => a + b.protein, 0) },
    { name: 'Carbs', value: logs.reduce((a,b) => a + b.carbs, 0) },
    { name: 'Fats', value: logs.reduce((a,b) => a + b.fats, 0) },
  ];
  const COLORS = ['#10b981', '#3b82f6', '#f59e0b'];

  return (
    <div className="space-y-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-slate-800 dark:text-white">
                <Utensils className="text-emerald-500"/> Nutrition & Meal Planning
            </h3>
            
            <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-1/3 h-48">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie data={data} innerRadius={50} outerRadius={70} paddingAngle={5} dataKey="value">
                                {data.map((entry, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                <div className="w-full md:w-2/3">
                    {analysis ? (
                        <div className="bg-slate-50 dark:bg-slate-700/30 p-4 rounded-lg">
                            <p className="font-semibold text-slate-800 dark:text-slate-200">Diet Status: {analysis.status}</p>
                            <p className="text-sm text-slate-500 mb-2">{analysis.macroBalance}</p>
                            <ul className="text-sm space-y-1">
                                {analysis.recommendations.map((rec, i) => (
                                    <li key={i} className="flex items-start gap-2 text-slate-600 dark:text-slate-300">
                                        <span className="text-emerald-500">•</span> {rec}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ) : <p>Loading analysis...</p>}
                </div>
            </div>
            
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                {['Breakfast', 'Lunch', 'Dinner'].map(mealType => (
                    <div key={mealType} className="border border-slate-200 dark:border-slate-700 rounded-lg p-3">
                        <h4 className="font-semibold text-slate-700 dark:text-slate-300 mb-2">{mealType}</h4>
                        <ul className="text-sm text-slate-500">
                             {logs.filter(l => l.meal === mealType).map(l => (
                                 <li key={l.id}>{l.description} ({l.calories} cal)</li>
                             ))}
                             {logs.filter(l => l.meal === mealType).length === 0 && <li>Not logged</li>}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    </div>
  );
};

const FinanceCareerSection: React.FC = () => {
    const [finances, setFinances] = useState<FinancialRecord[]>([]);
    const [goals, setGoals] = useState<CareerGoal[]>([]);
    const [gigs, setGigs] = useState<CoachingGig[]>([]);
    const [advice, setAdvice] = useState<string>('');

    useEffect(() => {
        Promise.all([MockBackend.getFinancialRecords(), MockBackend.getCareerGoals(), MockBackend.getCoachingGigs()])
            .then(async ([fData, gData, gigsData]) => {
                setFinances(fData);
                setGoals(gData);
                setGigs(gigsData);
                const aiAdvice = await GeminiService.analyzeFinances(fData);
                setAdvice(aiAdvice || '');
            });
    }, []);

    const income = finances.filter(f => f.type === 'Income').reduce((a,b) => a + b.amount, 0);
    const expense = finances.filter(f => f.type === 'Expense').reduce((a,b) => a + b.amount, 0);

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Career Goals */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-slate-800 dark:text-white">
                        <Target className="text-blue-500"/> Goals
                    </h3>
                    <div className="space-y-3">
                        {goals.map(g => (
                            <div key={g.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg">
                                <div className="flex items-center gap-3">
                                    {g.status === 'Achieved' ? <CheckCircle className="text-green-500" size={18}/> : <Circle className="text-slate-400" size={18}/>}
                                    <span className={g.status === 'Achieved' ? 'line-through text-slate-400' : 'text-slate-700 dark:text-slate-200'}>{g.title}</span>
                                </div>
                                <span className="text-xs bg-white dark:bg-slate-600 px-2 py-1 rounded text-slate-500 dark:text-slate-300">{g.targetDate}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Financial Overview */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-slate-800 dark:text-white">
                        <DollarSign className="text-emerald-500"/> Finances
                    </h3>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                            <p className="text-xs text-emerald-600 dark:text-emerald-400">Income</p>
                            <p className="text-lg font-bold text-emerald-700 dark:text-emerald-300">₹{income}</p>
                        </div>
                        <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                            <p className="text-xs text-red-600 dark:text-red-400">Expenses</p>
                            <p className="text-lg font-bold text-red-700 dark:text-red-300">₹{expense}</p>
                        </div>
                    </div>
                    {advice && (
                        <div className="text-sm text-slate-600 dark:text-slate-300 italic border-l-2 border-emerald-500 pl-3">
                            "Gemini Tip: {advice}"
                        </div>
                    )}
                </div>
            </div>

            {/* Coaching Gigs */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-slate-800 dark:text-white">
                    <Users className="text-purple-500"/> Personal Coaching Opportunities
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {gigs.map(gig => (
                        <div key={gig.id} className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                            <div className="flex justify-between items-start mb-2">
                                <h4 className="font-bold text-slate-800 dark:text-white">{gig.clientName}</h4>
                                <span className="text-emerald-600 font-semibold text-sm flex items-center"><IndianRupee size={12}/> {gig.rate}</span>
                            </div>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">{gig.requirement}</p>
                            <p className="text-xs text-slate-400">{gig.location}</p>
                            <button className="mt-3 w-full py-1.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded text-xs font-semibold">Accept Request</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export { DietSection, FinanceCareerSection };