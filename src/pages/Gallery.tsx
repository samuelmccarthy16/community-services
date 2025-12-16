import { useState, useEffect, useCallback } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';
import ActivitySlideshow from '@/components/ActivitySlideshow';
import MediaUpload from '@/components/MediaUpload';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Camera, 
  Upload, 
  Image, 
  Video, 
  Grid3X3, 
  Play, 
  MapPin, 
  Calendar,
  X,
  ChevronLeft,
  ChevronRight,
  Maximize,
  Download,
  Share2,
  Info,
  Keyboard
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { GalleryMedia, galleryMedia as fallbackMedia } from '@/data/galleryMedia';

type FilterType = 'all' | 'photo' | 'video';
type ViewMode = 'slideshow' | 'grid';

export default function Gallery() {
  const [showUpload, setShowUpload] = useState(false);
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('slideshow');
  const [media, setMedia] = useState<GalleryMedia[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMedia, setSelectedMedia] = useState<GalleryMedia | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [showKeyboardHint, setShowKeyboardHint] = useState(false);

  useEffect(() => {
    fetchMedia();
  }, [filterType]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedMedia) return;
      
      switch (e.key) {
        case 'ArrowLeft':
          navigateLightbox('prev');
          break;
        case 'ArrowRight':
          navigateLightbox('next');
          break;
        case 'Escape':
          closeLightbox();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedMedia, lightboxIndex, media]);

  const fetchMedia = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('gallery_media')
        .select('*')
        .order('activity_date', { ascending: false });

      if (filterType !== 'all') {
        query = query.eq('media_type', filterType);
      }

      const { data, error } = await query;

      if (!error && data && data.length > 0) {
        setMedia(data);
      } else {
        // Use fallback data
        const filtered = filterType === 'all' 
          ? fallbackMedia 
          : fallbackMedia.filter(m => m.media_type === filterType);
        setMedia(filtered);
      }
    } catch (error) {
      const filtered = filterType === 'all' 
        ? fallbackMedia 
        : fallbackMedia.filter(m => m.media_type === filterType);
      setMedia(filtered);
    }
    setLoading(false);
  };

  const openLightbox = (item: GalleryMedia, index: number) => {
    setSelectedMedia(item);
    setLightboxIndex(index);
    setShowKeyboardHint(true);
    setTimeout(() => setShowKeyboardHint(false), 3000);
  };

  const closeLightbox = () => {
    setSelectedMedia(null);
  };

  const navigateLightbox = useCallback((direction: 'prev' | 'next') => {
    const newIndex = direction === 'next' 
      ? (lightboxIndex + 1) % media.length 
      : (lightboxIndex - 1 + media.length) % media.length;
    setLightboxIndex(newIndex);
    setSelectedMedia(media[newIndex]);
  }, [lightboxIndex, media]);

  const handleShare = async () => {
    if (!selectedMedia) return;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: selectedMedia.title,
          text: selectedMedia.description || 'Check out this media from Blissful Transformations',
          url: window.location.href,
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback: copy link to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const handleDownload = () => {
    if (!selectedMedia) return;
    window.open(selectedMedia.media_url, '_blank');
  };

  const photoCount = media.filter(m => m.media_type === 'photo').length;
  const videoCount = media.filter(m => m.media_type === 'video').length;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute inset-0">
            <div className="absolute top-10 left-10 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
          </div>
          <div className="container mx-auto px-4 text-center relative z-10">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm mb-6">
              <Camera className="w-10 h-10" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-4">Our Global Work</h1>
            <p className="text-xl max-w-2xl mx-auto text-white/90 mb-8">
              Witness the impact of our initiatives around the world through these powerful moments captured in photos and videos
            </p>
            
            {/* Stats */}
            <div className="flex justify-center gap-8 mt-8">
              <div className="text-center">
                <div className="text-4xl font-bold">{photoCount}</div>
                <div className="text-white/70 flex items-center gap-1 justify-center">
                  <Image className="w-4 h-4" /> Photos
                </div>
              </div>
              <div className="w-px bg-white/30" />
              <div className="text-center">
                <div className="text-4xl font-bold">{videoCount}</div>
                <div className="text-white/70 flex items-center gap-1 justify-center">
                  <Video className="w-4 h-4" /> Videos
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Controls Section */}
        <section className="py-6 bg-white border-b sticky top-16 z-30 shadow-sm">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              {/* Filter Tabs */}
              <Tabs value={filterType} onValueChange={(v) => setFilterType(v as FilterType)} className="w-full md:w-auto">
                <TabsList className="grid grid-cols-3 w-full md:w-auto bg-gray-100">
                  <TabsTrigger value="all" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow">
                    <Grid3X3 className="w-4 h-4" />
                    <span>All</span>
                    <span className="hidden sm:inline text-xs text-gray-500">({media.length})</span>
                  </TabsTrigger>
                  <TabsTrigger value="photo" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow">
                    <Image className="w-4 h-4" />
                    <span>Photos</span>
                  </TabsTrigger>
                  <TabsTrigger value="video" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow">
                    <Video className="w-4 h-4" />
                    <span>Videos</span>
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              {/* View Mode & Upload */}
              <div className="flex items-center gap-3">
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('slideshow')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                      viewMode === 'slideshow' 
                        ? 'bg-white shadow text-blue-600' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                    title="Slideshow view"
                  >
                    Slideshow
                  </button>
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                      viewMode === 'grid' 
                        ? 'bg-white shadow text-blue-600' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                    title="Grid view"
                  >
                    Grid
                  </button>
                </div>

                <Button
                  onClick={() => setShowUpload(true)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <Upload className="mr-2 w-4 h-4" />
                  <span className="hidden sm:inline">Upload Media</span>
                  <span className="sm:hidden">Upload</span>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                <p className="text-gray-500">Loading gallery...</p>
              </div>
            ) : viewMode === 'slideshow' ? (
              <ActivitySlideshow filterType={filterType} />
            ) : (
              /* Grid View */
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {media.map((item, index) => (
                  <div
                    key={index}
                    onClick={() => openLightbox(item, index)}
                    className="group relative aspect-square rounded-xl overflow-hidden cursor-pointer bg-gray-200 focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2"
                    tabIndex={0}
                    role="button"
                    aria-label={`View ${item.title}`}
                    onKeyDown={(e) => e.key === 'Enter' && openLightbox(item, index)}
                  >
                    <img
                      src={item.media_type === 'video' ? (item.thumbnail_url || item.media_url) : item.media_url}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      loading="lazy"
                    />
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Media Type Badge */}
                    <div className={`absolute top-3 left-3 flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium text-white ${
                      item.media_type === 'video' ? 'bg-purple-600' : 'bg-blue-600'
                    }`}>
                      {item.media_type === 'video' ? (
                        <>
                          <Video className="w-3 h-3" />
                          {item.duration && <span>{item.duration}</span>}
                        </>
                      ) : (
                        <Image className="w-3 h-3" />
                      )}
                    </div>

                    {/* Play Button for Videos */}
                    {item.media_type === 'video' && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                          <Play className="w-6 h-6 text-gray-800 ml-1" />
                        </div>
                      </div>
                    )}

                    {/* Info on Hover */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <h3 className="text-white font-semibold text-sm truncate">{item.title}</h3>
                      <div className="flex items-center gap-2 text-white/70 text-xs mt-1">
                        {item.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> {item.location}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Empty State */}
            {!loading && media.length === 0 && (
              <div className="text-center py-20">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-4">
                  {filterType === 'video' ? (
                    <Video className="w-10 h-10 text-gray-400" />
                  ) : filterType === 'photo' ? (
                    <Image className="w-10 h-10 text-gray-400" />
                  ) : (
                    <Camera className="w-10 h-10 text-gray-400" />
                  )}
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No {filterType === 'all' ? 'media' : filterType + 's'} yet</h3>
                <p className="text-gray-500 mb-6">Be the first to upload {filterType === 'all' ? 'content' : `a ${filterType}`}!</p>
                <Button onClick={() => setShowUpload(true)}>
                  <Upload className="mr-2 w-4 h-4" />
                  Upload {filterType === 'all' ? 'Media' : filterType === 'photo' ? 'Photo' : 'Video'}
                </Button>
              </div>
            )}

            {/* Keyboard Hint */}
            {viewMode === 'grid' && media.length > 0 && (
              <div className="mt-8 text-center">
                <p className="text-sm text-gray-500 flex items-center justify-center gap-2">
                  <Info className="w-4 h-4" />
                  Click on any image to view in fullscreen. Use arrow keys to navigate.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Upload Dialog */}
      <Dialog open={showUpload} onOpenChange={setShowUpload}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl">Upload to Gallery</DialogTitle>
          </DialogHeader>
          <MediaUpload onUploadSuccess={() => {
            setShowUpload(false);
            fetchMedia();
          }} />
        </DialogContent>
      </Dialog>

      {/* Lightbox Modal */}
      {selectedMedia && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          role="dialog"
          aria-modal="true"
          aria-label="Image lightbox"
        >
          {/* Keyboard Hint Toast */}
          {showKeyboardHint && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm flex items-center gap-2 animate-fade-in">
              <Keyboard className="w-4 h-4" />
              Use arrow keys to navigate, Esc to close
            </div>
          )}

          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 p-2 text-white/70 hover:text-white transition z-50 hover:bg-white/10 rounded-full"
            aria-label="Close lightbox"
          >
            <X className="w-8 h-8" />
          </button>

          {/* Navigation */}
          <button
            onClick={() => navigateLightbox('prev')}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 text-white/70 hover:text-white transition hover:bg-white/10 rounded-full"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-10 h-10" />
          </button>
          <button
            onClick={() => navigateLightbox('next')}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 text-white/70 hover:text-white transition hover:bg-white/10 rounded-full"
            aria-label="Next image"
          >
            <ChevronRight className="w-10 h-10" />
          </button>

          {/* Media Content */}
          <div className="max-w-5xl max-h-[80vh] w-full mx-4">
            {selectedMedia.media_type === 'video' ? (
              <video
                src={selectedMedia.media_url}
                poster={selectedMedia.thumbnail_url}
                controls
                autoPlay
                className="w-full max-h-[70vh] object-contain rounded-lg"
              />
            ) : (
              <img
                src={selectedMedia.media_url}
                alt={selectedMedia.title}
                className="w-full max-h-[70vh] object-contain rounded-lg"
              />
            )}

            {/* Info Bar */}
            <div className="mt-4 text-white">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-semibold">{selectedMedia.title}</h3>
                  {selectedMedia.description && (
                    <p className="text-white/70 mt-1">{selectedMedia.description}</p>
                  )}
                  <div className="flex items-center gap-4 mt-2 text-sm text-white/60">
                    {selectedMedia.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" /> {selectedMedia.location}
                      </span>
                    )}
                    {selectedMedia.activity_date && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" /> {new Date(selectedMedia.activity_date).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-white/70 hover:text-white hover:bg-white/10"
                    onClick={handleShare}
                    title="Share"
                  >
                    <Share2 className="w-5 h-5" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-white/70 hover:text-white hover:bg-white/10"
                    onClick={handleDownload}
                    title="Download"
                  >
                    <Download className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Counter */}
              <div className="text-center mt-4 text-white/50 text-sm">
                {lightboxIndex + 1} of {media.length}
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
      <BackToTop />
    </div>
  );
}
