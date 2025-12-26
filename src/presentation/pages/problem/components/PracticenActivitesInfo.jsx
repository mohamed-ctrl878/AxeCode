import Calendar from "@presentation/shared/components/calendar/Clender";
import ProgressBar from "@presentation/shared/components/loading/ProgressBar";
import React from "react";
import { useSelector } from "react-redux";

const PracticenActivitesInfo = ({ problems, totalSolved, style }) => {
  const  isDark  = useSelector((state) => state.themeSlice.theme);

  return (
    <div className={style?.sidebarCard || "card"}>
      <h2 className={style?.coursesTitle || "text-xl font-bold mb-4"} style={{ fontSize: '1.5rem', marginBottom: '1rem', borderBottom: 'none' }}>
        Practice Activities
      </h2>
      <div className="mb-6">
        <h3 className={style?.filterLabel || "mb-2 text-lg font-medium"}>
          Progress
        </h3>
        <ProgressBar problems={problems} totalSolved={totalSolved} />
      </div>
      <div>
        <h3 className={style?.filterLabel || "mb-2 text-lg font-medium"}>
          Activity Calendar
        </h3>
        <Calendar />
      </div>
    </div>
  );
};

export default React.memo(PracticenActivitesInfo);
