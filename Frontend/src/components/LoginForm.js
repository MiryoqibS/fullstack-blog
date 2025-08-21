import { Form } from "./Form";
import { Api } from "../utils/api";

export class LoginForm extends Form {
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

        const title = document.createElement("h2");
        title.className = "form-title";
        title.innerText = "Вход в аккаунт";

        const emailField = this.createEmailField();
        const passwordField = this.createPasswordField();

        const submit = document.createElement("button");
        submit.type = "submit";
        submit.innerText = "Войти"
        submit.className = "form-submit button";

        form.appendChild(title);
        form.appendChild(emailField);
        form.appendChild(passwordField);
        form.appendChild(submit);

        form.addEventListener("submit", async (e) => {
            e.preventDefault();

            const fieldsAreValid = this.checkFieldsValidation();

            if (!fieldsAreValid) return alert("Ошибка валидации");

            try {
                const emailValue = emailField.querySelector("input").value;
                const passwordValue = passwordField.querySelector("input").value;

                const data = {
                    email: emailValue,
                    password: passwordValue,
                };

                const response = await Api.login(data);

                if (response.status === 200) {
                    window.location.href = "/src/index.html";
                };

            } catch (error) {
                console.log(`Ошибка сети: ${error.message}`);
            };
        });

        return form;
    }
};