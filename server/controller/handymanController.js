const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

// requiring models
const { Handyman, Otp } = require("../models/model");
// requiring controllers
const { sendOtpMail, sendLoginVerificationMail } = require("./mailController");
// requiring utility functions
const cloudinary = require("../utils/cloudinary");

// route - http://localhost:8080/api/handyman/signup
const handymanSignup = async (req, res) => {
    try {
        const { email } = req.body;

        const existingHandyman = await Handyman.findOne({ email });
        if (existingHandyman) {
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

// route - http://localhost:8080/api/handyman/signup/verify
const handymanVerifySignup = async (req, res) => {
    try {
        const {
            name,
            email,
            otp: inputOtp,
            password,
            phone,
            aadharNumber,
            services,
            profile,
            lat,
            long,
        } = req.body;

        const otpRecord = await Otp.findOne({ email });
        if (!otpRecord) {
            return res.status(400).send({ msg: "The OTP expired. Please try again!" });
        }

        const validOtp = await bcrypt.compare(inputOtp, otpRecord.otp);
        if (!validOtp) {
            return res.status(400).send({ msg: "OTP does not match. Please try again!" });
        }

        const token = jwt.sign({ email }, JWT_SECRET);

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await Handyman.create({
            handyman_id: token,
            name,
            email,
            phone,
            password: hashedPassword,
            aadharNumber,
            aadharFront: undefined,
            aadharBack: undefined,
            lat,
            long,
            services,
            profile,
            usersSelected: [],
        });

        await Otp.deleteMany({ email });

        return res.status(200).send({
            msg: "Handyman Account creation successful!",
            handyman_id: token,
        });
    } catch (error) {
        return res.status(500).send({ msg: error.message });
    }
};

// route - http://localhost:8080/api/handyman/login
const handymanLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const handyman = await Handyman.findOne({ email });
        if (!handyman) {
            return res.status(404).send({ msg: "Handyman not found" });
        }

        const validPassword = await bcrypt.compare(password, handyman.password);
        if (!validPassword) {
            return res.status(401).send({ msg: "Invalid password" });
        }

        sendLoginVerificationMail({ email: handyman.email, name: handyman.name });

        return res.status(200).send({
            msg: "Log-In successful!",
            handyman_id: handyman.handyman_id,
        });
    } catch (error) {
        return res.status(500).send({ msg: error.message });
    }
};

// route - http://localhost:8080/api/handyman/getallhandyman
const getAllHandyman = async (req, res) => {
    try {
        const handymen = await Handyman.find({});
        return res.status(200).json(handymen);
    } catch (error) {
        return res.status(500).json({ msg: error.message });
    }
};

// route - http://localhost:8080/api/handyman/gethandyman
const handymanDetails = async (req, res) => {
    try {
        const { handyman_id } = req.body;

        const handyman = await Handyman.findOne({ handyman_id });
        if (!handyman) {
            return res.status(404).send({ msg: "No such handyman exists" });
        }

        return res.status(200).send(handyman);
    } catch (error) {
        return res.status(500).send({ msg: error.message });
    }
};

// route - http://localhost:8080/api/handyman/jobstartotp
const jobStartOtpVerify = async (req, res) => {
    try {
        const { email, otp: inputOtp } = req.body;

        const otpRecord = await Otp.findOne({ email });
        if (!otpRecord) {
            return res.status(400).send({ msg: "The OTP expired. Please try again!" });
        }

        const validOtp = await bcrypt.compare(inputOtp, otpRecord.otp);
        if (!validOtp) {
            return res.status(400).send({ msg: "OTP does not match. Please try again!" });
        }

        await Otp.deleteMany({ email });

        return res.status(200).send({ msg: "Job Started" });
    } catch (error) {
        return res.status(500).send({ msg: error.message });
    }
};

module.exports = {
    handymanVerifySignup,
    handymanSignup,
    handymanLogin,
    handymanDetails,
    getAllHandyman,
    jobStartOtpVerify,
};