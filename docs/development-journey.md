# Development journey: Reach for the Stars API

Student: Chrisjay M. Bibat · Section: 3-1 · Group: Group 5

One entry per milestone, written the week you did it. Newest at the bottom.

## M1 · Accounts, passwords and tokens
- Dates worked: Nov 15 to Nov 17, 2026 · Time spent: 6 hours

- Goal: Implement secure user registration, bcrypt password hashing, JWT authentication, and Role-Based Access Control (RBAC) with admin restrictions.

- What I built: Installed the Weeks 12–18 kit, added user password migration and demo password seeder files, implemented auth.  validator.js, auth.service.js, auth.controller.js, and user.routes.js supporting endpoints for /auth/register, /auth/login, /auth/me, GET /users, and PATCH /users/:id/role.
- Evidence: [pull request link] · [two or three commit hashes]

- Problem I hit: Encountered column existence conflicts during database migration because the Week 10 users table migration already defined password_hash, and initial login attempts returned 401 errors due to unseeded test accounts.

- How I solved it: Adjusted the migration to cleanly use changeColumn for password_hash to match the STRING(60) and allowNull: true requirements, and updated the seeder file paths to correctly reference src/utils/password for hashing demo credentials.

- Decision I made and why: Enforced that registration always defaults users to the PLAYER role by omitting role rules in the registration validator, preventing unauthorized elevation of privileges during sign-up. Cost: Requires explicit admin action via /users/:id/role to promote users.

- Changes to my design set: Updated the users table schema constraints to allow ADMIN roles in the role check constraint alongside PLAYER and HOST.

- What I would explain to a classmate: Authentication verifies who you are via login and JWT tokens (answering with a 401 if unknown), whereas authorization (RBAC) checks what you are allowed to do based on your assigned role (answering with a 403 if you lack permissions like an admin route).

## M2 · The question bank

## M3 · Gameplay

## M4 · Automated tests and server preparation

## M5 · API documentation and deployment

## M6 · The SE1 portfolio and the release

## M7 · The Test Report
