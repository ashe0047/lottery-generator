"use client"

import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion, AnimatePresence } from "framer-motion"
import { Coins, BanknoteIcon, Sparkles, X, Volume2, VolumeX } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { createParticles, updateParticle } from "./particles"
import { triggerConfetti } from "./confetti"

export default function LotteryGenerator() {
  const [inputNumber, setInputNumber] = useState("")
  const [addedNumbers, setAddedNumbers] = useState<string[]>([])
  const [generatedNumbers, setGeneratedNumbers] = useState<number[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState("")
  const [soundEnabled, setSoundEnabled] = useState(false)
  const particleContainerRef = useRef<HTMLDivElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)

  const addNumber = () => {
    if (!inputNumber) {
      setError("Please enter a number")
      return
    }
    if (addedNumbers.includes(inputNumber)) {
      setError("This number has already been added")
      return
    }
    setAddedNumbers([...addedNumbers, inputNumber])
    setInputNumber("")
    setError("")
  }

  const removeNumber = (numberToRemove: string) => {
    setAddedNumbers(addedNumbers.filter((num) => num !== numberToRemove))
  }

  const getUniqueDigits = (): number[] => {
    const combined = addedNumbers.join("").split("")
    const uniqueDigits = Array.from(new Set(combined.map(Number)))
    return uniqueDigits.filter((n) => !isNaN(n))
  }

  const generateLotteryNumbers = () => {
    const availableDigits = getUniqueDigits()

    if (availableDigits.length === 0) {
      setError("Please add some numbers first")
      return
    }

    setError("")
    setIsGenerating(true)

    const numbers: number[] = []
    const usedNumbers = new Set()

    let attempts = 0
    const maxAttempts = 100

    while (numbers.length < 6 && attempts < maxAttempts) {
      attempts++

      const digit1 = availableDigits[Math.floor(Math.random() * availableDigits.length)]
      const digit2 = availableDigits[Math.floor(Math.random() * availableDigits.length)]
      const number = Number.parseInt(`${digit1}${digit2}`)

      if (number >= 1 && number <= 49 && !usedNumbers.has(number)) {
        usedNumbers.add(number)
        numbers.push(number)
      }
    }

    if (numbers.length < 6) {
      setError("Not enough valid combinations possible with these digits. Please add different numbers.")
      setGeneratedNumbers([])
    } else {
      setGeneratedNumbers(numbers)
    }

    setTimeout(() => setIsGenerating(false), 500)
  }

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      if (inputNumber) {
        addNumber()
      } else if (addedNumbers.length > 0) {
        generateLotteryNumbers()
      }
    }
  }

  useEffect(() => {
    window.addEventListener("keypress", handleKeyPress)
    return () => {
      window.removeEventListener("keypress", handleKeyPress)
    }
  }, [inputNumber, addedNumbers])

  const availableDigits = getUniqueDigits()
  const digitDisplay =
    availableDigits.length > 0
      ? `Available digits: ${availableDigits.join(", ")}`
      : "Add numbers to see available digits"

  const playSound = () => {
    if (soundEnabled && audioRef.current) {
      audioRef.current.currentTime = 0
      audioRef.current.play()
    }
  }

  const generateWithEffects = async () => {
    const availableDigits = getUniqueDigits()

    if (availableDigits.length === 0) {
      setError("Please add some numbers first")
      return
    }

    setError("")
    setIsGenerating(true)

    // Clear existing numbers first
    setGeneratedNumbers([])
    // Wait for clear animation
    await new Promise((resolve) => setTimeout(resolve, 100))

    const numbers: number[] = []
    const usedNumbers = new Set()
    const finalNumbers = new Array(6).fill(null)

    for (let position = 0; position < 6; position++) {
      let validNumber = false
      while (!validNumber) {
        const digit1 = availableDigits[Math.floor(Math.random() * availableDigits.length)]
        const digit2 = availableDigits[Math.floor(Math.random() * availableDigits.length)]
        const number = Number.parseInt(`${digit1}${digit2}`)

        if (number >= 1 && number <= 49 && !usedNumbers.has(number)) {
          usedNumbers.add(number)
          numbers.push(number)
          finalNumbers[position] = number
          validNumber = true

          // Update the specific position
          setGeneratedNumbers([...finalNumbers])
          playSound()

          // Create explosion effect
          if (particleContainerRef.current) {
            const rect = particleContainerRef.current.getBoundingClientRect()
            const gridItem = particleContainerRef.current.querySelector(`[data-index="${position}"]`)
            const itemRect = gridItem?.getBoundingClientRect()

            const x = itemRect ? itemRect.left - rect.left + itemRect.width / 2 : rect.width / 2
            const y = itemRect ? itemRect.top - rect.top + itemRect.height / 2 : rect.height / 2

            const particles = createParticles(x, y, "bg-yellow-500")
            particles.forEach((particle) => {
              particleContainerRef.current?.appendChild(particle.element)
              const animate = () => {
                if (updateParticle(particle, particleContainerRef.current!)) {
                  requestAnimationFrame(animate)
                }
              }
              requestAnimationFrame(animate)
            })
          }

          // Wait before showing next number
          await new Promise((resolve) => setTimeout(resolve, 800))
        }
      }
    }

    triggerConfetti()
    setIsGenerating(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-800 via-red-900 to-red-950 p-4 flex items-center justify-center relative overflow-hidden">
      {/* Particle container */}
      <div ref={particleContainerRef} className="absolute inset-0 pointer-events-none overflow-hidden" />

      {/* Audio elements */}
      <audio ref={audioRef} className="hidden">
        <source src="https://assets.mixkit.co/sfx/preview/mixkit-magical-coin-win-1936.mp3" type="audio/mpeg" />
      </audio>

      {/* Snake and Prosperity Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Snake Silhouette */}
        <div className="absolute top-0 right-0 w-96 h-96 opacity-10">
          <img
            src="https://api.iconify.design/noto:snake.svg?color=%23ffd700"
            alt=""
            className="w-full h-full object-contain"
            aria-hidden="true"
          />
        </div>

        {/* Floating Elements */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            initial={{
              x: Math.random() * window.innerWidth,
              y: -20,
            }}
            animate={{
              y: window.innerHeight + 20,
              rotate: 360,
            }}
            transition={{
              duration: 15 + Math.random() * 10,
              repeat: Number.POSITIVE_INFINITY,
              delay: i * 2,
            }}
          >
            {i % 2 === 0 ? (
              <Coins className="w-8 h-8 text-yellow-500/20" />
            ) : (
              <BanknoteIcon className="w-8 h-8 text-yellow-500/20" />
            )}
          </motion.div>
        ))}
      </div>

      <Card className="w-full max-w-md bg-red-900/30 backdrop-blur-lg border-2 border-red-500/30 shadow-2xl relative">
        {/* Decorative Corner Snakes */}
        <div className="absolute -top-4 -left-4 w-16 h-16 opacity-50 transform -rotate-45">
          <img
            src="https://api.iconify.design/emojione:snake.svg?color=%23ffd700"
            alt=""
            className="w-full h-full object-contain"
            aria-hidden="true"
          />
        </div>
        <div className="absolute -bottom-4 -right-4 w-16 h-16 opacity-50 transform rotate-135">
          <img
            src="https://api.iconify.design/emojione:snake.svg?color=%23ffd700"
            alt=""
            className="w-full h-full object-contain"
            aria-hidden="true"
          />
        </div>

        {/* Sound toggle button */}
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="absolute top-4 right-4 text-yellow-500/80 hover:text-yellow-500 transition-colors"
        >
          {soundEnabled ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
        </button>

        <CardHeader className="text-center relative">
          <CardTitle className="text-3xl font-bold text-yellow-500 flex flex-col items-center justify-center gap-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-yellow-400" />
              蛇年大吉
              <Sparkles className="w-6 h-6 text-yellow-400" />
            </div>
            <span className="text-lg font-normal text-yellow-500/80">Year of the Snake 2025</span>
          </CardTitle>
          <div className="mt-4 text-yellow-500/80 text-sm">金蛇献瑞 • Fortune & Prosperity</div>
        </CardHeader>

        <CardContent className="space-y-6 relative z-10">
          {/* Red Packet Design Element */}
          <div className="absolute -right-3 top-0 w-24 h-32 opacity-20 pointer-events-none">
            <img
              src="https://api.iconify.design/emojione:money-bag.svg?color=%23ffd700"
              alt=""
              className="w-full h-full object-contain"
              aria-hidden="true"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <AnimatePresence>
              {addedNumbers.map((number) => (
                <motion.div key={number} initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                  <Badge className="bg-red-950/50 text-yellow-500 border-red-500/30 hover:bg-red-950/70">
                    {number}
                    <button onClick={() => removeNumber(number)} className="ml-2 hover:text-yellow-400">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="space-y-4">
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="输入号码 Enter your number"
                  value={inputNumber}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "")
                    setInputNumber(value)
                    setError("")
                  }}
                  className="bg-red-950/50 border-red-500/30 text-yellow-500 placeholder:text-yellow-500/50 focus:border-yellow-500/50 focus:ring-yellow-500/50"
                />
              </div>
              <Button
                onClick={addNumber}
                className="bg-red-950/50 text-yellow-500 border border-red-500/30 hover:bg-red-950/70"
              >
                添加 Add
              </Button>
            </div>

            <div className="text-sm text-yellow-500/80 bg-red-950/50 p-2 rounded-md border border-red-500/30">
              {digitDisplay}
            </div>
          </div>

          {error && (
            <Alert variant="destructive" className="bg-red-950/50 border-red-500/30">
              <AlertDescription className="text-yellow-500">{error}</AlertDescription>
            </Alert>
          )}

          <Button
            onClick={generateWithEffects}
            className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-red-950 font-bold shadow-lg shadow-red-950/50 border-2 border-yellow-400/50"
            disabled={addedNumbers.length === 0}
          >
            生成幸运号码 Generate Lucky Numbers
          </Button>

          <div className="grid grid-cols-3 gap-4 h-[200px]">
            {[...Array(6)].map((_, index) => (
              <div key={index} data-index={index} className="relative">
                <AnimatePresence mode="wait">
                  {generatedNumbers[index] !== undefined && (
                    <motion.div
                      key={`${index}-${generatedNumbers[index]}`}
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{
                        scale: [0, 1.2, 1],
                        rotate: [-180, 0],
                      }}
                      exit={{ scale: 0, rotate: 180 }}
                      transition={{
                        duration: 0.8,
                        type: "spring",
                        stiffness: 200,
                        damping: 15,
                      }}
                      className="absolute inset-0"
                    >
                      <motion.div
                        animate={{
                          boxShadow: [
                            "0 0 0 0 rgba(255, 215, 0, 0)",
                            "0 0 20px 10px rgba(255, 215, 0, 0.7)",
                            "0 0 0 0 rgba(255, 215, 0, 0)",
                          ],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Number.POSITIVE_INFINITY,
                          repeatType: "reverse",
                        }}
                        className="w-full aspect-square rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center border-4 border-red-800 shadow-lg shadow-red-950/50"
                      >
                        <span className="text-2xl font-bold text-red-900">
                          {generatedNumbers[index]?.toString().padStart(2, "0")}
                        </span>
                      </motion.div>

                      <motion.div
                        className="absolute -bottom-2 left-1/2 transform -translate-x-1/2"
                        animate={{
                          y: [0, -4, 0],
                          scale: [1, 1.1, 1],
                          rotate: [0, 5, -5, 0],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Number.POSITIVE_INFINITY,
                          repeatType: "reverse",
                        }}
                      >
                        <img
                          src="https://api.iconify.design/noto-v1:snake.svg?color=%23ffd700"
                          alt=""
                          className="w-12 h-6 opacity-30 transform rotate-90"
                          aria-hidden="true"
                        />
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          <div className="text-center space-y-2">
            <p className="text-yellow-500/80 text-sm">金蛇纳福 • 步步高升</p>
            <p className="text-yellow-500/60 text-xs">Press Enter or click the button to generate lucky numbers</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

