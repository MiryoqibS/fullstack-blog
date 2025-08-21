import { Api } from "../utils/api";
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

        const thumbnailField = this.createThumbnailField();

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

        form.appendChild(thumbnailField);
        form.appendChild(titleField);
        form.appendChild(categoryField);
        form.appendChild(descriptionField);
        form.appendChild(submitButton);

        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            const thumbnailImageInput = thumbnailField.querySelector("input");

            const titleValue = titleField.querySelector("input").value;
            const categoryValue = categoryField.querySelector("input").value;
            const descriptionValue = descriptionField.querySelector("input").value;

            const file = thumbnailImageInput.files[0];
            if (!file) return console.log("Выберите изображение для поста");
            const formData = new FormData();
            formData.append("thumbnail", file);
            formData.append("title", titleValue);
            formData.append("category", categoryValue);
            formData.append("description", descriptionValue);

            const res = await Api.createPost(formData);

            if (res.status === 201) {
                window.location.href = "/src/pages/blog.html";
            } else {
                alert("Ошибка");
            };
        });

        return form;
    }

    createThumbnailField() {
        const thumbnailField = document.createElement("div");
        thumbnailField.className = "form-field";

        const thumbnailInput = document.createElement("input");
        thumbnailInput.type = "file";
        thumbnailInput.accept = "image/png, image/jpeg, image/jpg, image/webp";
        thumbnailInput.style.display = "none";

        const thumbnailPreview = document.createElement("img");
        thumbnailPreview.className = "form-field__preview";
        thumbnailPreview.style.display = "none";

        thumbnailInput.addEventListener("change", () => {
            const file = thumbnailInput.files[0];
            const previewUrl = URL.createObjectURL(file);
            thumbnailPreview.src = previewUrl;
            thumbnailPreview.style.display = "block";
        });

        const thumbnailSelectButton = document.createElement("button");
        thumbnailSelectButton.type = "button";
        thumbnailSelectButton.innerText = "Выбрать файл";
        thumbnailSelectButton.className = "button";

        thumbnailSelectButton.onclick = () => thumbnailInput.click();

        thumbnailField.appendChild(thumbnailInput);
        thumbnailField.appendChild(thumbnailPreview);
        thumbnailField.appendChild(thumbnailSelectButton);


        return thumbnailField;
    }
}