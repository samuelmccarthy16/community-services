import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import DonationImpact from '@/components/DonationImpact';
import DonorWall from '@/components/DonorWall';
import StripePaymentForm from '@/components/StripePaymentForm';
import PaymentMethodSelector from '@/components/PaymentMethodSelector';
import BankTransferInfo from '@/components/BankTransferInfo';
import PayPalPaymentForm from '@/components/PayPalPaymentForm';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';
import { Heart, Shield, Users, Globe, ArrowLeft, Check, Sparkles, CreditCard, Building2, Wallet } from 'lucide-react';

export default function Donate() {
  const [amount, setAmount] = useState(100);
  const [customAmount, setCustomAmount] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'bank' | 'paypal'>('card');
  const [showPayment, setShowPayment] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const presetAmounts = [25, 50, 100, 250, 500, 1000];
  const finalAmount = customAmount ? parseFloat(customAmount) : amount;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (finalAmount <= 0 || isNaN(finalAmount)) {
      newErrors.amount = 'Please select or enter a valid amount';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (!validateForm()) {
      return;
    }
    setShowPayment(true);
    // Scroll to top of form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSuccess = () => {
    setName('');
    setEmail('');
    setMessage('');
    setCustomAmount('');
    setAmount(100);
    setIsRecurring(false);
    setShowPayment(false);
    setTimeout(() => window.location.reload(), 2000);
  };

  const impactItems = [
    { amount: 25, impact: 'Provides school supplies for 5 children' },
    { amount: 50, impact: 'Feeds a family for one week' },
    { amount: 100, impact: 'Provides medical care for 10 people' },
    { amount: 250, impact: 'Funds a community health workshop' },
    { amount: 500, impact: 'Supports a teacher for one month' },
    { amount: 1000, impact: 'Builds a clean water well' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm mb-6">
            <Heart className="w-10 h-10" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Make a Difference Today</h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Your generous donation transforms lives and creates lasting change in communities around the world.
          </p>
          
          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-6 mt-8">
            <div className="flex items-center gap-2 text-white/80">
              <Shield className="w-5 h-5" />
              <span className="text-sm">Secure Payment</span>
            </div>
            <div className="flex items-center gap-2 text-white/80">
              <Check className="w-5 h-5" />
              <span className="text-sm">Tax Deductible</span>
            </div>
            <div className="flex items-center gap-2 text-white/80">
              <Globe className="w-5 h-5" />
              <span className="text-sm">Global Impact</span>
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            {/* Donation Form */}
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 order-2 lg:order-1">
              {!showPayment ? (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose Your Gift</h2>
                    <p className="text-gray-600">Select an amount or enter a custom donation</p>
                  </div>

                  {/* Amount Selection */}
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-3 block">Select Amount</Label>
                    <div className="grid grid-cols-3 gap-3">
                      {presetAmounts.map(amt => (
                        <button 
                          key={amt} 
                          type="button" 
                          onClick={() => { setAmount(amt); setCustomAmount(''); setErrors({ ...errors, amount: '' }); }}
                          className={`relative p-4 rounded-xl border-2 transition-all ${
                            amount === amt && !customAmount 
                              ? 'border-blue-500 bg-blue-50 text-blue-700' 
                              : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                          }`}
                        >
                          <span className="text-xl font-bold">${amt}</span>
                          {amount === amt && !customAmount && (
                            <span className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                              <Check className="w-4 h-4 text-white" />
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                    {errors.amount && <p className="text-red-500 text-sm mt-2">{errors.amount}</p>}
                  </div>

                  {/* Custom Amount */}
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">Or Enter Custom Amount</Label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">$</span>
                      <Input 
                        placeholder="Enter amount" 
                        type="number" 
                        min="1"
                        value={customAmount} 
                        onChange={(e) => { setCustomAmount(e.target.value); setErrors({ ...errors, amount: '' }); }}
                        className="pl-8 h-12 text-lg"
                      />
                    </div>
                  </div>

                  {/* Recurring Option */}
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4 border border-green-200">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={isRecurring} 
                        onChange={(e) => setIsRecurring(e.target.checked)}
                        className="w-5 h-5 mt-0.5 rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                      <div>
                        <span className="font-medium text-gray-900 flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-green-600" />
                          Make this a monthly donation
                        </span>
                        <p className="text-sm text-gray-600 mt-1">
                          Become a sustaining donor and multiply your impact over time
                        </p>
                      </div>
                    </label>
                  </div>

                  {/* Personal Info */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900">Your Information</h3>
                    
                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-2 block">Full Name *</Label>
                      <Input 
                        placeholder="John Doe" 
                        value={name} 
                        onChange={(e) => { setName(e.target.value); setErrors({ ...errors, name: '' }); }}
                        className={`h-12 ${errors.name ? 'border-red-500' : ''}`}
                      />
                      {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-2 block">Email Address *</Label>
                      <Input 
                        type="email" 
                        placeholder="john@example.com" 
                        value={email} 
                        onChange={(e) => { setEmail(e.target.value); setErrors({ ...errors, email: '' }); }}
                        className={`h-12 ${errors.email ? 'border-red-500' : ''}`}
                      />
                      {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-2 block">Message (optional)</Label>
                      <Textarea 
                        placeholder="Share why you're donating or leave a message of support..." 
                        value={message} 
                        onChange={(e) => setMessage(e.target.value)}
                        rows={3}
                      />
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Donation Amount</span>
                      <span className="text-2xl font-bold text-gray-900">
                        ${finalAmount > 0 ? finalAmount.toFixed(2) : '0.00'}
                        {isRecurring && <span className="text-sm font-normal text-gray-500">/month</span>}
                      </span>
                    </div>
                  </div>

                  <Button 
                    onClick={handleContinue} 
                    className="w-full h-14 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    <Heart className="w-5 h-5 mr-2" />
                    Continue to Payment
                  </Button>

                  <p className="text-center text-sm text-gray-500">
                    <Shield className="w-4 h-4 inline mr-1" />
                    Your payment information is secure and encrypted
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  <Button 
                    variant="ghost" 
                    onClick={() => setShowPayment(false)} 
                    className="mb-2 -ml-2"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to donation details
                  </Button>

                  <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-blue-600">Donating to Blissful Transformations</p>
                        <p className="text-2xl font-bold text-blue-900">
                          ${finalAmount.toFixed(2)}
                          {isRecurring && <span className="text-sm font-normal">/month</span>}
                        </p>
                      </div>
                      <Heart className="w-10 h-10 text-blue-500" />
                    </div>
                  </div>

                  <PaymentMethodSelector 
                    selected={paymentMethod} 
                    onSelect={setPaymentMethod} 
                  />

                  {paymentMethod === 'card' && (
                    <StripePaymentForm
                      amount={finalAmount}
                      name={name}
                      email={email}
                      message={message}
                      isRecurring={isRecurring}
                      onSuccess={handleSuccess}
                    />
                  )}
                  {paymentMethod === 'bank' && <BankTransferInfo />}
                  {paymentMethod === 'paypal' && (
                    <PayPalPaymentForm
                      amount={finalAmount}
                      name={name}
                      email={email}
                      isRecurring={isRecurring}
                      onSuccess={handleSuccess}
                    />
                  )}

                </div>
              )}
            </div>

            {/* Impact Section */}
            <div className="order-1 lg:order-2">
              <DonationImpact amount={finalAmount} />
              
              {/* Quick Impact Guide */}
              <div className="bg-white rounded-2xl shadow-lg p-6 mt-6">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-green-600" />
                  Your Impact at a Glance
                </h3>
                <div className="space-y-3">
                  {impactItems.map((item) => (
                    <div 
                      key={item.amount}
                      className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                        finalAmount >= item.amount ? 'bg-green-50 border border-green-200' : 'bg-gray-50'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        finalAmount >= item.amount ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
                      }`}>
                        {finalAmount >= item.amount ? <Check className="w-4 h-4" /> : '$'}
                      </div>
                      <div className="flex-1">
                        <span className={`font-medium ${finalAmount >= item.amount ? 'text-green-700' : 'text-gray-600'}`}>
                          ${item.amount}
                        </span>
                        <span className={`text-sm ml-2 ${finalAmount >= item.amount ? 'text-green-600' : 'text-gray-500'}`}>
                          {item.impact}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Donor Wall */}
          <DonorWall />
        </div>
      </main>

      <Footer />
      <BackToTop />
    </div>
  );
}
