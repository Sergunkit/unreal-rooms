import { useState } from 'react';
import { motion } from 'motion/react';
import { Plane, MapPin, Compass } from 'lucide-react';

export function FloatingWidget() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="fixed bottom-8 right-8 z-40">
      <motion.div
        className="relative cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.3 }}
      >
        {/* Glow effect */}
        <div className="absolute inset-0 blur-2xl bg-primary/20 -z-10" />

        {/* Suitcase Container */}
        <div className="relative w-24 h-24">
          {/* Main Suitcase */}
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full drop-shadow-2xl"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Suitcase body */}
            <defs>
              <linearGradient id="leatherGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#8B4513', stopOpacity: 1 }} />
                <stop offset="50%" style={{ stopColor: '#A0522D', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#6B3410', stopOpacity: 1 }} />
              </linearGradient>
              <filter id="shadow">
                <feDropShadow dx="0" dy="4" stdDeviation="3" floodOpacity="0.3" />
              </filter>
            </defs>

            {/* Handle */}
            <path
              d="M 35 25 Q 35 18 40 18 L 60 18 Q 65 18 65 25"
              fill="none"
              stroke="#654321"
              strokeWidth="3"
              strokeLinecap="round"
            />

            {/* Main body */}
            <rect
              x="20"
              y="30"
              width="60"
              height="50"
              rx="4"
              fill="url(#leatherGradient)"
              filter="url(#shadow)"
              stroke="#654321"
              strokeWidth="2"
            />

            {/* Leather texture lines */}
            <line
              x1="25"
              y1="35"
              x2="75"
              y2="35"
              stroke="#6B3410"
              strokeWidth="0.5"
              opacity="0.5"
            />
            <line
              x1="25"
              y1="75"
              x2="75"
              y2="75"
              stroke="#6B3410"
              strokeWidth="0.5"
              opacity="0.5"
            />

            {/* Lock */}
            <rect
              x="47"
              y="48"
              width="6"
              height="8"
              rx="1"
              fill="#C9A961"
              stroke="#8B7355"
              strokeWidth="1"
            />
            <circle cx="50" cy="52" r="1.5" fill="#654321" />

            {/* Corner metal pieces */}
            <circle cx="25" cy="35" r="2" fill="#8B7355" />
            <circle cx="75" cy="35" r="2" fill="#8B7355" />
            <circle cx="25" cy="75" r="2" fill="#8B7355" />
            <circle cx="75" cy="75" r="2" fill="#8B7355" />

            {/* Straps */}
            <rect x="30" y="50" width="40" height="3" rx="1.5" fill="#654321" opacity="0.7" />
            <rect x="30" y="60" width="40" height="3" rx="1.5" fill="#654321" opacity="0.7" />
          </svg>

          {/* Travel Stickers - appear on hover */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: isHovered ? 1 : 0,
              scale: isHovered ? 1 : 0,
            }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="absolute top-2 left-2"
          >
            <div className="bg-primary/90 rounded-full p-1.5 shadow-lg">
              <Plane className="w-3 h-3 text-white" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: isHovered ? 1 : 0,
              scale: isHovered ? 1 : 0,
            }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="absolute top-2 right-2"
          >
            <div className="bg-purple-600/90 rounded-full p-1.5 shadow-lg">
              <MapPin className="w-3 h-3 text-white" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: isHovered ? 1 : 0,
              scale: isHovered ? 1 : 0,
            }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="absolute bottom-2 left-1/2 -translate-x-1/2"
          >
            <div className="bg-violet-500/90 rounded-full p-1.5 shadow-lg">
              <Compass className="w-3 h-3 text-white" />
            </div>
          </motion.div>

          {/* Filling animation - simulates items being added */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-primary/30 to-transparent rounded-b-lg"
            initial={{ height: 0 }}
            animate={{ height: isHovered ? '80%' : 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            style={{
              mixBlendMode: 'overlay',
              pointerEvents: 'none',
            }}
          />
        </div>

        {/* Tooltip */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{
            opacity: isHovered ? 1 : 0,
            y: isHovered ? 0 : 10,
          }}
          transition={{ duration: 0.2 }}
          className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap"
        >
          <div className="bg-card border border-border px-3 py-1.5 rounded-lg shadow-lg">
            <p className="text-xs text-foreground font-medium">Начните путешествие</p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
