# LineSkip Frontend

This is the frontend for the LineSkip application, built with Next.js.

## AI Development

This project was developed using **Claude with Xiaomi Mimo-v2 models** for code generation and assistance.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
frontend/
├── src/
│   ├── app/          # Next.js app directory
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── globals.css
│   │   ├── auth/      # Authentication pages
│   │   ├── tickets/   # Tickets pages
│   │   └── orders/    # Orders pages
│   ├── components/    # React components
│   │   ├── AuthForm.tsx
│   │   ├── Navigation.tsx
│   │   ├── TicketList.tsx
│   │   ├── OrderList.tsx
│   │   └── PaymentForm.tsx
│   ├── store/         # Zustand state management
│   │   └── useStore.ts
│   └── lib/           # Utility functions
│       └── api.ts
├── public/           # Static assets
├── package.json      # Dependencies
└── tailwind.config.ts # Tailwind configuration
```

## Features

- **User Authentication**: Login and registration with JWT tokens
- **Ticket Browsing**: View available tickets with prices and details
- **Ticket Purchasing**: Purchase tickets and generate QR codes
- **Order Management**: View order history with QR code verification
- **Payment Processing**: Secure payment integration (mock implementation)
- **Responsive Design**: Mobile-friendly UI with Tailwind CSS
- **State Management**: Zustand for client-side state

## API Integration

The frontend communicates with the backend API at `http://localhost:8000/api`

## Docker Setup

Build and run with Docker:
```bash
docker-compose up --build
```

## Dependencies

- next - React framework
- react - UI library
- tailwindcss - Utility-first CSS
- typescript - Type safety
- zustand - State management
- axios - HTTP client
- qrcode.react - QR code generation
- lucide-react - Icons
