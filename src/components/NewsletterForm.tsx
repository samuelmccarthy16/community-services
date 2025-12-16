import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Mail } from 'lucide-react';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: 'Error',
        description: 'Please enter your email address',
        variant: 'destructive',
      });
      return;
    }

    if (!validateEmail(email)) {
      toast({
        title: 'Invalid Email',
        description: 'Please enter a valid email address',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      const subscribers = JSON.parse(localStorage.getItem('newsletter_subscribers') || '[]');
      
      if (subscribers.find((sub: any) => sub.email === email)) {
        toast({
          title: 'Already Subscribed',
          description: 'This email is already subscribed to our newsletter',
          variant: 'destructive',
        });
        setLoading(false);
        return;
      }

      const newSubscriber = {
        id: crypto.randomUUID(),
        email,
        subscribedAt: new Date().toISOString(),
        confirmed: true,
      };

      subscribers.push(newSubscriber);
      localStorage.setItem('newsletter_subscribers', JSON.stringify(subscribers));

      toast({
        title: 'Success!',
        description: 'Thank you for subscribing to our newsletter!',
      });

      setEmail('');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to subscribe. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
        disabled={loading}
      />
      <Button type="submit" disabled={loading} className="bg-white text-purple-900 hover:bg-white/90">
        <Mail className="w-4 h-4 mr-2" />
        {loading ? 'Subscribing...' : 'Subscribe'}
      </Button>
    </form>
  );
}
