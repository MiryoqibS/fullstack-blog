export class Footer {
    constructor(parentNode) {
        this.parentNode = parentNode;
    }

    init() {
        const container = document.createElement("div");
        container.id = "footer";
        const footer = this.render();
        container.appendChild(footer); 
        this.parentNode.appendChild(container);
    }

    render() {
        const footer = document.createElement("footer");
        footer.className = "footer container";

        const logo = this._createLogo();
        const nav = this._createNav();
        const copyright = this._createCopyright();

        footer.appendChild(logo);
        footer.appendChild(nav);
        footer.appendChild(copyright);

        return footer;
    }

    _createLogo() {
        const logo = document.createElement("h1");
        logo.className = "footer-logo";
        logo.innerText = "Blog";

        return logo;
    }

    _createNav() {
        const nav = document.createElement("nav");
        nav.className = "footer-nav";

        const LINKS = [
            {
                title: "Home",
                href: "/src/index.html",
            },
            {
                title: "Blog",
                href: "/src/templates/blog.html",
            },
            {
                title: "About me",
                href: "/src/templates/about-me.html",
            },
        ];

        LINKS.forEach(({ title, href }) => {
            const navLink = document.createElement("a");
            navLink.className = "footer-nav__link";
            navLink.innerText = title;
            navLink.href = href;
            nav.appendChild(navLink);
        });

        return nav;
    }

    _createCopyright() {
        const copyright = document.createElement("p");
        copyright.className = "footer-copyright";
        copyright.innerText = `© Miryoqib BLog ${new Date().getFullYear()}.`;

        return copyright;
    }
}