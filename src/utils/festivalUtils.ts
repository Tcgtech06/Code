export type SeasonType = 'christmas' | 'pongal' | 'diwali' | null;

/**
 * Exact Diwali (Deepavali) dates (Month is 0-indexed: 9 = Oct, 10 = Nov)
 * Window: 7 days before Diwali to 2 days after Diwali
 */
export const DIWALI_DATES: Record<number, { month: number; day: number }> = {
  2024: { month: 9, day: 31 },  // Oct 31, 2024
  2025: { month: 9, day: 20 },  // Oct 20, 2025
  2026: { month: 10, day: 8 },  // Nov 8, 2026
  2027: { month: 9, day: 29 },  // Oct 29, 2027
  2028: { month: 9, day: 17 },  // Oct 17, 2028
  2029: { month: 10, day: 5 },  // Nov 5, 2029
  2030: { month: 9, day: 26 },  // Oct 26, 2030
  2031: { month: 10, day: 14 }, // Nov 14, 2031
  2032: { month: 10, day: 2 },  // Nov 2, 2032
  2033: { month: 9, day: 22 },  // Oct 22, 2033
  2034: { month: 10, day: 10 }, // Nov 10, 2034
  2035: { month: 9, day: 30 },  // Oct 30, 2035
  2036: { month: 9, day: 19 },  // Oct 19, 2036
  2037: { month: 10, day: 7 },  // Nov 7, 2037
  2038: { month: 9, day: 27 },  // Oct 27, 2038
  2039: { month: 9, day: 17 },  // Oct 17, 2039
  2040: { month: 10, day: 4 }   // Nov 4, 2040
};

/**
 * Calculates start and end Date for Diwali season for any given year
 * Pre-festive start: 7 days before Diwali (Dhanteras / Deepavali festive week)
 * Post-festive end: 2 days after Diwali
 */
export function getDiwaliSeasonWindow(year: number): { start: Date; end: Date } {
  const diwali = DIWALI_DATES[year] || { month: 9, day: 25 }; // fallback late Oct if beyond table
  const diwaliDate = new Date(year, diwali.month, diwali.day);
  
  const start = new Date(diwaliDate);
  start.setDate(diwaliDate.getDate() - 7);
  start.setHours(0, 0, 0, 0);

  const end = new Date(diwaliDate);
  end.setDate(diwaliDate.getDate() + 2);
  end.setHours(23, 59, 59, 999);

  return { start, end };
}

/**
 * Returns true if the date is within the dynamic Diwali festive window
 */
export function isDiwaliSeason(now: Date = new Date()): boolean {
  const year = now.getFullYear();
  const { start, end } = getDiwaliSeasonWindow(year);
  return now >= start && now <= end;
}

/**
 * Pongal Season: January 10th to January 18th (every year)
 */
export function isPongalSeason(now: Date = new Date()): boolean {
  const month = now.getMonth(); // 0-indexed: 0 = January
  const date = now.getDate();
  return month === 0 && date >= 10 && date <= 18;
}

/**
 * Mattu Pongal: January 16th (every year)
 */
export function isMattuPongal(now: Date = new Date()): boolean {
  return now.getMonth() === 0 && now.getDate() === 16;
}

/**
 * Christmas Season: December 10th to December 28th (every year)
 */
export function isChristmasSeason(now: Date = new Date()): boolean {
  const month = now.getMonth(); // 0-indexed: 11 = December
  const date = now.getDate();
  return month === 11 && date >= 10 && date <= 28;
}

/**
 * Central detector for the current active festival season
 */
export function getActiveFestivalSeason(now: Date = new Date()): SeasonType {
  if (isDiwaliSeason(now)) return 'diwali';
  if (isChristmasSeason(now)) return 'christmas';
  if (isPongalSeason(now)) return 'pongal';
  return null;
}

