import type { FC } from 'react';

type ProgressProps = {
  progress?: number;
  total?: number;
  color?: string;
  bgColor?: string;
};

const Progress: FC<ProgressProps> = ({
  progress = 0,
  total = 5,
  color,
  bgColor,
}) => {
  
  return (
    
    <div className="flex gap-1.5 p-2">
      {[...Array(total)].map((_, index) => (
        <div
          key={index}
          className={`w-2 h-2 rounded transition-all`}
          style={{
            backgroundColor:
              index < progress
                ? color || 'rgba(1,1,1,1)'
                : bgColor || 'rgba(1,1,1,0.1)',
          }}
        />
      ))}
    </div>
  );
};

export default Progress;