const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
    purge: ["./templates/**/*.html", "./theme/**/*.html"],
    theme: {
        extend: {
            colors: {
                'offwhite': '#fefbf4'
            },
            fontFamily: {
                mono: ['IBM Plex Mono', ...defaultTheme.fontFamily.mono],
                sans: ['Raleway', ...defaultTheme.fontFamily.sans]
            }
        }
    },
    variants: {}
}