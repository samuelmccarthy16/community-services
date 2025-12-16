import { Copy, CheckCircle, Building2, Mail, Phone, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function BankTransferInfo() {
  const [copied, setCopied] = useState('');

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(''), 2000);
  };

  const bankDetails = [
    { label: 'Bank Name', value: 'Chase Bank' },
    { label: 'Account Name', value: 'Blissful Transformations Inc' },
    { label: 'Account Number', value: '483726591024' },
    { label: 'Routing Number', value: '021000021' },
    { label: 'Account Type', value: 'Non-Profit Checking' },
    { label: 'SWIFT Code', value: 'CHASUS33' }
  ];

  const internationalDetails = [
    { label: 'IBAN', value: 'US64CHAS0000000483726591024' },
    { label: 'Bank Address', value: '270 Park Avenue, New York, NY 10017' }
  ];

  return (
    <div className="space-y-6">
      {/* Instructions Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-5">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
            <Building2 className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-blue-900 mb-1">Bank Transfer Instructions</h3>
            <p className="text-sm text-blue-700">
              Use the details below to make your donation via bank transfer. 
              Please include your name and "Donation" in the transfer reference.
            </p>
          </div>
        </div>
      </div>

      {/* Domestic Transfer Details */}
      <div>
        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <span className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-xs font-bold text-green-700">US</span>
          Domestic Transfer (USA)
        </h4>
        <div className="space-y-2">
          {bankDetails.map((detail) => (
            <div 
              key={detail.label} 
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div>
                <div className="text-xs text-gray-500 uppercase tracking-wide">{detail.label}</div>
                <div className="font-medium text-gray-900">{detail.value}</div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(detail.value, detail.label)}
                className="hover:bg-white"
              >
                {copied === detail.label ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : (
                  <Copy className="w-4 h-4 text-gray-400" />
                )}
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* International Transfer Details */}
      <div>
        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <span className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold text-blue-700">INT</span>
          International Wire Transfer
        </h4>
        <div className="space-y-2">
          {internationalDetails.map((detail) => (
            <div 
              key={detail.label} 
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div>
                <div className="text-xs text-gray-500 uppercase tracking-wide">{detail.label}</div>
                <div className="font-medium text-gray-900 text-sm">{detail.value}</div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(detail.value, detail.label)}
                className="hover:bg-white"
              >
                {copied === detail.label ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : (
                  <Copy className="w-4 h-4 text-gray-400" />
                )}
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Important Notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-amber-800 mb-1">Important</p>
            <p className="text-amber-700">
              After completing your transfer, please email us at{' '}
              <a href="mailto:donations@blissfultransformations.org" className="font-medium underline">
                donations@blissfultransformations.org
              </a>{' '}
              with your transaction confirmation so we can send you a tax-deductible receipt.
            </p>
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <div className="bg-gray-50 rounded-xl p-4">
        <h4 className="font-medium text-gray-900 mb-3">Need Help?</h4>
        <div className="space-y-2 text-sm">
          <a 
            href="mailto:finance@blissfultransformations.org" 
            className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors"
          >
            <Mail className="w-4 h-4" />
            finance@blissfultransformations.org
          </a>
          <a 
            href="tel:+1-800-555-0199" 
            className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors"
          >
            <Phone className="w-4 h-4" />
            +1 (800) 555-0199
          </a>
        </div>
      </div>
    </div>
  );
}
