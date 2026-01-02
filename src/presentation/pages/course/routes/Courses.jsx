import React, { useState } from "react";
import style from "@presentation/styles/pages/courses.module.css";
import useGetContent from "@presentation/shared/hooks/useGetContent";
import { getCoursesInfoExe } from "@domain/usecases/course/getCoursesInfoExe";
import { GetCourse } from "@data/repositories/courseImps/GetCourse";

// Optimized UI Components
import UniformHeader from "@presentation/shared/components/ui/UniformHeader";
import GenericFilters from "@presentation/shared/components/ui/GenericFilters";
import StatusHandler from "@presentation/shared/components/ui/StatusHandler";
import CourseCard from "../components/CourseCard";

const Courses = ({ theme }) => {
  async function caseUse() {
    return await getCoursesInfoExe(new GetCourse(), "populate=*");
  }
  
  const { load, data, error } = useGetContent({ caseUse });
  const [searchTerm, setSearchTerm] = useState("");

  // Get theme class
  const themeClass = theme ? "dark-theme" : "light-theme";

  // Filter logic
  const filteredCourses = (data || []).filter((course) => {
    const term = searchTerm.toLowerCase();
    return (
      course.title?.toLowerCase().includes(term) ||
      course.publisher?.toLowerCase().includes(term)
    );
  });

  return (
    <div className={`${style.coursesContainer} ${themeClass}`}>
      {/* Page Header */}
      <UniformHeader 
        title="Explore Our Courses"
        subtitle="Discover the perfect course to advance your skills and career with expert-led content"
        stats={[
          { value: data?.length || 0, label: "Total Courses" },
          { value: filteredCourses.length, label: "Showing" }
        ]}
      />

      {/* Search & Filters */}
      <GenericFilters 
        searchTerm={searchTerm} 
        onSearchChange={setSearchTerm}
        placeholder="Search courses or publishers..."
      />

      {/* Content Area with Status Handling */}
      <StatusHandler 
        loading={load} 
        error={error} 
        data={filteredCourses}
        theme={themeClass}
      >
        <div className={style.coursesGrid}>
          {filteredCourses.map((course) => (
            <CourseCard 
              key={course.documentId || course.id} 
              course={course} 
            />
          ))}
        </div>
      </StatusHandler>
    </div>
  );
};

export default Courses;
