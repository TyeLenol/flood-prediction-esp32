interface StatusBadgeProps {
  status: 'Normal' | 'Warning' | 'Danger';
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const getStyles = () => {
    switch (status) {
      case 'Normal':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'Warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Danger':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border ${getStyles()}`}
    >
      {status}
    </span>
  );
}
