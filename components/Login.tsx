import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MockBackend } from '../services/mockDataService';
import { Lock, Mail, Loader2, ArrowRight } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await MockBackend.login(email, password);
      onLogin(); // Update parent state
      navigate('/');
    } catch (err) {
      setError('Invalid credentials. For demo, use: demo@athlete360.com / password');
    } finally {
      setLoading(false);
    }
  };

  const images = [
    { src: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&q=80&w=800", alt: "Cricket" },
    { src: "https://images.unsplash.com/photo-1579952363873-27f3bde9be51?auto=format&fit=crop&q=80&w=800", alt: "Football" },
    { src: "https://images.unsplash.com/photo-1517836357463-c25dfe94c0de?auto=format&fit=crop&q=80&w=800", alt: "Gym" },
    { src: "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&q=80&w=800", alt: "Basketball" },
    { src: "https://images.unsplash.com/photo-1552674605-40d5c68525d3?auto=format&fit=crop&q=80&w=800", alt: "Running" },
    { src: "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&q=80&w=800", alt: "Tennis" },
    { src: "https://images.unsplash.com/photo-1624526267942-ab0ff8a3e972?auto=format&fit=crop&q=80&w=800", alt: "Cricket Action" },
    { src: "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&q=80&w=800", alt: "Cycling" },
    { src: "https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&q=80&w=800", alt: "Swimming" },
    { src: "https://images.unsplash.com/photo-1544367563-12123d896889?auto=format&fit=crop&q=80&w=800", alt: "Yoga" },
    { src: "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?auto=format&fit=crop&q=80&w=800", alt: "Training" },
    { src: "https://images.unsplash.com/photo-1526676037777-05a232554f77?auto=format&fit=crop&q=80&w=800", alt: "Team Sport" },
  ];

  // TODO: Replace with the actual URL of the uploaded logo
  const LOGO_URL = "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"; 

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden bg-slate-900">
      
      {/* Expanded Sports Collage Background */}
      <div className="absolute inset-0 z-0 grid grid-cols-3 md:grid-cols-4 grid-rows-4 md:grid-rows-3 gap-0">
          {images.map((img, idx) => (
              <div key={idx} className="relative w-full h-full overflow-hidden">
                   <img 
                    src={img.src} 
                    className="w-full h-full object-cover opacity-50 hover:opacity-75 transition-all duration-700 hover:scale-110" 
                    alt={img.alt} 
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1517836357463-c25dfe94c0de?auto=format&fit=crop&q=80&w=800';
                    }}
                   />
              </div>
          ))}
      </div>

      {/* Gradient Overlay for Readability */}
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-slate-900 via-slate-900/85 to-slate-900/70 backdrop-blur-[2px]"></div>

      {/* Glassmorphic Login Card */}
      <div className="relative z-10 bg-white/10 dark:bg-black/40 backdrop-blur-xl rounded-3xl shadow-2xl p-8 w-full max-w-md border border-white/10 animate-slide-up">
        <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
                <img 
                    src={LOGO_URL} 
                    alt="Athlete360 Logo" 
                    className="w-24 h-24 object-contain drop-shadow-xl hover:scale-105 transition-transform duration-300"
                />
            </div>
            <h1 className="text-4xl font-bold text-white tracking-tight">Athlete360</h1>
            <p className="text-slate-300 mt-2 text-sm font-medium">The Next Gen Sports Platform</p>
        </div>

        {error && (
            <div className="bg-red-500/20 text-red-200 p-3 rounded-xl mb-6 text-sm text-center border border-red-500/30 backdrop-blur-md">
                {error}
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
            <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Email Address</label>
                <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-400 transition-colors" size={18} />
                    <input 
                        type="email" 
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 rounded-xl border border-white/10 bg-white/5 text-white placeholder-slate-500 focus:ring-2 focus:ring-emerald-500 focus:border-transparent focus:bg-white/10 outline-none transition-all"
                        placeholder="you@athlete360.com"
                    />
                </div>
            </div>

            <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Password</label>
                <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-400 transition-colors" size={18} />
                    <input 
                        type="password" 
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 rounded-xl border border-white/10 bg-white/5 text-white placeholder-slate-500 focus:ring-2 focus:ring-emerald-500 focus:border-transparent focus:bg-white/10 outline-none transition-all"
                        placeholder="••••••••"
                    />
                </div>
            </div>

            <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-xl transition-all transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/20"
            >
                {loading ? <Loader2 className="animate-spin" /> : <>Sign In <ArrowRight size={20} /></>}
            </button>
        </form>

        <div className="mt-8 text-center">
            <Link to="/onboarding" className="text-slate-300 hover:text-white text-sm font-medium transition-colors border-b border-transparent hover:border-white pb-0.5">
                Create new athlete profile
            </Link>
        </div>
        
        <div className="mt-8 pt-6 border-t border-white/10 text-center">
            <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-2">Demo Access</p>
            <code className="text-xs bg-black/30 text-emerald-400 px-3 py-1.5 rounded-md font-mono">demo@athlete360.com / password</code>
        </div>
      </div>
    </div>
  );
};

export default Login;