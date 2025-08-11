import api from "../utils/axiosUtil";
import { loadIcon } from "../utils/loadIcon";

export class Profile {
    constructor(parentNode) {
        this.parentNode = parentNode;
    }

    async init() {
        const profile = await this.render();
        this.parentNode.appendChild(profile);
    }

    async render() {
        const container = document.createElement("div");
        container.className = "container";

        const profile = document.createElement("div");
        profile.className = "profile";

        const response = await api.get("/user/profile");
        const userData = response.data;

        const usernameField = this._createUsernameField(userData.username);
        const emailField = this._createEmailField(userData.email);
        const roleField = this._createRoleField(userData.role);

        profile.appendChild(usernameField);
        profile.appendChild(emailField);
        profile.appendChild(roleField);

        container.appendChild(profile);
        return container;
    }

    _createUsernameField(username) {
        const usernameField = document.createElement("div");
        usernameField.className = "profile-field";

        const usernameTitle = document.createElement("p");
        usernameTitle.className = "profile-field__title";
        usernameTitle.innerText = "Имя пользователя: ";

        const usernameValue = document.createElement("h2");
        usernameValue.className = "profile-field__value";
        usernameValue.innerText = username;

        usernameField.appendChild(usernameTitle);
        usernameField.appendChild(usernameValue);

        return usernameField;
    }

    _createEmailField(email) {
        const emailField = document.createElement("div");
        emailField.className = "profile-field";

        const emailTitle = document.createElement("p");
        emailTitle.className = "profile-field__title";
        emailTitle.innerText = "Электронная почта: ";

        const emailValue = document.createElement("p");
        emailValue.className = "profile-field__value email";
        emailValue.innerText = email;

        const emailIcon = loadIcon("mail", 14, 14);
        emailValue.appendChild(emailIcon);

        emailField.appendChild(emailTitle);
        emailField.appendChild(emailValue);

        return emailField;
    }

    _createRoleField(role) {
        const roleField = document.createElement("div");
        roleField.className = "profile-field";

        const roleTitle = document.createElement("p");
        roleTitle.className = "profile-field__title";
        roleTitle.innerText = "Роль пользователя: ";

        const roleValue = document.createElement("p");
        roleValue.className = "profile-field__value role";
        roleValue.innerText = role;

        roleField.appendChild(roleTitle);
        roleField.appendChild(roleValue);

        return roleField;
    }
}