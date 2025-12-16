import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import AdminVolunteerDashboard from '@/components/AdminVolunteerDashboard';
import NewsletterAdmin from '@/components/NewsletterAdmin';
import ShiftReminderScheduler from '@/components/ShiftReminderScheduler';
import OrderManagement from '@/components/OrderManagement';
import AdminEventDashboard from '@/components/AdminEventDashboard';
import AdminConferenceDashboard from '@/components/AdminConferenceDashboard';
import AdminCourseDashboard from '@/components/AdminCourseDashboard';
import MediaUpload from '@/components/MediaUpload';
import BulkPhotoUpload from '@/components/BulkPhotoUpload';
import GalleryAdminPanel from '@/components/GalleryAdminPanel';

import { Shield, Image, Video, Upload, LayoutGrid } from 'lucide-react';



export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [galleryView, setGalleryView] = useState<'manage' | 'upload'>('manage');
  const [mediaUploadMode, setMediaUploadMode] = useState<'single' | 'bulk'>('single');

  const handleLogin = () => {
    // Simple password check - in production use proper authentication
    if (password === 'admin123') {
      setIsAuthenticated(true);
    } else {
      alert('Invalid password');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <Header />
        <div className="container mx-auto px-4 py-20">
          <Card className="max-w-md mx-auto p-8">
            <div className="text-center mb-6">
              <Shield className="h-16 w-16 mx-auto mb-4 text-blue-600" />
              <h1 className="text-3xl font-bold mb-2">Admin Portal</h1>
              <p className="text-gray-600">Enter password to access</p>
            </div>
            <div className="space-y-4">
              <Input
                type="password"
                placeholder="Admin Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && handleLogin()}
              />
              <Button onClick={handleLogin} className="w-full">Login</Button>
            </div>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage volunteers, programs, and operations</p>
        </div>

        <Tabs defaultValue="volunteers">
          <TabsList className="flex-wrap h-auto gap-1">
            <TabsTrigger value="volunteers">Volunteer Management</TabsTrigger>
            <TabsTrigger value="events">Event Management</TabsTrigger>
            <TabsTrigger value="conferences">Conference Registrations</TabsTrigger>
            <TabsTrigger value="courses">Course Management</TabsTrigger>
            <TabsTrigger value="gallery">Gallery Management</TabsTrigger>
            <TabsTrigger value="orders">Order Management</TabsTrigger>
            <TabsTrigger value="newsletter">Newsletter Subscribers</TabsTrigger>
            <TabsTrigger value="reminders">Shift Reminders</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>




          <TabsContent value="volunteers" className="mt-6">
            <AdminVolunteerDashboard />
          </TabsContent>

          <TabsContent value="events" className="mt-6">
            <AdminEventDashboard />
          </TabsContent>

          <TabsContent value="conferences" className="mt-6">
            <AdminConferenceDashboard />
          </TabsContent>

          <TabsContent value="courses" className="mt-6">
            <AdminCourseDashboard />
          </TabsContent>

          <TabsContent value="gallery" className="mt-6">
            <div className="space-y-6">
              {/* Gallery View Toggle */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Image className="w-6 h-6 text-blue-600" />
                  <Video className="w-6 h-6 text-purple-600" />
                  <h2 className="text-2xl font-bold">Gallery Management</h2>
                </div>
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setGalleryView('manage')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition flex items-center gap-2 ${
                      galleryView === 'manage' 
                        ? 'bg-white shadow text-blue-600' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <LayoutGrid className="w-4 h-4" />
                    Manage Media
                  </button>
                  <button
                    onClick={() => setGalleryView('upload')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition flex items-center gap-2 ${
                      galleryView === 'upload' 
                        ? 'bg-white shadow text-blue-600' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Upload className="w-4 h-4" />
                    Upload Media
                  </button>
                </div>
              </div>

              {galleryView === 'manage' ? (
                <GalleryAdminPanel />
              ) : (
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-xl font-bold">Upload New Media</h3>
                      <p className="text-gray-600 mt-1">Upload photos and videos to the gallery</p>
                    </div>
                    <div className="flex bg-gray-100 rounded-lg p-1">
                      <button
                        onClick={() => setMediaUploadMode('single')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                          mediaUploadMode === 'single' 
                            ? 'bg-white shadow text-blue-600' 
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        Single Upload
                      </button>
                      <button
                        onClick={() => setMediaUploadMode('bulk')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                          mediaUploadMode === 'bulk' 
                            ? 'bg-white shadow text-blue-600' 
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        Bulk Upload
                      </button>
                    </div>
                  </div>
                  
                  {mediaUploadMode === 'single' ? (
                    <MediaUpload />
                  ) : (
                    <BulkPhotoUpload />
                  )}
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="orders" className="mt-6">
            <OrderManagement />
          </TabsContent>

          <TabsContent value="newsletter" className="mt-6">
            <NewsletterAdmin />
          </TabsContent>



          <TabsContent value="reminders" className="mt-6">
            <ShiftReminderScheduler />
          </TabsContent>


          <TabsContent value="settings" className="mt-6">
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4">System Settings</h3>
              <p className="text-gray-600">Settings panel coming soon...</p>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </div>
  );
}
