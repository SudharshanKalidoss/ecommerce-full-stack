import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { AdminLayout } from "../components/admin/AdminLayout";
import { adminUsersApi } from "../lib/admin-users-api";
import { useToast } from "../hooks/use-toast";

const isAdminUser = (user) => String(user?.role || "").toUpperCase() === "ADMIN";

const formatDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
};

export default function AdminUsers() {
  const { user, logout, authReady } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;
  const adminLoggedIn = isAdminUser(user);
  const pageStartIndex = (currentPage - 1) * itemsPerPage;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const data = await adminUsersApi.list({
          page: currentPage,
          limit: itemsPerPage,
          search: appliedSearch || undefined,
        });
        const list = data?.users || data?.items || [];
        setUsers(list);
        setTotalPages(Number(data?.totalPages || 1));
        setTotalItems(Number(data?.totalItems || list.length));
      } catch (error) {
        console.error("Failed to fetch admin users:", error);
        setUsers([]);
        setTotalPages(1);
        setTotalItems(0);
        toast({
          variant: "destructive",
          title: "Failed to load users",
          description: error.message || "Unable to fetch users.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [currentPage, appliedSearch, toast]);

  if (!authReady) {
    return (
      <AdminLayout user={user} onLogout={logout}>
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-600 shadow-sm">
          Loading users...
        </div>
      </AdminLayout>
    );
  }

  if (!adminLoggedIn) {
    return <Navigate to="/admin" replace />;
  }

  return (
    <AdminLayout user={user} onLogout={logout}>
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold text-slate-950 sm:text-2xl">Users</h1>
            <p className="text-sm text-slate-600">Total: {totalItems}</p>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setCurrentPage(1);
              setAppliedSearch(search.trim());
            }}
            className="flex w-full gap-2 sm:w-auto"
          >
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search users..."
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-fuchsia-500 sm:w-64"
            />
            <button
              type="submit"
              className="rounded-xl bg-fuchsia-600 px-4 py-2 text-sm font-semibold text-white hover:bg-fuchsia-500"
            >
              Search
            </button>
          </form>
        </div>

        <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50 text-left">
              <tr>
                <th className="px-3 py-3 font-semibold text-slate-700">S.No</th>
                <th className="px-3 py-3 font-semibold text-slate-700">Name</th>
                <th className="px-3 py-3 font-semibold text-slate-700">Email</th>
                <th className="px-3 py-3 font-semibold text-slate-700">Phone</th>
                <th className="px-3 py-3 font-semibold text-slate-700">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-3 py-8 text-center text-slate-500">
                    Loading users...
                  </td>
                </tr>
              ) : users.length > 0 ? (
                users.map((entry, index) => (
                  <tr key={entry.id} className="transition hover:bg-fuchsia-50/60">
                    <td className="px-3 py-3 text-slate-700">{pageStartIndex + index + 1}</td>
                    <td className="px-3 py-3 font-medium text-slate-800">
                      {`${entry.firstName || ""} ${entry.lastName || ""}`.trim() || "-"}
                    </td>
                    <td className="px-3 py-3 text-slate-700">{entry.email || "-"}</td>
                    <td className="px-3 py-3 text-slate-700">{entry.phoneNumber || "-"}</td>
                    <td className="px-3 py-3 text-slate-500">{formatDate(entry.createdAt)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-3 py-8 text-center text-slate-500">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 disabled:opacity-50"
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              type="button"
              onClick={() => setCurrentPage(page)}
              className={`h-9 w-9 rounded-lg text-sm font-semibold ${
                currentPage === page ? "bg-fuchsia-600 text-white" : "border border-slate-200 bg-white text-slate-700"
              }`}
            >
              {page}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}
