import type { CellType } from '../helpers/types';

interface Props {
  onClick: (r: number, c: number) => void;
  r: number;
  c: number;
  cellType: CellType;
  isAgent: boolean;
  rewardPosition: [number, number] | null;
}

export function Cell({
  onClick,
  r,
  c,
  cellType,
  isAgent,
  rewardPosition,
}: Props) {
  const classes = ['cell'];

  if (cellType === 'wall') {
    classes.push('wall');
  }
  if (r === rewardPosition?.[0] && c === rewardPosition?.[1]) {
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
