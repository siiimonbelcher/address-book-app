# DigitalOcean Deployment Checklist ✅

## Your Generated Secret
**NEXTAUTH_SECRET**: `82UUq1x9AW3+lAL0BseByfbNLU9XffjHBkZzrk8aM74=`
(Keep this secure - you'll need it in step 7)

---

## Step-by-Step Deployment

### ☐ Step 1: Push to GitHub (if not already done)
```bash
cd /Users/simonstark/ai/build/test_app

git init
git add .
git commit -m "Initial commit: Address book app"
git branch -M main

# Create repo on GitHub first at: https://github.com/new
# Then run:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

### ☐ Step 2: Go to DigitalOcean
Visit: https://cloud.digitalocean.com/apps

### ☐ Step 3: Create New App
- Click **"Create App"**
- Click **"Create Resource"** → **"App"**

### ☐ Step 4: Connect GitHub
- Select **"GitHub"**
- Click **"Manage Access"** and authorize DigitalOcean
- Select your **repository**
- Select branch: **main**
- Check **"Autodeploy"** (deploys on git push)

### ☐ Step 5: Configure Resources
DigitalOcean should auto-detect it's a Node.js app.

**Edit the Web Service settings:**
- **Name**: `address-book` (or your preferred name)
- **Environment**: Leave as detected
- **Build Command**:
  ```
  npm ci && npx prisma generate && npx prisma migrate deploy && npm run build
  ```
- **Run Command**:
  ```
  npm start
  ```
- **HTTP Port**: `3000`

### ☐ Step 6: Select Plan
- **Plan**: Basic (starts at $5/mo)
- **Size**: Basic XXS (512MB RAM) is sufficient for demo

### ☐ Step 7: Add Environment Variables
Click **"Edit"** next to Environment Variables and add these **4 variables**:

1. **NODE_ENV**
   - Value: `production`
   - Scope: RUN_TIME

2. **DATABASE_URL**
   - Value: `file:/data/sqlite.db`
   - Scope: RUN_TIME

3. **NEXTAUTH_SECRET**
   - Value: `82UUq1x9AW3+lAL0BseByfbNLU9XffjHBkZzrk8aM74=`
   - Scope: RUN_AND_BUILD_TIME
   - ✅ **Check "Encrypt"** (mark as secret)

4. **NEXTAUTH_URL**
   - Value: `https://your-app-url.ondigitalocean.app` (we'll update this after first deploy)
   - Scope: RUN_TIME
   - **For now**: You can use a placeholder like `http://localhost:3000` or leave empty

### ☐ Step 8: Review & Launch
- Review all settings
- Click **"Create Resources"**
- Wait for deployment (usually 5-10 minutes)
- Watch the build logs for any errors

### ☐ Step 9: Update NEXTAUTH_URL (Important!)
After first deployment:

1. Copy your app URL from the dashboard (e.g., `https://address-book-abc123.ondigitalocean.app`)
2. Go to **Settings** → **App-Level Environment Variables**
3. Click **Edit** on `NEXTAUTH_URL`
4. Update value to your actual app URL: `https://address-book-abc123.ondigitalocean.app`
5. Save changes
6. App will automatically redeploy

### ☐ Step 10: Test Your App
1. Visit your app URL
2. Click **"Get started"** or **"Sign in"**
3. Create an account (register)
4. Add a test contact
5. Try search functionality
6. Test import/export features

---

## 📝 Important Notes

### About SQLite on App Platform
- ✅ **Works for demo/testing**
- ⚠️ **Database resets on each deploy** (when you push code updates)
- ⚠️ **Data may not persist** between restarts
- ✅ **Perfect for showcasing features**
- ✅ **No additional database costs**

### After Each Deploy
Your database will be empty, so you'll need to:
1. Register a new account
2. Add demo contacts
3. Or import contacts via CSV/vCard

### Monitoring Your App
- **Logs**: App Dashboard → Runtime Logs
- **Metrics**: App Dashboard → Insights
- **Health**: App Dashboard → Overview

---

## 🐛 Troubleshooting

### Build Fails
- Check **Build Logs** in the dashboard
- Verify Node version is 20.x
- Ensure all dependencies are in package.json

### Can't Login After Deploy
- Verify `NEXTAUTH_URL` matches your actual app URL exactly
- Check `NEXTAUTH_SECRET` is set and encrypted
- Clear browser cookies and try again

### App Crashes on Start
- Check **Runtime Logs**
- Verify `DATABASE_URL` is correct: `file:/data/sqlite.db`
- Ensure migrations ran successfully in build logs

### Environment Variables Not Working
- Make sure you saved after adding them
- Verify encryption checkbox for `NEXTAUTH_SECRET`
- Trigger a manual deploy after changes

---

## 🎉 Success Checklist

Once deployed, you should be able to:
- ✅ Visit your app at your DO URL
- ✅ Register a new account
- ✅ Login successfully
- ✅ Create, edit, and delete contacts
- ✅ Search contacts
- ✅ Import contacts from CSV/vCard
- ✅ Export contacts to CSV/vCard

---

## 📞 Need Help?

- **DigitalOcean Docs**: https://docs.digitalocean.com/products/app-platform/
- **Build Logs**: Check for detailed error messages
- **Community**: https://www.digitalocean.com/community/

---

## 🔄 Future Updates

To update your app after making changes:
```bash
git add .
git commit -m "Your update message"
git push
```

DigitalOcean will automatically detect the push and redeploy!

**Note**: Remember your database will reset with each deploy.
