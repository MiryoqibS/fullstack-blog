export class Loader {
    constructor(parentNode) {
        this.parentNode = parentNode;
    }

    init() {
        const loader = this.render();

        document.addEventListener("DOMContentLoaded", () => {
            this.hide();
        });

        this.parentNode.appendChild(loader);
    }

    render() {
        const loader = document.createElement("div");
        loader.className = "loader";

        const loaderSpinner = document.createElement("span");
        loaderSpinner.className = "loader__spinner";

        loader.appendChild(loaderSpinner);

        this.loader = loader;

        return loader;
    }

    hide() {
        if (this.loader) {
            setTimeout(() => {
                this.loader.classList.add("hide");
                setTimeout(() => {
                    this.loader.remove();
                }, 1000);
            }, 1500);
        };
    }
}