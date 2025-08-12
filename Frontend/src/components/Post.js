import api from "../utils/axiosUtil";
import { PostCard } from "./PostCard";

export class Post {
    constructor(parentNode) {
        this.parentNode = parentNode;
    }

    async init() {
        const post = await this.render();
        this.parentNode.appendChild(post);
    }

    async render() {
        const post = document.createElement("div");
        post.className = "post container";

        const postId = this._getPostIdByUrl();
        const response = await api.get(`/posts/${postId}`);
        const data = response.data;
        const postCard = await new PostCard(data).render();

        const postSidebar = this.createSidebar();

        post.appendChild(postCard);
        post.appendChild(postSidebar);

        return post;
    }

    createSidebar() {
        const sidebar = document.createElement("aside");
        sidebar.className = "post-sidebar";

        const title = document.createElement("h3");
        title.className = "post-sidebar__title";
        title.innerText = "Навигация по посту";

        sidebar.appendChild(title);

        return sidebar;
    }

    _getPostIdByUrl() {
        const queryParams = new URLSearchParams(window.location.search);
        const postId = queryParams.get("id");

        if (!postId) {
            window.location.href = "/src/pages/blog.html";
        };

        return postId;
    }
}