export default function Button({ children, ...props }) {
  return (
    <button
      {...props}
      className="w-full bg-black text-white p-3 rounded"
    >
      {children}
    </button>
  );
}