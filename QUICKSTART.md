# Mission Control - Quick Start (5 Minutes)

Follow these steps to get Mission Control running locally:

## 1. Install Dependencies (30 seconds)

```bash
cd /Users/clawdbot/.openclaw/workspace-builder/mission-control
npm install
```

## 2. Set Up Convex (2 minutes)

```bash
# Login to Convex (opens browser)
npx convex login

# Start Convex dev server (creates project + generates .env.local)
npx convex dev
```

**Important**: Keep this terminal running! It's your backend.

You'll see:
```
✔ Saved your Convex URL to .env.local as NEXT_PUBLIC_CONVEX_URL
```

## 3. Seed Database (10 seconds)

**Open a new terminal** and run:

```bash
cd /Users/clawdbot/.openclaw/workspace-builder/mission-control
npx convex run seed:seedData
```

You should see:
```
{ success: true, message: "Database seeded successfully!" }
```

## 4. Start Next.js (10 seconds)

**Keep using the same terminal** from step 3:

```bash
npm run dev
```

## 5. Open Dashboard (NOW!)

Navigate to: **http://localhost:3000**

You should see:
- ⚡ Mission Control dashboard
- 7 agents in the fleet
- Active missions
- Open trades
- Recent activity

## 🎉 You're Done!

Now you have:
- ✅ Real-time dashboard running
- ✅ Database with seed data
- ✅ Two servers running (Convex + Next.js)

## Next: Deploy to Production

See [DEPLOYMENT.md](./DEPLOYMENT.md) for full deployment guide to Vercel.

Quick version:
```bash
# Deploy Convex to production
npx convex deploy

# Then import GitHub repo to Vercel:
# https://vercel.com/new
# Add NEXT_PUBLIC_CONVEX_URL from convex deploy output
```

---

**Need help?** Check the full [README.md](./README.md) or [DEPLOYMENT.md](./DEPLOYMENT.md)
