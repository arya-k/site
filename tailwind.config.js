const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
    purge: ["./templates/**/*.html", "./theme/**/*.html"],
    theme: {
        extend: {
            colors: {
                'offwhite': '#fefbf4',
                'mustard': '#f3ae56',
                'bluenote': '#326cf2',
                'fuschia': '#7169ca',
            },
            fontFamily: {
                mono: ['IBM Plex Mono', ...defaultTheme.fontFamily.mono],
                sans: ['Raleway', ...defaultTheme.fontFamily.sans]
            }
        }
    },
    pugins: [
        require('@tailwindcss/typography')
    ]
}