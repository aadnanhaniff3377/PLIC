# Employee Management REST API

A professional, scalable, and secure Node.js REST API server for an Employee Management System. Built for integration with **Oracle APEX** frontends and powered by **PostgreSQL** (compatible with Google Cloud SQL).

---

## Technologies Used

- **Node.js** & **Express.js** — Backend runtime and web framework
- **PostgreSQL** (`pg`) — Relational database with connection pooling and parameterized queries
- **Helmet** — Secure HTTP response headers
- **CORS** — Cross-origin resource sharing for Oracle APEX
- **Morgan** — HTTP request logging
- **Express Rate Limit** — Basic IP rate limiting against brute-force and DDoS attacks
- **Dotenv** — Environment variable management

---

## Project Architecture

```text
employee-management-api/
│
├── src/
│   ├── config/
│   │   ├── database.js
│   │   └── environment.js
│   │
│   ├── controllers/
│   │   └── employeeController.js
│   │
│   ├── services/
│   │   └── employeeService.js
│   │
│   ├── routes/
│   │   ├── employeeRoutes.js
│   │   └── index.js
│   │
│   ├── middleware/
│   │   ├── errorHandler.js
│   │   ├── notFound.js
│   │   └── requestValidator.js
│   │
│   ├── utils/
│   │   └── apiResponse.js
│   │
│   ├── app.js
│   └── server.js
│
├── database/
│   └── schema.sql
│
├── .env
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

---

## Installation Instructions

1. **Clone or download** the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env` and configure your database credentials:
   ```bash
   cp .env.example .env
   ```

---

## Environment Configuration

Configure your `.env` file:

```env
NODE_ENV=development
PORT=5000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=employee_db
DB_USER=postgres
DB_PASSWORD=your_secure_password
DB_SSL=false

CORS_ORIGIN=*
```

For **Google Cloud SQL PostgreSQL**, set `DB_SSL=true` and provide your Cloud SQL instance public IP or private IP, database name, user, and password.

---

## Database Setup

1. Create a PostgreSQL database named `employee_db` (or whatever you configured in `.env`).
2. Run the schema script to create tables, indexes, and sample data:
   ```bash
   psql -U postgres -d employee_db -f database/schema.sql
   ```

---

## How to Run the Server

- **Development mode** (with auto-restart via Nodemon):
  ```bash
  npm run dev
  ```
- **Production mode**:
  ```bash
  npm start
  ```

---

## API Endpoints Documentation

Base URL: `http://localhost:5000/api/v1`

### 1. Health Check
- **GET** `/api/v1/health`
- **Response**: Server uptime and status.

### 2. Get All Employees
- **GET** `/api/v1/employees`
- **Query Parameters**:
  - `page` (integer, default: 1)
  - `limit` (integer, default: 10)
  - `search` (string: matches `full_name`, `email`, or `designation`)
  - `department` (string)
  - `status` (`Active` or `Inactive`)

### 3. Get Employee by ID
- **GET** `/api/v1/employees/:id`

### 4. Create Employee
- **POST** `/api/v1/employees`
- **Request Body (JSON)**:
  ```json
  {
    "full_name": "Ali Ahmed",
    "email": "ali.ahmed@example.com",
    "phone": "03001234567",
    "department": "IT",
    "designation": "Software Developer",
    "salary": 80000,
    "joining_date": "2026-11-24",
    "status": "Active"
  }
  ```

### 5. Update Employee
- **PUT** `/api/v1/employees/:id`
- **Request Body (JSON)**: (All fields optional for partial/full update)
  ```json
  {
    "full_name": "Ali Ahmed Updated",
    "salary": 85000
  }
  ```

### 6. Delete Employee
- **DELETE** `/api/v1/employees/:id`

---

## Testing Using Postman

1. Open Postman.
2. Import or create a new collection called **Employee Management API**.
3. Set request headers: `Content-Type: application/json`.
4. Test **POST** `http://localhost:5000/api/v1/employees` with a JSON body.
5. Test **GET** `http://localhost:5000/api/v1/employees` to verify pagination and search.

---

## Connecting Oracle APEX

1. In Oracle APEX, navigate to **Shared Components** -> **REST Data Sources**.
2. Create a REST Data Source for `http://<your-server-ip>:5000/api/v1/employees`.
3. Configure operations (GET for report regions, POST/PUT/DELETE for employee forms).
4. Map JSON data root (`data`) to APEX interactive reports/forms.
