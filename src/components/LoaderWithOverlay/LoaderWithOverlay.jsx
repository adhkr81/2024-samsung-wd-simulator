import { LoadingOverlay } from "@mantine/core";
import { useSelector } from "react-redux";
import styles from "./loader.module.scss";

export default function LoaderWithOverlay() {
	const isLoading = useSelector((state) => state.data.isLoading);
	return (
		<div className={styles.container} aria-hidden={!isLoading}>
			<LoadingOverlay
				visible={isLoading}
				overlayColor={"#fff"}
				overlayBlur={2}
				overlayOpacity={0.6}
				transitionDuration={500}
				exitTransitionDuration={500}
				loaderProps={{ size: "xl" }}
				keepMounted
			/>
		</div>
	);
}
