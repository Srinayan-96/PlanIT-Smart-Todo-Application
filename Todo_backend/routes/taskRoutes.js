const express = require("express");
const router = express.Router();

const { 
    getTasks, 
    getTaskStats,
    addTask, 
    updateTask, 
    deleteTask,
    toggleTask,
    getReminderAlerts,
    getActivityTrend
} = require("../controllers/taskController");

router.get("/stats", getTaskStats);
router.get("/alerts", getReminderAlerts);
router.get("/activity-trend", getActivityTrend);
router.get("/", getTasks);
router.post("/", addTask);

router.put("/:id", updateTask);
router.delete("/:id", deleteTask);
router.patch("/:id/toggle", toggleTask);




module.exports = router;