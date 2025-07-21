# CRUD Api
This project implements a RESTful API for managing user records with full CRUD operations. The API handles user data including username, age, and hobbies, with robust error handling and validation.

## Key Features:

REST Endpoints:

- GET /api/users - Retrieve all users (200 OK)

- GET /api/users/{userId} - Fetch specific user (200, 400, 404)

- POST /api/users - Create new user (201, 400)

- PUT /api/users/{userId} - Update user (200, 400, 404)

- DELETE /api/users/{userId} - Delete user (204, 400, 404)

Validation: UUID validation, required field checks

## User Schema:
```
{
  id: string,      // UUID (auto-generated)
  username: string, // Required
  age: number,     // Required
  hobbies: string[] // Required (array)
}
```

## Script commands

Build
```bash
npm run build
```

Development
```bash
npm run start:dev
```

Production
```bash
npm run start:prod
```

Scaling (Multi)
```bash
npm run start:multi
```

Test
```bash
npm run test
```
