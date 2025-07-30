import { API_PATHS } from './apiPaths';
import axiosInstance from './axiosInstance';
import axiosPublic from './axiosPublic';

interface UploadOptions {
  file: File;
  auth?: boolean;
  resumeId?: string;
}

const uploadImage = async ({ file, auth = false, resumeId }: UploadOptions): Promise<{ imageId: string }> => {
  if (!file || !(file instanceof File)) throw new Error('Invalid file')
  
  try {
    const formData = new FormData();
    formData.append('profileImage', file);

    if (auth) {
      const endpoint = resumeId 
        ? API_PATHS.RESUME.UPLOAD_IMAGES(resumeId)
        : API_PATHS.IMAGE.UPLOAD_IMAGE;

      const response = await axiosInstance.post(endpoint, formData);
    
      const imageId = response.data?.profileImageId || response.data?.imageId;
      
      return  { imageId };
    } else {
      const response = await axiosPublic.post(API_PATHS.IMAGE.UPLOAD_IMAGE, formData,
    )
      const imageId = response.data?.profileImageId || response.data?.imageId;
      
      return { imageId };
    }
    
  } catch (err) {
    console.error("Image upload failed:", err);
    throw err
  }
};

export default uploadImage;
