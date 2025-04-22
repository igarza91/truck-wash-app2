export function Button({ children, onClick, className = '', variant = '', size = 'md' }) {
  const base = "rounded-2xl px-4 py-2 font-semibold shadow";
  const styles = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    outline: "border border-blue-600 text-blue-600 hover:bg-blue-100",
    destructive: "bg-red-600 text-white hover:bg-red-700"
  };
  return (
    <button onClick={onClick} className={`${base} ${styles[variant] || styles.default} ${className}`}>
      {children}
    </button>
  );
}
