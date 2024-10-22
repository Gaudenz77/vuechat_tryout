/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
   darkMode: 'selector', // or 'media' or 'class'
   theme: {
     extend: {
      mytheme: {
          

        "primary": "#9700ff",
                  
        
        "secondary": "#557d00",
                  
        
        "accent": "#0044ff",
                  
        
        "neutral": "#302929",
                  
        
        "base-100": "#292d28",
                  
        
        "info": "#2f82ff",
                  
        
        "success": "#00994c",
                  
        
        "warning": "#b13c00",
                  
        
        "error": "#ff495f",
                  },
     },
   },
   variants: {
     extend: {},
   },
   plugins: [
    require('daisyui'),
  ],  
  daisyui: {
    themes: ["light", "dark", "cyberpunk"],
  },
  }
