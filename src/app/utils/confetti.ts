import confetti from "canvas-confetti";

/**
 * Triggers a cheerful confetti celebration effect
 */
export function fireConfetti() {
  try {
    // Center burst
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });

    // Side cannons after 200ms
    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0.1, y: 0.7 }
      });
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 0.9, y: 0.7 }
      });
    }, 200);
  } catch (e) {
    console.log("Confetti trigger error:", e);
  }
}
