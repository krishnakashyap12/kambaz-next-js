"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setCurrentUser } from "../reducer";
import * as client from "../client";
import { User } from "../../types";
import { useState } from "react";
import { FormControl, Button } from "react-bootstrap";

export default function Signup() {
  const [user, setUser] = useState<Partial<User>>({
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    email: "",
    role: "STUDENT",
  });
  const [verifyPassword, setVerifyPassword] = useState("");
  const router = useRouter();
  const dispatch = useDispatch();

  const signup = async () => {
    if (user.password !== verifyPassword) {
      alert("Passwords do not match!");
      return;
    }
    if (!user.username || !user.password) {
      alert("Please fill in all required fields!");
      return;
    }

    console.log("Trying to sign up with:", user);
    try {
      const newUser: User = await client.signup(user);
      console.log("Created user:", newUser);
      dispatch(setCurrentUser(newUser));
      router.push("/Dashboard");
    } catch (err: unknown) {
      console.error("Signup error:", err);
      alert("Signup failed. Username may already exist.");
    }
  };

  return (
    <div id="wd-signup-screen" style={{ maxWidth: 360 }}>
      <h1 className="mb-3">Signup</h1>
      <FormControl
        placeholder="username"
        className="mb-2"
        value={user.username}
        onChange={(e) => setUser({ ...user, username: e.target.value })}
      />
      <FormControl
        placeholder="password"
        type="password"
        className="mb-2"
        value={user.password}
        onChange={(e) => setUser({ ...user, password: e.target.value })}
      />
      <FormControl
        placeholder="verify password"
        type="password"
        className="mb-3"
        value={verifyPassword}
        onChange={(e) => setVerifyPassword(e.target.value)}
      />
      <Button onClick={signup} className="btn btn-primary w-100 mb-2">
        Signup
      </Button>
      <Link href="/Account/Signin" className="small">
        Signin
      </Link>
    </div>
  );
}