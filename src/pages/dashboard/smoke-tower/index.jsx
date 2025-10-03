import { useMemo } from "react";

export default function SmokeTower({ intensity = 3 }) {
  // intensity -> tutun kuchi (0-5)
  const smokes = useMemo(
    () => Array.from({ length: intensity * 3 }),
    [intensity]
  );

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-b from-sky-100 to-gray-200">
      <div className="relative w-44 h-64">
        {/* Tower */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-44 bg-gradient-to-b from-gray-600 to-gray-800 rounded-t-md shadow-lg">
          <div className="absolute top-0 left-0 w-full h-4 bg-gray-700 rounded-t-md"></div>
        </div>

        {/* Smoke particles */}
        {smokes.map((_, i) => (
          <span
            key={i}
            className={`absolute bottom-44 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full animate-smoke`}
            style={{
              background:
                "radial-gradient(circle, rgba(200,200,200,0.8) 20%, rgba(180,180,180,0.3) 80%)",
              animationDelay: `${i * 0.6}s`,
              animationDuration: `${5 + (i % 3)}s`,
              width: `${24 + (i % 4) * 6}px`,
              height: `${24 + (i % 4) * 6}px`,
              opacity: 0.6 + Math.random() * 0.3,
            }}
          />
        ))}
      </div>

      <style jsx>{`
        .animate-smoke {
          animation: rise 7s infinite;
        }
        @keyframes rise {
          0% {
            transform: translateY(0) scale(0.8);
            opacity: 0.8;
          }
          40% {
            transform: translateY(-60px) scale(1.2) translateX(-10px);
            opacity: 0.5;
          }
          80% {
            transform: translateY(-140px) scale(1.5) translateX(15px);
            opacity: 0.2;
          }
          100% {
            transform: translateY(-180px) scale(1.8) translateX(0px);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
