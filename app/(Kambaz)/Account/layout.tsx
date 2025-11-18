import type { ReactNode } from "react";
import AccountNavigation from "./Navigation";
export default function AccountLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <div id="wd-account" className="d-flex">
      {/* Sidebar (hide on small screens like Canvas) */}
      <div className="d-none d-md-block me-3" style={{ minWidth: 220 }}>
        <AccountNavigation />
      </div>

      {/* Main content */}
      <div className="flex-fill">{children}</div>
    </div>
  );
}