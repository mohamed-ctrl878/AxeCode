import React from "react";

const StepLinks = ({
  style,
  links,
  setLinks,
  linksName,
  setLinksName,
  getArrayFromLinks,
  displaylinksArr,
}) => {
  return (
    <div className={`${style.step} ${style.active}`} id="step5">
      <div className={style.formGroup}>
        <h3 className={style.stepTitle}>Additional Links</h3>
        <p className={style.stepSubtitle}>Add useful links for your lesson</p>

        <div className={style.linksWrapper}>
          <div className={style.formGroup}>
            <label htmlFor="link" className={style.formLabel}>
              Link URL
            </label>
            <input
              onChange={(e) => {
                setLinks(e.target.value);
              }}
              value={links}
              id="link"
              name="link"
              type="text"
              className={style.formControl}
              placeholder="https://example.com"
            />
          </div>

          <div className={style.formGroup}>
            <label htmlFor="link-name" className={style.formLabel}>
              Link Name
            </label>
            <input
              onChange={(e) => {
                setLinksName(e.target.value);
              }}
              value={linksName}
              id="link-name"
              name="link-name"
              type="text"
              className={style.formControl}
              placeholder="Link description"
            />
          </div>

          <button
            type="button"
            onClick={getArrayFromLinks}
            className={`${style.btn} ${style.btnSecondary}`}
          >
            Add Link
          </button>
        </div>

        {displaylinksArr && (
          <div className={style.linksList}>{displaylinksArr}</div>
        )}
      </div>
    </div>
  );
};

export default StepLinks;
