import api from "../utils/axiosUtil";
import { formatDate } from "../utils/formatDate";

export class PostCard {
    constructor({ author, title, description, category, thumbnailUrl, createdAt, _id }) {
        this.author = author;
        this.title = title;
        this.description = description;
        this.thumbnailUrl = thumbnailUrl;
        this.category = category;
        this.createdAt = new Date(createdAt);
        this.id = _id;
    }

    async render() {
        const postCard = document.createElement("div");
        postCard.className = "post-card";

        const postCardHeader = this.createCardHeader();

        const postCardThumbnail = document.createElement("img");
        postCardThumbnail.className = "post-card__thumbnail";
        postCardThumbnail.src = this.thumbnailUrl;

        const postCardDescription = document.createElement("p");
        postCardDescription.className = "post-card__description";
        postCardDescription.innerText = this.description;

        const postComments = await this.createComments();

        postCard.appendChild(postCardHeader);
        postCard.appendChild(postCardThumbnail);
        postCard.appendChild(postCardDescription);
        postCard.appendChild(postComments);

        return postCard;
    }

    createCardHeader() {
        const header = document.createElement("header");
        header.className = "post-card__header";

        const title = document.createElement("h1");
        title.className = "post-card__header-title";
        title.innerText = this.title;

        const information = document.createElement("div");
        information.className = "post-card__header-information";

        const author = document.createElement("p");
        author.className = "post-card__header-information__author";
        author.innerText = this.author.username;

        const category = document.createElement("p");
        category.className = "post-card__header-information__category";
        category.innerText = this.category;

        const date = document.createElement("p");
        date.className = "post-card__header-information__date";
        const elapsedTime = Date.now() - this.createdAt.getTime();


        if (elapsedTime <= 1000 * 60 * 60) {
            // Меньше часа
            date.innerText = "Пост создан недавно";
        } else if (elapsedTime <= 1000 * 60 * 60 * 24) {
            date.innerText = "Пост создан сегодня";
        } else {
            date.innerText = formatDate(this.createdAt);
        };

        information.appendChild(author);
        information.appendChild(category);
        information.appendChild(date);

        header.appendChild(title);
        header.appendChild(information);

        return header;
    }

    async createComments() {
        const comments = document.createElement("div");
        comments.className = "post-card__comments";

        // Поля ввода комментария от пользователя
        const commentField = document.createElement("div");
        commentField.className = "post-card__comments-field";

        const commentUsername = document.createElement("p");
        commentUsername.className = "post-card__comments-field__author";

        try {
            const response = await api.get("/user/profile");
            const user = response.data;
            commentUsername.classList.add(user.role);
            commentUsername.innerText = user.username
        } catch (error) {
            commentUsername.innerText = "Неизвестный";
            console.error(`Ошибка сети: ${error.message}`);
        };

        const commentInput = document.createElement("input");
        commentInput.className = "post-card__comments-field__input";
        commentInput.placeholder = "Ваш комментарий...";

        const commentSubmit = document.createElement("button");
        commentSubmit.type = "button";
        commentSubmit.className = "post-card__comments-field__submit button";
        commentSubmit.innerText = "оставить";

        const postComments = await this._fetchComments();
        const commentsList = this._renderComments(postComments);

        commentSubmit.addEventListener("click", async () => {
            try {
                const response = await api.post(`/comments/${this.id}`, {
                    text: commentInput.value
                });

                if (response.status === 201) {
                    const comments = await this._fetchComments();
                    const updatedPostComments = this._renderComments(comments);
                    commentsList.replaceWith(updatedPostComments);

                    commentInput.value = "";
                };
            } catch (error) {
                console.error(`Ошибка во время добавления комментария: ${error.message}`);
            };
        });

        commentField.appendChild(commentUsername);
        commentField.appendChild(commentInput);
        commentField.appendChild(commentSubmit);

        comments.appendChild(commentField);
        comments.appendChild(commentsList);

        return comments;
    }

    async _fetchComments() {
        const response = await api.get(`/comments/${this.id}`);
        const comments = response.data;
        return comments;
    }

    _renderComments(comments) {
        const commentsList = document.createElement("div");
        commentsList.className = "post-card__comments-list";

        comments.forEach(commentData => {
            const comment = this.createComment(commentData);
            commentsList.appendChild(comment);
        });

        return commentsList;
    }

    createComment({ author, text }) {
        const comment = document.createElement("div");
        comment.className = "post-card__comments-comment";

        const commentProfile = document.createElement("div");
        commentProfile.className = "post-card__comments-comment_profile";

        const commentAuthor = document.createElement("p");
        commentAuthor.innerText = author;
        commentAuthor.className = "post-card__comments-comment__profile-author";

        commentProfile.appendChild(commentAuthor);

        const commentBody = document.createElement("div");
        commentBody.className = "post-card__comments-comment__body";

        const commentText = document.createElement("p");
        commentText.innerText = text;
        commentText.className = "post-card__comments-comment__body-text";

        commentBody.appendChild(commentText);

        comment.appendChild(commentProfile);
        comment.appendChild(commentBody);

        return comment;
    }
}