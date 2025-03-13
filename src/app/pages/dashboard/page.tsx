import UsersTable from "../../components/UserTable";

export default function DashboardPage() {
  return (
    <div className="p-8 bg-gray-800">
      <h1 className="text-2xl text-white font-bold mb-4">VERSUS&#8482; Admin Dashboard</h1>
      <UsersTable />
    </div>
  );
}
