import type { FC, ChangeEvent } from "react";
import { LuPlus, LuTrash2 } from "react-icons/lu";
import { useTranslation } from "react-i18next";
import Input from "../../../components/Inputs/Input";
import { normalizeLang } from "../../../utils/localization";
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import {
  addCertifications,
  updateCertifications,
  removeCertifications,
} from '../../../features/resume/resumeSlice';

const CertificationInfoForm: FC = () => {
  const { t, i18n } = useTranslation('profileInfo');
  const lang = normalizeLang(i18n.language);

  const dispatch = useAppDispatch();
  const certifications = useAppSelector((state) => state.resume.data.certifications);

  const handleLocalizedChange = (index: number, key: 'title' | 'issuer', value: string) => {
    const current = certifications[index][key];
    dispatch(
      updateCertifications({
        index,
        item: {
          [key]: { ...current, [lang]: value}
        }
      })
    )
  }

  const handleFieldChange = (index: number, value: string) => {
    dispatch(updateCertifications({ index, item: { year: value }}))
  }

  return (
    <div className="px-5 pt-5">
      <h2 className="text-lg font-semibold text-gray-900">
        {t("certifications.title")}
      </h2>

      <div className="mt-4 flex flex-col gap-4 mb-3">
        {certifications.map((certificate, index) => (
          <div
            key={index}
            className="border border-gray-200/80 p-4 rounded-lg relative"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label={t("certifications.titleLabel")}
                placeholder={t("certifications.titlePlaceholder")}
                type="text"
                value={certificate.title[lang] || ""}
                onChange={({ target }: ChangeEvent<HTMLInputElement>) =>
                  handleLocalizedChange(index, "title", target.value)
                }
              />

              <Input
                label={t("certifications.issuer")}
                placeholder={t("certifications.issuerPlaceholder")}
                type="text"
                value={certificate.issuer[lang] || ""}
                onChange={({ target }: ChangeEvent<HTMLInputElement>) =>
                  handleLocalizedChange(index, "issuer", target.value)
                }
              />

              <Input
                label={t("certifications.year")}
                placeholder="2024"
                type="text"
                value={certificate.year}
                onChange={({ target }) =>
                  handleFieldChange(index, target.value)
                }
              />
            </div>

            {certifications.length > 1 && (
              <button
                type="button"
                className="absolute top-3 right-3 text-sm text-red-600 hover:underline cursor-pointer"
                onClick={() => dispatch(removeCertifications(index))}
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
            addCertifications({
              title: { en: "", ru: "", kz: "" },
              issuer: { en: "", ru: "", kz: "" },
              year: "",
            })
          )
          }
        >
          <LuPlus /> {t("certifications.add")}
        </button>
      </div>
    </div>
  );
};

export default CertificationInfoForm