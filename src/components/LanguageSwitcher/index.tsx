import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent
} from "@mui/material";
import React, { useRef } from "react";
import { useTranslation } from "react-i18next";
import { defaultLanguages } from "../../i18n/i18n";

interface LanguageSwitcherProps {
  /** Override the languages offered. Defaults to all locales bundled with the app. */
  languages?: ReadonlyArray<string>;
}

// React 17 has no useId(); a small module counter is enough since switchers
// never need cross-instance referential equality.
let labelSeq = 0;
const nextLabelId = () => `language-switcher-label-${++labelSeq}`;

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  languages = defaultLanguages
}) => {
  const { t, i18n } = useTranslation("app");
  const labelIdRef = useRef<string | null>(null);
  if (labelIdRef.current === null) labelIdRef.current = nextLabelId();
  const labelId = labelIdRef.current;

  const handleChange = (event: SelectChangeEvent<string>) => {
    const next = event.target.value;
    if (next && next !== i18n.language) {
      void i18n.changeLanguage(next);
    }
  };

  // i18n.language can be "en-US"; normalise to base tag for matching.
  const currentLanguage = (i18n.language ?? "").split("-")[0];
  const value = languages.includes(currentLanguage)
    ? currentLanguage
    : languages[0];

  return (
    <FormControl size="small" variant="standard" sx={{ minWidth: 96 }}>
      <InputLabel
        id={labelId}
        sx={{
          color: "inherit",
          "&.Mui-focused": { color: "inherit" }
        }}
      >
        {t("language.switch")}
      </InputLabel>
      <Select
        labelId={labelId}
        value={value}
        onChange={handleChange}
        inputProps={{ "aria-label": t("language.switch") }}
        sx={{
          color: "inherit",
          "& .MuiSelect-icon": { color: "inherit" },
          "&::before": { borderBottomColor: "rgba(255,255,255,0.4)" },
          "&:hover:not(.Mui-disabled)::before": {
            borderBottomColor: "rgba(255,255,255,0.7)"
          }
        }}
      >
        {languages.map((lng) => (
          <MenuItem key={lng} value={lng}>
            {t(`language.${lng}`, { defaultValue: lng.toUpperCase() })}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default LanguageSwitcher;
