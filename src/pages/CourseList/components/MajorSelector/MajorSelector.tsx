import React from "react";
import styles from "./MajorSelector.module.css";

interface MajorSelectorProps {
  item: {
    title: string;
    childrens?: Array<{ title: string }>; // Adjust according to the actual structure
  };
  open: boolean;
  handleSelectMajor: (major: string) => void;
  setOpen: (isOpen: boolean) => void;
  Selectmajor: string;
  selectedMajor: string;
}

// 전공 선택기
export default function MajorSelector({
  item,
  open,
  Selectmajor,
  handleSelectMajor,
  setOpen,
  selectedMajor,
}: MajorSelectorProps) {
  if (Selectmajor === "전공") {
    if (item.childrens) {
      return (
        <div className={open ? styles.open : styles.sidebarItem}>
          <div className={styles.sidebarTitle}>
            <span>{selectedMajor}</span>
            <i className="bi-chevron-down" onClick={() => setOpen(!open)}></i>
          </div>
          <div className={styles.sidebarContent}>
            {item.childrens.map((child, index) => (
              <MajorSelector
                key={index}
                Selectmajor={"전공"}
                item={child}
                open={open}
                handleSelectMajor={handleSelectMajor}
                setOpen={setOpen}
                selectedMajor={selectedMajor}
              />
            ))}
          </div>
        </div>
      );
    } else {
      return (
        <div>
          <button
            className={styles.myMajorBtn}
            onClick={() => handleSelectMajor(item.title)}
          >
            {item.title}
          </button>
        </div>
      );
    }
  }
  return null;
}
