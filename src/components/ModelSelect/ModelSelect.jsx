import styles from "../NavButtonGroup/navigation.module.scss";
import { useState } from "react";
import { ScrollArea, Popover } from "@mantine/core";
import { useDispatch, useSelector } from "react-redux";
import { setModel, setSelectedHotspot, setVersion } from "../../store/slices/navigation";
import { ReactComponent as UpIcon } from "../../assets/images/icons/arrow-up-circle-fill.svg";
import { ReactComponent as DownIcon } from "../../assets/images/icons/arrow-down-circle.svg";
import { useClickOutside } from "@mantine/hooks";
import { setLoading } from "../../store/slices/data";
import OnBoardingModal from "../HelpPopup/HelpPopup";
export default function ModelSelect({ width, mobile }) {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const ref = useClickOutside(() => open && setOpen(false));
  const model = useSelector((state) => state.navigation.model);
  const models = useSelector((state) => state.data.doc?.models);
  const versions = useSelector((state) => state.data.doc?.versions);
  const currentVersion = useSelector((state) => state.navigation.version);
  const orientation = useSelector((state) => state.data.doc?.settings?.orientation);

  const all_models = models
    ? Object.entries(models)
        .sort((a, b) => a[1].order - b[1].order)
        .map((el) => el[0])
    : [];

  const defaultModel = all_models[0];

  const handleModelChange = (value) => {
    dispatch(setLoading(true));

    setTimeout(() => {
      dispatch(setModel(value));
      dispatch(setSelectedHotspot(null));
      setTimeout(() => {
        dispatch(setLoading(false));
      }, 300);
    }, 300);
  };

  const helpOpen = useSelector((state) => state.help.active);
  const helpStep = useSelector((state) => state.help.current);

  const selectStyles = {
    root: {
      position: "relative",
      zIndex: 2,
    },
    input: {
      boxSizing: "border-box",
      border: "none",
      minHeight: "99px",
      borderRadius: 0,
      backgroundColor: "#f7f7f7",
      borderLeft: "#c6c7c9 1px solid",
      borderRight: "#c6c7c9 1px solid",
      borderBottom: "#c6c7c9 1px solid",

      width: `276px`,
      padding: "0 24px",
      fontFamily: "SamsungOne",
      fontWeight: 700,
      fontSize: "18px",
      position: "relative",
      color: "#1c1c1c",
      textAlign: "left",
      alignItems: "center",
      display: "flex",
      flex: 2,
      mobile: {
        width: "100%",
        backgroundColor: "#EEEEEE",
        margin: "0 auto",
        minHeight: "auto",
        padding: "15px 24px",
        borderLeft: "none",
        borderRight: "none",
      },
    },
    dropdown: {
      display: "flex",
      position: "absolute",
      bottom: open ? -180 : 0,
      left: 0,
      zIndex: 200,
      backgroundColor: "#006bea",
      border: "none",
      borderRadius: 0,
      marginTop: "-8px",
      fontFamily: "SamsungOne",
      width: "calc(100% + 100px)",
      height: open ? "180px" : "0px",
      overflowY: "hidden",
      color: "#fff",
      fontSize: "18px",
      transition: "all 150ms ease-in-out",
      mobile: {
        width: "100%",
      },
    },
    leftMenu: {
      height: "100%",
      width: 290,
      overflowY: "auto",
      mobile: {
        width: "60%",
      },
    },
    rightMenu: {
      width: "calc(100% - 200px)",
      height: "100%",
      overflowY: "auto",
      mobile: {
        width: "40%",
      },
    },
    itemsWrapper: {
      padding: 0,
    },
    item: {
      margin: 0,
      padding: "12px 24px",
      color: "#fff",
      borderRadius: 0,
      fontSize: "16px",
      transition: "all 150ms ease-in-out",
    },
    rightSection: {
      display: "none",
    },
  };

  return (
    <div
      className={styles["model-select__container"]}
      id="model_select"
      onWheel={(e) => e.stopPropagation()}
      ref={ref}
      data-mobile={mobile}
    >
      <div
        role="button"
        style={
          mobile
            ? { ...selectStyles.input, ...selectStyles.input.mobile }
            : { ...selectStyles.input }
        }
        onClick={() => {
          setOpen((p) => !p);
        }}
      >
        <p
          style={{
            fontSize: "16px",
            margin: 0,
            padding: 0,
            paddingTop: "3px",
          }}
        >
          {model ? models?.[model]?.title : defaultModel?.title}
        </p>
      </div>
      <span
        className={styles["model-select__arrow"]}
        aria-hidden="true"
        style={{ pointerEvents: "none" }}
      >
        {open ? <UpIcon /> : <DownIcon />}
      </span>
      <div
        style={
          mobile
            ? {
                ...selectStyles.dropdown,
                ...selectStyles.dropdown.mobile,
              }
            : { ...selectStyles.dropdown }
        }
        className={styles["model-select__dropdown"]}
      >
        <ScrollArea
          h={"100%"}
          style={
            mobile
              ? { ...selectStyles.leftMenu, ...selectStyles.leftMenu.mobile }
              : { ...selectStyles.leftMenu }
          }
          scrollbarSize={6}
          styles={{
            root: {
              backgroundColor: "#2189ff",
            },
            thumb: {
              background: "rgba(0,0,0,0.2)",
            },
          }}
        >
          {all_models.map((el, idx) => {
            return (
              <div
                key={idx}
                className={styles["select-item"]}
                style={{
                  ...selectStyles.item,
                  backgroundColor: el === model ? "#006bea" : "#2189ff",
                }}
                onClick={() => {
                  handleModelChange(el);
                }}
              >
                {models?.[el]?.title}
              </div>
            );
          })}
        </ScrollArea>
        <ScrollArea
          style={
            mobile
              ? { ...selectStyles.rightMenu, ...selectStyles.rightMenu.mobile }
              : { ...selectStyles.rightMenu }
          }
          scrollbarSize={6}
          styles={{
            root: {
              backgroundColor: "#68aeff",
            },
            thumb: {
              background: "rgba(0,0,0,0.2)",
            },
          }}
        >
          {models?.[model]?.versions?.map((el) => {
            return (
              <div
                key={el}
                className={styles["select-item"]}
                style={{
                  ...selectStyles.item,
                  backgroundColor: el === currentVersion ? "#006bea" : "#68aeff",
                }}
                onClick={() => {
                  dispatch(setVersion(el));
                }}
              >
                {versions?.[el]?.title}
              </div>
            );
          })}
        </ScrollArea>
      </div>
    </div>
  );
}
