import passport from 'passport';
import crypto from 'crypto';
import mongoose from 'mongoose';
import { sendMail } from '../handlers/mail';

const User = mongoose.model('User');

export const login = passport.authenticate('local', {
  failureRedirect: '/login',
  failureFlash: 'Failed Login!',
  successRedirect: '/',
  successFlash: 'You are now logged in'
});

export const logout = (req, res) => {
  req.logout();
  req.flash('succes', 'You are now logged out!');
  res.redirect('/');
};

export const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  req.flash('error', 'Oops you must be logged in to do that');
  res.redirect('/');
};

export const forgot = async (req, res) => {
  // 1. See if a user with that email exists
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    req.flash('error', 'Password reset email sent');
    return res.redirect('/login');
  }
  // 2. Set reset tokens and expiry on their account
  user.resetPasswordToken = crypto.randomBytes(20).toString('hex');
  user.resetPasswordExpires = Date.now() + 3600000;
  await user.save();
  // 3. Send them an email with the token
  await sendMail({
    user,
    subject: 'Password Reset',
    resetURL: `http://${req.headers.host}/account/reset/${
      user.resetPasswordToken
    }`,
    filename: 'password-reset'
  });
  req.flash('success', 'You have been emailed a password reset link');
  // 4. Redirect to login page
  res.redirect('/login');
};

export const reset = async (req, res) => {
  const user = await User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: { $gt: Date.now() }
  });

  if (!user) {
    res.flash('error', 'Password reset is invalid or has expired');
    return res.redirect('/login');
  } else {
    res.render('reset', { title: 'Reset your password!' });
  }
};

export const confirmedPasswords = (req, res, next) => {
  if (req.body.password === req.body['password-confirm']) return next();
  req.flash('error', 'Passwords do not match!');
  res.redirect('back');
};

export const update = async (req, res) => {
  const user = await User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: { $gt: Date.now() }
  });
  if (!user) {
    res.flash('error', 'Password reset is invalid or has expired');
    return res.redirect('/login');
  }

  await user.setPassword(req.body.password);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  const updatedUser = await user.save();
  await req.login(updatedUser);
  req.flash('Success', '💃 Nice! Your password has been reset');
  res.redirect('/');
};
