export default function SellerDashboard() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Seller Dashboard</h1>
      <button className="btn-primary mb-6">+ Post New Product</button>
      <div className="card">
        <p className="text-center text-gray-500 py-8">No products posted yet.</p>
      </div>
    </div>
  );
}
