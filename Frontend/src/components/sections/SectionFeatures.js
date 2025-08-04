import { BlogCard } from "../BlogCard";
import { Section } from "../section";

export class SectionFeatures extends Section {
    constructor(parentNode, title) {
        super(title);
        this.parentNode = parentNode;
    }

    init() {
        const features = this.render();
        this.parentNode.appendChild(features);
    }

    render() {
        const section = document.createElement("div");
        section.className = "features section container";

        const sectionHeader = this._createHeader();
        sectionHeader.className = "features-header section-header"

        const sectionBody = this._createBody();

        section.appendChild(sectionHeader);
        section.appendChild(sectionBody);

        return section;
    }

    _createBody() {
        const body = document.createElement("div");
        body.className = "section-body";

        // Временно для проверки работы статический массив
        const featureBlogs = [
            {
                title: "Test",
                author: "Miryoqib",
                description: "lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem",
                thumbnail: "https://live.worldtourismforum.net/uploads/The%20Future%20of%20Tourism.jpg",
                category: "test",
                date: Date.now(),
            },
            {
                title: "Test",
                author: "Miryoqib",
                description: "lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem",
                thumbnail: "https://live.worldtourismforum.net/uploads/The%20Future%20of%20Tourism.jpg",
                category: "test",
                date: Date.now(),
            }
        ];

        featureBlogs.forEach((blog) => {
            const blogCard = new BlogCard(blog).render();
            body.appendChild(blogCard);
        })

        return body;
    }
}