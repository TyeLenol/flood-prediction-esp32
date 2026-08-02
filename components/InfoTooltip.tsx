'use client';

interface InfoTooltipProps {
  content: string;
}

/**
 * Small (?) icon that reveals a tooltip on hover/focus.
 * Accessible: uses role="tooltip", aria-label, and focus-visible ring.
 */
export function InfoTooltip({ content }: InfoTooltipProps) {
  return (
    <span className="relative inline-flex group">
      <button
        type="button"
        className="
          ml-1 inline-flex items-center justify-center
          w-4 h-4 rounded-full text-[9px] font-bold leading-none
          bg-slate-200 dark:bg-slate-700
          text-slate-500 dark:text-slate-400
          hover:bg-teal-100 dark:hover:bg-teal-900/50
          hover:text-teal-700 dark:hover:text-teal-300
          focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-1
          transition-colors cursor-help select-none
        "
        aria-label={`More info: ${content}`}
        tabIndex={0}
      >
        ?
      </button>
      {/* Tooltip bubble */}
      <span
        role="tooltip"
        className="
          absolute bottom-full left-1/2 -translate-x-1/2 mb-2.5
          w-56 px-3 py-2.5
          bg-slate-900 dark:bg-slate-700
          text-white text-xs leading-relaxed text-center
          rounded-lg shadow-2xl
          opacity-0 scale-95
          group-hover:opacity-100 group-hover:scale-100
          group-focus-within:opacity-100 group-focus-within:scale-100
          transition-all duration-150 delay-75
          pointer-events-none z-50
        "
      >
        {content}
        {/* Arrow */}
        <span
          className="absolute top-full left-1/2 -translate-x-1/2 -mt-px
                     border-4 border-transparent border-t-slate-900 dark:border-t-slate-700"
        />
      </span>
    </span>
  );
}
