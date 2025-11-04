export default function ProductCard({ product }) {
  return (
    <div className="card hover:shadow-lg transition">
      <img src="/api/placeholder/400/300" alt={product.name} className="w-full h-48 object-cover rounded" />
      <div className="p-4">
        <h3 className="font-bold text-lg">{product.name}</h3>
        <p className="text-sm text-gray-600">{product.location}</p>
        <p className="text-primary font-bold mt-2">KSh {product.price}</p>
        <button className="btn-primary w-full mt-3">Order Now</button>
      </div>
    </div>
  );
}
