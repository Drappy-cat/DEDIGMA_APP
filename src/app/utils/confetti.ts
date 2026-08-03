import confetti from "canvas-confetti";

/**
 * Triggers a cheerful, GPU-optimized confetti celebration effect
 */
export function fireConfetti() {
  try {
    // Center burst
    confetti({
      particleCount: 70,
      spread: 70,
      origin: { y: 0.6 },
      disableForReducedMotion: true
    });

    // Side cannons after 180ms
    setTimeout(() => {
      confetti({
        particleCount: 40,
        angle: 60,
        spread: 55,
        origin: { x: 0.1, y: 0.7 },
        disableForReducedMotion: true
      });
      confetti({
        particleCount: 40,
        angle: 120,
        spread: 55,
        origin: { x: 0.9, y: 0.7 },
        disableForReducedMotion: true
      });
    }, 180);
  } catch (e) {
    console.log("Confetti trigger error:", e);
  }
}

export function fireContinuousConfetti() {
  try {
    const fire = (particleRatio: number, opts: any) => {
      confetti({
        ...opts,
        particleCount: Math.floor(100 * particleRatio),
        zIndex: 9999,
        colors: ['#f59e0b', '#10b981', '#3b82f6', '#ef4444', '#8b5cf6'],
        disableForReducedMotion: true
      });
    };

    // Burst 1: Center
    fire(0.7, { spread: 80, origin: { y: 0.6 } });

    // Burst 2: Left and Right (after 250ms)
    setTimeout(() => {
      fire(0.5, { angle: 60, spread: 55, origin: { x: 0, y: 0.7 } });
      fire(0.5, { angle: 120, spread: 55, origin: { x: 1, y: 0.7 } });
    }, 250);

    // Burst 3: Massive Center (after 600ms)
    setTimeout(() => {
      fire(1, { spread: 120, origin: { y: 0.5 } });
    }, 600);

  } catch (e) {
    console.log("Confetti trigger error:", e);
  }
}
