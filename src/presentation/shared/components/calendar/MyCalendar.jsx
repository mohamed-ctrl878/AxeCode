import React from "react";
// import GitHubCalendar from "react-github-calendar";

const myData = [
  { date: "2024-01-01", count: 2 },
  { date: "2024-01-02", count: 5 },
  { date: "2024-01-03", count: 8 },
  { date: "2024-01-04", count: 3 },
  { date: "2024-01-05", count: 6 },
  { date: "2024-01-06", count: 4 },
  { date: "2024-01-07", count: 9 },
  { date: "2024-01-08", count: 1 },
  { date: "2024-01-09", count: 7 },
  { date: "2024-01-10", count: 3 },
  { date: "2024-01-11", count: 5 },
  { date: "2024-01-12", count: 8 },
  { date: "2024-01-13", count: 2 },
  { date: "2024-01-14", count: 6 },
  { date: "2024-01-15", count: 4 },
  { date: "2024-01-16", count: 9 },
  { date: "2024-01-17", count: 1 },
  { date: "2024-01-18", count: 7 },
  { date: "2024-01-19", count: 3 },
  { date: "2024-01-20", count: 5 },
  { date: "2024-01-21", count: 8 },
  { date: "2024-01-22", count: 2 },
  { date: "2024-01-23", count: 6 },
  { date: "2024-01-24", count: 4 },
  { date: "2024-01-25", count: 9 },
  { date: "2024-01-26", count: 1 },
  { date: "2024-01-27", count: 7 },
  { date: "2024-01-28", count: 3 },
  { date: "2024-01-29", count: 5 },
  { date: "2024-01-30", count: 8 },
  { date: "2024-01-31", count: 2 },
  // يمكنك إضافة المزيد من البيانات حسب الحاجة
];

function MyCalendar({ theme }) {
  // تحديد نظام الألوان بناءً على الثيم
  const colorScheme = theme ? "dark" : "light";

  return (
    <div
      className="card card-elevated"
      style={{
        padding: "1.5rem",
        marginBottom: "1rem",
      }}
    >
      <h3
        style={{
          color: "var(--text-primary)",
          marginBottom: "1rem",
          fontSize: "1.25rem",
          fontWeight: "600",
        }}
      >
        نشاط التطوير
      </h3>
      <div
        style={{
          backgroundColor: "var(--bg-card)",
          borderRadius: "0.5rem",
          padding: "1rem",
          border: "1px solid var(--border-primary)",
        }}
      >
        {/* <GitHubCalendar
          values={myData}
          colorScheme={colorScheme}
          fontSize={12}
          blockSize={12}
          blockMargin={4}
          hideColorLegend={false}
          hideMonthLabels={false}
          showWeekdayLabels={true}
          style={{
            color: "var(--text-primary)",
          }}
        /> */}
      </div>
      <p
        style={{
          color: "var(--text-secondary)",
          fontSize: "0.875rem",
          marginTop: "1rem",
          textAlign: "center",
        }}
      >
        يوضح هذا الرسم البياني نشاط التطوير خلال الشهر الماضي
      </p>
    </div>
  );
}

export default MyCalendar;
