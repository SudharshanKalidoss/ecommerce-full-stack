export default function Input({ label, error, ...props }) {
  return (
    <div className="mb-4">
      {label && <label className="block mb-1">{label}</label>}
      
      <input
        {...props}
        className="w-full p-3 border rounded"
      />

      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}
    </div>
  );
}