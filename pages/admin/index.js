import { useAuth } from "../../utils/auth";
import Navbar from "../../components/Navbar";
import Link from "next/link";

export default function AdminIndex() {
  const auth = useAuth();
  const admin = auth?.authState?.tokenResult?.claims?.admin;
  if (!admin) {
    return "Access Denied";
  }
  return (
    <>
      <Navbar />
      <ol>
        <li>
          <Link href="/admin/add_users">Add Users</Link>
        </li>
        <li>
          <Link href="/admin/remove_users">Remove Users</Link>
        </li>
        <li>
          <Link href="/admin/add_resources">Add Resources</Link>
        </li>
        <li>
          <Link href="/admin/edit_resource_schema">Edit Resource Skeleton</Link>
        </li>
        <li>
          <Link href="/resources/usage">View Resource Usage</Link>
        </li>
      </ol>
    </>
  );
}
