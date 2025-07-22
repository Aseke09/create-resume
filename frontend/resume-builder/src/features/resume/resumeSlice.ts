import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { defaultResumeData, type ResumeData as ResumeDraft } from "../../types/resume";
import type { LocalizedString } from '../../utils/localization';
import { 
    deleteResume, 
    fetchResumeById, 
    fetchResumes, 
    updateResumeDetails, 
    uploadResumeImages, 
} from './helpers';
import type { ResumeSummary } from '../../pages/home/types';
import type { RootState } from '../../store/store';

interface ResumeState {
  data: ResumeDraft;
  list: ResumeSummary[];
  loading: boolean;
  error: string | null;
}

const initialState: ResumeState = {
  data: defaultResumeData as ResumeDraft,
  list: [],
  loading: false,
  error: null,
}

const resumeSlice = createSlice({
  name: "resume",
  initialState,
  reducers: {
   
    setTitle(state, a: PayloadAction<LocalizedString>){
        state.data.title = a.payload
    },
    setThumbnail(state, a: PayloadAction<string>) {
        state.data.thumbnailLink = a.payload;
    },

    // Update object sections
    updateProfileInfo(state, a: PayloadAction<Partial<ResumeDraft['profileInfo']>>) {
        Object.assign(state.data.profileInfo, a.payload)
    },
    updateContactInfo(state, a: PayloadAction<Partial<ResumeDraft["contactInfo"]>>) {
      Object.assign(state.data.contactInfo, a.payload);
    },
    setTemplate(state, a: PayloadAction<ResumeDraft["template"]>) {
      state.data.template = a.payload;
    },
    
    /* ------------- localized sub‑field helper --------------- */
    patchLocalized(
      state, 
      a: PayloadAction<{ section: "profileInfo" | "contactInfo"; 
      field: string; 
      locale: keyof LocalizedString; 
      value: string }>) {
      const { section, field, locale, value } = a.payload;

      if (section === 'profileInfo') {
        const info = state.data.profileInfo;

        if (field === 'fullName' || field === 'designation' || field === 'summary') {
          (info[field] as LocalizedString)[locale] = value;
        }
      } else if (section === 'contactInfo') {
        const contact = state.data.contactInfo;

        if (field === 'location') {
          (contact.location as LocalizedString)[locale] = value;
        }
      }
    },

    /* ---------------- array helpers (generic) --------------- */
    addWorkExperience(state, a: PayloadAction<ResumeDraft["workExperience"][number]>) {
      state.data.workExperience.push(a.payload);
    },
    updateWorkExperience(state, a: PayloadAction<{ index: number; item: Partial<ResumeDraft["workExperience"][number]> }>) {
      Object.assign(state.data.workExperience[a.payload.index], a.payload.item);
    },
    removeWorkExperience(state, a: PayloadAction<number>) {
      state.data.workExperience.splice(a.payload, 1);
    },

    // Education
    addEducation(state, a: PayloadAction<ResumeDraft["education"][number]>) {
      state.data.education.push(a.payload);
    },
    updateEducation(state, a: PayloadAction<{ index: number; item: Partial<ResumeDraft["education"][number]> }>) {
      Object.assign(state.data.education[a.payload.index], a.payload.item);
    },
    removeEducation(state, a: PayloadAction<number>) {
      state.data.education.splice(a.payload, 1);
    },
    
    // Skills
    addSkills(state, a: PayloadAction<ResumeDraft["skills"][number]>) {
      state.data.skills.push(a.payload);
    },
    updateSkills(state, a: PayloadAction<{ index: number; item: Partial<ResumeDraft["skills"][number]> }>) {
      Object.assign(state.data.skills[a.payload.index], a.payload.item);
    },
    removeSkills(state, a: PayloadAction<number>) {
      state.data.skills.splice(a.payload, 1);
    },

    // Projects
    addProjects(state, a: PayloadAction<ResumeDraft["projects"][number]>) {
      state.data.projects.push(a.payload);
    },
    updateProjects(state, a: PayloadAction<{ index: number; item: Partial<ResumeDraft["projects"][number]> }>) {
      Object.assign(state.data.projects[a.payload.index], a.payload.item);
    },
    removeProjects(state, a: PayloadAction<number>) {
      state.data.projects.splice(a.payload, 1);
    },

    // Certifications
     addCertifications(state, a: PayloadAction<ResumeDraft["certifications"][number]>) {
      state.data.certifications.push(a.payload);
    },
    updateCertifications(state, a: PayloadAction<{ index: number; item: Partial<ResumeDraft["certifications"][number]> }>) {
      Object.assign(state.data.certifications[a.payload.index], a.payload.item);
    },
    removeCertifications(state, a: PayloadAction<number>) {
      state.data.certifications.splice(a.payload, 1);
    },

    // Languages
    addLanguages(state, a: PayloadAction<ResumeDraft["languages"][number]>) {
      state.data.languages.push(a.payload);
    },
    updateLanguages(state, a: PayloadAction<{ index: number; item: Partial<ResumeDraft["languages"][number]> }>) {
      Object.assign(state.data.languages[a.payload.index], a.payload.item);
    },
    removeLanguages(state, a: PayloadAction<number>) {
      state.data.languages.splice(a.payload, 1);
    },

    // Interests
    addInterests(state, a: PayloadAction<ResumeDraft["interests"][number]>) {
      state.data.interests.push(a.payload);
    },
    updateInterests(state, a: PayloadAction<{ index: number; item: Partial<ResumeDraft["interests"][number]> }>) {
      Object.assign(state.data.interests[a.payload.index], a.payload.item);
    },
    removeInterests(state, a: PayloadAction<number>) {
      state.data.interests.splice(a.payload, 1);
    },
    resetDraft(state) {
      state.data = defaultResumeData;
    },

    updateTemplate(state, action: PayloadAction<{ theme: string; colorPalette: string[] }>) {
      state.data.template = action.payload;
    }
  },

  extraReducers: (builder) => {
    /* async helpers for loading / error state */
    const pending = (s: ResumeState) => {
      s.loading = true;
      s.error = null;
    };
    const rejected = (s: ResumeState, a: any) => {
      s.loading = false;
      s.error = a.payload ?? a.error?.message ?? "Unknown error";
    };
    const fulfilled = (s: ResumeState) => {
      s.loading = false;
    };

    builder
      // fetch all
      .addCase(fetchResumes.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(fetchResumes.fulfilled, (s, a) => {
        s.loading = false;
        s.list = a.payload;
      })
      .addCase(fetchResumes.rejected,  rejected)

      // fetch by id
      .addCase(fetchResumeById.pending, pending)
      .addCase(fetchResumeById.fulfilled, (s, a) => {
        s.loading = false;
        s.data = {
          ...a.payload,
          profileInfo: {
            ...a.payload.profileInfo,
            profileImg: s.data.profileInfo?.profileImg ?? null,
          }
        };
      })
      .addCase(fetchResumeById.rejected, rejected)

      // update
      .addCase(updateResumeDetails.pending, pending)
      .addCase(updateResumeDetails.fulfilled, fulfilled)
      .addCase(updateResumeDetails.rejected, rejected)

      // upload
      .addCase(uploadResumeImages.pending, pending)
      .addCase(uploadResumeImages.fulfilled, fulfilled)
      .addCase(uploadResumeImages.rejected, rejected)

      // delete
      .addCase(deleteResume.pending, pending)
      .addCase(deleteResume.fulfilled, fulfilled)
      .addCase(deleteResume.rejected, rejected);
  },
});

export const {
  setTitle,
  setThumbnail,
  updateProfileInfo,
  updateContactInfo,
  setTemplate,
  patchLocalized,
  addWorkExperience,
  updateWorkExperience,
  removeWorkExperience,
  addEducation,
  updateEducation,
  removeEducation,
  addProjects,
  updateProjects,
  removeProjects,
  addSkills,
  updateSkills,
  removeSkills,
  addCertifications,
  updateCertifications,
  removeCertifications,
  addInterests,
  updateInterests,
  removeInterests,
  addLanguages,
  updateLanguages,
  removeLanguages,
  updateTemplate,
  resetDraft,
} = resumeSlice.actions;

export default resumeSlice.reducer;
export const selectResumes = (state: RootState) => state.resume.list;
export const selectResStatus = (state: RootState) => ({
  loading: state.resume.loading,
  error: state.resume.error,
});
export const selectResumeById = (state: RootState, id: string) =>
  state.resume.list.find(r => r._id === id);
export const selectResumeLoading = (s: RootState) => s.resume.loading;
export const selectResumeError   = (s: RootState) => s.resume.error;

//     theme: string;
//     colorPalette: string[];
// }

// interface ResumeState {
//     selectedTheme: ResumeTheme;
// }
// const initialState: ResumeState = {
//     selectedTheme: {
//         theme: '',
//         colorPalette: [],
//     },
// };

// const resumeSlice = createSlice({
//     name: 'resume',
//     initialState,
//     reducers: {
//     setSelectedTheme: (state, action: PayloadAction<ResumeTheme>) => {
//       state.selectedTheme = action.payload;
//     },
//     },
// });

// export const { setSelectedTheme } = resumeSlice.actions;
// export default resumeSlice.reducer;