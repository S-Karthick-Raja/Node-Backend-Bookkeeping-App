const express = require('express');
const expressAsyncHandler = require('express-async-handler');
const asynHandler = require('express-async-handler');
const authMiddleware = require('../middlewares/authMiddleware');
const User = require('../models/users');
const generateToken = require('../Utility/generateTokken');

const usersRoute = express.Router();

//Register
usersRoute.post(
  '/register',
  asynHandler(async (req, res) => {
    const { fname, lname, profileurl, email, password } = req.body;

    const userExists = await User.findOne({ email: email });
    if (userExists) {
      throw new Error('User Exist');
    }
    const userCreated = await User.create({ fname, lname, profileurl, email, password });
    res.json({
      _id: userCreated._id,
      fname: userCreated.fname,
      lname: userCreated.lname,
      profileurl: userCreated.profileurl,
      password: userCreated.password,
      email: userCreated.password,
      token: generateToken(userCreated._id),
    });
  })
);

//Login
usersRoute.post(
  '/login',
  asynHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.isPasswordMatch(password))) {
      //set status code
      res.status(200);

      res.json({
        _id: user._id,
        fname: user.fname,
        lname: user.lname,
        profileurl : user.profileurl,
        password: user.password,
        email: user.password,
        token: generateToken(user._id),
      });
    } else {
      res.status(401);
      throw new Error('Invalid credentials');
    }
  })
);

//update user
usersRoute.put(
  '/profile/update',
  authMiddleware,
  expressAsyncHandler(async (req, res) => {
    //Find the login user by ID
    const user = await User.findById(req.user._id);

    if (user) {
      user.fname = req.body.fname || user.fname;
      user.lname = req.body.lname || user.lname;
      user.profileurl = req.body.profileurl || user.profileurl;
      user.email = req.body.email || user.email;
      if (req.body.password) {
        user.password = req.body.password || user.password;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        fname: updatedUser.fname,
        lname: updatedUser.lname,
        profileurl: updatedUser.profileurl,
        email: updatedUser.email,
        token: generateToken(updatedUser._id),
      });
    }
  })
);

//Delete user
usersRoute.delete('/:id', (async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    res.status(200);
    res.send(user);
  } catch (error) {
    res.json(error);
  }
}));

//GET Users
usersRoute.get('/',
  authMiddleware,
  expressAsyncHandler(async (req, res) => {
    const user = await User.find({});

    if (user) {
      res.status(200);
      res.json(user);
    } else {
      res.status(500);

      throw new Error('No users found at the moment');
    }
  })
);

// Profile route
usersRoute.get(
  '/profile',
  authMiddleware,
  asynHandler(async (req, res) => {
    try {
      const user = await User.findById(req.user._id);

      if (!user) throw new Error("You dont't have any profile yet")

      res.status(200);
      res.send(user);
    } catch (error) {
      res.status(500);
      throw new Error('Server Error')
    }
  }
  ))


module.exports = usersRoute;