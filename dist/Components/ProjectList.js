"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectList = void 0;
const ComponentAbstract_1 = require("../Interface/ComponentAbstract");
const projectModel_1 = require("../Model/projectModel");
const autobind_1 = require("../util/autobind");
const projectState_1 = require("../State/projectState");
const ProjectItem_1 = require("./ProjectItem");
class ProjectList extends ComponentAbstract_1.Component {
    constructor(type) {
        super('project-list', 'app', false, `${type}-project`);
        this.type = type;
        this.assignedProjects = [];
        this.templateEl = (document.getElementById('project-list'));
        this.configure();
        this.renderContent();
    }
    dragLeaveHandler(_) {
        const listEl = this.element.querySelector('ul');
        listEl.classList.remove('droppable');
    }
    dragOverHandler(event) {
        if (event.dataTransfer && event.dataTransfer.types[0] === 'text/plain') {
            event.preventDefault();
            const listEl = this.element.querySelector('ul');
            listEl.classList.add('droppable');
        }
    }
    dropHAndler(event) {
        const projectId = event.dataTransfer.getData('text/plain');
        projectState_1.projectState.moveProject(projectId, this.type === 'active' ? projectModel_1.PROJECT_STATUS.ACTIVE : projectModel_1.PROJECT_STATUS.FINISHED);
    }
    renderContent() {
        const listId = `${this.type}-projects-list`;
        this.element.querySelector('ul').id = listId;
        this.element.querySelector('h2').textContent =
            this.type.toUpperCase() + ' PROJECTS';
    }
    configure() {
        this.element.addEventListener('dragover', this.dragOverHandler);
        this.element.addEventListener('drop', this.dropHAndler);
        this.element.addEventListener('dragleave', this.dragLeaveHandler);
        projectState_1.projectState.addListener((projects) => {
            const relevantProjects = projects.filter((prj) => {
                if (this.type === 'active')
                    return prj.status === projectModel_1.PROJECT_STATUS.ACTIVE;
                return prj.status === projectModel_1.PROJECT_STATUS.FINISHED;
            });
            this.assignedProjects = relevantProjects;
            this.renderProjects();
        });
    }
    renderProjects() {
        const listEl = (document.getElementById(`${this.type}-projects-list`));
        listEl.innerHTML = '';
        for (const projectItem of this.assignedProjects) {
            new ProjectItem_1.ProjectItem(listEl.id, projectItem);
        }
    }
}
exports.ProjectList = ProjectList;
__decorate([
    autobind_1.autobind
], ProjectList.prototype, "dragLeaveHandler", null);
__decorate([
    autobind_1.autobind
], ProjectList.prototype, "dragOverHandler", null);
__decorate([
    autobind_1.autobind
], ProjectList.prototype, "dropHAndler", null);
//# sourceMappingURL=ProjectList.js.map