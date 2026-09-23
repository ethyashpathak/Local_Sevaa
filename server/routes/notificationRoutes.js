const express = require("express");
const router = express.Router();
const {
    createNotification,
    getNotificationsByHandyman,
    acceptRequest,
    rejectRequest,
    workDoneCheck,
} = require("../controller/notificationController");

// route prefix: "/api"
router.post(
    "/createnotification",
    createNotification
);

router.get(
    "/getnotification/:handyman_id",
    getNotificationsByHandyman
);

router.put(
    "/acceptnotification",
    acceptRequest
);

router.put(
    "/rejectnotification",
    rejectRequest
);

router.put(
    "/workdonecheck",
    workDoneCheck
);

module.exports = router;
