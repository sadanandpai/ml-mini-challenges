import { Link } from 'wouter';
import { challenges } from '../helpers/challenges-list';

export function Challenges() {
  return (
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
  );
}
