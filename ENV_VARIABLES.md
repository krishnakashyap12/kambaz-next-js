# Environment Variables for React/Next.js App

Create a `.env.local` file in the `kambaz-next-js` directory with the following variables:

## Local Development

```env
NEXT_PUBLIC_HTTP_SERVER=http://localhost:4000
```

## Production (Vercel)

In Vercel dashboard, go to **Settings** → **Environment Variables** and add:

- **Key**: `NEXT_PUBLIC_HTTP_SERVER`
- **Value**: `https://your-server.onrender.com` (with https://)

## Important Notes

1. **NEXT_PUBLIC_HTTP_SERVER**: 
   - Must include `https://` prefix in production
   - Should point to your deployed Node.js server
   - Example: `https://kambaz-node-server-app.onrender.com`

2. **Variable Naming**: 
   - Must start with `NEXT_PUBLIC_` to be accessible in the browser
   - Changes require a rebuild/redeploy

