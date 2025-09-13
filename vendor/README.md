# Vendor

This folder contains third-party libraries, configurations, and self-contained dependencies that are not managed by package managers.

## Contents

### Supabase Configuration
- **Database migrations**: SQL files for database schema setup
- **Edge functions**: Serverless functions for PDF analysis
- **Configuration**: Supabase project configuration files

## Structure

```
vendor/
├── supabase/                   # Supabase backend configuration
│   ├── config.toml            # Supabase project configuration
│   ├── migrations/            # Database migration files
│   │   ├── 20250115000000_create_user_stats_table.sql
│   │   └── 20250115000001_add_pdf_analysis_tables.sql
│   ├── functions/             # Edge functions
│   │   └── analyze-pdf/       # PDF analysis function
│   │       ├── index.ts       # Function implementation
│   │       ├── deno.json      # Deno configuration
│   │       └── deno.d.ts      # TypeScript definitions
│   └── *.sql                  # Additional SQL files
└── README.md                  # This file
```

## Usage

### Database Setup
1. Run migration files in order to set up the database schema
2. Configure Supabase project using `config.toml`
3. Deploy edge functions for PDF analysis

### Edge Functions
- **analyze-pdf**: Processes PDF uploads and generates flashcards/quizzes
- Uses Google Gemini API for AI-powered content analysis
- Deployed to Supabase Edge Runtime (Deno)

## Dependencies

### Supabase
- **Database**: PostgreSQL with Row Level Security
- **Authentication**: User management and session handling
- **Storage**: File upload and management
- **Edge Functions**: Serverless function execution

### Third-Party APIs
- **Google Gemini API**: AI content analysis and generation
- **Deno Runtime**: Edge function execution environment

## Licensing

All vendor code includes proper licensing and attribution:
- Supabase: Open source with commercial licensing
- Google Gemini API: Google's terms of service
- Deno: MIT License

## Maintenance

- Keep configurations up to date with Supabase updates
- Monitor edge function performance and costs
- Update API keys and credentials as needed
- Test migrations before deploying to production

## Security

- API keys are stored in environment variables
- Database access uses Row Level Security policies
- Edge functions run in isolated Deno runtime
- All external API calls are properly authenticated

## Contact

For questions about vendor dependencies or configurations, contact the development team.