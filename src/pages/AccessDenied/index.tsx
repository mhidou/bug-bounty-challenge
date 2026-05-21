import { mdiAlert } from "@mdi/js";
import Icon from "@mdi/react";
import { Button, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { styled, useTheme } from "@mui/material/styles";
import * as React from "react";
import { useTranslation } from "react-i18next";

const Container = styled("div")({
  display: "flex",
  flex: 4,
  justifyContent: "space-evenly",
  flexDirection: "column",
  alignItems: "center",
  overflowY: "auto"
});

const AccessDenied: React.FC = () => {
  const { t } = useTranslation("app");
  const theme = useTheme();

  const color = theme.palette.error.main;

  // TODO: wire up to the auth layer once available.
  const handleLogout = () => {};

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Container>
        <Icon size={2} color={color} path={mdiAlert} />
        <Typography variant="h5" sx={{ color }}>
          {t("AccessDenied")}
        </Typography>
        <Typography>{t("speakToYourAdmin")}</Typography>
        <Button sx={{ color }} onClick={handleLogout}>
          {t("logout")}
        </Button>
      </Container>
      <Box sx={{ flex: 3 }} />
    </Box>
  );
};

export default AccessDenied;
