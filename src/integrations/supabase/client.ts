// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://bgqfmnwmsdkbtzxnvfml.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJncWZtbndtc2RrYnR6eG52Zm1sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA5NjM4NDUsImV4cCI6MjA2NjUzOTg0NX0.8qhOo-B_vZxmbpUqKp1Ao0dzVVZWl8caCGl0QvnQJb8";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);