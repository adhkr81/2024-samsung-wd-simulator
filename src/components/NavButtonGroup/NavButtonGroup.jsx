import styles from "./navigation.module.scss";
import { Tooltip, Menu, Popover } from "@mantine/core";
import { useDispatch, useSelector } from "react-redux";
import { ReactComponent as OverviewIcon } from "../../assets/images/icons/overview-icon.svg";
import { ReactComponent as EmulatorIcon } from "../../assets/images/icons/emulator-icon.svg";
import { ReactComponent as HowTosIcon } from "../../assets/images/icons/how-tos-icon.svg";
import { ReactComponent as RotateIcon } from "../../assets/images/icons/180.svg";
import { ReactComponent as TroubleshootingIcon } from "../../assets/images/icons/troubleshooting.svg";
import { IconButton } from "../IconButton/IconButton";
import {
  setMode,
  setDrawerOpen,
  setSubPage,
  setSelectedHotspot,
  setTopic,
} from "../../store/slices/navigation";
import { addDrawerDisable } from "../../store/slices/disabled";
import OnBoardingModal from "../HelpPopup/HelpPopup";

export default function NavButtonGroup() {
  const mode = useSelector((state) => state.navigation.mode);
  const agent = useSelector((state) => state.navigation.agent);
  const sections = useSelector(
    (state) => state.data?.doc?.settings?.sections
  )?.filter((el) => (agent ? el : !el?.agentOnly));
  const subpage = useSelector((state) => state.navigation.subpage);
  const drawerOpen = useSelector((state) => state.navigation.drawerOpen);
  const topic = useSelector((state) => state.navigation.topic);
  const { active, current } = useSelector((state) => state.help);

  const dispatch = useDispatch();

  const iconMap = {
    Overview: OverviewIcon,
    "Overview Toggle": OverviewIcon,
    Emulator: EmulatorIcon,
    "How Tos": HowTosIcon,
    Troubleshooting: TroubleshootingIcon,
  };

  const tooltipStyle = {
    tooltip: {
      backgroundColor: "#fff",
      color: "#1c1c1c",
      fontSize: "10px",
      fontWeight: 700,
      boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.1)",
      transform: "translateX(30px)",
      marginTop: "6px",
    },
  };
  const helpOpen = useSelector((state) => state.help.active);
  const helpStep = useSelector((state) => state.help.current);

  return (
    <div className={styles["main-navbar__container"]}>
      <ul
        className={`${styles["main-navbar__link-wrapper"]} ${
          current === 0 && active ? styles["help-active"] : null
        }`}
      >
        {sections?.map((section) => {
          if (section.children) {
            return (
              <Menu
                shadow="md"
                width={200}
                key={section.title}
                position="bottom-start"
                offset={0}
                zIndex={1000}
              >
                <Menu.Target ref={(ref) => dispatch(addDrawerDisable(ref))}>
                  <Tooltip
                    label={section.title}
                    radius={30}
                    position="top-end"
                    offset={-35}
                    styles={tooltipStyle}
                  >
                    <li
                      className={`${styles["main-navbar__link"]}${
                        mode === section.to ? " " + styles.active : ""
                      }`}
                      // className={`${styles["main-navbar__link"]}${styles.active}`}
                      role="button"
                    >
                      <IconButton
                        aria-label={`Go to Device ${section.title}`}
                        onMouseEnter={() => {}}
                        Icon={iconMap[section.title]}
                      />
                    </li>
                  </Tooltip>
                </Menu.Target>

                <Menu.Dropdown>
                  {section.children.map((child) => (
                    <Menu.Item
                      key={child.title}
                      onClick={() => {
                        dispatch(setMode(section.to));
                      }}
                    >
                      {child.title}
                    </Menu.Item>
                  ))}
                </Menu.Dropdown>
              </Menu>
            );
          } else {
            return (
              <Tooltip
                key={section.title}
                label={section.title}
                radius={30}
                position="right-start"
                offset={-65}
                styles={tooltipStyle}
              >
                <div>
                  <Popover
                    opened={
                      (section.to === "guide" && helpOpen && helpStep === 1) ||
                      (section.to === "troubleshooting" &&
                        helpOpen &&
                        helpStep === 2) ||
                      (section.to === "emulator" && helpOpen && helpStep === 3)
                        ? true
                        : false
                    }
                    onChange={() => {}}
                    position={"bottom-start"}
                    offset={{ crossAxis: 40 }}
                    withinPortal
                    styles={{
                      dropdown: {
                        backgroundColor: "transparent",
                        border: "none",
                      },
                    }}
                  >
                    <Popover.Target>
                      <li
                        ref={(ref) =>
                          section.openOnHover && dispatch(addDrawerDisable(ref))
                        }
                        className={`${styles["main-navbar__link"]}${
                          mode === section.to ? " " + styles.active : ""
                        }`}
                        role="button"
                        onClick={() => {
                          dispatch(setSelectedHotspot(null));
                          if (section.to && !section.openOnHover) {
                            if (section.to !== mode) {
                              dispatch(setMode(section.to));
                            }
                            if (section.to === "overview") {
                              if (
                                section.toggle.filter((el) => el.to === subpage)
                                  .length > 0
                              ) {
                                let index = section.toggle.findIndex(
                                  (el) => el.to === subpage
                                );

                                if (index < section.toggle.length - 1) {
                                  dispatch(
                                    setSubPage(section.toggle[index + 1].to)
                                  );
                                } else {
                                  dispatch(setSubPage(section.toggle[0].to));
                                }
                              } else {
                                dispatch(setSubPage(section.toggle[0].to));
                              }
                            }
                            if (section.to === "guide") {
                              if (mode !== "guide") {
                                dispatch(setMode("guide"));
                                dispatch(setTopic("first-time-setup"));
                              } else {
                                dispatch(setMode(section.to));
                              }
                              setTimeout(() => {
                                dispatch(setDrawerOpen(true));
                              }, 150);
                            } else if (section.to === "troubleshooting") {
                              if (mode !== "troubleshooting") {
                                dispatch(setMode("troubleshooting"));
                                dispatch(
                                  setTopic(
                                    "unable-to-use-apps-from-samsung-tv-smart-hub-home"
                                  )
                                );
                              }
                              dispatch(setMode(section.to));
                              setTimeout(() => {
                                dispatch(setDrawerOpen(true));
                              }, 150);
                            } else {
                              dispatch(setDrawerOpen(false));
                            }
                          }
                        }}
                        onMouseEnter={() => {
                          if (section.openOnHover) {
                            dispatch(setDrawerOpen(true));
                          } else {
                            if (section.to === "guide") {
                              if (mode === "guide") {
                                dispatch(setDrawerOpen(true));
                              }
                            } else if (section.to === "troubleshooting") {
                              if (mode === "troubleshooting") {
                                dispatch(setDrawerOpen(true));
                              }
                            }
                            // else {
                            //   dispatch(setDrawerOpen(false));
                            // }
                          }
                        }}
                      >
                        {section.icon ? (
                          <IconButton
                            Icon={RotateIcon}
                            cls={
                              mode === "overview"
                                ? `${styles["rotate-btn"]} ${styles["active"]}`
                                : styles["rotate-btn"]
                            }
                            title={"Change the device view"}
                          />
                        ) : (
                          <IconButton
                            objsize={
                              section.to === "emulator"
                                ? { width: 44, height: 44 }
                                : null
                            }
                            aria-label={`Go to Device ${section.title}`}
                            Icon={iconMap[section.title]}
                          />
                        )}
                      </li>
                    </Popover.Target>
                    <Popover.Dropdown>
                      <OnBoardingModal />
                    </Popover.Dropdown>
                  </Popover>
                </div>
              </Tooltip>
            );
          }
        })}
      </ul>
    </div>
  );
}
