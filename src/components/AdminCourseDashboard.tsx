import React, { useState } from 'react';
import { useCourses, Course, Module, Lesson } from '@/contexts/CourseContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Plus, Edit, Trash2, BookOpen, Users, GraduationCap, 
  ChevronDown, ChevronRight, Video, FileText, HelpCircle, 
  ClipboardList, Eye, EyeOff, DollarSign, Clock, Award
} from 'lucide-react';

const AdminCourseDashboard: React.FC = () => {
  const { 
    courses, students, enrollments, 
    addCourse, updateCourse, deleteCourse,
    addModule, updateModule, deleteModule,
    addLesson, updateLesson, deleteLesson
  } = useCourses();

  const [activeTab, setActiveTab] = useState('courses');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [showModuleForm, setShowModuleForm] = useState(false);
  const [showLessonForm, setShowLessonForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [editingModule, setEditingModule] = useState<Module | null>(null);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);

  // Course form state
  const [courseForm, setCourseForm] = useState({
    title: '',
    description: '',
    shortDescription: '',
    duration: '',
    level: 'Beginner' as 'Beginner' | 'Intermediate' | 'Advanced',
    instructorName: '',
    instructorBio: '',
    imageUrl: '',
    price: 0,
    isPublished: false,
    isFeatured: false,
    category: ''
  });

  // Module form state
  const [moduleForm, setModuleForm] = useState({
    title: '',
    description: '',
    sortOrder: 0
  });

  // Lesson form state
  const [lessonForm, setLessonForm] = useState({
    title: '',
    type: 'video' as 'video' | 'text' | 'quiz' | 'assignment',
    content: '',
    videoUrl: '',
    duration: 0,
    sortOrder: 0,
    isPreview: false
  });

  const handleSaveCourse = () => {
    if (editingCourse) {
      updateCourse(editingCourse.id, courseForm);
    } else {
      addCourse(courseForm);
    }
    setShowCourseForm(false);
    resetCourseForm();
  };

  const handleSaveModule = () => {
    if (!selectedCourse) return;
    if (editingModule) {
      updateModule(editingModule.id, { ...moduleForm, courseId: selectedCourse.id });
    } else {
      addModule(selectedCourse.id, { ...moduleForm, courseId: selectedCourse.id });
    }
    setShowModuleForm(false);
    resetModuleForm();
  };

  const handleSaveLesson = () => {
    if (!selectedModuleId) return;
    if (editingLesson) {
      updateLesson(editingLesson.id, { ...lessonForm, moduleId: selectedModuleId });
    } else {
      addLesson(selectedModuleId, { ...lessonForm, moduleId: selectedModuleId });
    }
    setShowLessonForm(false);
    resetLessonForm();
  };

  const resetCourseForm = () => {
    setCourseForm({
      title: '',
      description: '',
      shortDescription: '',
      duration: '',
      level: 'Beginner',
      instructorName: '',
      instructorBio: '',
      imageUrl: '',
      price: 0,
      isPublished: false,
      isFeatured: false,
      category: ''
    });
    setEditingCourse(null);
  };

  const resetModuleForm = () => {
    setModuleForm({ title: '', description: '', sortOrder: 0 });
    setEditingModule(null);
  };

  const resetLessonForm = () => {
    setLessonForm({
      title: '',
      type: 'video',
      content: '',
      videoUrl: '',
      duration: 0,
      sortOrder: 0,
      isPreview: false
    });
    setEditingLesson(null);
    setSelectedModuleId(null);
  };

  const openEditCourse = (course: Course) => {
    setEditingCourse(course);
    setCourseForm({
      title: course.title,
      description: course.description,
      shortDescription: course.shortDescription,
      duration: course.duration,
      level: course.level,
      instructorName: course.instructorName,
      instructorBio: course.instructorBio,
      imageUrl: course.imageUrl,
      price: course.price,
      isPublished: course.isPublished,
      isFeatured: course.isFeatured,
      category: course.category
    });
    setShowCourseForm(true);
  };

  const openEditModule = (module: Module) => {
    setEditingModule(module);
    setModuleForm({
      title: module.title,
      description: module.description,
      sortOrder: module.sortOrder
    });
    setShowModuleForm(true);
  };

  const openEditLesson = (lesson: Lesson, moduleId: string) => {
    setEditingLesson(lesson);
    setSelectedModuleId(moduleId);
    setLessonForm({
      title: lesson.title,
      type: lesson.type,
      content: lesson.content,
      videoUrl: lesson.videoUrl || '',
      duration: lesson.duration,
      sortOrder: lesson.sortOrder,
      isPreview: lesson.isPreview
    });
    setShowLessonForm(true);
  };

  const toggleModuleExpand = (moduleId: string) => {
    setExpandedModules(prev => {
      const next = new Set(prev);
      if (next.has(moduleId)) {
        next.delete(moduleId);
      } else {
        next.add(moduleId);
      }
      return next;
    });
  };

  const getLessonIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="h-4 w-4" />;
      case 'text': return <FileText className="h-4 w-4" />;
      case 'quiz': return <HelpCircle className="h-4 w-4" />;
      case 'assignment': return <ClipboardList className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const totalStudents = students.length;
  const totalEnrollments = enrollments.length;
  const publishedCourses = courses.filter(c => c.isPublished).length;

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Courses</p>
              <p className="text-3xl font-bold">{courses.length}</p>
            </div>
            <BookOpen className="h-10 w-10 text-blue-200" />
          </div>
        </Card>
        <Card className="p-4 bg-gradient-to-r from-green-500 to-green-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Published</p>
              <p className="text-3xl font-bold">{publishedCourses}</p>
            </div>
            <Eye className="h-10 w-10 text-green-200" />
          </div>
        </Card>
        <Card className="p-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Students</p>
              <p className="text-3xl font-bold">{totalStudents}</p>
            </div>
            <Users className="h-10 w-10 text-purple-200" />
          </div>
        </Card>
        <Card className="p-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Enrollments</p>
              <p className="text-3xl font-bold">{totalEnrollments}</p>
            </div>
            <GraduationCap className="h-10 w-10 text-orange-200" />
          </div>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 w-full max-w-md">
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
        </TabsList>

        {/* Courses Tab */}
        <TabsContent value="courses" className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">Course Management</h3>
            <Dialog open={showCourseForm} onOpenChange={setShowCourseForm}>
              <DialogTrigger asChild>
                <Button onClick={() => { resetCourseForm(); setShowCourseForm(true); }}>
                  <Plus className="h-4 w-4 mr-2" /> Add Course
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingCourse ? 'Edit Course' : 'Add New Course'}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <Label>Course Title</Label>
                      <Input
                        value={courseForm.title}
                        onChange={e => setCourseForm(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Enter course title"
                      />
                    </div>
                    <div className="col-span-2">
                      <Label>Short Description</Label>
                      <Input
                        value={courseForm.shortDescription}
                        onChange={e => setCourseForm(prev => ({ ...prev, shortDescription: e.target.value }))}
                        placeholder="Brief description for cards"
                      />
                    </div>
                    <div className="col-span-2">
                      <Label>Full Description</Label>
                      <Textarea
                        value={courseForm.description}
                        onChange={e => setCourseForm(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Detailed course description"
                        rows={4}
                      />
                    </div>
                    <div>
                      <Label>Duration</Label>
                      <Input
                        value={courseForm.duration}
                        onChange={e => setCourseForm(prev => ({ ...prev, duration: e.target.value }))}
                        placeholder="e.g., 8 weeks"
                      />
                    </div>
                    <div>
                      <Label>Level</Label>
                      <Select
                        value={courseForm.level}
                        onValueChange={value => setCourseForm(prev => ({ ...prev, level: value as any }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Beginner">Beginner</SelectItem>
                          <SelectItem value="Intermediate">Intermediate</SelectItem>
                          <SelectItem value="Advanced">Advanced</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Category</Label>
                      <Input
                        value={courseForm.category}
                        onChange={e => setCourseForm(prev => ({ ...prev, category: e.target.value }))}
                        placeholder="e.g., Mental Health"
                      />
                    </div>
                    <div>
                      <Label>Price ($)</Label>
                      <Input
                        type="number"
                        value={courseForm.price}
                        onChange={e => setCourseForm(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                        placeholder="0 for free"
                      />
                    </div>
                    <div>
                      <Label>Instructor Name</Label>
                      <Input
                        value={courseForm.instructorName}
                        onChange={e => setCourseForm(prev => ({ ...prev, instructorName: e.target.value }))}
                        placeholder="Instructor name"
                      />
                    </div>
                    <div>
                      <Label>Image URL</Label>
                      <Input
                        value={courseForm.imageUrl}
                        onChange={e => setCourseForm(prev => ({ ...prev, imageUrl: e.target.value }))}
                        placeholder="Course thumbnail URL"
                      />
                    </div>
                    <div className="col-span-2">
                      <Label>Instructor Bio</Label>
                      <Textarea
                        value={courseForm.instructorBio}
                        onChange={e => setCourseForm(prev => ({ ...prev, instructorBio: e.target.value }))}
                        placeholder="Brief instructor biography"
                        rows={2}
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={courseForm.isPublished}
                        onCheckedChange={checked => setCourseForm(prev => ({ ...prev, isPublished: checked }))}
                      />
                      <Label>Published</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={courseForm.isFeatured}
                        onCheckedChange={checked => setCourseForm(prev => ({ ...prev, isFeatured: checked }))}
                      />
                      <Label>Featured</Label>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2 pt-4">
                    <Button variant="outline" onClick={() => setShowCourseForm(false)}>Cancel</Button>
                    <Button onClick={handleSaveCourse}>
                      {editingCourse ? 'Update Course' : 'Create Course'}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {courses.map(course => (
              <Card key={course.id} className="p-4">
                <div className="flex items-start gap-4">
                  {course.imageUrl && (
                    <img 
                      src={course.imageUrl} 
                      alt={course.title}
                      className="w-32 h-20 object-cover rounded-lg"
                    />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-lg">{course.title}</h4>
                      {course.isPublished ? (
                        <Badge className="bg-green-100 text-green-700">Published</Badge>
                      ) : (
                        <Badge variant="secondary">Draft</Badge>
                      )}
                      {course.isFeatured && (
                        <Badge className="bg-yellow-100 text-yellow-700">Featured</Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{course.shortDescription}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" /> {course.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <Award className="h-4 w-4" /> {course.level}
                      </span>
                      <span className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4" /> {course.modules.length} modules
                      </span>
                      <span className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" /> {course.price === 0 ? 'Free' : `$${course.price}`}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setSelectedCourse(course);
                        setActiveTab('content');
                      }}
                    >
                      <BookOpen className="h-4 w-4 mr-1" /> Content
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => openEditCourse(course)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-red-600 hover:text-red-700"
                      onClick={() => {
                        if (confirm('Delete this course?')) deleteCourse(course.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Content Tab */}
        <TabsContent value="content" className="mt-6">
          {!selectedCourse ? (
            <Card className="p-8 text-center">
              <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600">Select a course from the Courses tab to manage its content</p>
            </Card>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold">{selectedCourse.title}</h3>
                  <p className="text-gray-600">Manage modules and lessons</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setSelectedCourse(null)}>
                    Back to Courses
                  </Button>
                  <Dialog open={showModuleForm} onOpenChange={setShowModuleForm}>
                    <DialogTrigger asChild>
                      <Button onClick={() => { resetModuleForm(); setShowModuleForm(true); }}>
                        <Plus className="h-4 w-4 mr-2" /> Add Module
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{editingModule ? 'Edit Module' : 'Add New Module'}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div>
                          <Label>Module Title</Label>
                          <Input
                            value={moduleForm.title}
                            onChange={e => setModuleForm(prev => ({ ...prev, title: e.target.value }))}
                            placeholder="Enter module title"
                          />
                        </div>
                        <div>
                          <Label>Description</Label>
                          <Textarea
                            value={moduleForm.description}
                            onChange={e => setModuleForm(prev => ({ ...prev, description: e.target.value }))}
                            placeholder="Module description"
                          />
                        </div>
                        <div>
                          <Label>Sort Order</Label>
                          <Input
                            type="number"
                            value={moduleForm.sortOrder}
                            onChange={e => setModuleForm(prev => ({ ...prev, sortOrder: parseInt(e.target.value) || 0 }))}
                          />
                        </div>
                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" onClick={() => setShowModuleForm(false)}>Cancel</Button>
                          <Button onClick={handleSaveModule}>
                            {editingModule ? 'Update Module' : 'Create Module'}
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              {/* Modules List */}
              <div className="space-y-3">
                {selectedCourse.modules.sort((a, b) => a.sortOrder - b.sortOrder).map(module => (
                  <Card key={module.id} className="overflow-hidden">
                    <div 
                      className="p-4 bg-gray-50 flex items-center justify-between cursor-pointer hover:bg-gray-100"
                      onClick={() => toggleModuleExpand(module.id)}
                    >
                      <div className="flex items-center gap-3">
                        {expandedModules.has(module.id) ? (
                          <ChevronDown className="h-5 w-5 text-gray-500" />
                        ) : (
                          <ChevronRight className="h-5 w-5 text-gray-500" />
                        )}
                        <div>
                          <h4 className="font-semibold">{module.title}</h4>
                          <p className="text-sm text-gray-600">{module.lessons.length} lessons</p>
                        </div>
                      </div>
                      <div className="flex gap-2" onClick={e => e.stopPropagation()}>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setSelectedModuleId(module.id);
                            resetLessonForm();
                            setShowLessonForm(true);
                          }}
                        >
                          <Plus className="h-4 w-4 mr-1" /> Lesson
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => openEditModule(module)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-red-600"
                          onClick={() => {
                            if (confirm('Delete this module and all its lessons?')) deleteModule(module.id);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    {expandedModules.has(module.id) && (
                      <div className="border-t">
                        {module.lessons.sort((a, b) => a.sortOrder - b.sortOrder).map(lesson => (
                          <div 
                            key={lesson.id}
                            className="p-3 pl-12 flex items-center justify-between border-b last:border-b-0 hover:bg-gray-50"
                          >
                            <div className="flex items-center gap-3">
                              {getLessonIcon(lesson.type)}
                              <div>
                                <p className="font-medium">{lesson.title}</p>
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                  <span className="capitalize">{lesson.type}</span>
                                  <span>•</span>
                                  <span>{lesson.duration} min</span>
                                  {lesson.isPreview && (
                                    <>
                                      <span>•</span>
                                      <Badge variant="outline" className="text-xs">Preview</Badge>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => openEditLesson(lesson, module.id)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="text-red-600"
                                onClick={() => {
                                  if (confirm('Delete this lesson?')) deleteLesson(lesson.id);
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                        {module.lessons.length === 0 && (
                          <p className="p-4 pl-12 text-gray-500 text-sm">No lessons yet. Add your first lesson.</p>
                        )}
                      </div>
                    )}
                  </Card>
                ))}
                {selectedCourse.modules.length === 0 && (
                  <Card className="p-8 text-center">
                    <p className="text-gray-600">No modules yet. Add your first module to start building the course.</p>
                  </Card>
                )}
              </div>

              {/* Lesson Form Dialog */}
              <Dialog open={showLessonForm} onOpenChange={setShowLessonForm}>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>{editingLesson ? 'Edit Lesson' : 'Add New Lesson'}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <Label>Lesson Title</Label>
                        <Input
                          value={lessonForm.title}
                          onChange={e => setLessonForm(prev => ({ ...prev, title: e.target.value }))}
                          placeholder="Enter lesson title"
                        />
                      </div>
                      <div>
                        <Label>Lesson Type</Label>
                        <Select
                          value={lessonForm.type}
                          onValueChange={value => setLessonForm(prev => ({ ...prev, type: value as any }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="video">Video</SelectItem>
                            <SelectItem value="text">Text/Article</SelectItem>
                            <SelectItem value="quiz">Quiz</SelectItem>
                            <SelectItem value="assignment">Assignment</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Duration (minutes)</Label>
                        <Input
                          type="number"
                          value={lessonForm.duration}
                          onChange={e => setLessonForm(prev => ({ ...prev, duration: parseInt(e.target.value) || 0 }))}
                        />
                      </div>
                      {lessonForm.type === 'video' && (
                        <div className="col-span-2">
                          <Label>Video URL (YouTube embed URL)</Label>
                          <Input
                            value={lessonForm.videoUrl}
                            onChange={e => setLessonForm(prev => ({ ...prev, videoUrl: e.target.value }))}
                            placeholder="https://www.youtube.com/embed/..."
                          />
                        </div>
                      )}
                      <div className="col-span-2">
                        <Label>Content (HTML for text, JSON for quiz)</Label>
                        <Textarea
                          value={lessonForm.content}
                          onChange={e => setLessonForm(prev => ({ ...prev, content: e.target.value }))}
                          placeholder="Lesson content..."
                          rows={6}
                        />
                      </div>
                      <div>
                        <Label>Sort Order</Label>
                        <Input
                          type="number"
                          value={lessonForm.sortOrder}
                          onChange={e => setLessonForm(prev => ({ ...prev, sortOrder: parseInt(e.target.value) || 0 }))}
                        />
                      </div>
                      <div className="flex items-center space-x-2 pt-6">
                        <Switch
                          checked={lessonForm.isPreview}
                          onCheckedChange={checked => setLessonForm(prev => ({ ...prev, isPreview: checked }))}
                        />
                        <Label>Free Preview</Label>
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2 pt-4">
                      <Button variant="outline" onClick={() => setShowLessonForm(false)}>Cancel</Button>
                      <Button onClick={handleSaveLesson}>
                        {editingLesson ? 'Update Lesson' : 'Create Lesson'}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </TabsContent>

        {/* Students Tab */}
        <TabsContent value="students" className="mt-6">
          <Card className="p-4">
            <h3 className="text-xl font-bold mb-4">Enrolled Students</h3>
            {students.length === 0 ? (
              <p className="text-gray-600 text-center py-8">No students registered yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3">Student</th>
                      <th className="text-left p-3">Email</th>
                      <th className="text-left p-3">Enrolled Courses</th>
                      <th className="text-left p-3">Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map(student => {
                      const studentEnrollments = enrollments.filter(e => e.studentId === student.id);
                      return (
                        <tr key={student.id} className="border-b hover:bg-gray-50">
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-blue-600 font-semibold text-sm">
                                  {student.firstName?.[0]}{student.lastName?.[0]}
                                </span>
                              </div>
                              <span>{student.firstName} {student.lastName}</span>
                            </div>
                          </td>
                          <td className="p-3 text-gray-600">{student.email}</td>
                          <td className="p-3">
                            <div className="flex flex-wrap gap-1">
                              {studentEnrollments.map(enrollment => {
                                const course = courses.find(c => c.id === enrollment.courseId);
                                return course ? (
                                  <Badge key={enrollment.id} variant="outline" className="text-xs">
                                    {course.title.substring(0, 20)}... ({enrollment.progressPercent}%)
                                  </Badge>
                                ) : null;
                              })}
                              {studentEnrollments.length === 0 && (
                                <span className="text-gray-400 text-sm">No enrollments</span>
                              )}
                            </div>
                          </td>
                          <td className="p-3 text-gray-600 text-sm">
                            {new Date(student.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminCourseDashboard;
