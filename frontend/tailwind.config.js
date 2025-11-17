@import "tailwindcss";

/* Import Inter font */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

/* Only required third-party CSS */
@import 'leaflet/dist/leaflet.css';

/* Base styles with Inter font */
@layer base {
  html {
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
    scroll-behavior: smooth;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
}

/* Custom animations and utilities */
@layer utilities {
  .animate-fade-in {
    animation: fadeIn 0.5s ease-in;
  }
  
  .animate-slide-up {
    animation: slideUp 0.4s ease-out;
  }
  
  .animate-scale-in {
    animation: scaleIn 0.3s ease-out;
  }

  /* Custom color utilities for new palette */
  .text-burgundy { color: #7A1E1E; }
  .bg-burgundy { background-color: #7A1E1E; }
  .border-burgundy { border-color: #7A1E1E; }
  
  .text-olive { color: #808000; }
  .bg-olive { background-color: #808000; }
  .border-olive { border-color: #808000; }
  
  .text-scarlet-red { color: #FF2400; }
  .bg-scarlet-red { background-color: #FF2400; }
  .border-scarlet-red { border-color: #FF2400; }
  
  .text-mustard-yellow { color: #E1AD01; }
  .bg-mustard-yellow { background-color: #E1AD01; }
  .border-mustard-yellow { border-color: #E1AD01; }
  
  .text-mustard-blue { color: #4B86B4; }
  .bg-mustard-blue { background-color: #4B86B4; }
  .border-mustard-blue { border-color: #4B86B4; }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes scaleIn {
  from {
    transform: scale(0.95);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 5px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* Dark mode scrollbar */
.dark ::-webkit-scrollbar-track {
  background: #1f2937;
}

.dark ::-webkit-scrollbar-thumb {
  background: #4b5563;
}

.dark ::-webkit-scrollbar-thumb:hover {
  background: #6b7280;
}

/* Leaflet map customizations */
.leaflet-container {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
}

/* Focus styles for better accessibility */
button:focus-visible,
input:focus-visible,
select:focus-visible,
textarea:focus-visible,
a:focus-visible {
  outline: 2px solid #4B86B4;
  outline-offset: 2px;
}

/* Custom gradient backgrounds */
.gradient-bg-primary {
  background: linear-gradient(135deg, #2E8B57 0%, #228B22 100%);
}

.gradient-bg-accent {
  background: linear-gradient(135deg, #FFD700 0%, #E1AD01 100%);
}

.gradient-bg-burgundy {
  background: linear-gradient(135deg, #7A1E1E 0%, #9E2A2A 100%);
}

/* Smooth transitions for interactive elements */
button,
a,
input,
select {
  transition: all 0.2s ease-in-out;
}