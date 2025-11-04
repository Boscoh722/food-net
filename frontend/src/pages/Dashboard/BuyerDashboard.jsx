export default function BuyerDashboard() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Dashboard</h1>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="font-bold mb-2">Active Orders</h3>
          <p className="text-2xl text-primary">2</p>
        </div>
        <div className="card">
          <h3 className="font-bold mb-2">Saved Items</h3>
          <p className="text-2xl">5</p>
        </div>
      </div>
    </div>
  );
}
