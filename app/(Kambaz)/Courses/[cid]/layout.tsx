import type { ReactNode } from "react";
import CourseNavigation from "./Navigation";
import { FaAlignJustify } from "react-icons/fa";
import { courses } from "../../Database";
import Breadcrumb from "./Breadcrumb";

type Props = {
  children: ReactNode;
  params: Promise<{ cid: string }>;
};

export default async function CoursesLayout({ children, params }: Props) {
  const { cid } = await params;
  const course = courses.find((c: { _id: string }) => c._id === cid);

  return (
    <div id="wd-courses">
      <h2 className="text-danger d-flex align-items-center">
        <span aria-hidden="true" className="me-3">
        </span>
        <Breadcrumb course={course} />
      </h2>
      <hr />
      <div className="d-flex">
        <div className="d-none d-md-block me-3" style={{ minWidth: 220 }}>
          <CourseNavigation cid={cid} />
        </div>
        <div className="flex-fill">{children}</div>
      </div>
    </div>
  );
}