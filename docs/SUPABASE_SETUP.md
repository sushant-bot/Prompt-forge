# Supabase Setup Guide

This guide will help you set up Supabase for PromptForge to enable cloud sync of templates and history.

## Prerequisites

- A Supabase account (create one at https://supabase.com if you don't have one)

## Step 1: Create a New Supabase Project

1. Go to https://supabase.com/dashboard
2. Click "New Project"
3. Fill in the project details:
   - **Name**: PromptForge (or your preferred name)
   - **Database Password**: Choose a strong password (save this!)
   - **Region**: Choose the closest region to your users
4. Click "Create new project" and wait for it to be provisioned (this takes a minute or two)

## Step 2: Get Your Project Credentials

1. Once your project is ready, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (under "Project URL")
   - **anon public** key (under "Project API keys")

## Step 3: Set Up Environment Variables

1. In your PromptForge project root, create a `.env.local` file
2. Add your Supabase credentials:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

Replace the values with your actual Supabase credentials from Step 2.

## Step 4: Create Database Tables

Run the following SQL in the Supabase SQL Editor (**SQL Editor** in the left sidebar):

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create templates table
CREATE TABLE templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('study', 'viva', 'coding', 'writing', 'custom')),
  mode TEXT NOT NULL CHECK (mode IN ('general', 'coding')),
  data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create prompt_history table
CREATE TABLE prompt_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  mode TEXT NOT NULL CHECK (mode IN ('general', 'coding')),
  prompt TEXT NOT NULL,
  data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_templates_user_id ON templates(user_id);
CREATE INDEX idx_templates_category ON templates(category);
CREATE INDEX idx_prompt_history_user_id ON prompt_history(user_id);
CREATE INDEX idx_prompt_history_created_at ON prompt_history(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE prompt_history ENABLE ROW LEVEL SECURITY;

-- Create policies for templates
CREATE POLICY "Users can view their own templates"
  ON templates FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own templates"
  ON templates FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own templates"
  ON templates FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own templates"
  ON templates FOR DELETE
  USING (auth.uid() = user_id);

-- Create policies for prompt_history
CREATE POLICY "Users can view their own history"
  ON prompt_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own history"
  ON prompt_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own history"
  ON prompt_history FOR DELETE
  USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for templates table
CREATE TRIGGER update_templates_updated_at
  BEFORE UPDATE ON templates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

## Step 5: Configure Authentication Providers (Optional)

### Email Authentication (Already Enabled)
Email/password authentication is enabled by default.

### Google OAuth (Optional)
1. Go to **Authentication** → **Providers** → **Google**
2. Follow the instructions to set up Google OAuth
3. Enable the provider

### GitHub OAuth (Optional)
1. Go to **Authentication** → **Providers** → **GitHub**
2. Follow the instructions to set up GitHub OAuth
3. Enable the provider

## Step 6: Test Your Setup

1. Start your development server:
```bash
npm run dev
```

2. Open http://localhost:3000 in your browser
3. Click the "Sign In" button in the header
4. Create a new account or sign in
5. Create a template and verify it syncs to Supabase (check the Supabase dashboard → Table Editor → templates)

## Troubleshooting

### "Invalid API key" error
- Double-check that your `.env.local` file has the correct values
- Make sure you're using the **anon public** key, not the service role key
- Restart your development server after changing environment variables

### Authentication not working
- Verify that email authentication is enabled in Supabase (Authentication → Providers → Email)
- Check the browser console for any error messages
- Ensure your Supabase project URL is correct

### Data not syncing
- Check the browser console for errors
- Verify that RLS policies are properly set up in Supabase
- Make sure you're signed in before trying to sync data

## Security Notes

- Never commit your `.env.local` file to version control
- The `NEXT_PUBLIC_SUPABASE_ANON_KEY` is safe to expose in the browser (it's protected by Row Level Security)
- Keep your database password secure
- Regularly review your Supabase project's access logs

## Next Steps

Once your Supabase setup is complete:

1. All templates you create will automatically sync to the cloud
2. Your prompt generation history will be saved
3. You can access your data from any device by signing in
4. Your data is secured with Row Level Security (RLS)

For more information, visit the [Supabase Documentation](https://supabase.com/docs).
