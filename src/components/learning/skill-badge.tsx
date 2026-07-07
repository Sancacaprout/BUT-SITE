export function SkillBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-md border border-line bg-surface px-2 py-1 text-xs font-medium text-muted-foreground">
      {children}
    </span>
  );
}
