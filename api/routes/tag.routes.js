const controller = require("../controllers/tag.controller");

module.exports = function(app) {
    app.get("/tags", controller.getTags);
    app.post("/tags", controller.addTag);   
    app.delete("/tags/:id", controller.deleteTag); 
    app.delete("/removetags", controller.deleteAllTags);
};