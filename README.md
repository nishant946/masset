# Asset Manager

Asset Manager is a web application for managing digital assets, built with Next.js, TypeScript, and Drizzle ORM. It provides an admin dashboard for asset approval, purchase tracking, and a user-friendly gallery interface.

## Features
- User authentication and login
- Admin dashboard for asset approval
- Asset purchase management
- Asset gallery view
- Modern UI with reusable components
- PostgreSQL database integration via Drizzle ORM

## Tech Stack
- Next.js 15
- React
- TypeScript
- Drizzle ORM
- PostgreSQL
- Tailwind CSS

## Features

### Implemented
- User authentication and login
- Asset gallery view
- Modern UI with reusable components
- PostgreSQL database integration via Drizzle ORM

### To Be Implemented
- Admin dashboard for asset approval
  - Approve or reject asset submissions
  - View pending asset requests
- Asset purchase management
  - Track asset purchases by users
  - Purchase history and receipts
- **Payment gateway integration**
  - Allow users to purchase assets securely via a payment provider (e.g., Stripe, Razorpay, etc.)
- Asset upload and management
  - Users can upload new assets
  - Edit and delete owned assets
- User roles and permissions
  - Admin and regular user separation
- Notifications
  - Notify users of approval status and purchases

  #folder Structure
masset/ ├── drizzle.config.ts ├── package.json ├── README.md ├── .env ├── src/ │ ├── app/ │ │ ├── admin/ │ │ │ └── asset-approval/ │ │ │ └── page.tsx │ │ ├── login/ │ │ │ └── page.tsx │ │ └── ... │ ├── components/ │ │ └── ui/ │ │ └── card.tsx │ ├── lib/ │ │ └── db/ │ │ └── schema.ts │ └── ... └── ...