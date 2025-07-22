import type { FC } from 'react';

interface WorkExperienceProps {
  company: string;
  role: string;
  duration: string;
  durationColor: string;
  description: string;
}

const WorkExperience: FC<WorkExperienceProps> = ({
  company,
  role,
  duration,
  durationColor,
  description,
}) => {
  return (
    <div className='mb-5'>
      <div className='flex items-center justify-between'>
        <div>
          <h3 className='text-[15px] font-semibold text-gray-900'>
            {company}
          </h3>

          <p className='text-[15px] text-gray-700 font-medium'>{role}</p>
        </div>
        <p className='text-xs font-bold italic' style={{ color: durationColor }}>
          {duration}
        </p>
      </div>

      <p className='text-sm text-gray-600 font-medium italic mt-[0.2cqw] whitespace-pre-line'>
        {description}
      </p>
    </div>
  );
};

export default WorkExperience;