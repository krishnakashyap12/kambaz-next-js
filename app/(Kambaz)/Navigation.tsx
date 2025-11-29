"use client"
import { AiOutlineDashboard } from "react-icons/ai";
import { IoCalendarOutline } from "react-icons/io5";
import { LiaBookSolid, LiaCogSolid } from "react-icons/lia";
import { FaInbox, FaRegCircleUser } from "react-icons/fa6";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ListGroup, ListGroupItem } from "react-bootstrap";
export default function KambazNavigation() {
  const pathname = usePathname();
  const links = [
    { label: "Dashboard", path: "/Dashboard", icon: AiOutlineDashboard },
    { label: "Courses",   path: "/Dashboard", icon: LiaBookSolid },
    { label: "Calendar",  path: "/Calendar",  icon: IoCalendarOutline },
    { label: "Inbox",     path: "/Inbox",     icon: FaInbox },
    { label: "Labs",      path: "/Labs",             icon: LiaCogSolid },
  ];
  return (
    <ListGroup id="wd-kambaz-navigation" style={{width: 120}}
         className="rounded-0 position-fixed bottom-0 top-0 d-none d-md-block bg-black z-2">
      <ListGroupItem id="wd-neu-link" target="_blank" href="https://www.northeastern.edu/"
        action className="bg-black border-0 text-center">
        <img src="/images/NEU.png" width="75px" /></ListGroupItem>
      <ListGroupItem
        className={`text-center border-0 bg-black
            ${pathname.includes("Account") ? "bg-white text-danger" : "bg-black text-white"}`}>
        <Link href="/Account" className={`text-decoration-none ${pathname.includes("Account") ? "text-danger" : "text-white"}`}>
          <FaRegCircleUser
            className={`fs-1 ${pathname.includes("Account") ? "text-danger" : "text-white"}`} />
          <br />
          Account
        </Link>
      </ListGroupItem>
      {links.map((link) => (
        <ListGroupItem key={link.label}
          className={`bg-black text-center border-0
              ${pathname.includes(link.label) ? "text-danger bg-white" : "text-white bg-black"}`}>
          <Link href={link.path} className={`text-decoration-none d-block ${pathname.includes(link.label) ? "text-danger" : "text-white"}`}>
            {link.icon({ className: "fs-1 text-danger"})}
            <br />
            {link.label}
          </Link>
        </ListGroupItem>
      ))}
    </ListGroup>
);}