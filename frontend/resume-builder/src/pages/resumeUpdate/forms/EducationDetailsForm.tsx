import type { FC, ChangeEvent } from "react";
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { LuPlus, LuTrash2 } from "react-icons/lu";
import Input from "../../../components/Inputs/Input";
import { useTranslation } from "react-i18next";
import { getLocalizedString, normalizeLang } from "../../../utils/localization";
import {
  addEducation,
  removeEducation,
  updateEducation,
} from '../../../features/resume/resumeSlice';

const EducationDetailsForm: FC = () => {
  const { t, i18n } = useTranslation('profileInfo');
  const lang = normalizeLang(i18n.language);

  const dispatch = useAppDispatch();
  const educationInfo = useAppSelector((s) => s.resume.data.education);

  const handleLocalizedChange = (
    index: number,
    key: 'degree' | 'institution',
    value: string
  ) => {
    const existing = educationInfo[index]?.[key] || {};
    dispatch(
      updateEducation({
        index,
        item: {
          [key]: {
            ...existing,
            [lang]: value,
          },
        }
      })
    );
  };

  const handleFieldChange = (
    index: number,
    key: 'startDate' | 'endDate',
    value: string
  ) => {
    dispatch(updateEducation({ index, 
      item: {
        [key]: value,
    } }));
  };

  const handleAddItem = () => {
    dispatch(
      addEducation({
        degree: { en: '', ru: '', kz: '' },
        institution: { en: '', ru: '', kz: '' },
        startDate: '',
        endDate: '',
      })
    );
  };

  const handleRemoveItem = (index: number) => {
    dispatch(removeEducation(index));
  };

  return (
    <div className="px-5 pt-5">
      <h2 className="text-lg font-semibold text-gray-900">
        {t("education.title")}
      </h2>

      <div className="mt-4 flex flex-col gap-4 mb-3">
        {educationInfo.map((education, index) => (
          <div
            key={index}
            className="border border-gray-200/80 p-4 rounded-lg relative"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label={t("education.degree")}
                placeholder="B.Tech in Computer Science"
                type="text"
                value={getLocalizedString(education.degree, lang)}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  handleLocalizedChange(index, 'degree', e.target.value)
                }
              />

              <Input
                label={t("education.institution")}
                placeholder="XYZ University"
                type="text"
                value={getLocalizedString(education.institution, lang)}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  handleLocalizedChange(index, 'institution', e.target.value)
                }
              />

              <Input
                label={t("education.startDate")}
                placeholder="2020-09"
                type="month"
                value={education.startDate || ""}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  handleFieldChange(index, 'startDate', e.target.value)
                }
              />

              <Input
                label={t("education.endDate")}
                placeholder="2024-06"
                type="month"
                value={education.endDate || ""}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  handleFieldChange(index, 'endDate', e.target.value)
                }
              />
            </div>

            {educationInfo.length > 1 && (
              <button
                type="button"
                className="absolute top-3 right-3 text-sn text-red-600 hover:underline cursor-pointer"
                onClick={() => handleRemoveItem(index)}
              >
                <LuTrash2 />
              </button>
            )}
          </div>
        ))}

        <button
          type="button"
          className="self-start flex items-center gap-2 px-4 py-2 rounded bg-purple-100 text-purple-800 text-sm font-medium hover:bg-purple-200 cursor-pointer"
          onClick={handleAddItem}
        >
          <LuPlus /> {t("education.add")}
        </button>
      </div>
    </div>
  );
};

export default EducationDetailsForm