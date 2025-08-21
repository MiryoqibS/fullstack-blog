import { Api } from "../utils/api";
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

        const posts = await Api.getPosts();

        posts.forEach(post => {
            console.log(post);
            
            const blogCard = new BlogCard(post).render();
            blog.appendChild(blogCard);
        });

        return blog;
    }
}