import { loadIcon } from "../utils/loadIcon";

export class Section {
    constructor(title) {
        this.title = title;
    }

    _createHeader() {
        const header = document.createElement("header");

        const title = document.createElement("h1");
        title.className = "section-header__title";
        title.innerText = this.title;

        const link = document.createElement("a");
        link.className = "section-header__link";
        link.innerText = "Перейти"

        const arrowRightIcon = loadIcon("arrowRight", 20, 20);
        link.appendChild(arrowRightIcon);

        header.append(title);
        header.append(link);

        return header;
    }
}