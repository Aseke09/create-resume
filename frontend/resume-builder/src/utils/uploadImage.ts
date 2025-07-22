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
    console.log('FormData entries:', [...formData.entries()]);

    if (auth) {
      if (!resumeId) throw new Error('resumeId is required for authenticated upload');

      const response = await axiosInstance.post(API_PATHS.RESUME.UPLOAD_IMAGES(resumeId),
        formData,
      );
      const imageId = response.data?.profileImageId || response.data?.imageId;
      console.log('uploadImage response.data:', response);
      console.log(resumeId)
      console.log('Sending request to:', API_PATHS.RESUME.UPLOAD_IMAGES(resumeId));
      console.log('Axios headers:', axiosInstance.defaults.headers);
      return  { imageId };
    } else {
      const response = await axiosPublic.post(API_PATHS.IMAGE.UPLOAD_IMAGE, formData,
    )
      const imageId = response.data?.profileImageId || response.data?.imageId;
      console.log('uploadImage response.data:', response.data);
      console.log('API Endpoint:', API_PATHS.IMAGE.UPLOAD_IMAGE);
      return { imageId };
    }
    
  } catch (err) {
    console.error("Image upload failed:", err);
    throw err
  }
};

export default uploadImage;
