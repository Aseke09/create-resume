import type { FC } from 'react';

interface RatingInputProps {
  value?: number; 
  total?: number; 
  onChange?: (value: number) => void;
  activeColor?: string;
  inActiveColor?: string;
}

const RatingInput: FC<RatingInputProps> = ({
  value = 0,
  total = 5,
  onChange = () => {},
  activeColor = '#9125E6',
  inActiveColor = '#E9D4FF',
}) => {
  const displayValue = Math.round((value / 100) * total);

  const handleClick = (index: number) => {
    const newValue = Math.round(((index + 1) / total) * 100);
    onChange(newValue);
  };

  return (
    <div className='flex gap-3 cursor-pointer'>
      {[...Array(total)].map((_, index) => {
        const isActive = index < displayValue;

        return (
          <div
            key={index}
            onClick={() => handleClick(index)}
            className='w-4 h-4 rounded transition-all'
            style={{
              backgroundColor: isActive ? activeColor : inActiveColor,
            }}
          />
        );
      })}
    </div>
  );
};

export default RatingInput;