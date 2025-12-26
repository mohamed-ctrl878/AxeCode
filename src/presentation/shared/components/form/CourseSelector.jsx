import React from "react";
import style from "@presentation/styles/pages/add-lesson-course.module.css";

const CourseSelector = ({ setData, element, currentSelection }) => {
  const isSelected = currentSelection === element.id;

  const handleClick = () => {
    setData(element.id);
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
            backgroundColor: isSelected ? 'rgba(76, 175, 80, 0.1)' : 'transparent'
          }}
        >
          <div className={style.weekItem}>{element.title}</div>
        </h4>
      </div>
    </div>
  );
};

export default CourseSelector;
