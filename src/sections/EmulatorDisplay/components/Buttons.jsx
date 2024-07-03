import styles from "./buttons.module.css";

export default function Buttons({ data, updateCurrentScreen, scrolling = false}) {
  return (
    <>
      {data?.map((button) => {
        return (
          <div
            className={styles.screen_button}
            onClick={() => {
              if (button.target) {
                updateCurrentScreen(button.target);
              }
            }}
            key={`${button.target + button.y + button.x}`}
            style={{
              opacity: button.target ? 1 : 0.01,
              pointerEvents: button.target ? "all" : "none",
              height: button.height + "px",
              width: button.width + "px",
              top: button.y + "px",
              left: button.x + "px",
              
              
            }}
          />
        );
      })}
    </>
  );
}
