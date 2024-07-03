import { Drawer } from "@mantine/core";
import { useClickOutside } from "@mantine/hooks";
import { useDispatch, useSelector } from "react-redux";
import { setDrawerOpen } from "../../store/slices/navigation";
import { useEffect } from "react";
import { addDrawerDisable } from "../../store/slices/disabled";
import TopicsList from "../TopicsList/TopicsList";

export default function NavDrawer({
  alwaysOpen,
  width,
  setQueryParams,
  portrait,
  trinity,
}) {
  const dispatch = useDispatch();
  const open = useSelector((state) => state.navigation.drawerOpen);
  const mode = useSelector((state) => state.navigation.mode);
  const topic = useSelector((state) => state.navigation.topic);
  const subpage = useSelector((state) => state.navigation.subpage);
  const model = useSelector((state) => state.navigation.model);
  const disabled = useSelector((state) => state.disable.drawer);
  const handleClose = () => dispatch(setDrawerOpen(false));
  // const ref = useClickOutside(
  //   () => {
  //     handleClose();
  //   },
  //   null,
  //   disabled
  // );

  const helpOpen = useSelector((state) => state.help.active);
  const helpStep = useSelector((state) => state.help.current);

  // useEffect(() => {
  //   if (ref.current) {
  //     dispatch(addDrawerDisable(ref.current));
  //   }
  // }, [ref.current]);

  useEffect(() => {
    if (open) {
      handleClose();
    }
  }, [mode, topic, subpage, model]);

  //opening side nav for help steps
 useEffect(() => {
  if (helpOpen && (helpStep === 5 || helpStep === 6 || helpStep === 7)) {
    dispatch(setDrawerOpen(true));
  } else if (helpOpen) {
    dispatch(setDrawerOpen(false));
  }
 },[helpStep])

  return (
    <Drawer.Root
      opened={open}
      onClose={handleClose}
      position="left"
      size={width}
      padding="md"
      withinPortal={false}
      keepMounted={true}
      onWheel={(e) => {
        e.stopPropagation();
      }}
      styles={{
        root: {
          position: "relative",
          height: "100%",
          maxHeight: "100%",
          width: "100vw",
          maxWidth: "100%",
        },
        inner: { position: "absolute", width: width, height: "100%", top: 0 },
        content: { maxWidth: "100vw !important", width: "100%" },
      }}
    >
      <Drawer.Content
        // ref={ref}
        style={{ backgroundColor: "#f4f4f5", overflowY: "hidden" }}
      >
        <h2 className="sr-only">Simulator Topics Navigation Drawer</h2>
        <TopicsList setQueryParams={setQueryParams} portrait={false} trinity={trinity} />
      </Drawer.Content>
    </Drawer.Root>
  );
}
