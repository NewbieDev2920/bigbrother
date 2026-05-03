export type DashboardKey = 'global' | 'contractor' | 'entity' | 'budget';

export interface DashboardMeta {
  key: DashboardKey;
  title: string;
  description: string;
  icon: string;
}

export const DASHBOARD_META: DashboardMeta[] = [
  {
    key: 'global',
    title: 'Global Dashboards',
    description: 'Distribution of contract values and types across all public procurement.',
    icon: 'BarChart3',
  },
  {
    key: 'contractor',
    title: 'Contractor Dashboard',
    description: 'Age, contract history, success rate, and execution timeline of the contractor.',
    icon: 'HardHat',
  },
  {
    key: 'entity',
    title: 'Public Entity Dashboard',
    description: 'Market concentration index and top contractors awarded by this entity.',
    icon: 'Building2',
  },
  {
    key: 'budget',
    title: 'Budget Estimation',
    description: 'Statistical model of expected contract value vs. actual awarded price.',
    icon: 'TrendingUp',
  },
];

// --- Global Dashboards ---
export interface GlobalDashboardData {
  contractValueHistogram: { range: string; count: number }[];
  contractTypeHistogram: { type: string; count: number }[];
}

// --- Contractor Dashboard ---
export interface ContractTimePoint {
  month: string;
  contracts: number;
  value: number; // in billions COP
}

export interface ContractorDashboardData {
  companyAge: number; // years
  totalContracts: number;
  contractsWon: number;
  contractsParticipated: number;
  advanceRatio: number; // 0–100%
  executionRatio: number; // 0–100%
  timeSeries: ContractTimePoint[];
}

// --- Public Entity Dashboard ---
export interface TopContractor {
  name: string;
  contracts: number;
}

export interface EntityDashboardData {
  hhiIndex: number; // 0–10000
  topContractors: TopContractor[];
}

// --- Budget Estimation ---
export interface BudgetEstimationData {
  mean: number; // expected value in billion COP
  stdDev: number;
  actualValue: number;
  points: { x: number; y: number }[]; // Gaussian curve points
}

export interface DashboardData {
  global: GlobalDashboardData;
  contractor: ContractorDashboardData;
  entity: EntityDashboardData;
  budget: BudgetEstimationData;
}
