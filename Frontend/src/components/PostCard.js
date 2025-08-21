import { Api } from "../utils/api";
import { loadIcon } from "../utils/loadIcon";
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
        this.replyComment = null;
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
            const user = await Api.getProfile();
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
        const commentsList = this.renderComments(postComments);

        commentSubmit.addEventListener("click", async () => {
            try {
                const commentType = commentInput.value.trim().toLocaleLowerCase().includes("ответь") ? "reply" : "comment";
                if (commentType === "comment") {
                    console.log("comment");

                    const response = await Api.addComment(this.id, commentInput.value);

                    if (response.status === 201) {
                        const comments = await this._fetchComments();
                        const updatedPostComments = this.renderComments(comments);
                        commentsList.replaceWith(updatedPostComments);

                        commentInput.value = "";
                    };
                };

                if (commentType === "reply") {
                    console.log("reply");

                    const response = await Api.replyComment(this.replyComment, this.id, commentInput.value);

                    if (response.status === 201) {
                        const comments = await this._fetchComments();
                        const updatedPostComments = this.renderComments(comments);
                        commentsList.replaceWith(updatedPostComments);
                        this.replyComment = null;

                        commentInput.value = "";
                    };
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
        return await Api.getComments(this.id);
    }

    renderComments(comments) {
        const commentsList = document.createElement("div");
        commentsList.className = "post-card__comments-list";

        comments.forEach(commentData => {
            if (!commentData.replyTo) {
                const comment = this.createComment(commentData);
                commentsList.appendChild(comment);
            };
        });

        return commentsList;
    }

    createComment({ _id, author, text, replies }) {
        const comment = document.createElement("div");
        comment.className = "post-card__comments-comment";
        comment.setAttribute("data-id", _id);

        // Создаём профиль автора комментария (фото профиля и его никнейм)
        const commentProfile = document.createElement("div");
        commentProfile.className = "post-card__comments-comment__profile";

        const commentAuthorAvatar = document.createElement("img");
        commentAuthorAvatar.src = author.avatar;
        commentAuthorAvatar.className = "post-card__comments-comment__profile-avatar";

        const commentAuthorUsername = document.createElement("p");
        commentAuthorUsername.innerText = author.username;
        commentAuthorUsername.className = "post-card__comments-comment__profile-author";

        commentProfile.appendChild(commentAuthorAvatar);
        commentProfile.appendChild(commentAuthorUsername);

        // Создаём главный контент комментария (текст комментария)
        const commentBody = document.createElement("div");
        commentBody.className = "post-card__comments-comment__body";

        const commentText = document.createElement("p");
        commentText.innerText = text;
        commentText.className = "post-card__comments-comment__body-text";

        commentBody.appendChild(commentText);

        // Создаём активные кнопки для комментария ()
        const commentActions = document.createElement("div");
        commentActions.className = "post-card__comments-comment__actions";

        const commentShowRepliesBtn = document.createElement("button");
        commentShowRepliesBtn.className = "post-card__comments-comment__actions-button button";
        commentShowRepliesBtn.innerText = "Посмотреть ответы";
        const chevronUpIcon = loadIcon("chevronUp", 14, 14);
        commentShowRepliesBtn.appendChild(chevronUpIcon);

        const commentReplies = document.createElement("div");
        commentReplies.className = "post-card__comments-comment__replies";

        commentShowRepliesBtn.addEventListener("click", () => {
            commentShowRepliesBtn.classList.toggle("show");

            if (commentShowRepliesBtn.classList.contains("show")) {
                replies.forEach((commentData) => {
                    const replyComment = this.createComment(commentData);
                    commentReplies.appendChild(replyComment);
                });
            } else {
                commentReplies.innerHTML = "";
            };
        });

        const commentReplyBtn = document.createElement("button");
        commentReplyBtn.className = "post-card__comments-comment__actions-button button";
        commentReplyBtn.innerText = "Ответить";
        const replyIcon = loadIcon("reply", 14, 14);
        commentReplyBtn.appendChild(replyIcon);

        commentReplyBtn.addEventListener("click", () => {
            const commentFieldInput = document.querySelector(".post-card__comments-field__input");
            commentFieldInput.value = `Ответь: @${author.username}`;
            this.replyComment = _id;
            commentFieldInput.focus();
        });

        if (replies.length > 0) commentActions.appendChild(commentShowRepliesBtn);
        commentActions.appendChild(commentReplyBtn);

        const commentMain = document.createElement("div");
        commentMain.className = "post-card__comments-comment__main";
        commentMain.appendChild(commentProfile)
        commentMain.appendChild(commentBody)
        commentMain.appendChild(commentActions)

        comment.appendChild(commentMain);
        comment.appendChild(commentReplies);

        return comment;
    }
}