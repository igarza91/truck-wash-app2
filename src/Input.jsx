export function Input({ value, onChange, ...props }) {
  return (
    <input
      className="w-full p-2 border rounded shadow-sm"
      value={value}
      onChange={onChange}
      {...props}
    />
  );
}
