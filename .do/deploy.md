# Deploy to DigitalOcean App Platform

## Quick Deploy (Recommended)

### Option 1: Deploy via GitHub

1. **Push your code to GitHub**:
```bash
git init
git add .
git commit -m "Initial commit: Address book app"
git branch -M main
git remote add origin https://github.com/your-username/your-repo.git
git push -u origin main
```

2. **Go to DigitalOcean App Platform**:
   - Visit: https://cloud.digitalocean.com/apps
   - Click "Create App"
   - Select "GitHub" as source
   - Authorize DigitalOcean to access your repo
   - Select your repository and branch (main)

3. **Configure the App**:
   - **Name**: address-book
   - **Region**: Choose closest to your users (e.g., New York)
   - **Branch**: main
   - **Autodeploy**: Enable (deploys on git push)

4. **Configure Build & Run**:
   - **Build Command**:
     ```bash
     npm ci && npx prisma generate && npx prisma migrate deploy && npm run build
     ```
   - **Run Command**:
     ```bash
     npm start
     ```
   - **HTTP Port**: 3000

5. **Add Environment Variables**:
   Click "Edit" next to Environment Variables and add:

   - `NODE_ENV` = `production`
   - `DATABASE_URL` = `file:/data/sqlite.db`
   - `NEXTAUTH_URL` = `${APP_URL}` (will be auto-generated after first deploy)
   - `NEXTAUTH_SECRET` = [Generate with: `openssl rand -base64 32`] - Mark as **Secret**

6. **Configure Resources**:
   - **Plan**: Basic ($5/mo or start with trial)
   - **Instance Size**: Basic XXS is sufficient to start

7. **Review and Create**:
   - Review all settings
   - Click "Create Resources"
   - Wait for deployment (5-10 minutes)

8. **Update NEXTAUTH_URL**:
   - After first deploy, copy your app URL (e.g., `https://address-book-xxxxx.ondigitalocean.app`)
   - Go to Settings → Environment Variables
   - Update `NEXTAUTH_URL` to your actual app URL
   - Trigger a redeploy

### Option 2: Deploy via DigitalOcean CLI

1. **Install doctl**:
```bash
# macOS
brew install doctl

# Linux
wget https://github.com/digitalocean/doctl/releases/download/v1.98.1/doctl-1.98.1-linux-amd64.tar.gz
tar xf doctl-1.98.1-linux-amd64.tar.gz
sudo mv doctl /usr/local/bin
```

2. **Authenticate**:
```bash
doctl auth init
```

3. **Edit app.yaml**:
Update `.do/app.yaml` with your GitHub repo info

4. **Create the app**:
```bash
doctl apps create --spec .do/app.yaml
```

5. **Get app ID and set environment variables**:
```bash
# List apps
doctl apps list

# Set secrets (replace APP_ID)
doctl apps update APP_ID --spec .do/app.yaml
```

## Important: Database Persistence

### ⚠️ SQLite Limitation on App Platform

DigitalOcean App Platform **does not support persistent volumes** for SQLite databases. This means:
- Database will be reset on each deploy
- Not suitable for production with current SQLite setup

### Solutions:

#### Solution 1: Use PostgreSQL (Recommended for Production)

1. **Add Managed PostgreSQL**:
   - In App Platform dashboard, click "Create" → "Database"
   - Select PostgreSQL
   - Choose development or production tier
   - Name: `address-book-db`

2. **Update your app**:
   - DigitalOcean will automatically add `${db.DATABASE_URL}` env var
   - Update Prisma schema to use PostgreSQL:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

3. **Reinstall Prisma dependencies**:
```bash
npm uninstall prisma @prisma/client
npm install prisma @prisma/client
npx prisma generate
```

4. **Create new migration**:
```bash
npx prisma migrate dev --name switch_to_postgresql
```

5. **Push and redeploy**

**Cost**: Development DB ~$7/mo, Production ~$15/mo

#### Solution 2: Deploy to Droplet with Docker (Persistent Storage)

If you need SQLite with persistence, deploy to a Droplet instead:

1. **Create Droplet**:
   - Choose Docker marketplace image
   - Select $6/mo plan
   - Choose region

2. **SSH into droplet**:
```bash
ssh root@your-droplet-ip
```

3. **Clone repo and deploy**:
```bash
git clone https://github.com/your-username/your-repo.git
cd your-repo

# Create .env file
nano .env
# Add your environment variables

# Deploy with docker-compose
docker-compose up -d
```

4. **Set up domain (optional)**:
```bash
apt update
apt install nginx certbot python3-certbot-nginx

# Configure nginx
nano /etc/nginx/sites-available/address-book
```

Add nginx config:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable site and get SSL:
```bash
ln -s /etc/nginx/sites-available/address-book /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
certbot --nginx -d your-domain.com
```

## Testing Your Deployment

1. **Visit your app URL**
2. **Register a new account**
3. **Create a test contact**
4. **Test import/export features**
5. **Verify search works**

## Monitoring

### View Logs
```bash
# Via CLI
doctl apps logs APP_ID --type run

# Via Dashboard
Apps → Your App → Runtime Logs
```

### Metrics
- Go to your app dashboard
- View CPU, Memory, and Request metrics
- Set up alerts for downtime

## Troubleshooting

### Build Fails
- Check build logs in the App Platform dashboard
- Ensure all environment variables are set
- Verify Node.js version compatibility

### App Crashes
- Check runtime logs
- Verify NEXTAUTH_SECRET is set correctly
- Ensure DATABASE_URL is correct

### Database Errors
- If using SQLite: Remember data resets on deploy
- If using PostgreSQL: Check database connection string

### Authentication Not Working
- Ensure NEXTAUTH_URL matches your actual app URL (including https://)
- Verify NEXTAUTH_SECRET is set and is a secure random string

## Scaling

### Increase Resources
- Go to Settings → Resources
- Upgrade instance size (Basic XXS → Basic XS → Basic S)
- Add more instances for horizontal scaling

### Add CDN
- Go to Settings → Domains
- Enable CDN for static assets

## Cost Estimate

- **App Platform Basic**: $5/mo
- **Managed PostgreSQL** (if used): $7-15/mo
- **Total**: ~$12-20/mo for production-ready setup

## Next Steps After Deployment

1. **Custom Domain**: Add your own domain in Settings → Domains
2. **SSL**: Automatically handled by App Platform
3. **Monitoring**: Set up Uptime alerts
4. **Backups**: If using PostgreSQL, backups are automatic
5. **CI/CD**: Already set up with GitHub auto-deploy
