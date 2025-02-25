const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

// Configure Nodemailer transporter using your SMTP settings
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Helper function to send email
const sendEmail = async (options) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };
  await transporter.sendMail(mailOptions);
};

exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const user = new User({ username, email, password });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // For all users (admin or not), generate and send a 2FA code.
    const twoFactorCode = Math.floor(100000 + Math.random() * 900000).toString();
    user.twoFactorCode = twoFactorCode;
    user.twoFactorExpire = Date.now() + 10 * 60 * 1000;
    await user.save();
    
    // Send the 2FA code via email (even for admins)
    const message = `Your two-factor authentication code is: ${twoFactorCode}. It expires in 10 minutes.`;
    await sendEmail({ email: user.email, subject: 'Your 2FA Code', message });
    
    res.json({ message: '2FA code sent to email' });
  } catch (error) {
    next(error);
  }
};

exports.verifyTwoFactor = async (req, res, next) => {
  try {
    const { email, twoFactorCode } = req.body;
    const user = await User.findOne({ email });
    if (!user || !user.twoFactorCode)
      return res.status(401).json({ message: '2FA verification failed' });
    
    if (user.twoFactorExpire < Date.now())
      return res.status(401).json({ message: '2FA code expired' });
    
    if (user.twoFactorCode !== twoFactorCode)
      return res.status(401).json({ message: 'Invalid 2FA code' });
    
    // Clear 2FA fields
    user.twoFactorCode = undefined;
    user.twoFactorExpire = undefined;
    await user.save();
    
    // Generate JWT with role included
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    res.json({ token });
  } catch (error) {
    next(error);
  }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: 'No user found with that email' });
    
    // Generate reset token and update user document
    const resetToken = user.getResetPasswordToken();
    await user.save();
    
    // Build reset URL (adjust domain as needed)
    const resetUrl = `${req.protocol}://${req.get('host')}/reset-password.html?token=${resetToken}&email=${email}`;
    const message = `You requested a password reset. Please make a PUT request to: \n\n ${resetUrl} \n\n If you did not request a password reset, please ignore this email.`;
    
    await sendEmail({ email: user.email, subject: 'Password Reset Request', message });
    res.json({ message: 'Password reset email sent' });
  } catch (error) {
    next(error);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { email, token, newPassword } = req.body;
    // Hash token to compare with stored hash
    const resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({
      email,
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    });
    if (!user)
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    
    user.password = newPassword; // Will be hashed in pre-save hook
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    
    res.json({ message: 'Password reset successful' });
  } catch (error) {
    next(error);
  }
};
