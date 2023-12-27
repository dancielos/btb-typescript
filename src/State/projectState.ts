namespace App {
	export type Listener<T> = (items: T[]) => void;

	export class State<T> {
		protected listeners: Listener<T>[] = [];
		addListener(listenerFn: Listener<T>) {
			this.listeners.push(listenerFn);
		}
	}
	export class ProjectState extends State<Project> {
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

	export const projectState = ProjectState.getInstance();
}
