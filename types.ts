export enum UserRole {
  ATHLETE = 'ATHLETE',
  COACH = 'COACH',
  PHYSIO = 'PHYSIO'
}

export interface MedicalInfo {
  allergies: string;
  conditions: string;
  bloodGroup: string;
  lastCheckup: string;
}

export interface DoctorProfile {
  name: string;
  specialty: string;
  hospital: string;
  contact: string;
}

export interface MedicalReport {
  id: string;
  date: string;
  title: string;
  doctor: DoctorProfile;
  diagnosis: string;
  fileUrl?: string; // Simulated file path
  recoveryPlan?: string[];
}

export interface DeviceMetrics {
  heartRateResting: number;
  heartRateVariability: number;
  spO2: number; // Percentage
  sleepHours: number;
  sleepQuality: number; // 1-100
  vo2Max: number;
  steps: number;
  caloriesBurned: number;
  stressLevel: 'Low' | 'Moderate' | 'High';
}

export interface AthleteProfile {
  id: string;
  email?: string;
  password?: string;
  name: string;
  sport: string;
  age: number;
  heightCm: number;
  weightKg: number;
  role: UserRole;
  avatarUrl: string;
  medical?: MedicalInfo;
  bio?: string;
  deviceMetrics?: DeviceMetrics; // Added
}

export interface PerformanceLog {
  id: string;
  date: string;
  metric: string;
  value: number;
  unit: string;
  strain: number;
  durationMin: number;
}

export interface InjuryRecord {
  id: string;
  date: string;
  area: string;
  severity: 'Low' | 'Medium' | 'High';
  status: 'Active' | 'Recovering' | 'Resolved';
  painLevel: number;
}

export interface DietLog {
  id: string;
  date: string;
  meal: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  description: string;
}

export interface FinancialRecord {
  id: string;
  date: string;
  type: 'Income' | 'Expense';
  category: string;
  amount: number;
  description: string;
}

export interface CareerGoal {
  id: string;
  title: string;
  targetDate: string;
  status: 'Pending' | 'In Progress' | 'Achieved';
}

// --- NEW TYPES ---

export interface TrainingDrill {
  id: string;
  name: string;
  category: 'Tactical' | 'Physical' | 'Technical';
  durationMin: number;
  reps?: string;
  imageUrl: string; // Placeholder for video/image
  instructions: string;
}

export interface TrainingSession {
  day: string;
  focus: string;
  drills: TrainingDrill[];
  estimatedDuration: number;
}

export interface Tournament {
  id: string;
  name: string;
  date: string;
  location: string;
  prizePool: string;
  entryFee: string;
  registrationDeadline: string;
}

export interface JobOpportunity {
  id: string;
  title: string;
  organization: string; // e.g., "Indian Railways", "Army"
  type: 'Government' | 'Private' | 'Coaching';
  location: string;
  salaryRange: string;
  eligibility: string;
  deadline: string;
}

export interface CoachingGig {
  id: string;
  clientName: string;
  requirement: string;
  rate: string; // e.g., "₹500/hr"
  location: string;
}

// AI Analysis Types
export interface InjuryRiskAssessment {
  riskScore: number;
  riskLevel: 'Low' | 'Moderate' | 'High' | 'Critical';
  factors: string[];
  explanation: string;
}

export interface DietAnalysis {
  status: 'Optimal' | 'Needs Improvement' | 'Poor';
  macroBalance: string;
  recommendations: string[];
}