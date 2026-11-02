# Hosting Guide for InterviewIQ

This project can be hosted in two ways:

---

## Option 1: All-in-One Deployment (Recommended)
Host both the frontend and backend together on a single server or cloud platform (**Render**, **Railway**, **Fly.io**, **DigitalOcean**, **AWS EC2**, or any **VPS**).

FastAPI is already configured to serve the production build from the `build/` folder automatically:
- Navigating to `/` serves the React frontend.
- API requests under `/api/...` are handled by FastAPI.
- All single-page application (SPA) client routes (such as `/practice`, `/resume`, `/history`) load seamlessly without 404 errors.
- **Zero CORS issues** because everything runs on the same origin/domain.

### Steps to Run / Deploy:
1. Install Python dependencies:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```
2. Build the frontend (already built in `build/`):
   ```bash
   npm run build
   ```
3. Start the server:
   ```bash
   uvicorn app.main:app --host 0.0.0.0 --port 8000
   ```
4. Open `http://localhost:8000` (or your domain/server URL).

### Deploying with Docker:
A multi-stage `Dockerfile` and `docker-compose.yml` are provided in the root directory:
```bash
docker compose up -d
```

---

## Option 2: Split Hosting (Static Frontend + Backend API)

### A. Deploy Frontend on Vercel, Netlify, Cloudflare Pages, or Firebase
You can upload or publish the generated **`build/`** folder (or `frontend/dist/`):

- **Publish / Output Directory:** `build` (or `frontend/dist`)
- **Build Command (if connected to Git):** `npm run build` or `cd frontend && npm install && npm run build`
- **SPA Routing:** `_redirects` (Netlify) and `vercel.json` (Vercel) are pre-configured in the `build/` folder to prevent 404s on page refresh.

> **Note on API URL:** If your backend is hosted at a different URL (e.g. `https://my-backend.onrender.com/api`), set an environment variable before building:
> ```bash
> VITE_API_URL=https://my-backend.onrender.com/api npm run build
> ```

### B. Deploy Backend on Render / Railway
- **Root Directory:** `backend`
- **Build Command:** `pip install -r requirements.txt`
- **Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- **Environment Variables:**
  - `GROQ_API_KEY`: Your Groq API key
  - `JWT_SECRET`: Random 32+ character string
  - `FRONTEND_ORIGIN`: Your frontend URL (e.g., `https://your-app.vercel.app`)
