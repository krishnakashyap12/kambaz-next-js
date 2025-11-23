"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AccountPage() {
  const { currentUser, sessionChecked } = useSelector((state: RootState) => state.accountReducer);
  const router = useRouter();

  useEffect(() => {
    // Only redirect after session check is complete
    if (sessionChecked) {
      if (!currentUser) {
        router.push("/Account/Signin");
      } else {
        router.push("/Account/Profile");
      }
    }
  }, [currentUser, router, sessionChecked]);

  return null;
}