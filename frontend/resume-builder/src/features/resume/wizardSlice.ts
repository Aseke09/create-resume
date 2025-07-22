import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../store/store';
// import type { LocalizedString } from '../../utils/localization';
import { isLocalizedStringFilled } from '../../utils/helper';
import type { PageKey } from '../../types/resumeFormTypes';

const pages: PageKey[] = [
  'profile-info',
  'contact-info',
  'work-experience',
  'education-info',
  'skills',
  'projects',
  'certifications',
  'additionalInfo',
];

interface WizardState {
  currentPage: PageKey;
  progress: number;          
  errorMsg: string;
  previewOpen: boolean;
  themeSelectorOpen: boolean;
  isLoading: boolean;
}

const initialState: WizardState = {
  currentPage: 'profile-info',
  progress: 0,
  errorMsg: '',
  previewOpen: false,
  themeSelectorOpen: false,
  isLoading: false,
};


export const validateAndNext = createAsyncThunk<
  void,
  void,
  { state: RootState }
>('wizard/validateAndNext', async (_, { getState, dispatch }) => {
  const state = getState();
  const draft = state.resume.data       
  const  page  = state.wizard.currentPage;
  

  const errors: string[] = [];

  const isEmpty       = (v: string) => !v.trim();
  const isInvalidMail = (e: string) => !/^\S+@\S+\.\S+$/.test(e);

  switch (page) {
    case 'profile-info': {
      const { fullName, designation, summary } = draft.profileInfo;
      if (!isLocalizedStringFilled(fullName))      errors.push('Full Name is required');
      if (!isLocalizedStringFilled(designation))   errors.push('Designation is required');
      if (!isLocalizedStringFilled(summary))       errors.push('Summary is required');
      break;
    }

    case 'contact-info': {
      const { email, phone } = draft.contactInfo;
      if (isEmpty(email) || isInvalidMail(email))  errors.push('Valid email is required');
      if (isEmpty(phone))                          errors.push('Phone number is required');
      break;
    }

    case 'work-experience':
      draft.workExperience.forEach(({ company, role, startDate, endDate }, i) => {
        if (!isLocalizedStringFilled(company))  errors.push(`Company required in experience ${i+1}`);
        if (!isLocalizedStringFilled(role))     errors.push(`Role required in experience ${i+1}`);
        if (!startDate || !endDate)             errors.push(`Dates required in experience ${i+1}`);
      });
      break;

    case 'education-info':
      draft.education.forEach(({ degree, institution, startDate, endDate }, i) => {
        if (!isLocalizedStringFilled(degree))       errors.push(`Degree required in education ${i+1}`);
        if (!isLocalizedStringFilled(institution))  errors.push(`Institution required in education ${i+1}`);
        if (!startDate || !endDate)                 errors.push(`Dates required in education ${i+1}`);
      });
      break;

    case 'skills':
      draft.skills.forEach(({ name, progress }, i) => {
        if (!isLocalizedStringFilled(name)) errors.push(`Skill name required ${i+1}`);
        if (progress < 1 || progress > 100) errors.push(`Skill progress 1‑100 ${i+1}`);
      });
      break;

    case 'projects':
      draft.projects.forEach(({ title, description }, i) => {
        const titleFilled = isLocalizedStringFilled(title);
        const descFilled = isLocalizedStringFilled(description);

        if (titleFilled || descFilled) {
        if (!isLocalizedStringFilled(title))       errors.push(`Project title required ${i+1}`);
        if (!isLocalizedStringFilled(description)) errors.push(`Project description required ${i+1}`);
        }
      });
      break;

    case 'certifications':
      draft.certifications.forEach(({ title, issuer }, i) => {
        const titleFilled = isLocalizedStringFilled(title);
        const issuerFilled = isLocalizedStringFilled(issuer);

        if (titleFilled || issuerFilled) {
        if (!isLocalizedStringFilled(title))  errors.push(`Certification title required ${i+1}`);
        if (!isLocalizedStringFilled(issuer)) errors.push(`Issuer required ${i+1}`);
        }
      });
      break;

    case 'additionalInfo':
      if (
        draft.languages.length === 0 ||
        !isLocalizedStringFilled(draft.languages[0].name)
      ) errors.push('At least one language is required');

      if (
        draft.interests.length === 0 ||
        !isLocalizedStringFilled(draft.interests[0].name)
      ) errors.push('At least one interest is required');
      break;
  }

  if (errors.length) {
    dispatch(setErrorMsg(errors.join(', ')));
    return;
  }

  dispatch(setErrorMsg(''));         
  dispatch(goToNextStep());
});

/* ------------------------------------------------------------------ */
/*  Slice                                                              */
/* ------------------------------------------------------------------ */
const wizardSlice = createSlice({
  name: 'wizard',
  initialState,
  reducers: {
    openThemeSelector(state)  { state.themeSelectorOpen = true;  },
    closeThemeSelector(state) { state.themeSelectorOpen = false; },

    openPreview(state)        { state.previewOpen = true;  },
    closePreview(state)       { state.previewOpen = false; },

    setLoading(state, a: PayloadAction<boolean>) { state.isLoading = a.payload; },
    setErrorMsg(state, a: PayloadAction<string>) {
      state.errorMsg = a.payload;
    },

    goToNextStep(state) {
      if (state.currentPage === 'additionalInfo') {
        state.previewOpen = true;
        return;
      }

      const idx = pages.indexOf(state.currentPage);
      if (idx >= 0 && idx < pages.length - 1) {
        state.currentPage = pages[idx + 1];
        state.progress = Math.round(((idx + 1) / (pages.length - 1)) * 100);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },

    goBack(state) {
      const idx = pages.indexOf(state.currentPage);
      if (idx > 0) {
        state.currentPage = pages[idx - 1];
        state.progress = Math.round(((idx - 1) / (pages.length - 1)) * 100);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(validateAndNext.rejected, (s, a) => {
      s.errorMsg = typeof a.payload === 'string' ? a.payload : 'Validation failed';
    });
  },
});

export const { 
    openThemeSelector,
    closeThemeSelector,
    openPreview,
    closePreview,
    setLoading,
    setErrorMsg, 
    goToNextStep, 
    goBack } = wizardSlice.actions;
export default wizardSlice.reducer;

/* -------------------------- selectors ----------------------------- */
export const selectWizard        = (s: RootState) => s.wizard;
export const selectCurrentPage   = (s: RootState) => s.wizard.currentPage;
export const selectWizardError   = (s: RootState) => s.wizard.errorMsg;
export const selectProgress      = (s: RootState) => s.wizard.progress;
export const selectThemeOpen     = (s: RootState) => s.wizard.themeSelectorOpen;
export const selectPreviewOpen   = (s: RootState) => s.wizard.previewOpen;
export const selectLoading       = (s: RootState) => s.wizard.isLoading;