import { Box, Slide } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useUserStore } from "../../api/services/User";
import AppHeader from "../../components/AppHeader";
import useMatchedRoute from "../../hooks/useMatchedRoute";
import { observer } from "mobx-react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { TRoute } from "../../types/global";
import { routes as appRoutes } from "../routes";

const hideSplashScreen = () => {
  const splashscreen = document.getElementById("app-splashscreen");

  if (splashscreen) {
    splashscreen.className = "";
    setTimeout(() => {
      splashscreen.remove();
    }, 300);
  }
};

const Root = () => {
  const { t } = useTranslation("app");
  const userStore = useUserStore();
  const { user } = userStore || {};
  const theme = useTheme();
  const routes = appRoutes as readonly TRoute[];
  const [fallbackRoute] = routes;
  const Fallback = fallbackRoute.Component;
  const { route = fallbackRoute, MatchedElement } = useMatchedRoute(
    routes,
    Fallback,
    { matchOnSubPath: true }
  );

  // Group-aware page title: routes like /data/foo or /settings/bar fall back
  // to the parent group's translation key (e.g. routes./data).
  const isGroupRoute =
    route.path.indexOf("data") > -1 || route.path.indexOf("settings") > -1;
  const pageTitle = isGroupRoute
    ? t(`routes./${route.path.split("/")[1]}`)
    : t(`routes.${route.path}`);

  useEffect(() => {
    hideSplashScreen();
  }, []);

  useEffect(() => {
    if (!user && userStore) {
      userStore.getOwnUser();
    }
  }, [user, userStore]);

  return (
    <div
      id="portal-container"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh"
      }}
    >
      <Box
        sx={{
          display: "flex",
          height: "100%",
          width: "100%",
          background: "#f5f5f5"
        }}
      >
        <Slide direction="down" in mountOnEnter>
          <AppHeader user={user ?? {}} pageTitle={pageTitle} />
        </Slide>
        <Box
          component="main"
          sx={{
            position: "relative",
            height: `calc(100% - ${theme.tokens.header.height})`,
            width: "100%",
            marginTop: theme.tokens.header.height
          }}
        >
          {MatchedElement}
        </Box>
      </Box>
    </div>
  );
};

export default observer(Root);
