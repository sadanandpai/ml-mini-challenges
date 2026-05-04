import type { Board } from './types';
import { gameConfig } from '../config';
import {
  applyMove,
  checkWinner,
  getEmptyCellsList,
  getRandomMove,
} from './utils';

/*
This is an opponent which either plays random move or plays a winning move or plays a blocking move or plays a random move based on the randomness parameter.
Randomness is the probability of playing a random move. This dummy agent is used to train the main agent.
A completely random opponent is not a good opponent because it does not learn from its mistakes. So we have added some small "intelligence" to it.
*/
export function getOpponentMove(
  board: Board,
  randomness = 0.75,
): [number, number] {
  const randomMoveProbability = Math.random() < randomness;

  // a random move
  if (randomMoveProbability) {
    const randomMove = getRandomMove(board);
    return [
      Math.floor(randomMove / gameConfig.stateCols),
      randomMove % gameConfig.stateCols,
    ];
  }

  // a winning move
  for (const cellIdx of getEmptyCellsList(board)) {
    const row = Math.floor(cellIdx / gameConfig.stateCols);
    const col = cellIdx % gameConfig.stateCols;
    const nextBoard = applyMove(board, [row, col], 'X');
    if (checkWinner(nextBoard) === 'X') {
      return [
        Math.floor(cellIdx / gameConfig.stateCols),
        cellIdx % gameConfig.stateCols,
      ];
    }
  }

  // a blocking move
  for (const cellIdx of getEmptyCellsList(board)) {
    const row = Math.floor(cellIdx / gameConfig.stateCols);
    const col = cellIdx % gameConfig.stateCols;
    const nextBoard = applyMove(board, [row, col], 'O');
    if (checkWinner(nextBoard) === 'O') {
      return [
        Math.floor(cellIdx / gameConfig.stateCols),
        cellIdx % gameConfig.stateCols,
      ];
    }
  }

  // a random move
  const randomMove = getRandomMove(board);
  return [
    Math.floor(randomMove / gameConfig.stateCols),
    randomMove % gameConfig.stateCols,
  ];
}
