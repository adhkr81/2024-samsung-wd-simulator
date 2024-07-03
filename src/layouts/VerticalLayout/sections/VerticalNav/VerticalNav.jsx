/* eslint-disable react/prop-types */
import { Burger } from "@mantine/core";
import NavButtonGroup from "../../../../components/NavButtonGroup/NavButtonGroup";
import NavDrawer from "../../../../components/NavDrawer/NavDrawer";
import { useSelector, useDispatch } from "react-redux";
import { setDrawerOpen } from "../../../../store/slices/navigation";
import { useMediaQuery } from "@react-hook/media-query";

export default function VerticalNav(props) {
  const dispatch = useDispatch();
  const mobile = useMediaQuery("(max-width: 1350px)");
  const agent = useSelector((state) => state.navigation.agent);
  const sections = useSelector((state) => state.data?.doc?.settings?.sections).filter(
    (el) => (agent ? el : !el.agentOnly)
  );
  const open = useSelector((state) => state.navigation.drawerOpen);
  const handleOpen = () => {
    dispatch(setDrawerOpen(true));
  };
  const helpOpen = useSelector((state) => state.help.active);
  const helpStep = useSelector((state) => state.help.current);

  return (
    <>
      {mobile ? (
        <nav className={props.styles["mobile"]}>
          <div style={{ padding: "1rem" }}>
            <Burger aria-label="Open Navigation Drawer" onClick={handleOpen} />
          </div>
          <div
            style={{
              display: "flex",
              flex: 2,
              height: "100%",
              transform: "translateY(-68px)",
              pointerEvents: open ? "all" : "none",
            }}
          >
            <NavDrawer
              width={mobile ? 300 : 300}
              setQueryParams={props.setQueryParams}
              portrait
              alwaysOpen={helpOpen ? true : false}
            />
          </div>
        </nav>
      ) : (
        <nav className={props.styles["desktop"]} data-display="flex-col">
          {sections.length > 2 ? <NavButtonGroup /> : null}
          <div style={{ display: "flex", flex: 2 }}>
            <NavDrawer
              width={300}
              setQueryParams={props.setQueryParams}
              alwaysOpen
              portrait
              trinity={sections.length > 2}
            />
          </div>
        </nav>
      )}
    </>
  );
}
