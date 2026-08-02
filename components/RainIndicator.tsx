'use client';

export function RainIndicator({ rainDetected }: { rainDetected: boolean }) {
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-20 h-20 flex items-center justify-center">
        {/* Rain cloud icon */}
        <svg
          width="64"
          height="64"
          viewBox="0 0 64 64"
          className={`transition-opacity duration-500 ${
            rainDetected ? 'opacity-100' : 'opacity-40'
          }`}
        >
          <defs>
            <linearGradient id="rainGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(199, 89%, 48%)" />
              <stop offset="100%" stopColor="hsl(199, 89%, 58%)" />
            </linearGradient>
          </defs>

          {/* Cloud */}
          <path
            d="M16 32C16 24.27 22.27 18 30 18C36.58 18 42.12 23.09 42.56 29.43C47.43 30.37 51 34.61 51 39.5C51 45.03 46.52 49.5 41 49.5H17C11.48 49.5 7 45.03 7 39.5C7 34.41 10.69 30.21 15.63 29.44C15.87 25.97 18.98 23.35 22.75 23.35C24.96 23.35 26.94 24.43 28.1 26.09M48 32H24"
            fill={rainDetected ? 'url(#rainGradient)' : 'currentColor'}
            fillOpacity={rainDetected ? '1' : '0.4'}
          />

          {/* Rain drops - visible when raining */}
          {rainDetected && (
            <>
              <line
                x1="24"
                y1="44"
                x2="24"
                y2="54"
                stroke="hsl(199, 89%, 48%)"
                strokeWidth="2"
                strokeLinecap="round"
                className="animate-pulse"
              />
              <line
                x1="32"
                y1="46"
                x2="32"
                y2="56"
                stroke="hsl(199, 89%, 48%)"
                strokeWidth="2"
                strokeLinecap="round"
                className="animate-pulse"
                style={{ animationDelay: '0.2s' }}
              />
              <line
                x1="40"
                y1="44"
                x2="40"
                y2="54"
                stroke="hsl(199, 89%, 48%)"
                strokeWidth="2"
                strokeLinecap="round"
                className="animate-pulse"
                style={{ animationDelay: '0.4s' }}
              />
            </>
          )}
        </svg>

        {/* Glow effect when raining */}
        {rainDetected && (
          <div className="absolute inset-0 bg-blue-400 rounded-full opacity-20 blur-lg animate-pulse"></div>
        )}
      </div>

      <p className="mt-4 text-center font-semibold text-sm">Rain Detected</p>
      <p className="text-xs text-slate-500 mt-1">
        {rainDetected ? 'Raining' : 'Clear'}
      </p>
    </div>
  );
}
