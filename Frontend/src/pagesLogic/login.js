// Импорт стилей
import "/src/importer.scss";

import { Header } from "../components/Header";
import { LoginForm } from "../components/LoginForm";
import { Footer } from "../components/Footer";

const headerElement = new Header(document.body);
await headerElement.init();

const loginFormElement = new LoginForm(document.body);
loginFormElement.init();

const footerElement = new Footer(document.body);
footerElement.init();