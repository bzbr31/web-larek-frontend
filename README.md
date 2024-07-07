# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:

- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:

- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src\scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск

Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```

## Сборка

```
npm run build
```

или

```
yarn build
```

## Данные и типы данных, используемых в приложении

Карточка

```
export interface ICard {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
}
```

Корзина

```
export interface IBusket {
    id: string;
    price: number | null;
    title: string;
    quantity: number;
}
```

Контакты для оформления заказа

```
export interface IContacts {
    address: string;
    mail: string;
    phone: number;
}
```

Интерфейс для модели данных карточек

```
export interface ICardsData {
    cards: ICard[];
    preview: string | null;
}
```

Данные для отображения товара на главной странице

```
export type TProduct = Pick<ICard, 'id' | 'image' | 'title' | 'price' | 'category'>;
```

Данные для формы оформления заказа с указанием аддреса

```
export type TAddress = Pick<IContacts, 'address'>;
```

Данные для формы оформления заказа с указанием почты и телефона

```
export type TCommunication = Pick<IContacts, 'mail' | 'phone'>
```

## Архитектура приложения

Проект разделен на три основных слоя:

- слой представления (View): отображение данных на странице
- слой данных (Data): хранение и изменение данных
- презентер (Presenter): связь между представлением и данными

### Базовый код

#### Класс API

Содержит базовую логику для отправки запросов.

Методы:

- `get` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, который ответил сервер
- `post` - принимает оюъект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.

#### Класс EventEmitter

Брокер событий для обработки событий в системе.

Основные методы, реализуемые классом описаны интерфейсом `IEvents`:

- `on` - подписка на события
- `emit` - инициализация события
- `trigger` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие

### Слой данных

#### Класс CardsData

Управление данными карточек товаров.

В полях класса хранятся следующие данные:

- \_cards: ICard[] - массив объектов карточек
- \_preview: string | null - карточка выбранная для просмотра в модальном окне
- events: IEvents - экземпляр класса `EventEmitter` для инициализации событий при изменении данных.

Так же класс предоставляет набор методов для взаимодействия с этими данными.

- getCard(cardId: string): ICard; - возвращает карточку по ее id
- updateBusket(): IBusket[]; - обновление массива корзины
- а так-же сеттеры и геттеры для сохранения и получения данных из полей класса

#### Класс BusketData

Управление данными корзины товаров.

В полях класса хранятся следующие данные:

- \_busket: IBusket[] - массив карточек в корзине
- events: IEvents - экземпляр класса `EventEmitter` для инициализации событий при изменении данных.

Так же класс предоставляет набор методов для взаимодействия с этими данными.

- addToBasket(cardId: string, quantity: number): void;
- removeFromBasket(cardId: string, quantity?: number): void;
- getTotalPrice(): number;
- clearBasket(): void;

#### Класс ContactsData

Управление данными контактной информации для оформления заказа.

В полях класса хранятся следующие данные:

- events: IEvents - экземпляр класса `EventEmitter` для инициализации событий при изменении данных.

Так же класс предоставляет набор методов для взаимодействия с этими данными.

- checkAddressValidation(data: Record<'address', string>): boolean;
- checkCommunicationValidation(data: Record<'mail' | 'phone', string>): boolean;
- getContacts(): IContacts;
- setContacts(contacts: IContacts): void;
- clearContacts(): void;

### Класс представления

Все классы представления отвечают за отображение внутри контейнера (DOM-элемент) передаваемых в них данных.

#### Класс Modal

Реализует модальное окно. Так же предоставляет методы `open` и `close` для управления отображением модального окна. Устанавливает слушатель на клавиатуру, для закрытия модального окна по ESC, на клик в оверлей и кнопку-крестик для закрытия попапа.\

- constructor(selector: string, events IEvents) - Конструктор принимает селектор, по которому в разметке страницы будет индифицировано модальное окно и экземпляр класса `EventEmitter` для возможности инициации событий.
- modalContent: HTMLElement - основной блок куда будут вставляться нужный нам темплейт модального окна
- template: HTMLTemplateElement - темплейт модального окна

Поля класса:

- modal: HTMLElement - элемент модального окна
- events: IEvents - брокер событий

#### Класс ModalMoreInfo

Модальное окно с дополнительной информацией о товаре.

Поля класса:

- submitButton: HTMLButtonElemnt - кнопка добавления в корзину
- imageElement: HTMLImageElement - изображение продукта
- categoryElement: HTMLElement - категория продукта
- titleElement: HTMLElement - заголовок продукта
- descriptionElement: HTMLElement - описание продукта
- priceElement: HTMLElement - цена продукта
- handleSubmit: Function - функция, которая переносит продукт в корзину

Методы:

- setValid(isValid: boolean): void - изменяет активность кнопки переноса в корзину
- open(handleSubmit: Function, id: string; description: string; image: string; title: string; category: string; price: number | null;): void - расширение родительского метода, принимает обработчик, которы передается при инициации события добавления.
- close (): void - очищает атрибуты модального окна

#### Класс ModalBusket

Модальное окно корзины.

Поля класса:

- submitButton: HTMLButtonElemnt - кнопка оформления заказа
- basketItems: HTMLElement - количество продукта в корзине
- titleElement: HTMLElement - заголовок продукта
- priceElement: HTMLElement - цена продукта
- deleteItems: Function - функция, которая удаляет продукт из корзины

Методы:

- setValid(isValid: boolean): void - изменяет активность кнопки переноса в корзину
- open(handleSubmit: Function): void - расширение родительского метода, принимает обработчик, которы передается при инициации события добавления.

#### Класс ModalContacts

Модальные окна для оформления заказа.

Поля класса:

- submitButton: HTMLButtonElemnt - кнопка оформления заказа
- inputs: NodeListOf<HTMLInputElement> - коллекция всех полей ввода формы
- errors: Record<string, HTMLELement> - объект хранящий все элементы для вывода ошибок под полями формы с привязкой к атрибуту name инпутов

Методы:

- setValid(isValid: boolean): void
- getInputValues(): Record<string, string> - возвращает объект с данными из полей формы, где ключ - name инпута, значение - данные введенные пользователем
- setInputValues(data:Record<string, string>): void - принимает объект с даннымм для заполнения полей формы
- setEror(data: {field: string, value: string, validationInformation: string}): void - принимает объект с данными для отображения или сокрытия текстов ошибки под полями ввода
- showInputError (field: string, errorMessage: string): void - отображает полученный текст ошибки под указанными полем ввода
- hideInputError (field: string): void - очищает текст ошибки
- close (): void - расширяет родительский элемент при закрытии очищая поля формы и деактивирую кнопку сохранения

#### Класс ModalSuccsesful

Расширяет класс Modal. Предназначен для реализации наглядного показа успешного заказа.

Поля класса:

- submitButton: HTMLButtonElemnt - кнопка перехода на главную страницу
- priceElement: HTMLElement - итоговая сумма
- clearBusket: Function - функция которая очищает корзину

Методы:

- open(clearBusket: Function): void - расширение родительского метода, принимает обработчик, которы передается при инициации события очистки.

#### Класс Card

Отображение карточки товара.

Методы:

- setData(cardData: ICard, userId: string): void - заполняет атрибуты элементов карточки данными
- render(): HTMLElement - метод возвращает полностью заполненную карточку

#### Класс CardsContainer

Отвечает за отображения блока с карточками на главной странице. Предоставляет сеттер `container` для обновления содержимого. В конструктор принимает контейнер, в кортором размещаются карточки.

### Слой коммуникации

#### Класс AppApi

Взаимодействие с бэкэндом.

## Взаимодействие компенентов

Основные события:

- открытие модальных окон
- выбор и удаление карточек
- добавление товаров в корзину
- оформление заказа
- ввод данных для адреса, почты и телефона
