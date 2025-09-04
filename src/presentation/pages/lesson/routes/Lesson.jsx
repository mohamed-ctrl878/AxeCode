import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

// Styles
// import style from "@presentation/styles/pages/lessons.module.css";
// import style from "@presentation/styles/pages/l";
const Lesson = ({ theme }) => {
  const [data, setData] = useState(null);
  const { id } = useParams();
  useEffect(() => {
    fetch(`http://localhost:1338/api/courses/${id}?populate=*`)
      .then((e) => e.json())
      .then((e) => setData(e));
  }, []);

  // console.log(theme);

  const mapping = data?.data?.lessons?.map((e, i) => {
    return (
      <Link key={i} className={theme} to={`${i}`}>
        <span>{i + 1}. </span>
        <div className={""}>
          <h3>{e.tittle}</h3>
          <p>{e.description[0].children[0].text}</p>
        </div>
      </Link>
    );
  });
  return (
    <div className={`container ${""}`}>
      <section className={`${theme} ${""}`}>
        {" "}
        <h1>{data?.data?.tittle}</h1>
      </section>
      <section className={""}>
        <div className={`${theme} ${""}`}>
          <h2>About This Course</h2>
          <p>{data?.data?.description[0].children[0].text}</p>
        </div>
        <div className={`${theme} ${""}`}>
          <h2>Course Lessons</h2>
          {mapping}
        </div>
      </section>
      <section className={""}>
        {" "}
        <div>
          <h3>let's Learning</h3>
          <h2>{data?.data?.tittle}</h2>
        </div>
        <Link to={"0"}>go!</Link>
      </section>
    </div>
  );
};

export default Lesson;
