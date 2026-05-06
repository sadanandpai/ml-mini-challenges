import { OneDAgent } from '../challenges/one-d-agent';
import { TwoDAgent } from '../challenges/two-d-agent';
import { TicTacToe } from '../challenges/tic-tac-toe';
import { LinearRegression } from '../challenges/linear-regression';
import { LinearClassification } from '../challenges/logistic-regression';

export const challenges = [
  {
    name: 'linear-regression',
    title: 'Linear Regression',
    description:
      'Train the agent to predict the price of a house based on its size.',
    component: LinearRegression,
    creationDate: '06-05-2026',
    tags: ['supervised', 'regression'],
  },
  {
    name: 'linear-classification',
    title: 'Linear Classification',
    description:
      'Predict loan approval based on credit score and monthly salary using Logistic Regression.',
    component: LinearClassification,
    creationDate: '06-05-2026',
    tags: ['supervised', 'classification'],
  },
  {
    name: '1d-agent',
    title: '1D Agent',
    description:
      'A one-dimensional reinforcement learning challenge where an agent learns to find an exit.',
    component: OneDAgent,
    creationDate: '01-05-2026',
    tags: ['unsupervised', 'reinforcement'],
  },
  {
    name: '2d-agent',
    title: '2D Agent',
    description:
      'A two-dimensional grid-based reinforcement learning challenge with customizable obstacles and rewards.',
    component: TwoDAgent,
    creationDate: '02-05-2026',
    tags: ['unsupervised', 'reinforcement'],
  },
  {
    name: 'tic-tac-toe',
    title: 'Tic-Tac-Toe',
    description:
      'A Q-learning agent trained against a random opponent. Train the agent, then play against it as O.',
    component: TicTacToe,
    creationDate: '03-05-2026',
    tags: ['supervised', 'reinforcement'],
  },
];
