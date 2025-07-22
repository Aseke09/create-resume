import type { FC } from 'react';

type StepProgressProps = {
  progress: number;
};

const StepProgress: FC<StepProgressProps> = ({ progress }) => {
  return (
    <div className="w-full bg-purple-50 h-1 overflow-hidden rounded-[2px]">
      <div
        className="h-1 bg-gradient-to-r from-purple-500/85 to-purple-700 transition-all rounded"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

export default StepProgress;