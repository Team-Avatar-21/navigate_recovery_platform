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
        minWidth: "25%",
        maxWidth: "50%",
      }}
    >
      {auth?.user ? (
        <>
          <button onClick={() => auth.signout()}>Logout</button>
          <span>{auth.user.email}</span>{" "}
          <Link href="/resources">Resources</Link>
        </>
      ) : (
        <>
          {/* <Link href="/auth/signup">Signup</Link> */}
          <Link href="/auth/signin">Signin</Link>
        </>
      )}
      {admin ? <Link href="/admin">Admin</Link> : ""}
      <Link href="/"> Main</Link>
    </div>
  );
}
