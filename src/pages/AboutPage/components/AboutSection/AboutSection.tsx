import { useNavigate } from "react-router-dom";
import styles from "./AboutSection.module.css";
import { HiArrowLongRight } from "react-icons/hi2";

interface AboutSectionProps {
  aboutText: string;
  btnName: string;
  btnUrl: string;
}
export default function AboutSection({
  aboutText,
  btnName,
  btnUrl,
}: AboutSectionProps) {
  const navigate = useNavigate();
  const navigateToSupport = () => {
    navigate("/support");
  };

  return (
    <div className={styles.aboutContainer}>
      <div className={styles.aboutContent}>{aboutText}</div>
      <button
        onClick={
          btnName === "Support Us!"
            ? navigateToSupport
            : () => {
                window.open(btnUrl);
              }
        }
        className={styles.greenBtn}
      >
        <div className={styles.btnName}>{btnName}</div>
        <div className={styles.btnIcon}></div>
        <HiArrowLongRight className={styles.arrow} />
      </button>
    </div>
  );
}
