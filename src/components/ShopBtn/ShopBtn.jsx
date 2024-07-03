import styles from "./ShopBtn.module.css";
import { useState, useEffect, useRef } from "react";
import { useClickOutside } from "@mantine/hooks";
export default function ShopBtn({ text, url, mobile }) {
  const [open, setOpen] = useState(false);
  const [urlWidth, setUrlWidth] = useState(1000);
  const urlRef = useRef();
  useEffect(() => {
    setTimeout(() => {
      setOpen(true);
      setTimeout(() => {
        setOpen(false);
      }, 2000);
    }, 350);
  }, []);
  useEffect(() => setUrlWidth(urlRef.current ? urlRef.current.offsetWidth : 0), [urlRef]);
  const ref = useClickOutside(() => setOpen(false));

  const NewWindowIcon = () => {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none">
        <g
          stroke="#F7F7F7"
          strokeLinecap="round"
          strokeLinejoin="round"
          clipPath="url(#a)"
        >
          <path d="m15.188 7.313-.001-4.5h-4.5M9.563 8.438l5.624-5.626M12.938 9.563v5.062a.562.562 0 0 1-.563.563h-9a.563.563 0 0 1-.563-.563v-9a.563.563 0 0 1 .563-.563h5.063" />
        </g>
        <defs>
          <clipPath id="a">
            <path fill="#fff" d="M0 0h18v18H0z" />
          </clipPath>
        </defs>
      </svg>
    );
  };

  return (
    <div
      className={styles["shop-btn-container"]}
      data-open={open}
      style={{
        clipPath: mobile
          ? "inset(-100vw 0 -100vw -100vw)"
          : "inset(-100vw -100vw -100vw 0)",
      }}
      ref={ref}
    >
      <button className={styles["btn"]} onClick={() => setOpen((prev) => !prev)}>
        Shop
      </button>
      <a
        onClick={() => {
          window._paq.push(["trackEvent", `Shop Link Click`, `${url}`]);
        }}
        href={url}
        target="_blank"
        rel="noreferrer"
        className={styles["url"]}
        ref={urlRef}
        style={{
          left: `${
            open
              ? mobile
                ? "-220px"
                : "48px"
              : mobile
              ? `${urlWidth}px`
              : `${urlWidth * -1}px`
          }`,
        }}
      >
        <p>{text}</p>
        <NewWindowIcon />
      </a>
    </div>
  );
}
