export default function Complaints() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Send Complaint</h1>
      <div className="card max-w-2xl mx-auto">
        <textarea 
          placeholder="Describe your issue..."
          className="w-full p-4 border rounded h-32"
        />
        <button className="btn-primary w-full mt-4">Submit Complaint</button>
      </div>
    </div>
  );
}
