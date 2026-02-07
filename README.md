# Mission Control 🎯

Real-time dashboard for monitoring AI agent fleet operations.

## Stack

- **Frontend:** Next.js 15 (App Router) + React 19
- **Backend:** Convex (real-time database)
- **Styling:** Tailwind CSS + shadcn/ui
- **Deploy:** Vercel

## Features

- 📊 **Overview Dashboard** - Agent status, key metrics, activity feed
- ✅ **Task Board** - Kanban view with drag-and-drop (coming soon)
- 👥 **Agent Fleet** - Detailed agent monitoring
- 📈 **Trading Portfolio** - Kalshi positions and P&L tracking
- 📝 **Activity Feed** - Complete operation log
- 🔌 **API Webhooks** - Programmatic updates via REST

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Convex

```bash
# Install Convex CLI globally
npm install -g convex

# Login to Convex
npx convex login

# Initialize Convex project
npx convex dev
```

This will:
- Create a new Convex project (or link to existing)
- Generate your `NEXT_PUBLIC_CONVEX_URL`
- Start the Convex dev server

### 3. Configure Environment

Copy `.env.local.example` to `.env.local` and add your Convex URL:

```bash
cp .env.local.example .env.local
```

The Convex URL will be provided when you run `npx convex dev`.

### 4. Seed the Database

In a new terminal, run:

```bash
npx convex run seed:seedData
```

This populates the database with the initial agent fleet, missions, tasks, and trades.

### 5. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Schema

### Agents
- name, role, status (idle/active/blocked)
- emoji, sessionKey, currentTaskId
- lastActive timestamp

### Tasks
- title, description, status (inbox → assigned → in_progress → review → done)
- assigneeIds, missionId, priority
- createdAt, updatedAt

### Missions
- name, status (active/parked)
- description, goal, revenue

### Messages
- taskId, fromAgentId, content
- createdAt (comment threads)

### Activities
- type, agentId, message
- missionId, createdAt (activity log)

### Trades
- market, side (YES/NO), contracts, price
- status (open/won/lost), profit
- resolveDate

## API Webhooks

Send updates programmatically via POST to `/api/webhook`:

### Update Agent Status
```bash
curl -X POST https://your-domain.vercel.app/api/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "action": "update_agent_status",
    "data": {
      "agentId": "...",
      "status": "active"
    }
  }'
```

### Create Task
```bash
curl -X POST https://your-domain.vercel.app/api/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "action": "create_task",
    "data": {
      "title": "New task",
      "description": "Task description",
      "priority": "high"
    }
  }'
```

### Update Task Status
```bash
curl -X POST https://your-domain.vercel.app/api/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "action": "update_task_status",
    "data": {
      "taskId": "...",
      "status": "done"
    }
  }'
```

See `app/api/webhook/route.ts` for all available actions.

## Deployment

### Deploy to Vercel

1. Push to GitHub:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin git@github.com:jspector2018/mission-control.git
git push -u origin main
```

2. Import on Vercel:
   - Connect your GitHub repo
   - Vercel will auto-detect Next.js
   - Add environment variable: `NEXT_PUBLIC_CONVEX_URL`

3. Deploy Convex to production:
```bash
npx convex deploy
```

This gives you a production Convex URL. Update the Vercel environment variable.

4. Seed production database:
```bash
npx convex run seed:seedData --prod
```

## Project Structure

```
mission-control/
├── app/
│   ├── (pages)/
│   │   ├── page.tsx         # Overview dashboard
│   │   ├── tasks/           # Task board
│   │   ├── agents/          # Agent fleet view
│   │   ├── trading/         # Trading portfolio
│   │   └── activity/        # Activity feed
│   ├── api/webhook/         # REST API endpoints
│   ├── layout.tsx           # Root layout
│   └── globals.css          # Global styles
├── components/
│   ├── ui/                  # shadcn components
│   └── Navigation.tsx       # Main nav
├── convex/
│   ├── schema.ts            # Database schema
│   ├── agents.ts            # Agent queries/mutations
│   ├── tasks.ts             # Task queries/mutations
│   ├── missions.ts          # Mission queries/mutations
│   ├── activities.ts        # Activity queries
│   ├── trades.ts            # Trade queries/mutations
│   └── seed.ts              # Seed data
└── lib/
    └── utils.ts             # Utility functions
```

## Development

- **Convex Dev:** `npx convex dev` (runs Convex backend)
- **Next.js Dev:** `npm run dev` (runs frontend)
- **Build:** `npm run build`
- **Deploy Convex:** `npx convex deploy`

## License

MIT
