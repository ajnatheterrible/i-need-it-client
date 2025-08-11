import { useEffect } from "react";
import confetti from "canvas-confetti";

export default function ConfettiCanvas({
  duration = 3000,
  run = true,
  zIndex = 1350,
  colors = ["#4f4f4f", "#b3b3b3", "#e4e4e4", "#ffffff"],
}) {
  useEffect(() => {
    if (!run) return;

    const end = Date.now() + duration;

    const frame = () => {
      if (Date.now() > end) return;

      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        startVelocity: 60,
        origin: { x: 0, y: 0.5 },
        colors,
        zIndex,
      });

      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        startVelocity: 60,
        origin: { x: 1, y: 0.5 },
        colors,
        zIndex,
      });

      requestAnimationFrame(frame);
    };

    frame();
  }, [run, duration, zIndex, colors]);

  return null;
}
