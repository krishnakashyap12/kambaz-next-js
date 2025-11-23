"use client";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setCurrentUser } from "./reducer";
import * as client from "./client";
import { User } from "../types";

export default function Session({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const currentUser: User = await client.profile();
        dispatch(setCurrentUser(currentUser));
      } catch (err: unknown) {
        // 401 means not logged in, which is fine - just set user to null
        dispatch(setCurrentUser(null));
      }
    };
    fetchProfile();
  }, [dispatch]);

  return <>{children}</>;
}