import { createAsyncThunk } from "@reduxjs/toolkit";
import { defaultResumeData, type ResumeData as ResumeDraft } from "../../types/resume";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { isAxiosError } from "axios";
import toast from "react-hot-toast";
import { captureElementAsImage, dataURLtoFile, fixTailwindColors, sanitizeFilename } from "../../utils/helper";
import type { RefObject } from "react";
import type { RootState } from "../../store/store";
import type { ResumeSummary } from "../../pages/home/types";

export const dtoToDraft = (dto: Partial<ResumeDraft>): ResumeDraft => ({
  ...defaultResumeData,
  ...dto,

  template: {
    ...defaultResumeData.template,
    ...(dto.template ?? {}),
  },

  profileInfo: {
    ...defaultResumeData.profileInfo,
    ...(dto.profileInfo ?? {}),
    profileImg: null,
  },
});

// Fetch all resumes
export const fetchResumes = createAsyncThunk<ResumeSummary[], void, { rejectValue: string }>(
  'resumes/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(API_PATHS.RESUME.GET_ALL);
      
      return data as ResumeSummary[]
    } catch (err: unknown) {
      console.error("fetchResumes error:", err);
      const message = 
        isAxiosError(err) && err.response?.data?.message 
           ? err.response.data.message
           : "Failed to load resumes";
      return rejectWithValue(message);
    }
  }
);

// 1️⃣ Fetch resume by ID
export const fetchResumeById = createAsyncThunk<
ResumeDraft,  string, { rejectValue: string }>(
  "resume/fetchById",
  async (resumeId, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(API_PATHS.RESUME.GET_BY_ID(resumeId));
      return dtoToDraft(data);
    } catch (err: unknown) {
      const message = 
        isAxiosError(err) && err.response?.data?.message 
           ? err.response.data.message
           : "Failed to load resume";
      return rejectWithValue(message);
    }
  }
);

// 2️⃣ Put JSON (resume without files)
export const updateResumeDetails = createAsyncThunk<
  void,
  {
    resumeId: string;
    resumeData: ResumeDraft;
    thumbnailLink?: string;
    profilePreviewUrl?: string;
  },
  { rejectValue: string }
>("resume/update", async (args, { rejectWithValue }) => {
  try {
    const { resumeId, resumeData, thumbnailLink = "", profilePreviewUrl = "" } = args;
    
    await axiosInstance.put(API_PATHS.RESUME.UPDATE(resumeId), {
      ...resumeData,
      ...(thumbnailLink && { thumbnailLink }),
      profileInfo: {
        ...resumeData.profileInfo,
        ...(profilePreviewUrl && { profilePreviewUrl }),
      },
    });
  } catch (err: unknown) {
    const message = 
        isAxiosError(err) && err.response?.data?.message 
           ? err.response.data.message
           : "Failed to update resume";
      return rejectWithValue(message);
  }
});

// 3️⃣ Capture DOM, upload images, then reuse thunk 2
export const uploadResumeImages = createAsyncThunk<
  void,
  { resumeId: string; 
    resumeRef: RefObject<HTMLDivElement>; 
    profileImageId?: string | null 
    resumeData?: ResumeDraft
  },
    
  { state: RootState; rejectValue: string }
>("resume/uploadImages", 
  async ({ resumeId, resumeRef }, 
    { getState, rejectWithValue, dispatch }) => {
  try {
    const state = getState().resume.data; 
    
    // capture screenshot
    if (!resumeRef.current) throw new Error('Resume preview element not found');

    fixTailwindColors(resumeRef.current!);
    const dataUrl = await captureElementAsImage(resumeRef.current);
    
    const file = dataURLtoFile(dataUrl, 'thumb.png');
    console.log('file:', file);

    const thumbBlob = await (await fetch(dataUrl)).blob();
     if (thumbBlob.size === 0) throw new Error("Thumbnail blob is empty");

    const mimeType = thumbBlob.type; // e.g. 'image/jpeg'
    const extension = mimeType.split('/')[1] || 'png';
    const thumbnailFile = sanitizeFilename(`resume-${resumeId}.${extension}`);
    const thumbnail = new File(
      [thumbBlob], 
      thumbnailFile, 
      { type: mimeType });

    const form = new FormData();
    form.append("thumbnail", thumbnail);

    const profileImageId = state.profileInfo.profilePreviewUrl;
    if (profileImageId) {
      form.append('profileImageId', profileImageId)
    }

    const { data } = await axiosInstance.post(
      API_PATHS.RESUME.UPLOAD_IMAGES(resumeId), 
      form
    );
    
    const thumbnailId = data.thumbnailId as string;
    const updatedProfileImageId = data.profileImageId as string | undefined;

    await dispatch(
      updateResumeDetails({
        resumeId,
        resumeData: state,
        thumbnailLink: thumbnailId || '',
        profilePreviewUrl: updatedProfileImageId || '',
      })
    ).unwrap();
    
    toast.success("Resume updated successfully!");
  } catch (err: unknown) {
    toast.error("Image upload failed");
    const message = 
        isAxiosError(err) && err.response?.data?.message 
           ? err.response.data.message
           : "Failed to upload resume";
      return rejectWithValue(message);
  }
});

// 4️⃣ Delete resume
export const deleteResume = createAsyncThunk<
  void,
  { resumeId: string; navigate: (path: string) => void },
  { rejectValue: string }
>("resume/delete", async ({ resumeId, navigate }, { rejectWithValue }) => {
  try {
    await axiosInstance.delete(API_PATHS.RESUME.DELETE(resumeId));
    toast.success("Resume deleted successfully");
    navigate("/dashboard");
  } catch (err: unknown) {
   const message = isAxiosError(err) && err.response?.data?.message 
           ? err.response.data.message
           : "Failed to delete resume";
      return rejectWithValue(message);
  }
});

// Create resume
export const createResume = createAsyncThunk<
  string,
  void,                          
  { state: RootState; rejectValue: string }
>('resume/create', async (_, { getState, rejectWithValue }) => {
  try {
    const { title } = getState().resume.data;
    const { data } = await axiosInstance.post<{ _id: string }>(
      API_PATHS.RESUME.CREATE,
      { title }
    );
    return data._id;               
  } catch (err: unknown) {
    const message = isAxiosError(err) && err.response?.data?.message 
           ? err.response.data.message
           : "Failed to create resume";
      return rejectWithValue(message);
  }
});
