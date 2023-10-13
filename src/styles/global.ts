import { globalCss } from '.'

export const globalStyles = globalCss({
  '*': {
    margin: 0,
    padding: 0,
    boxSizing: 'border-box',
  },

  body: {
    '-webkit-font-smoothing': 'antialiased',
    '-moz-osx-font-smoothing': 'grayscale',
    background: '$gray900',
    color: '$gray100',
  },

  'body, input, textarea, button': {
    fontFamily: 'Poppins',
    fontWeight: 400,
  },
})
