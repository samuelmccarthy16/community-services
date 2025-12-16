import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Mail, Package, ArrowRight } from 'lucide-react';

export default function OrderConfirmation() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');

  useEffect(() => {
    if (!orderId) {
      navigate('/shop');
    }
  }, [orderId, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <Card className="text-center">
          <CardHeader className="space-y-4">
            <div className="flex justify-center">
              <div className="bg-green-100 rounded-full p-4">
                <CheckCircle className="w-16 h-16 text-green-600" />
              </div>
            </div>
            <CardTitle className="text-3xl">Order Confirmed!</CardTitle>
            <p className="text-gray-600">Thank you for your purchase. Your order has been successfully placed.</p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <p className="text-sm text-gray-600 mb-2">Order Number</p>
              <p className="text-2xl font-bold text-gray-900">{orderId}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-4 text-left">
              <div className="flex gap-3 p-4 bg-blue-50 rounded-lg">
                <Mail className="w-6 h-6 text-blue-600 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-1">Email Confirmation</h3>
                  <p className="text-sm text-gray-600">A receipt has been sent to your email address.</p>
                </div>
              </div>
              
              <div className="flex gap-3 p-4 bg-purple-50 rounded-lg">
                <Package className="w-6 h-6 text-purple-600 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-1">Shipping Updates</h3>
                  <p className="text-sm text-gray-600">You'll receive tracking information once your order ships.</p>
                </div>
              </div>
            </div>

            <div className="pt-4 space-y-3">
              <Button onClick={() => navigate('/shop')} className="w-full" size="lg">
                Continue Shopping
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button onClick={() => navigate('/')} variant="outline" className="w-full">
                Return to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
