/* eslint-disable react/prop-types */
import { Burger, Popover } from "@mantine/core";
import { useDispatch, useSelector } from "react-redux";
import { setDrawerOpen } from "../../../../store/slices/navigation";
import { ReactComponent as SamsungLogo } from "../../../../assets/images/logos/samsung-logo.svg";
import NavButtonGroup from "../../../../components/NavButtonGroup/NavButtonGroup";
import ModelSelect from "../../../../components/ModelSelect/ModelSelect";
import { IconButton } from "../../../../components/IconButton/IconButton";
import { ReactComponent as HelpIcon } from "../../../../assets/images/icons/question-mark-icon.svg";
import styles from "../../../../components/NavButtonGroup/navigation.module.scss";
import { setHelpActive } from "../../../../store/slices/help";
import OnBoardingModal from "../../../../components/HelpPopup/HelpPopup";

export default function Header(props) {
  const dispatch = useDispatch();
  const openDrawer = () => dispatch(setDrawerOpen(true));

  const helpOpen = useSelector((state) => state.help.active);
  const helpStep = useSelector((state) => state.help.current);
  return (
    <>
      <header className={props.styles["desktop"]}>
        <nav>
          <NavButtonGroup styles={props.styles} />
        </nav>
        <object title="Samsung logo" aria-label="Samsung logo" role="img">
          <SamsungLogo />
        </object>
        <div
          className={styles["main-navbar__option-wrapper"]}
          style={{ width: 376 }}
        >
          {/* <ModelSelect /> */}
          <div style={{width: "100%", borderRight: "1px solid rgb(198, 199, 201)"}}></div>

          <aside>
            <Popover
              opened={helpOpen && helpStep === 4 ? true : false}
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
                  className={`${styles["main-navbar__link"]} ${styles["support-link"]}`}
                  role="button"
                  onClick={() => {
                    dispatch(setHelpActive());
                  }}
                >
                  <IconButton aria-label={`Simulator Help`} Icon={HelpIcon} />
                </li>
              </Popover.Target>
              <Popover.Dropdown>
                <OnBoardingModal />
              </Popover.Dropdown>
            </Popover>
          </aside>
        </div>
      </header>
      <nav className={props.styles["mobile"]}>
        <Burger aria-label="Open Navigation Drawer" onClick={openDrawer} />
      </nav>
    </>
  );
}
