import type { Board } from './types';
import { config } from '../config';
import {
  applyMove,
  checkWinner,
  getEmptyCellsList,
  getRandomMove,
} from './utils';

export function getOpponentMove(
  board: Board,
  randomness = 0.75,
): [number, number] {
  const randomMoveProbability = Math.random() < randomness;

  // a random move
  if (randomMoveProbability) {
    const randomMove = getRandomMove(board);
    return [Math.floor(randomMove / config.stateCols), randomMove % config.stateCols];
  }

  // a winning move
  for (const cellIdx of getEmptyCellsList(board)) {
    const row = Math.floor(cellIdx / config.stateCols);
    const col = cellIdx % config.stateCols;
    const nextBoard = applyMove(board, [row, col], 'X');
    if (checkWinner(nextBoard) === 'X') {
      return [Math.floor(cellIdx / config.stateCols), cellIdx % config.stateCols];
    }
  }

  // a blocking move
  for (const cellIdx of getEmptyCellsList(board)) {
    const row = Math.floor(cellIdx / config.stateCols);
    const col = cellIdx % config.stateCols;
    const nextBoard = applyMove(board, [row, col], 'O');
    if (checkWinner(nextBoard) === 'O') {
      return [Math.floor(cellIdx / config.stateCols), cellIdx % config.stateCols];
    }
  }

  // a random move
  const randomMove = getRandomMove(board);
  return [Math.floor(randomMove / config.stateCols), randomMove % config.stateCols];
}
