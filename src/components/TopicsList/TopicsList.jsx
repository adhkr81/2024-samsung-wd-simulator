import { useState, useRef } from "react";
import TopicSearch from "./TopicSearch/TopicSearch";
import AccordionList from "./AccordionList/AccordionList";
import ModelSelect from "../ModelSelect/ModelSelect";
import { useSelector, useDispatch } from "react-redux";
import {
  setDrawerOpen,
  setMode,
  setTopic,
} from "../../store/slices/navigation";
import { ReactComponent as CloseIcon } from "../../assets/images/icons/close.svg";
import {
  setSelectedHotspot,
  setSubPage,
  updateOpenCategory,
} from "../../store/slices/navigation";
import styles from "./topiclist.module.scss";
import { IconButton } from "../IconButton/IconButton";
import { ReactComponent as RotateIcon } from "../../assets/images/icons/180.svg";
import { useMediaQuery } from "@react-hook/media-query";
import { Popover } from "@mantine/core";
import OnBoardingModal from "../HelpPopup/HelpPopup";
import { ReactComponent as OverviewIcon } from "../../assets/images/icons/overview-icon.svg";
import { ReactComponent as EmulatorIcon } from "../../assets/images/icons/emulator-icon.svg";
import { ReactComponent as HowTosIcon } from "../../assets/images/icons/how-tos-icon.svg";
import { ReactComponent as TroubleshootingIcon } from "../../assets/images/icons/troubleshooting.svg";

export default function TopicsList({
  setSimMenuOpen,
  setCurrentTopic,
  setQueryParams,
  portrait,
  trinity,
}) {
  const variation = {};
  const dispatch = useDispatch();
  const [inputActive, setInputActive] = useState(false);
  const currModel = useSelector((state) => state.navigation.model);
  const currVersion = useSelector((state) => state.navigation.version);
  const mode = useSelector((state) => state.navigation.mode);
  const list_topics =
    useSelector(
      (state) => state.data?.doc?.[mode]?.[currModel]?.[currVersion]?.map
    ) || {};
  const overview = useSelector(
    (state) => state.data?.doc?.overview?.[currModel]
  );
  const route = useSelector((state) => state.navigation);
  const handleClose = () => dispatch(setDrawerOpen(false));
  const remove = variation?.[route?.model]?.topics?.remove || [];
  const keys = Object.keys(list_topics);
  const mobile = useMediaQuery("(max-width: 960px)");
  const pseudomobile = useMediaQuery("(max-width: 1350px)");
  const truemobile = useMediaQuery("(max-width: 1240px)");
  const isAgent = useSelector((state) => state.navigation.agent);
  const emulatorIsAvailable = useSelector(
    (state) =>
      state.data?.doc?.settings?.sections?.filter((el) => el.to === "emulator")
        ?.length > 0
  );
  const agent = useSelector((state) => state.navigation.agent);
  const sections = useSelector(
    (state) => state.data?.doc?.settings?.sections
  )?.filter((el) => (agent ? el : !el?.agentOnly));

  const topicMap = {};
  const setOpenCategory = (e) => {
    dispatch(updateOpenCategory(e));
  };

  const rotateRef = useRef();

  const props = {
    remove,
    keys,
    setQueryParams,
    route,
    variation,
    topicMap,
    styles,
  };

  const iconMap = {
    Overview: <OverviewIcon />,
    "Overview Toggle": <OverviewIcon />,
    Emulator: <EmulatorIcon />,
    "How Tos": <HowTosIcon />,
    Troubleshooting: <TroubleshootingIcon />,
  };

  const helpOpen = useSelector((state) => state.help.active);
  const helpStep = useSelector((state) => state.help.current);

  return (
    <nav
      className={styles["simulator-side-menu"]}
      aria-hidden={!route.drawerOpen}
      style={{ overflow: "visible", position: "relative" }}
    >
      {mobile || truemobile ? (
        <>
          <div className={styles["mobile-nav-header"]}>
            {sections?.map((section) => {
              return (
                <button
                  className={styles["mobile-section-button"]}
                  data-active={mode === section.to}
                  onClick={() => {
                    dispatch(setMode(section.to));
                    if (section.to === "guide") {
                      if(mode !== "guide" ) {
                        dispatch(setTopic("first-time-setup"));
                      }
                    } if (section.to === "troubleshooting") {
                      if(mode !== "troubleshooting" ) {
                      dispatch(
                        setTopic(
                          "unable-to-use-apps-from-samsung-tv-smart-hub-home"
                        )
                      );
                    }
                    }
                  }}
                >
                  <div className={`${styles["icon"]} ${styles[section.title]}`}>
                    {iconMap[section.title]}
                  </div>
                  {/* <p>{section.title === "Troubleshooting" ? "TSG" : section.title}</p> */}
                  <p>{section.title}</p>
                </button>
              );
            })}
          </div>
        </>
      ) : null}
      <TopicSearch
        setInputActive={setInputActive}
        inputActive={inputActive}
        {...props}
      />

      {!inputActive ? (
        <>
          {/* {!portrait && !trinity && truemobile ? (
            <div
              className={styles["section-btn"]}
              style={
                helpOpen && helpStep === 2
                  ? {
                      border: "2px solid #f36e6e",
                    }
                  : {}
              }
              onClick={() => {
                dispatch(setSelectedHotspot(null));
                if (route.mode !== "overview") {
                  dispatch(setMode("overview"));
                }
                const routes = Object.keys(overview.routes);
                if (routes.filter((el) => el === route.subpage).length > 0) {
                  let index = routes.findIndex((el) => el === route.subpage);

                  if (index < routes.length - 1) {
                    dispatch(setSubPage(routes[index + 1]));
                  } else {
                    dispatch(setSubPage(routes[0]));
                  }
                }
              }}
            >
              <p className={mode === "overview" ? styles["active"] : ""}>
                Device Overview
              </p>
              <IconButton
                ref={rotateRef}
                onClick={() => {}}
                Icon={RotateIcon}
                cls={
                  mode === "overview"
                    ? `${styles["rotate-btn"]} ${styles["active"]}`
                    : styles["rotate-btn"]
                }
                title={"Change the device view"}
              />
            </div>
          ) : null} */}
          {pseudomobile && isAgent && emulatorIsAvailable ? (
            <div
              className={styles["section-btn"]}
              onClick={() => {
                dispatch(setSelectedHotspot(null));
                if (route.mode !== "emulator") {
                  dispatch(setMode("emulator"));
                }
              }}
            >
              <p className={mode === "emulator" ? styles["active"] : ""}>
                Emulator
              </p>
            </div>
          ) : null}
          <AccordionList
            model={route.model}
            remove={remove}
            topics={list_topics}
            topickeys={keys}
            currentTopic={route.topic}
            setCurrentTopic={setCurrentTopic}
            openCategory={route?.openCategory}
            setOpenCategory={setOpenCategory}
            setSimMenuOpen={setSimMenuOpen}
            portrait={portrait}
            trinity={trinity}
            {...props}
          />
        </>
      ) : null}
    </nav>
  );
}
