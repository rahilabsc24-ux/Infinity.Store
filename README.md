# Infinity — Store

A full-stack e-commerce app built with **M**ongoDB, **E**xpress, **R**eact and **N**ode.js.
A complete MERN project with a real API,database, authentication, persisted orders, and an admin dashboard.

## Features

- **Catalog**: products stored in MongoDB, filter by category, search, and sort (server-side)
- **Accounts**: register / sign in with JWT; passwords hashed with bcrypt
- **Cart**: kept in the browser, re-validated by the server at checkout
- **Checkout**: orders are priced on the server from database values (the client never sets prices), stock is reserved, and order numbers are issued
- **Order history**: customers see their own orders
- **Admin dashboard** (admin role): manage orders and their status, add and delete products

## Project structure

```
infinity-store/
├── client/                # React 18 + Vite + React Router + Tailwind CSS v4
│   ├── public/products/   # product images
│   └── src/
│       ├── components/    # Header, ProductCard, Hero, ...
│       ├── context/       # AuthContext, CartContext
│       ├── hooks/         # useAsync
│       ├── lib/           # api client, formatting, pricing
│       └── pages/         # Home, Products, ProductDetail, Cart, Checkout, Orders, Admin, ...
└── server/                # Node.js + Express 5 + Mongoose
    └── src/
        ├── config/        # MongoDB connection
        ├── data/          # seed catalog
        ├── middleware/    # JWT auth, admin guard, error handling
        ├── models/        # User, Product, Order
        ├── routes/        # /api/auth, /api/products, /api/orders
        ├── seed.js        # loads catalog + creates admin
        └── index.js       # app entry point
```

## API reference

| Method | Endpoint                    | Auth      | Description                              |
|--------|-----------------------------|-----------|------------------------------------------|
| GET    | `/api/health`               | –         | Health check                             |
| POST   | `/api/auth/register`        | –         | Create account, returns JWT              |
| POST   | `/api/auth/login`           | –         | Sign in, returns JWT                     |
| GET    | `/api/auth/me`              | user      | Current user                             |
| GET    | `/api/products`             | –         | List. Query: `category`, `q`, `sort`     |
| GET    | `/api/products/:slug`       | –         | Single product                           |
| POST   | `/api/products`             | admin     | Create product                           |
| PUT    | `/api/products/:id`         | admin     | Update product                           |
| DELETE | `/api/products/:id`         | admin     | Delete product                           |
| POST   | `/api/orders`               | user      | Place order (`items`, `shippingAddress`) |
| GET    | `/api/orders/mine`          | user      | My orders                                |
| GET    | `/api/orders`               | admin     | All orders                               |
| PATCH  | `/api/orders/:id/status`    | admin     | Update order status                      |

## Prerequisites

- Node.js 18.18+ (20 LTS recommended)
- MongoDB 6+ running locally **or** a MongoDB Atlas connection string

## Setup

```bash
# 1. Install dependencies for root, server and client
npm install
npm run install:all

# 2. Configure the API
cp server/.env.example server/.env
#    then edit server/.env (MONGO_URI, JWT_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD)

# 3. Load the product catalog and create the admin account
npm run seed

# 4. Start API (port 5000) and web app (port 5173) together
npm run dev
```

Open http://localhost:5173. Sign in with the `ADMIN_EMAIL` / `ADMIN_PASSWORD` from `server/.env` to reach `/admin`.

## Production build

```bash
npm run build      # builds client/dist
npm start          # Express serves the API and the built React app on PORT (default 5000)
```

## Notes

- Payments are a **demo**. Only the last four card digits are stored. For real payments, integrate Stripe
  (or similar) on the server and create the payment intent there.
- Tokens are stored in `localStorage` for simplicity. For higher security, move to httpOnly cookies.
- `npm run seed` replaces the product catalog each time it runs; existing orders are preserved.
