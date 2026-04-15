import { useQuery } from "@tanstack/react-query";
import { getUsers } from "../api/admin";
import { QueryStateNotice } from "../components/QueryStateNotice";

export function AdminUsersPage() {
  const usersQuery = useQuery({
    queryKey: ["admin-users"],
    queryFn: getUsers
  });

  return (
    <section className="space-y-6">
      <h1 className="text-4xl font-semibold tracking-tight text-ink">Users</h1>
      {usersQuery.isError ? (
        <QueryStateNotice
          title="Users could not load"
          message={(usersQuery.error as Error).message || "The user list could not be fetched."}
          tone="error"
        />
      ) : usersQuery.isLoading ? (
        <QueryStateNotice title="Loading users" message="Fetching registered accounts." />
      ) : usersQuery.data?.users.length ? (
      <div className="rounded-[28px] bg-white shadow-sm ring-1 ring-black/5">
        <table className="min-w-full divide-y divide-stone-200 text-sm">
          <thead>
            <tr className="text-left text-stone-500">
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {usersQuery.data?.users.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4">{user.fullName}</td>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4">{user.role}</td>
                <td className="px-6 py-4">{user.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      ) : (
        <QueryStateNotice title="No users found" message="No users exist in the database yet." />
      )}
    </section>
  );
}
