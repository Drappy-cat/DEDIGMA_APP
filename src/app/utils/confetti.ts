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
