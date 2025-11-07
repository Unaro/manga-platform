import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-4xl w-full text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-6xl font-bold text-gray-900">
            Manga Platform
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Type-first modular platform for manga, manhwa and manhua cataloging
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/auth/register"
            className="btn btn-primary text-lg px-8 py-4 w-full sm:w-auto"
          >
            Get Started
          </Link>
          <Link
            href="/auth/login"
            className="btn btn-outline text-lg px-8 py-4 w-full sm:w-auto"
          >
            Login
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          <div className="card text-left">
            <div className="text-3xl mb-2 font-bold text-blue-600">Collection</div>
            <h3 className="text-lg font-semibold mb-2">Organize Your Collection</h3>
            <p className="text-gray-600 text-sm">
              Keep track of all your manga, manhwa, and manhua in one place
            </p>
          </div>

          <div className="card text-left">
            <div className="text-3xl mb-2 font-bold text-purple-600">Cards</div>
            <h3 className="text-lg font-semibold mb-2">Collect Cards</h3>
            <p className="text-gray-600 text-sm">
              Unlock character cards and build your collection
            </p>
          </div>

          <div className="card text-left">
            <div className="text-3xl mb-2 font-bold text-amber-600">Achievements</div>
            <h3 className="text-lg font-semibold mb-2">Earn Achievements</h3>
            <p className="text-gray-600 text-sm">
              Track your progress and unlock special achievements
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
