// autobind decorator

interface Project {
	id: string;
	title: string;
	description: string;
	people: number;
}

class ProjectState {
	private listeners: any[] = [];
	private projects: any[] = [];
	private static instance: ProjectState;

	private constructor() {}

	static getInstance() {
		if (this.instance) {
			return this.instance;
		}

		this.instance = new ProjectState();
		return this.instance;
	}

	addListener(listenerFn: Function) {
		this.listeners.push(listenerFn);
	}

	addProject(title: string, description: string, numOfPeople: number) {
		const newProject: Project = {
			id: Math.random().toString(),
			title,
			description,
			people: numOfPeople,
		};
		this.projects.push(newProject);
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

class ProjectList {
	templateEl: HTMLTemplateElement;
	hostEl: HTMLDivElement;
	element: HTMLElement;
	assignedProjects: any[];

	constructor(private type: 'active' | 'finished') {
		this.templateEl = <HTMLTemplateElement>(
			document.getElementById('project-list')!
		);
		this.hostEl = <HTMLDivElement>document.getElementById('app')!;
		this.assignedProjects = [];

		const importedNode = document.importNode(this.templateEl.content, true);

		this.element = <HTMLElement>importedNode.firstElementChild;
		this.element.id = `${this.type}-project`;

		projectState.addListener((projects: any[]) => {
			this.assignedProjects = projects;
			this.renderProjects();
		});

		this.attach();
		this.renderContent();
	}

	private renderProjects() {
		const listEl = <HTMLUListElement>(
			document.getElementById(`${this.type}-projects-list`)
		);
		for (const projectItem of this.assignedProjects) {
			const listItem = <HTMLLIElement>document.createElement('li');
			listItem.textContent = projectItem.title;
			listEl?.appendChild(listItem);
		}
	}

	private attach() {
		this.hostEl.insertAdjacentElement('beforeend', this.element);
	}

	private renderContent() {
		const listId = `${this.type}-projects-list`;
		this.element.querySelector('ul')!.id = listId;
		this.element.querySelector('h2')!.textContent =
			this.type.toUpperCase() + ' PROJECTS';
	}
}

// Project Input Class
class ProjectInput {
	templateEl: HTMLTemplateElement;
	hostEl: HTMLDivElement;
	element: HTMLFormElement;

	titleInputEl: HTMLInputElement;
	descInputEl: HTMLInputElement;
	peopleInputEl: HTMLInputElement;

	constructor() {
		this.templateEl = <HTMLTemplateElement>(
			document.getElementById('project-input')!
		);
		this.hostEl = <HTMLDivElement>document.getElementById('app')!;

		const importedNode = document.importNode(this.templateEl.content, true);

		this.element = <HTMLFormElement>importedNode.firstElementChild;
		this.element.id = 'user-input';

		this.titleInputEl = <HTMLInputElement>this.element.querySelector('#title');
		this.descInputEl = <HTMLInputElement>(
			this.element.querySelector('#description')
		);
		this.peopleInputEl = <HTMLInputElement>(
			this.element.querySelector('#people')
		);

		this.configure();
		this.attach();
	}

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

	private configure() {
		this.element.addEventListener('submit', this.submitHandler);
	}

	private attach() {
		this.hostEl.insertAdjacentElement('afterbegin', this.element);
	}
}

const proj = new ProjectInput();
const activeProjectList = new ProjectList('active');
const finishedProjectList = new ProjectList('finished');
