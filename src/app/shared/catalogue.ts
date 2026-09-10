/**
 * What the company does and for whom, as translation keys: the four services
 * (S1 to S4, the home cards and mimic nodes) and the four industries (X1 to
 * X4, the industries strip and mimic terminals), each in its numbered order.
 * The about page's nameplate lists both, and the home page's mimic re-exports
 * them as its node and terminal legends, so the order lives in one place.
 */
export const SERVICE_KEYS = [
  'GLOBAL.DESIGN_ENGINEERING',
  'GLOBAL.SOFTWARE_ENGINEERING',
  'GLOBAL.PROJECT_MANAGEMENT',
  'GLOBAL.MAINTENANCE_AND_GENERAL_WORK',
] as const;

export const INDUSTRY_KEYS = [
  'GLOBAL.FMCG',
  'GLOBAL.PET',
  'GLOBAL.MINING',
  'GLOBAL.OIL_AND_GAS',
] as const;
