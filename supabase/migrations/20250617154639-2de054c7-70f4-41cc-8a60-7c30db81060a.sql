
-- Create user profiles table for personalized features
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  username TEXT,
  location_lat DECIMAL,
  location_lng DECIMAL,
  location_name TEXT,
  preferred_units TEXT DEFAULT 'metric',
  dark_mode BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for saved astronomy events
CREATE TABLE public.saved_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  event_type TEXT NOT NULL,
  event_title TEXT NOT NULL,
  event_date TIMESTAMP WITH TIME ZONE NOT NULL,
  event_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for AI chat history
CREATE TABLE public.chat_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  session_title TEXT,
  messages JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for stargazing events
CREATE TABLE public.stargazing_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  location_name TEXT NOT NULL,
  location_lat DECIMAL NOT NULL,
  location_lng DECIMAL NOT NULL,
  organizer TEXT,
  event_type TEXT DEFAULT 'public',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stargazing_events ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view their own profile" 
  ON public.profiles 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own profile" 
  ON public.profiles 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create policies for saved events
CREATE POLICY "Users can view their own saved events" 
  ON public.saved_events 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own saved events" 
  ON public.saved_events 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own saved events" 
  ON public.saved_events 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create policies for chat sessions
CREATE POLICY "Users can view their own chat sessions" 
  ON public.chat_sessions 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own chat sessions" 
  ON public.chat_sessions 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own chat sessions" 
  ON public.chat_sessions 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create policies for stargazing events (public read, authenticated users can create)
CREATE POLICY "Anyone can view stargazing events" 
  ON public.stargazing_events 
  FOR SELECT 
  TO public 
  USING (true);

CREATE POLICY "Authenticated users can create stargazing events" 
  ON public.stargazing_events 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (true);

-- Create trigger function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER chat_sessions_updated_at
  BEFORE UPDATE ON public.chat_sessions
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Insert some sample stargazing events
INSERT INTO public.stargazing_events (title, description, date, location_name, location_lat, location_lng, organizer, event_type) VALUES
('Geminids Meteor Shower Viewing', 'Join us for the peak viewing of the Geminids meteor shower with up to 120 meteors per hour!', '2024-12-14 02:00:00+00', 'Central Park Observatory', 40.7829, -73.9654, 'NYC Astronomy Club', 'public'),
('Lunar Eclipse Watch Party', 'Community gathering to observe the penumbral lunar eclipse with telescopes provided.', '2024-03-25 07:13:00+00', 'Griffith Observatory', 34.1184, -118.3004, 'LA Stargazers', 'public'),
('Venus at Greatest Elongation', 'Best time to observe Venus in the evening sky. Telescopes and expert guidance available.', '2024-01-09 20:00:00+00', 'Mount Wilson Observatory', 34.2258, -118.0572, 'Mount Wilson Institute', 'public');
