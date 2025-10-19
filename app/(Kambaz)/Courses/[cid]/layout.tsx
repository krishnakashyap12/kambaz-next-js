import { ReactNode } from "react";
import CourseNavigation from "./Navigation";
import Breadcrumb from "./Breadcrumb";
import { courses } from "../../Database";



export default async function CoursesLayout({
  children,
  params,
}: Readonly<{
  children: ReactNode;
  params: Promise<{ cid: string }>;
}>) {
  const { cid } = await params;
  const course = courses.find((c) => c._id === cid);

  return (
    <div id="wd-courses">
      <Breadcrumb course={course} />
      <hr />
      <div className="d-flex">
        <div className="d-none d-md-block">
          <CourseNavigation cid={cid} />
        </div>
        <div className="flex-fill">
          {children}
        </div>
      </div>
    </div>
  );
}