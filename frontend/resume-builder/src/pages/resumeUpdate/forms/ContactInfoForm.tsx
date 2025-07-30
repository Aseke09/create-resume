import type { FC, ChangeEvent } from "react";
import Input from "../../../components/Inputs/Input";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { patchLocalized, updateContactInfo } from "../../../features/resume/resumeSlice";
import { getLocalizedString, normalizeLang } from './../../../utils/localization';

const ContactInfoForm: FC = () => {
  const { t, i18n } = useTranslation('profileInfo');
  const dispatch = useAppDispatch();
  const contactInfo = useAppSelector((state) => state.resume.data.contactInfo);
  const lang = normalizeLang(i18n.language);

  const handleChange = (field: keyof typeof contactInfo) => (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value ?? "";

    if (field === 'location') {
      dispatch(patchLocalized({
        section: "contactInfo",
        field: "location",
        locale: lang,
        value
      }))
    } else {
      dispatch(updateContactInfo({ [field]: value }))
    }
  };

  return (
    <div className="px-5 pt-5">
      <h2 className="text-lg font-semibold text-gray-900">
        {t("contactInfo.title")}
      </h2>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="col-span-2">
          <Input
            label={t("contactInfo.address", "Address")}
            placeholder={t("contactInfo.addressPlaceholder", "Short Address")}
            type="text"
            value={getLocalizedString(contactInfo.location, lang)}
            onChange={handleChange("location")}
          />
        </div>

        <Input
          label={t("contactInfo.email", "Email")}
          placeholder="john@example.com"
          type="email"
          value={contactInfo.email || ""}
          onChange={handleChange("email")}
        />

        <Input
          label={t("contactInfo.phone", "Phone Number")}
          placeholder="9876543210"
          type="text"
          value={contactInfo.phone || ""}
          onChange={handleChange("phone")}
        />

        <Input
          label="LinkedIn"
          placeholder="https://linkedin.com/in/username"
          type="text"
          value={contactInfo.linkedin || ""}
          onChange={handleChange("linkedin")}
        />

        <Input
          label="GitHub"
          placeholder="https://github.com/username"
          type="text"
          value={contactInfo.github || ""}
          onChange={handleChange("github")}
        />

        <div className="md:col-span-2">
          <Input
            label={t("contactInfo.website", "Portfolio / Website")}
            placeholder="https://yourwebsite.com"
            type="text"
            value={contactInfo.website || ""}
            onChange={handleChange("website")}
          />
        </div>
      </div>
    </div>
  );
};

export default ContactInfoForm