# MIAW

Mental Wellness Journey Tracker – backend MVP with mood tracking, journals, habits, assessments, reports, notifications, and admin usage stats.

## Backend quick start

- Java 17 + Maven
- Default port: 8080
- H2 file database stored at `backend/data/miaw`

### Authentication

The backend currently uses HTTP Basic Auth.

- Admin user (seeded):
	- Email: `admin@miaw.local`
	- Password: `admin123`

### Key API routes

Base URL: `http://localhost:8080`

Authentication

- `POST /api/auth/register`
- `GET /api/auth/login`
- `GET /api/auth/me`

Moods

- `POST /api/moods`
- `GET /api/moods?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD`
- `PUT /api/moods/{entryId}`
- `DELETE /api/moods/{entryId}`

Journals

- `GET /api/journals`
- `POST /api/journals`
- `PUT /api/journals/{entryId}`
- `DELETE /api/journals/{entryId}`

Habits

- `GET /api/habits`
- `POST /api/habits`
- `PUT /api/habits/{habitId}`
- `POST /api/habits/{habitId}/logs`
- `GET /api/habits/{habitId}/logs`
- `GET /api/habits/{habitId}/consistency?days=30`

Assessments

- `POST /api/assessments`
- `GET /api/assessments`

Reports

- `GET /api/reports/moods?period=weekly|monthly`
- `GET /api/reports/habits?days=30`

Notifications

- `GET /api/notifications/settings`
- `PUT /api/notifications/settings`

Admin (requires ADMIN role)

- `GET /api/admin/users`
- `DELETE /api/admin/users/{userId}`
- `GET /api/admin/usage`

## Notes

- This system is for self-monitoring only and is not a medical or diagnostic tool.
- Notifications are settings-only in this MVP; they don't send real messages yet.
