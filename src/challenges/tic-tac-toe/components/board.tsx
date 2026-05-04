import type { Board, Mark } from '../helpers/types';

interface Props {
  board: Board;
  onClick: (row: number, col: number) => void;
  disabled: boolean;
}

const MARK_LABEL: Record<Mark, string> = {
  '-': '',
  'O': 'O',
  'X': 'X',
};

export function Board({ board, onClick, disabled }: Props) {
  return (
    <div className="ttt-board">
      {board.map((row, r) =>
        row.map((mark, c) => (
          <button
            key={`${r}-${c}`}
            className={`ttt-cell ${mark === 'O' ? 'ttt-x' : mark === 'X' ? 'ttt-o' : ''}`}
            onClick={() => onClick(r, c)}
            disabled={disabled || mark !== '-'}
          >
            {MARK_LABEL[mark as Mark]}
          </button>
        )),
      )}
    </div>
  );
}
