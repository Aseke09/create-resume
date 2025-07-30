import { useRef, type FC, type ChangeEvent, useState, useEffect } from 'react'
import { LuUser, LuUpload, LuTrash } from 'react-icons/lu';
import { BASE_URL } from '../../utils/apiPaths';
import uploadImage from '../../utils/uploadImage';

interface Props {
  imageId: string | null;
  setImageId: (id: string | null) => void;
  auth?: boolean;
  resumeId?: string;
}

const ProfilePhotoSelector: FC<Props> = ({ imageId, setImageId, auth = false, resumeId }) => {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

     useEffect(() => {
      return () => {
        if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        }
    }
  }, [previewUrl]);

    const handleImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if(!file) return

        const localPreview = URL.createObjectURL(file);
        setPreviewUrl(localPreview);

        try {
          const { imageId } = await uploadImage({ file, auth, resumeId });
          
          if(imageId) {
            setImageId?.(imageId);
            setTimeout(() => {
              setPreviewUrl(null)
            }, 0)
          }
        } catch (error) {
          console.error('Image upload failed:', error)
        }
        
      };

    const handleRemoveImage = () => {
        setImageId(null)
    };

    const onChooseFile = () => {
        inputRef.current?.click()
    };

    const hasPhoto = !!previewUrl || !!imageId;
    const imageSrc = previewUrl
  ? previewUrl
  : imageId
    ? `${BASE_URL}/files/image/${imageId}`
    : undefined;
  return (
    <div className='flex justify-center mb-6'>
      <input
        type='file'
        accept='image'
        ref={inputRef}
        onChange={handleImageChange}
        className='hidden'
      />

      {!hasPhoto ? (
        <div className='w-20 h-20 flex items-center justify-center bg-purple-50 rounded-full relative cursor-pointer'>
            <LuUser className='text-4xl text-purple-500'/>

            <button
              type='button'
              className='w-8 h-8 flex items-center justify-center bg-linear-to-r from-purple-500/85 to-purple-700 text-white rounded-full absolute -bottom-1 -right-1 cursor-pointer'
              onClick={onChooseFile}
            >
                <LuUpload/>
            </button>
        </div>
      ) : (
        <div className='relative'>
          <img
            src={imageSrc}
            alt='profile photo'
            className='w-20 h-20 rounded-full object-cover'
            crossOrigin="anonymous"
          />
          <button
            type='button'
            className='w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded-full absolute -bottom-1 -right-1 cursor-pointer'
            onClick={handleRemoveImage}
          >
            <LuTrash/>
          </button>
        </div>
      )}
    </div>
  )
}

export default ProfilePhotoSelector

