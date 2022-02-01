const express = require('express');
const dbConnect = require('./config/dbconnect');
const  error  = require('./middlewares/errorMiddlewares-Handler');
const usersRoute = require('./Routes/usersRoute');
const dotenv = require('dotenv');
const bookRouter = require('./Routes/bookRoute');

dotenv.config();

const app = express();

// DB Connect
dbConnect();

// Passing BODY Data
app.use(express.json());


// ROUTES
// Users
app.use('/api/users', usersRoute);
// Books
app.use('/api/books', bookRouter);


console.log(process.env.JWT_SECRET_KEY);
// Error middleware
app.use(error.errorMiddlewareHandler);

// SERVER
const PORT = process.env.PORT || 9000 ;
app.get("/", (req, res) => {
  res.send("HELLO WORLD WELCOME");
});
app.listen(PORT, () => console.log("App is Started", PORT));
