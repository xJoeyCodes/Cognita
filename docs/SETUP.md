# Setup Instructions

## Quick Start (5 minutes)

### 1. Prerequisites
- Node.js 18+ 
- Supabase account (free)
- Google AI Studio account (free)

### 2. Install & Run
```bash
git clone https://github.com/your-username/cognita-ai.git
cd cognita-ai
npm install
```

### 3. Environment Setup
Create `.env.local` file in the root directory:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key
VITE_GEMINI_API_KEY=your_gemini_key
```

### 4. Database Setup
1. Create project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run this:

```sql
-- Create tables
CREATE TABLE public.user_stats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  total_flashcards INTEGER DEFAULT 0,
  studied_today INTEGER DEFAULT 0,
  average_score FLOAT DEFAULT 0.0,
  study_streak INTEGER DEFAULT 0,
  daily_goal INTEGER DEFAULT 10,
  quiz_sessions_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.flashcards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  pdf_name TEXT,
  pdf_file_name TEXT NOT NULL,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  difficulty SMALLINT DEFAULT 2,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable security
ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flashcards ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage their own data" ON public.user_stats USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own flashcards" ON public.flashcards USING (auth.uid() = user_id);

-- Auto-create user stats
CREATE OR REPLACE FUNCTION public.initialize_user_stats()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_stats (user_id) VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.initialize_user_stats();
```

### 5. Get API Keys
1. **Supabase**: Go to Settings > API, copy URL and anon key
2. **Gemini**: Go to [aistudio.google.com](https://aistudio.google.com), create API key

### 6. Start the App
```bash
npm run dev
```
Open http://localhost:8080

## Troubleshooting

**Can't connect to Supabase?**
- Check your URL and API key in `.env.local`
- Make sure your Supabase project is active

**Gemini API errors?**
- Verify your API key is correct
- Check you have quota remaining

**Build errors?**
- Delete `node_modules` and run `npm install` again
- Clear cache: `rm -rf node_modules/.vite`

**Database errors?**
- Make sure you ran all the SQL commands
- Check that tables were created successfully