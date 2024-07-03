/* eslint-disable react/prop-types */
import { ScaleWrapper } from "../../components/ScaleWrapper/ScaleWrapper";
import { useState, useEffect, useRef } from "react";
import Rive from "@rive-app/react-canvas";
import down from "../../assets/riv/down.riv";
import doubleDown from "../../assets/riv/double-down.riv";
import tapHold from "../../assets/riv/tapHold.riv";
import useSize from "@react-hook/size";
import { useSelector, useDispatch } from "react-redux";
import { useViewportSize } from '@mantine/hooks';
import styles from "./display.module.scss";
import {
  setCurrentStep,
  setSelectedHotspot,
  setSubPage,
  setDrawerOpen,
} from "../../store/slices/navigation";
import EmulatorDisplay from "../EmulatorDisplay/EmulatorDispay";
import { ScrollArea } from "@mantine/core";
import { useMediaQuery } from "@react-hook/media-query";
export default function GuideDisplay({
  mobile,
  burgerOpen,
  model,
  variation,
  route,
}) {
  const assetsPath = useSelector((state) => state?.data?.assetsPath);
  const helpOpen = useSelector((state) => state.help.active);
  const dispatch = useDispatch();
  const target = useRef();
  const [width, height] = useSize(target.current);
  const [scale, setScale] = useState(null);


  const windowWidth = useViewportSize().width;


  const smallmobile = useMediaQuery("(max-width: 450px)");
  const truemobile = useMediaQuery("(max-width: 750px)");
  const tabletmobile = useMediaQuery("(max-width: 1000px)");
  const currStep = useSelector((state) => state.navigation.currentStep);
  const updateCurrStepInc = () => dispatch(setCurrentStep(currStep + 1));
  const updateCurrStepReset = () => dispatch(setCurrentStep(0));

  const DownGesture = () => <Rive src={down} onClick={updateCurrStepInc} />;
  const DoubleDownGesture = () => (
    <Rive src={doubleDown} onClick={updateCurrStepInc} />
  );
  const TapHoldGesture = (props) => (
    <Rive
      style={{ width: 60, height: 60 }}
      src={tapHold}
      onClick={() => {
        if (!props.noClick) {
          updateCurrStepInc();
        }
      }}
    />
  );
  const settings = useSelector((state) => state?.data?.doc?.settings);
  const selectedHotspot = useSelector(
    (state) => state.navigation.selectedHotspot
  );
  const model_id = useSelector((state) => state.navigation.model)?.value;
  const mode = useSelector((state) => state.navigation.mode);

  const currModel = useSelector((state) => state.navigation.model);
  const currVersion = useSelector((state) => state.navigation.version);
  const presets = useSelector((state) => state?.data?.doc?.presets);
  const topics =
    useSelector(
      (state) => state.data?.doc?.guide?.[currModel]?.[currVersion]?.topic
    ) || {};
  const topic = useSelector((state) => state.navigation.topic);
  const steps = topics?.[topic]?.steps || [];
  const [modify] = useState(variation?.[model]?.topics?.modify);
  const overview = useSelector(
    (state) => state?.data?.doc?.overview?.[currModel]
  );
  const overviewPage = useSelector((state) => state.navigation.subpage);

  useEffect(() => {
    if (mode === "overview" && !overviewPage) {
      dispatch(setSubPage(overview?.initial));
    }
    if (mode !== "overview") {
      dispatch(setSelectedHotspot(null));
    }
  }, [mode, overviewPage]);

  useEffect(() => {
    if (topic) {
      updateCurrStepReset(0);
      // setTopic(topics[route.topic]);
      let s = {};
      //   JSON.parse(JSON.stringify(topics[route.topic]?.steps));
      if (modify) {
        modify.forEach((m) => {
          if (m.url === route.topic) {
            m.remove_steps
              .sort((a, b) => b - a)
              .forEach((el) => {
                s.splice(el, 1);
              });
          }
        });
      }

      const images = [];
      topics[topic]?.steps?.forEach(
        (step) =>
          step.src &&
          images.push(`${assetsPath}/images/screens/${step.src}.jpg`)
      );
      if (images.length > 0) {
        Promise.all(
          images?.map((src) => {
            return new Promise((resolve, reject) => {
              const img = new Image();
              img.src = src;
              img.onload = () => resolve();
              img.onerror = () => reject();
            });
          })
        );
      }
    }
  }, [topic, modify]);

  useEffect(() => {
    if (target.current) {
      const hScale = height / 475;
      const wScale = width / 907;
      setScale(wScale <= hScale ? wScale : hScale);
    } else {
      setScale(1);
    }
  }, [target, width, height, route?.topic]);

  useEffect(() => {
    if ((scale === 1 && height / 475 < 1) || width / 907 < 1) {
      if (target.current) {
        const hScale = height / 475;
        const wScale = width / 907;
        setScale(wScale <= hScale ? wScale : hScale);
      }
    }
  }, [target, scale]);

  const bezel =
    mode === "guide" || mode === "troubleshooting"
      ? presets?.[currModel]?.bezel_simulator
      : presets?.[currModel]?.bezel;

  const imageUrl = `${assetsPath}/images/device/${bezel.src}.${bezel.extension}`;

  useEffect(() => {
    console.log(windowWidth)
  }, [windowWidth])

  console.log(windowWidth)

  return (
    <section
      className={styles["container"]}
      ref={target}
      style={{
        marginTop: "30px",
        marginLeft: smallmobile ? windowWidth / 4 : truemobile ? windowWidth / 10 : "0",
        animation: `${
          mobile
            ? burgerOpen
              ? `shiftTVContainer__close-to-main`
              : `shiftTVContainer__main-to-close`
              : "none"
            } 600ms ease forwards`,
            transform: "scale(1.35)",
          }}
          
          onMouseEnter={() => {
            if (!helpOpen) {
              dispatch(setDrawerOpen(false));
            }
          }}
    >
      <ScaleWrapper
        minScale={Math.min(
          target?.current?.getBoundingClientRect()?.width /
            settings?.canvas.width,
          target?.current?.getBoundingClientRect()?.height /
            settings?.canvas.height
        )}
        ctW={settings?.canvas.width}
        ctH={settings?.canvas.height}
        disabled={mode === "emulator"}
        mode={mode}
      >
        {(mode === "guide" || mode === "troubleshooting") &&
        steps?.length > 0 ? (
          <>
            {steps?.map((step, index) => {
              const stepModel = step?.model;
              const stepPreset = step?.preset;
              let transform = false;
              if (stepModel !== currModel) {
                transform =
                  presets?.[stepModel]?.[stepPreset]?.transform?.[currModel];
              }

              const bezel =
                mode === "guide" || mode === "troubleshooting"
                  ? presets?.[currModel]?.bezel_simulator
                  : presets?.[currModel]?.bezel;
              const screen = presets?.[step?.model]?.[step?.preset]?.screen;
              const gesture =
                model_id >= 0 && step?.models?.[model_id?.toString()]?.gesture
                  ? step?.models[model_id.toString()].gesture
                  : step?.gesture;
              return (
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    height: "100%",
                    width: "100%",
                    zIndex: currStep === index ? 2 : 1,
                    opacity: currStep === index ? 1 : 0,
                    pointerEvents: currStep === index ? "all" : "none",
                    transition: currStep !== index ? "0.3s ease" : "none",
                    transform: "scale(0.85)",
                  }}
                  key={index}
                >
                  <div
                    style={{
                      position: "relative",
                      width: "100%",
                      height: "100%",
                    }}
                  >
                    {presets?.[step.model]?.[step.preset]?.scroll?.width ? (
                      <ScrollArea
                        onWheel={(e) => e.stopPropagation()}
                        onScroll={(e) => e.stopPropagation()}
                        scrollbarSize={8}
                        style={{
                          position: "absolute",
                          width: presets[step.model][step.preset].scroll.width,
                          height:
                            presets[step.model][step.preset].scroll.height,
                          top: presets[step.model][step.preset].scroll.top,
                          left: presets[step.model][step.preset].scroll.left,
                          zIndex: 5,
                          boxSizing: "border-box",
                        }}
                      >
                        <div style={{ display: "flex", position: "relative" }}>
                          {gesture?.gesture_type.endsWith("_scroll") ? (
                            <>
                              <div
                                className={styles["gesture"]}
                                style={{
                                  zIndex: 4,
                                  borderRadius:
                                    gesture.gesture_type === "round"
                                      ? "50%"
                                      : 8,
                                  height: gesture.height,
                                  width: gesture.width,
                                  top: gesture.top,
                                  left: gesture.left,
                                }}
                                onClick={updateCurrStepInc}
                              ></div>
                            </>
                          ) : null}

                          <img
                            src={`${assetsPath}/images/scrolling/${step?.src}.jpg`}
                            style={{
                              width:
                                presets[step.model][step.preset].scroll.width,
                              height: "auto",
                              margin: 0,
                            }}
                          />
                        </div>
                      </ScrollArea>
                    ) : null}

                    {stepPreset && bezel ? (
                      <img
                        src={`${assetsPath}/images/device/${bezel.src}.${bezel.extension}`}
                        alt="Bezel"
                        className={`tv-bezel`}
                        style={{
                          pointerEvents: "none",
                          position: "absolute",
                          height: bezel.height,
                          width: bezel.width,
                          top: bezel.top,
                          left: bezel.left,
                          zIndex: bezel.front ? 4 : 2,
                        }}
                      />
                    ) : null}
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        zIndex: 4,
                      }}
                    >
                      <div
                        style={{
                          position: "relative",
                          zIndex: 6,
                          width: "100%",
                          height: "100%",
                          transform: transform
                            ? `translate(${transform.translateX}px, ${transform.translateY}px) scale(${transform.scale})`
                            : "none",
                        }}
                      >
                        {currStep < steps.length - 1 ? (
                          <>
                            {!gesture?.gesture_type.endsWith("_scroll") ? (
                              <>
                                {gesture?.gesture_type === "double" ? (
                                  <>
                                    {Object.keys(gesture?.buttons)?.map(
                                      (btn, index) => (
                                        <div
                                          className={
                                            gesture?.buttons[btn].type ===
                                            "tapHold"
                                              ? ""
                                              : styles["gesture"]
                                          }
                                          key={index}
                                          style={{
                                            position: "absolute",
                                            zIndex: 4,
                                            cursor: "pointer",
                                            borderRadius:
                                              gesture?.buttons[btn].type ===
                                              "round"
                                                ? "50%"
                                                : gesture?.buttons[btn].type ===
                                                  "rectangle"
                                                ? 8
                                                : 0,
                                            height:
                                              gesture?.buttons[btn].height,
                                            width: gesture?.buttons[btn].width,

                                            top: gesture?.buttons[btn].top,
                                            left: gesture?.buttons[btn].left,
                                          }}
                                          onClick={updateCurrStepInc}
                                        >
                                          {gesture?.buttons[btn].type ===
                                          "tapHold" ? (
                                            <TapHoldGesture noClick />
                                          ) : null}
                                        </div>
                                      )
                                    )}
                                  </>
                                ) : gesture?.gesture_type === "next" ? (
                                  <div
                                    className={styles["gesture next"]}
                                    style={{
                                      position: "absolute",
                                      borderRadius: 1,
                                      height: gesture.height,
                                      width: gesture.width,
                                      backgroundColor: "rgb(33, 137, 255)",
                                      top: gesture.top,
                                      left: gesture.left,
                                      display: "flex",
                                      justifyContent: "center",
                                      alignItems: "center",
                                      color: "white",
                                      textTransform: "uppercase",
                                      fontWeight: 600,
                                      cursor: "pointer",
                                    }}
                                    onClick={updateCurrStepInc}
                                  >
                                    Next
                                  </div>
                                ) : gesture?.gesture_type === "doubleDown" ? (
                                  <div
                                    style={{
                                      position: "absolute",
                                      zIndex: 4,
                                      height: gesture.height,
                                      width: gesture.width,
                                      top: gesture.top,
                                      left: gesture.left,
                                      cursor: "pointer",
                                    }}
                                  >
                                    <DoubleDownGesture />
                                  </div>
                                ) : gesture?.gesture_type === "down" ? (
                                  <div
                                    style={{
                                      position: "absolute",
                                      zIndex: 4,
                                      height: gesture.height,
                                      width: gesture.width,
                                      top: gesture.top,
                                      left: gesture.left,
                                      transform: gesture.rotate
                                        ? `rotate(${gesture.rotate}deg)`
                                        : "none",
                                      cursor: "pointer",
                                    }}
                                  >
                                    <DownGesture />
                                  </div>
                                ) : gesture?.gesture_type === "tapHold" ? (
                                  <div
                                    style={{
                                      position: "absolute",
                                      zIndex: 4,
                                      height: gesture.height,
                                      width: gesture.width,
                                      top: gesture.top,
                                      left: gesture.left,
                                      cursor: "pointer",
                                    }}
                                  >
                                    <TapHoldGesture />
                                  </div>
                                ) : gesture?.gesture_type ===
                                  "doubleTapHold" ? (
                                  <div
                                    style={{
                                      position: "absolute",
                                      zIndex: 4,
                                      display: "flex",
                                      flexDirection:
                                        gesture.orientation === "vertical"
                                          ? "column"
                                          : "row",
                                      justifyContent: "space-between",
                                      height:
                                        gesture.orientation === "vertical"
                                          ? 120 + gesture.spacing
                                          : 60,
                                      width:
                                        gesture.orientation !== "vertical"
                                          ? 120 + gesture.spacing
                                          : 60,
                                      top: gesture.top,
                                      left: gesture.left,
                                      cursor: "pointer",
                                    }}
                                  >
                                    <TapHoldGesture />
                                    <TapHoldGesture />
                                  </div>
                                ) : gesture?.gesture_type === "pinch" ? (
                                  <div
                                    style={{
                                      position: "absolute",
                                      zIndex: 4,
                                      display: "flex",
                                      flexDirection: "column",
                                      height: 320 + gesture.spacing,
                                      width: 60,
                                      top: gesture.top,
                                      left: gesture.left,
                                      transform:
                                        gesture.orientation === "vertical"
                                          ? "none"
                                          : "rotate(90deg)",
                                      cursor: "pointer",
                                    }}
                                  >
                                    <div
                                      style={{
                                        transform: `rotate(180deg)`,
                                        display: "flex",
                                        width: 41,
                                        height: 120,
                                      }}
                                    >
                                      <DownGesture />
                                    </div>
                                    <div
                                      style={{ height: gesture.spacing - 10 }}
                                    ></div>
                                    <div
                                      style={{
                                        display: "flex",
                                        width: 41,
                                        height: 120,
                                      }}
                                    >
                                      <DownGesture
                                        rotate={
                                          gesture.direction === "out" ? 180 : 90
                                        }
                                      />
                                    </div>
                                  </div>
                                ) : (
                                  <div
                                    className={styles["gesture"]}
                                    style={{
                                      borderRadius:
                                        gesture.gesture_type === "round"
                                          ? "50%"
                                          : 8,
                                      height: gesture.height,
                                      width: gesture.width,
                                      top: gesture.top,
                                      left: gesture.left,
                                    }}
                                    onClick={updateCurrStepInc}
                                  ></div>
                                )}
                              </>
                            ) : null}
                          </>
                        ) : (
                          <div
                            style={{
                              position: "absolute",
                              height: "100%",
                              width: "100%",
                              top: 0,
                              left: 0,
                              zIndex: 6,
                              pointerEvents: "none",
                            }}
                          >
                            <div
                              style={{
                                position: "relative",
                                height: "100%",
                                width: "100%",
                              }}
                            >
                              <div
                                style={{
                                  position: "absolute",
                                  zIndex: 10,
                                  borderRadius: "50%",
                                  height: 80,
                                  width: 80,
                                  top: "50%",
                                  left: "50%",
                                  transform: "translate(-50%, -50%)",
                                }}
                              >
                                <div className={styles["wrapper"]}>
                                  <svg
                                    className={styles["animated-check"]}
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      d="M4.1 12.7L9 17.6 20.3 6.3"
                                      fill="none"
                                    />
                                  </svg>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        zIndex: 3,
                        width: "100%",
                        height: "100%",
                      }}
                    >
                      <div
                        style={{
                          position: "relative",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "100%",
                        }}
                      >
                        <img
                          data-preset={JSON.stringify(stepPreset)}
                          alt="Selected option"
                          src={`${assetsPath}/images/screens/simulator/2024/${step?.src}.jpg`}
                          style={{
                            position: "absolute",
                            height: stepPreset
                              ? screen?.height
                              : settings?.canvas?.height,
                            width: stepPreset
                              ? screen?.width
                              : settings?.canvas?.width,
                            top: stepPreset ? screen?.top : 0,
                            left: stepPreset ? screen?.left : 0,
                            borderRadius:
                              transform && transform.borderRadius
                                ? transform.borderRadius
                                : screen?.borderRadius || 0,
                            zIndex: 3,
                            imageRendering: "crisp-edges",
                            filter: "sharpness(1.25)",
                            transform: transform
                              ? `translate(${transform.translateX}px, ${transform.translateY}px) scale(${transform.scale})`
                              : "none",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </>
        ) : mode === "overview" ? (
          <>
            <img
              src={`${assetsPath}/images/device/${
                overview?.routes?.[overviewPage || overview?.initial]?.device
                  ?.image
              }`}
              alt="Device"
              className={`tv-bezel`}
              style={{
                position: "absolute",
                height:
                  overview.routes[overviewPage || overview.initial].device.h,
                width:
                  overview.routes[overviewPage || overview.initial].device.w,
                top: overview.routes[overviewPage || overview.initial].device
                  .top,
                left: overview.routes[overviewPage || overview.initial].device
                  .left,
                zIndex: 4,
              }}
            />
            {overview?.routes?.[
              overviewPage || overview?.initial
            ]?.buttons?.map((btn, index) => {
              return (
                <div
                  onClick={() => {
                    if (selectedHotspot === index) {
                      dispatch(setSelectedHotspot(null));
                    } else {
                      dispatch(setSelectedHotspot(index));
                    }
                  }}
                  key={index}
                  className={
                    selectedHotspot === index ? styles["pulse-overview"] : ""
                  }
                  style={{
                    boxSizing: "border-box",
                    position: "absolute",
                    zIndex: 5,
                    backgroundColor:
                      overviewPage === "back" ? "transparent" : "#2189FF",
                    opacity: selectedHotspot === index ? "0.5" : "0.8",
                    borderRadius: btn?.placement?.borderRadius || "50%",
                    height: btn?.placement?.height,
                    width: btn?.placement?.width,
                    left: btn?.placement?.left,
                    top: btn?.placement?.top,
                    cursor: "pointer",
                    border:
                      overviewPage === "back"
                        ? "3px solid #2189FF"
                        : "3px solid white",
                    transition: "opacity 0.3s ease",
                  }}
                ></div>
              );
            })}
          </>
        ) : mode === "emulator" ? (
          <EmulatorDisplay />
        ) : null}
      </ScaleWrapper>
    </section>
  );
}
