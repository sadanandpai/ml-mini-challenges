import { Link } from 'wouter';
import { challenges } from '../helpers/challenges-list';

// Custom tag colors (elegant yet simple, not flashy)
const tagStyles: Record<string, string> = {
  supervised: 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/25 dark:bg-emerald-500/15 dark:text-emerald-400',
  regression: 'bg-teal-500/10 text-teal-600 border border-teal-500/25 dark:bg-teal-500/15 dark:text-teal-400',
  classification: 'bg-cyan-500/10 text-cyan-600 border border-cyan-500/25 dark:bg-cyan-500/15 dark:text-cyan-400',
  reinforcement: 'bg-indigo-500/10 text-indigo-600 border border-indigo-500/25 dark:bg-indigo-500/15 dark:text-indigo-400',
  'q-learning': 'bg-pink-500/10 text-pink-600 border border-pink-500/25 dark:bg-pink-500/15 dark:text-pink-400',
};

export function Challenges() {
  return (
    <div className="w-full max-w-[1200px] px-4 flex flex-col items-center">
      {/* Grid of Clean Glassmorphic Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full mb-16">
        {challenges.map(({ name, title, description, creationDate, tags }) => (
          <Link
            key={name}
            href={`/${name}`}
            className="group block relative overflow-hidden bg-base-100/60 backdrop-blur-md border border-base-content/10 hover:border-primary/45 rounded-2xl p-8 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 cursor-pointer flex flex-col justify-between"
          >
            {/* Soft ambient background hover indicators */}
            <div className="absolute -bottom-16 -right-16 w-32 h-32 bg-primary/5 rounded-full blur-2xl group-hover:scale-125 transition-all duration-500" />

            <div>
              {/* Card Title & Date */}
              <div className="flex justify-between items-start mb-4 gap-2">
                <h5 className="text-2xl font-bold tracking-tight text-base-content group-hover:text-primary transition-colors">
                  {title}
                </h5>
                {creationDate && (
                  <span className="text-[10px] font-mono opacity-50 px-2 py-0.5 bg-base-200 rounded border border-base-content/5 shrink-0 self-center">
                    {creationDate}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-sm font-normal text-base-content/70 leading-relaxed mb-6">
                {description}
              </p>
            </div>

            {/* Tags list */}
            {tags && (
              <div className="flex flex-wrap gap-2 mt-auto">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full tracking-wide uppercase border ${
                      tagStyles[tag] || 'bg-base-200 text-base-content border-base-content/10'
                    }`}
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

