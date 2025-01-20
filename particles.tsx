export const createParticles = (x: number, y: number, color: string) => {
  const particles = Array.from({ length: 10 }).map((_, i) => {
    const particle = document.createElement("div")
    particle.className = `absolute w-2 h-2 rounded-full ${color}`
    particle.style.left = `${x}px`
    particle.style.top = `${y}px`
    const angle = (i * 36 * Math.PI) / 180
    const velocity = 100 + Math.random() * 50
    const lifetime = 500 + Math.random() * 500

    return { element: particle, angle, velocity, lifetime, birth: Date.now() }
  })

  return particles
}

export const updateParticle = (
  particle: {
    element: HTMLDivElement
    angle: number
    velocity: number
    lifetime: number
    birth: number
  },
  container: HTMLDivElement,
) => {
  const age = Date.now() - particle.birth
  const progress = age / particle.lifetime

  if (progress >= 1) {
    container.removeChild(particle.element)
    return false
  }

  const distance = particle.velocity * progress
  const x = Number.parseFloat(particle.element.style.left) + Math.cos(particle.angle) * distance
  const y = Number.parseFloat(particle.element.style.top) + Math.sin(particle.angle) * distance

  particle.element.style.left = `${x}px`
  particle.element.style.top = `${y}px`
  particle.element.style.opacity = `${1 - progress}`

  return true
}

