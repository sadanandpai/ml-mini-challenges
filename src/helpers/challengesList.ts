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
    creationDate: '01-05-2026',
  },
  {
    name: '2d-agent',
    title: '2D Agent',
    description:
      'A two-dimensional grid-based reinforcement learning challenge with customizable obstacles and rewards.',
    component: TwoDAgent,
    creationDate: '02-05-2026',
  },
  {
    name: 'tic-tac-toe',
    title: 'Tic-Tac-Toe',
    description:
      'A Q-learning agent trained against a random opponent. Train the agent, then play against it as O.',
    component: TicTacToe,
    creationDate: '03-05-2026',
  },
];
