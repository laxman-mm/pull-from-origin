import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface NewsletterSubscriber {
  id: number;
  document_id?: string;
  email: string;
  subscription_status: 'active' | 'unsubscribed';
  subscribed_at: string;
  source: string;
  preferences?: any;
  created_at: string;
  updated_at: string;
  published_at?: string;
  created_by_id?: number;
  updated_by_id?: number;
  locale?: string;
}

export const useNewsletter = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const subscribeToNewsletter = async (email: string, source: string = 'website') => {
    setIsSubmitting(true);
    
    try {
      // Check if email already exists
      const { data: existingSubscriber, error: checkError } = await supabase
        .from('newsletter_subscribers')
        .select('id, subscription_status')
        .eq('email', email.toLowerCase().trim())
        .maybeSingle();

      if (checkError) {
        throw checkError;
      }

      if (existingSubscriber) {
        // If subscriber exists but is unsubscribed, reactivate
        if (existingSubscriber.subscription_status === 'unsubscribed') {
          const { error: updateError } = await supabase
            .from('newsletter_subscribers')
            .update({
              subscription_status: 'active',
              updated_at: new Date().toISOString(),
              source,
            })
            .eq('id', existingSubscriber.id);

          if (updateError) {
            throw updateError;
          }

          toast({
            title: "Welcome back!",
            description: "Your newsletter subscription has been reactivated.",
          });
          return { success: true, isExisting: true };
        } else {
          toast({
            title: "Already subscribed",
            description: "This email is already subscribed to our newsletter.",
            variant: "default",
          });
          return { success: true, isExisting: true };
        }
      }

      // Create new subscription
      const { error: insertError } = await supabase
        .from('newsletter_subscribers')
        .insert({
          email: email.toLowerCase().trim(),
          subscription_status: 'active',
          subscribed_at: new Date().toISOString(),
          source,
          preferences: {},
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          published_at: new Date().toISOString(),
        });

      if (insertError) {
        throw insertError;
      }

      toast({
        title: "Successfully subscribed!",
        description: "Thank you for subscribing to our newsletter. You'll receive our latest recipes and cooking tips.",
      });

      return { success: true, isExisting: false };

    } catch (error: any) {
      console.error('Newsletter subscription error:', error);
      
      toast({
        title: "Subscription failed",
        description: error.message || "Failed to subscribe to newsletter. Please try again.",
        variant: "destructive",
      });

      return { success: false, error: error.message };
    } finally {
      setIsSubmitting(false);
    }
  };

  const unsubscribeFromNewsletter = async (email: string) => {
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .update({
          subscription_status: 'unsubscribed',
          updated_at: new Date().toISOString(),
        })
        .eq('email', email.toLowerCase().trim());

      if (error) {
        throw error;
      }

      toast({
        title: "Unsubscribed successfully",
        description: "You have been unsubscribed from our newsletter.",
      });

      return { success: true };

    } catch (error: any) {
      console.error('Newsletter unsubscription error:', error);
      
      toast({
        title: "Unsubscription failed",
        description: error.message || "Failed to unsubscribe. Please try again.",
        variant: "destructive",
      });

      return { success: false, error: error.message };
    } finally {
      setIsSubmitting(false);
    }
  };

  const getNewsletterStats = async () => {
    try {
      const { data, error } = await supabase
        .from('newsletter_subscribers')
        .select('subscription_status, created_at')
        .not('published_at', 'is', null);

      if (error) {
        throw error;
      }

      const stats = {
        total: data.length,
        active: data.filter(sub => sub.subscription_status === 'active').length,
        unsubscribed: data.filter(sub => sub.subscription_status === 'unsubscribed').length,
        recent: data.filter(sub => {
          const createdDate = new Date(sub.created_at);
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          return createdDate >= thirtyDaysAgo;
        }).length,
      };

      return { success: true, stats };

    } catch (error: any) {
      console.error('Error fetching newsletter stats:', error);
      return { success: false, error: error.message };
    }
  };

  const getAllSubscribers = async () => {
    try {
      const { data, error } = await supabase
        .from('newsletter_subscribers')
        .select('*')
        .not('published_at', 'is', null)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return { success: true, subscribers: data };

    } catch (error: any) {
      console.error('Error fetching subscribers:', error);
      return { success: false, error: error.message };
    }
  };

  return {
    subscribeToNewsletter,
    unsubscribeFromNewsletter,
    getNewsletterStats,
    getAllSubscribers,
    isSubmitting,
  };
};
