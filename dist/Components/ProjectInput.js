"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectInput = void 0;
const ComponentAbstract_1 = require("../Interface/ComponentAbstract");
const projectState_1 = require("../State/projectState");
const autobind_1 = require("../util/autobind");
const validate_1 = require("../util/validate");
class ProjectInput extends ComponentAbstract_1.Component {
    constructor() {
        super('project-input', 'app', true, 'user-input');
        this.titleInputEl = this.element.querySelector('#title');
        this.descInputEl = (this.element.querySelector('#description'));
        this.peopleInputEl = (this.element.querySelector('#people'));
        this.configure();
    }
    configure() {
        this.element.addEventListener('submit', this.submitHandler);
    }
    renderContent() { }
    submitHandler(event) {
        event.preventDefault();
        const userInput = this.gatherUserInput();
        if (Array.isArray(userInput)) {
            const [title, desc, people] = userInput;
            projectState_1.projectState.addProject(title, desc, people);
            this.clearInputs();
        }
    }
    clearInputs() {
        this.titleInputEl.value = '';
        this.descInputEl.value = '';
        this.peopleInputEl.value = '';
    }
    gatherUserInput() {
        const enteredTitle = this.titleInputEl.value;
        const enteredDescription = this.descInputEl.value;
        const enteredPeople = this.peopleInputEl.value;
        const titleValidatable = {
            value: enteredTitle,
            required: true,
        };
        const descriptionValidatable = {
            value: enteredDescription,
            minLength: 5,
            required: true,
        };
        const peopleValidatable = {
            value: +enteredPeople,
            required: true,
            min: 1,
            max: 5,
        };
        if (!(0, validate_1.validate)(titleValidatable) ||
            !(0, validate_1.validate)(descriptionValidatable) ||
            !(0, validate_1.validate)(peopleValidatable)) {
            alert('Invalid input');
            return;
        }
        else {
            return [enteredTitle, enteredDescription, +enteredPeople];
        }
    }
}
exports.ProjectInput = ProjectInput;
__decorate([
    autobind_1.autobind
], ProjectInput.prototype, "submitHandler", null);
//# sourceMappingURL=ProjectInput.js.map