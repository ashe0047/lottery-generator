"use client"

import dynamic from 'next/dynamic'

const LotteryGenerator = dynamic(() => import('../lottery-generator'), { ssr: false })
export default function SyntheticV0PageForDeployment() {
  return <LotteryGenerator />
}