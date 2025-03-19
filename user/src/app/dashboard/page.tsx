import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">User Dashboard</h1>
      <nav className="flex gap-4">
        <Link
          href="/dashboard/profile"
          className="p-2 bg-blue-500 text-white rounded"
        >
          Profile
        </Link>
        <Link
          href="/dashboard/reservations"
          className="p-2 bg-blue-500 text-white rounded"
        >
          Reservations
        </Link>
      </nav>
    </div>
  );
}
