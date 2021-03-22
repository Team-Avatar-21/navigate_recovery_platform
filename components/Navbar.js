import { useState } from "react";
import { useAuth } from "../utils/auth";
import Link from "next/link";

export default function Navbar() {
  const auth = useAuth();
  const admin = auth?.authState?.tokenResult?.claims?.admin;
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        width: "25%",
      }}
    >
      {auth?.user ? (
        <>
          <button onClick={() => auth.signout()}>Logout</button>
          <span>{auth.user.email}</span>{" "}
        </>
      ) : (
        <>
          {/* <Link href="/auth/signup">Signup</Link> */}
          <Link href="/auth/signin">Signin</Link>
        </>
      )}
      {admin ? <Link href="/admin/add_users">Add Users</Link> : ""}
      <Link href="/"> Main</Link>
    </div>
  );
}
