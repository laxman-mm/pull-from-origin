import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useNewsletter } from '@/hooks/useNewsletter';

export default function Unsubscribe() {
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  
  const { unsubscribeFromNewsletter, isSubmitting } = useNewsletter();

  useEffect(() => {
    // Check if email is provided in URL params
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setEmail(decodeURIComponent(emailParam));
    }
  }, [searchParams]);

  const handleUnsubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setStatus('error');
      setMessage('Please enter your email address.');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setStatus('error');
      setMessage('Please enter a valid email address.');
      return;
    }

    setStatus('loading');
    const result = await unsubscribeFromNewsletter(email.trim());
    
    if (result.success) {
      setStatus('success');
      setMessage('You have been successfully unsubscribed from our newsletter.');
    } else {
      setStatus('error');
      setMessage(result.error || 'Failed to unsubscribe. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <Mail className="h-5 w-5" />
                Newsletter Unsubscribe
              </CardTitle>
              <CardDescription>
                We're sorry to see you go. Enter your email address below to unsubscribe from our newsletter.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {status === 'success' ? (
                <div className="text-center space-y-4">
                  <CheckCircle className="h-12 w-12 text-green-600 mx-auto" />
                  <div>
                    <h3 className="font-semibold text-green-800 mb-2">Successfully Unsubscribed</h3>
                    <p className="text-sm text-muted-foreground mb-4">{message}</p>
                    <p className="text-xs text-muted-foreground">
                      You will no longer receive our newsletter emails. If you change your mind, 
                      you can always subscribe again from our website.
                    </p>
                  </div>
                  <Link to="/">
                    <Button variant="outline" className="w-full">
                      Return to Home
                    </Button>
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleUnsubscribe} className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                      Email Address
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={status === 'loading' || isSubmitting}
                      className={
                        status === 'error' 
                          ? 'border-destructive focus:border-destructive' 
                          : ''
                      }
                    />
                  </div>

                  {status === 'error' && (
                    <div className="flex items-center gap-2 text-destructive text-sm">
                      <XCircle className="h-4 w-4" />
                      {message}
                    </div>
                  )}

                  <Button 
                    type="submit" 
                    disabled={status === 'loading' || isSubmitting || !email.trim()}
                    className="w-full"
                  >
                    {(status === 'loading' || isSubmitting) ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Unsubscribing...
                      </>
                    ) : (
                      'Unsubscribe'
                    )}
                  </Button>

                  <div className="text-center">
                    <Link to="/" className="text-sm text-muted-foreground hover:text-primary">
                      Return to Home
                    </Link>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>

          {status === 'idle' && (
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground mb-2">
                Changed your mind? You can always
              </p>
              <Link to="/" className="text-sm text-primary hover:underline">
                subscribe again from our homepage
              </Link>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
