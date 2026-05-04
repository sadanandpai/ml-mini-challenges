// Each cell: '-' = empty, 'O' = agent, 'X' = opponent
export type Mark = '-' | 'O' | 'X';

// 3×3 grid
export type Board = Mark[][];

// A board position as [row, col]
export type Cell = [number, number];

// UI phase
export type GamePhase = 'idle' | 'training' | 'playing';
