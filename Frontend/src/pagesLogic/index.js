// Импорт стилей
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { SectionFeatures } from "../components/sections/SectionFeatures";
import "/src/importer.scss";

const headerElement = new Header(document.body);
headerElement.init();

const sectionFeaturesElement = new SectionFeatures(document.body, "Features");
sectionFeaturesElement.init();

const footerElement = new Footer(document.body);
footerElement.init();