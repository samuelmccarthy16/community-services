import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Wallet, Loader2, CheckCircle, ExternalLink, Shield } from 'lucide-react';

interface PayPalPaymentFormProps {
  amount: number;
  name: string;
  email: string;
  isRecurring?: boolean;
  onSuccess: () => void;
}

export default function PayPalPaymentForm({ 
  amount, name, email, isRecurring = false, onSuccess 
}: PayPalPaymentFormProps) {
  const [loading, setLoading] = useState(false);
  const [paypalEmail, setPaypalEmail] = useState(email);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [error, setError] = useState('');
  const { toast } = useToast();

  const handlePayPalPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!paypalEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(paypalEmail)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Simulate PayPal redirect and payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setPaymentSuccess(true);
      
      toast({ 
        title: 'Thank you for your generosity!', 
        description: `Your ${isRecurring ? 'monthly ' : ''}donation of $${amount.toFixed(2)} via PayPal was successful.`
      });
      
      setTimeout(() => {
        onSuccess();
      }, 2000);
      
    } catch (err: any) {
      setError('Payment failed. Please try again.');
      toast({ 
        title: 'Payment Error', 
        description: 'There was an issue processing your PayPal payment. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  if (paymentSuccess) {
    return (
      <div className="text-center py-8">
        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-10 h-10 text-blue-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">PayPal Payment Successful!</h3>
        <p className="text-gray-600 mb-4">
          Thank you for your {isRecurring ? 'monthly ' : ''}donation of ${amount.toFixed(2)}
        </p>
        <p className="text-sm text-gray-500">
          A confirmation email has been sent to {paypalEmail}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handlePayPalPayment} className="space-y-5">
      {/* PayPal Info */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-5">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
            <Wallet className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-blue-900">Pay with PayPal</h3>
            <p className="text-sm text-blue-700">
              Fast, secure payment with buyer protection
            </p>
          </div>
        </div>
      </div>

      {/* PayPal Email */}
      <div>
        <Label className="text-sm font-medium text-gray-700 mb-2 block">PayPal Email Address</Label>
        <Input
          type="email"
          placeholder="your-email@example.com"
          value={paypalEmail}
          onChange={(e) => { setPaypalEmail(e.target.value); setError(''); }}
          className={`h-12 ${error ? 'border-red-500' : ''}`}
        />
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        <p className="text-xs text-gray-500 mt-1">
          You'll be redirected to PayPal to complete your payment securely
        </p>
      </div>

      {/* Amount Summary */}
      <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Donation Amount</span>
          <span className="text-xl font-bold text-gray-900">
            ${amount.toFixed(2)}
            {isRecurring && <span className="text-sm font-normal text-gray-500">/month</span>}
          </span>
        </div>
      </div>

      {/* Submit Button */}
      <Button 
        type="submit" 
        disabled={loading} 
        className="w-full h-14 text-lg bg-[#0070ba] hover:bg-[#003087] shadow-lg"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Connecting to PayPal...
          </>
        ) : (
          <>
            <Wallet className="w-5 h-5 mr-2" />
            Pay with PayPal
            <ExternalLink className="w-4 h-4 ml-2" />
          </>
        )}
      </Button>

      {/* Security Note */}
      <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
        <Shield className="w-3 h-3" />
        <span>Protected by PayPal Buyer Protection</span>
      </div>
    </form>
  );
}
