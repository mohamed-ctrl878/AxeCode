import { uploadCourseStore } from "@data/storage/storeRx/Course&LessonStore/uploadCourse&LessonStore";
import { storeOfProblem } from "@data/storage/storeRx/problemSlices/uploadProblemStore";
import Login from "@presentation/pages/auth/routes/Login";
import RegisterMultiStep from "@presentation/pages/auth/routes/RegisterMultiStep";
import Community from "@presentation/pages/community/routes/Community";
import AddCourse from "@presentation/pages/course/routes/AddCourse";
import Courses from "@presentation/pages/course/routes/Courses";
import CoursePreview from "@presentation/pages/course/routes/CoursePreview";
import CourseContent from "@presentation/pages/course/routes/CourseContent";
import TechEvent from "@presentation/pages/events/routes/TechEvent";
import EventsListing from "@presentation/pages/events/routes/EventsListing";
import Home from "@presentation/pages/home/routes/Home";
import AddLesson from "@presentation/pages/lesson/routes/AddLesson";
import Lesson from "@presentation/pages/lesson/routes/Lesson";
import Practice from "@presentation/pages/problem/routes/Practice";
import ProblemModern from "@presentation/pages/problem/routes/ProblemModern";
import UploadProblem from "@presentation/pages/problem/routes/UploadProblem";
import Settings from "@presentation/pages/settings/routes/Settings";
import ErrComponent from "@presentation/shared/components/ui/error/ErrComponent";
import { Provider } from "react-redux";
import ResetPassword from "@presentation/pages/auth/routes/ResetPassword";
import ForgetPassword from "@presentation/pages/auth/routes/ForgetPassword";
import EmailConfirmation from "@presentation/pages/auth/routes/EmailConfirmation";
import LiveStream from "./LiveStream";
import LiveViewer from "./LiveViewer";

export const routes = (data, theme, themeClass) => [
  { path: "/", element: <Home theme={theme} auth={!!data} /> },
  {
    path: "/register",
    element: !data ? (
      <RegisterMultiStep theme={theme} />
    ) : (
      <ErrComponent theme={theme} />
    ),
  },
  {
    path: "/login",
    element: !data ? <Login theme={theme} /> : <ErrComponent theme={theme} />,
  },
  {
    path: "/settings",
    children: [
      { index: true, element: <Settings user={data} theme={theme} /> },
      { path: ":topic", element: <Settings user={data} theme={theme} /> },
      {
        path: "profile/add-course",
        element:
          data?.role?.name === "publisher" ? (
            <Provider store={uploadCourseStore}>
              <AddCourse theme={theme} />
            </Provider>
          ) : (
            <ErrComponent theme={theme} />
          ),
      },
      {
        path: "profile/add-lesson",
        element:
          data?.role?.name === "publisher" ? (
            <Provider store={uploadCourseStore}>
              <AddLesson theme={theme} />
            </Provider>
          ) : (
            <ErrComponent theme={theme} />
          ),
      },
      {
        path: "profile/add-problem",
        element:
          data?.role?.name === "publisher" ? (
            <Provider store={storeOfProblem}>
              <UploadProblem theme={theme} />
            </Provider>
          ) : (
            <ErrComponent theme={theme} />
          ),
      },
    ],
  },
  { path: "/practice", element: <Practice theme={theme} /> },
  {
    path: "/problem/:id",
    element: <ProblemModern user={data} userState={!!data} theme={theme} />,
  },
  { path: "/courses", element: <Courses theme={theme} /> },
  { path: "/courses/:id", element: <Lesson theme={theme} /> },
  { path: "/courses/:id/preview", element: <CoursePreview theme={theme} /> },
  { path: "/courses/:id/content", element: <CourseContent theme={theme} /> },
  { path: "/events", element: <EventsListing theme={theme} /> },
  { path: "/events/:id", element: <TechEvent theme={theme} /> },
  { path: "/community", element: <Community theme={theme} /> },
  { path: "/reset-password", element: <ResetPassword /> },
  { path: "/forget-password", element: <ForgetPassword /> },
  { path: "/api/email-confirmation", element: <EmailConfirmation /> },
  { path: "/live", element: <LiveStream /> },
  { path: "/view", element: <LiveViewer /> },
  { path: "*", element: <ErrComponent theme={theme} /> },
];
