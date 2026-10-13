import { Users } from 'lucide-react';
import type { MeetingHall } from '../lib/supabase';
import { Link } from 'react-router-dom';
import { ImageSlideshow } from './ImageSlideshow';

interface MeetingHallCardProps {
  hall: MeetingHall;
}

export function MeetingHallCard({ hall }: MeetingHallCardProps) {
  return (
    <Link
      to={`/hall/${hall.id}`}
      className="bg-white rounded-xl shadow-lg overflow-hidden transition-transform hover:scale-105 duration-300 flex flex-col h-full cursor-pointer"
    >
      <div className="relative h-60 sm:h-60 overflow-hidden">
        <ImageSlideshow 
          images={hall.image_urls?.length ? hall.image_urls : [hall.image_url]}
          alt={hall.name}
        />
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-white px-2 sm:px-3 py-1 rounded-full shadow-md flex items-center gap-1">
          <Users className="w-3 sm:w-4 h-3 sm:h-4 text-green-600" />
          <span className="text-xs sm:text-sm font-semibold text-gray-800">{hall.minimum_capacity}-{hall.capacity}</span>
        </div>
      </div>

      <div className="p-4 sm:p-6 flex-1 flex flex-col">
        <h3 className="text-lg sm:text-2xl font-bold text-gray-900 mb-2">{hall.name}</h3>
        <p className="text-sm sm:text-base text-gray-600 mb-4 line-clamp-3 flex-1">{hall.description}</p>

        <div className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 sm:py-3 px-4 sm:px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 text-sm sm:text-base mt-auto">
          Book This Hall
        </div>
      </div>
    </Link>
  );
}
