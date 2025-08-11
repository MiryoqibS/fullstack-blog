// Импорт стилей
import "/src/importer.scss";

import { Header } from "../components/Header";
import { RegisterForm } from "../components/RegisterForm";
import { Footer } from "../components/Footer";

const headerElement = new Header(document.body);
await headerElement.init();

const registerFormElement = new RegisterForm(document.body);
registerFormElement.init();

const footerElement = new Footer(document.body);
footerElement.init();