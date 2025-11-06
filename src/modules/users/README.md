# Users Module

Complete user management system with authentication, profiles, and statistics.

## Features

- User registration and login
- Email and username authentication
- JWT token-based auth
- User profiles with preferences
- User statistics and progression
- Event-driven architecture
- Full type safety with Zod

## Structure

```

users/
├── schemas/           \# Zod schemas and types
│   └── user.schema.ts
├── repositories/      \# Data access layer
│   └── user.repository.ts
├── services/          \# Business logic
│   └── user.service.ts
├── events/           \# Event definitions and handlers
│   ├── user.events.ts
│   └── user.handlers.ts
├── hooks/            \# React Query hooks
│   ├── use-auth.ts
│   └── use-user.ts
└── README.md

```

## API Endpoints

### Authentication

#### POST /api/auth/register
Register a new user.

**Request:**
```

{
"email": "user@example.com",
"username": "username",
"password": "password123",
"displayName": "Display Name" // optional
}

```

**Response:**
```

{
"data": {
"user": { /* User object */ },
"token": "jwt-token"
}
}

```

#### POST /api/auth/login
Login with email or username.

**Request:**
```

{
"email": "user@example.com", // or username
"password": "password123"
}

```

**Response:**
```

{
"data": {
"user": { /* User object */ },
"token": "jwt-token"
}
}

```

### User Management

#### GET /api/users/[id]
Get user by ID.

**Response:**
```

{
"data": { /* User object */ }
}

```

#### PUT /api/users/[id]
Update user profile.

**Request:**
```

{
"displayName": "New Name",
"bio": "My bio",
"website": "https://example.com",
"location": "City, Country",
"preferences": {
"theme": "dark",
"language": "en"
}
}

```

## Usage Examples

### Registration

```

import { useRegister } from "@/modules/users/hooks/use-auth";

function RegisterComponent() {
const register = useRegister();

const handleRegister = async () => {
await register.mutateAsync({
email: "user@example.com",
username: "username",
password: "password123"
});
};

return (
<button onClick={handleRegister} disabled={register.isPending}>
Register
</button>
);
}

```

### Login

```

import { useLogin } from "@/modules/users/hooks/use-auth";

function LoginComponent() {
const login = useLogin();

const handleLogin = async () => {
await login.mutateAsync({
email: "user@example.com", // or username
password: "password123"
});
};

return (
<button onClick={handleLogin} disabled={login.isPending}>
Login
</button>
);
}

```

### Get Current User

```

import { useCurrentUser } from "@/modules/users/hooks/use-user";

function ProfileComponent() {
const { data: user, isLoading } = useCurrentUser();

```
if (isLoading) return <div>Loading...</div>;
```

```
if (!user) return <div>Not logged in</div>;
```

```
return <div>Welcome, {user.username}!</div>;
```

}

```

### Update Profile

```

import { useUpdateProfile } from "@/modules/users/hooks/use-user";

function UpdateProfileComponent({ userId }: { userId: string }) {
const updateProfile = useUpdateProfile(userId);

const handleUpdate = async () => {
await updateProfile.mutateAsync({
displayName: "New Name",
bio: "My new bio"
});
};

return (
<button onClick={handleUpdate} disabled={updateProfile.isPending}>
Update Profile
</button>
);
}

```

## Events

The Users module emits the following events:

### user.registered
Emitted when a new user registers.

```

{
type: "user.registered",
aggregateId: "user-id",
data: {
user: {
id: string,
email: string,
username: string,
role: string,
createdAt: Date
}
}
}

```

### user.profile.updated
Emitted when user profile is updated.

```

{
type: "user.profile.updated",
aggregateId: "user-id",
data: {
userId: string,
changes: { /* Updated fields */ }
}
}

```

## Types

All types are generated from Zod schemas:

```

import type {
User,
UserRole,
UserPreferences,
UserStats,
RegisterInput,
LoginInput,
UserProfileUpdate
} from "./schemas/user.schema";

```

## Testing

```


# Run unit tests

npm test -- src/modules/users

# Run with coverage

npm test -- --coverage src/modules/users

```

## Contributing

When adding new features:

1. Add Zod schema in `schemas/`
2. Add repository method if needed
3. Add service method with business logic
4. Add API route
5. Add React Query hook
6. Emit events for side effects
7. Write tests
8. Update this README
