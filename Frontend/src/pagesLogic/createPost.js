// Импорт стилей
import "/src/importer.scss";

import { Header } from "../components/Header";
import { CreatePostForm } from "../components/createPostForm";
import { Footer } from "../components/Footer";
import api from "../utils/axiosUtil";

// Проверка роля пользователя
const res = await api.get("/user/profile");
const data = res.data;
const role = data.role;

if (role !== "creator") {
    window.location.href = "/src/index.html";
};

const headerElement = new Header(document.body);
await headerElement.init();

const createPostElement = new CreatePostForm(document.body);
createPostElement.init();

const footerElement = new Footer(document.body);
footerElement.init();