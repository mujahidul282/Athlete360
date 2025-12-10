import { AthleteProfile, PerformanceLog, InjuryRecord, DietLog, FinancialRecord, CareerGoal, UserRole, JobOpportunity, Tournament, MedicalReport, CoachingGig } from '../types';

// Fallback Seed Data (Only used if no profile exists at all)
const SEED_ATHLETE: AthleteProfile = {
  id: 'a1',
  email: 'demo@athlete360.com',
  password: 'password',
  name: 'Rohan Gupta',
  sport: 'Athletics (Sprints)',
  age: 22,
  heightCm: 178,
  weightKg: 72,
  role: UserRole.ATHLETE,
  avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
  medical: {
    allergies: 'None',
    conditions: 'None',
    bloodGroup: 'O+',
    lastCheckup: '2023-08-15'
  },
  deviceMetrics: {
    heartRateResting: 52,
    heartRateVariability: 65,
    spO2: 98,
    sleepHours: 7.5,
    sleepQuality: 85,
    vo2Max: 58,
    steps: 12500,
    caloriesBurned: 2800,
    stressLevel: 'Moderate'
  }
};

// --- DATA GENERATORS ---

const generatePerformanceLogs = (profile: AthleteProfile): PerformanceLog[] => {
    const sport = (profile.sport || '').toLowerCase();
    let metric = 'Workout Intensity';
    let unit = 'cal';
    let baseVal = 500;
    
    if (sport.includes('cricket')) {
        metric = 'Batting Session (Runs)';
        unit = 'runs';
        baseVal = 45;
    } else if (sport.includes('sprint') || sport.includes('athletic')) {
        metric = '100m Sprint';
        unit = 's';
        baseVal = 11.5;
    } else if (sport.includes('football') || sport.includes('soccer')) {
        metric = 'Distance Covered';
        unit = 'km';
        baseVal = 9.0;
    } else if (sport.includes('badminton') || sport.includes('tennis')) {
        metric = 'Rally Duration';
        unit = 'mins';
        baseVal = 40;
    } else if (sport.includes('weight') || sport.includes('lift')) {
        metric = 'Deadlift 1RM';
        unit = 'kg';
        baseVal = 140;
    }

    // Generate 7 days of logs
    return Array.from({length: 7}).map((_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i)); // Past 7 days
        
        // Add random variance
        const variance = (Math.random() - 0.5) * (baseVal * 0.15); 
        let value = baseVal + variance;
        
        // Lower is better for sprints
        if (unit === 's') value = Math.max(9.5, value); 
        
        return {
            id: `p-${Date.now()}-${i}`,
            date: date.toISOString().split('T')[0],
            metric: metric,
            value: parseFloat(value.toFixed(2)),
            unit: unit,
            strain: Math.floor(Math.random() * 4) + 6, // 6 to 10
            durationMin: 45 + Math.floor(Math.random() * 60)
        };
    });
};

const generateDietLogs = (profile: AthleteProfile): DietLog[] => {
    // Estimate Calorie Needs
    const maintenance = (profile.weightKg || 70) * 30; // Rough estimate
    const target = maintenance + 300; // Surplus for athletes
    
    const meals = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];
    return meals.map((meal, i) => ({
        id: `d-${i}`,
        date: new Date().toISOString().split('T')[0],
        meal: meal,
        calories: Math.floor(target / 4),
        protein: Math.floor((profile.weightKg || 70) * 0.5), // Spread protein
        carbs: Math.floor((target / 4) / 4),
        fats: Math.floor((target / 4) / 9),
        description: `Healthy ${profile.sport} specific ${meal.toLowerCase()}`
    }));
};

const generateJobs = (profile: AthleteProfile): JobOpportunity[] => {
    const s = profile.sport;
    return [
        { id: 'j1', title: `${s} Coach`, organization: 'Sports Authority of India', type: 'Government', location: 'New Delhi', salaryRange: '₹45,000 - ₹80,000', eligibility: 'National Level Participation', deadline: '2024-05-01' },
        { id: 'j2', title: 'Sports Quota Officer', organization: 'Indian Railways', type: 'Government', location: 'Mumbai', salaryRange: '₹50,000+', eligibility: 'State Medalist', deadline: '2024-04-15' },
        { id: 'j3', title: 'Head Coach', organization: 'Private Academy', type: 'Private', location: 'Bangalore', salaryRange: '₹60,000/mo', eligibility: 'Certified Coach', deadline: '2024-03-30' },
    ];
};

