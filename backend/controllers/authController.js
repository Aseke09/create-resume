const mongoose = require('mongoose');
const { GridFSBucket } = require('mongodb')
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const bucket = () =>
  new GridFSBucket(mongoose.connection.db, { bucketName: 'profileImages' });

const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d'});
};

const registerUser = async (req, res) => {
    try {
        const { name, email, password, profileImageId } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists '});
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // let avatarId = null;
        // if (file) {
        //   avatarId = await new Promise((resolve, reject) => {
        //     const stream = bucket().openUploadStream(
        //       `${Date.now()}_${file.originalname}`,
        //       { metadata: { field: 'profileImage' }}
        //     );
        //     stream.on('error', reject);
        //     stream.end(file.buffer, () => resolve(stream.id.toString()))
        //   })
        // }
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            profileImageUrl: profileImageId || null,
        });
        
        const token = generateToken(user._id);
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            profileImageUrl: user.profileImageUrl,
            token,
        });
    } catch (error) {
      console.error('Register error:', error); 
      res.status(500).json({ message: 'Server error', error: error.message }) 
    }
};

const loginUser = async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });

      if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    
      if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' })
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if(!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password' })
      }

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        profileImageUrl: user.profileImageUrl,
        token: generateToken(user._id),
      })
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Server error', error: error.message })  
    }
};

const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if(!user) {
            return res.status(400).json({ message: 'User not found'})
        }
        res.json(user)
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message})
    }
};

module.exports = { registerUser, loginUser, getUserProfile };