"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

export default function CourseNavigation() {
  const { cid } = useParams<{ cid: string }>();
  const pathname = usePathname();

  const items = [
    { id: "wd-course-home-link",         label: "Home",        href: `/Courses/${cid}/Home` },
    { id: "wd-course-modules-link",      label: "Modules",     href: `/Courses/${cid}/Modules` },
    { id: "wd-course-piazza-link",       label: "Piazza",      href: `/Courses/${cid}/Piazza` },
    { id: "wd-course-zoom-link",         label: "Zoom",        href: `/Courses/${cid}/Zoom` },
    { id: "wd-course-assignments-link",  label: "Assignments", href: `/Courses/${cid}/Assignments` }, 
    { id: "wd-course-quizzes-link",      label: "Quizzes",     href: `/Courses/${cid}/Quizzes` },     
    { id: "wd-course-grades-link",       label: "Grades",      href: `/Courses/${cid}/Grades` },
    { id: "wd-course-people-link",       label: "People",      href: `/Courses/${cid}/People/Table` },
  ];

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  return (
    <div id="wd-courses-navigation" className="wd list-group fs-5 rounded-0">
      {items.map(item => (
        <Link
          key={item.id}
          id={item.id}
          href={item.href}
          className={`list-group-item border-0 ${isActive(item.href) ? "active" : "text-danger"}`}
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
}