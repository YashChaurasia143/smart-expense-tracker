# 🚀 Smart Expense Tracker - Deployment Guide (Render)

This project is configured as a **single unified full-stack web service** on **Render**. Render will build both the frontend and backend, serve the production React app, and run the Express REST API under a single public URL.

---

## 📋 Quick Deployment Steps

### Step 1: Push Project to GitHub

1. Open your terminal in this project root (`smart-expense-tracker-main`):
   ```bash
   git add .
   git commit -m "feat: configure full-stack production build and deployment"
   git branch -M main
   ```

2. Create a new repository on [GitHub](https://github.com/new) (e.g. `smart-expense-tracker`).

3. Link and push to your GitHub repo:
   ```bash
   git remote add origin https://github.com/<your-username>/smart-expense-tracker.git
   git push -u origin main
   ```

---

### Step 2: Deploy to Render (Free Tier)

#### Option A: 1-Click Blueprint (Fastest)
1. Go to [Render Dashboard](https://dashboard.render.com/).
2. Click **New +** → **Blueprint**.
3. Connect your GitHub repository.
4. Render will automatically detect the [`render.yaml`](file:///c:/Users/chaur/OneDrive/Desktop/random/smart-expense-tracker-main/smart-expense-tracker-main/render.yaml) file and configure:
   - **Build Command:** `npm run build`
   - **Start Command:** `npm start`
   - **Environment:** Node.js
5. Click **Apply**.

#### Option B: Manual Web Service Setup
1. Go to [Render Dashboard](https://dashboard.render.com/).
2. Click **New +** → **Web Service**.
3. Connect your GitHub repository.
4. Fill in the following settings:
   - **Name:** `smart-expense-tracker`
   - **Region:** Any (e.g., Oregon, Frankfurt, Singapore)
   - **Branch:** `main`
   - **Root Directory:** *(leave blank)*
   - **Runtime:** `Node`
   - **Build Command:** `npm run build`
   - **Start Command:** `npm start`
   - **Instance Type:** `Free`

5. **Environment Variables**:
   Click **Add Environment Variable**:
   | Key | Value | Notes |
   |---|---|---|
   | `NODE_ENV` | `production` | Enables production mode & static asset serving |
   | `JWT_SECRET` | *(Random 32+ character string)* | e.g., `supersecretkey_production_tracker_2026!` |
   | `JWT_EXPIRES_IN` | `7d` | Session lifespan |
   | `MONGO_URI` | *(Optional or MongoDB Atlas URI)* | See Step 3 below |

6. Click **Create Web Service**.

---

### Step 3: Database Configuration (MongoDB)

#### Default Out-of-the-Box Mode:
If `MONGO_URI` is left blank or set to `auto`, the app automatically launches an **embedded in-memory MongoDB** server and pre-seeds it with demo financial data. This allows instant preview and demo testing without any external setup.

#### For Persistent Production Data (MongoDB Atlas - Free):
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a free **M0 Sandbox Cluster**.
3. Under **Database Access**, create a user (e.g., `admin`) and password.
4. Under **Network Access**, add IP `0.0.0.0/0` (Allow access from anywhere).
5. Click **Connect** → **Drivers** → Copy connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/expense_tracker?retryWrites=true&w=majority
   ```
6. Add this string as `MONGO_URI` in your Render Environment Variables.

---

## 🔍 Verification

Once deployment completes on Render:
1. Open your live Render URL (e.g., `https://smart-expense-tracker-xxxx.onrender.com`).
2. Test signing in with the preloaded demo account:
   - **Email:** `demo@example.com`
   - **Password:** `password123`
3. Try toggling Bright / Dark mode and adding or filtering transactions.
