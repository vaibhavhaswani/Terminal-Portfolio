import { parse, type, prompt, input } from "./io.js";
import pause from "./pause.js";
import alert from "./alert.js";

let USER = "";

/** Boot screen */
async function boot() {
	clear();

	await type("Portfolio Terminal v1.0", {
		initialWait: 1000
	});
	await type(["....", "....","...."], { lineWait: 150 });

	await type("Hello, I am Vaibhav Haswani", {
		initialWait: 3000
	});

	await type([".",["."]], { lineWait: 150 });
	
	await type("The Administrator of this Portfolio Terminal Machine ...", {
		initialWait: 1000
	});

	await type(["....", "...",".."], { lineWait: 150 });

	await type(["> SET TERMINAL/BOOT", "Loading........................"], {
		lineWait: 1000
	});
	await type(
		[
			".....",
			"Please wait........",
			"..........",
		],
		{ lineWait: 250 }
	);

	await type(["OK.", " "]);

	await alert("Identity Verification Required...")
	clear();

	await type(["> SET TERMINAL/LOGON", "- USER AUTHENTICATION CHECK -"], {
		lineWait: 1000,
		finalWait: 3000
	});

	await type([".", "."], { lineWait: 150 });

	await type(["ACCESS GRANTED BY Administrator"], {
		lineWait: 3000,
		finalWait: 3000
	});
	clear(); //
	await alert("Login Successful, Welcome User !")
	await pause();
	return login();
}

// /** Login screen */
// async function login() {
// 	clear();
// 	let user = await prompt("Enter My Name:");

// 	if (user === USER) {
// 		await pause();
// 		await alert("USER FOUND");
// 		clear();
// 		return main();
// 	} else {
// 		await type(["User Does Not Exist.", "Please try again"]);
// 		await pause(3);
// 		clear();
// 		return login();
// 	}
// }
// async function registerUser() {
//     clear();
//     USER = await prompt("Register a USER Name:");
//     await pause();
//     await alert("USER Registered Successfully");
// }

// async function login() {

//     if (!USER) {
//         await alert("No USER Registered. Redirecting to Registration...");
//         await pause(2);
//         return registerUser().then(login);
//     }

//     let user = await prompt("Enter USER Name:");

//     if (user === USER) {
//         await pause();
//         await alert("USER FOUND");
//         clear();
// 		await type(["Operating System: Terminal OS | Administrator: Vaibhav Haswani","type `help` to check the list of commands available..."]);
//         return main();
//     } else {
//         await type(["User Does Not Exist.", "Please enter the registered USER name."]);
//         await pause(3);
//         clear();
//         return login();
//     }
// }

async function login() {
	clear();
	await type("========================================================================");
	await type("    Operating System: Portfolio OS | Administrator: Vaibhav Haswani");
	await type("========================================================================");
	await type([" ", " "], { lineWait: 150 });
	await type("> type `help` to check the list of commands available...");
	return main();
}

/** Main input terminal, recursively calls itself */
async function main() {
	let command = await input();
	try {
		await parse(command);
	} catch (e) {
		if (e.message) await type(e.message);
	}

	main();
}

function addClasses(el, ...cls) {
	let list = [...cls].filter(Boolean);
	el.classList.add(...list);
}

function getScreen(...cls) {
	let div = document.createElement("div");
	addClasses(div, "fullscreen", ...cls);
	document.querySelector("#crt").appendChild(div);
	return div;
}

function toggleFullscreen(isFullscreen) {
	document.body.classList.toggle("fullscreen", isFullscreen);
}

/** Attempts to load template HTML from the given path and includes them in the <head>. */
async function loadTemplates(path) {
	let txt = await fetch(path).then((res) => res.text());
	let html = new DOMParser().parseFromString(txt, "text/html");
	let templates = html.querySelectorAll("template");

	templates.forEach((template) => {
		document.head.appendChild(template);
	});
}

/** Clones the template and adds it to the container. */
async function addTemplate(id, container, options = {}) {
	let template = document.querySelector(`template#${id}`);
	if (!template) {
		throw Error("Template not found");
	}
	// Clone is the document fragment of the template
	let clone = document.importNode(template.content, true);

	if (template.dataset.type) {
		await type(clone.textContent, options, container);
	} else {
		container.appendChild(clone);
	}

	// We cannot return clone here
	// https://stackoverflow.com/questions/27945721/how-to-clone-and-modify-from-html5-template-tag
	return container.childNodes;
}

/** Creates a new screen and loads the given template into it. */
async function showTemplateScreen(id) {
	let screen = getScreen(id);
	await addTemplate(id, screen);
	return screen;
}

/**
 * Creates an element and adds it to the given container (or terminal screen if undefined).
 * @param {String} type The type of element to create.
 * @param {Element} container The container to add the created element to.
 * @param {String} cls The class to apply to the created element.
 * @param {Object} attrs Extra attributes to set on the element.
 */
function el(
	type,
	container = document.querySelector(".terminal"),
	cls = "",
	attrs
) {
	let el = document.createElement(type);
	addClasses(el, cls);

	container.appendChild(el);

	if (attrs) {
		Object.entries(attrs).forEach(([key, value]) => {
			el.setAttribute(key, value);
		});
	}
	return el;
}

/**
 * Creates a <div> and adds it to the screen.
 * @param {Element} container The container to add the created element to.
 * @param {String} cls The class to apply to the created element.
 */
function div(...args) {
	return el("div", ...args);
}

function clear(screen = document.querySelector(".terminal")) {
	screen.innerHTML = "";
}

export {
	boot,
	login,
	main,
	clear,
	getScreen,
	toggleFullscreen,
	div,
	el,
	loadTemplates,
	addTemplate,
	showTemplateScreen
};
