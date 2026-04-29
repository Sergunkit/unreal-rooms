# Unreal Rooms

![Unreal Rooms Banner](https://images.unsplash.com/photo-1544717189-9a2c3d5e2361?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)
_Discover and book your next unreal stay._

"Unreal Rooms" is a modern web application designed to showcase and facilitate bookings for unique hotel experiences. Built with cutting-edge web technologies, it provides a seamless and interactive user interface for exploring various hotels, viewing detailed room information, and even interacting with a concierge chat.

## ✨ Features

*   **Interactive Hotel Listings:** Browse a curated selection of distinctive hotels.
*   **Detailed Hotel Pages:** View comprehensive information about each hotel, including descriptions, amenities, and image galleries.
*   **Room Exploration:** Discover available rooms with details on price, size, capacity, and bedding.
*   **Lost & Found Section:** (Feature for specific hotels) A dedicated area for lost and found items.
*   **Concierge Chat:** (Feature for specific hotels) Direct interaction with a virtual concierge for assistance.
*   **Responsive Design:** Optimized for a flawless experience across various devices.
*   **Multi-language Support:** (Russian and English)
*   **Image Carousel:** Beautifully presented image galleries for hotels and rooms.

## 🚀 Technologies Used

*   **Frontend:**
    *   [React](https://react.dev/)
    *   [TypeScript](https://www.typescriptlang.org/)
    *   [Vite](https://vitejs.dev/)
    *   [Tailwind CSS](https://tailwindcss.com/)
    *   [Lucide React](https://lucide.dev/) for icons
    *   [Embla Carousel](https://www.embla-carousel.com/) for image carousels
    *   [Radix UI](https://www.radix-ui.com/) components
*   **State Management:** (Implied by React context usage)
*   **Routing:** [React Router](https://reactrouter.com/en/main)
*   **Backend/Database:** [Supabase](https://supabase.com/) (implied by file structure)
*   **Tooling:**
    *   [ESLint](https://eslint.org/) for code linting
    *   [Prettier](https://prettier.io/) for code formatting
    *   [Vitest](https://vitest.dev/) for testing

## 💻 Getting Started

### Prerequisites

Make sure you have Node.js (v18 or higher) and npm installed.

```bash
node -v
npm -v
```

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/your-username/unreal-rooms.git
    cd unreal-rooms
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```

### Running Locally

To start the development server:

```bash
npm run dev
# or using Makefile
make dev
```

Open your browser and navigate to `http://localhost:5173` (or the address shown in your terminal).

## 📄 Available Scripts

In the project directory, you can run:

*   `npm run dev`: Runs the app in development mode.
*   `npm run build`: Builds the app for production to the `dist` folder.
*   `npm run lint`: Lints the project files for potential errors.
*   `npm run lint:fix`: Lints and automatically fixes fixable issues.
*   `npm run format`: Formats code using Prettier.
*   `npm test`: Runs tests using Vitest.
*   `npm test:ui`: Runs tests with Vitest UI.
*   `npm test:coverage`: Runs tests and generates a coverage report.

### Makefile Commands

Convenience commands are also available via `make`:

*   `make dev`: Starts the development server.
*   `make lint`: Runs ESLint.
*   `make test`: Runs Vitest.

## 📁 Project Structure

```
.
├── public/
├── src/
│   ├── app/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── data/
│   │   ├── pages/
│   │   └── utils/
│   ├── main.tsx
│   ├── sample.test.ts
│   └── styles/
├── .eslintrc.json
├── .gitignore
├── package.json
├── README.md
├── tsconfig.json
├── vite.config.ts
├── vitest.config.ts
└── ... (other config files)
```

##🤝 Contributing

Contributions are welcome! Please follow the existing code style and submit pull requests.

## 📝 License

This project is licensed under the MIT License.

## 📧 Contact

For any questions or suggestions, please open an issue on GitHub.

<!-- ralph:loop "" --completion-promise "DONE" -->

Данный проект пишется преимущественно с помощью ИИ (gemini, qwen, mini-max, groke, figma make).
Концепция следующая: пользователь открывает сайт и видит интерфейс классического сервиса бронирования отелей. В глаза бросается только необычный ряд изображений отелей, размещенных в виде карточек на главной странице. Также внимание пользователя привлекается сходством названий отелей с отелями из некоторых известных художественных произведений.
У пользователя на главной странице так же присутствует небольшой набор стандартных инструментов для поиска и фильтрации отелей, которые в концепции данного сайта пока не играют какой-либо существенной роли.
На карточке каждого отеля присутствует заглавное фото, название, звездность, рейтинг, посуточная стоимость и сердечко, которое обычно отображает, находится ли данный отель в списке избранного. Но в данном случае у всех отелей красные сердечки, как будто пользователь уже просмотрел все отели и добавил в избранное. Это один из ключевых моментов механики игры.
Пользователь может кликом открыть страницу любого отеля. На странице отеля представлено главное изображение (то же что на карточке) и галерея изображений отеля. Это изображения территории, лобби, ресторана, номеров и т.д. Некоторые картинки содержат подсказки на тему художественного произведения которому посвящен данный отель. Это может быть стиль, какие-то предметы и образы. Некоторые изображения обладают интерактивностью, например, при клике на какую-то часть изображения изображение может поменяться или может появиться подсказка.
Также карточка содержит информацию по отелю, которая включает расположение, рейтинг, удобства, дополнительные услуги, отзывы и т.д. Эта информация содержит отсылки к сюжету оригинального произведения, например, Soldier Island Hotel расположен в Девоне, как отель из произведения «Десять негритят» Агаты Кристи.
Среди опций бронирования есть те, которые ни в коем случае бронировать нельзя, чтобы остаться в игре после бронирования данного отеля; и есть опции, которые обязательно нужно забронировать, чтобы продолжить игру. Выбрать нужные опции поможет правильное определение произведения, о котором идет речь. И, в соответствии с сюжетом этого произведения, нужно выбрать опции бронирования, чтобы обойти все опасности. Так на страничках отелей присутствуют всевозможные подсказки, и, в том числе, сердечко избранного, которое погаснет, если в форме бронирования выбрать безопасную комбинацию опций и снова загорится, если добавить что-то опасное. Например, отель “Сияющий Оверлук” нужно бронировать не в зимний период, избегать бронирования номера 237 и отказаться от «все включено» с бесплатным алкоголем.
За успешное бронирование пользователь получает артефакт, который может ему помочь пройти другой отель. Также артефакты можно получить, посмотрев забытые другими посетителями отеля предметы или при тщательном исследовании интерфейса страницы отеля и находя так называемые пасхалки.

Вкратце суть такая: сайт на первый взгляд выглядит как обычный букинг. На главной странице панели для фильтрации и поиска авторизация, выбор языка, темы, список карточек отелей и виджет чемодана (это хранилище артефактов). Стиль так скажем мрачноватый (черный основной и фиолетовые акценты). На карточках отелей достаточно сочные картинки, передающие атмосферу, но пока без треша. на карточках есть сердечки избранного, но они не нажимаются - тут так не работает. Клик на карточке открывает страницу отеля. Здесь есть галерея изображений (к ней вернемся), название, звездность, рейтинг (с наиболее популярным отзывом), кредо, описание, расположение, кнопка "Забронировать". Ниже блоками удобства, бассейны и спа, спорт и отдых, транспортная доступность, питание, дополнительные удобства. Ниже карточки номеров с "фото". На них название, max количество гостей, площадь, количество кроватей. К карточке мы тоже еще вернемся. Ниже блоки отзывов, потеряшек (lost&found) - там можно найти артефакты. Еще ниже особые условия проживания. Да и опять не нажимаемое сердечко, но теперь оно с двусмысленным тултипом. В галерее у нас есть активные картинки, при клике на которые у нас могут происходить несколько типов событий. Картинка может просто измениться. Может при клике на определенную область появиться подсказка. Также на при клике в определенную область можно получить необходимый артефакт. Это у меня называется galleryAction. При клике на карточе номера открывается модалка номера; здесь к картинке, площади, кроватям добавляется стоимость и удобства конкретного номера. И также присутствует кнопка забронировать. При клике на нее открывается модалка с формой бронирования. Вот тут начинается самое интересное. Нужно выбрать опции бронирования тип номера, питание, дополнительные удобства, дату, тип оплаты и т.д. таким образом, чтоб избежать катострофы. На заднем фоне за формой видно то самое сердечко, которое гаснет ровно в тот момент, когда выполнены все необходимые условия и у юзера есть необходимые предметы в качестве просто волшебной вещи или оплаты. Посмотреть имеющиея вещи можно кликнув на чемодане. количество вещей в чемодане ограничено девятью. В игре есть есть полезные артефакты, вещи для оплаты и пустышки. Все артефакты можно оставлять в потеряшках. Также они выдаются в качестве приза при успешном бронировании. Дальнейшая механика по статистике пройденных отелей пока не продумана. У меня есть страницы "Мои бронирования", "Избраное", "Страница пользователя", но концепции по ним пока нет. Ниже будет пример данных для отеля Сесил. Там механика такая: пользователю в форме предлагается номер 1402. Он может выбрать другой номер, но только на фатальном 14-м этаже. Для того, чтоб сменить этаж юзер должен найти в галерее изображение площадки этажа с лифтом и аварийным выходом, кликнуть на надписи EXIT и пройти капчу в виде кнопок панели управления лифтом. Для этого нужно ввести код, который есть в отзывах и потеряшках. далее появляется модалка выбора этажа. Пользователь меняет этаж и получает возможность безопасно забронировать номер.
Механика избранного: Все отели на домашней странице не выделены сердцем. Но при клике на сердце или при открытии отеля он попадает в избранное. И погасить сердце можно только успешным прохождением. Далее отель попадает в мои бронирования, где хранятся условия успешного бронирования. 
