// items: [["Label", value], ...]. Value can be text or JSX (a badge).
export default function DetailList({ items }) {
  return (
    <dl className="grid gap-3 text-sm">
      {items.map(([label, value]) => (
        <div key={label} className="grid grid-cols-3 gap-2">
          <dt className="text-muted-foreground">{label}</dt>
          <dd className="col-span-2 font-medium break-words">{value ?? "—"}</dd>
        </div>
      ))}
    </dl>
  );
}