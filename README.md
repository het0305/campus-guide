Campus Guide — React + Node + MongoDB

Structure:
- server: Express API + Mongoose models
- client: React (Vite) frontend with React Router and CSS files

Getting started

1) Install dependencies

# in server
cd server
npm install

# in client
cd ../client
npm install

2) Configure MongoDB

Create `.env` in `server` with:
MONGO_URI=mongodb://localhost:27017/campus
PORT=5000

3) Run

# start server
cd server
npm run dev

# start client (in another terminal)
cd ../client
npm run dev

API base: http://localhost:5000/api

