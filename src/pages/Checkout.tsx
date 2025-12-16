import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import CheckoutForm from '@/components/CheckoutForm';
import OrderSummary from '@/components/OrderSummary';
import CheckoutPaymentForm from '@/components/CheckoutPaymentForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function Checkout() {
  const navigate = useNavigate();
  const { cart, cartTotal, clearCart } = useCart();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    phone: ''
  });

  useEffect(() => {
    if (cart.length === 0 && step === 1) {
      navigate('/shop');
    }
  }, [cart, navigate, step]);

  const handleFieldChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleContinueToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handlePaymentSuccess = (orderId: string) => {
    clearCart();
    navigate(`/shop/order-confirmation?orderId=${orderId}`);
  };

  const shipping = 10.00;
  const tax = cartTotal * 0.08;
  const total = cartTotal + shipping + tax;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <Button variant="ghost" onClick={() => step === 1 ? navigate('/shop') : setStep(1)} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          {step === 1 ? 'Back to Shop' : 'Back to Shipping'}
        </Button>

        <h1 className="text-4xl font-bold mb-8">Checkout</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {step === 1 ? (
              <form onSubmit={handleContinueToPayment} className="bg-white rounded-lg shadow-md p-6">
                <CheckoutForm formData={formData} onChange={handleFieldChange} />
                <Button type="submit" size="lg" className="w-full mt-6">
                  Continue to Payment
                </Button>
              </form>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold mb-6">Payment Information</h2>
                <CheckoutPaymentForm 
                  amount={total}
                  customerInfo={formData}
                  cartItems={cart}
                  onSuccess={handlePaymentSuccess}
                />
              </div>
            )}
          </div>

          <div>
            <OrderSummary />
          </div>
        </div>
      </div>
    </div>
  );
}
