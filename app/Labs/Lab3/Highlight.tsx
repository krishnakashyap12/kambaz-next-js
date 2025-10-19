import { ReactNode } from "react";
export default function Highlight({ children }: { children: ReactNode }) {
  return (
    <>
    <h3>Hilight</h3>
    <span id="wd-highlight" style={{ backgroundColor: "yellow", color: "red" }}>
      {children}
    </span>
    </>
    
  );
}
