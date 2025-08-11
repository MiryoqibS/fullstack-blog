export class Form {
    constructor() {
        this.fields = {};
    }

    createField(fieldTitle, fieldName, validFn, errorMsg, fieldType = "text") {
        const field = document.createElement("div");
        field.className = "form-field";

        const title = document.createElement("p");
        title.className = "form-field__title";
        title.innerText = fieldTitle;

        const input = document.createElement("input");
        input.className = "form-field__input";
        input.type = fieldType;
        input.placeholder = "...";
        input.name = fieldName;

        const validError = document.createElement("p");
        validError.className = "form-field__validation";

        this.fields[fieldName] = input;
        input.addEventListener("input", () => {
            if (validFn(input.value)) {
                input.classList.remove("error");
                input.classList.add("success");
                validError.innerText = "";
            } else {
                input.classList.add("error");
                input.classList.remove("success");
                validError.innerText = errorMsg;
            };
        });

        field.appendChild(title);
        field.appendChild(input);
        field.appendChild(validError);

        return field;
    }

    createPasswordField() {
        const passwordField = this.createField(
            "Введите пароль",
            "password",
            this._isValidPassword,
            "Не валидный пароль",
            "password"
        );

        return passwordField;
    }

    createPasswordRepeatField() {
        const passwordRepeatField = this.createField(
            "Введите пароль повторно",
            "passwordRepeat",
            this._isMatchPassword,
            "Пароли не совпадают",
            "password"
        )

        return passwordRepeatField;
    }

    createUsernameField() {
        const usernameField = this.createField(
            "Введите имя пользователя",
            "name",
            this._isValidUsername,
            "Не валидное имя пользователя",
        );

        return usernameField;
    }

    createEmailField() {
        const emailField = this.createField(
            "Введите электронную почту",
            "email",
            this._isValidEmail,
            "Не валидная электронная почта",
            "email"
        );

        return emailField;
    }

    checkFieldsValidation() {
        for (const key in this.fields) {
            const input = this.fields[key];

            if (
                input.classList.contains("error") ||
                input.value.trim().length <= 0
            ) {
                return false;
            };
        };

        return true;
    }

    _isValidPassword = (password) => {
        return password.trim().length >= 8;
    }

    _isValidEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    _isValidUsername = (username) => {
        return String(username).trim().length >= 6;
    }

    _isMatchPassword = (repeat) => {
        const password = this.fields.password?.value || "";
        return password === repeat;
    }
}