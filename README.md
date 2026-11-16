# Boarding House Management System

Editable starter project using React + Vite, Node.js + Express, MongoDB Atlas + Mongoose.

## Project structure

- `frontend/` React user interface
- `backend/` Express REST API and MongoDB models
- `.github/workflows/ci.yml` basic GitHub Actions checks

## Requirements

- Node.js 20 or newer
- npm
- MongoDB Atlas account (or local MongoDB)

## 1. Configure MongoDB Atlas

1. Create a free Atlas cluster.
2. Create a database user under **Security → Database Access**.
3. Under **Security → Network Access**, allow your development IP address.
4. In the cluster, click **Connect → Drivers** and copy the connection URI.
5. Replace `<password>` with the database user's password. URL-encode special characters in the password.
6. Add the database name `boarding_house` in the URI path.

Do not share your real connection URI or commit it to GitHub.

## 2. Configure and run the backend

Open a terminal in `backend/`:

```bash
npm install
```

Copy `.env.example` to `.env` and edit `MONGODB_URI`:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://YOUR_DB_USER:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/boarding_house?retryWrites=true&w=majority
CLIENT_URL=http://localhost:5173
JWT_SECRET=replace_with_a_long_random_secret
```

Start the API:

```bash
npm run dev
```

Test this URL in your browser:

`http://localhost:5000/api/health`

Expected response:

```json
{"status":"ok","service":"boarding-house-api"}
```

## 3. Configure and run the frontend

Open another terminal in `frontend/`:

```bash
npm install
```

Copy `frontend/.env.example` to `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000
```

Start Vite:

```bash
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173`.

## 4. Available API routes

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/health` | API health |
| GET/POST | `/api/rooms` | List/create rooms |
| GET/PUT/DELETE | `/api/rooms/:id` | Read/update/delete room |
| GET/POST | `/api/tenants` | List/create tenants |
| GET/PUT/DELETE | `/api/tenants/:id` | Read/update/delete tenant |
| GET/POST | `/api/payments` | List/create payments |
| GET/POST | `/api/maintenance` | List/create maintenance requests |

## 5. Deploy

- **Backend:** Deploy `backend/` as a Render Web Service. Build command: `npm install`; start command: `npm start`. Add `MONGODB_URI`, `CLIENT_URL`, and `JWT_SECRET` as Render environment variables. Health check path: `/api/health`.
- **Frontend:** Deploy `frontend/` to Netlify. Build command: `npm run build`; publish directory: `dist`. Set `VITE_API_URL` to your deployed Render URL, then redeploy.
- Update Render's `CLIENT_URL` to your actual Netlify URL.

## Important notes

- This is an editable starter, not a finished production system.
- Add authentication/authorization before using real tenant or payment data.
- Never put `MONGODB_URI` or `JWT_SECRET` in the frontend.
- Never commit `.env` files.
