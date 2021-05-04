const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
    purge: ["./templates/**/*.html", "./styles/styles.css"],
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
            }
        }
    }
}