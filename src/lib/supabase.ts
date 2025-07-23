  // src/lib/supabase.ts
  import { createClient } from '@supabase/supabase-js';

  const supabaseUrl = 'https://kvdzljmakwmrloedzhuf.supabase.co';
  const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt2ZHpsam1ha3dtcmxvZWR6aHVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMxOTI2OTIsImV4cCI6MjA2ODc2ODY5Mn0.CO86EZt0pP5H174hMsj70SmI1xnVgj1BGOzLFwVB0h8';

  export const supabase = createClient(supabaseUrl, supabaseAnonKey);