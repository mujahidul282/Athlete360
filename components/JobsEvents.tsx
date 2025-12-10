import React, { useState, useEffect } from 'react';
import { MockBackend } from '../services/mockDataService';
import { JobOpportunity, Tournament } from '../types';
import { Briefcase, MapPin, Calendar, Building2, Trophy, IndianRupee } from 'lucide-react';

const JobsEvents: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'jobs' | 'events'>('jobs');
    const [jobs, setJobs] = useState<JobOpportunity[]>([]);
    const [events, setEvents] = useState<Tournament[]>([]);

    useEffect(() => {
        MockBackend.getJobs().then(setJobs);
        MockBackend.getTournaments().then(setEvents);
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex bg-white dark:bg-slate-800 p-1 rounded-xl w-fit border border-slate-200 dark:border-slate-700">
                <button 
                    onClick={() => setActiveTab('jobs')}
                    className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'jobs' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
                >
                    Jobs & Recruitment
                </button>
                <button 
                    onClick={() => setActiveTab('events')}
                    className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'events' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
                >
                    Tournaments & Events
                </button>
            </div>

            {activeTab === 'jobs' ? (
                <div className="grid gap-4">
                     <h3 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                        <Briefcase className="text-blue-500" /> Sports Quota Opportunities
                     </h3>
                    {jobs.map(job => (
                        <div key={job.id} className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-emerald-200 dark:hover:border-emerald-800 transition-colors">
                            <div>
                                <h4 className="font-bold text-lg text-slate-800 dark:text-white">{job.title}</h4>
                                <div className="flex flex-wrap gap-4 mt-2 text-sm text-slate-600 dark:text-slate-400">
                                    <span className="flex items-center gap-1"><Building2 size={16}/> {job.organization}</span>
                                    <span className="flex items-center gap-1"><MapPin size={16}/> {job.location}</span>
                                    <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium"><IndianRupee size={16}/> {job.salaryRange}</span>
                                </div>
                                <div className="mt-3 flex gap-2">
                                    <span className={`px-2 py-1 rounded text-xs border ${job.type === 'Government' ? 'bg-orange-50 border-orange-200 text-orange-700' : 'bg-blue-50 border-blue-200 text-blue-700'}`}>
                                        {job.type}
                                    </span>
                                    <span className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                                        Elig: {job.eligibility}
                                    </span>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-red-500 mb-2">Apply by {job.deadline}</p>
                                <button className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-2 rounded-lg text-sm font-semibold">Apply Now</button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="grid gap-4">
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                        <Trophy className="text-amber-500" /> Upcoming Tournaments
                     </h3>
                    {events.map(event => (
                        <div key={event.id} className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-amber-100 to-transparent -mr-8 -mt-8 rounded-full opacity-50 dark:opacity-10 group-hover:scale-150 transition-transform duration-500"/>
                            <div className="flex flex-col md:flex-row justify-between items-start relative z-10 gap-4">
                                <div>
                                    <h4 className="font-bold text-lg text-slate-800 dark:text-white">{event.name}</h4>
                                    <div className="flex flex-wrap gap-4 mt-2 text-sm text-slate-600 dark:text-slate-400">
                                        <span className="flex items-center gap-1"><Calendar size={16}/> {event.date}</span>
                                        <span className="flex items-center gap-1"><MapPin size={16}/> {event.location}</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-bold text-amber-500">{event.prizePool}</p>
                                    <p className="text-xs text-slate-400">Prize Pool</p>
                                </div>
                            </div>
                            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center">
                                <p className="text-sm text-slate-500">Entry: <span className="font-semibold text-slate-800 dark:text-white">{event.entryFee}</span></p>
                                <button className="text-emerald-600 font-semibold text-sm hover:underline">Register &rarr;</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default JobsEvents;