/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    {
      pattern: /fill-type./
    },
    {
      pattern: /text-type./
    },
    {
      pattern: /bg-type./
    },
    {
      pattern: /shadow-type./
    },
    // {
    //   pattern: /has-\[\:checked\]\:shadow-type.+/
    // },
    // {
    //   pattern: /has-\[\:checked\]\:bg-type.+/
    // },
    "has-[:checked]:bg-type-bug",
    "has-[:checked]:bg-type-dark",
    "has-[:checked]:bg-type-dragon",
    "has-[:checked]:bg-type-electric",
    "has-[:checked]:bg-type-fire",
    "has-[:checked]:bg-type-fairy",
    "has-[:checked]:bg-type-fighting",
    "has-[:checked]:bg-type-flying",
    "has-[:checked]:bg-type-ghost",
    "has-[:checked]:bg-type-grass",
    "has-[:checked]:bg-type-ground",
    "has-[:checked]:bg-type-ice",
    "has-[:checked]:bg-type-normal",
    "has-[:checked]:bg-type-poison",
    "has-[:checked]:bg-type-psychic",
    "has-[:checked]:bg-type-rock",
    "has-[:checked]:bg-type-steel",
    "has-[:checked]:bg-type-water",
    "has-[:checked]:border-type-bug",
    "has-[:checked]:border-type-dark",
    "has-[:checked]:border-type-dragon",
    "has-[:checked]:border-type-electric",
    "has-[:checked]:border-type-fire",
    "has-[:checked]:border-type-fairy",
    "has-[:checked]:border-type-fighting",
    "has-[:checked]:border-type-flying",
    "has-[:checked]:border-type-ghost",
    "has-[:checked]:border-type-grass",
    "has-[:checked]:border-type-ground",
    "has-[:checked]:border-type-ice",
    "has-[:checked]:border-type-normal",
    "has-[:checked]:border-type-poison",
    "has-[:checked]:border-type-psychic",
    "has-[:checked]:border-type-rock",
    "has-[:checked]:border-type-steel",
    "has-[:checked]:border-type-water",
    "has-[:checked]:shadow-type-bug",
    "has-[:checked]:shadow-type-dark",
    "has-[:checked]:shadow-type-dragon",
    "has-[:checked]:shadow-type-electric",
    "has-[:checked]:shadow-type-fire",
    "has-[:checked]:shadow-type-fairy",
    "has-[:checked]:shadow-type-fighting",
    "has-[:checked]:shadow-type-flying",
    "has-[:checked]:shadow-type-ghost",
    "has-[:checked]:shadow-type-grass",
    "has-[:checked]:shadow-type-ground",
    "has-[:checked]:shadow-type-ice",
    "has-[:checked]:shadow-type-normal",
    "has-[:checked]:shadow-type-poison",
    "has-[:checked]:shadow-type-psychic",
    "has-[:checked]:shadow-type-rock",
    "has-[:checked]:shadow-type-steel",
    "has-[:checked]:shadow-type-water",

  ],
  theme: {
    colors: {
      'red-cmyk': {
        lighter: '#ffc5c5',//200
        light: '#ff6464',//400
        DEFAULT: '#EE1717',//600
        dark: '#c80d0d',//700
        darker: '#891313'//900
      },
      'azure': {
        lighter: '#c3e2fa',
        light: '#69b7f1',
        DEFAULT: '#2E7BDF',
        dark: '#2867cd',
        darker: '#244984'
      },
      'night': {
        text: '#f6f6f6',//50
        lightest: '#b0b0b0',//300
        lighter: '#6d6d6d',//500
        light: '#4f4f4f',//700
        DEFAULT: '#121212',//950
      },
      'type': {
        bug: '#92BC2C',
        dark: '#595761',
        dragon: '#0C69C8',
        electric: '#F2D94E',
        fire: '#FBA54C',
        fairy: '#EE90E6',
        fighting: '#D3425F',
        flying: '#A1BBEC',
        ghost: '#5F6DBC',
        grass: '#5FBD58',
        ground: ' #DA7C4D',
        ice: '#75D0C1',
        normal: '#A0A29F',
        poison: '#B763CF',
        psychic: '#FA8581',
        rock: '#C9BB8A',
        steel: '#5695A3',
        water: '#539DDF'
      }
    },
    extend: {
      screens: {
        'portrait': {
          'raw': '(orientation: portrait)'
        },
        'landscape': {
          'raw': '(orientation: landscape)'
        }
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      animation: {
        "spinSlow": 'spin 1s ease infinite',
        "flashBg": 'flashBg 2s ease infinite'
      },
      keyframes: {
        "flashBg": {
          '0%, 100%': { 'fill': '#EE1717' },
          '50%': { 'fill': '#2E7BDF' },
        }
      },
      boxShadow: {
        '20px': '0 0 20px rgba(0, 0, 0, 0.3)'
      }
    },
  },
  plugins: [],
}