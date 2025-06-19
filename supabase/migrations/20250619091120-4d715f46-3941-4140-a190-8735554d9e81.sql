
-- Create a table for AI tutor chat sessions
CREATE TABLE public.ai_tutor_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  session_title TEXT NOT NULL DEFAULT 'New Chat Session',
  messages JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS) to ensure users can only see their own chat sessions
ALTER TABLE public.ai_tutor_sessions ENABLE ROW LEVEL SECURITY;

-- Create policy that allows users to SELECT their own chat sessions
CREATE POLICY "Users can view their own ai tutor sessions" 
  ON public.ai_tutor_sessions 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Create policy that allows users to INSERT their own chat sessions
CREATE POLICY "Users can create their own ai tutor sessions" 
  ON public.ai_tutor_sessions 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create policy that allows users to UPDATE their own chat sessions
CREATE POLICY "Users can update their own ai tutor sessions" 
  ON public.ai_tutor_sessions 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create policy that allows users to DELETE their own chat sessions
CREATE POLICY "Users can delete their own ai tutor sessions" 
  ON public.ai_tutor_sessions 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at_ai_tutor_sessions()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER ai_tutor_sessions_updated_at
    BEFORE UPDATE ON public.ai_tutor_sessions
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at_ai_tutor_sessions();
