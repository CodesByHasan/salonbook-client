export default function EmptyState({ icon: Icon, title, text, action }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed px-4 py-14 text-center">
      {Icon && <Icon className="size-10 text-muted-foreground" />}
      <h2 className="text-lg font-semibold">{title}</h2>
      {text && <p className="max-w-sm text-sm text-muted-foreground">{text}</p>}
      {action}
    </div>
  );
}