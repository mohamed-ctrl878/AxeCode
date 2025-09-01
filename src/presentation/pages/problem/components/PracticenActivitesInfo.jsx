import Calendar from "@presentation/shared/components/calendar/Clender";
import ProgressBar from "@presentation/shared/components/loading/ProgressBar";
import React from "react";
import { useSelector } from "react-redux";

const PracticenActivitesInfo = ({ problems, totalSolved }) => {
  const  isDark  = useSelector((state) => state.themeSlice.theme);

  return (
    <div
      className={`mt-4 rounded-lg p-6 ${
        isDark ? "bg-gray-800" : "bg-white"
      } shadow-lg`}
    >
      <h2 className="mb-4 text-xl font-semibold dark:text-white">
        Practice Activities
      </h2>
      <div className="mb-6">
        <h3 className="mb-2 text-lg font-medium dark:text-gray-300">
          Progress
        </h3>
        <ProgressBar problems={problems} totalSolved={totalSolved} />
      </div>
      <div>
        <h3 className="mb-2 text-lg font-medium dark:text-gray-300">
          Activity Calendar
        </h3>
        <Calendar />
      </div>
    </div>
  );
};

export default React.memo(PracticenActivitesInfo);
