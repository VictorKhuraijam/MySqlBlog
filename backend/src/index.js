import 'dotenv/config'
import express from 'express'
import cookieParser from 'cookie-parser'
import { createTables } from './db/initDB.js'
import cors from 'cors'

const app = express()

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.use(express.json())
app.use(cookieParser())

// const allowedOrigins = process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : [];
// app.use(cors({
//   origin: (origin, callback) => {
//     // console.log('Request Origin:', origin); // Debugging
//     // Allow requests with no origin (like mobile apps or curl requests)
//     if (!origin) {
//       return callback(null, true);
//     }

//     if (allowedOrigins.indexOf(origin) !== -1) {
//       return callback(null, true);
//     }

//     // For development purposes, you can add this condition
//     // if (process.env.NODE_ENV === 'development') {
//     //   return callback(null, true);
//     // }

//     callback(new Error(`Not allowed by CORS: ${origin} is not allowed`));
//   },
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization']
// }));



import authRoutes from './routes/auth.routes.js'
import postRoutes from './routes/post.routes.js'

app.use('/api/auth',authRoutes)
app.use('/api/post', postRoutes)

app.get('/test', ( req, res) => {
  res.json("The test works")
})

const PORT = process.env.PORT || 8000;
app.listen(PORT, async() => {
    console.log(`Server is running at port: ${PORT}`);
    await createTables()
});
