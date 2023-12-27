"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var PROJECT_STATUS;
(function (PROJECT_STATUS) {
    PROJECT_STATUS[PROJECT_STATUS["ACTIVE"] = 0] = "ACTIVE";
    PROJECT_STATUS[PROJECT_STATUS["FINISHED"] = 1] = "FINISHED";
})(PROJECT_STATUS || (PROJECT_STATUS = {}));
class Project {
    constructor(id, title, description, people, status) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.people = people;
        this.status = status;
    }
}
class State {
    constructor() {
        this.listeners = [];
    }
    addListener(listenerFn) {
        this.listeners.push(listenerFn);
    }
}
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
        const newProject = new Project(Math.random().toString(), title, description, numOfPeople, PROJECT_STATUS.ACTIVE);
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
const projectState = ProjectState.getInstance();
function validate(validatableInput) {
    let isValid = true;
    if (validatableInput.required) {
        isValid = isValid && validatableInput.value.toString().trim().length > 0;
    }
    if (validatableInput.minLength != null &&
        typeof validatableInput.value === 'string') {
        isValid =
            isValid &&
                validatableInput.value.trim().length >= validatableInput.minLength;
    }
    if (validatableInput.maxLength != null &&
        typeof validatableInput.value === 'string') {
        isValid =
            isValid &&
                validatableInput.value.trim().length <= validatableInput.maxLength;
    }
    if (validatableInput.max != null &&
        typeof validatableInput.value === 'number') {
        isValid = isValid && validatableInput.value <= validatableInput.max;
    }
    if (validatableInput.min != null &&
        typeof validatableInput.value === 'number') {
        isValid = isValid && validatableInput.value >= validatableInput.min;
    }
    return isValid;
}
function autobind(_, _2, descriptor) {
    const originalMethod = descriptor.value;
    const newDescriptor = {
        configurable: true,
        get() {
            const boundFn = originalMethod.bind(this);
            return boundFn;
        },
    };
    return newDescriptor;
}
class Component {
    constructor(templateId, hostElementId, insertAtStart, newElementId) {
        this.templateEl = document.getElementById(templateId);
        this.hostEl = document.getElementById(hostElementId);
        const importedNode = document.importNode(this.templateEl.content, true);
        this.element = importedNode.firstElementChild;
        if (newElementId)
            this.element.id = newElementId;
        this.attach(insertAtStart);
    }
    attach(insertAtStart) {
        this.hostEl.insertAdjacentElement(insertAtStart ? 'afterbegin' : 'beforeend', this.element);
    }
}
class ProjectItem extends Component {
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
__decorate([
    autobind
], ProjectItem.prototype, "dragStartHAndler", null);
__decorate([
    autobind
], ProjectItem.prototype, "configure", null);
class ProjectList extends Component {
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
        projectState.moveProject(projectId, this.type === 'active' ? PROJECT_STATUS.ACTIVE : PROJECT_STATUS.FINISHED);
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
        projectState.addListener((projects) => {
            const relevantProjects = projects.filter((prj) => {
                if (this.type === 'active')
                    return prj.status === PROJECT_STATUS.ACTIVE;
                return prj.status === PROJECT_STATUS.FINISHED;
            });
            this.assignedProjects = relevantProjects;
            this.renderProjects();
        });
    }
    renderProjects() {
        const listEl = (document.getElementById(`${this.type}-projects-list`));
        listEl.innerHTML = '';
        for (const projectItem of this.assignedProjects) {
            new ProjectItem(listEl.id, projectItem);
        }
    }
}
__decorate([
    autobind
], ProjectList.prototype, "dragLeaveHandler", null);
__decorate([
    autobind
], ProjectList.prototype, "dragOverHandler", null);
__decorate([
    autobind
], ProjectList.prototype, "dropHAndler", null);
class ProjectInput extends Component {
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
            projectState.addProject(title, desc, people);
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
        if (!validate(titleValidatable) ||
            !validate(descriptionValidatable) ||
            !validate(peopleValidatable)) {
            alert('Invalid input');
            return;
        }
        else {
            return [enteredTitle, enteredDescription, +enteredPeople];
        }
    }
}
__decorate([
    autobind
], ProjectInput.prototype, "submitHandler", null);
const proj = new ProjectInput();
const activeProjectList = new ProjectList('active');
const finishedProjectList = new ProjectList('finished');
//# sourceMappingURL=app.js.map