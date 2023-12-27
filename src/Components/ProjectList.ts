import { Component } from '../Interface/ComponentAbstract';
import { DragTarget } from '../Interface/dragDropInterfaces';
import { Project, PROJECT_STATUS } from '../Model/projectModel';
import { autobind } from '../util/autobind';
import { projectState } from '../State/projectState';
import { ProjectItem } from './ProjectItem';

export class ProjectList
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
