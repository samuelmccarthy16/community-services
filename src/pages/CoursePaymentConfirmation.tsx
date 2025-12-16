import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useCourses } from '@/contexts/CourseContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle, BookOpen, Clock, Award, Play, 
  Download, Mail, ArrowRight, GraduationCap 
} from 'lucide-react';

const CoursePaymentConfirmation: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { courses, currentStudent } = useCourses();

  const orderId = searchParams.get('orderId');
  const courseId = searchParams.get('courseId');
  const amount = searchParams.get('amount');

  const course = courses.find(c => c.id === courseId);

  if (!currentStudent) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <Card className="max-w-md mx-auto p-8">
            <h1 className="text-2xl font-bold mb-4">Session Expired</h1>
            <p className="text-gray-600 mb-6">Please log in to view your enrollment confirmation.</p>
            <Button onClick={() => navigate('/student-portal')}>
              Go to Student Portal
            </Button>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <Header />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6 animate-pulse">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Payment Successful!
            </h1>
            <p className="text-xl text-gray-600">
              You're now enrolled in your new course
            </p>
          </div>

          {/* Order Details Card */}
          <Card className="p-6 mb-6">
            <div className="flex items-center justify-between border-b pb-4 mb-4">
              <div>
                <p className="text-sm text-gray-500">Order ID</p>
                <p className="font-mono font-semibold">{orderId}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Amount Paid</p>
                <p className="text-2xl font-bold text-green-600">${amount}</p>
              </div>
            </div>

            {course && (
              <div className="flex gap-4">
                {course.imageUrl && (
                  <img 
                    src={course.imageUrl} 
                    alt={course.title}
                    className="w-32 h-24 object-cover rounded-lg"
                  />
                )}
                <div className="flex-1">
                  <h2 className="text-xl font-semibold mb-2">{course.title}</h2>
                  <p className="text-gray-600 text-sm mb-3">{course.shortDescription}</p>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" /> {course.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <Award className="w-4 h-4" /> {course.level}
                    </span>
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4" /> {course.modules.reduce((acc, m) => acc + m.lessons.length, 0)} lessons
                    </span>
                  </div>
                </div>
              </div>
            )}
          </Card>

          {/* What's Next Card */}
          <Card className="p-6 mb-6 bg-gradient-to-r from-blue-50 to-green-50">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-blue-600" />
              What's Next?
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 font-semibold">1</span>
                </div>
                <div>
                  <p className="font-medium">Start Learning Immediately</p>
                  <p className="text-sm text-gray-600">Your course is ready to access right now</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 font-semibold">2</span>
                </div>
                <div>
                  <p className="font-medium">Track Your Progress</p>
                  <p className="text-sm text-gray-600">Complete lessons and track your advancement</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 font-semibold">3</span>
                </div>
                <div>
                  <p className="font-medium">Earn Your Certificate</p>
                  <p className="text-sm text-gray-600">Complete all lessons to receive your certificate</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Confirmation Email Notice */}
          <Card className="p-4 mb-6 border-blue-200 bg-blue-50">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-blue-600" />
              <div>
                <p className="font-medium text-blue-900">Confirmation Email Sent</p>
                <p className="text-sm text-blue-700">
                  A receipt has been sent to {currentStudent.email}
                </p>
              </div>
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              className="flex-1 bg-gradient-to-r from-blue-600 to-green-600 h-12 text-lg"
              onClick={() => navigate('/student-portal')}
            >
              <Play className="w-5 h-5 mr-2" />
              Start Learning Now
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button 
              variant="outline" 
              className="flex-1 h-12"
              onClick={() => window.print()}
            >
              <Download className="w-5 h-5 mr-2" />
              Download Receipt
            </Button>
          </div>

          {/* Support Info */}
          <div className="text-center mt-8 text-sm text-gray-500">
            <p>Need help? Contact our support team at support@example.com</p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CoursePaymentConfirmation;
