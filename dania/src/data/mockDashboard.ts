import type { DashboardData } from '@/types/dashboard';

function gaussian(x: number, mean: number, std: number): number {
  return (1 / (std * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * ((x - mean) / std) ** 2);
}

function buildGaussianCurve(mean: number, std: number, points = 80) {
  const min = mean - 4 * std;
  const max = mean + 4 * std;
  const step = (max - min) / points;
  return Array.from({ length: points + 1 }, (_, i) => {
    const x = min + i * step;
    return { x: parseFloat(x.toFixed(2)), y: parseFloat(gaussian(x, mean, std).toFixed(6)) };
  });
}

// Dashboard data keyed by project id
export const mockDashboards: Record<string, DashboardData> = {
  'via-prosperidad': {
    global: {
      contractValueHistogram: [
        { range: '< 10B', count: 42 },
        { range: '10–50B', count: 87 },
        { range: '50–100B', count: 34 },
        { range: '100–500B', count: 18 },
        { range: '> 500B', count: 5 },
      ],
      contractTypeHistogram: [
        { type: 'Public Bid', count: 63 },
        { type: 'Direct Award', count: 48 },
        { type: 'Minimum Quota', count: 71 },
        { type: 'Competitive Selection', count: 22 },
        { type: 'Other', count: 14 },
      ],
    },
    contractor: {
      companyAge: 4,
      totalContracts: 12,
      contractsWon: 9,
      contractsParticipated: 31,
      advanceRatio: 34,
      executionRatio: 28,
      timeSeries: [
        { month: 'Jan 22', contracts: 1, value: 12 },
        { month: 'Apr 22', contracts: 2, value: 28 },
        { month: 'Jul 22', contracts: 1, value: 9 },
        { month: 'Oct 22', contracts: 3, value: 67 },
        { month: 'Jan 23', contracts: 2, value: 432 },
        { month: 'Apr 23', contracts: 1, value: 15 },
        { month: 'Jul 23', contracts: 2, value: 38 },
      ],
    },
    entity: {
      hhiIndex: 3240,
      topContractors: [
        { name: 'UT Caribe Vial 2023', contracts: 9 },
        { name: 'Conconcreto S.A.', contracts: 7 },
        { name: 'Constructora Ménsula', contracts: 5 },
        { name: 'GMC Constructores', contracts: 4 },
        { name: 'Obrascol Ltda.', contracts: 3 },
        { name: 'Infravia del Norte', contracts: 2 },
      ],
    },
    budget: (() => {
      const mean = 380;
      const std = 45;
      const actual = 432;
      return { mean, stdDev: std, actualValue: actual, points: buildGaussianCurve(mean, std) };
    })(),
  },

  'centros-poblados': {
    global: {
      contractValueHistogram: [
        { range: '< 10B', count: 28 },
        { range: '10–50B', count: 55 },
        { range: '50–100B', count: 40 },
        { range: '100–500B', count: 29 },
        { range: '> 500B', count: 12 },
      ],
      contractTypeHistogram: [
        { type: 'Public Bid', count: 44 },
        { type: 'Direct Award', count: 88 },
        { type: 'Minimum Quota', count: 31 },
        { type: 'Competitive Selection', count: 19 },
        { type: 'Other', count: 8 },
      ],
    },
    contractor: {
      companyAge: 2,
      totalContracts: 3,
      contractsWon: 2,
      contractsParticipated: 5,
      advanceRatio: 7,
      executionRatio: 4,
      timeSeries: [
        { month: 'Jan 20', contracts: 1, value: 80 },
        { month: 'Jun 20', contracts: 1, value: 1070 },
        { month: 'Dec 20', contracts: 0, value: 0 },
        { month: 'Jun 21', contracts: 1, value: 14 },
        { month: 'Dec 21', contracts: 0, value: 0 },
      ],
    },
    entity: {
      hhiIndex: 5800,
      topContractors: [
        { name: 'UT Centros Poblados', contracts: 2 },
        { name: 'Azteca Comunicaciones', contracts: 6 },
        { name: 'ETB', contracts: 5 },
        { name: 'Claro Colombia', contracts: 4 },
        { name: 'Tigo Business', contracts: 3 },
      ],
    },
    budget: (() => {
      const mean = 420;
      const std = 60;
      const actual = 1070;
      return { mean, stdDev: std, actualValue: actual, points: buildGaussianCurve(mean, std) };
    })(),
  },

  'proyecto-prueba': {
    global: {
      contractValueHistogram: [
        { range: '< 10B', count: 58 },
        { range: '10–50B', count: 42 },
        { range: '50–100B', count: 18 },
        { range: '100–500B', count: 6 },
        { range: '> 500B', count: 1 },
      ],
      contractTypeHistogram: [
        { type: 'Public Bid', count: 72 },
        { type: 'Direct Award', count: 18 },
        { type: 'Minimum Quota', count: 45 },
        { type: 'Competitive Selection', count: 38 },
        { type: 'Other', count: 7 },
      ],
    },
    contractor: {
      companyAge: 12,
      totalContracts: 18,
      contractsWon: 14,
      contractsParticipated: 38,
      advanceRatio: 82,
      executionRatio: 79,
      timeSeries: [
        { month: 'Jan 22', contracts: 2, value: 5 },
        { month: 'Apr 22', contracts: 3, value: 12 },
        { month: 'Jul 22', contracts: 2, value: 8 },
        { month: 'Oct 22', contracts: 3, value: 15 },
        { month: 'Jan 23', contracts: 4, value: 22 },
        { month: 'Apr 23', contracts: 3, value: 18 },
        { month: 'Jul 23', contracts: 1, value: 8 },
      ],
    },
    entity: {
      hhiIndex: 820,
      topContractors: [
        { name: 'Constructora Urbana del Centro SAS', contracts: 14 },
        { name: 'Ingeniería Distrital SAS', contracts: 11 },
        { name: 'Obras Civiles Bogotá Ltda.', contracts: 9 },
        { name: 'Parques y Jardines Colombia', contracts: 7 },
        { name: 'Urbanismo Sostenible SAS', contracts: 5 },
        { name: 'Constructores del Espacio', contracts: 4 },
      ],
    },
    budget: (() => {
      const mean = 8.3;
      const std = 0.6;
      const actual = 8.2;
      return { mean, stdDev: std, actualValue: actual, points: buildGaussianCurve(mean, std) };
    })(),
  },
};

// Fallback for projects without specific dashboard data
const defaultDashboard: DashboardData = {
  global: {
    contractValueHistogram: [
      { range: '< 10B', count: 30 },
      { range: '10–50B', count: 60 },
      { range: '50–100B', count: 25 },
      { range: '100–500B', count: 12 },
      { range: '> 500B', count: 3 },
    ],
    contractTypeHistogram: [
      { type: 'Public Bid', count: 55 },
      { type: 'Direct Award', count: 40 },
      { type: 'Minimum Quota', count: 35 },
      { type: 'Competitive Selection', count: 15 },
      { type: 'Other', count: 10 },
    ],
  },
  contractor: {
    companyAge: 8,
    totalContracts: 24,
    contractsWon: 18,
    contractsParticipated: 42,
    advanceRatio: 72,
    executionRatio: 68,
    timeSeries: [
      { month: 'Jan 21', contracts: 2, value: 18 },
      { month: 'Apr 21', contracts: 3, value: 34 },
      { month: 'Jul 21', contracts: 2, value: 22 },
      { month: 'Oct 21', contracts: 4, value: 55 },
      { month: 'Jan 22', contracts: 3, value: 41 },
      { month: 'Apr 22', contracts: 5, value: 78 },
      { month: 'Jul 22', contracts: 3, value: 29 },
    ],
  },
  entity: {
    hhiIndex: 1850,
    topContractors: [
      { name: 'Constructor A', contracts: 12 },
      { name: 'Constructor B', contracts: 9 },
      { name: 'Constructor C', contracts: 7 },
      { name: 'Constructor D', contracts: 5 },
      { name: 'Constructor E', contracts: 3 },
    ],
  },
  budget: (() => {
    const mean = 50;
    const std = 8;
    const actual = 52;
    return { mean, stdDev: std, actualValue: actual, points: buildGaussianCurve(mean, std) };
  })(),
};

export function getDashboardData(projectId: string): DashboardData {
  return mockDashboards[projectId] ?? defaultDashboard;
}
