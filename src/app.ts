// autobind decorator

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
			console.log(title, desc, people);
		}
		// console.log(this.titleInputEl.value);
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
