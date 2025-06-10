# Secret Echo - Frontend

A modern chat application built with Next.js 13+ (App Router), TypeScript, and Tailwind CSS.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd secret-echo/frontend
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file in the frontend directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001 # Your backend API URL
```

4. Start the development server
```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:3000`

## 🏗️ Architecture

### Directory Structure
```
frontend/
├── src/
│   ├── app/                    # Next.js 13+ App Router
│   │   ├── components/         # App-specific components
│   │   ├── providers/         # Context providers
│   │   ├── lib/              # App-specific utilities
│   │   ├── hooks/            # Custom hooks
│   │   └── chat/            # Chat page
│   ├── components/           # Shared components
│   │   ├── ui/              # Reusable UI components
│   │   └── Avatar.tsx       # Shared avatar component
│   ├── lib/                 # Shared utilities
│   └── hooks/               # Shared hooks
```

### Key Features
- **Modern Authentication**: JWT-based authentication with secure token management
- **Real-time Chat**: Immediate message display with optimistic updates
- **Responsive Design**: Mobile-first approach using Tailwind CSS
- **Type Safety**: Full TypeScript implementation
- **Component Architecture**: Reusable UI components with consistent styling

## 🎨 Design Decisions

### Component Organization
- **UI Components**: Reusable UI components (Button, Input) are placed in `/components/ui/` for easy sharing
- **App Components**: Route-specific components are in `/app/components/`
- **Shared Components**: Global components like Avatar are in the root `/components/` directory

### Styling
- **Tailwind CSS**: Used for utility-first styling
- **CSS Modules**: When needed for component-specific styles
- **clsx**: For conditional class name management

### State Management
- **React Context**: Used for auth state management
- **Local State**: useState for component-level state
- **Custom Hooks**: Encapsulated reusable logic

### Performance Optimizations
- **Optimistic Updates**: Messages appear instantly while being sent
- **Smooth Scrolling**: Automatic scroll to new messages
- **Loading States**: Clear loading indicators for better UX

### Security
- **Protected Routes**: Authentication-based route protection
- **Token Management**: Secure JWT handling
- **Error Handling**: Comprehensive error states and user feedback

## 🧪 Testing

```bash
npm run test
# or
yarn test
```

## 📦 Build

```bash
npm run build
# or
yarn build
```

## 🚀 Deployment

The application can be deployed to any platform that supports Next.js applications (Vercel, Netlify, etc.).

1. Build the application
```bash
npm run build
```

2. Start the production server
```bash
npm start
```
