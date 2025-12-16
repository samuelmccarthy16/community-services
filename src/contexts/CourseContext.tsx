import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  type: 'video' | 'text' | 'quiz' | 'assignment';
  content: string;
  videoUrl?: string;
  duration: number;
  sortOrder: number;
  isPreview: boolean;
}

export interface Module {
  id: string;
  courseId: string;
  title: string;
  description: string;
  sortOrder: number;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  instructorName: string;
  instructorBio: string;
  imageUrl: string;
  price: number;
  isPublished: boolean;
  isFeatured: boolean;
  category: string;
  createdAt: string;
  modules: Module[];
  totalLessons: number;
  totalDuration: number;
}

export interface Student {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface Enrollment {
  id: string;
  studentId: string;
  courseId: string;
  enrolledAt: string;
  status: 'active' | 'completed' | 'paused';
  progressPercent: number;
  completedAt?: string;
  certificateIssued: boolean;
}

export interface LessonProgress {
  id: string;
  enrollmentId: string;
  lessonId: string;
  isCompleted: boolean;
  completedAt?: string;
  timeSpentSeconds: number;
}

export interface CoursePayment {
  id: string;
  orderId: string;
  studentId: string;
  courseId: string;
  courseTitle: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  stripePaymentId: string;
  createdAt: string;
}

interface CourseContextType {
  courses: Course[];
  students: Student[];
  enrollments: Enrollment[];
  lessonProgress: LessonProgress[];
  payments: CoursePayment[];
  currentStudent: Student | null;
  addCourse: (course: Omit<Course, 'id' | 'createdAt' | 'modules' | 'totalLessons' | 'totalDuration'>) => void;
  updateCourse: (id: string, course: Partial<Course>) => void;
  deleteCourse: (id: string) => void;
  addModule: (courseId: string, module: Omit<Module, 'id' | 'lessons'>) => void;
  updateModule: (moduleId: string, module: Partial<Module>) => void;
  deleteModule: (moduleId: string) => void;
  addLesson: (moduleId: string, lesson: Omit<Lesson, 'id'>) => void;
  updateLesson: (lessonId: string, lesson: Partial<Lesson>) => void;
  deleteLesson: (lessonId: string) => void;
  registerStudent: (email: string, password: string, firstName: string, lastName: string) => Promise<boolean>;
  loginStudent: (email: string, password: string) => Promise<boolean>;
  logoutStudent: () => void;
  enrollInCourse: (courseId: string) => void;
  enrollWithPayment: (courseId: string, paymentId: string, orderId: string) => void;
  markLessonComplete: (lessonId: string) => void;
  getEnrollmentProgress: (enrollmentId: string) => number;
  getCourseById: (id: string) => Course | undefined;
  getStudentEnrollments: () => Enrollment[];
  getStudentPayments: () => CoursePayment[];
  addPayment: (payment: Omit<CoursePayment, 'id' | 'createdAt'>) => void;
}

const CourseContext = createContext<CourseContextType | undefined>(undefined);

const defaultCourses: Course[] = [
  {
    id: '1',
    title: 'Community Counseling Certification',
    description: 'Comprehensive training in trauma-informed care and community-based counseling techniques. This course covers essential skills for providing mental health support in community settings.',
    shortDescription: 'Comprehensive training in trauma-informed care and community-based counseling techniques.',
    duration: '12 weeks',
    level: 'Intermediate',
    instructorName: 'Dr. Sarah Mitchell',
    instructorBio: 'Licensed clinical psychologist with 15 years of experience in community mental health.',
    imageUrl: 'https://d64gsuwffb70l.cloudfront.net/68ca0536291bf6a7dcd8df21_1765654139468_75a5a794.png',
    price: 0,
    isPublished: true,
    isFeatured: true,
    category: 'Mental Health',
    createdAt: new Date().toISOString(),
    totalLessons: 24,
    totalDuration: 1440,
    modules: [
      {
        id: 'm1',
        courseId: '1',
        title: 'Introduction to Community Counseling',
        description: 'Foundation concepts and ethical considerations',
        sortOrder: 1,
        lessons: [
          { id: 'l1', moduleId: 'm1', title: 'Welcome & Course Overview', type: 'video', content: '', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: 15, sortOrder: 1, isPreview: true },
          { id: 'l2', moduleId: 'm1', title: 'Ethics in Community Counseling', type: 'text', content: '<h2>Ethics in Community Counseling</h2><p>Community counseling requires adherence to strict ethical guidelines...</p>', duration: 30, sortOrder: 2, isPreview: false },
          { id: 'l3', moduleId: 'm1', title: 'Module 1 Quiz', type: 'quiz', content: JSON.stringify([{question: 'What is the primary goal of community counseling?', options: ['Individual therapy', 'Community wellbeing', 'Medication management', 'Research'], correct: 1}]), duration: 15, sortOrder: 3, isPreview: false }
        ]
      },
      {
        id: 'm2',
        courseId: '1',
        title: 'Trauma-Informed Care',
        description: 'Understanding and responding to trauma',
        sortOrder: 2,
        lessons: [
          { id: 'l4', moduleId: 'm2', title: 'Understanding Trauma', type: 'video', content: '', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: 45, sortOrder: 1, isPreview: false },
          { id: 'l5', moduleId: 'm2', title: 'Trauma Response Techniques', type: 'text', content: '<h2>Trauma Response Techniques</h2><p>Effective techniques for responding to trauma include...</p>', duration: 30, sortOrder: 2, isPreview: false }
        ]
      }
    ]
  },
  {
    id: '2',
    title: 'Disaster Response Management',
    description: 'Emergency response protocols, crisis management, and community resilience building. Learn how to effectively coordinate disaster relief efforts.',
    shortDescription: 'Emergency response protocols, crisis management, and community resilience building.',
    duration: '8 weeks',
    level: 'Advanced',
    instructorName: 'James Rodriguez',
    instructorBio: 'Former FEMA coordinator with 20 years of disaster response experience.',
    imageUrl: 'https://d64gsuwffb70l.cloudfront.net/68ca0536291bf6a7dcd8df21_1765654132594_4444ee1f.jpg',
    price: 49.99,
    isPublished: true,
    isFeatured: true,
    category: 'Emergency Response',
    createdAt: new Date().toISOString(),
    totalLessons: 16,
    totalDuration: 960,
    modules: [
      {
        id: 'm3',
        courseId: '2',
        title: 'Fundamentals of Disaster Response',
        description: 'Core principles and frameworks',
        sortOrder: 1,
        lessons: [
          { id: 'l6', moduleId: 'm3', title: 'Introduction to Disaster Management', type: 'video', content: '', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: 30, sortOrder: 1, isPreview: true },
          { id: 'l7', moduleId: 'm3', title: 'Emergency Planning Basics', type: 'text', content: '<h2>Emergency Planning</h2><p>Effective emergency planning involves...</p>', duration: 45, sortOrder: 2, isPreview: false }
        ]
      }
    ]
  },
  {
    id: '3',
    title: 'Global Health Fundamentals',
    description: 'Introduction to public health principles and community health program development. Understand global health challenges and solutions.',
    shortDescription: 'Introduction to public health principles and community health program development.',
    duration: '10 weeks',
    level: 'Beginner',
    instructorName: 'Dr. Emily Chen',
    instructorBio: 'Public health researcher and WHO consultant.',
    imageUrl: 'https://d64gsuwffb70l.cloudfront.net/68ca0536291bf6a7dcd8df21_1765654142238_85ec3b56.png',
    price: 0,
    isPublished: true,
    isFeatured: false,
    category: 'Public Health',
    createdAt: new Date().toISOString(),
    totalLessons: 20,
    totalDuration: 1200,
    modules: [
      {
        id: 'm4',
        courseId: '3',
        title: 'Introduction to Global Health',
        description: 'Overview of global health landscape',
        sortOrder: 1,
        lessons: [
          { id: 'l8', moduleId: 'm4', title: 'What is Global Health?', type: 'video', content: '', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: 20, sortOrder: 1, isPreview: true }
        ]
      }
    ]
  },
  {
    id: '4',
    title: 'Educational Leadership in Crisis',
    description: 'Maintaining educational continuity during emergencies and conflict situations. Learn strategies for adaptive education delivery.',
    shortDescription: 'Maintaining educational continuity during emergencies and conflict situations.',
    duration: '6 weeks',
    level: 'Intermediate',
    instructorName: 'Prof. Michael Adams',
    instructorBio: 'Education policy expert and former UNESCO advisor.',
    imageUrl: 'https://d64gsuwffb70l.cloudfront.net/68ca0536291bf6a7dcd8df21_1765654139010_84373404.png',
    price: 29.99,
    isPublished: true,
    isFeatured: false,
    category: 'Education',
    createdAt: new Date().toISOString(),
    totalLessons: 12,
    totalDuration: 720,
    modules: [
      {
        id: 'm5',
        courseId: '4',
        title: 'Crisis Education Fundamentals',
        description: 'Understanding education in crisis contexts',
        sortOrder: 1,
        lessons: [
          { id: 'l9', moduleId: 'm5', title: 'Education in Emergencies Overview', type: 'video', content: '', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: 25, sortOrder: 1, isPreview: true }
        ]
      }
    ]
  }
];

export function CourseProvider({ children }: { children: ReactNode }) {
  const [courses, setCourses] = useState<Course[]>(() => {
    const saved = localStorage.getItem('courses');
    return saved ? JSON.parse(saved) : defaultCourses;
  });

  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('students');
    return saved ? JSON.parse(saved) : [];
  });

  const [enrollments, setEnrollments] = useState<Enrollment[]>(() => {
    const saved = localStorage.getItem('enrollments');
    return saved ? JSON.parse(saved) : [];
  });

  const [lessonProgress, setLessonProgress] = useState<LessonProgress[]>(() => {
    const saved = localStorage.getItem('lessonProgress');
    return saved ? JSON.parse(saved) : [];
  });

  const [payments, setPayments] = useState<CoursePayment[]>(() => {
    const saved = localStorage.getItem('coursePayments');
    return saved ? JSON.parse(saved) : [];
  });

  const [currentStudent, setCurrentStudent] = useState<Student | null>(() => {
    const saved = localStorage.getItem('currentStudent');
    return saved ? JSON.parse(saved) : null;
  });

  const [passwords, setPasswords] = useState<Record<string, string>>(() => {
    const saved = localStorage.getItem('studentPasswords');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem('courses', JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem('students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('enrollments', JSON.stringify(enrollments));
  }, [enrollments]);

  useEffect(() => {
    localStorage.setItem('lessonProgress', JSON.stringify(lessonProgress));
  }, [lessonProgress]);

  useEffect(() => {
    localStorage.setItem('coursePayments', JSON.stringify(payments));
  }, [payments]);

  useEffect(() => {
    if (currentStudent) {
      localStorage.setItem('currentStudent', JSON.stringify(currentStudent));
    } else {
      localStorage.removeItem('currentStudent');
    }
  }, [currentStudent]);

  useEffect(() => {
    localStorage.setItem('studentPasswords', JSON.stringify(passwords));
  }, [passwords]);

  const addCourse = (course: Omit<Course, 'id' | 'createdAt' | 'modules' | 'totalLessons' | 'totalDuration'>) => {
    const newCourse: Course = {
      ...course,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      modules: [],
      totalLessons: 0,
      totalDuration: 0
    };
    setCourses(prev => [...prev, newCourse]);
  };

  const updateCourse = (id: string, updates: Partial<Course>) => {
    setCourses(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const deleteCourse = (id: string) => {
    setCourses(prev => prev.filter(c => c.id !== id));
    setEnrollments(prev => prev.filter(e => e.courseId !== id));
  };

  const addModule = (courseId: string, module: Omit<Module, 'id' | 'lessons'>) => {
    const newModule: Module = {
      ...module,
      id: crypto.randomUUID(),
      lessons: []
    };
    setCourses(prev => prev.map(c => {
      if (c.id === courseId) {
        return { ...c, modules: [...c.modules, newModule] };
      }
      return c;
    }));
  };

  const updateModule = (moduleId: string, updates: Partial<Module>) => {
    setCourses(prev => prev.map(c => ({
      ...c,
      modules: c.modules.map(m => m.id === moduleId ? { ...m, ...updates } : m)
    })));
  };

  const deleteModule = (moduleId: string) => {
    setCourses(prev => prev.map(c => ({
      ...c,
      modules: c.modules.filter(m => m.id !== moduleId)
    })));
  };

  const addLesson = (moduleId: string, lesson: Omit<Lesson, 'id'>) => {
    const newLesson: Lesson = {
      ...lesson,
      id: crypto.randomUUID()
    };
    setCourses(prev => prev.map(c => ({
      ...c,
      modules: c.modules.map(m => {
        if (m.id === moduleId) {
          return { ...m, lessons: [...m.lessons, newLesson] };
        }
        return m;
      }),
      totalLessons: c.modules.reduce((acc, m) => acc + (m.id === moduleId ? m.lessons.length + 1 : m.lessons.length), 0),
      totalDuration: c.modules.reduce((acc, m) => acc + m.lessons.reduce((a, l) => a + l.duration, 0), 0) + lesson.duration
    })));
  };

  const updateLesson = (lessonId: string, updates: Partial<Lesson>) => {
    setCourses(prev => prev.map(c => ({
      ...c,
      modules: c.modules.map(m => ({
        ...m,
        lessons: m.lessons.map(l => l.id === lessonId ? { ...l, ...updates } : l)
      }))
    })));
  };

  const deleteLesson = (lessonId: string) => {
    setCourses(prev => prev.map(c => ({
      ...c,
      modules: c.modules.map(m => ({
        ...m,
        lessons: m.lessons.filter(l => l.id !== lessonId)
      }))
    })));
    setLessonProgress(prev => prev.filter(lp => lp.lessonId !== lessonId));
  };

  const registerStudent = async (email: string, password: string, firstName: string, lastName: string): Promise<boolean> => {
    if (students.find(s => s.email === email)) {
      return false;
    }
    const newStudent: Student = {
      id: crypto.randomUUID(),
      email,
      firstName,
      lastName,
      createdAt: new Date().toISOString()
    };
    setStudents(prev => [...prev, newStudent]);
    setPasswords(prev => ({ ...prev, [newStudent.id]: password }));
    setCurrentStudent(newStudent);
    return true;
  };

  const loginStudent = async (email: string, password: string): Promise<boolean> => {
    const student = students.find(s => s.email === email);
    if (student && passwords[student.id] === password) {
      setCurrentStudent(student);
      return true;
    }
    return false;
  };

  const logoutStudent = () => {
    setCurrentStudent(null);
  };

  const enrollInCourse = (courseId: string) => {
    if (!currentStudent) return;
    
    const existingEnrollment = enrollments.find(
      e => e.studentId === currentStudent.id && e.courseId === courseId
    );
    
    if (existingEnrollment) return;

    const newEnrollment: Enrollment = {
      id: crypto.randomUUID(),
      studentId: currentStudent.id,
      courseId,
      enrolledAt: new Date().toISOString(),
      status: 'active',
      progressPercent: 0,
      certificateIssued: false
    };
    setEnrollments(prev => [...prev, newEnrollment]);
  };

  const enrollWithPayment = (courseId: string, paymentId: string, orderId: string) => {
    if (!currentStudent) return;
    
    const course = courses.find(c => c.id === courseId);
    if (!course) return;

    // Check if already enrolled
    const existingEnrollment = enrollments.find(
      e => e.studentId === currentStudent.id && e.courseId === courseId
    );
    
    if (existingEnrollment) return;

    // Record the payment
    const newPayment: CoursePayment = {
      id: crypto.randomUUID(),
      orderId,
      studentId: currentStudent.id,
      courseId,
      courseTitle: course.title,
      amount: course.price,
      currency: 'USD',
      status: 'completed',
      stripePaymentId: paymentId,
      createdAt: new Date().toISOString()
    };
    setPayments(prev => [...prev, newPayment]);

    // Create enrollment
    const newEnrollment: Enrollment = {
      id: crypto.randomUUID(),
      studentId: currentStudent.id,
      courseId,
      enrolledAt: new Date().toISOString(),
      status: 'active',
      progressPercent: 0,
      certificateIssued: false
    };
    setEnrollments(prev => [...prev, newEnrollment]);
  };

  const addPayment = (payment: Omit<CoursePayment, 'id' | 'createdAt'>) => {
    const newPayment: CoursePayment = {
      ...payment,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString()
    };
    setPayments(prev => [...prev, newPayment]);
  };

  const markLessonComplete = (lessonId: string) => {
    if (!currentStudent) return;

    // Find the course and enrollment
    let enrollmentId: string | null = null;
    let courseId: string | null = null;

    for (const course of courses) {
      for (const module of course.modules) {
        if (module.lessons.find(l => l.id === lessonId)) {
          courseId = course.id;
          break;
        }
      }
      if (courseId) break;
    }

    if (!courseId) return;

    const enrollment = enrollments.find(
      e => e.studentId === currentStudent.id && e.courseId === courseId
    );

    if (!enrollment) return;
    enrollmentId = enrollment.id;

    const existingProgress = lessonProgress.find(
      lp => lp.enrollmentId === enrollmentId && lp.lessonId === lessonId
    );

    if (existingProgress) {
      setLessonProgress(prev => prev.map(lp => 
        lp.id === existingProgress.id 
          ? { ...lp, isCompleted: true, completedAt: new Date().toISOString() }
          : lp
      ));
    } else {
      const newProgress: LessonProgress = {
        id: crypto.randomUUID(),
        enrollmentId,
        lessonId,
        isCompleted: true,
        completedAt: new Date().toISOString(),
        timeSpentSeconds: 0
      };
      setLessonProgress(prev => [...prev, newProgress]);
    }

    // Update enrollment progress
    const course = courses.find(c => c.id === courseId);
    if (course) {
      const totalLessons = course.modules.reduce((acc, m) => acc + m.lessons.length, 0);
      const completedLessons = lessonProgress.filter(
        lp => lp.enrollmentId === enrollmentId && lp.isCompleted
      ).length + 1;
      const progressPercent = Math.round((completedLessons / totalLessons) * 100);

      setEnrollments(prev => prev.map(e => {
        if (e.id === enrollmentId) {
          const isComplete = progressPercent >= 100;
          return {
            ...e,
            progressPercent,
            status: isComplete ? 'completed' : 'active',
            completedAt: isComplete ? new Date().toISOString() : undefined
          };
        }
        return e;
      }));
    }
  };

  const getEnrollmentProgress = (enrollmentId: string): number => {
    const enrollment = enrollments.find(e => e.id === enrollmentId);
    return enrollment?.progressPercent || 0;
  };

  const getCourseById = (id: string): Course | undefined => {
    return courses.find(c => c.id === id);
  };

  const getStudentEnrollments = (): Enrollment[] => {
    if (!currentStudent) return [];
    return enrollments.filter(e => e.studentId === currentStudent.id);
  };

  const getStudentPayments = (): CoursePayment[] => {
    if (!currentStudent) return [];
    return payments.filter(p => p.studentId === currentStudent.id);
  };

  return (
    <CourseContext.Provider value={{
      courses,
      students,
      enrollments,
      lessonProgress,
      payments,
      currentStudent,
      addCourse,
      updateCourse,
      deleteCourse,
      addModule,
      updateModule,
      deleteModule,
      addLesson,
      updateLesson,
      deleteLesson,
      registerStudent,
      loginStudent,
      logoutStudent,
      enrollInCourse,
      enrollWithPayment,
      markLessonComplete,
      getEnrollmentProgress,
      getCourseById,
      getStudentEnrollments,
      getStudentPayments,
      addPayment
    }}>
      {children}
    </CourseContext.Provider>
  );
}

export function useCourses() {
  const context = useContext(CourseContext);
  if (!context) {
    throw new Error('useCourses must be used within a CourseProvider');
  }
  return context;
}
