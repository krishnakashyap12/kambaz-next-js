"use client";
import React from "react";
import { usePathname, useParams } from "next/navigation";
import { FaAlignJustify } from "react-icons/fa6";

export default function Breadcrumb({
  course,
  onToggle,
}: {
  course?: { name: string };
  onToggle: () => void;
}) {
  const pathname = usePathname();
  const { cid } = useParams();

  // Extract everything after /Courses/:cid/
  const pathAfterCourse = pathname.split(`/Courses/${cid}/`)[1] || "";
  const parts = pathAfterCourse ? pathAfterCourse.split("/") : [];

  return (
    <h2 className="text-danger">
      <FaAlignJustify
        className="me-3 fs-4 mb-1"
        role="button"
        aria-label="Toggle course navigation"
        onClick={onToggle}
      />
      {course?.name}
      {parts.map((part, i) => (
        <span key={i}> &gt; {part}</span>
      ))}
    </h2>
  );
}