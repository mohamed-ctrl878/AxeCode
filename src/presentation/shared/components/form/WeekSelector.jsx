import React from "react";
import style from "@presentation/styles/pages/add-lesson-course.module.css";

const WeekSelector = ({ setData, element }) => {
  console.log(element, "element in element? selector");
  return (
    <div>
      <div className={style.courseSlide}>
        <h4
          onClick={() => setData((e) => [...e, element.id])}
          className={style.courseTitle}
          key={element.id}
        >
          <div className={style.weekItem}>{element.title} </div>
        </h4>
      </div>
    </div>
  );
};

export default WeekSelector;
