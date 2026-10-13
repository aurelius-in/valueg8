module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        valuegate: {
          navy: '#071c2d',
          blue: '#0a6dff',
          cyan: '#2dd4bf',
          ink: '#111827',
          paper: '#f8f7f4',
          border: '#e5e7eb',
          muted: '#6b7280'
        }
      },
      boxShadow: {
        soft: '0 10px 30px rgba(15, 23, 42, 0.06)'
      }
    }
  },
  plugins: []
};
