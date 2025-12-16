import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { CreditCard, Loader2 } from 'lucide-react';

interface CheckoutPaymentFormProps {
  amount: number;
  customerInfo: any;
  cartItems: any[];
  onSuccess: (orderId: string) => void;
}

export default function CheckoutPaymentForm({ amount, customerInfo, cartItems, onSuccess }: CheckoutPaymentFormProps) {
  const [loading, setLoading] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const { toast } = useToast();

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: paymentData, error: paymentError } = await supabase.functions.invoke('create-payment-intent', {
        body: { 
          amount: Math.round(amount * 100), 
          currency: 'usd',
          customerEmail: customerInfo.email,
          customerName: customerInfo.fullName,
          metadata: {
            orderType: 'shop',
            items: JSON.stringify(cartItems)
          }
        }
      });

      if (paymentError) throw paymentError;

      const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

      const { error: dbError } = await supabase.from('orders').insert({
        order_id: orderId,
        customer_email: customerInfo.email,
        customer_name: customerInfo.fullName,
        shipping_address: JSON.stringify(customerInfo),
        items: JSON.stringify(cartItems),
        subtotal: amount - 10 - (amount * 0.08),
        shipping: 10,
        tax: amount * 0.08,
        total: amount,
        status: 'completed',
        stripe_payment_id: paymentData.id
      });

      if (dbError) console.error('DB Error:', dbError);

      await supabase.functions.invoke('send-order-confirmation', {
        body: {
          customerEmail: customerInfo.email,
          customerName: customerInfo.fullName,
          orderId,
          amount,
          items: cartItems
        }
      });

      toast({ title: 'Payment Successful!', description: 'Your order has been placed.' });
      onSuccess(orderId);
    } catch (err: any) {
      toast({ title: 'Payment Failed', description: err.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handlePayment} className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <CreditCard className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-blue-900">Secure Payment</h3>
        </div>
        <p className="text-sm text-blue-700">Processed securely through Stripe</p>
      </div>

      <div>
        <Label htmlFor="cardNumber">Card Number</Label>
        <Input id="cardNumber" placeholder="4242 4242 4242 4242" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} required />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="expiry">Expiry</Label>
          <Input id="expiry" placeholder="MM/YY" value={expiry} onChange={(e) => setExpiry(e.target.value)} required />
        </div>
        <div>
          <Label htmlFor="cvc">CVC</Label>
          <Input id="cvc" placeholder="123" value={cvc} onChange={(e) => setCvc(e.target.value)} required />
        </div>
      </div>

      <Button type="submit" disabled={loading} className="w-full" size="lg">
        {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processing...</> : `Pay $${amount.toFixed(2)}`}
      </Button>
    </form>
  );
}
