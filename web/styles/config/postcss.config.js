var tailwindcss = require('tailwindcss')

module.exports = {
  plugins: [
    tailwindcss('./styles/config/tailwind.config.js'),
    require('autoprefixer'),
    require('cssnano')
  ]
}
