import type { CellType } from '../types';

interface Props {
  onClick: (r: number, c: number) => void;
  r: number;
  c: number;
  cellType: CellType;
  isAgent: boolean;
}

export function Cell({ onClick, r, c, cellType, isAgent }: Props) {
  const classes = ['cell'];

  if (cellType === 'wall') {
    classes.push('wall');
  }
  if (cellType === 'reward') {
    classes.push('reward');
  }
  if (cellType === 'fire') {
    classes.push('fire');
  }
  if (isAgent) {
    classes.push('agent');
  }

  const className = classes.join(' ');

  return <button className={className} onClick={() => onClick(r, c)}></button>;
}
