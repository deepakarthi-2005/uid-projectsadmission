# Deployment Guide

This guide explains how to deploy the Kongu Engineering College Admission Portal.

## Overview
- Frontend: React app (Netlify or Vercel)
- Backend: Node.js/Express + MongoDB (Render or Railway/Heroku alternative)
- Database: MongoDB Atlas (recommended)

---

## 1) Prepare Environment

### MongoDB Atlas
1. Create a free MongoDB Atlas cluster: https://www.mongodb.com/atlas
2. Create a database user and allow IP access.
3. Get your connection string. Example:
   ```
   MONGODB_URI=mongodb+srv://<user>:<pass>@<cluster>/kongu_admission?retryWrites=true&w=majority
   ```

### Backend `.env`
Create `backend/.env` with:
```
PORT=5000
MONGODB_URI=your_atlas_connection_string
JWT_SECRET=change_this_in_production
JWT_EXPIRE=7d

# SMTP (for email notifications)
SMTP_HOST=smtp.yourprovider.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_smtp_username
SMTP_PASS=your_smtp_password
SMTP_FROM="KEC Admissions" <admissions@kongu.edu>
```

---

## 2) Deploy Backend (Render)

Render: https://render.com/

1. Create a new Web Service.
2. Connect your GitHub repository (or upload)
3. Settings:
   - Runtime: Node
   - Build Command: `npm install`
   - Start Command: `node server.js`
   - Root Directory: `backend/`
4. Add Environment Variables from the `.env` (above).
5. Deploy.

After deploy, you will get a base URL, e.g. `https://kec-admissions-api.onrender.com`

### CORS
The backend already enables CORS via `cors` middleware in `backend/server.js`.
If needed, restrict origins:
```js
app.use(cors({ origin: ["https://your-frontend.netlify.app"], credentials: false }));
```

---

## 3) Deploy Frontend (Netlify)

Netlify: https://app.netlify.com/

1. Create a new Netlify site from Git.
2. Build Settings:
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `frontend/build`
3. Environment Variables (Optional): none required at build. API URL is proxied in dev, but for production you will call full backend URL.

### Point frontend to backend
In production, React will not use the `proxy` field. Update the API base URL in `frontend/src/api/axios.js` if you want to target the live backend:
```js
// src/api/axios.js
const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE || '/',
  headers: { 'Content-Type': 'application/json' }
});
```
Then set Netlify env:
```
REACT_APP_API_BASE=https://kec-admissions-api.onrender.com
```
Rebuild and deploy.

---

## 4) Verify Production

- Frontend live URL: e.g. `https://kec-admissions.netlify.app`
- Backend live URL: e.g. `https://kec-admissions-api.onrender.com`

Steps:
- Visit the frontend URL. You should see the login page.
- Sign up a new account and log in.
- Submit an application. Check MongoDB Atlas to confirm data insertion.
- If SMTP is configured, check the applicant's inbox for emails.
- Make your admin user by updating `role` to `admin` in the `users` collection.
- Test Admin pages:
  - `/admin/dashboard` for overview
  - `/admin/applications` for list, filters, approve/reject, CSV export

---

## 5) Troubleshooting

- CORS errors:
  - Ensure backend CORS `origin` allows your Netlify domain.
- 401/403 errors:
  - Confirm token exists in browser Storage.
  - Ensure user has `role: 'admin'` for Admin routes.
- Emails not sending:
  - Confirm SMTP credentials and `SMTP_FROM`.
  - Check Render logs for mailer warnings.
- Build errors on Netlify:
  - Ensure the correct base directory and publish directory.

---

## 6) Optional: Vercel + Railway

- Vercel (Frontend): import React app, set `REACT_APP_API_BASE` env.
- Railway (Backend): Node service pointing to `backend/`, set env variables.

---

## 7) Security Notes

- Use a strong `JWT_SECRET` in production.
- Restrict CORS to your exact frontend origin.
- Use MongoDB Atlas access controls and IP allowlists.
- Rotate SMTP credentials periodically.

---

Deployed successfully? Great! If you need CI/CD, domain mapping, or https enforcement, I can help set that up too.
