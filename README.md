# Smart Expense Tracker

[![Live Demo](https://img.shields.io/badge/Live%20Demo-▶️-brightgreen)](https://smart-expense-tracker-14z6.onrender.com)

**GitHub Repository:** [https://github.com/YashChaurasia143/smart-expense-tracker](https://github.com/YashChaurasia143/smart-expense-tracker)

A full-stack **MERN** (MongoDB, Express.js, React.js, Node.js) expense management web application designed to track daily spending, visualize financial insights with interactive charts, and organize expenses with multi-criteria filtering and reporting.

---

## Features

* **User Registration and Login**: Secure account creation and authentication.
* **JWT Authentication**: Stateless authentication using JSON Web Tokens.
* **Password Hashing with bcrypt**: Strong password encryption using `bcryptjs` before storage.
* **Add Expenses**: Record expenses with title, amount, category, date, payment method, and description.
* **Edit Expenses**: Update existing expense details seamlessly.
* **Delete Expenses**: Remove unwanted expense records with confirmation prompts.
* **Expense Search**: Real-time keyword search across expense titles and descriptions.
* **Expense Filtering**: Filter expenses by category, custom date range, and amount range.
* **Pagination**: Server-side and client-side pagination for smooth handling of large record sets.
* **Expense Categories**: Pre-configured categories (Food, Travel, Shopping, Bills, Education, Health, Other).
* **Dashboard**: Centralized overview displaying key performance metrics and quick summaries.
* **Monthly Statistics**: Track current vs. previous month spending with Month-over-Month (% MoM) trends.
* **Category Statistics**: Expense distribution and percentage breakdown by category.
* **Charts**: Interactive donut and bar charts powered by **Recharts**.
* **CSV Export**: Export filtered expense records to CSV spreadsheet format.
* **Protected API Routes**: Backend middleware guarding all private resource endpoints.
* **Responsive UI**: Clean, mobile-friendly interface built with Tailwind CSS.

---

## Architecture

![Architecture Diagram](file:///C:/Users/chaur/.gemini/antigravity-ide/brain/666cd075-fa4a-484d-ae61-fd917a991df6/architecture_diagram_1791491961673.jpg)

The frontend (React/Vite) communicates with an Express.js API. JWT authentication secures the API, and an optional MongoDB database stores user and expense data. The app is served as a static build on Render.

---

## Tech Stack

### Frontend
* **React** (v18) - UI component library
* **Vite** - High-performance build tool and dev server
* **Tailwind CSS** - Utility-first CSS styling
* **Axios** - HTTP client with request/response interceptors
* **Recharts** - Composable charting library for React
* **Lucide React** - Modern, clean icon set
* **React Router DOM** - Client-side routing and route guarding

### Backend
* **Node.js** - Server runtime environment
* **Express.js** - RESTful web framework
* **MongoDB** - NoSQL database
* **Mongoose** - Object Data Modeling (ODM) library
* **jsonwebtoken (JWT)** - Token generation and authentication
* **bcryptjs** - Password hashing and verification
* **express-validator** - Request body validation and data sanitization
* **cors** - Cross-Origin Resource Sharing middleware
* **dotenv** - Environment variable management

---

## Project Structure

```text
smart-expense-tracker/
├── package.json               # Root scripts (installation & shortcuts)
├── .gitignore                 # Git ignore rules for root, backend, & frontend
├── README.md                  # Project documentation
│
├── backend/                   # Node.js + Express API Server
│   ├── config/
│   │   └── db.js              # MongoDB connection via Mongoose
│   ├── controllers/
│   │   ├── authController.js  # User authentication & profile controllers
│   │   └── expenseController.js # Expense CRUD, filtering & aggregation analytics
│   ├── data/
│   │   └── seedData.js        # Realistic demo database seeder
│   ├── middleware/
│   │   ├── authMiddleware.js  # JWT authentication verification middleware
│   │   ├── errorMiddleware.js # 404 & centralized error handler
│   │   └── validatorMiddleware.js # Request payload validation rules
│   ├── models/
│   │   ├── Expense.js         # Expense Mongoose schema & indexes
│   │   └── User.js            # User Mongoose schema & password methods
│   ├── routes/
│   │   ├── authRoutes.js      # Auth endpoints (/api/auth)
│   │   └── expenseRoutes.js   # Expense endpoints (/api/expenses)
│   ├── .env.example           # Backend environment variable template
│   ├── package.json           # Backend dependencies & scripts
│   └── server.js              # Backend server entry point
│
└── frontend/                  # React + Vite Frontend Client
    ├── public/                # Static public assets
    ├── src/
    │   ├── components/        # UI components (Charts, Modals, Navbar, Table, etc.)
    │   ├── context/           # React Context (AuthContext)
    │   ├── hooks/             # Custom React hooks (useExpenses)
    │   ├── pages/             # Route views (Dashboard, ExpensesPage, Login, Register, NotFound)
    │   ├── services/          # API services (api, authService, expenseService)
    │   ├── App.jsx            # Application root router
    │   ├── index.css          # Tailwind CSS directives
    │   └── main.jsx           # React DOM entry point
    ├── .env.example           # Frontend environment variable template
    ├── index.html             # HTML entry template
    ├── package.json           # Frontend dependencies & scripts
    ├── postcss.config.js      # PostCSS configuration
    ├── tailwind.config.js     # Tailwind CSS theme configuration
    └── vite.config.js         # Vite configuration
```

---

## Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd smart-expense-tracker
   ```

2. **Install dependencies for Backend and Frontend:**

   You can install dependencies in each directory individually:
   ```bash
   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

   Alternatively, from the project root directory, run:
   ```bash
   npm run install-all
   ```

---

## Environment Variables

You must create `.env` configuration files for both the backend and frontend from their respective `.env.example` templates.

### 1. Backend Configuration
Create `backend/.env`:
```bash
cp backend/.env.example backend/.env
```

Contents of `backend/.env`:
```env
PORT=5000
NODE_ENV=development

MONGO_URI=mongodb://127.0.0.1:27017/expense_tracker

JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d

CLIENT_URL=http://localhost:5173
```

### 2. Frontend Configuration
Create `frontend/.env`:
```bash
cp frontend/.env.example frontend/.env
```

Contents of `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

> **Note:** `.env` files contain local environment configurations and sensitive variables. They are automatically ignored by Git and must **never** be committed to public repositories.

---

## Database Configuration

By default, the application is configured to connect to a local MongoDB instance:
```text
MONGO_URI=mongodb://127.0.0.1:27017/expense_tracker
```

### Using MongoDB Atlas (Cloud)
To use a cloud-hosted MongoDB Atlas database instead:
1. Create a cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a database user and whitelist your IP address in Network Access.
3. Obtain your connection string and update `MONGO_URI` in `backend/.env`:
   ```env
   MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/expense_tracker?retryWrites=true&w=majority
   ```

---

## Demo Seed Data

The project includes an optional database seed script with sample categorized transactions and a preconfigured demo account.

> ⚠️ **Warning:** Running the seed script executes `deleteMany()` on the `users` and `expenses` collections, which **will permanently delete all existing development data** before inserting the demo dataset.

To seed the database:
```bash
cd backend
npm run seed
```
*(Or from the project root: `npm run seed`)*

### Default Demo Credentials:
* **Email:** `demo@example.com`
* **Password:** `password123`

---

## Running the Application

To run the application, start the backend server and frontend client in separate terminal windows:

### 1. Start Backend Server
```bash
cd backend
npm install
npm run dev
```
The backend API server will start on `http://localhost:5000`.

### 2. Start Frontend Client
In a separate terminal window:
```bash
cd frontend
npm install
npm run dev
```
The React development server will start on `http://localhost:5173`.

---

## API Endpoints Summary

### Authentication (`/api/auth`)
* `POST /api/auth/register` - Register a new user account
* `POST /api/auth/login` - Authenticate user credentials and receive JWT
* `GET /api/auth/me` - Fetch authenticated user profile (Protected)
* `PUT /api/auth/profile` - Update profile name and currency preference (Protected)

### Expenses (`/api/expenses`)
* `GET /api/expenses` - Retrieve paginated, filtered, and sorted expenses (Protected)
* `GET /api/expenses/stats` - Retrieve aggregate spending statistics and chart data (Protected)
* `GET /api/expenses/:id` - Retrieve single expense details by ID (Protected)
* `POST /api/expenses` - Create a new expense record (Protected)
* `PUT /api/expenses/:id` - Update an existing expense record (Protected)
* `DELETE /api/expenses/:id` - Delete an expense record (Protected)

---

## License

This project is licensed under the [MIT License](LICENSE).
