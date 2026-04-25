# Vercel Deploy Guide

## Project Setup

### 1. Import the Project

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New..." -> "Project"
3. Select the `air-finance-app` repository

### 2. Build Configuration

#### Framework Preset

- **Framework Preset**: `Other`
- **Root Directory**: `.` (monorepo root -- leave empty or use `.`)

#### Build and Development Settings

**Build Command**:

```bash
turbo run build --filter=@air-finance/web
```

**Output Directory**:

```bash
dist
```

**Install Command**:

```bash
corepack enable && yarn install
```

This enables Corepack to use Yarn 4.x as defined in `packageManager`.

**Development Command** (optional):

```bash
yarn dev
```

### 3. Environment Variables

Add these in the Vercel dashboard:

#### Production

```
VITE_API_URL=https://your-api.com
VITE_APP_NAME=Air Finance
VITE_APP_VERSION=1.0.0
ENABLE_EXPERIMENTAL_COREPACK=1
```

`ENABLE_EXPERIMENTAL_COREPACK=1` ensures Vercel uses Yarn 4.x via Corepack.

#### Preview (optional)

```
VITE_API_URL=https://staging-api.com
VITE_APP_NAME=Air Finance (Staging)
ENABLE_EXPERIMENTAL_COREPACK=1
```

### 4. Advanced Settings (optional)

#### Node.js Version

- **Node Version**: `24.x` (matches `engines` in root `package.json`)

#### Ignored Build Step

To skip builds on documentation-only commits:

```bash
git diff HEAD^ HEAD --quiet . ':!*.md' ':!VERCEL_DEPLOY.md'
```

## File Structure

```
air-finance-app/
├── vercel.json                 # Root Vercel config
├── .vercelignore               # Files to exclude from deploy
├── apps/
│   └── web/
│       ├── vercel.json         # Web-specific config (rewrites)
│       ├── dist/               # Build output directory
│       └── ...
└── turbo.json                  # Turborepo picks this up automatically
```

## Manual Deploy via CLI

### Install Vercel CLI

```bash
npm i -g vercel
```

### Login

```bash
vercel login
```

### Production Deploy

```bash
cd air-finance-app
vercel --prod
```

### Preview Deploy

```bash
vercel
```

## Turborepo on Vercel

Vercel automatically detects Turborepo monorepos and:

- Uses Turborepo remote cache (if configured)
- Builds only what changed
- Optimizes build times

### Enable Remote Caching (optional)

1. Login to Turborepo:

```bash
npx turbo login
```

2. Link the project:

```bash
npx turbo link
```

3. This creates a token that Vercel uses automatically.

## Monitoring and Logs

### Build Logs

- Open the Vercel Dashboard
- Go to "Deployments"
- Click the specific deployment
- Check the "Building" tab

### Runtime Logs

- "Functions" tab -> "Logs"

## Troubleshooting

### Error: "Could not find a production build"

**Fix**: Verify `outputDirectory` is correct: `apps/web/dist`

### Error: "Command failed with exit code 1"

**Fix**:

1. Check environment variables
2. Test build locally: `yarn build --filter=@air-finance/web`
3. Check Vercel build logs

### Slow builds

**Fix**:

- Enable Turborepo Remote Caching
- Check `.vercelignore` to exclude unnecessary files

### Routes return 404

**Fix**: Verify `apps/web/vercel.json` has rewrites configured.

## Custom Domain

### Add Domain

1. Go to "Settings" -> "Domains"
2. Add your domain
3. Configure DNS:
   - Type: `A`, Name: `@`, Value: `76.76.21.21`

   or
   - Type: `CNAME`, Name: `www`, Value: `cname.vercel-dns.com`

## Preview Deployments

- Every push to non-`main` branches creates a Preview Deployment
- URLs are generated automatically
- Useful for testing before merge

## Performance

Vercel automatically:

- Compresses assets (gzip, brotli)
- Serves via global CDN
- Optimizes images
- Applies intelligent caching

## Hobby Plan Limits

- Build time: 6,000 minutes/month
- Bandwidth: 100 GB/month
- Deployments: Unlimited
- Team members: 1

See the Pro plan for higher limits.

## Deploy Checklist

- [ ] Root directory set to `.` (monorepo root) or `apps/web`
- [ ] Build command: `turbo run build --filter=@air-finance/web`
- [ ] Output directory: `dist`
- [ ] Environment variables added (`VITE_API_URL`, `ENABLE_EXPERIMENTAL_COREPACK=1`)
- [ ] `vercel.json` in root created
- [ ] `apps/web/vercel.json` with rewrites created
- [ ] `.vercelignore` configured
- [ ] Local test: `yarn build`

## References

- [Vercel Monorepo Guide](https://vercel.com/docs/monorepos)
- [Turborepo + Vercel](https://turbo.build/repo/docs/handbook/deploying-with-docker#vercel)
- [Vite Deploy Guide](https://vitejs.dev/guide/static-deploy.html#vercel)
