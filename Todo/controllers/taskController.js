const Task = require("../models/Task");
const ActivityLog = require("../models/ActivityLog");

const buildTaskFilters = (query) => {
  const filters = {};

  if (query.completed === "true") {
    filters.completed = true;
  } else if (query.completed === "false") {
    filters.completed = false;
  }

  if (query.search) {
    filters.title = { $regex: query.search.trim(), $options: "i" };
  }

  if (query.priority) {
    filters.priority = query.priority;
  }

  if (query.category) {
    filters.category = query.category;
  }

  return filters;
};

const getTasks = async (req, res, next) => {
  try {
    const filters = buildTaskFilters(req.query);
    const tasks = await Task.find(filters).sort({ createdAt: -1 }).lean();
    res.json(tasks);
  } catch (err) {
    next(err);
  }
};


const getTaskStats = async (req, res, next) => {
  try {
    const now = new Date();
    const [total, completed, overdue, dueSoon, priorityAgg, recentActivity] = await Promise.all([
      Task.countDocuments(),
      Task.countDocuments({ completed: true }),
      Task.countDocuments({ completed: false, dueDate: { $lt: now } }),
      Task.countDocuments({
        completed: false,
        dueDate: { $gte: now, $lte: new Date(now.getTime() + 24 * 60 * 60 * 1000) },
      }),
      Task.aggregate([{ $group: { _id: "$priority", count: { $sum: 1 } } }]),
      ActivityLog.find().sort({ createdAt: -1 }).limit(200).lean(),
    ]);

    const deletedEvents = recentActivity.filter((item) => item.action === "deleted").length;
    const completedEvents = recentActivity.filter((item) => item.action === "completed").length;
    const createdEvents = recentActivity.filter((item) => item.action === "created").length;
    const efficiencyScore =
      createdEvents === 0 ? 0 : Math.max(0, Math.min(100, Math.round((completedEvents / createdEvents) * 100)));

    const priorityBreakdown = { low: 0, medium: 0, high: 0 };
    priorityAgg.forEach((item) => {
      priorityBreakdown[item._id] = item.count;
    });

    res.json({
      total,
      completed,
      pending: total - completed,
      completionRate: total === 0 ? 0 : Math.round((completed / total) * 100),
      overdue,
      dueSoon,
      deletedHistory: deletedEvents,
      efficiencyScore,
      priorityBreakdown,
    });
  } catch (err) {
    next(err);
  }
};

const updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const payload = {};

    if (typeof req.body.title === "string") {
      payload.title = req.body.title;
    }
    if (typeof req.body.completed === "boolean") {
      payload.completed = req.body.completed;
    }
    if (req.body.dueDate === null || typeof req.body.dueDate === "string") {
      payload.dueDate = req.body.dueDate ? new Date(req.body.dueDate) : null;
    }
    if (req.body.reminderAt === null || typeof req.body.reminderAt === "string") {
      payload.reminderAt = req.body.reminderAt ? new Date(req.body.reminderAt) : null;
    }
    if (typeof req.body.priority === "string") {
      payload.priority = req.body.priority;
    }
    if (typeof req.body.category === "string") {
      payload.category = req.body.category.trim() || "General";
    }

    const task = await Task.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
    });

    if (!task) {
      const error = new Error("Task not found");
      error.statusCode = 404;
      throw error;
    }

    await ActivityLog.create({
      action: "updated",
      taskId: task._id,
      titleSnapshot: task.title,
    });

    res.json(task);
  } catch (err) {
    next(err);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const task = await Task.findByIdAndDelete(id);

    if (!task) {
      const error = new Error("Task not found");
      error.statusCode = 404;
      throw error;
    }

    await ActivityLog.create({
      action: "deleted",
      taskId: task._id,
      titleSnapshot: task.title,
    });

    res.json({ message: "Task deleted", task });
  } catch (err) {
    next(err);
  }
};



const addTask = async (req, res, next) => {
  try {
    const { title, dueDate, reminderAt, priority, category } = req.body;
    if (!title || !title.trim()) {
      const error = new Error("Title is required");
      error.statusCode = 400;
      throw error;
    }

    const task = await Task.create({
      title: title.trim(),
      dueDate: dueDate ? new Date(dueDate) : null,
      reminderAt: reminderAt ? new Date(reminderAt) : null,
      priority: priority || "medium",
      category: category?.trim() || "General",
    });

    await ActivityLog.create({
      action: "created",
      taskId: task._id,
      titleSnapshot: task.title,
    });

    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
};

const toggleTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);

    if (!task) {
      const error = new Error("Task not found");
      error.statusCode = 404;
      throw error;
    }

    const oldState = task.completed;
    task.completed = !task.completed;
    await task.save({ validateModifiedOnly: true });

    await ActivityLog.create({
      action: oldState ? "reopened" : "completed",
      taskId: task._id,
      titleSnapshot: task.title,
    });

    res.json(task);
  } catch (err) {
    next(err);
  }
};

const getReminderAlerts = async (req, res, next) => {
  try {
    const now = new Date();
    const nextHour = new Date(now.getTime() + 60 * 60 * 1000);
    const alerts = await Task.find({
      completed: false,
      $or: [
        { dueDate: { $lte: nextHour, $gte: now } },
        { reminderAt: { $lte: nextHour, $gte: now } },
        { dueDate: { $lt: now } },
      ],
    })
      .sort({ dueDate: 1 })
      .lean();

    res.json(alerts);
  } catch (err) {
    next(err);
  }
};

const getActivityTrend = async (req, res, next) => {
  try {
    const start = new Date();
    start.setDate(start.getDate() - 6);
    start.setHours(0, 0, 0, 0);

    const logs = await ActivityLog.aggregate([
      { $match: { createdAt: { $gte: start } } },
      {
        $project: {
          day: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          action: 1,
        },
      },
      {
        $group: {
          _id: { day: "$day", action: "$action" },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.day": 1 } },
    ]);

    const days = [];
    for (let i = 0; i < 7; i += 1) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      days.push({
        day: date.toISOString().slice(0, 10),
        created: 0,
        completed: 0,
        deleted: 0,
      });
    }

    logs.forEach((entry) => {
      const dayItem = days.find((d) => d.day === entry._id.day);
      if (!dayItem) return;
      if (entry._id.action === "created") dayItem.created += entry.count;
      if (entry._id.action === "completed") dayItem.completed += entry.count;
      if (entry._id.action === "deleted") dayItem.deleted += entry.count;
    });

    res.json(days);
  } catch (err) {
    next(err);
  }
};






module.exports = {
  getTasks,
  getTaskStats,
  addTask,
  updateTask,
  deleteTask,
  toggleTask,
  getReminderAlerts,
  getActivityTrend,
};
