"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentUser } from "../reducer";
import { RootState } from "../../store";
import * as client from "../client";
import { User } from "../../types";
import { Form, Row, Col, Button } from "react-bootstrap";

export default function Profile() {
  const [profile, setProfile] = useState<Partial<User>>({});
  const dispatch = useDispatch();
  const router = useRouter();
  const { currentUser } = useSelector(
    (state: RootState) => state.accountReducer
  );

  const fetchProfile = async () => {
    try {
      const userProfile: User = await client.profile();
      setProfile(userProfile);
    } catch (err: unknown) {
      console.error("Error fetching profile:", err);
      router.push("/Account/Signin");
    }
  };

  const updateProfile = async () => {
    try {
      await client.updateUser(profile);
      const updatedUser: User = await client.profile();
      dispatch(setCurrentUser(updatedUser));
      alert("Profile updated successfully!");
    } catch (err: unknown) {
      console.error("Update error:", err);
      alert("Failed to update profile");
    }
  };

  const signout = async () => {
    try {
      await client.signout();
      dispatch(setCurrentUser(null));
      router.push("/Account/Signin");
    } catch (err: unknown) {
      console.error("Signout error:", err);
    }
  };

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div id="wd-profile-screen" style={{ maxWidth: 420 }}>
      <h1 className="mb-3">Profile</h1>
      {profile && (
        <Form>
          <Form.Control
            value={profile.username || ""}
            placeholder="username"
            className="mb-2"
            onChange={(e) =>
              setProfile({ ...profile, username: e.target.value })
            }
          />
          <Form.Control
            value={profile.password || ""}
            placeholder="password"
            type="password"
            className="mb-2"
            onChange={(e) =>
              setProfile({ ...profile, password: e.target.value })
            }
          />
          <Form.Control
            value={profile.firstName || ""}
            placeholder="First Name"
            className="mb-2"
            onChange={(e) =>
              setProfile({ ...profile, firstName: e.target.value })
            }
          />
          <Form.Control
            value={profile.lastName || ""}
            placeholder="Last Name"
            className="mb-2"
            onChange={(e) =>
              setProfile({ ...profile, lastName: e.target.value })
            }
          />
          <Row className="mb-2">
            <Col>
              <Form.Control
                value={profile.dob || ""}
                type="date"
                onChange={(e) =>
                  setProfile({ ...profile, dob: e.target.value })
                }
              />
            </Col>
          </Row>
          <Form.Control
            value={profile.email || ""}
            type="email"
            placeholder="email"
            className="mb-2"
            onChange={(e) =>
              setProfile({ ...profile, email: e.target.value })
            }
          />
          <Form.Select
            value={profile.role || "STUDENT"}
            className="mb-2"
            onChange={(e) =>
              setProfile({ ...profile, role: e.target.value as "STUDENT" | "FACULTY" | "ADMIN" })
            }
          >
            <option value="USER">User</option>
            <option value="ADMIN">Admin</option>
            <option value="FACULTY">Faculty</option>
            <option value="STUDENT">Student</option>
          </Form.Select>
          <Button
            variant="primary"
            className="w-100 mb-2"
            onClick={updateProfile}
          >
            Update
          </Button>
          <Button variant="danger" className="w-100" onClick={signout}>
            Signout
          </Button>
        </Form>
      )}
    </div>
  );
}