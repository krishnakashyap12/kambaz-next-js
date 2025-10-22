"use client";
import React from "react";
import { usePathname, useParams } from "next/navigation";
import { FaAlignJustify } from "react-icons/fa6";

export default function Breadcrumb({
  course,
}: {
  course: { name: string } | undefined;
}) {
  const pathname = usePathname();
  const { cid } = useParams();

  const pathAfterCourse = pathname.split(`/Courses/${cid}/`)[1] || "";
  const parts = pathAfterCourse ? pathAfterCourse.split("/") : [];

  return (
    <h2 className="text-danger">
      <FaAlignJustify className="me-3 fs-4 mb-1" />
      {course?.name}
      {parts.map((part, i) => (
        <span key={i}> &gt; {part}</span>
      ))}
    </h2>
  );
}
