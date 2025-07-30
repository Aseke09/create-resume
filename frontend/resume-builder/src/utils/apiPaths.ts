export const BASE_URL = import.meta.env.VITE_API_BASE_URL

export const API_PATHS = {
    AUTH: {
      REGISTER: "/api/auth/register", 
      LOGIN: "/api/auth/login",
      GET_PROFILE: "/api/auth/profile",
      UPDATE_PROFILE: "/api/auth/profile",
    },

    RESUME: {
        CREATE: "/api/resume",
        GET_ALL: "/api/resume",
        GET_BY_ID: (id: string) => `/api/resume/${id}`,
        UPDATE: (id: string) => `/api/resume/${id}`,
        DELETE: (id: string) => `/api/resume/${id}`,
        UPLOAD_IMAGES: (id: string) => `/api/resume/${id}/upload-images`,
    },

    IMAGE: {
        UPLOAD_IMAGE: "/api/auth/upload-image",
    },

    FILE: {
    GET_IMAGE_BY_ID: (id: string) => `/files/image/${id}`,
  },
};