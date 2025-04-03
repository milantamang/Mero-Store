/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",

  ],
  theme: {
    extend: {


colors: {
  primary: '#201658',
  sec: '#1D24CA',
  third:"#2563EB"
},
    },
  },
  // plugins: [
  //   require('@tailwindcss/forms'),
    
  // ],
 
}
