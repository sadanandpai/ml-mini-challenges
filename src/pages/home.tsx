import { Link } from 'wouter';
import { challenges } from '../helpers/challengesList';

export function HomePage() {
  return (
    <div className="flex flex-col items-center mt-10">
      <h1 className="text-4xl font-bold mb-4 text-center">
        ML Mini Challenges
      </h1>
      <p className="text-center mb-8 max-w-lg text-gray-600">
        Welcome to the official repository for ML Mini Challenges. Select a
        challenge below to get started.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl px-4">
        {challenges.map(({ name, title, description, creationDate }) => (
          <Link
            key={name}
            href={`/${name}`}
            className="group block p-8 bg-base-100 border border-base-300 rounded-2xl shadow-sm hover:shadow-md hover:border-primary/50 transition-all cursor-pointer relative overflow-hidden"
          >
            <div className="flex justify-between items-start mb-4">
              <h5 className="text-2xl font-bold tracking-tight text-base-content group-hover:text-primary transition-colors">
                {title}
              </h5>
              {creationDate && (
                <span className="badge badge-ghost badge-sm font-mono opacity-60">
                  {creationDate}
                </span>
              )}
            </div>

            <p className="font-normal text-base-content/70 leading-relaxed mb-4">
              {description}
            </p>

            <div className="flex items-center gap-1 text-sm font-semibold text-primary opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-10px] group-hover:translate-x-0">
              Start Challenge
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
