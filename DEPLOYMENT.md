# Mission Control - Deployment Guide

## Prerequisites

1. **Convex Account**: Sign up at https://dashboard.convex.dev
2. **Vercel Account**: Sign up at https://vercel.com (use your GitHub account)
3. **GitHub**: Repository already created at https://github.com/jspector2018/mission-control

## Step 1: Set Up Convex

### A. Install Convex CLI

```bash
npm install -g convex
```

### B. Login to Convex

```bash
cd /Users/clawdbot/.openclaw/workspace-builder/mission-control
npx convex login
```

This will open a browser window to authenticate.

### C. Create Convex Project

```bash
npx convex dev
```

This will:
1. Prompt you to create a new project (say yes)
2. Name it "mission-control" or similar
3. Generate your deployment URL
4. Start the local dev server
5. Create `.env.local` with your `NEXT_PUBLIC_CONVEX_URL`

**Keep this terminal running!**

### D. Seed the Database

In a **new terminal**:

```bash
cd /Users/clawdbot/.openclaw/workspace-builder/mission-control
npx convex run seed:seedData
```

This populates your database with:
- 7 agents (Mike, Scout, Lab, Hustler, Builder, Analyst, Trader)
- 5 missions (Kalshi Trading, AI Freelancing, Freshr, etc.)
- 5 tasks across different stages
- 4 open trades
- Recent activity history

## Step 2: Test Locally

### A. Start Next.js Dev Server

In a **new terminal**:

```bash
cd /Users/clawdbot/.openclaw/workspace-builder/mission-control
npm run dev
```

### B. Open Dashboard

Navigate to http://localhost:3000

You should see:
- ✅ Agent fleet with all 7 agents
- ✅ Task board with Kanban columns
- ✅ Trading positions
- ✅ Activity feed
- ✅ Real-time updates (Convex handles this automatically)

## Step 3: Deploy to Vercel

### A. Deploy Convex to Production

In your terminal:

```bash
npx convex deploy
```

This creates a **production** Convex deployment. You'll get a production URL like:
```
https://curious-shark-123.convex.cloud
```

**Copy this URL - you'll need it for Vercel!**

### B. Import to Vercel

1. Go to https://vercel.com/new
2. Import your GitHub repository: `jspector2018/mission-control`
3. Configure the project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./`
   - **Environment Variables**: Add one variable:
     ```
     NEXT_PUBLIC_CONVEX_URL = https://curious-shark-123.convex.cloud
     ```
     (Use your actual production Convex URL from step A)

4. Click **Deploy**

### C. Seed Production Database

Once Vercel deployment is complete:

```bash
npx convex run seed:seedData --prod
```

This seeds your **production** Convex database with the initial data.

### D. Configure Custom Domain (Optional)

In Vercel dashboard:
1. Go to your project → Settings → Domains
2. Add custom domain (e.g., `mission-control.yourdomain.com`)
3. Follow DNS instructions

## Step 4: Test Webhooks

Your API webhook is available at:
```
https://your-vercel-domain.vercel.app/api/webhook
```

### Test Creating a Task

```bash
curl -X POST https://your-vercel-domain.vercel.app/api/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "action": "create_task",
    "data": {
      "title": "Test webhook task",
      "description": "Created via API",
      "priority": "high"
    }
  }'
```

You should see the task appear immediately in the dashboard!

### Test Updating Agent Status

```bash
curl -X POST https://your-vercel-domain.vercel.app/api/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "action": "update_agent_status",
    "data": {
      "agentId": "YOUR_AGENT_ID",
      "status": "active"
    }
  }'
```

To get agent IDs, check the Convex dashboard or inspect network requests in the browser.

## Step 5: Ongoing Development

### Local Development

Always run **two terminals**:

**Terminal 1: Convex**
```bash
npx convex dev
```

**Terminal 2: Next.js**
```bash
npm run dev
```

### Deploying Changes

When you push to GitHub, Vercel will auto-deploy the frontend.

For Convex changes (schema, queries, mutations):
```bash
npx convex deploy
```

## Production URLs

After deployment, you'll have:

- **Dashboard**: https://mission-control-xxx.vercel.app
- **GitHub**: https://github.com/jspector2018/mission-control
- **Convex Dashboard**: https://dashboard.convex.dev (to view/manage database)
- **API Webhook**: https://mission-control-xxx.vercel.app/api/webhook

## Troubleshooting

### "Invalid Convex URL"
- Make sure `.env.local` has `NEXT_PUBLIC_CONVEX_URL`
- Restart Next.js dev server after adding env vars

### "No data showing"
- Run the seed script: `npx convex run seed:seedData`
- Check Convex dashboard to verify data exists

### Webhook not working
- Check Vercel function logs in dashboard
- Verify JSON payload matches expected format
- Add console.log statements to `app/api/webhook/route.ts`

### Real-time updates not working
- Convex handles this automatically
- Make sure `ConvexClientProvider` wraps your app (it does)
- Check browser console for WebSocket errors

## Next Steps

1. **Add API Key Protection**: Uncomment the API key check in `app/api/webhook/route.ts`
2. **Custom Branding**: Update colors in `app/globals.css`
3. **Add More Agents**: Use the webhook API or Convex dashboard
4. **Set Up Alerts**: Use Convex scheduled functions for notifications
5. **Mobile App**: Convex works with React Native too!

## Support

- Convex Docs: https://docs.convex.dev
- Next.js Docs: https://nextjs.org/docs
- Vercel Support: https://vercel.com/support

---

**You're all set! 🎯**

Your Mission Control is now live and monitoring your AI agent fleet in real-time.
