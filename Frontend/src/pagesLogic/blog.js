// Импорт стилей
import "/src/importer.scss";

import { Header } from "../components/Header";
import { Blog } from "../components/Blog";
import { Footer } from "../components/Footer";

const headerElement = new Header(document.body);
await headerElement.init();

const blogElement = new Blog(document.body);
await blogElement.init();

const footerElement = new Footer(document.body);
footerElement.init();