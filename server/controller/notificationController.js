const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const otpGenerator = require("otp-generator");

dotenv.config();

// Models
const {
    User,
    Handyman,
    Otp,
    Notification
} = require("../models/model");

// Mail Controller
const {
    sendJobStartOtpMail
} = require("./mailController");



// =====================================================
// CREATE NOTIFICATION
// POST /api/createnotification
// =====================================================

const createNotification = async (req, res) => {
    try {

        const {
            lat,
            long,
            user_id,
            handyman_id
        } = req.body;

        // validation

        if (
            !user_id ||
            !handyman_id
        ) {
            return res.status(400).json({
                message:
                    "user_id and handyman_id are required"
            });
        }

        console.log(
            "Incoming notification:",
            req.body
        );

        const notification =
            await Notification.create({
                lat,
                long,
                user_id,
                handyman_id,
                status: "pending"
            });

        console.log(
            "Saved notification:",
            notification
        );

        return res.status(201).json({
            success: true,
            notification
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};



// =====================================================
// GET NOTIFICATIONS
// GET /api/getnotification/:handyman_id
// =====================================================

const getNotificationsByHandyman =
    async (req, res) => {

        try {

            const {
                handyman_id
            } = req.params;

            if (!handyman_id) {
                return res.status(400).json({
                    message:
                        "handyman_id required"
                });
            }

            console.log(
                "Searching notifications for:",
                handyman_id
            );

            const notifications =
                await Notification.find({
                    handyman_id
                });

            console.log(
                "Found notifications:",
                notifications
            );

            return res.status(200).json({
                success: true,
                count:
                    notifications.length,
                notifications
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                success: false,
                message:
                    error.message
            });
        }
    };



// =====================================================
// ACCEPT REQUEST
// PUT /api/acceptnotification
// =====================================================

const acceptRequest =
    async (req, res) => {

        try {

            const {
                handyman_id
            } = req.body;

            const notification =
                await Notification.findOneAndUpdate(
                    {
                        handyman_id,
                        status: "pending"
                    },
                    {
                        status:
                            "accepted"
                    },
                    {
                        new: true
                    }
                );

            if (!notification) {
                return res.status(404)
                    .json({
                        message:
                            "Notification not found"
                    });
            }

            const user =
                await User.findOne({
                    user_id:
                        notification.user_id
                });

            if (!user) {
                return res.status(404)
                    .json({
                        message:
                            "User not found"
                    });
            }

            const email =
                user.email;

            // delete previous OTP

            await Otp.deleteMany({
                email
            });

            console.log(
                "Old OTP deleted"
            );

            // generate OTP

            const generatedOtp =
                otpGenerator.generate(
                    6,
                    {
                        digits: true,
                        upperCaseAlphabets: false,
                        lowerCaseAlphabets: false,
                        specialChars: false
                    }
                );

            console.log(
                "Generated OTP:",
                generatedOtp
            );

            // send email

            await sendJobStartOtpMail(
                email,
                generatedOtp
            );

            // hash OTP

            const salt =
                await bcrypt.genSalt(
                    10
                );

            const hashedOtp =
                await bcrypt.hash(
                    generatedOtp,
                    salt
                );

            // save OTP

            await Otp.create({
                email,
                otp: hashedOtp
            });

            console.log(
                "OTP saved"
            );

            return res.status(200)
                .json({
                    success: true,
                    message:
                        "OTP sent successfully"
                });

        } catch (error) {

            console.log(error);

            return res.status(500)
                .json({
                    success: false,
                    message:
                        error.message
                });
        }
    };



// =====================================================
// REJECT REQUEST
// PUT /api/rejectnotification
// =====================================================

const rejectRequest =
    async (req, res) => {

        try {

            const {
                handyman_id
            } = req.body;

            const notification =
                await Notification.findOneAndUpdate(
                    {
                        handyman_id,
                        status:
                            "pending"
                    },
                    {
                        status:
                            "rejected"
                    },
                    {
                        new: true
                    }
                );

            if (!notification) {
                return res.status(404)
                    .json({
                        message:
                            "Notification not found"
                    });
            }

            return res.status(200)
                .json({
                    success: true,
                    notification
                });

        } catch (error) {

            return res.status(500)
                .json({
                    success: false,
                    message:
                        error.message
                });
        }
    };



// =====================================================
// WORK DONE CHECK
// PUT /api/workdonecheck
// =====================================================

const workDoneCheck =
    async (req, res) => {

        try {

            const {
                handyman_id,
                user_id
            } = req.body;

            const user =
                await User.findOne({
                    user_id
                });

            if (!user) {
                return res.status(404)
                    .json({
                        message:
                            "User not found"
                    });
            }

            const handyman =
                await Handyman.findOneAndUpdate(
                    {
                        handyman_id
                    },
                    {
                        $push: {
                            usersSelected:
                                user._id
                        }
                    },
                    {
                        new: true
                    }
                ).populate(
                    "usersSelected"
                );

            if (!handyman) {
                return res.status(404)
                    .json({
                        message:
                            "Handyman not found"
                    });
            }

            return res.status(200)
                .json({
                    success: true,
                    handyman,
                    message:
                        "User added successfully"
                });

        } catch (error) {

            return res.status(500)
                .json({
                    success: false,
                    message:
                        error.message
                });
        }
    };



module.exports = {
    createNotification,
    getNotificationsByHandyman,
    acceptRequest,
    rejectRequest,
    workDoneCheck
};