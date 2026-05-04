import { Link } from 'wouter';
import { OneDAgent } from '../challenges/one-d-agent';
import { TwoDAgent } from '../challenges/two-d-agent';
import { TicTacToe } from '../challenges/tic-tac-toe';

export const challenges = [
  {
    name: '1d-agent',
    title: '1D Agent',
    description:
      'A one-dimensional reinforcement learning challenge where an agent learns to find an exit.',
    component: OneDAgent,
  },
  {
    name: '2d-agent',
    title: '2D Agent',
    description:
      'A two-dimensional grid-based reinforcement learning challenge with customizable obstacles and rewards.',
    component: TwoDAgent,
  },
  {
    name: 'tic-tac-toe',
    title: 'Tic-Tac-Toe',
    description:
      'A Q-learning agent trained against a random opponent. Train the agent, then play against it as O.',
    component: TicTacToe,
  },
];


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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl px-4">
        {challenges.map(({ name, title, description }) => (
          <Link
            key={name}
            href={`/${name}`}
            className="block p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">
              {title}
            </h5>
            <p className="font-normal text-gray-700">{description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
