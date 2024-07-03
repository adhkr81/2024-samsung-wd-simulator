import { useState, useRef, useEffect, useLayoutEffect } from "react";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";

export const ScaleWrapper = (props) => {
  const { ctW, ctH, children, page, remote, remoteMobile, mode } = props;
  // -- props --
  // crH - Container Height
  // crW - Container Width
  // ctH - Content Height
  // ctW - Content Width

  const containerRef = useRef();
  const [scale, setScale] = useState(props.minScale);

  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        setTimeout(() => {
          const containerWidth = containerRef.current.offsetWidth;
          const containerHeight = containerRef.current.offsetHeight;
          const widthScale = containerWidth / ctW;
          const heightScale = containerHeight / ctH;
          setScale(Math.min(widthScale, heightScale, 1.25));
        }, 100);
      }
    };

    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, [ctW, ctH]);

  const [panDisable, setPanDisable] = useState(true);
  const [zoomIn, setZoomIn] = useState(true);
  const [zoomDisable, setZoomDisable] = useState(true);

  const trWrapperProps = {
    centerOnInit: true,
    centerZoomedOut: false,
    initialScale: 1,
    minScale: 1,
    maxScale: 2,
    limitToBounds: true,
    disablePadding: true,
    disabled: props.disabled ? true : false,
    panning: { disabled: panDisable, velocityDisabled: true },
    doubleClick: {
      disabled: zoomDisable,
      step: 1.5,
      mode: zoomIn ? "zoomIn" : "reset",
    },
    onZoom: (ref, event) => {
      if (ref.state.scale <= 1.1) {
        setPanDisable(true);
      } else {
        setPanDisable(false);
      }
    },
    onWheelStart: (ref, event) => {
      if (ref.state.scale === scale && event.deltaY > 0) {
        window.scrollTo(0, 300);
      }
    },
  };
  const trComponentProps = {
    wrapperStyle: props.overflow
      ? {
          width: "100%",
          height: "100%",
          overflow: "visible",
        }
      : { width: "100%", height: "100%", overflow: "visible" },
    contentStyle: {
      width: "100%",
      height: "100%",
      position: "relative",
    },
  };

  useLayoutEffect(() => {
    if (page && containerRef.current) {
      setPanDisable(true);
      setZoomIn(false);
      containerRef.current.resetTransform();
    }
  }, [page]);


  return (
    <div ref={containerRef} style={{ width: "100%", height: "100%" }}>
      <TransformWrapper {...trWrapperProps}>
        <TransformComponent {...trComponentProps}>
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: `${remote ? (remoteMobile ? "62%" : "47.5%") : "50%"}`,
              width: ctW,
              height: ctH,

              transform:
                mode === "guide" ?
                 `translate(-50%, -49%) scale(${scale})`
                  : `translate(-56%, -40%) scale(${scale * 1.04})`,
            }}
          >
            {children}
          </div>
        </TransformComponent>
      </TransformWrapper>
    </div>
  );
};
