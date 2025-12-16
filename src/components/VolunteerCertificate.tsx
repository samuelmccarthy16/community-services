import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Award, Download } from 'lucide-react';

interface VolunteerCertificateProps {
  volunteerName: string;
  totalHours: number;
  startDate: string;
}

export default function VolunteerCertificate({ volunteerName, totalHours, startDate }: VolunteerCertificateProps) {
  const handleDownload = () => {
    const certificateContent = `
      CERTIFICATE OF APPRECIATION
      
      This is to certify that
      ${volunteerName}
      
      Has volunteered ${totalHours} hours with our organization
      Since ${new Date(startDate).toLocaleDateString()}
      
      We deeply appreciate your dedication and service to the community.
      
      Date: ${new Date().toLocaleDateString()}
    `;
    
    const blob = new Blob([certificateContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `volunteer-certificate-${volunteerName.replace(/\s/g, '-')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="p-8 bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200">
      <div className="text-center space-y-4">
        <Award className="h-16 w-16 mx-auto text-blue-600" />
        <h2 className="text-3xl font-bold text-gray-800">Certificate of Appreciation</h2>
        <div className="text-lg">This is to certify that</div>
        <div className="text-4xl font-bold text-blue-600">{volunteerName}</div>
        <div className="text-lg">Has volunteered</div>
        <div className="text-5xl font-bold text-purple-600">{totalHours}</div>
        <div className="text-lg">hours with our organization</div>
        <div className="text-gray-600">Since {new Date(startDate).toLocaleDateString()}</div>
        <p className="text-gray-700 italic mt-6">
          We deeply appreciate your dedication and service to the community.
        </p>
        <div className="text-sm text-gray-500 mt-4">
          Date: {new Date().toLocaleDateString()}
        </div>
        <Button onClick={handleDownload} className="mt-6">
          <Download className="h-4 w-4 mr-2" />
          Download Certificate
        </Button>
      </div>
    </Card>
  );
}
