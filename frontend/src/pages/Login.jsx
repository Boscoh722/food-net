export default function Login() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto card">
        <h1 className="text-2xl font-bold text-center mb-6">Login to Food-Net</h1>
        <form className="space-y-4">
          <input type="email" placeholder="Email" className="w-full px-4 py-2 border rounded" />
          <input type="password" placeholder="Password" className="w-full px-4 py-2 border rounded" />
          <button type="submit" className="btn-primary w-full">Login</button>
        </form>
      </div>
    </div>
  );
}
