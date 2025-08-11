import api from "../utils/axiosUtil";
import { loadIcon } from "../utils/loadIcon";
import { Form } from "./Form";

export class CreatePostForm extends Form {
    constructor(parentNode) {
        super();
        this.parentNode = parentNode;
    }

    init() {
        const form = this.render();
        this.parentNode.appendChild(form);
    }

    render() {
        const form = document.createElement("form");
        form.className = "form container";
        form.method = "POST";

        const thumbnailUrlField = this.createField(
            "URL изображение поста",
            "thumbnailUrl",
            () => true,
            "Не валидная URL ссылка",
        );

        const titleField = this.createField(
            "Заголовок поста",
            "title",
            () => true,
            "Не валидный заголовок",
        );

        const categoryField = this.createField(
            "Категория поста",
            "category",
            () => true,
            "Не валидная категория",
        );

        const descriptionField = this.createField(
            "Описание поста",
            "description",
            () => true,
            "Не валидное описание",
        );

        const submitButton = document.createElement("button");
        submitButton.className = "form-submit button";
        submitButton.innerText = "Создать";

        const createIcon = loadIcon("create");
        submitButton.appendChild(createIcon);

        form.appendChild(thumbnailUrlField);
        form.appendChild(titleField);
        form.appendChild(categoryField);
        form.appendChild(descriptionField);
        form.appendChild(submitButton);

        form.addEventListener("submit", async (e) => {
            e.preventDefault();

            const thumbnailUrlValue = thumbnailUrlField.querySelector("input").value;
            const titleValue = titleField.querySelector("input").value;
            const categoryValue = categoryField.querySelector("input").value;
            const descriptionValue = descriptionField.querySelector("input").value;

            const res = await api.post("/posts", {
                thumbnailUrl: thumbnailUrlValue,
                title: titleValue,
                category: categoryValue,
                description: descriptionValue,
            });

            if (res.status === 201) {
                window.location.href = "/src/pages/blog.html";
            } else {
                alert("Ошибка");
            };
        });

        return form;
    }
}