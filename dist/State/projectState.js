"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.projectState = exports.ProjectState = exports.State = void 0;
const projectModel_1 = require("../Model/projectModel");
class State {
    constructor() {
        this.listeners = [];
    }
    addListener(listenerFn) {
        this.listeners.push(listenerFn);
    }
}
exports.State = State;
class ProjectState extends State {
    constructor() {
        super();
        this.projects = [];
    }
    static getInstance() {
        if (this.instance) {
            return this.instance;
        }
        this.instance = new ProjectState();
        return this.instance;
    }
    addProject(title, description, numOfPeople) {
        const newProject = new projectModel_1.Project(Math.random().toString(), title, description, numOfPeople, projectModel_1.PROJECT_STATUS.ACTIVE);
        this.projects.push(newProject);
        this.updateListeners();
        console.log(this.projects);
    }
    moveProject(id, newStatus) {
        const project = this.projects.find((project) => project.id === id);
        if (project && project.status !== newStatus) {
            project.status = newStatus;
            this.updateListeners();
        }
    }
    updateListeners() {
        for (const listenerFn of this.listeners) {
            listenerFn(this.projects.slice());
        }
    }
}
exports.ProjectState = ProjectState;
exports.projectState = ProjectState.getInstance();
//# sourceMappingURL=projectState.js.map