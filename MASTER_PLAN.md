# 🍳 REHOBOTH KITCHEN VENTURES - MASTER PLAN

## 📂 1. MASTER FILE STRUCTURE
rehoboth-kitchen-app/
├── backend/
│   ├── data/                  (Database: users.db, products.db, banners.db)
│   ├── uploads/               (Images: stores uploaded photos)
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── productController.js
│   │   └── bannerController.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   └── bannerRoutes.js
│   ├── .env                   (Secrets: PORT, MONGO_URI)
│   ├── server.js              (Main Backend Entry)
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── BottomNav.jsx      (Navigation Bar)
    │   │   ├── SupportButton.jsx  (WhatsApp Button)
    │   │   ├── ProtectedRoute.jsx (Security Logic)
    │   │   └── Footer.jsx         (Bottom Info)
    │   ├── pages/
    │   │   ├── Login.jsx          (Entry Page)
    │   │   ├── Home.jsx           (Shop, Search, Slider)
    │   │   ├── ProductDetails.jsx (Single Item)
    │   │   ├── Cart.jsx           (Checkout)
    │   │   ├── Dashboard.jsx      (Admin Panel)
    │   │   ├── AddProduct.jsx     (Form)
    │   │   ├── AddBanner.jsx      (Form)
    │   │   ├── Profile.jsx        (User Account)
    │   │   └── About.jsx          (Info Page)
    │   ├── App.jsx                (Routing)
    │   └── main.jsx
    └── vite.config.js             (Proxy Settings)

## 🔑 2. CRITICAL CREDENTIALS (LOCAL)
- **Admin Email:** chef@kitchen.com
- **Admin Password:** securepass123
- **Database Location:** backend/data/
- **Backend Port:** 5000
- **Frontend Port:** 5173

## 🛠️ 3. HOW TO RESTART THE APP
If you close Termux, run these two commands in separate windows:

**Window 1 (Backend):**
cd ~/rehoboth-kitchen-app/backend
npx nodemon

**Window 2 (Frontend):**
cd ~/rehoboth-kitchen-app/frontend
npm run dev

## 🚀 4. RECONSTRUCTION ROADMAP (If you lose everything)
1.  **Setup Backend:**
    npm install express mongoose cors dotenv nodemon multer nedb-promises
    (Create folders: controllers, routes, data, uploads)

2.  **Setup Frontend:**
    npm create vite@latest frontend -- --template react
    npm install axios react-router-dom

3.  **Connect:**
    Edit vite.config.js to proxy /api to http://localhost:5000

## 🌍 5. GOING LIVE (DEPLOYMENT)
1.  **Database:** Switch NeDB -> MongoDB Atlas.
2.  **Images:** Switch Local Uploads -> Cloudinary.
3.  **Host Backend:** Push to GitHub -> Deploy to Render.com.
4.  **Host Frontend:** Push to GitHub -> Deploy to Vercel.com.
