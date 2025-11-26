// src/components/StepProgress.jsx
import React from "react";
import { motion } from "framer-motion";

/**
 * StepProgress
 * props:
 *  - steps: array of { key, label }
 *  - current: index of active step (0..n-1)
 *
 * Thin line with dots, animated fill and active dot scale.
 */
export default function StepProgress({ steps = [], current = 0 }) {
  const percent = steps.length <= 1 ? 0 : (current / (steps.length - 1)) * 100;

  return (
    <div className="w-full">
      <div className="relative px-4">
        {/* Line background */}
        <div className="absolute left-6 right-6 top-4 h-0.5 bg-gray-200 rounded" />

        {/* Animated fill */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.max(0, percent)}%` }}
          transition={{ duration: 0.45 }}
          className="absolute left-6 top-4 h-0.5 bg-green-600 rounded"
          style={{ transformOrigin: "left center" }}
        />

        {/* Dots & labels */}
        <div className="flex justify-between items-start relative z-10">
          {steps.map((s, i) => {
            const isActive = i === current;
            const isDone = i < current;
            return (
              <div key={s.key} className="flex flex-col items-center w-1/4">
                <motion.div
                  animate={{ scale: isActive ? 1.18 : 1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className={`w-9 h-9 rounded-full grid place-items-center ${
                    isDone ? "bg-green-600 text-white" : isActive ? "bg-white border-2 border-green-600 text-green-600" : "bg-white border border-gray-300 text-gray-400"
                  } shadow-sm`}
                >
                  {isDone ? (
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M20 6L9 17l-5-5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    <span className="font-semibold text-sm">{i + 1}</span>
                  )}
                </motion.div>

                <div className={`text-xs mt-2 text-center ${isActive ? "text-gray-900 font-semibold" : "text-gray-500"}`}>
                  {s.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
