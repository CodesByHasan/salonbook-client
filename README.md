# SalonBook – Client

A modern, responsive salon appointment booking platform built with **Next.js 16 (App Router)**. SalonBook allows customers to explore salon services, book appointments, manage their bookings, and complete online payments. Administrators can manage services, appointments, customers, and transactions through a dedicated dashboard.

## 🌐 Live Website

**Live Demo:** https://salonbook-client-kappa.vercel.app

## ✨ Key Features

### 👥 Public Features
- Modern homepage with hero section, featured services, categories, and why-choose-us section.
- Browse available salon services.
- Search services and filter by category.
- Sort services by price.
- Paginated service listings.
- Service details with booking functionality.
- Responsive design for desktop, tablet, and mobile devices.

### 🔐 Authentication
- Email and password authentication.
- Google sign-in integration.
- Secure authentication powered by Better Auth.
- Zod-validated forms.
- Role-based dashboard redirection.
- User-friendly success and error notifications.

### 👤 Customer Dashboard
- Personalized customer dashboard with overview cards.
- View personal appointments and appointment details.
- Cancel pending appointments.
- Pay for confirmed appointments using Stripe.
- Update profile information, including name, image, and phone number.

### 🛠️ Admin Dashboard
- Dashboard overview with platform metrics.
- Create, update, and delete salon services.
- Upload service images using ImgBB.
- Toggle service availability.
- Manage customer appointments.
- Confirm or cancel appointments.
- Manage users and block/unblock accounts.
- View payment transactions.
- Manage administrator profile.

### 🎨 User Experience
- Fully responsive dashboard with mobile navigation drawer.
- Loading skeletons and empty states.
- Custom themed 404 page.
- Toast notifications for errors and successful operations.
- Dedicated handling for 401 Unauthorized and 403 Forbidden responses.
- Consistent UI components and modern interface design.

## 🧰 Technology Stack

| Category | Technologies |
|---|---|
| Framework | Next.js 16 (App Router) |
| Library | React |
| Language | JavaScript |
| Styling | Tailwind CSS v4 |
| UI Components | shadcn/ui (Base UI) |
| Authentication | Better Auth |
| Form Validation | Zod |
| Notifications | Toast notifications |
| Payment Integration | Stripe |
| Deployment | Vercel |
| API Communication | REST API |

## 📦 Installation

### Prerequisites
- Node.js
- npm
- Git
- SalonBook Server running locally or a deployed server URL.

### 1. Clone the repository

```bash
git clone YOUR_CLIENT_REPOSITORY_URL
```

### 2. Navigate to the project directory

```bash
cd salonbook-client
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment variables

Create a `.env.local` file in the project root.

```env
API_URL=http://localhost:5001
```

Replace the URL with your deployed backend URL when using the production environment.

### 5. Start the development server

```bash
npm run dev
```

Open your browser:

http://localhost:3000

**Important:** The SalonBook Server must be running for authentication, services, appointments, image uploads, and payment functionality to work.

The `next.config.mjs` configuration proxies `/api/*` requests to the Express backend to keep authentication cookies first-party.

## 🔑 Environment Variables

| Variable | Description |
|---|---|
| `API_URL` | Express backend API URL (without trailing slash). Required during production builds on Vercel. |

Never commit `.env.local` or expose secret credentials in your repository.

## 💳 Stripe Payment Testing

To test the payment workflow locally:

1. Start the SalonBook Server.
2. Run Stripe CLI:

```bash
stripe listen --forward-to localhost:5001/api/webhooks/stripe
```

3. Copy the generated webhook signing secret into the server's `.env` file as `STRIPE_WEBHOOK_SECRET`.
4. Sign in as a customer and book a salon service.
5. Sign in as an administrator and confirm the appointment.
6. Return to the customer account and click **Pay Now**.
7. Complete the test payment using Stripe's test card:

| Field | Test Value |
|---|---|
| Card Number | `4242 4242 4242 4242` |
| Expiry | Any future date |
| CVC | Any 3 digits |

After successful payment, the appointment should be marked as **Paid**, and the transaction should appear in the admin dashboard.

## 🚀 Deployment

The client is designed to be deployed on Vercel.

1. Import the client repository into Vercel.
2. Configure `API_URL` with your deployed Express backend URL.
3. Deploy the application.
4. Configure the backend's `CLIENT_URL` and `BETTER_AUTH_URL` using your deployed client URL.
5. Configure the Google OAuth redirect URI:

```text
https://YOUR_CLIENT_DOMAIN/api/auth/callback/google
```

6. Redeploy if environment variables are changed.

## 🔗 Project Repositories

- **Client Repository:** https://github.com/CodesByHasan/salonbook-client
- **Server Repository:** https://github.com/CodesByHasan/salonbook-server

## 👨‍💻 Author

**Mehedi Hasan**

## 📄 License

This project was developed as a learning and portfolio project.
