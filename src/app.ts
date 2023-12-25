// Code goes here!
class ProjectInput {
	templateEl: HTMLTemplateElement;
	hostEl: HTMLDivElement;
	element: HTMLFormElement;

	constructor() {
		this.templateEl = <HTMLTemplateElement>(
			document.getElementById('project-input')!
		);
		this.hostEl = <HTMLDivElement>document.getElementById('app')!;

		const importedNode = document.importNode(this.templateEl.content, true);

		this.element = <HTMLFormElement>importedNode.firstElementChild;
		this.attach();
	}

	private attach() {
		this.hostEl.insertAdjacentElement('afterbegin', this.element);
	}
}

const proj = new ProjectInput();
