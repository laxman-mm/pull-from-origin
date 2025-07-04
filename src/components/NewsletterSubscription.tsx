import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Loader2 } from 'lucide-react';
import { useNewsletter } from '@/hooks/useNewsletter';

interface NewsletterSubscriptionProps {
  title?: string;
  description?: string;
  source?: string;
  className?: string;
  variant?: 'card' | 'inline' | 'footer';
}

export function NewsletterSubscription({ 
  title = "Subscribe to our Newsletter",
  description = "Get our latest recipes and cooking tips straight to your inbox.",
  source = "website",
  className = "",
  variant = "card"
}: NewsletterSubscriptionProps) {
  const [email, setEmail] = useState('');
  const { subscribeToNewsletter, isSubmitting } = useNewsletter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return;
    }
    
    const result = await subscribeToNewsletter(email.trim(), source);
    
    if (result.success) {
      setEmail('');
    }
  };

  const isValidEmail = email.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  if (variant === 'inline') {
    return (
      <div className={`flex flex-col sm:flex-row gap-2 ${className}`}>
        <Input
          type="email"
          placeholder="Your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isSubmitting}
          className={`flex-1 transition-colors ${
            email && !isValidEmail
              ? 'border-destructive focus:border-destructive'
              : ''
          }`}
        />
        <Button 
          onClick={handleSubmit}
          disabled={isSubmitting || !isValidEmail}
          className="flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Subscribing...
            </>
          ) : (
            <>
              <Mail className="h-4 w-4" />
              Subscribe
            </>
          )}
        </Button>
      </div>
    );
  }

  if (variant === 'footer') {
    return (
      <div className={`space-y-3 ${className}`}>
        <div>
          <h3 className="font-semibold text-sm mb-1">{title}</h3>
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
        <form onSubmit={handleSubmit} className="space-y-2">
          <Input
            type="email"
            placeholder="Your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isSubmitting}
            className={`text-sm transition-colors ${
              email && !isValidEmail
                ? 'border-destructive focus:border-destructive'
                : ''
            }`}
          />
          <Button 
            type="submit"
            size="sm"
            disabled={isSubmitting || !isValidEmail}
            className="w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-3 w-3 animate-spin" />
                Subscribing...
              </>
            ) : (
              <>
                <Mail className="h-3 w-3" />
                Subscribe
              </>
            )}
          </Button>
        </form>
      </div>
    );
  }

  // Default card variant
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          {title}
        </CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input
            type="email"
            placeholder="Your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isSubmitting}
            className={`transition-colors ${
              email && !isValidEmail
                ? 'border-destructive focus:border-destructive'
                : ''
            }`}
          />
          <Button 
            type="submit"
            disabled={isSubmitting || !isValidEmail}
            className="w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Subscribing...
              </>
            ) : (
              <>
                <Mail className="h-4 w-4" />
                Subscribe to Newsletter
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
