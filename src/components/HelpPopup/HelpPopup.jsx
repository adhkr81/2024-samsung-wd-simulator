import { ReactComponent as Icon } from "../../assets/images/icons/close-help.svg";
import { useState } from "react";
import onboarding_steps from "./onboarding-steps";
import { useDispatch, useSelector } from "react-redux";
import { gotoNextStep, resetHelp } from "../../store/slices/help";
import styles from "./help.module.scss";

export default function OnBoardingModal() {
  const dispatch = useDispatch();
  function handleClickHelp(func) {
    if (func === "close") {
      dispatch(resetHelp());
    } else if (func === "next") {
      dispatch(gotoNextStep());
    }
  }

  const [animation, setAnimation] = useState(null);
  const emulator = false;
  function handleAnimation() {
    setAnimation(0);
    setTimeout(() => setAnimation(1), 150);
  }

  const currHelpStep = useSelector((state) => state.help.current);
  const lastStep = currHelpStep === onboarding_steps.length;

  return (
    <div
      className={styles["onboarding-modal__container"]}
      style={{
        opacity: `${animation}`,
        transition: "opacity 150ms ease-in-out",
        maxWidth: "90vw",
      }}
      data-curr-step={`${currHelpStep}`}
    >
      <div className={styles["onboarding-modal__wrapper"]}>
        <header>
          <h1>
            {emulator && currHelpStep >= 6
              ? onboarding_steps[currHelpStep - 1].emulator.title
              : onboarding_steps[currHelpStep - 1].title}
          </h1>
          <button onClick={() => dispatch(resetHelp())}>
            <Icon />
          </button>
        </header>
        <div className={styles["onboarding-modal__text"]}>
          <p>
            {emulator && currHelpStep >= 6
              ? onboarding_steps[currHelpStep - 1].emulator.text
              : onboarding_steps[currHelpStep - 1].text}
          </p>
        </div>
      </div>
      <div className={styles["onboarding-modal__btns"]}>
        {!lastStep && (
          <button className={styles["onboarding-modal__btns__end"]} onClick={() => handleClickHelp("close")}>
            End tour...
          </button>
        )}
        <button
          className={styles["onboarding-modal__btns__next"]}
          onClick={() => {
            !lastStep && handleAnimation();
            setTimeout(() => handleClickHelp(`${lastStep ? "close" : "next"}`), 150);
          }}
        >
          {lastStep ? "Done" : "Next"}
        </button>
      </div>
    </div>
  );
}
