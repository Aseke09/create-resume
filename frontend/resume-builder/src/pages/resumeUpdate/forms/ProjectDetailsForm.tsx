import type { FC, ChangeEvent } from "react";
import { LuPlus, LuTrash2 } from "react-icons/lu";
import { useTranslation } from "react-i18next";
import Input from "../../../components/Inputs/Input";
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { getLocalizedString, normalizeLang } from "../../../utils/localization";
import { 
  addProjects,
  updateProjects,
  removeProjects,
} from '../../../features/resume/resumeSlice';


 const ProjectsDetailForm: FC = () => {
  const { t, i18n } = useTranslation('profileInfo');
  const lang = normalizeLang(i18n.language);

  const dispatch = useAppDispatch();
  const projectInfo = useAppSelector((s) => s.resume.data.projects);

  const handleLocalizedChange = (
    index: number,
    key: 'title' | 'description',
    value: string
  ) => {
    const existing = projectInfo[index]?.[key] || {};
    dispatch(
      updateProjects({
        index,
        item: { [key]: { ...existing, [lang]: value } },
      })
    );
  };

  const handleFieldChange = (
    index: number,
    key: 'github' | 'liveDemo',
    value: string
  ) => {
    dispatch(updateProjects({ index, item: { [key]: value } }));
  };

  return (
    <div className="px-5 pt-5">
      <h2 className="text-lg font-semibold text-gray-900">
        {t("projects.title")}
      </h2>

      <div className="mt-4 flex flex-col gap-4 mb-3">
        {projectInfo.map((project, index) => (
          <div
            key={index}
            className="border border-gray-200/80 p-4 rounded-lg relative"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="col-span-2">
                <Input
                  label={t("projects.titleLabel")}
                  placeholder={t("projects.titlePlaceholder")}
                  type="text"
                  value={getLocalizedString(project.title, lang)}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleLocalizedChange(index, 'title', e.target.value)
                  }
                />
              </div>

              <div className="col-span-2">
                <label className="text-xs font-medium text-slate-600">
                  {t("projects.description")}
                </label>

                <textarea
                  placeholder={t("projects.descriptionPlaceholder")}
                  className="form-input w-full mt-1 p-2 border rounded text-sm"
                  rows={3}
                  value={getLocalizedString(project.description, lang)}
                  onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                    handleLocalizedChange(index, 'description', e.target.value)
                  }
                />
              </div>

              <Input
                label={t("projects.github")}
                placeholder="https://github.com/username/project"
                type="url"
                value={project.github}
                onChange={({ target }) =>
                  handleFieldChange(index, "github", target.value)
                }
              />

              <Input
                label={t("projects.liveDemo")}
                placeholder="https://yourproject.live"
                type="url"
                value={project.liveDemo}
                onChange={({ target }) =>
                  handleFieldChange(index, "liveDemo", target.value)
                }
              />
            </div>

            {projectInfo.length > 1 && (
              <button
                type="button"
                className="absolute top-3 right-3 text-sm text-red-600 hover:underline cursor-pointer"
                onClick={() => dispatch(removeProjects(index))}
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
              addProjects({
              title: { en: "", ru: "", kz: "" },
              description: { en: "", ru: "", kz: "" },
              github: "",
              liveDemo: "",
            })
          )
          }
        >
          <LuPlus /> {t("projects.add")}
        </button>
      </div>
    </div>
  );
};

export default ProjectsDetailForm