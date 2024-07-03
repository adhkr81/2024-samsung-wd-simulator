import { ReactComponent as HomeIcon } from "../../../../src/assets/images/icons/home-icon.svg";
import { ReactComponent as BackIcon } from "../../../../src/assets/images/icons/back-icon.svg";
import styles from "./backbutton.module.css";

export default function BackButton({
  updateCurrentScreen,
  currentScreen,
  setReturnPressed
}) {
  const back_target = currentScreen.back_button.target;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        position: "absolute",
        top: "110px",
        left: "190px",
      }}
    >
      <div
        className={
          currentScreen.key === "homescreen"
            ? styles["disabled"]
            : styles["button_st"]
        }
        onClick={() => updateCurrentScreen("homescreen")}
      >
        <HomeIcon />
      </div>

      <div
        className={back_target ? styles["button_st"] : styles["disabled"]}
        onClick={() => {
          if (back_target) {
            updateCurrentScreen(currentScreen.back_button.target);
            setReturnPressed(true)
          }
        }}
      >
        <BackIcon />
      </div>
    </div>
  );
}
