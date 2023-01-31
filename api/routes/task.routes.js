const controller = require("../controllers/task.controller");

module.exports = function(app) {
    app.get("/lists/:listId/tasks/:taskId", controller.getTask);
    app.get("/lists/:id/tasks", controller.getTasks);
    app.post("/lists/:id/tasks", controller.addTask);    
    app.post("/lists/:id/cloneTask", controller.cloneTask);
    app.patch("/lists/:listId/tasks/:taskId", controller.updateTask);
    app.patch("/lists/:listId/tasks/:taskId/startPause", controller.updateTaskWorkIntervals);
    app.patch("/lists/:listId/reorderTasks", controller.reorderTasks);
    app.delete("/lists/:listId/tasks/:taskId", controller.deleteTask); 
};