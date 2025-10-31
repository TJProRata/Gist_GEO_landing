# 🚀 Deployment Guide for Vercel

## Prerequisites
- [x] Convex production deployment ready (`fearless-ibis-167`)
- [ ] GitHub repository pushed
- [ ] Vercel account created

---

## Step 1: Get Your Production Convex URL

Your production Convex URL is:
```
https://fearless-ibis-167.convex.cloud
```

**Verify it's correct:**
```bash
npx convex deployments
```

---

## Step 2: Deploy to Vercel (Choose ONE method)

### Method A: Vercel Dashboard (Recommended - Easiest)

1. **Go to**: https://vercel.com/new

2. **Import Repository**:
   - Click "Import Git Repository"
   - Connect GitHub and authorize Vercel
   - Select your `geo-gist-landing` repository

3. **Configure Project**:
   - Framework: Next.js ✅ (auto-detected)
   - Root Directory: `./` (default)
   - Build Command: `bun run build` ✅ (from vercel.json)
   - Install Command: `bun install` ✅ (from vercel.json)

4. **Add Environment Variable**:
   ```
   Name:  NEXT_PUBLIC_CONVEX_URL
   Value: https://fearless-ibis-167.convex.cloud
   ```
   - Click "Add"

5. **Deploy**:
   - Click "Deploy"
   - Wait 2-3 minutes ⏳
   - Get your live URL 🎉

---

### Method B: Vercel CLI (Faster if you prefer terminal)

```bash
# 1. Install Vercel CLI globally
npm i -g vercel

# 2. Login to Vercel
vercel login

# 3. Deploy to production
vercel --prod

# Follow prompts:
# ✓ Set up and deploy? Yes
# ✓ Which scope? (Select your account)
# ✓ Link to existing project? No
# ✓ What's your project's name? geo-gist-landing
# ✓ In which directory is your code? ./
# ✓ Want to override settings? No

# 4. Add environment variable
vercel env add NEXT_PUBLIC_CONVEX_URL production
# When prompted, paste: https://fearless-ibis-167.convex.cloud

# 5. Redeploy to apply env var
vercel --prod
```

---

## Step 3: Verify Deployment

### Test Your Live Site

1. **Visit your Vercel URL**: `https://geo-gist-landing.vercel.app`

2. **Test Email Signup**:
   - Enter: `test@example.com`
   - Click submit
   - Should see: ✅ Green checkmark

3. **Verify in Convex**:
   - Go to: https://dashboard.convex.dev
   - Switch to: **Production** (purple badge at top)
   - Click: **Data** → **signups**
   - Should see: Your test email 🎉

### Checklist

- [ ] Site loads at Vercel URL
- [ ] Landing page appears correctly
- [ ] Email signup form works
- [ ] Success state shows (green checkmark)
- [ ] Email appears in Convex dashboard
- [ ] Duplicate email shows success (not error)
- [ ] Invalid email shows error message

---

## Step 4: Custom Domain (Optional)

### Set up gistgeo.ai

1. **In Vercel Dashboard**:
   - Project → Settings → Domains
   - Add: `gistgeo.ai`
   - Add: `www.gistgeo.ai`

2. **Update DNS** (at your domain registrar):
   ```
   Type: A
   Name: @
   Value: 76.76.21.21

   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

3. **Wait for SSL**: ~1-2 minutes ⏳

---

## Step 5: Set Up CI/CD (Auto-Deploy on Push)

Vercel automatically sets up CI/CD when you link your GitHub repo!

**Every time you push to `main`:**
```bash
git add .
git commit -m "Update feature"
git push origin main
```

**Vercel will automatically:**
1. Detect the push
2. Build your project
3. Deploy to production
4. Update your live site ✨

---

## 🐛 Troubleshooting

### Build Fails

**Error**: `NEXT_PUBLIC_CONVEX_URL is not defined`

**Fix**:
1. Go to: Vercel → Project → Settings → Environment Variables
2. Add: `NEXT_PUBLIC_CONVEX_URL` = `https://fearless-ibis-167.convex.cloud`
3. Redeploy: Deployments → Latest → ... → Redeploy

### Emails Not Saving

**Check**:
1. Environment variable is correct
2. Using production Convex URL (not dev)
3. Convex → Logs for errors

### Build Command Issues

**If Vercel uses npm instead of bun**:

The `vercel.json` file should force Bun, but if not:
1. Go to: Settings → General
2. Override: Build Command = `bun run build`
3. Override: Install Command = `bun install`

---

## 📊 Monitoring

### Vercel Dashboard
- View deployments
- Check build logs
- Monitor performance

### Convex Dashboard
- View signups in real-time
- Check function logs
- Monitor database usage

---

## 🎯 Your Deployment URLs

After deployment, update these:

**Production Site**: `https://_____.vercel.app`
**Convex Dashboard**: https://dashboard.convex.dev
**Convex Production**: `https://fearless-ibis-167.convex.cloud`

---

## Next Steps After Deployment

1. ✅ Test the live site thoroughly
2. 📧 Share the URL with stakeholders
3. 🔗 Set up custom domain
4. 📈 Add analytics (Vercel Analytics, Google Analytics)
5. 🔔 Set up Vercel notifications (Slack, Discord)

---

**Need Help?** Check the Vercel docs or ask in Discord!
