# Trello Clone

Check out the live demo of the project here: [Live Demo](https://trello-clone-one-rust.vercel.app/)
A Trello-like project management tool built with Next.js, React, Prisma, Stripe, and Unsplash API.

## Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)

## Features

- **Project Management**: Create and manage organisations, boards, lists, and cards with drag and drop function.
- **User Authentication**: Secure user authentication with Clerk.
- **Activity log**: Log activities of user.
- **Subscription Management**: Handle pro subscriptions with Stripe for unlimited boards.
- **Image Integration**: Fetch and display images from Unsplash.


## Getting Started

First, clone the repository:

```bash
git clone https://github.com/your-username/trello-clone.git
cd trello-clone
```

Then, install the dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

## Environment Variables

Next, set up your environment variables. Create a `.env` file in the root directory and add the following:

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="yout-next-publish-clerk-publishable-key"
CLERK_SECRET_KEY="your-clerk-secret-key"
DATABASE_URL="your-database-url"
STRIPE_API_KEY="your-stripe-api-key"
STRIPE_WEBHOOK_SECRET="your-stripe-webhook-secret"
NEXT_PUBLIC_UNSPLASH_ACCESS_KEY="your-unsplash-access-key"
```