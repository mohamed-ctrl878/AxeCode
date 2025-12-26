import React from "react";
import style from "@presentation/styles/pages/add-lesson-course.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

const LessonSelector = ({ setData, element, currentSelection }) => {
  // Ensure currentSelection is an array
  const selectedIds = Array.isArray(currentSelection) ? currentSelection : [];
  const isSelected = selectedIds.includes(element.id);

  const handleClick = () => {
    setData((prev) => {
      const current = Array.isArray(prev) ? prev : [];
      if (current.includes(element.id)) {
        return current.filter((id) => id !== element.id);
      } else {
        return [...current, element.id];
      }
    });
  };

  return (
    <div>
      <div className={style.courseSlide}>
        <h4
          onClick={handleClick}
          className={`${style.courseTitle} ${isSelected ? style.activeItem : ""}`}
          key={element.id}
          style={{ 
            border: isSelected ? '2px solid #4CAF50' : '1px solid #ccc',
            backgroundColor: isSelected ? 'rgba(76, 175, 80, 0.1)' : 'transparent',
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          <div className={style.weekItem}>{element.title}</div>
          {isSelected && <FontAwesomeIcon icon={faCheck} color="#4CAF50" />}
        </h4>
      </div>
    </div>
  );
};

export default LessonSelector;
