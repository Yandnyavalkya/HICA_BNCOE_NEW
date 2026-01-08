import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';

type GalleryImage = {
  _id: string;
  title?: string;
  description?: string;
  image_url: string;
  category?: string;
  event_category?: string;
};

export default function Gallery() {
  const [searchParams] = useSearchParams();
  const eventFilter = searchParams.get('event');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  const { data, isLoading } = useQuery<GalleryImage[]>({
    queryKey: ['gallery', eventFilter],
    queryFn: async () => {
      const res = await api.get<GalleryImage[]>('/gallery');
      return res.data;
    },
  });

  // Filter images by event category if provided
  const filteredData = eventFilter
    ? data?.filter((img) => img.event_category === eventFilter)
    : data;

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
            Gallery
          </h2>
          {eventFilter ? (
            <div>
              <p className="text-white/70 text-lg max-w-2xl mx-auto mb-4">
                Images from: <span className="text-purple-400 font-semibold">{eventFilter}</span>
              </p>
              <a
                href="/gallery"
                className="text-cyan-400 hover:text-cyan-300 text-sm transition-colors duration-300"
              >
                ← View All Gallery Images
              </a>
            </div>
          ) : (
            <p className="text-white/70 text-lg max-w-2xl mx-auto">
              Capturing moments from our events and activities
            </p>
          )}
        </div>

        {isLoading && (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            <p className="text-white/70 mt-4">Loading gallery...</p>
          </div>
        )}

        {!isLoading && (!filteredData || filteredData.length === 0) && (
          <div className="text-center py-20">
            <p className="text-white/70 text-lg">
              {eventFilter 
                ? `No images found for "${eventFilter}". Check back soon!`
                : 'No gallery images yet. Check back soon!'}
            </p>
          </div>
        )}

        <div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6"
          style={{
            gridAutoRows: 'auto',
          }}
        >
          {filteredData?.map((image, index) => (
            <div
              key={image._id}
              className="group relative bg-gradient-to-br from-purple-900/30 to-cyan-900/30 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 hover:border-purple-500/50 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/20 cursor-pointer animate-fade-in-up flex flex-col"
              style={{ animationDelay: `${index * 0.05}s` }}
              onClick={() => setSelectedImage(image.image_url)}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-cyan-500/0 group-hover:from-purple-500/10 group-hover:to-cyan-500/10 transition-all duration-300 z-10 pointer-events-none"></div>
              
              <div className="relative overflow-hidden bg-black/20 flex-shrink-0">
                <img
                  src={image.image_url}
                  alt={image.title || 'Gallery'}
                  className="w-full h-auto object-contain group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                  onLoad={(e) => {
                    // Ensure image maintains aspect ratio
                    const img = e.currentTarget;
                    img.style.height = 'auto';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>

              {(image.title || image.description || image.category || image.event_category) && (
                <div className="p-4 relative z-10 flex-grow flex flex-col">
                  {image.title && (
                    <h3 className="text-white font-semibold mb-1 text-sm">{image.title}</h3>
                  )}
                  {image.description && (
                    <p className="text-white/60 text-xs line-clamp-2 mb-2 flex-grow">{image.description}</p>
                  )}
                  <div className="flex flex-wrap gap-2 mt-auto">
                    {image.category && (
                      <span className="inline-block px-3 py-1 bg-purple-500/30 text-purple-300 rounded-full text-xs font-medium">
                        {image.category}
                      </span>
                    )}
                    {image.event_category && (
                      <span className="inline-block px-3 py-1 bg-cyan-500/30 text-cyan-300 rounded-full text-xs font-medium">
                        {image.event_category.replace(/-/g, ' ')}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Modal for full-size image */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/95 backdrop-blur-sm flex items-center justify-center z-50 p-4 cursor-pointer"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-7xl max-h-[90vh]">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 text-white hover:text-purple-400 transition-colors duration-300 text-2xl"
            >
              <i className="fas fa-times"></i>
            </button>
            <img
              src={selectedImage}
              alt="Full size"
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </section>
  );
}
