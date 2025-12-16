import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Upload, Loader2, Image, Video, X, CheckCircle } from 'lucide-react';
import { MediaType } from '@/data/galleryMedia';

interface MediaUploadProps {
  onUploadSuccess?: () => void;
}

export default function MediaUpload({ onUploadSuccess }: MediaUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [mediaType, setMediaType] = useState<MediaType>('photo');
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
      
      // Auto-detect media type
      if (selectedFile.type.startsWith('video/')) {
        setMediaType('video');
      } else if (selectedFile.type.startsWith('image/')) {
        setMediaType('photo');
      }
    }
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setThumbnailFile(selectedFile);
    }
  };

  const clearFile = () => {
    setFile(null);
    setPreview(null);
    setThumbnailFile(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    setUploadProgress(0);
    const formData = new FormData(e.currentTarget);

    try {
      // Upload main media file
      const fileName = `${Date.now()}-${file.name}`;
      const bucket = mediaType === 'video' ? 'activity-videos' : 'activity-photos';
      
      setUploadProgress(20);
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      setUploadProgress(60);

      const { data: { publicUrl: mediaUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName);

      // Upload thumbnail for videos
      let thumbnailUrl = null;
      if (mediaType === 'video' && thumbnailFile) {
        const thumbFileName = `thumb-${Date.now()}-${thumbnailFile.name}`;
        const { error: thumbError } = await supabase.storage
          .from('activity-photos')
          .upload(thumbFileName, thumbnailFile);

        if (!thumbError) {
          const { data: { publicUrl } } = supabase.storage
            .from('activity-photos')
            .getPublicUrl(thumbFileName);
          thumbnailUrl = publicUrl;
        }
      }

      setUploadProgress(80);

      // Insert into database
      const { error: dbError } = await supabase
        .from('gallery_media')
        .insert({
          title: formData.get('title'),
          description: formData.get('description'),
          location: formData.get('location'),
          activity_date: formData.get('date') || null,
          media_url: mediaUrl,
          thumbnail_url: thumbnailUrl,
          media_type: mediaType,
          duration: mediaType === 'video' ? formData.get('duration') : null,
        });

      if (dbError) {
        console.warn('Database insert failed, but file was uploaded:', dbError);
        // File was uploaded successfully, just database insert failed
        toast({ 
          title: 'Partial Success', 
          description: `${mediaType === 'video' ? 'Video' : 'Photo'} uploaded to storage. Database record may need manual creation.`,
          variant: 'default'
        });
      } else {
        toast({ 
          title: 'Success!', 
          description: `${mediaType === 'video' ? 'Video' : 'Photo'} uploaded successfully` 
        });
      }

      setUploadProgress(100);
      
      (e.target as HTMLFormElement).reset();
      setFile(null);
      setPreview(null);
      setThumbnailFile(null);
      setUploadProgress(0);
      
      onUploadSuccess?.();

    } catch (error: any) {
      toast({ 
        title: 'Error', 
        description: error.message, 
        variant: 'destructive' 
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg border">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Upload Media</h2>
        <p className="text-gray-600">Add photos or videos to the gallery</p>
      </div>

      {/* Media Type Selector */}
      <div className="flex gap-4 justify-center">
        <button
          type="button"
          onClick={() => setMediaType('photo')}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg border-2 transition-all ${
            mediaType === 'photo'
              ? 'border-blue-600 bg-blue-50 text-blue-700'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <Image className="w-5 h-5" />
          <span className="font-medium">Photo</span>
        </button>
        <button
          type="button"
          onClick={() => setMediaType('video')}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg border-2 transition-all ${
            mediaType === 'video'
              ? 'border-purple-600 bg-purple-50 text-purple-700'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <Video className="w-5 h-5" />
          <span className="font-medium">Video</span>
        </button>
      </div>

      {/* File Upload Area */}
      <div className="relative">
        {!file ? (
          <label
            htmlFor="file"
            className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
              mediaType === 'photo'
                ? 'border-blue-300 bg-blue-50/50 hover:bg-blue-50'
                : 'border-purple-300 bg-purple-50/50 hover:bg-purple-50'
            }`}
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              {mediaType === 'photo' ? (
                <Image className="w-12 h-12 text-blue-500 mb-3" />
              ) : (
                <Video className="w-12 h-12 text-purple-500 mb-3" />
              )}
              <p className="mb-2 text-sm text-gray-600">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500">
                {mediaType === 'photo' 
                  ? 'PNG, JPG, GIF up to 10MB' 
                  : 'MP4, MOV, WebM up to 100MB'}
              </p>
            </div>
            <Input
              id="file"
              type="file"
              accept={mediaType === 'photo' ? 'image/*' : 'video/*'}
              required
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        ) : (
          <div className="relative rounded-xl overflow-hidden bg-gray-100">
            {mediaType === 'photo' && preview ? (
              <img
                src={preview}
                alt="Preview"
                className="w-full h-48 object-cover"
              />
            ) : mediaType === 'video' && preview ? (
              <video
                src={preview}
                className="w-full h-48 object-cover"
                controls
              />
            ) : null}
            <button
              type="button"
              onClick={clearFile}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="absolute bottom-2 left-2 px-3 py-1 bg-black/70 text-white text-sm rounded-full">
              {file.name}
            </div>
          </div>
        )}
      </div>

      {/* Video Thumbnail Upload */}
      {mediaType === 'video' && (
        <div>
          <Label htmlFor="thumbnail">Video Thumbnail (Optional)</Label>
          <p className="text-xs text-gray-500 mb-2">Upload a custom thumbnail image for the video</p>
          <Input
            id="thumbnail"
            type="file"
            accept="image/*"
            onChange={handleThumbnailChange}
            className="cursor-pointer"
          />
          {thumbnailFile && (
            <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
              <CheckCircle className="w-4 h-4" />
              {thumbnailFile.name}
            </p>
          )}
        </div>
      )}

      {/* Title */}
      <div>
        <Label htmlFor="title">Title *</Label>
        <Input 
          id="title" 
          name="title" 
          required 
          placeholder="Enter a descriptive title"
          className="mt-1"
        />
      </div>

      {/* Description */}
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea 
          id="description" 
          name="description" 
          rows={3} 
          placeholder="Describe the activity or event..."
          className="mt-1"
        />
      </div>

      {/* Location and Date Row */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="location">Location</Label>
          <Input 
            id="location" 
            name="location" 
            placeholder="City, Country" 
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="date">Activity Date</Label>
          <Input 
            id="date" 
            name="date" 
            type="date" 
            className="mt-1"
          />
        </div>
      </div>

      {/* Duration for videos */}
      {mediaType === 'video' && (
        <div>
          <Label htmlFor="duration">Duration</Label>
          <Input 
            id="duration" 
            name="duration" 
            placeholder="e.g., 3:45" 
            className="mt-1"
          />
        </div>
      )}

      {/* Upload Progress */}
      {uploading && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Uploading...</span>
            <span>{uploadProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                mediaType === 'photo' ? 'bg-blue-600' : 'bg-purple-600'
              }`}
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Submit Button */}
      <Button 
        type="submit" 
        disabled={uploading || !file} 
        className={`w-full ${
          mediaType === 'photo' 
            ? 'bg-blue-600 hover:bg-blue-700' 
            : 'bg-purple-600 hover:bg-purple-700'
        }`}
      >
        {uploading ? (
          <>
            <Loader2 className="animate-spin mr-2" />
            Uploading...
          </>
        ) : (
          <>
            <Upload className="mr-2" />
            Upload {mediaType === 'photo' ? 'Photo' : 'Video'}
          </>
        )}
      </Button>
    </form>
  );
}
