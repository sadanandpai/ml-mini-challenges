import type { GamePhase } from '../helpers/types';

interface Props {
  phase: GamePhase;
  isAgentFirst: boolean;
  onToggleAgentFirst: (val: boolean) => void;
  onTrain: () => void;
  onPlay: () => void;
  onResetBoard: () => void;
  onResetEnv: () => void;
}

export function Controls({
  phase,
  isAgentFirst,
  onToggleAgentFirst,
  onTrain,
  onPlay,
  onResetBoard,
  onResetEnv,
}: Props) {
  const busy = phase === 'training';

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Player Selection */}
      <div className="flex gap-4 items-center mb-2">
        <label className="flex items-center gap-2 cursor-pointer text-sm">
          <input
            type="radio"
            name="firstPlayer"
            checked={!isAgentFirst}
            onChange={() => onToggleAgentFirst(false)}
            disabled={busy || phase === 'playing'}
          />
          You Play First
        </label>
        <label className="flex items-center gap-2 cursor-pointer text-sm">
          <input
            type="radio"
            name="firstPlayer"
            checked={isAgentFirst}
            onChange={() => onToggleAgentFirst(true)}
            disabled={busy || phase === 'playing'}
          />
          Agent Plays First
        </label>
      </div>

      {/* Buttons */}
      <div className="flex gap-2 flex-wrap justify-center">
        <button className="btn btn-outline" onClick={onTrain} disabled={busy}>
          Train Agent
        </button>

        <button className="btn btn-outline" onClick={onPlay} disabled={busy}>
          Play vs Agent
        </button>

        <button
          className="btn btn-outline"
          onClick={onResetBoard}
          disabled={busy}
        >
          Reset Board
        </button>
        <button
          className="btn btn-outline text-red-600 hover:bg-red-50 hover:border-red-200"
          onClick={onResetEnv}
          disabled={busy}
        >
          Reset Env
        </button>
      </div>
    </div>
  );
}
