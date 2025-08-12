import { formatDate } from "../utils/formatDate";

export class BlogCard {
    constructor({title, category, thumbnailUrl, author, createdAt, description, _id}) {
        this.title = title;
        this.description = description;
        this.category = category;
        this.author = author;
        this.date = createdAt;
        this.thumbnail = thumbnailUrl;
        this.id = _id;
    }

    render() {
        const card = document.createElement("article");
        card.className = "card";

        // Изображение карточки
        const thumbnail = document.createElement("img");
        thumbnail.className = "card-thumbnail";
        thumbnail.src = this.thumbnail;

        // главный контент карточки
        const body = document.createElement("div");
        body.className = "card-body";

        const header = document.createElement("div");
        header.className = "card-body__header";

        const title = document.createElement("h4");
        title.className = "card-body__title";
        title.innerText = this.title;

        const category = document.createElement("p");
        category.className = "card-body__category";
        category.innerText = this.category;

        header.appendChild(title);
        header.appendChild(category);

        body.appendChild(header);

        // Информации карточки
        const information = document.createElement("div");
        information.className = "card-body__information";

        const author = document.createElement("p");
        author.className = "card-body__author";
        author.innerText = this.author.username;

        const date = document.createElement("p");
        date.className = "card-body__date";
        date.innerText = formatDate(new Date(this.date));

        information.appendChild(author);
        information.appendChild(date);
        body.appendChild(information);

        const description = document.createElement("p");
        description.className = "card-body__description";
        description.innerText = this.description;
        body.appendChild(description);

        const seePostButton = document.createElement("button");
        seePostButton.className = "card-body__button button";
        seePostButton.innerText = "Посмотреть";
        seePostButton.onclick = () => window.location.href = `/src/pages/post.html?id=${this.id}`;

        body.appendChild(seePostButton);

        // Собираем всё
        card.appendChild(thumbnail);
        card.appendChild(body);

        return card;
    }
}