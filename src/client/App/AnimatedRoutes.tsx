import loadable, { LoadableComponent } from "@loadable/component";
import { FileViewProps } from "../FileView/FileView.props";
import { FullscreenLoader } from "../Loader";
import { RouteChildrenProps } from "react-router-dom";
import React, { useRef, useState, useEffect } from "react";
import axios from "../_interceptedAxios";
import { AnimatePresence, AnimateSharedLayout } from "framer-motion";
import { useToasts } from "../_DesignSystem";
import { useTranslation } from "react-i18next";

/**
 * Lazy-loading components
 */
const FileView: LoadableComponent<FileViewProps> = FullscreenLoader(
  import(/* webpackChunkName: "FileView" */ "../FileView/FileView")
);
const Login: LoadableComponent<{}> = loadable(() =>
  import(/* webpackChunkName: "Login" */ "../Login/Login")
);

// Due to the HOC It is somewhat hard to assign the proper props to it
const Dashboard: LoadableComponent<any> = loadable(() =>
  import(/* webpackChunkName: "Dashboard" */ "../Dashboard/Dashboard")
);

/**
 * @see window.userData
 */
const isLoggedIn =
  typeof window.userData !== "undefined" &&
  typeof window.userData.username !== "undefined";

/**
 * Prefetcher for <FileView/>
 *
 * Since AnimateSharedLayout expects direct children,
 * we need to fetch all necessary data
 * before the actual component is mounted.
 */
const useFilePrefetcher = (id: string) => {
  const [fileData, setFileData] = useState<Window["fileData"]>(null);
  const { addToast } = useToasts();
  const { t } = useTranslation("common");

  useEffect(() => {
    const fetchFileData = async (id: string) => {
      try {
        const res = await axios.get(window.location.origin + "/api/get.php", {
          params: { id },
        });
        setFileData(res.data);
      } catch (err) {
        addToast(t("error.requestFile", { id }), { appearance: "error" });
        console.log(t("error.requestFile", { id }), "\n", err.message);
      }
    };

    if (id) fetchFileData(id);
    else setFileData(null);
  }, [addToast, id, t]);

  return fileData;
};

/**
 * Sets up connected animations between dashboard an view components
 * if the user is logged in and prefetches "fileData" on each "/:id" route
 */
const AnimatedRoutes: React.FC<RouteChildrenProps<{ id: string }>> = ({ match }) => {
  const ViewRef = useRef<React.ComponentType<FileViewProps>>(null);
  const [viewLoaded, setViewLoaded] = useState(false);
  const fileData = useFilePrefetcher(match.params.id);

  /**
   * AnimateSharedLayout doesn't like stand-in components,
   * so we need to load the component ourselves.
   *
   * ViewRef is the loaded component without a loadable wrapper.
   * viewLoaded is only used to rerender the component.
   *
   * This is only needed in loggedin state, as we don't care about
   * connected animations if there is nothing to connect them to.
   */
  useEffect(() => {
    if (!ViewRef.current) {
      FileView.load().then((exported: any) => {
        ViewRef.current = exported.default;
        setViewLoaded(true);
      });
    }
  }, []);

  return (
    <AnimateSharedLayout
      type="crossfade"
      transition={match.params.id ? { duration: 0.5 } : { duration: 0.3 }}
    >
      {isLoggedIn && <Dashboard key="dashboard" frozen={!!match.params.id} />}
      <AnimatePresence exitBeforeEnter>
        {match.params.id && viewLoaded && ViewRef.current && fileData && (
          <ViewRef.current fileData={fileData} key={match.params.id} />
        )}
        {!match.params.id && !isLoggedIn && <Login key="login" />}
      </AnimatePresence>
    </AnimateSharedLayout>
  );
};

export default AnimatedRoutes;
