namespace App {
	export abstract class Component<
		T extends HTMLElement,
		U extends HTMLElement
	> {
		templateEl: HTMLTemplateElement;
		hostEl: T;
		element: U;

		constructor(
			templateId: string,
			hostElementId: string,
			insertAtStart: boolean,
			newElementId?: string
		) {
			this.templateEl = <HTMLTemplateElement>(
				document.getElementById(templateId)!
			);
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
}
