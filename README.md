# MIAW

Mental Wellness Journey Tracker – a full-stack application with mood tracking, journals, habits, assessments, reports, notifications, and admin management.

## Quick Start

```bash
cd backend
mvn spring-boot:run
```

Open **http://localhost:8080** in your browser.

- **Admin account** (seeded): `admin@miaw.local` / `admin123`
- Java 17 + Maven required
- H2 file database stored at `backend/data/miaw`

## Features

| Feature | Description |
|---------|-------------|
| 🔐 Authentication | JWT access + refresh tokens, register/login/logout |
| 😊 Mood Tracking | Daily mood logging with emoji selector, date filtering, CRUD |
| 📓 Journals | Rich text journal entries with create/edit/delete |
| ✅ Habits | Daily habit tracking with consistency scores and streak counters |
| 📋 Assessments | 10-question wellness self-assessment with scoring |
| 📈 Reports | Mood distribution charts (weekly/monthly) + habit consistency |
| ⚙️ Settings | Notification preferences with toggle switches |
| 🛡️ Admin | User management, platform usage statistics |

## Architecture

```
backend/
├── src/main/java/com/miaw/
│   ├── config/         # Security, CORS, DataSeeder, GlobalExceptionHandler
│   ├── controller/     # REST controllers (Auth, Mood, Journal, Habit, etc.)
│   ├── dto/            # Request/Response DTOs with Bean Validation
│   ├── model/          # JPA entities (User, MoodEntry, Habit, etc.)
│   ├── repository/     # Spring Data JPA repositories
│   ├── service/        # Business logic with @Transactional
│   ├── core/           # MVC demo (in-memory DAO + Strategy pattern)
│   └── dao/            # In-memory DAO interfaces + implementations
├── src/main/resources/
│   ├── static/         # Frontend SPA (HTML, CSS, JS)
│   └── application.properties
└── pom.xml
```

## Design Patterns

- **MVC** – Controllers → Services → Repositories
- **Strategy** – `ReportStrategy` for pluggable report generation
- **Singleton** – `DBConnection.getInstance()` in demo
- **DAO** – `MoodDAO` / `UserDAO` with in-memory implementations
- **DTO** – Clean API boundary between models and responses
- **Observer** – Spring's event-driven `@ControllerAdvice` for errors
- **Builder** – JWT token construction via JJWT builder API

## API Routes

### Authentication
- `POST /api/auth/register` – Register and get tokens
- `POST /api/auth/login` – Login and get tokens
- `POST /api/auth/refresh` – Refresh access token
- `POST /api/auth/logout` – Revoke all refresh tokens
- `GET /api/auth/me` – Current user profile

### Moods
- `POST /api/moods` – Log/update mood (upsert by date)
- `GET /api/moods?startDate=&endDate=` – List moods
- `PUT /api/moods/{id}` – Update mood
- `DELETE /api/moods/{id}` – Delete mood

### Journals
- `POST /api/journals` – Create entry
- `GET /api/journals` – List entries
- `PUT /api/journals/{id}` – Update entry
- `DELETE /api/journals/{id}` – Delete entry

### Habits
- `POST /api/habits` – Create habit
- `GET /api/habits` – List habits
- `PUT /api/habits/{id}` – Update habit
- `POST /api/habits/{id}/logs` – Log daily completion
- `GET /api/habits/{id}/logs` – List logs
- `GET /api/habits/{id}/consistency?days=30` – Consistency & streaks

### Assessments
- `POST /api/assessments` – Submit assessment
- `GET /api/assessments` – List past assessments

### Reports
- `GET /api/reports/moods?period=weekly|monthly` – Mood distribution
- `GET /api/reports/habits?days=30` – Habit consistency report

### Notifications
- `GET /api/notifications/settings` – Get settings
- `PUT /api/notifications/settings` – Update settings

### Admin (requires ADMIN role)
- `GET /api/admin/users` – List all users
- `DELETE /api/admin/users/{id}` – Delete user
- `GET /api/admin/usage` – Platform usage stats

## MVC Demo (In-Memory)

```bash
cd backend
mvn -q exec:java
```

Runs a console demo: register → login → mood log → mood report.

## Notes

- This system is for self-monitoring only and is not a medical or diagnostic tool.
- Notification preferences are stored but actual push/email sending requires integration.
