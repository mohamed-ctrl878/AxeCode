import React from "react";
// import style from "../../../styles/pages/practice.module.css";
import { Link } from "react-router-dom";

const ProblemUnit = ({ problemName, data, theme }) => {
  const unit = data?.problems?.map((e) => {
    const dif = e?.dificulty;
    if (e.tittle.toLowerCase().includes(problemName.toLowerCase()))
      return (
        <tr key={e.id}>
          <td>
            <span className={e.status ? "" : ""}></span>
          </td>
          <td>
            <Link title={e.tittle} to={`/practice/description/${e.documentId}`}>
              {<span>{e.tittle}</span>}
            </Link>
          </td>
          <td>
            <span
              className={
                dif == "esay"
                  ? ""
                  : dif == "medium"
                  ? ""
                  : dif == "hard"
                  ? ""
                  : ""
              }
            >
              {e.dificulty}
            </span>
          </td>
        </tr>
      );
  });

  return <>{unit}</>;
};

export default ProblemUnit;
