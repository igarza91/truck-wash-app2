export function Card({ children }) {
  return <div className="bg-white p-4 rounded-2xl shadow">{children}</div>;
}

export function CardContent({ children, className }) {
  return <div className={className}>{children}</div>;
}
