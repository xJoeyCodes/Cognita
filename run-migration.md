# Database Migration Instructions

To set up the user stats system, you need to run the database migration. Here are the steps:

## Option 1: Using Supabase CLI (Recommended)

If you have the Supabase CLI installed:

```bash
# Navigate to your project directory
cd C:\Users\march\OneDrive\Desktop\CognitaAI

# Run the migration
supabase db push
```

## Option 2: Using Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `supabase/migrations/20250115000000_create_user_stats_table.sql`
4. Run the SQL script

## Option 3: Using Supabase CLI with Reset (if needed)

If you need to reset your database and apply all migrations:

```bash
# Reset the database (WARNING: This will delete all data)
supabase db reset

# Or just push the new migration
supabase db push
```

## What the Migration Does

The migration creates:

1. **user_stats table** with columns:
   - `user_id` (UUID, unique)
   - `total_flashcards` (INTEGER, default 0)
   - `studied_today` (INTEGER, default 0)
   - `average_score` (FLOAT, default 0.0)
   - `study_streak` (INTEGER, default 0)
   - `last_streak_date` (DATE, nullable)
   - `daily_goal` (INTEGER, default 10)

2. **Database functions**:
   - `initialize_user_stats()` - Creates stats for new users
   - `update_study_streak()` - Manages study streaks
   - `increment_total_flashcards()` - Updates flashcard count
   - `increment_studied_today()` - Updates daily study count

3. **Row Level Security (RLS)** policies for data protection

4. **Triggers** to automatically initialize stats for new users

## Testing the System

After running the migration:

1. Sign up for a new account or sign in
2. Go to the dashboard - you should see all stats at 0
3. Upload a PDF - total flashcards should increment
4. Start a study session - studied today and streak should update
5. Complete the study session - average score should update

The system now provides:
- ✅ Real-time stats tracking
- ✅ Optimistic UI updates
- ✅ Persistent data across sessions
- ✅ Automatic streak management
- ✅ Progress tracking with visual indicators
