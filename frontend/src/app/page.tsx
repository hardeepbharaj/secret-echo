import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Welcome to Secret Echo</h1>
      <div className="space-x-4">
        <Link 
          href="/login" 
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded"
        >
          Login
        </Link>
        <Link 
          href="/register" 
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded"
        >
          Register
        </Link>
      </div>
    </main>
  );
} 