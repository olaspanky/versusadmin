import UsersTable from "../../components/Signup";

export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-2xl text-white font-bold mb-4">VERSUS&#8482; Admin Dashboard</h1>
      <UsersTable />
    </div>
  );
}
