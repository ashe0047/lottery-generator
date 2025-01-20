import confetti from "canvas-confetti"

export const triggerConfetti = () => {
  const duration = 3 * 1000
  const end = Date.now() + duration

  const colors = ["#FFD700", "#FF0000", "#FFA500"]
  ;(function frame() {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: colors,
    })
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: colors,
    })

    if (Date.now() < end) {
      requestAnimationFrame(frame)
    }
  })()
}

