"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Project = exports.PROJECT_STATUS = void 0;
var PROJECT_STATUS;
(function (PROJECT_STATUS) {
    PROJECT_STATUS[PROJECT_STATUS["ACTIVE"] = 0] = "ACTIVE";
    PROJECT_STATUS[PROJECT_STATUS["FINISHED"] = 1] = "FINISHED";
})(PROJECT_STATUS || (exports.PROJECT_STATUS = PROJECT_STATUS = {}));
class Project {
    constructor(id, title, description, people, status) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.people = people;
        this.status = status;
    }
}
exports.Project = Project;
//# sourceMappingURL=projectModel.js.map