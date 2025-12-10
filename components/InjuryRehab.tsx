import React, { useEffect, useState } from 'react';
import { MockBackend } from '../services/mockDataService';
import { GeminiService } from '../services/geminiService';
import { InjuryRiskAssessment, InjuryRecord, MedicalReport } from '../types';
import { AlertCircle, CheckCircle, Brain, RefreshCw, FileText, Upload, Stethoscope, Phone } from 'lucide-react';

const InjuryRehab: React.FC = () => {
  const [assessment, setAssessment] = useState<InjuryRiskAssessment | null>(null);
  const [history, setHistory] = useState<InjuryRecord[]>([]);
  const [reports, setReports] = useState<MedicalReport[]>([]);
  const [loading, setLoading] = useState(false);

  const runAnalysis = async () => {
    setLoading(true);
    try {
      const logs = await MockBackend.getPerformanceLogs();
      const injuries = await MockBackend.getInjuryHistory();
      setHistory(injuries);
      const prediction = await MockBackend.predictInjuryRisk(logs, injuries);
      const aiResponse = await GeminiService.explainInjuryRisk(prediction.score, prediction.factors, logs);
      setAssessment({
        riskScore: prediction.score,
        riskLevel: prediction.score > 0.7 ? 'High' : prediction.score > 0.4 ? 'Moderate' : 'Low',
        factors: prediction.factors,
        explanation: aiResponse.explanation || "Analysis unavailable.",
      });
      const medReports = await MockBackend.getMedicalReports();
      setReports(medReports);
    } catch (error) {
      console.error("Analysis failed", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { runAnalysis(); }, []);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Injury Risk & Rehabilitation</h2>
        <button onClick={runAnalysis} disabled={loading} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50">
            {loading ? <RefreshCw className="animate-spin" size={18} /> : <Brain size={18} />}
            <span>Re-Analyze</span>
        </button>
      </div>

      {assessment && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className={`p-6 rounded-xl border-l-4 shadow-sm bg-white dark:bg-slate-800 ${
                assessment.riskLevel === 'High' ? 'border-red-500' : 
                assessment.riskLevel === 'Moderate' ? 'border-yellow-500' : 'border-green-500'
            }`}>
                <h3 className="text-slate-500 dark:text-slate-400 font-medium mb-1">Predictive Risk Score</h3>
                <div className="flex items-end gap-2">
                    <span className={`text-4xl font-bold ${
                        assessment.riskLevel === 'High' ? 'text-red-500' : 
                        assessment.riskLevel === 'Moderate' ? 'text-yellow-500' : 'text-green-500'
                    }`}>
                        {(assessment.riskScore * 100).toFixed(0)}%
                    </span>
                    <span className="text-slate-400 mb-1">{assessment.riskLevel} Risk</span>
                </div>
            </div>
            <div className="md:col-span-2 bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6 rounded-xl shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10"><Brain size={100} /></div>
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2"><Brain size={20} className="text-emerald-400"/> AI Analysis</h3>
                <p className="text-slate-300 leading-relaxed">{assessment.explanation}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                    {assessment.factors.map((f, i) => (<span key={i} className="px-3 py-1 bg-white/10 rounded-full text-xs text-emerald-200 border border-white/10">{f}</span>))}
                </div>
            </div>
        </div>
      )}

      {/* Medical Reports Section */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <FileText className="text-blue-500" /> Medical Reports & Diagnosis
            </h3>
            <button className="text-sm bg-slate-100 dark:bg-slate-700 px-3 py-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 flex items-center gap-2">
                <Upload size={16}/> Upload Report
            </button>
          </div>
          
          <div className="grid gap-4">
              {reports.map(rep => (
                  <div key={rep.id} className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 bg-slate-50 dark:bg-slate-900/50">
                      <div className="flex justify-between items-start">
                          <div>
                              <h4 className="font-bold text-slate-800 dark:text-white">{rep.title}</h4>
                              <p className="text-emerald-600 text-sm font-medium">{rep.diagnosis}</p>
                              <p className="text-xs text-slate-500 mt-1">{rep.date}</p>
                          </div>
                          <div className="text-right text-sm">
                              <div className="flex items-center justify-end gap-1 text-slate-700 dark:text-slate-300">
                                  <Stethoscope size={14}/> {rep.doctor.name}
                              </div>
                              <p className="text-xs text-slate-500">{rep.doctor.hospital}</p>
                              <div className="flex items-center justify-end gap-1 text-slate-500 text-xs mt-1">
                                  <Phone size={12}/> {rep.doctor.contact}
                              </div>
                          </div>
                      </div>
                      {rep.recoveryPlan && (
                          <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700">
                              <p className="text-xs font-semibold text-slate-500 uppercase mb-2">Recovery Protocol</p>
                              <div className="flex flex-wrap gap-2">
                                  {rep.recoveryPlan.map((step, i) => (
                                      <span key={i} className="px-2 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-xs">
                                          {step}
                                      </span>
                                  ))}
                              </div>
                          </div>
                      )}
                  </div>
              ))}
          </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-6">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Injury History</h3>
        <div className="space-y-4">
            {history.map(injury => (
                <div key={injury.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/30 rounded-lg border border-slate-100 dark:border-slate-700">
                    <div className="flex items-start gap-4">
                        <div className={`mt-1 ${injury.status === 'Resolved' ? 'text-green-500' : 'text-orange-500'}`}>
                            {injury.status === 'Resolved' ? <CheckCircle size={20}/> : <AlertCircle size={20}/>}
                        </div>
                        <div>
                            <h4 className="font-semibold text-slate-800 dark:text-slate-200">{injury.area}</h4>
                            <p className="text-sm text-slate-500">{injury.date} • Severity: {injury.severity}</p>
                        </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        injury.status === 'Active' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' : 
                        injury.status === 'Recovering' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 
                        'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    }`}>
                        {injury.status}
                    </span>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default InjuryRehab;