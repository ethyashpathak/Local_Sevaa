const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
require("dotenv").config();
const otpGenerator = require("otp-generator");
const jwt = require("jsonwebtoken");

// requiring models
const { User, Otp } = require("../models/model");

// requiring controllers
const { sendOtpMail, sendLoginVerificationMail } = require("./mailController");

// getting jwt token
const JWT_SECRET = process.env.JWT_SECRET;

// route - http://localhost:8080/api/user/login
const logIn = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).send({ msg: "User not found" });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).send({ msg: "Invalid password" });
        }

        sendLoginVerificationMail({ email: user.email, name: user.username });

        return res.status(200).send({
            msg: "Log-In successful!",
            user_id: user.user_id,
        });
    } catch (error) {
        return res.status(500).send({ msg: error.message });
    }
};

// route - http://localhost:8080/api/user/signup
const signUp = async (req, res) => {
    try {
        const { email } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send({
                msg: "This Email ID is already registered. Try Signing In instead!",
            });
        }

        await Otp.deleteMany({ email });

        const OTP = otpGenerator.generate(6, {
            digits: true,
            upperCaseAlphabets: false,
            specialChars: false,
            lowerCaseAlphabets: false,
        });

        sendOtpMail(email, OTP);

        const salt = await bcrypt.genSalt(10);
        const hashedOtp = await bcrypt.hash(OTP, salt);

        await Otp.create({ email, otp: hashedOtp });

        return res.status(200).send({ msg: "Otp sent successfully!" });
    } catch (error) {
        return res.status(500).send({ msg: error.message });
    }
};

// route - http://localhost:8080/api/user/signup/verify
const verifySignup = async (req, res) => {
    try {
        const { email, otp: inputOtp, username, password, contactNumber, lat, long } = req.body;

        const otpRecord = await Otp.findOne({ email });
        if (!otpRecord) {
            return res.status(400).send({ msg: "The OTP expired. Please try again!" });
        }

        const validOtp = await bcrypt.compare(inputOtp, otpRecord.otp);
        if (!validOtp) {
            return res.status(400).send({ msg: "OTP does not match. Please try again!" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const token = jwt.sign({ email }, JWT_SECRET);

        await User.create({
            user_id: token,
            username,
            email,
            contactNumber,
            password: hashedPassword,
            lat,
            long,
        });

        await Otp.deleteMany({ email });

        return res.status(200).send({
            msg: "Account creation successful!",
            user_id: token,
        });
    } catch (error) {
        return res.status(500).send({ msg: error.message });
    }
};

// route - http://localhost:8080/api/user/signup/resendOtp
const resendOtp = async (req, res) => {
    try {
        const { email } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send({
                msg: "This Email ID is already registered. Try Signing In instead!",
            });
        }

        await Otp.deleteMany({ email });

        const OTP = otpGenerator.generate(6, {
            digits: true,
            upperCaseAlphabets: false,
            specialChars: false,
            lowerCaseAlphabets: false,
        });

        sendOtpMail(email, OTP);

        const salt = await bcrypt.genSalt(10);
        const hashedOtp = await bcrypt.hash(OTP, salt);

        await Otp.create({ email, otp: hashedOtp });

        return res.status(200).send({ msg: "New Otp sent successfully!" });
    } catch (error) {
        return res.status(500).send({ msg: error.message });
    }
};

// route - http://localhost:8080/api/user/getallusers
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({});
        return res.status(200).json(users);
    } catch (error) {
        return res.status(500).json({ msg: error.message });
    }
};

// route - http://localhost:8080/api/user/getuser
const userDetails = async (req, res) => {
    try {
        const { user_id } = req.body;

        const user = await User.findOne({ user_id });
        if (!user) {
            return res.status(404).send({ msg: "No such user exists" });
        }

        return res.status(200).send(user);
    } catch (error) {
        return res.status(500).send({ msg: error.message });
    }
};

module.exports = {
    signUp,
    verifySignup,
    logIn,
    resendOtp,
    getAllUsers,
    userDetails,
};