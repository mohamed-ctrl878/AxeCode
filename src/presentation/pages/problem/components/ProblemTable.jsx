import React, { useState } from "react";
import ProblemUnit from "./ProblemUnit";
// import { ProblemUnit } from ".";
// import style from "@presentation/styles/pages/practice.module.css";
// import ProblemUnit from "./ProblemUnit";

const ProblemTable = ({ data, theme }) => {
  const [topic, setTopic] = useState([]);
  const [nameProblem, setNameProblem] = useState("");

  const handllerTopic = (title) => {
    topic.includes(title)
      ? setTopic((e) => {
          return e.filter((el) => el != title);
        })
      : setTopic((e) => [...e, title]);
  };
  const handllerNameProblem = (title) => {
    setNameProblem(title);
  };

  console.log(nameProblem);
  const mapping = data?.map((e) => {
    if (topic.length == 0 || topic.includes(e.title))
      return (
        <ProblemUnit
          problemName={nameProblem}
          key={e.id}
          data={e}
          theme={theme}
        ></ProblemUnit>
      );
  });
  const choicers = data?.map((e) => {
    return (
      <span
        onClick={() => handllerTopic(e.title)}
        key={e.id}
        className={`${topic.includes(e.title) ? "" : ""}  ${theme}`}
      >
        {e?.title}
      </span>
    );
  });
  return (
    <>
      <div className={""}>
        <input
          value={nameProblem}
          onChange={(e) => setNameProblem(e.target.value)}
          type="problemname"
          placeholder="problem name"
        />
        {choicers}
      </div>
      <section className={""}>
        <table className={theme}>
          <thead>
            <tr>
              <th>status</th>
              <th>problem</th>
              <th>dificulty</th>
            </tr>
          </thead>
          <tbody>{mapping}</tbody>
        </table>
        <div className={""}>
          {/* <button
             
              className={theme}
              type="button"
            >
              previus
            </button>

            <button
              className={theme}
              type="button"
            >
              next
            </button> */}
        </div>
      </section>
    </>
  );
};

export default ProblemTable;
