import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';

type Category = '전체' | '일상' | '봄' | '여름' | '가을' | '겨울';

interface PhotoData {
  id: number;
  url: string;
  category: Category;
}

const getCategory = (num: number): Category => {
  if (num >= 1 && num <= 12) return '일상';
  if (num >= 13 && num <= 19) return '봄';
  if (num >= 20 && num <= 26) return '여름';
  if (num >= 27 && num <= 33) return '가을';
  return '겨울';
};

const photos: PhotoData[] = Array.from({ length: 40 }, (_, i) => {
  const id = i + 1;
  return {
    id,
    url: `https://pub-59a11d1a92c0405fa70a86806a5ade02.r2.dev/D/${id}.jpg`,
    category: getCategory(id),
  };
});

const categories: Category[] = ['전체', '일상', '봄', '여름', '가을', '겨울'];

export default function App() {
  const [activeCategory, setActiveCategory] = useState<Category>('전체');
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoData | null>(null);

  const filteredPhotos = activeCategory === '전체' 
    ? photos 
    : photos.filter(p => p.category === activeCategory);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedPhoto) return;
    const currentIndex = filteredPhotos.findIndex(p => p.id === selectedPhoto.id);
    const prevIndex = (currentIndex - 1 + filteredPhotos.length) % filteredPhotos.length;
    setSelectedPhoto(filteredPhotos[prevIndex]);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedPhoto) return;
    const currentIndex = filteredPhotos.findIndex(p => p.id === selectedPhoto.id);
    const nextIndex = (currentIndex + 1) % filteredPhotos.length;
    setSelectedPhoto(filteredPhotos[nextIndex]);
  };

  return (
    <div className="min-h-screen bg-blue-50 font-sans text-slate-800 selection:bg-blue-200">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-10 border-b border-blue-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-6 text-center">
          <h1 className="text-3xl md:text-4xl font-serif text-blue-900 tracking-wide">
            우리의 추억 앨범
          </h1>
        </div>
        
        {/* Navigation */}
        <nav className="max-w-6xl mx-auto px-4 pb-4 overflow-x-auto no-scrollbar">
          <ul className="flex justify-center space-x-2 md:space-x-6 min-w-max">
            {categories.map((cat) => (
              <li key={cat}>
                <button
                  onClick={() => setActiveCategory(cat)}
                  className={`px-5 py-2 rounded-full text-sm md:text-base font-medium transition-all duration-300 ${
                    activeCategory === cat
                      ? 'bg-blue-500 text-white shadow-md shadow-blue-500/30'
                      : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                  }`}
                >
                  {cat}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-12">
        <div 
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredPhotos.map((photo) => (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                key={photo.id}
                className="group cursor-pointer aspect-[3/4] relative bg-white p-2 md:p-3 shadow-md rounded-sm transform transition-transform hover:-translate-y-2 hover:shadow-xl hover:rotate-1"
                onClick={() => setSelectedPhoto(photo)}
              >
                <div className="w-full h-full relative overflow-hidden bg-slate-100 rounded-sm">
                  <img
                    src={photo.url}
                    alt={`${photo.category} 사진 ${photo.id}`}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      if (target.nextSibling) {
                        (target.nextSibling as HTMLElement).style.display = 'flex';
                      }
                    }}
                  />
                  <div className="hidden absolute inset-0 flex-col items-center justify-center text-slate-400 bg-slate-50">
                    <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
                    <span className="text-xs">Image Not Found</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </main>

      {/* Lightbox / Modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={() => setSelectedPhoto(null)}
          >
            <button
              className="absolute top-4 right-4 md:top-8 md:right-8 p-2 text-white/70 hover:text-white bg-black/20 hover:bg-black/40 rounded-full transition-colors"
              onClick={() => setSelectedPhoto(null)}
            >
              <X className="w-6 h-6 md:w-8 md:h-8" />
            </button>

            <motion.div
              className="relative max-w-5xl max-h-[90vh] w-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute left-0 md:-left-12 p-2 text-white/70 hover:text-white bg-black/20 hover:bg-black/40 rounded-full transition-colors z-10"
                onClick={handlePrev}
              >
                <ChevronLeft className="w-8 h-8" />
              </button>

              <div className="bg-white p-3 md:p-6 shadow-2xl rounded-sm max-w-full max-h-full flex flex-col">
                <div className="relative flex-1 overflow-hidden min-h-0 flex items-center justify-center bg-slate-100">
                  <img
                    src={selectedPhoto.url}
                    alt={`${selectedPhoto.category} 사진 ${selectedPhoto.id}`}
                    className="max-w-full max-h-[75vh] object-contain"
                  />
                </div>
              </div>

              <button
                className="absolute right-0 md:-right-12 p-2 text-white/70 hover:text-white bg-black/20 hover:bg-black/40 rounded-full transition-colors z-10"
                onClick={handleNext}
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Decorative floral/spring background elements (optional) */}
      <div className="fixed bottom-0 left-0 w-64 h-64 bg-blue-200/20 rounded-full blur-3xl -z-10 pointer-events-none transform -translate-x-1/2 translate-y-1/2"></div>
      <div className="fixed top-20 right-0 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl -z-10 pointer-events-none transform translate-x-1/3 -translate-y-1/3"></div>
    </div>
  );
}
