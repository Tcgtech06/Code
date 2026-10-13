# Steps to get your Supabase project reference:

1. Go to your Supabase dashboard: https://supabase.com/dashboard
2. Click on your project
3. Look at the URL - it will be like: https://supabase.com/dashboard/project/abcdefghijklmnopqrst
4. Copy the part after /project/ (the random letters)

Once you have your project reference, run this command in PowerShell:

.\supabase.exe link --project-ref YOUR_PROJECT_REFERENCE_HERE

Then run your SQL script:

.\supabase.exe db push add_minimum_capacity.sql
