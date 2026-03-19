"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlassCardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

/**
 * Premium Glass Card Component (Linear Inspired)
 * Features:
 * - Backdrop blur with ultra-subtle 1px border.
 * - Follows 8px grid spacing and concentric radius rules.
 * - Smooth fade-in animation on mount.
 */
export function GlassCard({
  children,
  className,
  hover = false,
  ...props
}: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
      }}
      className={cn(
        "glass-card",
        hover && "transition-all duration-300 hover:bg-white/[0.03] hover:border-white/[0.12] hover:shadow-[0_8px_32px_rgba(255,255,255,0.02)] cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/**
 * Glass Card variants for different elevation levels
 */
export function GlassCardLevel1({
  children,
  className,
  ...props
}: GlassCardProps) {
  return (
    <GlassCard
      className={cn("bg-white/[0.02]", className)}
      {...props}
    >
      {children}
    </GlassCard>
  );
}

export function GlassCardLevel2({
  children,
  className,
  ...props
}: GlassCardProps) {
  return (
    <GlassCard
      className={cn("bg-white/[0.04]", className)}
      {...props}
    >
      {children}
    </GlassCard>
  );
}
