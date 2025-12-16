import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { 
  Upload, 
  Loader2, 
  Image, 
  Video, 
  X, 
  CheckCircle, 
  AlertCircle,
  FolderUp
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface FileWithPreview {
  file: File;
  preview: string;
  status: 'pending' | 'uploading' | 'success' | 'error';
  progress: number;
  title: string;
  mediaType: 'photo' | 'video';
}

interface BulkPhotoUploadProps {
  onUploadComplete?: () => void;
}

export default function BulkPhotoUpload({ onUploadComplete }: BulkPhotoUploadProps) {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [uploading, setUploading] = useState(false);
  const [location, setLocation] = useState('');
  const [activityDate, setActivityDate] = useState('');
  const { toast } = useToast();

  const handleFilesChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    
    const newFiles: FileWithPreview[] = selectedFiles.map((file) => {
      const isVideo = file.type.startsWith('video/');
      return {
        file,
        preview: URL.createObjectURL(file),
        status: 'pending' as const,
        progress: 0,
        title: file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
        mediaType: isVideo ? 'video' : 'photo',
      };
    });

    setFiles((prev) => [...prev, ...newFiles]);
  }, []);

  const removeFile = (index: number) => {
    setFiles((prev) => {
      const newFiles = [...prev];
      URL.revokeObjectURL(newFiles[index].preview);
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const updateFileTitle = (index: number, title: string) => {
    setFiles((prev) => {
      const newFiles = [...prev];
      newFiles[index].title = title;
      return newFiles;
    });
  };

  const uploadFile = async (fileData: FileWithPreview, index: number): Promise<boolean> => {
    try {
      setFiles((prev) => {
        const newFiles = [...prev];
        newFiles[index].status = 'uploading';
        newFiles[index].progress = 20;
        return newFiles;
      });

      const fileName = `${Date.now()}-${fileData.file.name}`;
      const bucket = fileData.mediaType === 'video' ? 'activity-videos' : 'activity-photos';

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(fileName, fileData.file);

      if (uploadError) throw uploadError;

      setFiles((prev) => {
        const newFiles = [...prev];
        newFiles[index].progress = 60;
        return newFiles;
      });

      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName);

      const { error: dbError } = await supabase
        .from('gallery_media')
        .insert({
          title: fileData.title,
          description: '',
          location: location,
          activity_date: activityDate || null,
          media_url: publicUrl,
          media_type: fileData.mediaType,
        });

      if (dbError) throw dbError;

      setFiles((prev) => {
        const newFiles = [...prev];
        newFiles[index].status = 'success';
        newFiles[index].progress = 100;
        return newFiles;
      });

      return true;
    } catch (error) {
      setFiles((prev) => {
        const newFiles = [...prev];
        newFiles[index].status = 'error';
        return newFiles;
      });
      return false;
    }
  };

  const handleUploadAll = async () => {
    if (files.length === 0) return;

    setUploading(true);
    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < files.length; i++) {
      if (files[i].status === 'pending') {
        const success = await uploadFile(files[i], i);
        if (success) {
          successCount++;
        } else {
          errorCount++;
        }
      }
    }

    setUploading(false);

    if (successCount > 0) {
      toast({
        title: 'Upload Complete',
        description: `Successfully uploaded ${successCount} file${successCount > 1 ? 's' : ''}${errorCount > 0 ? `. ${errorCount} failed.` : '.'}`,
      });
      onUploadComplete?.();
    } else if (errorCount > 0) {
      toast({
        title: 'Upload Failed',
        description: `Failed to upload ${errorCount} file${errorCount > 1 ? 's' : ''}.`,
        variant: 'destructive',
      });
    }
  };

  const clearCompleted = () => {
    setFiles((prev) => prev.filter((f) => f.status !== 'success'));
  };

  const pendingCount = files.filter((f) => f.status === 'pending').length;
  const successCount = files.filter((f) => f.status === 'success').length;

  return (
    <div className="space-y-6 p-6 bg-white rounded-xl shadow-lg border">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Bulk Upload</h2>
        <p className="text-gray-600">Upload multiple photos and videos at once</p>
      </div>

      {/* Drop Zone */}
      <label
        htmlFor="bulk-files"
        className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition"
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <FolderUp className="w-12 h-12 text-gray-400 mb-3" />
          <p className="mb-2 text-sm text-gray-600">
            <span className="font-semibold">Click to select files</span> or drag and drop
          </p>
          <p className="text-xs text-gray-500">
            Photos (PNG, JPG) and Videos (MP4, MOV, WebM)
          </p>
        </div>
        <Input
          id="bulk-files"
          type="file"
          accept="image/*,video/*"
          multiple
          onChange={handleFilesChange}
          className="hidden"
        />
      </label>

      {/* Common Fields */}
      {files.length > 0 && (
        <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
          <div>
            <Label htmlFor="bulk-location">Location (applies to all)</Label>
            <Input
              id="bulk-location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="City, Country"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="bulk-date">Activity Date (applies to all)</Label>
            <Input
              id="bulk-date"
              type="date"
              value={activityDate}
              onChange={(e) => setActivityDate(e.target.value)}
              className="mt-1"
            />
          </div>
        </div>
      )}

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-3 max-h-80 overflow-y-auto">
          {files.map((fileData, index) => (
            <div
              key={index}
              className={`flex items-center gap-4 p-3 rounded-lg border ${
                fileData.status === 'success'
                  ? 'bg-green-50 border-green-200'
                  : fileData.status === 'error'
                  ? 'bg-red-50 border-red-200'
                  : fileData.status === 'uploading'
                  ? 'bg-blue-50 border-blue-200'
                  : 'bg-white border-gray-200'
              }`}
            >
              {/* Preview */}
              <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                {fileData.mediaType === 'video' ? (
                  <video
                    src={fileData.preview}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src={fileData.preview}
                    alt={fileData.title}
                    className="w-full h-full object-cover"
                  />
                )}
                <div className={`absolute top-1 left-1 p-1 rounded ${
                  fileData.mediaType === 'video' ? 'bg-purple-600' : 'bg-blue-600'
                }`}>
                  {fileData.mediaType === 'video' ? (
                    <Video className="w-3 h-3 text-white" />
                  ) : (
                    <Image className="w-3 h-3 text-white" />
                  )}
                </div>
              </div>

              {/* Title Input */}
              <div className="flex-1 min-w-0">
                <Input
                  value={fileData.title}
                  onChange={(e) => updateFileTitle(index, e.target.value)}
                  placeholder="Enter title"
                  disabled={fileData.status !== 'pending'}
                  className="text-sm"
                />
                {fileData.status === 'uploading' && (
                  <Progress value={fileData.progress} className="h-1 mt-2" />
                )}
              </div>

              {/* Status Icon */}
              <div className="flex-shrink-0">
                {fileData.status === 'success' ? (
                  <CheckCircle className="w-6 h-6 text-green-600" />
                ) : fileData.status === 'error' ? (
                  <AlertCircle className="w-6 h-6 text-red-600" />
                ) : fileData.status === 'uploading' ? (
                  <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
                ) : (
                  <button
                    onClick={() => removeFile(index)}
                    className="p-1 text-gray-400 hover:text-red-500 transition"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Actions */}
      {files.length > 0 && (
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="text-sm text-gray-600">
            {pendingCount} pending • {successCount} uploaded
          </div>
          <div className="flex gap-3">
            {successCount > 0 && (
              <Button variant="outline" onClick={clearCompleted}>
                Clear Completed
              </Button>
            )}
            <Button
              onClick={handleUploadAll}
              disabled={uploading || pendingCount === 0}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {uploading ? (
                <>
                  <Loader2 className="animate-spin mr-2 w-4 h-4" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 w-4 h-4" />
                  Upload All ({pendingCount})
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
