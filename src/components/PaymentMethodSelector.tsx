import { CreditCard, Building2, Wallet, Check } from 'lucide-react';

interface PaymentMethodSelectorProps {
  onSelect: (method: 'card' | 'bank' | 'paypal') => void;
  selected: string;
}

export default function PaymentMethodSelector({ onSelect, selected }: PaymentMethodSelectorProps) {
  const methods = [
    { 
      id: 'card', 
      name: 'Credit/Debit Card', 
      icon: CreditCard, 
      description: 'Visa, Mastercard, Amex, Discover',
      recommended: true
    },
    { 
      id: 'bank', 
      name: 'Bank Transfer', 
      icon: Building2, 
      description: 'Direct bank wire transfer',
      recommended: false
    },
    { 
      id: 'paypal', 
      name: 'PayPal', 
      icon: Wallet, 
      description: 'Pay with your PayPal account',
      recommended: false
    }
  ];

  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-gray-900 mb-3">Select Payment Method</label>
      <div className="space-y-3">
        {methods.map((method) => (
          <button
            key={method.id}
            type="button"
            onClick={() => onSelect(method.id as 'card' | 'bank' | 'paypal')}
            className={`w-full flex items-center gap-4 p-4 border-2 rounded-xl transition-all relative ${
              selected === method.id 
                ? 'border-green-500 bg-green-50 shadow-md' 
                : 'border-gray-200 hover:border-green-300 hover:bg-gray-50'
            }`}
          >
            {/* Selection Indicator */}
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
              selected === method.id 
                ? 'border-green-500 bg-green-500' 
                : 'border-gray-300'
            }`}>
              {selected === method.id && <Check className="w-4 h-4 text-white" />}
            </div>
            
            {/* Icon */}
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
              selected === method.id ? 'bg-green-100' : 'bg-gray-100'
            }`}>
              <method.icon className={`w-6 h-6 ${
                selected === method.id ? 'text-green-600' : 'text-gray-500'
              }`} />
            </div>
            
            {/* Text */}
            <div className="text-left flex-1">
              <div className="flex items-center gap-2">
                <span className={`font-semibold ${
                  selected === method.id ? 'text-green-700' : 'text-gray-900'
                }`}>
                  {method.name}
                </span>
                {method.recommended && (
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                    Recommended
                  </span>
                )}
              </div>
              <div className="text-sm text-gray-500 mt-0.5">{method.description}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
