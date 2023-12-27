namespace App {
	export enum PROJECT_STATUS {
		ACTIVE,
		FINISHED,
	}

	export class Project {
		constructor(
			public id: string,
			public title: string,
			public description: string,
			public people: number,
			public status: PROJECT_STATUS
		) {}
	}
}
