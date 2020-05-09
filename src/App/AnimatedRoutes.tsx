import loadable, { LoadableComponent } from "@loadable/component";
import { FileViewProps } from "../FileView/FileView.props";
import { FullscreenLoader } from "../Loader";
import { RouteChildrenProps } from "react-router-dom";
import React, { useRef, useState, useEffect } from "react";
import axios from "../_interceptedAxios";
import { AnimatePresence, AnimateSharedLayout } from "framer-motion";
import { useToasts, isLoggedIn } from "../_DesignSystem";
import { useTranslation } from "react-i18next";
import { History } from "history";

/**
 * Lazy-loading components
 */
const FileView: LoadableComponent<FileViewProps> = FullscreenLoader(
  import(/* webpackChunkName: "FileView" */ "../FileView/FileView")
);
const Login: LoadableComponent<{}> = loadable(() =>
  import(/* webpackChunkName: "Login" */ "../Login/Login")
);
const NotFound: LoadableComponent<{}> = loadable(() =>
  import(/* webpackChunkName: "NotFound" */ "../NotFound/NotFound")
);

// Due to the HOC It is somewhat hard to assign the proper props to it
const Dashboard: LoadableComponent<any> = loadable(() =>
  import(/* webpackChunkName: "Dashboard" */ "../Dashboard/Dashboard")
);

/**
 * Prefetcher for <FileView/>
 *
 * Since AnimateSharedLayout expects direct children,
 * we need to fetch all necessary data
 * before the actual component is mounted.
 */
const useFilePrefetcher = (id: string, history: History<{}>) => {
  const [fileData, setFileData] = useState<Window["fileData"]>(null);
  const { addToast } = useToasts();
  const { t } = useTranslation("common");

  useEffect(() => {
    const fetchFileData = async (id: string) => {
      try {
        const res = await axios.get(window.location.origin + "/api/get.php", {
          params: { id },
        });

        if (!res.data) {
          setFileData({} as any);
        } else {
          setFileData(res.data);
        }
      } catch (err) {
        addToast(t("error.requestFile", { id }), { appearance: "error" });
        console.log(t("error.requestFile", { id }), "\n", err.message);
        history.replace("/");
      }
    };

    if (window.fileData) {
      setFileData(window.fileData);
      window.fileData = null;
      return;
    }

    if (id) fetchFileData(id);
    else setFileData(null);
  }, [addToast, history, id, t]);

  return fileData;
};

/**
 * Sets up connected animations between dashboard an view components
 * if the user is logged in and prefetches "fileData" on each "/:id" route
 */
const AnimatedRoutes: React.FC<RouteChildrenProps<{ id: string }>> = ({
  match,
  history,
}) => {
  const ViewRef = useRef<React.ComponentType<FileViewProps>>(null);
  const [viewLoaded, setViewLoaded] = useState(false);
  const fileData = useFilePrefetcher(match.params.id, history);

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

  const is404 =
    !!match.params.id && fileData !== null && typeof fileData.id === "undefined";
  const isValidFile =
    !!match.params.id &&
    viewLoaded &&
    ViewRef.current &&
    fileData &&
    typeof fileData.id !== "undefined";
  const isDashboardVisible = isLoggedIn && !is404;

  return (
    <AnimateSharedLayout type="crossfade">
      {isDashboardVisible && <Dashboard key="dashboard" frozen={!!match.params.id} />}
      <AnimatePresence exitBeforeEnter>
        {isValidFile && <ViewRef.current fileData={fileData} key={match.params.id} />}
        {is404 && <NotFound key="notFound" />}
        {!match.params.id && !isLoggedIn && <Login key="login" />}
      </AnimatePresence>
    </AnimateSharedLayout>
  );
};

export default AnimatedRoutes;
