/** Apple-style fluid easing — weighted, organic deceleration */
export const APPLE_EASE = [0.16, 1, 0.3, 1] as const;

export const APPLE_EASE_OUT = {
  type: "tween" as const,
  ease: APPLE_EASE,
  duration: 0.65,
};

export const APPLE_SPRING = {
  type: "spring" as const,
  stiffness: 260,
  damping: 28,
  mass: 0.9,
};
