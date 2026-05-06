import { Link } from 'wouter';
import { challenges } from '../helpers/challengesList';

export function HomePage() {
  return (
    <div className="flex flex-col items-center mt-10">
      <h1 className="text-4xl font-bold mb-4 text-center">
        Machine Learning Mini Challenges
      </h1>
      <p className="text-center mb-8 max-w-lg text-gray-600">
        Welcome to the official repository for ML Mini Challenges. Select a
        challenge below to get started.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl px-4">
        {challenges.map(({ name, title, description, creationDate, tags }) => (
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
            {tags && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="badge badge-outline badge-primary badge-sm uppercase"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
