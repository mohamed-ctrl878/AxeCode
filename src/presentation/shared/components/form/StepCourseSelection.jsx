import React, { useRef, useState } from "react";
// import usePaginationContent from "./usePaginationContent";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretRight, faRotateRight } from "@fortawesome/free-solid-svg-icons";
import DataMapping from "./dataMapping";
import useOPTAndPGN from "./useOPTAndPGN";
// import { usePaginationContent } from "@/presentation/shared/hooks";

const StepCourseSelection = ({
  dataSetter,
  style,
  searchInput,
  setSearchInput,
  maping,
  className,
  selectionType = "",
  core,
  caseUse,
  query,
  storeName,
  probertyItem,
  Component,
}) => {
  const [data, setData] = useState(null);
  const [fail, setFail] = useState(false);
  const [error, setError] = useState("");
  const [start, setStart] = useState(1);
  const [load, setLoad] = useState(false);
  const [success, setSuccess] = useState(false);
  const [change, setChange] = useState("");
  const [lastChange, setLastChange] = useState("");
  const prevChange = useRef(change);
  useOPTAndPGN({
    setLoad,
    change,
    prevChange,
    setLastChange,
    start,
    core,
    caseUse,
    setError,
    setSuccess,
    setFail,
    setData,
    query,
    load,
    lastChange,
  });
  return (
    <div className={`${style.step} ${style.active}`} id="step4">
      <div className={style.formGroup}>
        <h3 className={style.stepTitle}>{selectionType} Selection</h3>
        <p className={style.stepSubtitle}>
          {selectionType} the {selectionType} for this lesson
        </p>
        <section className={`${style.popup} `}>
          <div className={style.popupContent}>
            <h4 className={style.popupTitle}>Select {selectionType}</h4>
            <div className={style.searchInputBox}>
              <input
                className={style.formControl}
                value={searchInput}
                onChange={(e) => setChange(e.currentTarget.value)}
                type="search"
                placeholder={`Search ${selectionType}...`}
              />
              {load && (
                <div className={style.iconLoad}>
                  <FontAwesomeIcon icon={faRotateRight} spin spinReverse />
                </div>
              )}
            </div>
            <div className={`${style.popupList} ${className}`}>
              <DataMapping
                setError={setError}
                probertyItem={probertyItem}
                storeName={storeName}
                data={data?.data}
                Component={Component}
                dataSetter={dataSetter}
              ></DataMapping>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default StepCourseSelection;
