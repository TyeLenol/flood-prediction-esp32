interface StatCardProps {
  title: string;
  value: number | string;
  unit?: string;
  icon?: React.ReactNode;
  className?: string;
}

export function StatCard({
  title,
  value,
  unit = '',
  icon,
  className = '',
}: StatCardProps) {
  return (
    <div
      className={`bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 p-6 shadow-sm ${className}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
            {title}
          </p>
          <div className="flex items-baseline gap-1 mt-2">
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-50">
              {typeof value === 'number' ? value.toFixed(1) : value}
            </p>
            {unit && (
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {unit}
              </p>
            )}
          </div>
        </div>
        {icon && <div className="text-slate-400 dark:text-slate-500">{icon}</div>}
      </div>
    </div>
  );
}
