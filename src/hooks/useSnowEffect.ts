import { useState, useEffect } from 'react';
import { getActiveFestivalSeason, SeasonType } from '../utils/festivalUtils';

export type { SeasonType };

interface SeasonResult {
  showSeason: boolean;
  seasonType: SeasonType;
}

const useSnowEffect = (): SeasonResult => {
  const [showSeason, setShowSeason] = useState(false);
  const [seasonType, setSeasonType] = useState<SeasonType>(null);

  useEffect(() => {
    const checkSeason = () => {
      const activeSeason = getActiveFestivalSeason(new Date());
      if (activeSeason) {
        setShowSeason(true);
        setSeasonType(activeSeason);
      } else {
        setShowSeason(false);
        setSeasonType(null);
      }
    };

    checkSeason();
    
    // Update every minute to handle date changes
    const interval = setInterval(checkSeason, 60000);
    
    return () => clearInterval(interval);
  }, []);

  return { showSeason, seasonType };
};

export default useSnowEffect;
