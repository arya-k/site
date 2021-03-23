const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
    purge: ["./templates/**/*.html", "./theme/**/*.html"],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Raleway', ...defaultTheme.fontFamily.sans]
            }
        }
    },
    variants: {}
}