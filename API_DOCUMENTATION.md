# 📚 API Documentation - Salam Institute Teaching Management System

## Base URL

- **Development**: `http://localhost:3000/api`
- **Production**: `https://salam-institut.com/api`

## Authentication

Most endpoints require authentication using NextAuth session cookies. Include credentials in requests.

### Authentication Header

```
Cookie: next-auth.session-token=...
```

---

## 📋 Response Format

All API responses follow this structure:

```typescript
{
  success: boolean;
  data?: any;
  error?: string;
  message?: string;
  details?: any[]; // For validation errors
}
```

---

## 🎓 Endpoints

### 1. Trial Class Requests (Probestunde)

#### POST `/api/probestunde`

Submit a trial class request.

**Request Body:**

```json
{
  "numStudents": 2,
  "students": [
    { "name": "Ali Ahmed", "age": "10" },
    { "name": "Fatima Ahmed", "age": "8" }
  ],
  "email": "parent@example.com",
  "phone": "+49123456789",
  "contactMethod": "whatsapp",
  "teacherPreference": "female",
  "timestamp": "2024-02-14T10:30:00Z"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Form submitted successfully",
  "data": {
    "id": "clxxx123",
    "createdAt": "2024-02-14T10:30:00Z"
  }
}
```

**Validation:**
- `numStudents`: 1-10
- `contactMethod`: "whatsapp" | "email" | "call"
- `teacherPreference`: "male" | "female" | "no-preference"

---

### 2. Authentication

#### POST `/api/auth/signin`

Handled by NextAuth. Use the client-side `signIn()` function.

#### POST `/api/auth/signout`

Handled by NextAuth. Use the client-side `signOut()` function.

---

### 3. Users

#### GET `/api/users`

List all users (Admin only).

**Query Parameters:**
- `role`: Filter by role (ADMIN, TEACHER, STUDENT)
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)

**Response:**

```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "clxxx123",
        "email": "user@example.com",
        "name": "John Doe",
        "role": "STUDENT",
        "phone": "+49123456789",
        "createdAt": "2024-01-01T00:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 50,
      "totalPages": 3
    }
  }
}
```

#### POST `/api/users`

Create new user (Admin only).

**Request:**

```json
{
  "email": "newuser@example.com",
  "password": "SecurePassword123!",
  "name": "Jane Doe",
  "role": "TEACHER",
  "phone": "+49123456789"
}
```

#### GET `/api/users/[id]`

Get user details. Users can view their own profile; admins can view any.

#### PATCH `/api/users/[id]`

Update user. Users can update their own profile; admins can update any.

**Request:**

```json
{
  "name": "Updated Name",
  "phone": "+49987654321",
  "password": "NewPassword123!" // optional
}
```

#### DELETE `/api/users/[id]`

Delete user (Admin only).

---

### 4. Courses

#### GET `/api/courses`

List all courses (Public endpoint).

**Query Parameters:**
- `type`: QURAN_KIDS | QURAN_ADULTS | ARABIC_LANGUAGE | ISLAMIC_STUDIES
- `isActive`: true | false
- `page`: Page number
- `limit`: Items per page

**Response:**

```json
{
  "success": true,
  "data": {
    "courses": [
      {
        "id": "clxxx123",
        "name": "Quran for Kids",
        "description": "Interactive Quran learning for children",
        "type": "QURAN_KIDS",
        "price": 99.99,
        "duration": 60,
        "totalSessions": 12,
        "isActive": true,
        "teachers": [...],
        "_count": {
          "enrollments": 25,
          "bookings": 120
        }
      }
    ],
    "pagination": {...}
  }
}
```

#### POST `/api/courses`

Create course (Admin only).

**Request:**

```json
{
  "name": "Advanced Arabic Grammar",
  "nameAr": "النحو العربي المتقدم",
  "nameDe": "Fortgeschrittene arabische Grammatik",
  "description": "Comprehensive Arabic grammar course",
  "type": "ARABIC_LANGUAGE",
  "price": 149.99,
  "duration": 90,
  "totalSessions": 16,
  "level": "Advanced",
  "ageGroup": "Adults (18+)",
  "isActive": true
}
```

#### GET `/api/courses/[id]`

