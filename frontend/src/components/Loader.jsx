import { motion } from "framer-motion";

export default function Loader() {
  const containerVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  };

  const spinnerVariants = {
    rotate: {
      rotate: 360,
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "linear",
      },
    },
  };

  const dotVariants = {
    initial: { opacity: 0.3, scale: 0.8 },
    animate: (i) => ({
      opacity: [0.3, 1, 0.3],
      scale: [0.8, 1, 0.8],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        delay: i * 0.2,
      },
    }),
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-lightBg via-[#e8f8fc] to-lightBg z-50"
    >
      <div className="flex flex-col items-center gap-8">
        {/* Main Spinner */}
        <motion.div
          variants={spinnerVariants}
          animate="rotate"
          className="relative w-20 h-20"
        >
          {/* Outer Ring */}
          <motion.div className="absolute inset-0 rounded-full border-4 border-transparent border-t-accentTeal border-r-midTeal" />

          {/* Inner Ring */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute inset-2 rounded-full border-4 border-transparent border-b-deepTeal"
          />

          {/* Center Dot */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-accentTeal to-midTeal" />
          </div>
        </motion.div>

        {/* Animated Dots */}
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              custom={i}
              variants={dotVariants}
              initial="initial"
              animate="animate"
              className="w-3 h-3 rounded-full bg-gradient-to-r from-accentTeal to-midTeal"
            />
          ))}
        </div>

        {/* Loading Text */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center"
        >
          <p className="text-deepTeal font-medium tracking-widest">LOADING</p>
          <p className="text-sm text-midTeal mt-1">Preparing your experience</p>
        </motion.div>
      </div>
    </motion.div>
  );
}
