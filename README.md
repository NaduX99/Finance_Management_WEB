# GREEN FINANCE — Smart Expense Tracker

GREEN FINANCE is a full-stack personal finance application for recording income and expenses, planning category budgets, monitoring savings, and understanding spending through dashboards and AI-generated insights.

## Features

- Secure registration and login with JWT authentication
- Account profile editing, password changes, and account deletion
- Email-based password recovery
- Add, view, filter, and delete expense transactions
- Record income and salary by month
- Create monthly budgets for individual spending categories
- Budget utilization, remaining-balance, and overspending alerts
- Monthly summaries for income, expenses, balance, and savings rate
- BI dashboard with KPIs, trends, and category breakdowns
- Month-to-month spending analysis
- Savings-goal and budget-target views
- AI financial tips, budget-plan generation, and finance chat
- Currency conversion using live exchange-rate data
- Responsive React interface
- MySQL procedures, triggers, cursors, and reporting queries
- Local and Docker-based deployment options

## How It Works

1. A user creates an account or signs in.
2. The frontend stores the JWT and sends it with protected API requests.
3. Income, expenses, and category budgets are saved in MySQL.
4. Database procedures calculate reports, while triggers validate transactions and create budget alerts.
5. The Express API returns summaries, trends, category analysis, and alerts.
6. The React dashboard visualizes the results with charts and financial KPIs.
7. When configured, Groq generates personalized financial tips and budget plans.

## Technology Stack

| Layer | Technologies |
| --- | --- |
| Frontend | React 18, Vite, Recharts, GSAP, Lucide React |
| Backend | Node.js, Express |
| Database | MySQL 8 |
| Authentication | JWT, bcryptjs |
| AI | Groq SDK |
| Email | Nodemailer / SMTP |
| Deployment | Docker, Docker Compose, Nginx |

## Project Structure

```text
ADBMS/
├── backend/                    # Express REST API
│   ├── docs/                   # API, setup, and maintenance notes
│   ├── middleware/             # JWT authentication middleware
│   ├── routes/                 # Auth, expenses, income, budgets, AI, dashboard
│   ├── utils/                  # Email utility
│   └── server.js               # API entry point
├── database/
│   └── smart_expense_tracker.sql
├── expense-tracker-Frontend/   # React + Vite application
│   ├── public/                 # Images and feature assets
│   └── src/                    # UI and dashboard components
├── docker-compose.yml
└── run.bat
```

## Prerequisites

For a local installation:

- Node.js 18 or newer
- npm
- MySQL 8

Alternatively, install Docker Desktop to run the complete stack with Docker Compose.

## Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
cd YOUR_REPOSITORY
```

### 2. Create the database

Create a MySQL database and import the included schema:

```bash
mysql -u root -p < database/smart_expense_tracker.sql
```

The script creates the tables, categories, views, stored procedures, triggers, cursors, and sample data required by the application.

### 3. Configure and start the backend

```bash
cd backend
npm install
copy .env.example .env
npm run dev
```

On macOS or Linux, use `cp .env.example .env` instead of `copy`.

Configure these values in `backend/.env`:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=smart_expense_db

JWT_SECRET=replace_with_a_long_random_secret
PORT=5000
FRONTEND_URL=http://localhost:5173
APP_NAME=GREEN FINANCE

GROQ_API_KEY=

SMTP_HOST=
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=
SMTP_PASS=
MAIL_FROM=
```

AI features require `GROQ_API_KEY`. Password-recovery email requires valid SMTP settings. The rest of the app can run without those optional integrations.

### 4. Start the frontend

Open another terminal:

```bash
cd expense-tracker-Frontend
npm install
npm run dev
```

Open `http://localhost:5173`. The API health endpoint is at `http://localhost:5000/api/health`.

### Windows quick start

After installing dependencies and configuring the database and environment file, run:

```bat
run.bat
```

This opens the frontend and backend development servers in separate terminal windows.

## Run with Docker

From the project root:

```bash
docker compose up --build
```

Then open:

- Frontend: `http://localhost`
- Backend API: `http://localhost:5000`
- MySQL host port: `3307`

To stop the services:

```bash
docker compose down
```

Database data is retained in the `mysql_data` Docker volume.

## Main API Routes

Public routes:

| Method | Route | Purpose |
| --- | --- | --- |
| POST | `/api/auth/register` | Create an account |
| POST | `/api/auth/login` | Sign in and receive a JWT |
| POST | `/api/auth/recover` | Request password recovery |
| POST | `/api/auth/reset-password` | Reset a password |
| GET | `/api/health` | Check API status |

Protected route groups:

- `/api/auth/me` — profile management
- `/api/expenses` — categories and expense transactions
- `/api/income` — monthly income
- `/api/budgets` — category budgets
- `/api/dashboard` — summaries, trends, alerts, and BI reports
- `/api/ai` — tips, budget plans, and finance chat

Protected requests require:

```http
Authorization: Bearer <token>
```

More backend details are available in [`backend/docs/API_OVERVIEW.md`](backend/docs/API_OVERVIEW.md).

## Database Design

The schema contains these main entities:

- `USER_ACCOUNT`
- `CATEGORY`
- `INCOME`
- `EXPENSE`
- `BUDGET`
- `ALERTS`

It also demonstrates advanced database concepts through procedures for income, expenses, budgets, monthly reports, and budget checking; triggers for amount validation and alerts; and cursor-based expense and category summaries.

## Production Notes

- Replace the default JWT and database secrets before deployment.
- Never commit `.env` files or API credentials.
- Update the frontend API base URL before deploying to a domain; current frontend requests use `http://localhost:5000`.
- Configure `FRONTEND_URL` to match the deployed frontend origin.
- Use HTTPS in production.
- Configure a production SMTP provider if password recovery is enabled.

## License

This project currently has no license file. Add a license before allowing reuse or distribution.
