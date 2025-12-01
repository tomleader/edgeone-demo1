import reactLint from '@worldzb/eslint-config-react'
import unocss from '@unocss/eslint-config/flat'

export default [
  unocss,
  ...reactLint,
  {
    ignores: ['src/router/elegant/**.*'],
  },
]
