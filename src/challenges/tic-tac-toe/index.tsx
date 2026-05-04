import { useState } from 'react';
import { TicTacToeAgent } from './helpers/tic-tac-toe-rl';
import {
  applyMove,
  checkWinner,
  getEmptyBoard,
  isTerminal,
  getReward,
} from './helpers/utils';
import type { Board, GamePhase, Mark } from './helpers/types';
import { Board as BoardComponent } from './components/board';
import { Controls } from './components/controls';
import { StatusMessage } from './components/status-message';
import { gameConfig } from './config';

import './styles.css';

export function TicTacToe() {
  const [agent] = useState(
    () => new TicTacToeAgent(gameConfig.stateRows, gameConfig.stateCols),
  );

  const [board, setBoard] = useState<Board>(getEmptyBoard);
  const [phase, setPhase] = useState<GamePhase>('idle');
  const [outcome, setOutcome] = useState<Mark>(null);
  const [isAgentFirst, setIsAgentFirst] = useState(false);

  const trainAgent = () => {
    setPhase('training');
    agent.train(isAgentFirst, getReward);
    setPhase('idle');
  };

  const startGame = () => {
    const emptyBoard = getEmptyBoard();
    setBoard(emptyBoard);
    setOutcome(null);
    setPhase('playing');

    if (isAgentFirst) {
      const [ar, ac] = agent.getAction(emptyBoard, 0);
      const current = applyMove(emptyBoard, [ar, ac], 'O');
      setBoard(current);
    }
  };

  const handleCellClick = (row: number, col: number) => {
    if (phase !== 'playing' || outcome !== null || board[row][col] !== '-') {
      return;
    }

    // Apply human move
    let current = applyMove(board, [row, col], 'X');

    if (isTerminal(current)) {
      setBoard(current);
      setOutcome(checkWinner(current));
      return;
    }

    // Agent's turn
    const [ar, ac] = agent.getAction(current, 0);
    current = applyMove(current, [ar, ac], 'O');
    setBoard(current);

    if (isTerminal(current)) {
      setOutcome(checkWinner(current));
    }
  };

  const resetBoard = () => {
    const fresh = getEmptyBoard();
    setBoard(fresh);
    setOutcome(null);
    setPhase('idle');
  };

  const resetEnv = () => {
    resetBoard();
    agent.reset();
  };

  return (
    <div className="challenge3 flex flex-col items-center gap-6 mt-4">
      <h1 className="text-3xl font-bold">Tic-Tac-Toe</h1>

      <Controls
        phase={phase}
        isAgentFirst={isAgentFirst}
        onToggleAgentFirst={setIsAgentFirst}
        onTrain={trainAgent}
        onPlay={startGame}
        onResetBoard={resetBoard}
        onResetEnv={resetEnv}
      />

      <BoardComponent
        board={board}
        onClick={handleCellClick}
        disabled={phase !== 'playing' || outcome !== null}
      />

      <StatusMessage phase={phase} outcome={outcome} />
      <p className="text-sm text-muted-foreground">
        Train the agent multiple times to see it becoming unbeatable.
      </p>
    </div>
  );
}
