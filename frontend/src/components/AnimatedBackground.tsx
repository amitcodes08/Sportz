export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <filter id="blur">
            <feGaussianBlur in="SourceGraphic" stdDeviation="40" />
          </filter>

          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a855f7" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#7e22ce" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#581c87" stopOpacity="0.1" />
          </linearGradient>

          <linearGradient id="grad2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#00d9ff" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#14b8a6" stopOpacity="0.1" />
          </linearGradient>

          <linearGradient id="grad3" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#ec4899" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#a855f7" stopOpacity="0.1" />
          </linearGradient>

          <style>{`
            @keyframes blobAnim1 {
              0%, 100% { transform: translate(0, 0) scale(1); }
              33% { transform: translate(100px, -80px) scale(1.2); }
              66% { transform: translate(-50px, 60px) scale(0.9); }
            }
            @keyframes blobAnim2 {
              0%, 100% { transform: translate(0, 0) scale(1); }
              33% { transform: translate(-80px, 100px) scale(0.9); }
              66% { transform: translate(60px, -50px) scale(1.1); }
            }
            @keyframes blobAnim3 {
              0%, 100% { transform: translate(0, 0) scale(1); }
              33% { transform: translate(60px, 80px) scale(1.1); }
              66% { transform: translate(-100px, -30px) scale(0.95); }
            }
            .blob1 { animation: blobAnim1 8s infinite ease-in-out; }
            .blob2 { animation: blobAnim2 10s infinite ease-in-out; }
            .blob3 { animation: blobAnim3 12s infinite ease-in-out; }
          `}</style>
        </defs>

        {/* Background layer */}
        <rect width="1200" height="800" fill="#0a0a0f" />

        {/* Animated blobs */}
        <g filter="url(#blur)">
          <circle
            cx="200"
            cy="100"
            r="150"
            fill="url(#grad1)"
            className="blob1"
          />
          <circle
            cx="900"
            cy="700"
            r="180"
            fill="url(#grad2)"
            className="blob2"
          />
          <circle
            cx="1000"
            cy="100"
            r="140"
            fill="url(#grad3)"
            className="blob3"
          />
        </g>

        {/* Grid overlay */}
        <g opacity="0.03">
          <defs>
            <pattern
              id="grid"
              width="50"
              height="50"
              patternUnits="userSpaceOnUse"
            >
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="white" />
            </pattern>
          </defs>
          <rect width="1200" height="800" fill="url(#grid)" />
        </g>
      </svg>
    </div>
  );
}
