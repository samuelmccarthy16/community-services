import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Upload, Loader2 } from 'lucide-react';

export default function PhotoUpload() {
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    const formData = new FormData(e.currentTarget);

    try {
      const fileName = `${Date.now()}-${file.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('activity-photos')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('activity-photos')
        .getPublicUrl(fileName);

      const { error: dbError } = await supabase
        .from('activity_photos')
        .insert({
          title: formData.get('title'),
          description: formData.get('description'),
          location: formData.get('location'),
          activity_date: formData.get('date'),
          image_url: publicUrl,
        });

      if (dbError) throw dbError;

      toast({ title: 'Success!', description: 'Photo uploaded successfully' });
      (e.target as HTMLFormElement).reset();
      setFile(null);
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Upload Activity Photo</h2>
      
      <div>
        <Label htmlFor="file">Photo *</Label>
        <Input
          id="file"
          type="file"
          accept="image/*"
          required
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
      </div>

      <div>
        <Label htmlFor="title">Title *</Label>
        <Input id="title" name="title" required />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" rows={3} />
      </div>

      <div>
        <Label htmlFor="location">Location</Label>
        <Input id="location" name="location" placeholder="City, Country" />
      </div>

      <div>
        <Label htmlFor="date">Activity Date</Label>
        <Input id="date" name="date" type="date" />
      </div>

      <Button type="submit" disabled={uploading} className="w-full">
        {uploading ? <Loader2 className="animate-spin mr-2" /> : <Upload className="mr-2" />}
        {uploading ? 'Uploading...' : 'Upload Photo'}
      </Button>
    </form>
  );
}
