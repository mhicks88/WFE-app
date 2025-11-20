import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-amber-400 mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-2">Bottle Not Found</h2>
        <p className="text-gray-400 mb-8">
          The barrel you're looking for doesn't exist in our collection.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-lg transition-colors duration-200"
        >
          ← Back to search
        </Link>
      </div>
    </div>
  );
}
