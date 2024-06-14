const express = require('express');
const User = require('../models/user');
const nodemailer = require('nodemailer');

const app = express();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: '',
      pass: ''
    }
  });

app.post('/findId', async (req, res) => {
    const { email } = req.body;
    try {
        const foundUser = await User.findOne({ 'user_email': email });

        if (!foundUser) {
            return res.status(200).json({ message: '이메일 없음' });
        }

        const userId = foundUser.user_id;
        res.status(200).json({ message: '이메일 있음'});

        const mailOptions = {
            from: '',
            to: `${email}`,
            subject: 'Here is your To Do List ID',
            text: `Your id : [${userId}]`
          };
          
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
            } else {
            }
          });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '서버 오류' });
    }
});

module.exports = app;
