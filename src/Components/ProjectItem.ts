import { Component } from '../Interface/ComponentAbstract';
import { Draggable } from '../Interface/dragDropInterfaces';
import { Project } from '../Model/projectModel';
import { autobind } from '../util/autobind';

export class ProjectItem
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
