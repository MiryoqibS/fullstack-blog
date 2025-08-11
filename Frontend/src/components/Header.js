import api from "../utils/axiosUtil";
import { loadIcon } from "../utils/loadIcon";

export class Header {
    constructor(parentNode) {
        this.parentNode = parentNode;
    }

    async init() {
        const header = await this.render();
        this.parentNode.appendChild(header);
    }

    async render() {
        const header = document.createElement("header");
        header.className = "header container";

        const logo = this._createLogo();
        const nav = this._createNav();
        const actions = await this._createActions();

        header.appendChild(logo);
        header.appendChild(nav);
        header.appendChild(actions);

        return header;
    }

    _createLogo() {
        const logo = document.createElement("h1");
        logo.className = "header-logo";
        logo.innerText = "Blog";

        return logo;
    }

    _createNav() {
        const nav = document.createElement("nav");
        nav.className = "header-nav";

        const LINKS = [
            {
                title: "Главная",
                href: "/src/pages/index.html",
            },
            {
                title: "Блог",
                href: "/src/pages/blog.html",
            },
            {
                title: "Обо мне",
                href: "/src/pages/about-me.html",
            },
        ];

        LINKS.forEach(({ title, href }) => {
            const navLink = document.createElement("a");
            navLink.className = "header-nav__link";
            navLink.innerText = title;
            navLink.href = href;
            nav.appendChild(navLink);
        });

        return nav;
    }

    async _createActions() {
        const actions = document.createElement("div");
        actions.className = "header-actions";

        const isAuth = await this._checkAuth();

        if (isAuth) {
            const profileButton = document.createElement("button");
            profileButton.className = "header-actions__button button";
            profileButton.innerText = await this._getUsername();
            profileButton.onclick = () => window.location.href = "/src/pages/profile.html";

            const profileIcon = loadIcon("user");
            profileButton.appendChild(profileIcon);
            actions.appendChild(profileButton);

            const role = await this._getUserRole();

            if (role === "creator") {
                const createPostButton = document.createElement("button");
                createPostButton.className = "header-actions__button button";
                createPostButton.innerText = "Создать пост";
                createPostButton.onclick = () => window.location.href = "/src/pages/create-post.html";

                const createIcon = loadIcon("create",);
                createPostButton.appendChild(createIcon);

                actions.appendChild(createPostButton);
            };
        } else {
            [
                {
                    icon: "login",
                    onclick: () => window.location.href = "/src/pages/login.html",
                },
                {
                    icon: "register",
                    onclick: () => window.location.href = "/src/pages/register.html",
                },
            ].forEach(button => {
                const actionButton = document.createElement("button");
                actionButton.className = `header-actions__button button`;
                actionButton.innerText = button.icon === "login" ? "Войти" : "Регистрация";
                actionButton.onclick = button.onclick;

                const buttonSvg = loadIcon(button.icon, 14, 14);
                actionButton.appendChild(buttonSvg);
                actions.appendChild(actionButton);
            });
        };

        return actions;
    }

    async _checkAuth() {
        try {
            const res = await api.get("/user/isAuth");
            const data = res.data;
            const isAuth = data.isAuth;
            return isAuth;
        } catch (error) {
            return false;
        }
    }

    async _getUsername() {
        const user = await api.get("/user/profile");
        const data = user.data;
        return data.username;
    }

    async _getUserRole() {
        const user = await api.get("/user/profile");
        const data = user.data;
        return data.role;
    }
}