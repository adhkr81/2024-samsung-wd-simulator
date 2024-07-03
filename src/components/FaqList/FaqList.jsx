import { ScrollArea } from "@mantine/core";
import styles from "./faqlist.module.scss";
import { useSelector } from "react-redux";
import { useState } from "react";
import { ReactComponent as CaretIcon } from "../../assets/images/icons/CaretUp.svg";
import { useClickOutside } from "@mantine/hooks";

export default function FaqList({ mobile }) {
  const currModel = useSelector((state) => state.navigation.model);
  const overview = useSelector((state) => state.data.doc.overview?.[currModel]);
  const overviewPage = useSelector((state) => state.navigation.subpage);
  const selectedHotspot = useSelector(
    (state) => state.navigation.selectedHotspot
  );
  const topic =
    selectedHotspot === null
      ? overview?.topSolutions
      : overview?.routes?.[overviewPage]?.buttons?.[selectedHotspot];

  const topics = topic?.solutions;
  function handleClick(props) {
    window.open(props, "_blank");
  }

  const [expanded, setExpanded] = useState(false);

  const ref = useClickOutside(() => mobile && expanded && setExpanded(false));

  const handleExpand = () => {
    if (mobile) {
      setExpanded(!expanded);
    }
  };

  return (
    <div
      className={styles["list_container"]}
      ref={ref}
      style={
        mobile
          ? {
              position: "relative",
              maxWidth: "100%",
              transform: `translateY(${expanded ? "-60vh" : "0"})`,
              height: expanded ? "calc(60vh + 50px)" : "inherit",
              maxHeight: expanded ? "calc(60vh + 50px)" : "inherit",
              cursor: "pointer",
              transition: "all 0.5s ease-in-out",
            }
          : {}
      }
      onClick={handleExpand}
      onWheel={(e) => e.stopPropagation()}
    >
      {mobile ? (
        <CaretIcon
          style={{
            position: "absolute",
            top: 0,
            left: "50%",
            transform: `translate(-50%, -110%)${
              expanded ? "rotate(180deg)" : ""
            }`,
            opacity: expanded ? 0 : 1,
            height: 30,
            width: 40,
            transition: "all 0.3s ease-in-out",
          }}
        />
      ) : null}
      <div className={styles["header"]}>
        {/* ↓ Dynamic title goes here ↓ */}
        <h2
          style={
            mobile ? { backgroundColor: "#2189FF", textAlign: "center" } : {}
          }
        >
          {topic?.title}
        </h2>
      </div>

      <ScrollArea
        className={styles.content}
        scrollbarSize={6}
        style={mobile ? { flex: 2 } : {}}
        styles={{
          thumb: {
            background: "rgba(0,0,0,0.2)",
          },
        }}
      >
        {topics?.map((item, i) => {
          return (
            <article key={i} style={{ textAlign: "left" }}>
              <div className={styles.textWrapper}>
                <h3>{item.title}</h3>
                <p dangerouslySetInnerHTML={{ __html: item.desc }}></p>
                <button
                  className={styles.readMore}
                  onClick={() => handleClick(item.url)}
                >
                  READ MORE &gt;
                </button>
              </div>
            </article>
          );
        })}
      </ScrollArea>
    </div>
  );
}
