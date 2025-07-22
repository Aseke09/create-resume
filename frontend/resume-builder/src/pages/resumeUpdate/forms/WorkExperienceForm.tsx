import { LuTrash2, LuPlus } from "react-icons/lu";
import Input from "../../../components/Inputs/Input";
import { useTranslation } from "react-i18next";
import {
  addWorkExperience,
  updateWorkExperience,
  removeWorkExperience,
} from '../../../features/resume/resumeSlice';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import type { FC } from "react";
import { normalizeLang } from './../../../utils/localization';

const WorkExperienceForm: FC = () => {
  const { t, i18n } = useTranslation('profileInfo');
  const lang = normalizeLang(i18n.language);

  const dispatch = useAppDispatch();
  const workExperience = useAppSelector((s) => s.resume.data.workExperience);

  const handleLocalizedChange = (
    index: number,
    key: 'company' | 'role' | 'description',
    value: string
  ) => {
    const existing = workExperience[index]?.[key] || {};
    dispatch(
      updateWorkExperience({
        index,
        item: { [key]: { ...existing, [lang]: value } },
      })
    );
  };

  const handleFieldChange = (
    index: number,
    key: 'startDate' | 'endDate',
    value: string
  ) => {
    dispatch(updateWorkExperience({ index, item: { [key]: value } }));
  };

  return (
    <div className="px-5 pt-5">
      <h2 className="text-lg font-semibold text-gray-900">
        {t("workExperience.title")}
      </h2>

      <div className="mt-4 flex flex-col gap-4 mb-3">
        {workExperience.map((experience, index) => (
          <div
            key={index}
            className="border border-gray-200/80 p-4 rounded-lg relative"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label={t("workExperience.company")}
                placeholder="ABC Corp"
                type="text"
                value={experience.company?.[lang] || ''}
                onChange={(e) =>
                  handleLocalizedChange(index, 'company', e.target.value)
                }
              />

              <Input
                label={t("workExperience.role")}
                placeholder="Frontend Developer, Java Developer"
                type="text"
                value={experience.role?.[lang] || ''}
                onChange={(e) => handleLocalizedChange(index, 'role', e.target.value)}
              />

              <Input
                label={t("workExperience.startDate")}
                type="month"
                placeholder="2023-06"
                value={experience.startDate || ''}
                onChange={({ target }) =>
                  handleFieldChange(index, 'startDate', target.value)
                }
              />
              <Input
                label={t("workExperience.endDate")}
                type="month"
                placeholder="2025-01"
                value={experience.endDate || ''}
                onChange={({ target }) =>
                  handleFieldChange(index, 'endDate', target.value)
                }
              />
            </div>

            <div className="mt-4">
              <label className="text-xs font-medium text-slate-600">
                {t("workExperience.description")}
              </label>
              <textarea
                placeholder={t("workExperience.descriptionPlaceholder")}
                className="form-input w-full mt-1"
                rows={3}
                value={experience.description?.[lang] || ''}
                onChange={(e) =>
                  handleLocalizedChange(index, 'description', e.target.value)
                }
              />
            </div>

            {workExperience.length > 1 && (
              <button
                type="button"
                className="absolute top-3 right-3 text-sm text-red-600 hover:underline cursor-pointer"
                onClick={() => dispatch(removeWorkExperience(index))}
              >
                <LuTrash2 />
              </button>
            )}
          </div>
        ))}

        <button
          type="button"
          className="self-start flex items-center gap-2 px-4 py-2 rounded bg-purple-100 text-purple-800 text-sm font-medium hover:bg-purple-200 cursor-pointer"
          onClick={() =>
            dispatch(
              addWorkExperience({
              company: { en: '', ru: '', kz: '' },
              role: { en: '', ru: '', kz: '' },
              startDate: '',
              endDate: '',
              description: { en: '', ru: '', kz: '' },
            })
          )
          }
        >
          <LuPlus /> {t("workExperience.add")}
        </button>
      </div>
    </div>
  );
};

export default WorkExperienceForm