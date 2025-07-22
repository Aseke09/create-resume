import type { FC, ChangeEvent } from "react";
import { LuPlus, LuTrash2 } from "react-icons/lu";
import { useTranslation } from "react-i18next";
import Input from "../../../components/Inputs/Input";
import RatingInput from "../../../components/ResumeSections/RatingInput"; // Make sure the path is correct
import { normalizeLang } from "../../../utils/localization";
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import {
  addSkills,
  updateSkills,
  removeSkills,
} from '../../../features/resume/resumeSlice';


const SkillsInfoForm: FC = () => {
  const { t, i18n } = useTranslation('profileInfo');
  const lang = normalizeLang(i18n.language);

  const dispatch = useAppDispatch();
  const skillsInfo = useAppSelector((s) => s.resume.data.skills);

  const handleSkillsChange = (index: number, value: string) => {
    const existing = skillsInfo[index].name;

    dispatch(updateSkills({
      index,
      item: { name: { ...existing, [lang]: value}}
    }))
  }

  const handleProgress = (index: number, val: number) => {
    dispatch(updateSkills({ index, item: { progress: val}}))
  }

  return (
    <div className="px-5 pt-5">
      <h2 className="text-lg font-semibold text-gray-900">
        {t("skills.title")}
      </h2>

      <div className="mt-4 flex flex-col gap-4 mb-3">
        {skillsInfo.map((skill, index) => (
          <div
            key={index}
            className="border border-gray-200/80 p-4 rounded-lg relative"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label={t("skills.name")}
                placeholder={t("skills.namePlaceholder")}
                type="text"
                value={skill.name[lang] || ""}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  handleSkillsChange(index, e.target.value)
                }
              />

              <div className="flex flex-col">
                <label className="text-[13px] text-slate-800 mb-1">
                  {t("skills.proficiency")} ({(skill.progress || 0) / 20} / 5)
                </label>
                <div className="mt-5">
                  <RatingInput
                    value={skill.progress || 0}
                    total={5}
                    onChange={(val) => handleProgress(index, val)
                    }
                  />
                </div>
              </div>
            </div>

            {skillsInfo.length > 1 && (
              <button
                type="button"
                className="absolute top-3 right-3 text-sm text-red-600 hover:underline cursor-pointer"
                onClick={() => dispatch(removeSkills(index))}
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
              addSkills({
                name: { en: '' , ru: '', kz: ''},
                progress: 0,
              }) 
            )}
        >
          <LuPlus /> {t("skills.add")}
        </button>
      </div>
    </div>
  );
};

export default SkillsInfoForm