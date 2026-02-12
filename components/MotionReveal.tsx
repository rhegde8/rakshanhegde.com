"use client";

import type { ReactNode } from "react";

import { motion, useReducedMotion } from "framer-motion";

import { motionDurations, motionEasing } from "@/lib/motion/prefs";

type MotionRevealProps = {
  children: ReactNode;
  delay?: number;
  className?: string;
};

export function MotionReveal({
  children,
  delay = 0,
  className,
}: MotionRevealProps): React.JSX.Element {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: motionDurations.base, delay, ease: motionEasing }}
    >
      {children}
    </motion.div>
  );
}
