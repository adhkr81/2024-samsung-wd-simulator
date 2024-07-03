/* eslint-disable react/prop-types */
import { useSelector } from "react-redux";
import GuideDisplay from "../../../../sections/GuideDisplay/GuideDisplay";
import GuideSteps from "../../../../sections/GuideSteps/GuideSteps";
import FaqList from "../../../../components/FaqList/FaqList";
import ShopBtn from "../../../../components/ShopBtn/ShopBtn";
import { useMediaQuery } from "@react-hook/media-query";
import Footer from "../Footer/Footer";
import { useState, useEffect } from "react";

export default function Main(props) {
  const mode = useSelector((state) => state.navigation.mode);
  const drawerOpen = useSelector((state) => state.navigation.drawerOpen);
  const mobile = useMediaQuery("(max-width: 1240px)");
  const currModel = useSelector((state) => state.navigation.model);
  const currVersion = useSelector((state) => state.navigation.version);
  const currTopic = useSelector((state) => state.navigation.topic);
  const model =
    useSelector((state) => state.data?.doc?.models?.[currModel]) || null;
  const topic =
    useSelector(
      (state) =>
        state.data?.doc?.guide?.[currModel]?.[currVersion]?.topic?.[currTopic]
    ) || {};
  const steps = topic?.steps || [];
  const currStep = useSelector((state) => state.navigation.currentStep);
  const shopLink = steps?.[currStep]?.shopLink;

  const [animate, setAnimate] = useState(false);
  const [prevMode, setPrevMode] = useState(mode);

  useEffect(() => {
    if ((prevMode === "guide" && mode === "troubleshooting") && drawerOpen) {
      setAnimate(true);
    } else if ((prevMode === "troubleshooting" && mode === "guide") && drawerOpen) {
      setAnimate(true);
    }

    setPrevMode(mode);
    setTimeout(() => {
      setAnimate(false);
    }, 750);
  }, [mode]);

  return (
    <main
      data-translate={drawerOpen}
      style={{
        display: "flex",
        alignItems: "center",
        height: "calc(100% - 100px)",
      }}
    >
      <section
        id="device_section"
        className={props.styles["device"]}
        style={{
          height: "100%",
          flex: 2,
          flexDirection: "column",
        }}
        data-mode={mode}
      >
        <h2 className="sr-only">Device {mode}</h2>
        <figure>
          <GuideDisplay burgerOpen={false} model={1} variation={1} route={{}} />
          <figcaption></figcaption>
        </figure>
        {model?.shopLink ? (
          <div
            style={
              mobile
                ? {
                    position: "absolute",
                    top: "1rem",
                    right: "1rem",
                    zIndex: 201,
                  }
                : {
                    position: "absolute",
                    bottom: "1rem",
                    left: "1rem",
                    zIndex: 201,
                  }
            }
          >
            <ShopBtn
              text={model.title}
              url={model.shopLink}
              mobile={mobile}
              shopLink={shopLink}
            />
          </div>
        ) : null}
        <Footer styles={props.styles} />
      </section>
      <section
        id="info_section"
        data-display="flex-col"
        className={`${props.styles["info"]}${
          mode === "overview" || mode === "guide" || mode === "troubleshooting"
            ? " " + props.styles["expanded"]
            : ""
        }`}
        style={{ height: "100%" }}
        aria-hidden={mode !== "overview" && mode !== "guide"}
        data-mode={mode}
        data-animate={animate}
      >
        {mode === "overview" ? (
          <div
            className={props.styles["infoWrapper"]}
            style={{
              height: mobile ? (mode === "overview" ? 75 : 150) : "100%",
            }}
            data-mode={mode}
          >
            <FaqList mobile={mode === "overview" && mobile} />
          </div>
        ) : (
          <GuideSteps
            burgerOpen={false}
            model={1}
            variation={1}
            route={{
              mode: "guide",
              topic: "setup-your-tablet-for-the-first-time",
              model: "QLED 8K",
            }}
            topic={"setup-your-tablet-for-the-first-time"}
            currStep={0}
            setCurrStep={() => {}}
            orientation={"landscape"}
          />
        )}
      </section>
    </main>
  );
}
