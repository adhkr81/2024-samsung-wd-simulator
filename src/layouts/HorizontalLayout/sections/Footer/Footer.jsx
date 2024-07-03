/* eslint-disable react/prop-types */
import { useSelector } from "react-redux";

export default function Footer(props) {
  const mode = useSelector((state) => state.navigation.mode);
  return (
    <footer
      className={props.mobile ? props.styles["mobile"] : props.styles["disclaimer"]}
      style={{
        zIndex: 1,
        backgroundColor: "transparent",
        width: "100%",
        pointerEvents: "none"
      }}
    >
      <p style={{marginTop: "20px"}}>
        Screens and images are simulated. Functions may vary depending on the model and
        country.
      </p>
    </footer>
  );
}
