/* eslint-disable react/prop-types */
import { useEffect } from "react";
import Header from "./sections/Header/Header";
import Main from "./sections/Main/Main";
import NavDrawer from "../../components/NavDrawer/NavDrawer";
import { useDispatch } from "react-redux";
import { setLoading } from "../../store/slices/data";
import WebFont from "webfontloader";
import { useMediaQuery } from "@react-hook/media-query";

export default function HorizontalLayout({ styles, setQueryParams }) {
  const dispatch = useDispatch();
  const portrait = useMediaQuery("(max-width: 1240px)");
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
    <>
      <Header styles={styles} />
      <div className={styles["rowWrapper"]} data-display="flex-row">
        <div className={styles["wrapper"]} data-display="flex-col">
          <NavDrawer setQueryParams={setQueryParams} width={360} portrait={false} />
          <Main styles={styles} />
        </div>
      </div>
    </>
  );
}
