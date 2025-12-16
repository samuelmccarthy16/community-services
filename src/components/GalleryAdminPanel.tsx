import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { galleryMedia as staticGalleryMedia, GalleryMedia } from '@/data/galleryMedia';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Image,
  Video,
  Trash2,
  Edit,
  MoreHorizontal,
  Search,
  Filter,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  CheckCircle,
  XCircle,
  Clock,
  HardDrive,
  RefreshCw,
  Download,
  Eye,
  Upload,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ExtendedGalleryMedia extends GalleryMedia {
  id: string;
  status: 'approved' | 'pending' | 'rejected';
  file_size?: number;
}

type SortField = 'title' | 'media_type' | 'location' | 'activity_date' | 'created_at' | 'status';
type SortDirection = 'asc' | 'desc';

export default function GalleryAdminPanel() {
  const { toast } = useToast();
  const [mediaItems, setMediaItems] = useState<ExtendedGalleryMedia[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'photo' | 'video'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'approved' | 'pending' | 'rejected'>('all');
  const [sortField, setSortField] = useState<SortField>('created_at');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  
  // Edit modal state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ExtendedGalleryMedia | null>(null);
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    location: '',
    activity_date: '',
  });
  
  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<ExtendedGalleryMedia | null>(null);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);
  
  // Preview modal state
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [previewItem, setPreviewItem] = useState<ExtendedGalleryMedia | null>(null);

  // Fetch media items from Supabase or use static data
  const fetchMediaItems = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('gallery_media')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data && data.length > 0) {
        const items: ExtendedGalleryMedia[] = data.map((item: any) => ({
          ...item,
          status: item.status || 'approved',
          file_size: item.file_size || Math.floor(Math.random() * 5000000) + 500000,
        }));
        setMediaItems(items);
      } else {
        // Use static data as fallback with generated IDs
        const items: ExtendedGalleryMedia[] = staticGalleryMedia.map((item, index) => ({
          ...item,
          id: `static-${index}`,
          status: index % 5 === 0 ? 'pending' : index % 7 === 0 ? 'rejected' : 'approved',
          file_size: Math.floor(Math.random() * 5000000) + 500000,
          created_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        }));
        setMediaItems(items);
      }
    } catch (error) {
      console.error('Error fetching media:', error);
      // Use static data as fallback
      const items: ExtendedGalleryMedia[] = staticGalleryMedia.map((item, index) => ({
        ...item,
        id: `static-${index}`,
        status: index % 5 === 0 ? 'pending' : index % 7 === 0 ? 'rejected' : 'approved',
        file_size: Math.floor(Math.random() * 5000000) + 500000,
        created_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      }));
      setMediaItems(items);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMediaItems();
  }, []);

  // Calculate statistics
  const statistics = useMemo(() => {
    const totalPhotos = mediaItems.filter(item => item.media_type === 'photo').length;
    const totalVideos = mediaItems.filter(item => item.media_type === 'video').length;
    const pendingCount = mediaItems.filter(item => item.status === 'pending').length;
    const approvedCount = mediaItems.filter(item => item.status === 'approved').length;
    const rejectedCount = mediaItems.filter(item => item.status === 'rejected').length;
    const totalStorage = mediaItems.reduce((acc, item) => acc + (item.file_size || 0), 0);
    
    return {
      totalPhotos,
      totalVideos,
      totalItems: mediaItems.length,
      pendingCount,
      approvedCount,
      rejectedCount,
      totalStorage,
    };
  }, [mediaItems]);

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Filter and sort media items
  const filteredAndSortedItems = useMemo(() => {
    let items = [...mediaItems];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      items = items.filter(
        item =>
          item.title.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          item.location.toLowerCase().includes(query)
      );
    }

    // Apply type filter
    if (filterType !== 'all') {
      items = items.filter(item => item.media_type === filterType);
    }

    // Apply status filter
    if (filterStatus !== 'all') {
      items = items.filter(item => item.status === filterStatus);
    }

    // Apply sorting
    items.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'media_type':
          comparison = a.media_type.localeCompare(b.media_type);
          break;
        case 'location':
          comparison = a.location.localeCompare(b.location);
          break;
        case 'activity_date':
          comparison = new Date(a.activity_date).getTime() - new Date(b.activity_date).getTime();
          break;
        case 'created_at':
          comparison = new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime();
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return items;
  }, [mediaItems, searchQuery, filterType, filterStatus, sortField, sortDirection]);

  // Handle sort
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Handle select all
  const handleSelectAll = () => {
    if (selectedItems.size === filteredAndSortedItems.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(filteredAndSortedItems.map(item => item.id)));
    }
  };

  // Handle individual select
  const handleSelectItem = (id: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedItems(newSelected);
  };

  // Open edit modal
  const openEditModal = (item: ExtendedGalleryMedia) => {
    setEditingItem(item);
    setEditForm({
      title: item.title,
      description: item.description,
      location: item.location,
      activity_date: item.activity_date,
    });
    setEditModalOpen(true);
  };

  // Save edit
  const handleSaveEdit = async () => {
    if (!editingItem) return;

    try {
      // Check if it's a static item
      if (editingItem.id.startsWith('static-')) {
        // Update local state for static items
        setMediaItems(prev =>
          prev.map(item =>
            item.id === editingItem.id
              ? { ...item, ...editForm }
              : item
          )
        );
        toast({
          title: 'Success',
          description: 'Media item updated successfully (local only)',
        });
      } else {
        // Update in Supabase
        const { error } = await supabase
          .from('gallery_media')
          .update({
            title: editForm.title,
            description: editForm.description,
            location: editForm.location,
            activity_date: editForm.activity_date,
          })
          .eq('id', editingItem.id);

        if (error) throw error;

        setMediaItems(prev =>
          prev.map(item =>
            item.id === editingItem.id
              ? { ...item, ...editForm }
              : item
          )
        );
        toast({
          title: 'Success',
          description: 'Media item updated successfully',
        });
      }
    } catch (error) {
      console.error('Error updating media:', error);
      toast({
        title: 'Error',
        description: 'Failed to update media item',
        variant: 'destructive',
      });
    } finally {
      setEditModalOpen(false);
      setEditingItem(null);
    }
  };

  // Delete single item
  const handleDeleteItem = async () => {
    if (!itemToDelete) return;

    try {
      if (!itemToDelete.id.startsWith('static-')) {
        // Delete from Supabase
        const { error } = await supabase
          .from('gallery_media')
          .delete()
          .eq('id', itemToDelete.id);

        if (error) throw error;

        // Also delete from storage if applicable
        if (itemToDelete.media_url.includes('supabase')) {
          const bucket = itemToDelete.media_type === 'photo' ? 'activity-photos' : 'activity-videos';
          const path = itemToDelete.media_url.split('/').pop();
          if (path) {
            await supabase.storage.from(bucket).remove([path]);
          }
        }
      }

      setMediaItems(prev => prev.filter(item => item.id !== itemToDelete.id));
      setSelectedItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemToDelete.id);
        return newSet;
      });

      toast({
        title: 'Success',
        description: 'Media item deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting media:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete media item',
        variant: 'destructive',
      });
    } finally {
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    }
  };

  // Bulk delete
  const handleBulkDelete = async () => {
    try {
      const idsToDelete = Array.from(selectedItems);
      const supabaseIds = idsToDelete.filter(id => !id.startsWith('static-'));

      if (supabaseIds.length > 0) {
        const { error } = await supabase
          .from('gallery_media')
          .delete()
          .in('id', supabaseIds);

        if (error) throw error;
      }

      setMediaItems(prev => prev.filter(item => !selectedItems.has(item.id)));
      setSelectedItems(new Set());

      toast({
        title: 'Success',
        description: `${idsToDelete.length} items deleted successfully`,
      });
    } catch (error) {
      console.error('Error bulk deleting:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete some items',
        variant: 'destructive',
      });
    } finally {
      setBulkDeleteDialogOpen(false);
    }
  };

  // Update status (approve/reject)
  const handleUpdateStatus = async (item: ExtendedGalleryMedia, newStatus: 'approved' | 'rejected') => {
    try {
      if (!item.id.startsWith('static-')) {
        const { error } = await supabase
          .from('gallery_media')
          .update({ status: newStatus })
          .eq('id', item.id);

        if (error) throw error;
      }

      setMediaItems(prev =>
        prev.map(i =>
          i.id === item.id ? { ...i, status: newStatus } : i
        )
      );

      toast({
        title: 'Success',
        description: `Media ${newStatus === 'approved' ? 'approved' : 'rejected'} successfully`,
      });
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update status',
        variant: 'destructive',
      });
    }
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            <CheckCircle className="w-3 h-3 mr-1" />
            Approved
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      case 'rejected':
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            <XCircle className="w-3 h-3 mr-1" />
            Rejected
          </Badge>
        );
      default:
        return null;
    }
  };

  // Get sort icon
  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-4 h-4 ml-1 opacity-50" />;
    }
    return sortDirection === 'asc' ? (
      <ArrowUp className="w-4 h-4 ml-1" />
    ) : (
      <ArrowDown className="w-4 h-4 ml-1" />
    );
  };

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500 rounded-lg">
              <Image className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-blue-600 font-medium">Photos</p>
              <p className="text-2xl font-bold text-blue-900">{statistics.totalPhotos}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500 rounded-lg">
              <Video className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-purple-600 font-medium">Videos</p>
              <p className="text-2xl font-bold text-purple-900">{statistics.totalVideos}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500 rounded-lg">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-green-600 font-medium">Approved</p>
              <p className="text-2xl font-bold text-green-900">{statistics.approvedCount}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-500 rounded-lg">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-yellow-600 font-medium">Pending</p>
              <p className="text-2xl font-bold text-yellow-900">{statistics.pendingCount}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-500 rounded-lg">
              <XCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-red-600 font-medium">Rejected</p>
              <p className="text-2xl font-bold text-red-900">{statistics.rejectedCount}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-500 rounded-lg">
              <HardDrive className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">Storage</p>
              <p className="text-2xl font-bold text-gray-900">{formatFileSize(statistics.totalStorage)}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters and Actions */}
      <Card className="p-4">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-3 flex-1 w-full lg:w-auto">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search by title, description, location..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Type Filter */}
            <Select value={filterType} onValueChange={(value: any) => setFilterType(value)}>
              <SelectTrigger className="w-[140px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="photo">Photos</SelectItem>
                <SelectItem value="video">Videos</SelectItem>
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select value={filterStatus} onValueChange={(value: any) => setFilterStatus(value)}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            {selectedItems.size > 0 && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setBulkDeleteDialogOpen(true)}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete ({selectedItems.size})
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={fetchMediaItems}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
      </Card>

      {/* Media Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedItems.size === filteredAndSortedItems.length && filteredAndSortedItems.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead className="w-20">Preview</TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('title')}
                >
                  <div className="flex items-center">
                    Title
                    {getSortIcon('title')}
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('media_type')}
                >
                  <div className="flex items-center">
                    Type
                    {getSortIcon('media_type')}
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('location')}
                >
                  <div className="flex items-center">
                    Location
                    {getSortIcon('location')}
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('activity_date')}
                >
                  <div className="flex items-center">
                    Activity Date
                    {getSortIcon('activity_date')}
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('status')}
                >
                  <div className="flex items-center">
                    Status
                    {getSortIcon('status')}
                  </div>
                </TableHead>
                <TableHead>Size</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8">
                    <div className="flex items-center justify-center gap-2">
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      Loading media items...
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredAndSortedItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                    No media items found
                  </TableCell>
                </TableRow>
              ) : (
                filteredAndSortedItems.map(item => (
                  <TableRow key={item.id} className="hover:bg-gray-50">
                    <TableCell>
                      <Checkbox
                        checked={selectedItems.has(item.id)}
                        onCheckedChange={() => handleSelectItem(item.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <div
                        className="w-16 h-12 rounded overflow-hidden bg-gray-100 cursor-pointer hover:opacity-80 transition"
                        onClick={() => {
                          setPreviewItem(item);
                          setPreviewModalOpen(true);
                        }}
                      >
                        {item.media_type === 'photo' ? (
                          <img
                            src={item.media_url}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-purple-100">
                            <Video className="w-6 h-6 text-purple-600" />
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-[200px]">
                        <p className="font-medium truncate">{item.title}</p>
                        <p className="text-sm text-gray-500 truncate">{item.description}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={item.media_type === 'photo' ? 'border-blue-300 text-blue-700' : 'border-purple-300 text-purple-700'}>
                        {item.media_type === 'photo' ? (
                          <Image className="w-3 h-3 mr-1" />
                        ) : (
                          <Video className="w-3 h-3 mr-1" />
                        )}
                        {item.media_type}
                      </Badge>
                    </TableCell>
                    <TableCell>{item.location}</TableCell>
                    <TableCell>{new Date(item.activity_date).toLocaleDateString()}</TableCell>
                    <TableCell>{getStatusBadge(item.status)}</TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {formatFileSize(item.file_size || 0)}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              setPreviewItem(item);
                              setPreviewModalOpen(true);
                            }}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            Preview
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openEditModal(item)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => window.open(item.media_url, '_blank')}
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </DropdownMenuItem>
                          {item.status === 'pending' && (
                            <>
                              <DropdownMenuItem
                                onClick={() => handleUpdateStatus(item, 'approved')}
                                className="text-green-600"
                              >
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Approve
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleUpdateStatus(item, 'rejected')}
                                className="text-red-600"
                              >
                                <XCircle className="w-4 h-4 mr-2" />
                                Reject
                              </DropdownMenuItem>
                            </>
                          )}
                          {item.status === 'rejected' && (
                            <DropdownMenuItem
                              onClick={() => handleUpdateStatus(item, 'approved')}
                              className="text-green-600"
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Approve
                            </DropdownMenuItem>
                          )}
                          {item.status === 'approved' && (
                            <DropdownMenuItem
                              onClick={() => handleUpdateStatus(item, 'rejected')}
                              className="text-red-600"
                            >
                              <XCircle className="w-4 h-4 mr-2" />
                              Reject
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            onClick={() => {
                              setItemToDelete(item);
                              setDeleteDialogOpen(true);
                            }}
                            className="text-red-600"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Table Footer */}
        <div className="px-4 py-3 border-t bg-gray-50 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing {filteredAndSortedItems.length} of {mediaItems.length} items
            {selectedItems.size > 0 && ` (${selectedItems.size} selected)`}
          </p>
        </div>
      </Card>

      {/* Edit Modal */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Media Item</DialogTitle>
            <DialogDescription>
              Update the metadata for this media item
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                value={editForm.title}
                onChange={e => setEditForm(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={editForm.description}
                onChange={e => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-location">Location</Label>
              <Input
                id="edit-location"
                value={editForm.location}
                onChange={e => setEditForm(prev => ({ ...prev, location: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-date">Activity Date</Label>
              <Input
                id="edit-date"
                type="date"
                value={editForm.activity_date}
                onChange={e => setEditForm(prev => ({ ...prev, activity_date: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Media Item</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{itemToDelete?.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteItem}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk Delete Confirmation Dialog */}
      <AlertDialog open={bulkDeleteDialogOpen} onOpenChange={setBulkDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Multiple Items</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedItems.size} selected items? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBulkDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Preview Modal */}
      <Dialog open={previewModalOpen} onOpenChange={setPreviewModalOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>{previewItem?.title}</DialogTitle>
            <DialogDescription>{previewItem?.description}</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {previewItem?.media_type === 'photo' ? (
              <img
                src={previewItem.media_url}
                alt={previewItem.title}
                className="w-full h-auto max-h-[500px] object-contain rounded-lg"
              />
            ) : (
              <video
                src={previewItem?.media_url}
                controls
                className="w-full h-auto max-h-[500px] rounded-lg"
              />
            )}
            <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600">
              <div>
                <span className="font-medium">Location:</span> {previewItem?.location}
              </div>
              <div>
                <span className="font-medium">Date:</span>{' '}
                {previewItem?.activity_date && new Date(previewItem.activity_date).toLocaleDateString()}
              </div>
              <div>
                <span className="font-medium">Type:</span> {previewItem?.media_type}
              </div>
              <div>
                <span className="font-medium">Status:</span> {previewItem?.status}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