const generateTournaments = (profile: AthleteProfile): Tournament[] => {
    const s = profile.sport;
    return [
        { id: 't1', name: `National ${s} Championship`, date: '2024-06-10', location: 'Pune Balewadi Stadium', prizePool: '₹10,00,000', entryFee: '₹1000', registrationDeadline: '2024-05-20' },
        { id: 't2', name: `State Level ${s} Meet`, date: '2024-04-05', location: 'Local Sports Complex', prizePool: '₹50,000', entryFee: '₹200', registrationDeadline: '2024-03-25' },
    ];
};

// Helper to manage LocalStorage
const DB = {
  getItem: <T>(key: string, seed: T): T => {
    const stored = localStorage.getItem(key);
    if (!stored) {
      // Don't auto-save seed if we want to generate dynamically later
      // But for stability, we return seed if no other logic intercepts
      return seed;
    }
    return JSON.parse(stored);
  },
  setItem: (key: string, value: any) => {
    localStorage.setItem(key, JSON.stringify(value));
  },
  removeItem: (key: string) => localStorage.removeItem(key)
};

export const MockBackend = {
  // Auth Methods
  login: async (email: string, password: string): Promise<AthleteProfile> => {
    await new Promise(r => setTimeout(r, 600)); // Simulate net lag
    const profile = DB.getItem<AthleteProfile>('athlete_profile', SEED_ATHLETE);
    
    // Simple check (in production this would be secure)
    if (profile.email === email && profile.password === password) {
      return profile;
    }
    throw new Error('Invalid credentials');
  },

  register: async (profile: AthleteProfile): Promise<AthleteProfile> => {
    await new Promise(r => setTimeout(r, 800));
    
    // Save the new profile
    DB.setItem('athlete_profile', profile);

    // CRITICAL: Clear old session data so it regenerates for the new user
    DB.removeItem('logs_performance');
    DB.removeItem('logs_diet');
    DB.removeItem('jobs');
    DB.removeItem('tournaments');
    DB.removeItem('logs_injury');
    DB.removeItem('medical_reports');
    DB.removeItem('gigs');
    
    return profile;
  },

  updateProfile: async (updates: Partial<AthleteProfile>): Promise<AthleteProfile> => {
    const current = DB.getItem<AthleteProfile>('athlete_profile', SEED_ATHLETE);
    const updated = { ...current, ...updates };
    DB.setItem('athlete_profile', updated);
    return updated;
  },

  // Data Fetching Methods - Now with Dynamic Generation
  getAthleteProfile: async (): Promise<AthleteProfile> => {
    return new Promise(resolve => setTimeout(() => resolve(DB.getItem('athlete_profile', SEED_ATHLETE)), 200));
  },
  
  getPerformanceLogs: async (): Promise<PerformanceLog[]> => {
    await new Promise(r => setTimeout(r, 300));
    const stored = localStorage.getItem('logs_performance');
    if (stored) return JSON.parse(stored);

    // Generate fresh based on profile
    const profile = DB.getItem('athlete_profile', SEED_ATHLETE);
    const newLogs = generatePerformanceLogs(profile);
    DB.setItem('logs_performance', newLogs);
    return newLogs;
  },

  getInjuryHistory: async (): Promise<InjuryRecord[]> => {
    await new Promise(r => setTimeout(r, 300));
    const stored = localStorage.getItem('logs_injury');
    if (stored) return JSON.parse(stored);

    // Default empty or minimal history
    const seed: InjuryRecord[] = [{ 
        id: 'i1', date: '2023-11-15', area: 'General Fatigue', severity: 'Low', status: 'Resolved', painLevel: 1 
    }];
    DB.setItem('logs_injury', seed);
    return seed;
  },

  getMedicalReports: async (): Promise<MedicalReport[]> => {
      const stored = localStorage.getItem('medical_reports');
      if (stored) return JSON.parse(stored);
      return [];
  },

  addMedicalReport: async (report: MedicalReport): Promise<void> => {
      const current = await MockBackend.getMedicalReports();
      DB.setItem('medical_reports', [...current, report]);
  },

  getDietLogs: async (): Promise<DietLog[]> => {
    await new Promise(r => setTimeout(r, 300));
    const stored = localStorage.getItem('logs_diet');
    if (stored) return JSON.parse(stored);

    const profile = DB.getItem('athlete_profile', SEED_ATHLETE);
    const newLogs = generateDietLogs(profile);
    DB.setItem('logs_diet', newLogs);
    return newLogs;
  },

  getFinancialRecords: async (): Promise<FinancialRecord[]> => {
    // Keep finance simple/static for now or generate later
    const MOCK_FINANCE: FinancialRecord[] = [
        { id: 'f1', date: '2023-10-01', type: 'Income', category: 'Sponsorship', amount: 25000, description: 'Brand Deal' },
        { id: 'f2', date: '2023-10-05', type: 'Expense', category: 'Equipment', amount: 8000, description: 'Gear Upgrade' },
    ];
    return new Promise(resolve => setTimeout(() => resolve(MOCK_FINANCE), 500));
  },

  getCareerGoals: async (): Promise<CareerGoal[]> => {
    const MOCK_GOALS: CareerGoal[] = [
        { id: 'c1', title: 'Qualify for Nationals', targetDate: '2024-12-01', status: 'In Progress' },
    ];
    return new Promise(resolve => setTimeout(() => resolve(MOCK_GOALS), 500));
  },

  // New Data Methods
  getJobs: async (): Promise<JobOpportunity[]> => {
      await new Promise(r => setTimeout(r, 300));
      const stored = localStorage.getItem('jobs');
      if (stored) return JSON.parse(stored);

      const profile = DB.getItem('athlete_profile', SEED_ATHLETE);
      const newJobs = generateJobs(profile);
      DB.setItem('jobs', newJobs);
      return newJobs;
  },

  getTournaments: async (): Promise<Tournament[]> => {
      await new Promise(r => setTimeout(r, 300));
      const stored = localStorage.getItem('tournaments');
      if (stored) return JSON.parse(stored);

      const profile = DB.getItem('athlete_profile', SEED_ATHLETE);
      const newEvents = generateTournaments(profile);
      DB.setItem('tournaments', newEvents);
      return newEvents;
  },

  getCoachingGigs: async (): Promise<CoachingGig[]> => {
      const stored = localStorage.getItem('gigs');
      if (stored) return JSON.parse(stored);

      const SEED_GIGS: CoachingGig[] = [
        { id: 'g1', clientName: 'Local Club', location: 'City Stadium', rate: '₹1000/hr', requirement: 'Assistant for Junior Team.' }
      ];
      DB.setItem('gigs', SEED_GIGS);
      return SEED_GIGS;
  },

  // Simulated ML Endpoint
  predictInjuryRisk: async (logs: PerformanceLog[], injuries: InjuryRecord[]): Promise<{ score: number, factors: string[] }> => {
    const recentLogs = logs.slice(-5);
    if (recentLogs.length === 0) return { score: 0.1, factors: ["Insufficient Data"] };

    const avgStrain = recentLogs.reduce((acc, curr) => acc + curr.strain, 0) / recentLogs.length;
    const riskFactor = avgStrain > 8 ? 0.4 : 0.1;
    const activeInjuries = injuries.filter(i => i.status !== 'Resolved').length;
    
    let totalRisk = 0.2 + riskFactor + (activeInjuries * 0.25);
    totalRisk = Math.min(totalRisk, 0.99);

    return {
      score: totalRisk,
      factors: [
        avgStrain > 7.5 ? "High Recent Strain" : "Moderate Training Load",
        activeInjuries > 0 ? "Active Recovery in Progress" : "No Active Injuries",
        "Load Monotony Detected"
      ]
    };
  }
};