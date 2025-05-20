import "@lwc/synthetic-shadow";
import { createElement } from "lwc";
import App from "core/app";

document.body.querySelector("core-app")?.remove();
const elm = createElement("core-app", { is: App });
document.body.appendChild(elm);
