// interface Project {
// 	id: string;
// 	title: string;
// 	description: string;
// 	people: number;
// }
interface Draggable {
	dragStartHAndler(event: DragEvent): void;
	dragEndHandler(event: DragEvent): void;
}

interface DragTarget {
	dragOverHandler(event: DragEvent): void;
	dropHAndler(event: DragEvent): void;
	dragLeaveHandler(event: DragEvent): void;
}

enum PROJECT_STATUS {
	ACTIVE,
	FINISHED,
}

class Project {
	constructor(
		public id: string,
		public title: string,
		public description: string,
		public people: number,
		public status: PROJECT_STATUS
	) {}
}

type Listener<T> = (items: T[]) => void;

class State<T> {
	protected listeners: Listener<T>[] = [];
	addListener(listenerFn: Listener<T>) {
		this.listeners.push(listenerFn);
	}
}

class ProjectState extends State<Project> {
	private projects: Project[] = [];
	private static instance: ProjectState;

	private constructor() {
		super();
	}

	static getInstance() {
		if (this.instance) {
			return this.instance;
		}

		this.instance = new ProjectState();
		return this.instance;
	}

	addProject(title: string, description: string, numOfPeople: number) {
		const newProject = new Project(
			Math.random().toString(),
			title,
			description,
			numOfPeople,
			PROJECT_STATUS.ACTIVE
		);
		//  Project = {
		// 	id: Math.random().toString(),
		// 	title,
		// 	description,
		// 	people: numOfPeople,
		// };
		this.projects.push(newProject);
		this.updateListeners();
		console.log(this.projects);
	}

	moveProject(id: string, newStatus: PROJECT_STATUS) {
		const project = this.projects.find((project) => project.id === id);
		if (project && project.status !== newStatus) {
			project.status = newStatus;
			this.updateListeners();
		}
	}

	private updateListeners() {
		for (const listenerFn of this.listeners) {
			listenerFn(this.projects.slice());
		}
	}
}

const projectState = ProjectState.getInstance();

interface Validatable {
	value: string | number;
	required?: boolean;
	minLength?: number;
	maxLength?: number;
	min?: number;
	max?: number;
}

function validate(validatableInput: Validatable) {
	let isValid = true;

	if (validatableInput.required) {
		isValid = isValid && validatableInput.value.toString().trim().length > 0;
	}
	if (
		validatableInput.minLength != null &&
		typeof validatableInput.value === 'string'
	) {
		isValid =
			isValid &&
			validatableInput.value.trim().length >= validatableInput.minLength;
	}
	if (
		validatableInput.maxLength != null &&
		typeof validatableInput.value === 'string'
	) {
		isValid =
			isValid &&
			validatableInput.value.trim().length <= validatableInput.maxLength;
	}
	if (
		validatableInput.max != null &&
		typeof validatableInput.value === 'number'
	) {
		isValid = isValid && validatableInput.value <= validatableInput.max;
	}
	if (
		validatableInput.min != null &&
		typeof validatableInput.value === 'number'
	) {
		isValid = isValid && validatableInput.value >= validatableInput.min;
	}

	return isValid;
}

function autobind(_: any, _2: string, descriptor: PropertyDescriptor) {
	const originalMethod = descriptor.value;
	const newDescriptor: PropertyDescriptor = {
		configurable: true,
		get() {
			const boundFn = originalMethod.bind(this);
			return boundFn;
		},
	};

	return newDescriptor;
}

abstract class Component<T extends HTMLElement, U extends HTMLElement> {
	templateEl: HTMLTemplateElement;
	hostEl: T;
	element: U;

	constructor(
		templateId: string,
		hostElementId: string,
		insertAtStart: boolean,
		newElementId?: string
	) {
		this.templateEl = <HTMLTemplateElement>document.getElementById(templateId)!;
		this.hostEl = <T>document.getElementById(hostElementId)!;

		const importedNode = document.importNode(this.templateEl.content, true);

		this.element = <U>importedNode.firstElementChild;
		if (newElementId) this.element.id = newElementId;

		this.attach(insertAtStart);
	}

	private attach(insertAtStart: boolean) {
		this.hostEl.insertAdjacentElement(
			insertAtStart ? 'afterbegin' : 'beforeend',
			this.element
		);
	}

	abstract configure(): void;
	abstract renderContent(): void;
}

class ProjectItem
	extends Component<HTMLUListElement, HTMLLIElement>
	implements Draggable
{
	private project: Project;

	get persons(): string {
		if (this.project.people === 1) {
			return '1 person';
		}
		return `${this.project.people} persons`;
	}

	constructor(hostId: string, project: Project) {
		super('single-project', hostId, false, project.id);
		this.project = project;

		this.configure();
		this.renderContent();
	}

	@autobind
	dragStartHAndler(event: DragEvent): void {
		event.dataTransfer!.setData('text/plain', this.project.id);
		event.dataTransfer!.effectAllowed = 'move';
	}

	dragEndHandler(_: DragEvent): void {
		console.log('drag end');
	}

	@autobind
	configure(): void {
		this.element.addEventListener('dragstart', this.dragStartHAndler);
		this.element.addEventListener('dragend', this.dragEndHandler);
	}

	renderContent(): void {
		this.element.querySelector('h2')!.textContent = this.project.title;
		this.element.querySelector('h3')!.textContent = this.persons + ' assigned';
		this.element.querySelector('p')!.textContent = this.project.description;
	}
}

