"use client";
import { usePathname } from "next/navigation";
import { FaAlignJustify } from "react-icons/fa6";

export default function Breadcrumb({ 
  course 
}: { 
  course?: { name: string } 
}) {
  const pathname = usePathname();
  
  return (
    <h2 className="text-danger">
      <FaAlignJustify className="me-3 fs-4 mb-1" />
      {course?.name} &gt; {pathname.split("/").pop()}
    </h2>
  );
}