import { IconButton } from "../../../../components/IconButton/IconButton";
import ModelSelect from "../../../../components/ModelSelect/ModelSelect";
import { ReactComponent as HelpIcon } from "../../../../assets/images/icons/question-mark-icon.svg";
import styles from "../../../../components/NavButtonGroup/navigation.module.scss";
import Footer from "../../../HorizontalLayout/sections/Footer/Footer";
import GuideDisplay from "../../../../sections/GuideDisplay/GuideDisplay";
import GuideSteps from "../../../../sections/GuideSteps/GuideSteps";
import { useDispatch, useSelector } from "react-redux";
import { useMediaQuery } from "@react-hook/media-query";
import FaqList from "../../../../components/FaqList/FaqList";
import { setHelpActive } from "../../../../store/slices/help";

export default function Main(props) {
  const mobile = useMediaQuery("(max-width: 960px)");
  const dispatch = useDispatch();
  const mode = useSelector((state) => state.navigation.mode);
  const infoStyles =
    mode === "overview" && mobile
      ? {
          width: "100vw",
          minWidth: "100vw",
          maxWidth: "100vw",
          position: "absolute",
          top: "calc(100% - 50px)",
          boxSizing: "border-box",
          left: 0,
          maxHeight: "90vh !important",
          justifyContent: "flex-start",
          textAlign: "center",
        }
      : { height: "calc(100% - 100px)" };
  return (
    <main>
      <section id="device_section" data-display="flex-col" style={mobile ? { flex: 2 } : {}}>
        <h2 className="sr-only">Description of the device section</h2>
        <figure style={{ position: "relative" }}>
          <GuideDisplay
            mobile={false}
            landscape={true}
            burgerOpen={false}
            model={1}
            tvdata={{}}
            mode={mode}
            variation={1}
            route={{
              mode: "guide",
              topic: "setup-your-tablet-for-the-first-time",
              model: "Tab S9 Ultra",
            }}
          />
          {/* <figcaption className="sr-only">{figcaption}</figcaption> */}
        </figure>
        <Footer styles={props.styles} />
      </section>
      <div
        className={props.styles["infoWrapper"]}
        style={{ height: mobile ? (mode === "overview" ? 75 : mode === "emulator" ? 0 : 150) : "100%" }}
      >
        {!mobile ? (
          <div className={styles["main-navbar__option-wrapper"]}>
            <ModelSelect width={260} />
            <aside>
              <li
                className={`${styles["main-navbar__link"]} ${styles["support-link"]}`}
                role="button"
                onClick={() => {
                  dispatch(setHelpActive(true));
                }}
              >
                <IconButton aria-label={`Simulator Help`} Icon={HelpIcon} />
              </li>
            </aside>
          </div>
        ) : null}
        
        <section id="info_section" className={props.styles.info} style={infoStyles}>
          {mode === "overview" ? (
            <FaqList mobile={mode === "overview" && mobile} />
          ) : mode === "guide" ? (
            <GuideSteps
              mobile={false}
              landscape={true}
              orientation={props.orientation}
              burgerOpen={false}
              model={1}
              tvdata={{}}
              variation={1}
              route={{
                mode: "guide",
                topic: "setup-your-tablet-for-the-first-time",
                model: "QLED 8K",
              }}
              topic={"setup-your-tablet-for-the-first-time"}
              currStep={0}
              setCurrStep={() => {}}
            />
          ) : (
            <div style={{ width: "100%", height: !mobile ? "100%" : 0, backgroundColor: "#eee" }}></div>
          )}
        </section>
      </div>
    </main>
  );
}
