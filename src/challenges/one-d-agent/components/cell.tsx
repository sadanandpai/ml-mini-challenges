interface Props {
  onClick: (cellPosition: number) => void;
  cellPosition: number;
  agentPosition: number | null;
  rewardPosition: number | null;
  wallPositions: number[];
}

export function Cell({
  onClick,
  cellPosition,
  agentPosition,
  rewardPosition,
  wallPositions,
}: Props) {
  const classes = ['cell'];
  if (wallPositions.includes(cellPosition)) {
    classes.push('wall');
  }

  if (rewardPosition === cellPosition) {
    classes.push('reward');
  }
  if (agentPosition === cellPosition) {
    classes.push('agent');
  }
  const className = classes.join(' ');

  return (
    <button
      className={className}
      onClick={() => onClick(cellPosition)}
      disabled={classes.includes('wall')}
    ></button>
  );
}
