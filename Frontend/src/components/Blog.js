import api from "../utils/axiosUtil";
import { BlogCard } from "./BlogCard";

export class Blog {
    constructor(parentNode) {
        this.parentNode = parentNode
    }

    async init() {
        const blog = await this.render();
        this.parentNode.appendChild(blog);
    }

    async render() {
        const blog = document.createElement("div");
        blog.className = "blog container";

        const res = await api.get("/posts");
        const posts = res.data;

        posts.forEach(post => {
            const blogCard = new BlogCard(post).render();
            blog.appendChild(blogCard);
        });

        return blog;
    }
}