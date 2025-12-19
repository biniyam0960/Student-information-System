## SIS Backend (Node/Express, MySQL-ready)

### Prerequisites
- Node.js 16.x (current package versions are pinned for Node 16)
- npm
- MySQL (for real DB usage; a mock DB is included for quick runs)

### Install & Run
```bash
cd Student-information-System/backend
npm install
npm start         # run server
# or: npm run dev # nodemon
```

- Base URL: `http://localhost:4000`
- Health check: `GET /`

### Environment
Create `.env` in `backend/` (example):
```
PORT=4000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=sis_db
JWT_SECRET=change_me
```

### Folder Structure
```
backend/
  src/
    config/        # db connections (mockDb.js, db.js when using MySQL)
    controllers/   # request handlers (auth, students, courses, sections, enrollments, grades, attendance)
    middleware/    # auth (JWT/RBAC), validation
    models/        # DB access per entity
    routes/        # express routers per module
    services/      # domain services (e.g., GPA calculations)
    server.js      # app entrypoint
```

### Key Modules (routes mounted in server.js)
- Auth: `/api/auth` (register, login, me)
- Students: `/api/students`
- Courses: `/api/courses`
- Sections: `/api/sections`
- Enrollments (Registration): `/api/enrollments`
- Grades & GPA: `/api/grades`
- Attendance: `/api/attendance`
- Items (sample auth-protected CRUD): `/api/items`

### Switching to Real MySQL
1) Add `src/config/db.js` with a `mysql2/promise` pool (host/user/password/db from `.env`).
2) Update imports pointing to `mockDb` → `db` in `server.js`, `models/*`, `routes/items.js`.
3) Create MySQL tables matching the models (users, students, courses, sections, enrollments, assignments, grades, attendance).

### Notes
- Registration is public and always creates `role="student"` unless an admin initiates the request; login works for all roles in the `users` table.
- All queries use parameterized statements to avoid SQL injection.

