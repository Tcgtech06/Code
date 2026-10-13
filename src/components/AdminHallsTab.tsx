import { useState, useEffect } from 'react';
import { supabase, type MeetingHall } from '../lib/supabase';
import { Plus, Edit2, Trash2, Building2, Users } from 'lucide-react';
import { HallFormModal } from './HallFormModal';
import { ImageSlideshow } from './ImageSlideshow';

export function AdminHallsTab() {
  const [halls, setHalls] = useState<MeetingHall[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingHall, setEditingHall] = useState<MeetingHall | null>(null);

  useEffect(() => {
    loadHalls();
  }, []);

  const loadHalls = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('meeting_halls')
        .select('*')
        .order('name');
      
      if (error) throw error;
      setHalls(data || []);
    } catch (error) {
      console.error('Error loading halls:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (hallId: string) => {
    if (!window.confirm('Are you sure you want to delete this hall? This will also delete all associated bookings.')) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('meeting_halls')
        .delete()
        .eq('id', hallId);
      
      if (error) throw error;
      await loadHalls();
    } catch (error) {
      console.error('Error deleting hall:', error);
      alert('Failed to delete hall');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900">Manage Halls</h2>
        <button
          onClick={() => {
            setEditingHall(null);
            setModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-semibold"
        >
          <Plus className="w-4 h-4" />
          Add New Hall
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {halls.map((hall) => (
          <div key={hall.id} className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col h-full border border-gray-100">
            <div className="h-48 relative overflow-hidden bg-gray-100">
              <ImageSlideshow 
                images={hall.image_urls?.length ? hall.image_urls : [hall.image_url]} 
                alt={hall.name} 
              />
              <div className="absolute top-3 right-3 flex gap-2">
                <button
                  onClick={() => {
                    setEditingHall(hall);
                    setModalOpen(true);
                  }}
                  className="p-2 bg-white/90 text-gray-700 hover:text-green-600 rounded-lg shadow-sm backdrop-blur-sm transition-colors"
                  title="Edit Hall"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(hall.id)}
                  className="p-2 bg-white/90 text-gray-700 hover:text-red-600 rounded-lg shadow-sm backdrop-blur-sm transition-colors"
                  title="Delete Hall"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="p-5 flex flex-col flex-1">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-green-600" />
                  {hall.name}
                </h3>
                <div className="flex items-center gap-1 bg-green-50 text-green-700 px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap">
                  <Users className="w-3.5 h-3.5" />
                  {hall.minimum_capacity} - {hall.capacity}
                </div>
              </div>
              <p className="text-sm text-gray-600 line-clamp-3 mt-1 flex-1">
                {hall.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <HallFormModal
          hall={editingHall}
          onClose={() => setModalOpen(false)}
          onSuccess={loadHalls}
        />
      )}
    </div>
  );
}
