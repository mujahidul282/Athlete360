import React, { useState, useRef, useEffect } from 'react';
import { GeminiService } from '../services/geminiService';
import { Bot, User, Sparkles, Zap, Activity, Utensils, ArrowRight, Loader2 } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
}

const AIAssistantPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: '1', 
      role: 'model', 
      text: "Hey champion! 🏆 I'm your personal AI sports architect. Whether it's crushing your 100m time, fixing your diet, or recovering from an injury, I've got the data. What's the focus today?" 
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (textToSend: string = input) => {
    if (!textToSend.trim() || loading) return;

    const userText = textToSend;
    setInput('');
    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: userText };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
        const history = messages.map(m => ({
            role: m.role,
            parts: [{ text: m.text }]
        }));

        const responseText = await GeminiService.chat(history, userText);
        
        const botMsg: Message = { 
            id: (Date.now() + 1).toString(), 
            role: 'model', 
            text: responseText || "My connection to the cloud is a bit foggy. Let's try that again." 
        };
        setMessages(prev => [...prev, botMsg]);
    } catch (error) {
        console.error(error);
    } finally {
        setLoading(false);
    }
  };

  const starterPrompts = [
    { icon: <Zap size={18} className="text-yellow-500"/>, text: "How do I improve my explosive power?" },
    { icon: <Utensils size={18} className="text-emerald-500"/>, text: "Create a high-protein veg meal plan." },
    { icon: <Activity size={18} className="text-red-500"/>, text: "My hamstrings feel tight after sprints." },
    { icon: <Bot size={18} className="text-blue-500"/>, text: "Analyze my recent performance trends." },
  ];

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col md:flex-row gap-6">
        {/* Chat Container */}
        <div className="flex-1 bg-white dark:bg-[#151e32] rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 flex flex-col overflow-hidden relative">
            
            {/* Header */}
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3 bg-white/50 dark:bg-[#151e32]/50 backdrop-blur-md sticky top-0 z-10">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-400 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                    <Sparkles size={20} className="text-white" />
                </div>
                <div>
                    <h1 className="font-bold text-lg text-slate-800 dark:text-white">Pro Coach AI</h1>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Online & Ready</p>
                    </div>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up`}>
                        {msg.role === 'model' && (
                            <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 border border-slate-200 dark:border-slate-700">
                                <Bot size={16} className="text-emerald-600 dark:text-emerald-400" />
                            </div>
                        )}
                        <div className={`max-w-[85%] md:max-w-[70%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                            msg.role === 'user' 
                            ? 'bg-gradient-to-br from-emerald-600 to-teal-600 text-white rounded-tr-none' 
                            : 'bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 border border-slate-100 dark:border-slate-700 rounded-tl-none'
                        }`}>
                            {msg.text.split('\n').map((line, i) => (
                                <p key={i} className="mb-1 last:mb-0">{line}</p>
                            ))}
                        </div>
                        {msg.role === 'user' && (
                            <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center shrink-0">
                                <User size={16} className="text-slate-600 dark:text-slate-300" />
                            </div>
                        )}
                    </div>
                ))}
                {loading && (
                     <div className="flex gap-4 justify-start animate-pulse">
                        <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                            <Bot size={16} className="text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-800/80 p-4 rounded-2xl rounded-tl-none border border-slate-100 dark:border-slate-700 flex items-center gap-2">
                            <Loader2 className="animate-spin text-emerald-500" size={16} />
                            <span className="text-xs text-slate-500">Thinking...</span>
                        </div>
                     </div>
                )}
                <div ref={scrollRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white dark:bg-[#151e32] border-t border-slate-100 dark:border-slate-800">
                {/* Starter Chips (Only show if few messages) */}
                {messages.length < 3 && (
                    <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
                        {starterPrompts.map((prompt, idx) => (
                            <button 
                                key={idx} 
                                onClick={() => handleSend(prompt.text)}
                                className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-2 rounded-full text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:border-emerald-200 dark:hover:border-emerald-800 transition-all whitespace-nowrap"
                            >
                                {prompt.icon} {prompt.text}
                            </button>
                        ))}
                    </div>
                )}

                <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="relative flex items-center gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask anything about your game..."
                        className="w-full bg-slate-100 dark:bg-slate-900/50 text-slate-800 dark:text-slate-100 rounded-2xl pl-6 pr-14 py-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all placeholder:text-slate-400"
                    />
                    <button 
                        type="submit" 
                        disabled={loading || !input.trim()}
                        className="absolute right-2 bg-emerald-600 hover:bg-emerald-500 text-white p-2.5 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-600/20"
                    >
                        <ArrowRight size={20} />
                    </button>
                </form>
            </div>
        </div>

        {/* Sidebar Info (Desktop Only) */}
        <div className="hidden lg:block w-80 space-y-6">
            <div className="bg-gradient-to-br from-indigo-600 to-violet-600 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden group">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all"></div>
                <h3 className="font-bold text-xl mb-2">Pro Level Access</h3>
                <p className="text-indigo-100 text-sm mb-4">You have full access to the AI Coach. Ask for detailed drills, video analysis, or mental conditioning tips.</p>
                <div className="flex items-center gap-2 text-xs font-mono bg-black/20 w-fit px-3 py-1 rounded-full">
                    <Activity size={12} className="text-green-400" /> SYSTEM NORMAL
                </div>
            </div>

            <div className="bg-white dark:bg-[#151e32] rounded-3xl p-6 shadow-lg border border-slate-100 dark:border-slate-800">
                <h3 className="font-bold text-slate-800 dark:text-white mb-4">Suggested Topics</h3>
                <div className="space-y-3">
                    {['Recovery Protocols', 'Mental Toughness', 'Advanced Plyometrics', 'Sleep Optimization'].map((topic, i) => (
                        <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer group transition-colors" onClick={() => handleSend(`Tell me about ${topic}`)}>
                            <span className="text-sm text-slate-600 dark:text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">{topic}</span>
                            <ArrowRight size={14} className="text-slate-300 group-hover:text-emerald-500 opacity-0 group-hover:opacity-100 transition-all transform -translate-x-2 group-hover:translate-x-0" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
  );
};

export default AIAssistantPage;