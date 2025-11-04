export default function ProductDetail() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="card max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Product Name</h1>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-gray-200 border-2 border-dashed rounded-xl h-64" />
          <div>
            <p className="text-lg mb-2"><strong>Location:</strong> Nairobi</p>
            <p className="text-lg mb-4"><strong>Price:</strong> KSh 500</p>
            <button className="btn-primary w-full">Place Order</button>
          </div>
        </div>
      </div>
    </div>
  );
}
