/* eslint-disable react/prop-types */
import { useEffect } from "react";
import Main from "./sections/Main/Main";
import VerticalNav from "./sections/VerticalNav/VerticalNav";
import { useDispatch } from "react-redux";
import { setLoading } from "../../store/slices/data";
import WebFont from "webfontloader";

export default function VerticalLayout({ styles, setQueryParams }) {
  const dispatch = useDispatch();

  useEffect(() => {
    WebFont.load({
      custom: {
        families: ["SamsungOne", "SamsungSharpSans"],
      },
      active: () => {
        dispatch(setLoading(false));
      },
    });
    setTimeout(() => {
      dispatch(setLoading(false));
    }, 30000);
  }, [dispatch]);

  return (
    <div
      className={styles["wrapper"]}
      data-display="flex-row"
      onWheel={(e) => e.stopPropagation()}
      onTouchMove={(e) => e.stopPropagation()}
    >
      <VerticalNav styles={styles} setQueryParams={setQueryParams} />
      <Main styles={styles} orientation="portrait" />
    </div>
  );
}
