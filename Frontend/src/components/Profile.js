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

        const avatarField = this.createAvatarField(userData.avatar);
        const usernameField = this.createUsernameField(userData.username);
        const emailField = this.createEmailField(userData.email);
        const roleField = this.createRoleField(userData.role);

        profile.appendChild(avatarField);
        profile.appendChild(usernameField);
        profile.appendChild(emailField);
        profile.appendChild(roleField);

        container.appendChild(profile);
        return container;
    }

    createAvatarField(avatarPath) {
        const avatarField = document.createElement("div");
        avatarField.className = "profile-field";

        const avatarTitle = document.createElement("p");
        avatarTitle.className = "profile-field__title";
        avatarTitle.innerText = "Фото профиля: ";

        const avatarImage = document.createElement("img");
        avatarImage.className = "profile-field__image";
        avatarImage.src = avatarPath;

        const changeAvatarInput = document.createElement("input");
        changeAvatarInput.type = "file";
        changeAvatarInput.accept = "image/jpg, image/png, image/jpeg, image/webp";
        changeAvatarInput.style.display = "none";

        changeAvatarInput.addEventListener("change", async () => {
            const file = changeAvatarInput.files[0];
            const formData = new FormData();
            formData.append("avatar", file);

            const response = await api.post("/user/avatar", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                withCredentials: true,
            });

            window.location.reload();
        });

        const changeAvatarButton = document.createElement("button");
        changeAvatarButton.className = "profile-field__button button";
        changeAvatarButton.innerText = "Изменить";
        changeAvatarButton.onclick = () => changeAvatarInput.click();

        avatarField.appendChild(avatarTitle);
        avatarField.appendChild(avatarImage);
        avatarField.appendChild(changeAvatarInput);
        avatarField.appendChild(changeAvatarButton);

        return avatarField;
    }

    createUsernameField(username) {
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

    createEmailField(email) {
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

    createRoleField(role) {
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