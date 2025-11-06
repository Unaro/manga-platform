# Users Module - Phase 1

Starting template for the Users module with authentication, profiles, and user management.

## Structure
- `types/` - User domain types, API contracts, events
- `repositories/` - UserRepository interface + Supabase implementation
- `services/` - UserService with business logic
- `api/` - Next.js API routes with Zod validation
- `events/` - Event handlers and event bus integration

## Next Steps
1. Implement Supabase integration in UserRepository
2. Add password hashing and JWT generation
3. Wire up EventBus for user.registered/user.profile.updated events
4. Add comprehensive tests (unit/contract/integration)
5. Add proper error handling and logging
6. Implement email verification flow

## API Endpoints (planned)
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update user profile
- `GET /api/users/:id/stats` - User statistics

## Events
- `user.registered` - Emitted on successful registration
- `user.profile.updated` - Emitted on profile changes

This is the foundation that other modules will build upon.
