"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectItem = void 0;
const ComponentAbstract_1 = require("../Interface/ComponentAbstract");
const autobind_1 = require("../util/autobind");
class ProjectItem extends ComponentAbstract_1.Component {
    get persons() {
        if (this.project.people === 1) {
            return '1 person';
        }
        return `${this.project.people} persons`;
    }
    constructor(hostId, project) {
        super('single-project', hostId, false, project.id);
        this.project = project;
        this.configure();
        this.renderContent();
    }
    dragStartHAndler(event) {
        event.dataTransfer.setData('text/plain', this.project.id);
        event.dataTransfer.effectAllowed = 'move';
    }
    dragEndHandler(_) {
        console.log('drag end');
    }
    configure() {
        this.element.addEventListener('dragstart', this.dragStartHAndler);
        this.element.addEventListener('dragend', this.dragEndHandler);
    }
    renderContent() {
        this.element.querySelector('h2').textContent = this.project.title;
        this.element.querySelector('h3').textContent = this.persons + ' assigned';
        this.element.querySelector('p').textContent = this.project.description;
    }
}
exports.ProjectItem = ProjectItem;
__decorate([
    autobind_1.autobind
], ProjectItem.prototype, "dragStartHAndler", null);
__decorate([
    autobind_1.autobind
], ProjectItem.prototype, "configure", null);
//# sourceMappingURL=ProjectItem.js.map