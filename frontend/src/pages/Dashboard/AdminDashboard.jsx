export default function AdminDashboard() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card text-center">
          <h3 className="font-bold">Pending Sellers</h3>
          <p className="text-2xl text-primary">3</p>
        </div>
        <div className="card text-center">
          <h3 className="font-bold">Complaints</h3>
          <p className="text-2xl text-red-600">5</p>
        </div>
        <div className="card text-center">
          <h3 className="font-bold">Total Users</h3>
          <p className="text-2xl">127</p>
        </div>
      </div>
    </div>
  );
}
