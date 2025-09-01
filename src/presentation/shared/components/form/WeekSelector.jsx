import React from "react";

const WeekSelector = ({ setWeeks,style,data }) => {
  return data.length > 0 ? (
    data.map((week, index) => <div onClick={()=>setWeeks(e=>[...e,week.id])} className={style} key={index}>{week.title}</div>)
  ) : (
    <div>No weeks</div>
  );
};

export default WeekSelector;
