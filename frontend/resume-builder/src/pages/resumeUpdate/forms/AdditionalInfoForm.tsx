import type { FC, ChangeEvent } from "react";
import { LuPlus, LuTrash2 } from "react-icons/lu";
import { useTranslation } from "react-i18next";

import Input from "../../../components/Inputs/Input";
import RatingInput from "../../../components/ResumeSections/RatingInput";
import { normalizeLang } from "../../../utils/localization";
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import {
  addLanguages,
  removeLanguages,
  updateLanguages,
  addInterests,
  removeInterests,
  updateInterests,
} from '../../../features/resume/resumeSlice';


 const AdditionalInfoForm: FC = () => {
  const { t, i18n } = useTranslation('profileInfo');
  const lang = normalizeLang(i18n.language);

  const dispatch = useAppDispatch();
  const languages = useAppSelector((s) => s.resume.data.languages);
  const interests = useAppSelector((s) => s.resume.data.interests);

  const handleLanguageChange = (
    index: number,
    key: 'name' | 'progress',
    value: string | number
  ) => {
    dispatch(
      updateLanguages({
        index,
        item: key === 'name'
           ? { name: { ...languages[index].name, [lang]: value as string}}
           : { progress: value as number}
      })
    );
  };

  const handleInterestsChange = (index: number, value: string) => {
    dispatch(
      updateInterests({
        index,
        item: { 
          name: { ...interests[index].name, [lang]: value as string},
        }
      })
    );
  };

  return (
    <div className="px-5 pt-5">
      <h2 className="text-lg font-semibold text-gray-900">
        {t("additional.title")}
      </h2>

      <div className="mt-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">
          {t("additional.languages")}
        </h3>
        <div className="flex flex-col gap-4">
          {languages.map((lan, index) => (
            <div
              key={index}
              className="border border-gray-200/80 p-4 rounded-lg relative"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                <Input
                  label={t("additional.languageLabel")}
                  placeholder={t("additional.languagePlaceholder")}
                  type="text"
                  value={lan.name?.[lang] || ""}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleLanguageChange(index, 'name', e.target.value)
                  }
                />

                <div>
                  <label className="text-xs font-medium text-slate-600 mb-7 block">
                    {t("additional.proficiency")}
                  </label>
                  <RatingInput
                    value={lan.progress || 0}
                    onChange={(val) =>
                      handleLanguageChange( index, "progress", val)
                    }
                    total={5}
                    activeColor="#0ea5e9"
                    inActiveColor="#e0f2fe"
                  />
                </div>
              </div>

              {languages.length > 1 && (
                <button
                  type="button"
                  className="absolute top-3 right-3 text-sm text-red-600 hover:underline cursor-pointer"
                  onClick={() => dispatch(removeLanguages(index))}
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
                addLanguages({
                  name: { en: '', ru: '', kz: '' },
                  progress: 0,
                })
            )
            }
          >
            <LuPlus /> {t("additional.addLanguage")}
          </button>
        </div>
      </div>

      {/* INTERESTS SECTION */}
      <div className="mt-8 mb-4">
        <h3 className="text-sm font-semibold text-gray-700">
          {t("additional.interests")}
        </h3>
        <div className="flex flex-col gap-4">
          {interests.map((interest, index) => (
            <div key={index} className="rounded-lg relative">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label={t("additional.interestLabel")}
                  placeholder={t("additional.interestPlaceholder")}
                  type="text"
                  value={interest.name?.[lang] || ""}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleInterestsChange( index, e.target.value )
                  }
                />
              </div>

              {interests.length > 1 && (
                <button
                  type="button"
                  className="absolute top-[1.625rem] right-3 text-sm text-red-600 hover:underline cursor-pointer"
                  onClick={() => dispatch(removeInterests(index))}
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
                addInterests({
                        name: { en: '', ru: '', kz: '' },
                     })
                )
              }
          >
            <LuPlus /> {t("additional.addInterest")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdditionalInfoForm