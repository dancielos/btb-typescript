// interface Project {
// 	id: string;
// 	title: string;
// 	description: string;
// 	people: number;
// }

/// <reference path="Interface/dragDropInterfaces.ts" />
/// <reference path="Interface/validatable.ts" />
/// <reference path="Model/projectModel.ts" />
/// <reference path="State/projectState.ts" />
/// <reference path="util/validate.ts" />
/// <reference path="util/autobind.ts" />
/// <reference path="Interface/ComponentAbstract.ts" />
/// <reference path="Components/ProjectItem.ts" />
/// <reference path="Components/ProjectList.ts" />
/// <reference path="Components/ProjectInput.ts" />

namespace App {
	// Project Input Class

	new ProjectInput();
	new ProjectList('active');
	new ProjectList('finished');
}
