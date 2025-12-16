import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { ChevronLeft, ChevronRight, MapPin, Calendar, Play, Pause, Volume2, VolumeX, Maximize, Image, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GalleryMedia, galleryMedia as fallbackMedia } from '@/data/galleryMedia';

interface ActivitySlideshowProps {
  filterType?: 'all' | 'photo' | 'video';
}

export default function ActivitySlideshow({ filterType = 'all' }: ActivitySlideshowProps) {
  const [media, setMedia] = useState<GalleryMedia[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchMedia();
  }, [filterType]);

  const fetchMedia = async () => {
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
        // Use fallback data filtered by type
        const filtered = filterType === 'all' 
          ? fallbackMedia 
          : fallbackMedia.filter(m => m.media_type === filterType);
        setMedia(filtered);
      }
    } catch (error) {
      // Use fallback data
      const filtered = filterType === 'all' 
        ? fallbackMedia 
        : fallbackMedia.filter(m => m.media_type === filterType);
      setMedia(filtered);
    }
    setLoading(false);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % media.length);
    setIsPlaying(false);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + media.length) % media.length);
    setIsPlaying(false);
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    if (containerRef.current) {
      if (!isFullscreen) {
        if (containerRef.current.requestFullscreen) {
          containerRef.current.requestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
      }
      setIsFullscreen(!isFullscreen);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (media.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
          {filterType === 'video' ? (
            <Video className="w-8 h-8 text-gray-400" />
          ) : (
            <Image className="w-8 h-8 text-gray-400" />
          )}
        </div>
        <p className="text-gray-500">No {filterType === 'all' ? 'media' : filterType + 's'} available yet.</p>
      </div>
    );
  }

  const currentMedia = media[currentIndex];
  const isVideo = currentMedia.media_type === 'video';

  return (
    <div className="relative max-w-6xl mx-auto" ref={containerRef}>
      <div className="relative aspect-video bg-gray-900 rounded-xl overflow-hidden shadow-2xl">
        {isVideo ? (
          <>
            <video
              ref={videoRef}
              src={currentMedia.media_url}
              poster={currentMedia.thumbnail_url}
              className="w-full h-full object-cover"
              onEnded={() => setIsPlaying(false)}
              onClick={togglePlay}
            />
            
            {/* Video Controls Overlay */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
              <button
                onClick={togglePlay}
                className="w-20 h-20 rounded-full bg-white/90 flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
              >
                {isPlaying ? (
                  <Pause className="w-10 h-10 text-gray-800" />
                ) : (
                  <Play className="w-10 h-10 text-gray-800 ml-1" />
                )}
              </button>
            </div>

            {/* Video Controls Bar */}
            <div className="absolute bottom-16 left-4 right-4 flex items-center gap-2">
              <Button
                onClick={togglePlay}
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
              >
                {isPlaying ? <Pause size={20} /> : <Play size={20} />}
              </Button>
              <Button
                onClick={toggleMute}
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
              >
                {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </Button>
              <div className="flex-1" />
              {currentMedia.duration && (
                <span className="text-white text-sm bg-black/50 px-2 py-1 rounded">
                  {currentMedia.duration}
                </span>
              )}
              <Button
                onClick={toggleFullscreen}
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
              >
                <Maximize size={20} />
              </Button>
            </div>

            {/* Video Badge */}
            <div className="absolute top-4 left-4 flex items-center gap-1 bg-purple-600 text-white px-3 py-1 rounded-full text-sm">
              <Video size={14} />
              <span>Video</span>
            </div>
          </>
        ) : (
          <>
            <img
              src={currentMedia.media_url}
              alt={currentMedia.title}
              className="w-full h-full object-cover"
            />
            
            {/* Photo Badge */}
            <div className="absolute top-4 left-4 flex items-center gap-1 bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
              <Image size={14} />
              <span>Photo</span>
            </div>
          </>
        )}
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
        
        {/* Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <h3 className="text-2xl font-bold mb-2">{currentMedia.title}</h3>
          {currentMedia.description && (
            <p className="mb-3 text-white/90 line-clamp-2">{currentMedia.description}</p>
          )}
          <div className="flex gap-4 text-sm">
            {currentMedia.location && (
              <span className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full">
                <MapPin size={14} /> {currentMedia.location}
              </span>
            )}
            {currentMedia.activity_date && (
              <span className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full">
                <Calendar size={14} /> {new Date(currentMedia.activity_date).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>

        {/* Navigation Buttons */}
        <Button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800"
          size="icon"
        >
          <ChevronLeft />
        </Button>

        <Button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800"
          size="icon"
        >
          <ChevronRight />
        </Button>
      </div>

      {/* Thumbnail Navigation */}
      <div className="flex justify-center gap-2 mt-6 overflow-x-auto pb-2">
        {media.map((item, idx) => (
          <button
            key={idx}
            onClick={() => {
              setCurrentIndex(idx);
              setIsPlaying(false);
            }}
            className={`relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden transition-all ${
              idx === currentIndex 
                ? 'ring-2 ring-blue-600 ring-offset-2 scale-110' 
                : 'opacity-60 hover:opacity-100'
            }`}
          >
            <img
              src={item.media_type === 'video' ? (item.thumbnail_url || item.media_url) : item.media_url}
              alt={item.title}
              className="w-full h-full object-cover"
            />
            {item.media_type === 'video' && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <Play className="w-4 h-4 text-white" />
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Slide Counter */}
      <div className="text-center mt-4 text-gray-600">
        {currentIndex + 1} of {media.length}
      </div>
    </div>
  );
}
