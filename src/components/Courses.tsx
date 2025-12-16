import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCourses } from '@/contexts/CourseContext';
import { BookOpen, Clock, Award, Users, Lock, Play, Search, GraduationCap, ArrowRight, Star, CheckCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Courses: React.FC = () => {
  const navigate = useNavigate();
  const { courses, currentStudent, enrollments } = useCourses();
  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const publishedCourses = courses.filter(c => c.isPublished);
  const categories = [...new Set(publishedCourses.map(c => c.category))];

  const filteredCourses = publishedCourses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = levelFilter === 'all' || course.level === levelFilter;
    const matchesCategory = categoryFilter === 'all' || course.category === categoryFilter;
    return matchesSearch && matchesLevel && matchesCategory;
  });

  const featuredCourses = filteredCourses.filter(c => c.isFeatured);
  const regularCourses = filteredCourses.filter(c => !c.isFeatured);

  const isEnrolled = (courseId: string) => {
    if (!currentStudent) return false;
    return enrollments.some(e => e.studentId === currentStudent.id && e.courseId === courseId);
  };

  const getEnrollmentProgress = (courseId: string) => {
    if (!currentStudent) return 0;
    const enrollment = enrollments.find(e => e.studentId === currentStudent.id && e.courseId === courseId);
    return enrollment?.progressPercent || 0;
  };

  const hasActiveFilters = searchQuery || levelFilter !== 'all' || categoryFilter !== 'all';

  const clearFilters = () => {
    setSearchQuery('');
    setLevelFilter('all');
    setCategoryFilter('all');
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'bg-green-100 text-green-700';
      case 'Intermediate': return 'bg-blue-100 text-blue-700';
      case 'Advanced': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <section id="courses" className="py-20 bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-4">
            Learn & Grow
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Online Training & Courses
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Enhance your skills and knowledge with our comprehensive online training programs 
            designed for humanitarian professionals and community leaders worldwide.
          </p>
        </div>

        {/* Student Portal CTA */}
        <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl p-8 shadow-xl mb-12 max-w-4xl mx-auto relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4 text-white">
              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl">
                <GraduationCap className="h-10 w-10" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">Student Portal</h3>
                <p className="text-blue-100">
                  {currentStudent 
                    ? `Welcome back, ${currentStudent.firstName}! Continue your learning journey.`
                    : 'Access your courses, track progress, and download certificates'
                  }
                </p>
              </div>
            </div>
            <Button 
              onClick={() => navigate('/student-portal')}
              className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-6 text-lg shadow-lg group"
            >
              {currentStudent ? (
                <>
                  <Play className="h-5 w-5 mr-2" /> Go to Dashboard
                </>
              ) : (
                <>
                  <Lock className="h-5 w-5 mr-2" /> Sign In / Register
                </>
              )}
              <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search courses by name or topic..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-10 h-11 bg-gray-50 border-gray-200"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <div className="flex gap-3">
              <Select value={levelFilter} onValueChange={setLevelFilter}>
                <SelectTrigger className="w-40 h-11 bg-gray-50 border-gray-200">
                  <SelectValue placeholder="Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="Beginner">Beginner</SelectItem>
                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                  <SelectItem value="Advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-48 h-11 bg-gray-50 border-gray-200">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {hasActiveFilters && (
                <Button variant="ghost" onClick={clearFilters} className="text-gray-500">
                  <X className="h-4 w-4 mr-1" />
                  Clear
                </Button>
              )}
            </div>
          </div>

          {/* Results Count */}
          {hasActiveFilters && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-sm text-gray-600">
                Showing <span className="font-semibold text-gray-900">{filteredCourses.length}</span> of {publishedCourses.length} courses
              </p>
            </div>
          )}
        </div>

        {/* Featured Courses */}
        {featuredCourses.length > 0 && (
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Star className="h-6 w-6 text-yellow-500 fill-yellow-500" /> Featured Courses
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredCourses.map(course => (
                <div key={course.id} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group">
                  <div className="relative">
                    {course.imageUrl && (
                      <img 
                        src={course.imageUrl} 
                        alt={course.title}
                        className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute top-4 left-4 flex gap-2">
                      <Badge className="bg-yellow-500 hover:bg-yellow-600">
                        <Star className="h-3 w-3 mr-1 fill-white" /> Featured
                      </Badge>
                      {course.price === 0 && (
                        <Badge className="bg-green-500 hover:bg-green-600">Free</Badge>
                      )}
                    </div>
                    {isEnrolled(course.id) && (
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="bg-white/90 backdrop-blur-sm rounded-lg p-2">
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-gray-700">Your Progress</span>
                            <span className="font-semibold text-blue-600">{getEnrollmentProgress(course.id)}%</span>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full transition-all duration-500"
                              style={{ width: `${getEnrollmentProgress(course.id)}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="outline" className="text-xs">{course.category}</Badge>
                      <Badge className={`text-xs ${getLevelColor(course.level)}`}>
                        {course.level}
                      </Badge>
                    </div>
                    <h4 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                      {course.title}
                    </h4>
                    <p className="text-gray-600 mb-4 line-clamp-2">{course.shortDescription}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-blue-500" />
                        <span>{course.duration}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4 text-green-500" />
                        <span>{course.modules.reduce((acc, m) => acc + m.lessons.length, 0)} lessons</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <span className="text-2xl font-bold text-gray-800">
                        {course.price === 0 ? 'Free' : `$${course.price}`}
                      </span>
                      <Button 
                        onClick={() => navigate('/student-portal')}
                        className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 group/btn"
                      >
                        {isEnrolled(course.id) ? (
                          <>
                            <Play className="h-4 w-4 mr-2" /> Continue
                          </>
                        ) : (
                          <>
                            Enroll Now
                            <ArrowRight className="h-4 w-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Courses */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">
            {featuredCourses.length > 0 ? 'All Courses' : 'Available Courses'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularCourses.map(course => (
              <div key={course.id} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group">
                <div className="relative">
                  {course.imageUrl && (
                    <img 
                      src={course.imageUrl} 
                      alt={course.title}
                      className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  )}
                  {course.price === 0 && (
                    <Badge className="absolute top-3 right-3 bg-green-500">Free</Badge>
                  )}
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="text-xs">{course.category}</Badge>
                    <Badge className={`text-xs ${getLevelColor(course.level)}`}>
                      {course.level}
                    </Badge>
                  </div>
                  <h4 className="font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {course.title}
                  </h4>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{course.shortDescription}</p>
                  <div className="flex items-center gap-3 text-xs text-gray-500 mb-4">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-blue-500" /> {course.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <BookOpen className="h-3 w-3 text-green-500" /> {course.modules.reduce((acc, m) => acc + m.lessons.length, 0)} lessons
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className="font-bold text-gray-800 text-lg">
                      {course.price === 0 ? 'Free' : `$${course.price}`}
                    </span>
                    <Button 
                      size="sm"
                      onClick={() => navigate('/student-portal')}
                      className="group/btn"
                    >
                      {isEnrolled(course.id) ? 'Continue' : 'View Course'}
                      <ArrowRight className="h-3 w-3 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {filteredCourses.length === 0 && (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
                <BookOpen className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No courses found</h3>
              <p className="text-gray-500 mb-6">Try adjusting your search or filter criteria</p>
              <Button onClick={clearFilters} variant="outline">
                Clear all filters
              </Button>
            </div>
          )}
        </div>

        {/* Features */}
        <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
          <h3 className="text-2xl font-bold text-gray-800 mb-8 text-center">
            Why Choose Our Training Programs?
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { icon: Award, color: 'bg-blue-600', title: 'Certified Programs', desc: 'Internationally recognized certificates upon completion' },
              { icon: Users, color: 'bg-green-600', title: 'Expert Instructors', desc: 'Learn from experienced humanitarian professionals' },
              { icon: Clock, color: 'bg-purple-600', title: 'Flexible Learning', desc: 'Self-paced courses that fit your schedule' },
              { icon: BookOpen, color: 'bg-orange-600', title: 'Rich Content', desc: 'Videos, quizzes, and hands-on assignments' },
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="text-center group">
                  <div className={`${feature.color} p-4 rounded-2xl w-16 h-16 mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <h4 className="font-bold text-gray-800 mb-2">{feature.title}</h4>
                  <p className="text-sm text-gray-600">{feature.desc}</p>
                </div>
              );
            })}
          </div>

          {/* Bottom CTA */}
          <div className="mt-10 pt-8 border-t border-gray-100 text-center">
            <p className="text-gray-600 mb-4">
              Ready to start your learning journey?
            </p>
            <Button 
              onClick={() => navigate('/student-portal')}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 px-8 group"
            >
              <GraduationCap className="h-5 w-5 mr-2" />
              Get Started Today
              <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Courses;
