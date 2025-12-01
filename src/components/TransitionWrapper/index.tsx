// src/components/TransitionWrapper.tsx
'use client'

import { AnimatePresence, motion } from 'motion/react'
import { usePathname } from 'next/navigation'
import React from 'react'

// 🚀 修改 variants 为透明度渐变
const variants = {
  // 初始状态：完全透明
  initial: { opacity: 0 },

  // 进入状态：完全不透明
  animate: { opacity: 1 },

  // 退出状态：完全透明
  exit: { opacity: 1 },
}

export default function TransitionWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  // 🚀 滚动条优化函数 (仍然保留，以防万一内容高度变化引起抖动)
  const handleAnimationStart = () => {
    // 动画开始时，禁止 body 滚动
    document.body.style.overflowY = 'hidden'
  }

  const handleAnimationComplete = () => {
    // 动画结束时，恢复 body 滚动
    document.body.style.overflowY = 'auto'
  }

  return (
    // mode="wait" 在渐变动画中尤为重要，确保旧页面完全消失后新页面才出现
    <AnimatePresence mode='wait'>
      <motion.div
        key={pathname}
        variants={variants}
        initial='initial'
        animate='animate'
        exit='exit'
        // 可以将持续时间缩短，让渐变看起来更敏捷
        transition={{ duration: 0.2, ease: 'easeInOut' }}
        // 保持滚动条优化 hook
        onAnimationStart={handleAnimationStart}
        onAnimationComplete={handleAnimationComplete}
        // 💡 针对渐变效果的样式建议：
        // 1. 如果不使用 absolute，确保没有其他元素遮挡。
        // 2. 如果使用 absolute，效果会更稳定，可以防止旧页面的内容在退出时影响新页面布局。
        style={{ position: 'absolute', width: '100%', top: 0 }} // 可选启用
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
