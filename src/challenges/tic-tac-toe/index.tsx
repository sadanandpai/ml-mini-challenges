import { useState, useRef } from 'react';
import { config } from './config';
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

export function TicTacToe() {
  const [agent] = useState<TicTacToeAgent>(() => new TicTacToeAgent());

  const [board, setBoard] = useState<Board>(getEmptyBoard);
  const [phase, setPhase] = useState<GamePhase>('idle');
  const [outcome, setOutcome] = useState<Mark>(null);
  const [isAgentFirst, setIsAgentFirst] = useState(false);

  // Ref keeps a stable board snapshot for the async agent-move callback
  const boardRef = useRef<Board>(getEmptyBoard());

  // ── Training ──────────────────────────────────────────────────────────────

  const trainAgent = () => {
    setPhase('training');
    agent.train(isAgentFirst, getReward, config.episodes);
    setPhase('idle');
  };

  // ── Start a new game ──────────────────────────────────────────────────────

  const startGame = () => {
    const emptyBoard = getEmptyBoard();
    setBoard(emptyBoard);
    boardRef.current = emptyBoard;
    setOutcome(null);
    setPhase('playing');

    if (isAgentFirst) {
      const [ar, ac] = agent.getAction(emptyBoard, 0);
      const current = applyMove(emptyBoard, [ar, ac], 'O');
      setBoard(current);
      boardRef.current = current;
    }
  };

  // ── Human clicks a cell (Human = X = -1) ─────────────────────────────────

  const handleCellClick = async (row: number, col: number) => {
    if (
      phase !== 'playing' ||
      outcome !== null ||
      boardRef.current[row][col] !== '-'
    ) {
      return;
    }

    // Apply human move
    let current = applyMove(boardRef.current, [row, col], 'X');
    setBoard(current);
    boardRef.current = current;

    if (isTerminal(current)) {
      setOutcome(checkWinner(current));
      return;
    }

    // Agent's turn
    const [ar, ac] = agent.getAction(current, 0);
    current = applyMove(current, [ar, ac], 'O');
    setBoard(current);
    boardRef.current = current;

    if (isTerminal(current)) {
      setOutcome(checkWinner(current));
    }
  };

  // ── Reset ─────────────────────────────────────────────────────────────────

  const resetBoard = () => {
    const fresh = getEmptyBoard();
    setBoard(fresh);
    boardRef.current = fresh;
    setOutcome(null);
    setPhase('idle');
  };

  const resetEnv = () => {
    resetBoard();
    agent.reset();
  };

  return (
    <div className="flex flex-col items-center gap-6 mt-4">
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
    </div>
  );
}
