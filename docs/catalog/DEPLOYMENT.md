# Catalog Module: Deployment Checklist

## Environment Variables

### Required
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

text

### Optional (Shikimori)
SHIKIMORI_BASE_URL=https://shikimori.one
SHIKIMORI_GRAPHQL_URL=https://shikimori.one/api/graphql
SHIKIMORI_APP_NAME=manga-platform

text

## Database Setup

1. Run migrations:
npx supabase db push

text

2. Refresh materialized view:
npx supabase db functions deploy refresh_work_statistics

text

3. Insert seed data (optional):
npx supabase db seed

text

## Verification

### Health Check
curl http://localhost:3000/api/catalog/health

text

Expected: `{"status":"ok","database":"connected"}`

### Test Endpoints
List works
curl http://localhost:3000/api/catalog/works

Get sources
curl http://localhost:3000/api/catalog/sources

Get genres
curl http://localhost:3000/api/catalog/genres

text

### Test UI
- Visit `http://localhost:3000/catalog`
- Apply filters (type, status)
- Click on a work card
- Verify pagination

## Production Deployment

### Vercel
1. Push to GitHub
2. Import project to Vercel
3. Add environment variables
4. Deploy

### Database
1. Ensure Supabase project is production-ready
2. Enable RLS policies
3. Set up database backups
4. Configure connection pooling

### Monitoring
- Enable Vercel Analytics
- Set up Sentry (optional)
- Monitor Supabase dashboard

## Post-Deployment

### Create First Work
curl -X POST http://your-domain.com/api/catalog/admin/works
-H "Authorization: Bearer YOUR_JWT"
-H "Content-Type: application/json"
-d '{
"title": "One Piece",
"slug": "one-piece",
"type": "manga",
"status": "ongoing"
}'

text

### Verify Statistics View
SELECT * FROM work_statistics LIMIT 5;

text

