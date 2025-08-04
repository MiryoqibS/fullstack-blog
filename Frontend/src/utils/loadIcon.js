export const loadIcon = (iconName, width = 24, height = 24) => {
    try {
        const SVG_NS = "http://www.w3.org/2000/svg";
        const XLINK_NS = "http://www.w3.org/1999/xlink";
        const path = "/assets.svg";

        const svg = document.createElementNS(SVG_NS, "svg");
        svg.setAttribute("width", width);
        svg.setAttribute("height", height);
        svg.setAttribute("aria-hidden", "true");
        svg.setAttribute("focusable", "false");

        const use = document.createElementNS(SVG_NS, "use");
        use.setAttributeNS(XLINK_NS, "xlink:href", `${path}#${iconName}`);

        svg.appendChild(use);
        return svg;
    } catch (error) {
        console.log(error);
    };
};
