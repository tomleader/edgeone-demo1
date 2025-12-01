import { motion, useMotionValue, useTransform } from 'motion/react'
import { useEffect, useState } from 'react'

interface CardRotateProps {
  children: React.ReactNode
  onSendToBack: () => void
  sensitivity: number
}

function CardRotate({ children, onSendToBack, sensitivity }: CardRotateProps) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useTransform(y, [-100, 100], [60, -60])
  const rotateY = useTransform(x, [-100, 100], [-60, 60])

  function handleDragEnd(_: never, info: { offset: { x: number; y: number } }) {
    if (Math.abs(info.offset.x) > sensitivity || Math.abs(info.offset.y) > sensitivity) {
      onSendToBack()
    } else {
      x.set(0)
      y.set(0)
    }
  }

  return (
    <motion.div
      className='absolute cursor-grab'
      style={{ x, y, rotateX, rotateY }}
      drag
      dragConstraints={{ top: 0, right: 0, bottom: 0, left: 0 }}
      dragElastic={0.6}
      whileTap={{ cursor: 'grabbing' }}
      onDragEnd={handleDragEnd}>
      {children}
    </motion.div>
  )
}

interface StackProps {
  randomRotation?: boolean
  sensitivity?: number
  cardDimensions?: { width: number; height: number }
  sendToBackOnClick?: boolean
  cardsData?: ({ id: number; img: string } | any)[]
  animationConfig?: { stiffness: number; damping: number }
  renderItem?: (
    item: { id: number; img: string } | any,
    options?: { currentIndex: number | string },
  ) => React.ReactNode
}

export default function Stack({
  randomRotation = false,
  sensitivity = 200,
  cardDimensions = { width: 208, height: 208 },
  cardsData = [],
  animationConfig = { stiffness: 200, damping: 20 }, // 稍微调低刚度，让展开更柔和
  sendToBackOnClick = false,
  renderItem = (item: { id: number; img: string } | any) => (
    <img
      src={item.img}
      alt={`card-${item.id}`}
      className='w-full h-full object-cover pointer-events-none'
    />
  ),
}: StackProps) {
  const [cards, setCards] = useState(cardsData.length ? cardsData : [])

  const sendToBack = (id: number) => {
    setCards((prev) => {
      const newCards = [...prev]
      const index = newCards.findIndex((card) => card.id === id)
      if (index < 0) return prev
      const [card] = newCards.splice(index, 1)
      newCards.unshift(card)
      return newCards
    })
  }

  useEffect(() => {
    setCards(cardsData)
  }, [cardsData])

  return (
    <div
      className='relative'
      style={{
        width: cardDimensions.width,
        height: cardDimensions.height,
        perspective: 600,
      }}>
      {cards.map((card, index) => {
        const randomRotate = randomRotation ? Math.random() * 10 - 5 : 0
        const rotateZ = (cards.length - index - 1) * (40 / cards.length) + randomRotate
        const scale = 1 + index * 0.06 - cards.length * 0.06

        return (
          <CardRotate
            key={card.id || card.wiki_id || index}
            onSendToBack={() => sendToBack(card.id)}
            sensitivity={sensitivity}>
            <motion.div
              className='rounded-2xl overflow-hidden border-4 border-white'
              onClick={() => sendToBackOnClick && sendToBack(card.id)}
              // 1. 初始状态：像一副刚拆封的牌，整齐叠在一起
              initial={{
                opacity: 1, // 既然取消入场淡入，一开始就是可见的
                x: 0, // 位置归位
                y: 0, // 位置归位
                rotateZ: 0, // 角度归零 (重点：所有卡片重叠)
                scale: 1, // 大小统一 (可选，或者设为最终scale)
                transformOrigin: '100% 100%', // 设置旋转锚点，像手拿着牌的一角
              }}
              // 2. 动画状态：扇形展开
              animate={{
                opacity: 1,
                rotateZ: rotateZ, // 展开到计算好的角度
                scale: scale, // 缩放到计算好的大小
                x: 0,
                y: 0,
              }}
              // 3. 过渡：依次执行
              transition={{
                type: 'spring',
                stiffness: animationConfig.stiffness,
                damping: animationConfig.damping,
                delay: index * 0.05,
              }}
              style={{
                width: cardDimensions.width,
                height: cardDimensions.height,
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              }}>
              {renderItem?.(card, { currentIndex: cards[cards.length - 1]?.id })}
            </motion.div>
          </CardRotate>
        )
      })}
    </div>
  )
}
