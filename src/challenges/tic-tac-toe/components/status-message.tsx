import type { GamePhase, Mark } from '../helpers/types';

interface Props {
  phase: GamePhase;
  outcome: Mark;
}

export function StatusMessage({ phase, outcome }: Props) {
  return (
    <p className="text-sm min-h-5 font-medium">
      {phase === 'training' && 'Training agent…'}
      {phase === 'playing' && outcome === null && 'Your turn — click a cell'}
      {outcome === 'O' && '🎉 Agent wins!'}
      {outcome === 'X' && '😅 You win!'}
      {outcome === '-' && "🤝 It's a draw!"}
    </p>
  );
}
