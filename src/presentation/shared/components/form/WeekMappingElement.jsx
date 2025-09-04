import { faCaretRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import WeekSelector from "./weekSelector";
import style from "@presentation/styles/pages/add-lesson-course.module.css";

const WeekMappingElement = ({ element, index, setData }) => {
  const [slideWeeks, setSlideWeeks] = useState(null);
  // console.log(slideWeeks, "slideWeeks");
  return (
    <div className={style.courseSlide}>
      <h4
        onClick={() => setSlideWeeks((e) => (e === index ? null : index))}
        className={style.courseTitle}
        key={element.id}
      >
        {element.title}{" "}
        <i>
          <FontAwesomeIcon
            className={`${slideWeeks === index ? style.rotate90Deg : ""} ${style.iconSlide}`}
            icon={faCaretRight}
          />
        </i>
      </h4>
      <div
        className={`${slideWeeks === index ? style.active : ""} ${
          style.weeksContainer
        }`}
      >
        <WeekSelector
          setWeeks={setData}
          style={style.weekItem}
          data={element.weeks || []}
        />
      </div>
    </div>
  );
};

export default WeekMappingElement;
