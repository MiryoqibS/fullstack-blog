import { BlogCard } from "../BlogCard";
import { Section } from "../section";
import { Api } from "../../utils/api";

export class SectionFeatures extends Section {
    constructor(parentNode, title) {
        super(title);
        this.parentNode = parentNode;
    }

    async init() {
        const features = await this.render();
        this.parentNode.appendChild(features);
    }

    async render() {
        const section = document.createElement("div");
        section.className = "features section container";

        const sectionHeader = this._createHeader();
        sectionHeader.className = "features-header section-header"

        const sectionBody = await this._createBody();

        section.appendChild(sectionHeader);
        section.appendChild(sectionBody);

        return section;
    }

    async _createBody() {
        const body = document.createElement("div");
        body.className = "section-body";

        // Временно для проверки работы статический массив
        const featureBlogs = await Api.getLatestPosts();

        featureBlogs.forEach((blog) => {
            const blogCard = new BlogCard(blog).render();
            body.appendChild(blogCard);
        })

        return body;
    }
}