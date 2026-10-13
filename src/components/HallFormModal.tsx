import { useState, useEffect, useRef, useCallback } from 'react';
import { X, Building2, Users, Image as ImageIcon, FileText, Upload, Trash2 } from 'lucide-react';
import { supabase, type MeetingHall } from '../lib/supabase';

interface HallFormModalProps {
  hall?: MeetingHall | null; // null/undefined for Add New
  onClose: () => void;
  onSuccess: () => void;
}

export function HallFormModal({ hall, onClose, onSuccess }: HallFormModalProps) {
  const isEditing = !!hall;
  
  interface ImageItem {
    id: string;
    file?: File;
    url?: string;
    preview: string;
  }

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    capacity: '',
    minimum_capacity: '',
  });
  
  const [images, setImages] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (hall) {
      setFormData({
        name: hall.name,
        description: hall.description,
        capacity: hall.capacity.toString(),
        minimum_capacity: hall.minimum_capacity?.toString() || '1',
      });
      
      const existingUrls = hall.image_urls?.length ? hall.image_urls : (hall.image_url ? [hall.image_url] : []);
      setImages(existingUrls.map(url => ({
        id: Math.random().toString(36).substr(2, 9),
        url,
        preview: url
      })));
    }
  }, [hall]);

  // Cleanup object URLs to avoid memory leaks
  useEffect(() => {
    return () => {
      images.forEach(img => {
        if (img.file) URL.revokeObjectURL(img.preview);
      });
    };
  }, [images]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const capacity = parseInt(formData.capacity);
    const minCapacity = parseInt(formData.minimum_capacity);

    if (minCapacity > capacity) {
      setError('Minimum capacity cannot be greater than maximum capacity.');
      setLoading(false);
      return;
    }

    if (images.length === 0) {
      setError('Please add at least one image.');
      setLoading(false);
      return;
    }

    try {
      const validUrls: string[] = [];

      for (const img of images) {
        if (img.url) {
          validUrls.push(img.url);
        } else if (img.file) {
          // Upload file to Supabase Storage
          const fileExt = img.file.name.split('.').pop();
          const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
          const filePath = `halls/${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from('hall-images')
            .upload(filePath, img.file);

          if (uploadError) {
            console.error('Upload Error Details:', uploadError);
            throw new Error(`Failed to upload image ${img.file.name}: ${uploadError.message}`);
          }

          const { data: publicUrlData } = supabase.storage
            .from('hall-images')
            .getPublicUrl(filePath);

          validUrls.push(publicUrlData.publicUrl);
        }
      }
      
      const payload = {
        name: formData.name,
        description: formData.description,
        capacity: capacity,
        minimum_capacity: minCapacity,
        image_url: validUrls[0] || '', // keep legacy image_url as the first image
        image_urls: validUrls,
      };

      let queryError;

      if (isEditing && hall) {
        const { error } = await supabase
          .from('meeting_halls')
          .update(payload)
          .eq('id', hall.id);
        queryError = error;
      } else {
        const { error } = await supabase
          .from('meeting_halls')
          .insert([payload]);
        queryError = error;
      }

      if (queryError) throw queryError;

      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save hall');
    } finally {
      setLoading(false);
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (images.length < 3) setIsDragging(true);
  }, [images.length]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const processFiles = (files: FileList | null) => {
    if (!files) return;
    
    const validFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
    if (validFiles.length === 0) {
      setError('Please select valid image files.');
      return;
    }

    const availableSlots = 3 - images.length;
    const filesToAdd = validFiles.slice(0, availableSlots);

    if (validFiles.length > availableSlots) {
      setError(`You can only upload a maximum of 3 images. ${availableSlots} slots remaining.`);
    } else {
      setError('');
    }

    const newImages = filesToAdd.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      preview: URL.createObjectURL(file)
    }));

    setImages(prev => [...prev, ...newImages]);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (images.length >= 3) return;
    processFiles(e.dataTransfer.files);
  }, [images.length]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    processFiles(e.target.files);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeImage = (idToRemove: string) => {
    setImages(prev => prev.filter(img => img.id !== idToRemove));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-3 sm:p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-4 sm:p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
            {isEditing ? `Edit ${hall?.name}` : 'Add New Hall'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors ml-2 flex-shrink-0"
          >
            <X className="w-5 sm:w-6 h-5 sm:h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                Hall Name
              </div>
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-sm"
              placeholder="E.g., Innovation Hub"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Description
              </div>
            </label>
            <textarea
              required
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-sm"
              placeholder="Describe the hall amenities and atmosphere..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Min Capacity
                </div>
              </label>
              <input
                type="number"
                required
                min="1"
                value={formData.minimum_capacity}
                onChange={(e) => setFormData({ ...formData, minimum_capacity: e.target.value })}
                className="w-full px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-sm"
                placeholder="E.g., 5"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Max Capacity
                </div>
              </label>
              <input
                type="number"
                required
                min="1"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                className="w-full px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-sm"
                placeholder="E.g., 20"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-semibold text-gray-700">
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4" />
                  Hall Images (Max 3) <span className="text-red-500">*</span>
                </div>
              </label>
              <span className="text-xs text-gray-500 font-normal">
                {images.length}/3 Uploaded
              </span>
            </div>
            
            {/* Drag & Drop Zone */}
            {images.length < 3 && (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`w-full mt-2 border-2 border-dashed rounded-xl p-6 sm:p-8 flex flex-col items-center justify-center cursor-pointer transition-colors ${
                  isDragging 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-gray-300 hover:border-green-400 hover:bg-gray-50'
                }`}
              >
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleFileInput}
                />
                <div className="bg-green-100 p-3 rounded-full mb-3 text-green-600">
                  <Upload className="w-6 h-6" />
                </div>
                <p className="text-sm font-semibold text-gray-700 text-center mb-1">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-gray-500 text-center">
                  SVG, PNG, JPG or GIF (max 5MB)
                </p>
              </div>
            )}

            {/* Image Previews */}
            {images.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                {images.map((img, index) => (
                  <div key={img.id} className="relative group rounded-lg overflow-hidden border border-gray-200 bg-gray-50 aspect-video flex items-center justify-center shadow-sm">
                    <img 
                      src={img.preview} 
                      alt={`Preview ${index + 1}`} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => removeImage(img.id)}
                        className="bg-white text-red-600 hover:bg-red-50 p-2 rounded-full shadow-lg transition-transform hover:scale-110"
                        title="Remove Image"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4 flex-col-reverse sm:flex-row">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {loading ? 'Saving...' : 'Save Hall'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
