export function ProgressBar({
  value,
  label,
}: {
  value: number;
  label?: string;
}) {
  const safeValue = Math.max(0, Math.min(100, Math.round(value)));

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3 text-sm">
        {label ? <span className="font-medium text-foreground">{label}</span> : null}
        <span className="font-mono text-muted-foreground">{safeValue}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-md bg-surface-muted" aria-hidden="true">
        <div
          className="h-full rounded-md bg-accent transition-all"
          style={{ width: `${safeValue}%` }}
        />
      </div>
    </div>
  );
}
