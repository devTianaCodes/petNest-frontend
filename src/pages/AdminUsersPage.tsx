import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { getUsers, updateUserStatus } from "../api/admin";
import { QueryStateNotice } from "../components/QueryStateNotice";

export function AdminUsersPage() {
  const queryClient = useQueryClient();
  const [message, setMessage] = useState<string | null>(null);
  const usersQuery = useQuery({
    queryKey: ["admin-users"],
    queryFn: getUsers
  });
  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: "ACTIVE" | "SUSPENDED" }) => updateUserStatus(id, status),
    onSuccess: async () => {
      setMessage("User status updated.");
      await queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: () => {
      setMessage(null);
    }
  });

  return (
    <section className="space-y-6">
      <h1 className="text-4xl font-semibold tracking-tight text-ink">Users</h1>
      {message ? <p className="text-sm text-emerald-700">{message}</p> : null}
      {statusMutation.isError ? <p className="text-sm text-rose-700">{(statusMutation.error as Error).message}</p> : null}
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
                <th className="px-6 py-4">Verified</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {usersQuery.data?.users.map((user) => {
                const isUpdating = statusMutation.isPending && statusMutation.variables?.id === user.id;
                const nextStatus = user.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE";

                return (
                  <tr key={user.id}>
                    <td className="px-6 py-4">{user.fullName}</td>
                    <td className="px-6 py-4">{user.email}</td>
                    <td className="px-6 py-4">{user.role}</td>
                    <td className="px-6 py-4">{user.isEmailVerified ? "Verified" : "Pending"}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          user.status === "ACTIVE" ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {user.role === "ADMIN" ? (
                        <span className="text-stone-400">Protected</span>
                      ) : (
                        <button
                          type="button"
                          disabled={statusMutation.isPending}
                          className={`rounded-full px-4 py-2 text-sm font-medium text-white disabled:opacity-70 ${
                            user.status === "ACTIVE" ? "bg-rose-600" : "bg-emerald-600"
                          }`}
                          onClick={() => {
                            if (!window.confirm(`${user.status === "ACTIVE" ? "Suspend" : "Activate"} ${user.fullName}?`)) {
                              return;
                            }
                            setMessage(null);
                            statusMutation.mutate({ id: user.id, status: nextStatus });
                          }}
                        >
                          {isUpdating ? "Saving..." : user.status === "ACTIVE" ? "Suspend" : "Activate"}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <QueryStateNotice title="No users found" message="No users exist in the database yet." />
      )}
    </section>
  );
}
