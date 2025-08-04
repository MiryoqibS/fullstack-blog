export class Header {
    constructor(parentNode) {
        this.parentNode = parentNode;
    }

    init() {
        const header = this.render();
        this.parentNode.appendChild(header);
    }

    render() {
        const header = document.createElement("header");
        header.className = "header container";

        const logo = this._createLogo();
        const nav = this._createNav();
        const search = this._createSearch();

        header.appendChild(logo);
        header.appendChild(nav);
        header.appendChild(search);

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

        LINKS.forEach(({title, href}) => {
            const navLink = document.createElement("a");
            navLink.className = "header-nav__link";
            navLink.innerText = title;
            navLink.href = href;
            nav.appendChild(navLink);
        });

        return nav;
    }

    _createSearch() {
        const search = document.createElement("div");
        search.className = "header-search";

        const searchButton = document.createElement("button");
        searchButton.className = "header-search__button";
        searchButton.innerText = "Search";

        const searchInput = document.createElement("input");
        searchInput.className = "header-search__input";
        searchInput.placeholder = "...";

        search.appendChild(searchButton);
        search.appendChild(searchInput);

        return search;
    }
}