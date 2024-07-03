/* eslint-disable react/prop-types */
import { Accordion, Popover, ScrollArea } from "@mantine/core";
import { IconMinus, IconPlus } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import styles from "../topiclist.module.scss";
import { useSelector, useDispatch } from "react-redux";
import { setDrawerOpen, setMode, setTopic } from "../../../store/slices/navigation";
import OnBoardingModal from "../../HelpPopup/HelpPopup";

export default function AccordionList({
  openCategory,
  setOpenCategory,
  topics,
  topickeys,
  remove,
  route,
  portrait,
}) {
  const keys = topickeys;

  const [opened, setOpened] = useState(openCategory);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [currentTopic, setCurrentTopic] = useState(null);
  const topic = useSelector((state) => state.navigation.topic);
  const mode = useSelector((state) => state.navigation.mode);
  const helpOpen = useSelector((state) => state.help.active);
  const helpStep = useSelector((state) => state.help.current);
  const orientation = useSelector((state) => state.data?.doc?.settings?.orientation);
  const dispatch = useDispatch();

  useEffect(() => {
    if (route?.mode === "guide" || route?.mode === "troubleshooting") {
      keys?.forEach((key) => {
        if (topics?.[key]?.findIndex((el) => el.url === topic) > -1) {
          const idx =
            topics?.[key]?.findIndex((el) => el.url === route.topic) > -1
              ? topics?.[key]?.findIndex((el) => el.url === route.topic)
              : -1;
          setOpened(key);
          setCurrentCategory(key);
          setCurrentTopic(idx.toString());
        }
      });
    } else {
      setOpened(null);
      setCurrentCategory(null);
      setCurrentTopic(null);
    }
  }, [topic, keys, topics, route]);

  useEffect(() => {
    setOpened(null)
    setTimeout(() => {
      setOpened(currentCategory)
    }, 10);
  }, [mode]);

  //opening accordion for help steps
  useEffect(() => {
    if (helpOpen) {
      setOpened("Getting Started")
    }
  },[helpOpen, helpStep])
  

  return (
    <Wrapper
      portrait={portrait}
      border={helpOpen && helpStep === 1 ? "2px solid #f36e6e" : "none"}
    >
      <Accordion
        value={opened}
        onChange={setOpened}
        styles={{
          item: {
            backgroundColor: "#e8e8e8",

            marginBottom: 4,
          },
          label: {
            fontFamily: "SamsungOne, arial, sans-serif",
            fontWeight: 700,
            lineHeight: 1,
            color: "#1c1c1c",
          },
          content: {
            padding: "1rem 0",
            backgroundColor: "#f4f4f5",
          },
        }}
      >
        {keys?.map((category, index) => (
          <Accordion.Item value={category} key={index}>
            {index === 0 && orientation !== "landscape" ? (
              <Accordion.Control
                onClick={() =>
                  opened === category ? setOpened(null) : setOpened(category)
                }
                chevron={
                  opened === category ? (
                    <IconMinus size={18} color="#969696" />
                  ) : (
                    <IconPlus size={18} color="#969696" />
                  )
                }
              >
                <Popover
                  opened={helpOpen && helpStep === 1 ? true : false}
                  onChange={() => {}}
                  position={"bottom-start"}
                  offset={{ crossAxis: 20 }}
                  withinPortal
                  styles={{
                    dropdown: {
                      backgroundColor: "transparent",
                      border: "none",
                    },
                  }}
                >
                  <Popover.Target>
                    <div style={{ width: "100%", height: "100%" }}>{category}</div>
                  </Popover.Target>
                  <Popover.Dropdown>{/* <OnBoardingModal /> */}</Popover.Dropdown>
                </Popover>
              </Accordion.Control>
            ) : (
              <Accordion.Control
                onClick={() =>
                  opened === category ? setOpened(null) : setOpened(category)
                }
                chevron={
                  opened === category ? (
                    <IconMinus size={18} color="#969696" />
                  ) : (
                    <IconPlus size={18} color="#969696" />
                  )
                }
              >
                {category}
              </Accordion.Control>
            )}
            <Accordion.Panel>
              <ul>
                {topics?.[category]?.map((link, idx) => {
                  if (!remove.includes(link.url)) {
                    return (
                      <li
                        onClick={() => {
                          // setQueryParams([
                          // 	["mode", "guide"],
                          // 	["topic", link.url],
                          // ]);

                          dispatch(setTopic(link.url));
                          dispatch(setMode(route?.mode));
                          dispatch(setTopic(link.url));
                          dispatch(setDrawerOpen(false));
                          // setBurgerOpen && setBurgerOpen(false);
                        }}
                        className={
                          category === currentCategory && idx.toString() === currentTopic
                            ? styles["active"]
                            : ""
                        }
                        key={idx}
                      >
                        <span>{link.title}</span>
                      </li>
                    );
                  } else return null;
                })}
              </ul>
            </Accordion.Panel>
          </Accordion.Item>
        ))}
      </Accordion>
    </Wrapper>
  );
}

const Wrapper = ({ children, border }) => {
  return (
    <ScrollArea
      className={styles["simulator-menu__accordion-list"]}
      scrollbarSize={6}
      style={{ border }}
      styles={{
        thumb: {
          background: "rgba(0,0,0,0.2)",
        },
      }}
    >
      {children}
    </ScrollArea>
  );
};
