import { useState, useEffect } from 'react';

type SeasonType = 'christmas' | 'pongal' | 'diwali' | null;

interface SeasonResult {
  showSeason: boolean;
  seasonType: SeasonType;
}

const useSnowEffect = (): SeasonResult => {
  const [showSeason, setShowSeason] = useState(false);
  const [seasonType, setSeasonType] = useState<SeasonType>(null);

  useEffect(() => {
    const checkSeason = () => {
      const now = new Date();
      const month = now.getMonth(); // 0-indexed
      const date = now.getDate();
      const year = now.getFullYear();
      
      // TEMPORARY: Diwali from Feb 6-8, 2026 for testing
      if (year === 2026 && month === 1 && date >= 6 && date <= 8) {
        setShowSeason(true);
        setSeasonType('diwali');
        return;
      }
      
      // Christmas season: December 10th to December 28th
      if (month === 11 && date >= 10 && date <= 28) {
        setShowSeason(true);
        setSeasonType('christmas');
        return;
      }
      
      // Pongal season: January 10th to January 18th
      if (month === 0 && date >= 10 && date <= 18) {
        setShowSeason(true);
        setSeasonType('pongal');
        return;
      }
      
      // Diwali season: October 15th to October 21st (5 days before to 1 day after Diwali)
      // Diwali 2025 is on October 20
      if (month === 9 && date >= 15 && date <= 21) {
        setShowSeason(true);
        setSeasonType('diwali');
        return;
      }
      
      // No season
      setShowSeason(false);
      setSeasonType(null);
    };

    checkSeason();
    
    // Update every minute to handle date changes
    const interval = setInterval(checkSeason, 60000);
    
    return () => clearInterval(interval);
  }, []);

  return { showSeason, seasonType };
};

export default useSnowEffect;
