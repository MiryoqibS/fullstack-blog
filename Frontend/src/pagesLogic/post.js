// Импорт стилей
import "/src/importer.scss";

import { Header } from "../components/Header";
import { Post } from "../components/Post";
import { Footer } from "../components/Footer";

const headerElement = new Header(document.body);
await headerElement.init();

const postElement = new Post(document.body);
await postElement.init();

const footerElement = new Footer(document.body);
footerElement.init();