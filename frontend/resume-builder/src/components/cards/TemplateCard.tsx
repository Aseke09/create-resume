import type { FC } from 'react';

type TemplateCardProps = {
  thumbnailImg?: string;
  isSelected: boolean;
  onSelect: () => void;
};

const TemplateCard: FC<TemplateCardProps> = ({
  thumbnailImg,
  isSelected,
  onSelect,
}) => {
  return (
    <div
      className={`h-auto md:h-[300px] flex flex-col items-center justify-between bg-white rounded-lg border-gray-200 hover:border-purple-300 overflow-hidden cursor-pointer 
        ${isSelected ? 'border-purple-500 border-2' : ''}`}
      onClick={onSelect}
    >
      {thumbnailImg ? (
        <img src={thumbnailImg} alt="Template thumbnail" className="w-[100%] rounded" />
      ) : (
        <div />
      )}
    </div>
  );
};

export default TemplateCard;