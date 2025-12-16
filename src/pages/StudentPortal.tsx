import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCourses, Course, Lesson } from '@/contexts/CourseContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CoursePaymentForm from '@/components/CoursePaymentForm';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  BookOpen, Play, Clock, Award, CheckCircle, Lock, 
  User, LogOut, GraduationCap, ChevronRight, Video,
  FileText, HelpCircle, ClipboardList, Download, Trophy,
  CreditCard, Receipt, DollarSign, Calendar, ShoppingCart
} from 'lucide-react';

const StudentPortal: React.FC = () => {
  const navigate = useNavigate();
  const { 
    courses, currentStudent, enrollments, lessonProgress,
    loginStudent, registerStudent, logoutStudent, 
    enrollInCourse, enrollWithPayment, markLessonComplete, 
    getStudentEnrollments, getStudentPayments
  } = useCourses();

  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [authError, setAuthError] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [courseToEnroll, setCourseToEnroll] = useState<Course | null>(null);

  const handleLogin = async () => {
    setAuthError('');
    const success = await loginStudent(email, password);
    if (!success) {
      setAuthError('Invalid email or password');
    }
  };

  const handleRegister = async () => {
    setAuthError('');
    if (!firstName || !lastName || !email || !password) {
      setAuthError('Please fill in all fields');
      return;
    }
    const success = await registerStudent(email, password, firstName, lastName);
    if (!success) {
      setAuthError('Email already registered');
    }
  };

  const handleEnrollClick = (course: Course) => {
    if (course.price > 0) {
      // Paid course - show payment modal
      setCourseToEnroll(course);
      setShowPaymentModal(true);
    } else {
      // Free course - enroll directly
      enrollInCourse(course.id);
    }
  };

  const handlePaymentSuccess = (paymentId: string, orderId: string) => {
    if (courseToEnroll && currentStudent) {
      enrollWithPayment(courseToEnroll.id, paymentId, orderId);
      setShowPaymentModal(false);
      // Navigate to confirmation page
      navigate(`/course-payment-confirmation?orderId=${orderId}&courseId=${courseToEnroll.id}&amount=${courseToEnroll.price.toFixed(2)}`);
    }
  };

  const studentEnrollments = getStudentEnrollments();
  const studentPayments = getStudentPayments();
  const enrolledCourseIds = studentEnrollments.map(e => e.courseId);

  const isLessonCompleted = (lessonId: string) => {
    const enrollment = studentEnrollments.find(e => e.courseId === selectedCourse?.id);
    if (!enrollment) return false;
    return lessonProgress.some(lp => lp.enrollmentId === enrollment.id && lp.lessonId === lessonId && lp.isCompleted);
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

  const renderQuiz = (content: string) => {
    try {
      const questions = JSON.parse(content);
      return (
        <div className="space-y-6">
          {questions.map((q: any, idx: number) => (
            <div key={idx} className="bg-gray-50 p-4 rounded-lg">
              <p className="font-semibold mb-3">{idx + 1}. {q.question}</p>
              <div className="space-y-2">
                {q.options.map((opt: string, optIdx: number) => (
                  <label key={optIdx} className="flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-gray-100">
                    <input type="radio" name={`q${idx}`} className="w-4 h-4" />
                    <span>{opt}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
          <Button className="w-full">Submit Quiz</Button>
        </div>
      );
    } catch {
      return <p className="text-gray-600">Quiz content unavailable</p>;
    }
  };

  // Auth Screen
  if (!currentStudent) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <Header />
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-md mx-auto">
            <Card className="p-8">
              <div className="text-center mb-8">
                <div className="bg-gradient-to-r from-blue-600 to-green-600 p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                  <GraduationCap className="h-10 w-10 text-white" />
                </div>
                <h1 className="text-2xl font-bold mb-2">Student Portal</h1>
                <p className="text-gray-600">Access your courses and track your progress</p>
              </div>

              <Tabs value={authMode} onValueChange={(v) => setAuthMode(v as 'login' | 'register')}>
                <TabsList className="grid grid-cols-2 w-full mb-6">
                  <TabsTrigger value="login">Sign In</TabsTrigger>
                  <TabsTrigger value="register">Register</TabsTrigger>
                </TabsList>

                <TabsContent value="login">
                  <div className="space-y-4">
                    <div>
                      <Label>Email Address</Label>
                      <Input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="your.email@example.com"
                      />
                    </div>
                    <div>
                      <Label>Password</Label>
                      <Input
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        onKeyPress={e => e.key === 'Enter' && handleLogin()}
                      />
                    </div>
                    {authError && <p className="text-red-500 text-sm">{authError}</p>}
                    <Button onClick={handleLogin} className="w-full bg-gradient-to-r from-blue-600 to-green-600">
                      Sign In
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="register">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>First Name</Label>
                        <Input
                          value={firstName}
                          onChange={e => setFirstName(e.target.value)}
                          placeholder="John"
                        />
                      </div>
                      <div>
                        <Label>Last Name</Label>
                        <Input
                          value={lastName}
                          onChange={e => setLastName(e.target.value)}
                          placeholder="Doe"
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Email Address</Label>
                      <Input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="your.email@example.com"
                      />
                    </div>
                    <div>
                      <Label>Password</Label>
                      <Input
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="Create a password"
                      />
                    </div>
                    {authError && <p className="text-red-500 text-sm">{authError}</p>}
                    <Button onClick={handleRegister} className="w-full bg-gradient-to-r from-blue-600 to-green-600">
                      Create Account
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </Card>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Course Viewer
  if (selectedCourse && selectedLesson) {
    const enrollment = studentEnrollments.find(e => e.courseId === selectedCourse.id);
    const isCompleted = isLessonCompleted(selectedLesson.id);

    return (
      <div className="min-h-screen bg-gray-100">
        <div className="bg-white border-b sticky top-0 z-10">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => setSelectedLesson(null)}>
                <ChevronRight className="h-4 w-4 rotate-180 mr-1" /> Back
              </Button>
              <div>
                <p className="text-sm text-gray-500">{selectedCourse.title}</p>
                <p className="font-semibold">{selectedLesson.title}</p>
              </div>
            </div>
            {enrollment && (
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm text-gray-500">Progress</p>
                  <p className="font-semibold">{enrollment.progressPercent}%</p>
                </div>
                {!isCompleted && (
                  <Button onClick={() => markLessonComplete(selectedLesson.id)}>
                    <CheckCircle className="h-4 w-4 mr-2" /> Mark Complete
                  </Button>
                )}
                {isCompleted && (
                  <Badge className="bg-green-100 text-green-700">
                    <CheckCircle className="h-4 w-4 mr-1" /> Completed
                  </Badge>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-3">
              <Card className="p-6">
                {selectedLesson.type === 'video' && selectedLesson.videoUrl && (
                  <div className="aspect-video mb-6">
                    <iframe
                      src={selectedLesson.videoUrl}
                      className="w-full h-full rounded-lg"
                      allowFullScreen
                    />
                  </div>
                )}

                {selectedLesson.type === 'text' && (
                  <div 
                    className="prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: selectedLesson.content }}
                  />
                )}

                {selectedLesson.type === 'quiz' && renderQuiz(selectedLesson.content)}

                {selectedLesson.type === 'assignment' && (
                  <div className="space-y-4">
                    <div dangerouslySetInnerHTML={{ __html: selectedLesson.content }} />
                    <div className="border-2 border-dashed rounded-lg p-8 text-center">
                      <ClipboardList className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                      <p className="text-gray-600 mb-4">Upload your assignment</p>
                      <Button variant="outline">Choose File</Button>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between mt-6 pt-6 border-t">
                  <div className="flex items-center gap-2 text-gray-500">
                    <Clock className="h-4 w-4" />
                    <span>{selectedLesson.duration} minutes</span>
                  </div>
                </div>
              </Card>
            </div>

            {/* Sidebar - Course Outline */}
            <div className="lg:col-span-1">
              <Card className="p-4 sticky top-20">
                <h3 className="font-semibold mb-4">Course Outline</h3>
                <div className="space-y-3 max-h-[60vh] overflow-y-auto">
                  {selectedCourse.modules.map(module => (
                    <div key={module.id}>
                      <p className="text-sm font-medium text-gray-700 mb-2">{module.title}</p>
                      <div className="space-y-1 pl-2">
                        {module.lessons.map(lesson => (
                          <button
                            key={lesson.id}
                            onClick={() => setSelectedLesson(lesson)}
                            className={`w-full text-left p-2 rounded text-sm flex items-center gap-2 ${
                              selectedLesson.id === lesson.id 
                                ? 'bg-blue-100 text-blue-700' 
                                : 'hover:bg-gray-100'
                            }`}
                          >
                            {isLessonCompleted(lesson.id) ? (
                              <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                            ) : (
                              getLessonIcon(lesson.type)
                            )}
                            <span className="truncate">{lesson.title}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Course Detail View
  if (selectedCourse) {
    const enrollment = studentEnrollments.find(e => e.courseId === selectedCourse.id);
    const isEnrolled = !!enrollment;

    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white py-12">
          <div className="container mx-auto px-4">
            <Button 
              variant="ghost" 
              className="text-white mb-4 hover:bg-white/20"
              onClick={() => setSelectedCourse(null)}
            >
              <ChevronRight className="h-4 w-4 rotate-180 mr-1" /> Back to Courses
            </Button>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Badge className="bg-white/20 text-white mb-4">{selectedCourse.category}</Badge>
                <h1 className="text-3xl md:text-4xl font-bold mb-4">{selectedCourse.title}</h1>
                <p className="text-lg text-blue-100 mb-6">{selectedCourse.description}</p>
                <div className="flex flex-wrap items-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    <span>{selectedCourse.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    <span>{selectedCourse.level}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    <span>{selectedCourse.modules.reduce((acc, m) => acc + m.lessons.length, 0)} lessons</span>
                  </div>
                </div>
              </div>
              <div>
                <Card className="p-6 text-gray-800">
                  {selectedCourse.imageUrl && (
                    <img 
                      src={selectedCourse.imageUrl} 
                      alt={selectedCourse.title}
                      className="w-full h-40 object-cover rounded-lg mb-4"
                    />
                  )}
                  {isEnrolled ? (
                    <>
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-2">
                          <span>Your Progress</span>
                          <span className="font-semibold">{enrollment.progressPercent}%</span>
                        </div>
                        <Progress value={enrollment.progressPercent} className="h-2" />
                      </div>
                      <Button 
                        className="w-full bg-gradient-to-r from-blue-600 to-green-600"
                        onClick={() => {
                          const firstLesson = selectedCourse.modules[0]?.lessons[0];
                          if (firstLesson) setSelectedLesson(firstLesson);
                        }}
                      >
                        <Play className="h-4 w-4 mr-2" /> Continue Learning
                      </Button>
                      {enrollment.status === 'completed' && (
                        <Button variant="outline" className="w-full mt-2">
                          <Download className="h-4 w-4 mr-2" /> Download Certificate
                        </Button>
                      )}
                    </>
                  ) : (
                    <>
                      <div className="text-center mb-4">
                        <p className="text-3xl font-bold">
                          {selectedCourse.price === 0 ? 'Free' : `$${selectedCourse.price.toFixed(2)}`}
                        </p>
                        {selectedCourse.price > 0 && (
                          <p className="text-sm text-gray-500">One-time payment</p>
                        )}
                      </div>
                      <Button 
                        className="w-full bg-gradient-to-r from-blue-600 to-green-600"
                        onClick={() => handleEnrollClick(selectedCourse)}
                      >
                        {selectedCourse.price > 0 ? (
                          <>
                            <ShoppingCart className="h-4 w-4 mr-2" /> Enroll Now - ${selectedCourse.price.toFixed(2)}
                          </>
                        ) : (
                          'Enroll Now - Free'
                        )}
                      </Button>
                      {selectedCourse.price > 0 && (
                        <p className="text-xs text-center text-gray-500 mt-2">
                          Secure payment via Stripe
                        </p>
                      )}
                    </>
                  )}
                </Card>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="p-6 mb-6">
                <h2 className="text-xl font-bold mb-4">Course Content</h2>
                <div className="space-y-4">
                  {selectedCourse.modules.map((module, idx) => (
                    <div key={module.id} className="border rounded-lg overflow-hidden">
                      <div className="bg-gray-50 p-4">
                        <h3 className="font-semibold">Module {idx + 1}: {module.title}</h3>
                        <p className="text-sm text-gray-600">{module.lessons.length} lessons</p>
                      </div>
                      <div className="divide-y">
                        {module.lessons.map(lesson => {
                          const canAccess = isEnrolled || lesson.isPreview;
                          const completed = isLessonCompleted(lesson.id);
                          return (
                            <div 
                              key={lesson.id}
                              className={`p-4 flex items-center justify-between ${canAccess ? 'hover:bg-gray-50 cursor-pointer' : 'opacity-60'}`}
                              onClick={() => canAccess && setSelectedLesson(lesson)}
                            >
                              <div className="flex items-center gap-3">
                                {completed ? (
                                  <CheckCircle className="h-5 w-5 text-green-500" />
                                ) : canAccess ? (
                                  getLessonIcon(lesson.type)
                                ) : (
                                  <Lock className="h-5 w-5 text-gray-400" />
                                )}
                                <div>
                                  <p className="font-medium">{lesson.title}</p>
                                  <p className="text-sm text-gray-500">{lesson.duration} min</p>
                                </div>
                              </div>
                              {lesson.isPreview && !isEnrolled && (
                                <Badge variant="outline">Preview</Badge>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            <div>
              <Card className="p-6">
                <h3 className="font-bold mb-4">Instructor</h3>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold">{selectedCourse.instructorName}</p>
                    <p className="text-sm text-gray-600">Course Instructor</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600">{selectedCourse.instructorBio}</p>
              </Card>
            </div>
          </div>
        </div>
        <Footer />

        {/* Payment Modal */}
        <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Complete Your Enrollment
              </DialogTitle>
            </DialogHeader>
            {courseToEnroll && currentStudent && (
              <CoursePaymentForm
                course={courseToEnroll}
                student={currentStudent}
                onSuccess={handlePaymentSuccess}
                onCancel={() => setShowPaymentModal(false)}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // Main Dashboard
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl p-8 text-white mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Welcome back, {currentStudent.firstName}!
              </h1>
              <p className="text-blue-100">Continue your learning journey</p>
            </div>
            <Button 
              variant="ghost" 
              className="text-white hover:bg-white/20"
              onClick={logoutStudent}
            >
              <LogOut className="h-4 w-4 mr-2" /> Sign Out
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="my-courses">My Courses</TabsTrigger>
            <TabsTrigger value="browse">Browse Courses</TabsTrigger>
            <TabsTrigger value="payments">Payment History</TabsTrigger>
            <TabsTrigger value="certificates">Certificates</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card className="p-6">
                <div className="flex items-center gap-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <BookOpen className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{studentEnrollments.length}</p>
                    <p className="text-gray-600">Enrolled Courses</p>
                  </div>
                </div>
              </Card>
              <Card className="p-6">
                <div className="flex items-center gap-4">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      {studentEnrollments.filter(e => e.status === 'completed').length}
                    </p>
                    <p className="text-gray-600">Completed</p>
                  </div>
                </div>
              </Card>
              <Card className="p-6">
                <div className="flex items-center gap-4">
                  <div className="bg-yellow-100 p-3 rounded-lg">
                    <Trophy className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      {studentEnrollments.filter(e => e.certificateIssued).length}
                    </p>
                    <p className="text-gray-600">Certificates</p>
                  </div>
                </div>
              </Card>
              <Card className="p-6">
                <div className="flex items-center gap-4">
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <DollarSign className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      ${studentPayments.reduce((sum, p) => sum + p.amount, 0).toFixed(2)}
                    </p>
                    <p className="text-gray-600">Total Invested</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Continue Learning */}
            <h2 className="text-xl font-bold mb-4">Continue Learning</h2>
            {studentEnrollments.filter(e => e.status === 'active').length === 0 ? (
              <Card className="p-8 text-center">
                <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600 mb-4">You haven't enrolled in any courses yet</p>
                <Button onClick={() => setActiveTab('browse')}>Browse Courses</Button>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {studentEnrollments.filter(e => e.status === 'active').map(enrollment => {
                  const course = courses.find(c => c.id === enrollment.courseId);
                  if (!course) return null;
                  return (
                    <Card key={enrollment.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      {course.imageUrl && (
                        <img 
                          src={course.imageUrl} 
                          alt={course.title}
                          className="w-full h-40 object-cover"
                        />
                      )}
                      <div className="p-4">
                        <h3 className="font-semibold mb-2">{course.title}</h3>
                        <div className="mb-4">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600">Progress</span>
                            <span className="font-medium">{enrollment.progressPercent}%</span>
                          </div>
                          <Progress value={enrollment.progressPercent} className="h-2" />
                        </div>
                        <Button 
                          className="w-full"
                          onClick={() => setSelectedCourse(course)}
                        >
                          <Play className="h-4 w-4 mr-2" /> Continue
                        </Button>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* My Courses Tab */}
          <TabsContent value="my-courses">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {studentEnrollments.map(enrollment => {
                const course = courses.find(c => c.id === enrollment.courseId);
                if (!course) return null;
                return (
                  <Card key={enrollment.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    {course.imageUrl && (
                      <img 
                        src={course.imageUrl} 
                        alt={course.title}
                        className="w-full h-40 object-cover"
                      />
                    )}
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant={enrollment.status === 'completed' ? 'default' : 'secondary'}>
                          {enrollment.status === 'completed' ? 'Completed' : 'In Progress'}
                        </Badge>
                        <span className="text-sm text-gray-500">{enrollment.progressPercent}%</span>
                      </div>
                      <h3 className="font-semibold mb-2">{course.title}</h3>
                      <p className="text-sm text-gray-600 mb-4">{course.shortDescription}</p>
                      <Progress value={enrollment.progressPercent} className="h-2 mb-4" />
                      <Button 
                        className="w-full"
                        onClick={() => setSelectedCourse(course)}
                      >
                        {enrollment.status === 'completed' ? 'Review Course' : 'Continue'}
                      </Button>
                    </div>
                  </Card>
                );
              })}
              {studentEnrollments.length === 0 && (
                <div className="col-span-full">
                  <Card className="p-8 text-center">
                    <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600 mb-4">No courses enrolled yet</p>
                    <Button onClick={() => setActiveTab('browse')}>Browse Courses</Button>
                  </Card>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Browse Courses Tab */}
          <TabsContent value="browse">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.filter(c => c.isPublished).map(course => {
                const isEnrolled = enrolledCourseIds.includes(course.id);
                return (
                  <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    {course.imageUrl && (
                      <img 
                        src={course.imageUrl} 
                        alt={course.title}
                        className="w-full h-40 object-cover"
                      />
                    )}
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline">{course.category}</Badge>
                        <Badge variant={course.level === 'Beginner' ? 'secondary' : course.level === 'Intermediate' ? 'default' : 'destructive'}>
                          {course.level}
                        </Badge>
                      </div>
                      <h3 className="font-semibold mb-2">{course.title}</h3>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{course.shortDescription}</p>
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" /> {course.duration}
                        </span>
                        <span className="font-semibold text-lg text-gray-800">
                          {course.price === 0 ? 'Free' : `$${course.price.toFixed(2)}`}
                        </span>
                      </div>
                      <Button 
                        className="w-full"
                        variant={isEnrolled ? 'outline' : 'default'}
                        onClick={() => setSelectedCourse(course)}
                      >
                        {isEnrolled ? 'Continue Learning' : 'View Course'}
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Payment History Tab */}
          <TabsContent value="payments">
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Receipt className="h-5 w-5" />
                Payment History
              </h2>
              
              {studentPayments.length === 0 ? (
                <div className="text-center py-12">
                  <CreditCard className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600 mb-4">No payment history yet</p>
                  <p className="text-sm text-gray-500">Your course purchases will appear here</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {studentPayments.map(payment => {
                    const course = courses.find(c => c.id === payment.courseId);
                    return (
                      <div 
                        key={payment.id} 
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                      >
                        <div className="flex items-center gap-4">
                          {course?.imageUrl && (
                            <img 
                              src={course.imageUrl} 
                              alt={payment.courseTitle}
                              className="w-16 h-12 object-cover rounded"
                            />
                          )}
                          <div>
                            <p className="font-semibold">{payment.courseTitle}</p>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <Calendar className="h-4 w-4" />
                              <span>{new Date(payment.createdAt).toLocaleDateString()}</span>
                              <span className="text-gray-300">|</span>
                              <span className="font-mono text-xs">{payment.orderId}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg">${payment.amount.toFixed(2)}</p>
                          <Badge 
                            variant={payment.status === 'completed' ? 'default' : 'secondary'}
                            className={payment.status === 'completed' ? 'bg-green-100 text-green-700' : ''}
                          >
                            {payment.status === 'completed' ? 'Paid' : payment.status}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                  
                  {/* Total Summary */}
                  <div className="border-t pt-4 mt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total Payments</span>
                      <span className="text-xl font-bold">
                        ${studentPayments.reduce((sum, p) => sum + p.amount, 0).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          </TabsContent>

          {/* Certificates Tab */}
          <TabsContent value="certificates">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {studentEnrollments.filter(e => e.status === 'completed').map(enrollment => {
                const course = courses.find(c => c.id === enrollment.courseId);
                if (!course) return null;
                return (
                  <Card key={enrollment.id} className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="bg-yellow-100 p-3 rounded-lg">
                        <Award className="h-8 w-8 text-yellow-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{course.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">
                          Completed on {enrollment.completedAt ? new Date(enrollment.completedAt).toLocaleDateString() : 'N/A'}
                        </p>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" /> Download Certificate
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
              {studentEnrollments.filter(e => e.status === 'completed').length === 0 && (
                <div className="col-span-full">
                  <Card className="p-8 text-center">
                    <Award className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600 mb-4">Complete a course to earn your certificate</p>
                    <Button onClick={() => setActiveTab('my-courses')}>View My Courses</Button>
                  </Card>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      <Footer />

      {/* Payment Modal for Dashboard */}
      <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Complete Your Enrollment
            </DialogTitle>
          </DialogHeader>
          {courseToEnroll && currentStudent && (
            <CoursePaymentForm
              course={courseToEnroll}
              student={currentStudent}
              onSuccess={handlePaymentSuccess}
              onCancel={() => setShowPaymentModal(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StudentPortal;