Get course details with enrolled students and assigned teachers.

#### PATCH `/api/courses/[id]`

Update course (Admin only).

#### DELETE `/api/courses/[id]`

Delete course (Admin only).

---

### 5. Bookings

#### GET `/api/bookings`

List bookings with role-based filtering.

**Role-based Access:**
- **Students**: Only their own bookings
- **Teachers**: Only bookings assigned to them
- **Admins**: All bookings, with optional filters

**Query Parameters:**
- `status`: PENDING | CONFIRMED | COMPLETED | CANCELLED | NO_SHOW
- `studentId`: Filter by student (Admin only)
- `teacherId`: Filter by teacher (Admin only)
- `page`, `limit`: Pagination

**Response:**

```json
{
  "success": true,
  "data": {
    "bookings": [
      {
        "id": "clxxx123",
        "scheduledAt": "2024-02-20T14:00:00Z",
        "endTime": "2024-02-20T15:00:00Z",
        "status": "CONFIRMED",
        "meetingLink": "https://zoom.us/j/123456789",
        "course": {
          "id": "clxxx456",
          "name": "Quran for Kids",
          "duration": 60
        },
        "student": {...},
        "teacher": {...}
      }
    ],
    "pagination": {...}
  }
}
```

#### POST `/api/bookings`

Create new booking. Includes automatic conflict detection.

**Request:**

```json
{
  "courseId": "clxxx123",
  "studentId": "clxxx456",
  "teacherId": "clxxx789",
  "scheduledAt": "2024-02-20T14:00:00Z",
  "notes": "First class"
}
```

**Conflict Detection:**
- Checks if teacher is already booked at that time
- Returns 409 if conflict exists

#### GET `/api/bookings/[id]`

Get booking details.

#### PATCH `/api/bookings/[id]`

Update booking.

**Admin can update:**
- `status`, `scheduledAt`, `meetingLink`, `notes`, `adminNotes`, `cancelReason`

**Teacher can update:**
- `meetingLink`, `notes`

**Student can only:**
- Cancel booking (set `status: "CANCELLED"`)

#### DELETE `/api/bookings/[id]`

Delete booking (Admin only).

---

### 6. Payments

#### GET `/api/payments`

List payments with role-based filtering.

**Role-based Access:**
- **Students**: Only their own payments
- **Admins**: All payments with optional filters
- **Teachers**: Forbidden

**Query Parameters:**
- `studentId`: Filter by student (Admin only)
- `status`: PENDING | COMPLETED | FAILED | REFUNDED
- `page`, `limit`: Pagination

#### POST `/api/payments/checkout`

Create Stripe checkout session.

**Request:**

```json
{
  "courseId": "clxxx123",
  "studentId": "clxxx456",
  "successUrl": "https://salam-institut.com/success",
  "cancelUrl": "https://salam-institut.com/cancel"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "sessionId": "cs_test_...",
    "sessionUrl": "https://checkout.stripe.com/...",
    "paymentId": "clxxx789"
  },
  "message": "Checkout session created successfully"
}
```

**Client-side usage:**

```typescript
const response = await fetch('/api/payments/checkout', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ courseId, studentId })
});

const { data } = await response.json();

// Redirect to Stripe Checkout
window.location.href = data.sessionUrl;
```

#### POST `/api/payments/webhook`

Stripe webhook handler (called by Stripe, not your app).

**Events handled:**
- `checkout.session.completed`: Mark payment as completed
- `payment_intent.succeeded`: Update payment status
- `payment_intent.payment_failed`: Mark payment as failed
- `charge.refunded`: Mark payment as refunded

**Configuration:**
- Set webhook URL in Stripe Dashboard: `https://salam-institut.com/api/payments/webhook`
- Add `STRIPE_WEBHOOK_SECRET` to environment variables

---

### 7. File Uploads

#### POST `/api/upload/signed-url`

Generate pre-signed S3 URL for file upload.

**Request:**

```json
{
  "fileName": "profile-picture.jpg",
  "fileType": "image/jpeg",
  "fileSize": 524288,
  "folder": "users"
}
```

**Allowed file types:**
- Images: `image/jpeg`, `image/png`, `image/gif`, `image/webp`
- Documents: `application/pdf`

**Response:**

