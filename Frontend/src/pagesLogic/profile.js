// Импорт стилей
import "/src/importer.scss";

import { Header } from "../components/Header";
import { Profile } from "../components/Profile";
import { Footer } from "../components/Footer";

const headerElement = new Header(document.body);
await headerElement.init();

const profileElement = new Profile(document.body);
await profileElement.init();

const footerElement = new Footer(document.body);
footerElement.init();