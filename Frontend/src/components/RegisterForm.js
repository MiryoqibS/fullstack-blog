import { Form } from "./Form";
import api from "../utils/axiosUtil";

export class RegisterForm extends Form {
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
        title.innerText = "Создать аккаунт";

        const usernameField = this.createUsernameField();
        const emailField = this.createEmailField();
        const passwordField = this.createPasswordField();
        const passwordRepeatField = this.createPasswordRepeatField();

        const submit = document.createElement("button");
        submit.type = "submit";
        submit.innerText = "Регистрация"
        submit.className = "form-submit button";

        form.appendChild(title);
        form.appendChild(usernameField);
        form.appendChild(emailField);
        form.appendChild(passwordField);
        form.appendChild(passwordRepeatField);
        form.appendChild(submit);

        form.addEventListener("submit", async (e) => {
            e.preventDefault();

            const fieldsAreValid = this.checkFieldsValidation();

            if (!fieldsAreValid) return alert("Ошибка валидации");

            try {
                const emailValue = emailField.querySelector("input").value;
                const usernameValue = usernameField.querySelector("input").value;
                const passwordValue = passwordField.querySelector("input").value;

                const res = await api.post("/user/register", {
                    email: emailValue,
                    username: usernameValue,
                    password: passwordValue,
                });

                if (res.status === 201) {
                    console.log(res);
                    console.log(res.data);

                    const { _id } = res.data;
                    const verificationForm = this.renderVerificationForm(_id);
                    form.replaceWith(verificationForm);
                };
            } catch (error) {
                console.log(`Ошибка сети: ${error.message}`);
            };
        });

        return form;
    }

    renderVerificationForm(userId) {
        const form = document.createElement("form");
        form.className = "form container";
        form.method = "POST";

        const title = document.createElement("h2");
        title.className = "form-title";
        title.innerText = "Создать аккаунт";

        const codeField = document.createElement("input");
        codeField.className = "form-field";
        codeField.required = true;
        codeField.type = "number";
        codeField.placeholder = "Код из письма";

        const submit = document.createElement("button");
        submit.type = "submit";
        submit.innerText = "Регистрация"
        submit.className = "form-submit button";

        form.appendChild(title);
        form.appendChild(codeField);
        form.appendChild(submit);

        form.addEventListener("submit", async (e) => {
            e.preventDefault();

            try {
                const code = codeField.value;

                console.log({
                    userId,
                    code
                });


                const response = await api.post("/user/verify", {
                    userId,
                    code
                });

                if (response.status === 200) {
                    alert("Аккаунт подтверждён");
                    window.location.href = "/src/pages/login.html";
                };
            } catch (error) {
                alert(`Ошибка при попытке подтверждения: ${error.message}`);
            };
        });

        return form;
    }
}