```json
{
  "success": true,
  "data": {
    "signedUrl": "https://salam-institute-uploads.s3.amazonaws.com/...",
    "publicUrl": "https://salam-institute-uploads.s3.amazonaws.com/users/clxxx/1234567890-profile-picture.jpg",
    "key": "users/clxxx/1234567890-profile-picture.jpg",
    "expiresIn": 3600
  }
}
```

**Client-side upload:**

```typescript
// 1. Get signed URL
const { data } = await fetch('/api/upload/signed-url', {
  method: 'POST',
  body: JSON.stringify({
    fileName: file.name,
    fileType: file.type,
    fileSize: file.size,
    folder: 'courses'
  })
}).then(r => r.json());

// 2. Upload file to S3
await fetch(data.signedUrl, {
  method: 'PUT',
  body: file,
  headers: {
    'Content-Type': file.type
  }
});

// 3. Use publicUrl in your application
console.log('File uploaded:', data.publicUrl);
```

---

## ⚠️ Error Responses

### 400 Bad Request

```json
{
  "success": false,
  "error": "Validation failed",
  "details": [
    {
      "path": ["email"],
      "message": "Invalid email address"
    }
  ]
}
```

### 401 Unauthorized

```json
{
  "success": false,
  "error": "Unauthorized: Authentication required"
}
```

### 403 Forbidden

```json
{
  "success": false,
  "error": "Forbidden: Admin role required"
}
```

### 404 Not Found

```json
{
  "success": false,
  "error": "Resource not found"
}
```

### 409 Conflict

```json
{
  "success": false,
  "error": "Teacher is not available at this time"
}
```

### 500 Internal Server Error

```json
{
  "success": false,
  "error": "Internal server error"
}
```

---

## 🔒 Role-Based Access Control

| Endpoint                  | ADMIN | TEACHER | STUDENT | PUBLIC |
|---------------------------|-------|---------|---------|--------|
| POST /api/probestunde     | ✅    | ✅      | ✅      | ✅     |
| GET /api/users            | ✅    | ❌      | ❌      | ❌     |
| POST /api/users           | ✅    | ❌      | ❌      | ❌     |
| GET /api/users/[id]       | ✅    | Own     | Own     | ❌     |
| PATCH /api/users/[id]     | ✅    | Own     | Own     | ❌     |
| DELETE /api/users/[id]    | ✅    | ❌      | ❌      | ❌     |
| GET /api/courses          | ✅    | ✅      | ✅      | ✅     |
| POST /api/courses         | ✅    | ❌      | ❌      | ❌     |
| GET /api/bookings         | ✅    | Own     | Own     | ❌     |
| POST /api/bookings        | ✅    | ✅      | ✅      | ❌     |
| PATCH /api/bookings/[id]  | ✅    | Limited | Cancel  | ❌     |
| GET /api/payments         | ✅    | ❌      | Own     | ❌     |
| POST /api/payments/checkout | ✅  | ✅      | ✅      | ❌     |

---

## 📝 Notes

1. **Pagination**: Default page size is 20. Maximum is 100.
2. **Timestamps**: All timestamps are in ISO 8601 format (UTC).
3. **IDs**: All IDs are CUID (Collision Resistant Unique Identifier).
4. **Validation**: All inputs are validated using Zod schemas.
5. **Rate Limiting**: Consider implementing rate limiting in production.

---

## 🧪 Testing Endpoints

### Using cURL

```bash
# Test trial class submission
curl -X POST http://localhost:3000/api/probestunde \
  -H "Content-Type: application/json" \
  -d '{
    "numStudents": 1,
    "students": [{"name": "Test Student", "age": "10"}],
    "email": "test@example.com",
    "phone": "+49123456789",
    "contactMethod": "email",
    "teacherPreference": "no-preference"
  }'

# Login (get session cookie)
curl -X POST http://localhost:3000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@example.com", "password": "password"}'

# List users (with auth)
curl http://localhost:3000/api/users \
  -H "Cookie: next-auth.session-token=YOUR_SESSION_TOKEN"
```

### Using Postman/Insomnia

Import this collection or manually configure endpoints using the specifications above.

---

## 🆘 Support

For API issues or questions, please check the logs or open an issue on GitHub.