class ProjectList
	extends Component<HTMLDivElement, HTMLElement>
	implements DragTarget
{
	assignedProjects: Project[];

	constructor(private type: 'active' | 'finished') {
		super('project-list', 'app', false, `${type}-project`);
		this.assignedProjects = [];
		this.templateEl = <HTMLTemplateElement>(
			document.getElementById('project-list')!
		);

		this.configure();
		this.renderContent();
	}

	@autobind
	dragLeaveHandler(_: DragEvent): void {
		const listEl = this.element.querySelector('ul')!;
		listEl.classList.remove('droppable');
	}

	@autobind
	dragOverHandler(event: DragEvent): void {
		if (event.dataTransfer && event.dataTransfer.types[0] === 'text/plain') {
			event.preventDefault();
			const listEl = this.element.querySelector('ul')!;
			listEl.classList.add('droppable');
		}
	}

	@autobind
	dropHAndler(event: DragEvent): void {
		const projectId = event.dataTransfer!.getData('text/plain');
		projectState.moveProject(
			projectId,
			this.type === 'active' ? PROJECT_STATUS.ACTIVE : PROJECT_STATUS.FINISHED
		);
	}

	renderContent() {
		const listId = `${this.type}-projects-list`;
		this.element.querySelector('ul')!.id = listId;
		this.element.querySelector('h2')!.textContent =
			this.type.toUpperCase() + ' PROJECTS';
	}
	configure() {
		this.element.addEventListener('dragover', this.dragOverHandler);
		this.element.addEventListener('drop', this.dropHAndler);
		this.element.addEventListener('dragleave', this.dragLeaveHandler);

		projectState.addListener((projects: Project[]) => {
			const relevantProjects = projects.filter((prj) => {
				if (this.type === 'active') return prj.status === PROJECT_STATUS.ACTIVE;
				return prj.status === PROJECT_STATUS.FINISHED;
			});
			this.assignedProjects = relevantProjects;
			this.renderProjects();
		});
	}

	private renderProjects() {
		const listEl = <HTMLUListElement>(
			document.getElementById(`${this.type}-projects-list`)
		);
		listEl.innerHTML = '';
		for (const projectItem of this.assignedProjects) {
			new ProjectItem(listEl.id, projectItem);
		}
	}
}

// Project Input Class
class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
	titleInputEl: HTMLInputElement;
	descInputEl: HTMLInputElement;
	peopleInputEl: HTMLInputElement;

	constructor() {
		super('project-input', 'app', true, 'user-input');

		this.titleInputEl = <HTMLInputElement>this.element.querySelector('#title');
		this.descInputEl = <HTMLInputElement>(
			this.element.querySelector('#description')
		);
		this.peopleInputEl = <HTMLInputElement>(
			this.element.querySelector('#people')
		);

		this.configure();
	}

	configure() {
		this.element.addEventListener('submit', this.submitHandler);
	}

	renderContent(): void {}

	@autobind
	private submitHandler(event: Event) {
		event.preventDefault();
		const userInput = this.gatherUserInput();
		if (Array.isArray(userInput)) {
			const [title, desc, people] = userInput;
			projectState.addProject(title, desc, people);
			// console.log(title, desc, people);
			this.clearInputs();
		}
		// console.log(this.titleInputEl.value);
	}

	private clearInputs(): void {
		this.titleInputEl.value = '';
		this.descInputEl.value = '';
		this.peopleInputEl.value = '';
	}

	private gatherUserInput(): [string, string, number] | void {
		const enteredTitle = this.titleInputEl.value;
		const enteredDescription = this.descInputEl.value;
		const enteredPeople = this.peopleInputEl.value;

		const titleValidatable: Validatable = {
			value: enteredTitle,
			required: true,
		};
		const descriptionValidatable: Validatable = {
			value: enteredDescription,
			minLength: 5,
			required: true,
		};
		const peopleValidatable: Validatable = {
			value: +enteredPeople,
			required: true,
			min: 1,
			max: 5,
		};

		if (
			!validate(titleValidatable) ||
			!validate(descriptionValidatable) ||
			!validate(peopleValidatable)
		) {
			alert('Invalid input');
			return;
		} else {
			return [enteredTitle, enteredDescription, +enteredPeople];
		}
	}
}

const proj = new ProjectInput();
const activeProjectList = new ProjectList('active');
const finishedProjectList = new ProjectList('finished');
