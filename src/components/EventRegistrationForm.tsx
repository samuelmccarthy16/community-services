import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface EventRegistrationFormProps {
  eventId: string;
  eventTitle: string;
  onSuccess?: () => void;
}

export default function EventRegistrationForm({ eventId, eventTitle, onSuccess }: EventRegistrationFormProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    guestsCount: '1',
    dietaryRequirements: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: 'Registration Successful!',
        description: `You've been registered for ${eventTitle}. Check your email for confirmation.`,
      });

      setFormData({
        name: '',
        email: '',
        phone: '',
        guestsCount: '1',
        dietaryRequirements: ''
      });

      if (onSuccess) onSuccess();
    } catch (error) {
      toast({
        title: 'Registration Failed',
        description: 'Please try again later.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Full Name *</Label>
        <Input
          id="name"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="John Doe"
        />
      </div>

      <div>
        <Label htmlFor="email">Email Address *</Label>
        <Input
          id="email"
          type="email"
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="john@example.com"
        />
      </div>

      <div>
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          placeholder="(555) 123-4567"
        />
      </div>

      <div>
        <Label htmlFor="guests">Number of Guests</Label>
        <Input
          id="guests"
          type="number"
          min="1"
          max="10"
          value={formData.guestsCount}
          onChange={(e) => setFormData({ ...formData, guestsCount: e.target.value })}
        />
      </div>

      <div>
        <Label htmlFor="dietary">Dietary Requirements</Label>
        <Textarea
          id="dietary"
          value={formData.dietaryRequirements}
          onChange={(e) => setFormData({ ...formData, dietaryRequirements: e.target.value })}
          placeholder="Any allergies or dietary restrictions..."
          rows={3}
        />
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Registering...' : 'Complete Registration'}
      </Button>
    </form>
  );
}
