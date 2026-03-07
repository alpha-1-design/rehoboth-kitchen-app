# AI Presentation Generator

An AI-powered PWA that transforms text, objects, faces, and products into beautiful presentations.

## Features

- 📄 **Text to PowerPoint** - Scan text and generate slides
- 🎯 **Object Detection** - Identify objects and get product info
- 👤 **Face Detection** - Recognize faces and pull web info
- 🛍️ **Product Search** - Find retailers and get directions
- 🌍 **Location-Based** - Customized content by location
- 🌐 **Multi-Language** - Auto-detect or choose language
- 🎨 **Dark/Light Mode** - Premium theme support
- ✨ **Premium Animations** - Smooth, professional UX
- 📱 **PWA** - Works offline, installable
- 🔗 **QR Sharing** - Share presentations via QR code

## Tech Stack

**Frontend:**
- React.js (PWA)
- Tesseract.js (OCR)
- TensorFlow.js (Object Detection)
- face-api.js (Face Detection)
- pptxgen-js (Slide Generation)
- Framer Motion (Animations)
- Tailwind CSS (Styling)
- Zustand (State Management)

**Backend:**
- Node.js + Express
- Axios (API calls)
- Google APIs (Search, Maps, Shopping)
- Deployed on Render

**Deployment:**
- Frontend: Vercel
- Backend: Render

## Getting Started

```bash
npm install
npm run dev
```

## Environment Variables

Create `.env.local`:
```
REACT_APP_BACKEND_URL=https://your-backend.onrender.com
REACT_APP_GOOGLE_API_KEY=your_key
REACT_APP_OPENAI_API_KEY=your_key
```

## License

MIT
