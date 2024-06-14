const express = require('express');
const User = require('../models/user');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');

const app = express();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: '',
        pass: ''
    }
});

app.post('/findPs', async (req, res) => {
    const { email } = req.body;
    try {
        const foundUser = await User.findOne({ 'user_email': email });

        if (!foundUser) {
            return res.status(200).json({ message: '이메일 없음' });
        }

        res.status(200).json({ message: '이메일 있음'});

        const randomPassword = Math.random().toString(36).slice(-8);

        const hashedPassword = await bcrypt.hash(randomPassword, 10);

        foundUser.user_pw = hashedPassword;

        await foundUser.save();

        const mailOptions = {
            from: '',
            to: `${email}`,
            subject: 'Here is your New To Do List Password',
            text: `Your new password : [${randomPassword}]\nYou must change your password!!`
        };

        transporter.sendMail(mailOptions, function (error, info) {
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