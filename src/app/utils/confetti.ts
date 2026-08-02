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
    const duration = 3500;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 6,
        angle: 60,
        spread: 65,
        origin: { x: 0, y: 0.7 },
        colors: ['#f59e0b', '#10b981', '#3b82f6', '#ef4444', '#8b5cf6'],
        zIndex: 9999, // Ensure it's on top of all modals/screens
        disableForReducedMotion: true
      });
      confetti({
        particleCount: 6,
        angle: 120,
        spread: 65,
        origin: { x: 1, y: 0.7 },
        colors: ['#f59e0b', '#10b981', '#3b82f6', '#ef4444', '#8b5cf6'],
        zIndex: 9999,
        disableForReducedMotion: true
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  } catch (e) {
    console.log("Confetti trigger error:", e);
  }
}
