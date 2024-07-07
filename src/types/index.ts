export interface ICard {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number | null;
}

export interface IBusket {
	id: string;
	price: number | null;
	title: string;
	quantity: number;
}

export interface IContacts {
	address: string;
	mail: string;
	phone: string;
}

export interface ICardsData {
	cards: ICard[];
	preview: string | null;
	getCard(cardId: string): ICard;
	updateBusket(): IBusket[];
}

export interface IBusketData {
	busket: IBusket[];
	addToBasket(cardId: string, quantity: number): void;
	removeFromBasket(cardId: string, quantity?: number): void;
	getTotalPrice(): number;
	clearBasket(): void;
}

export interface IContactsData {
	checkAddressValidation(data: Record<'address', string>): boolean;
	checkCommunicationValidation(data: Record<'mail' | 'phone', string>): boolean;
	getContacts(): IContacts;
	setContacts(contacts: IContacts): void;
	clearContacts(): void;
}

export type TProduct = Pick<
	ICard,
	'id' | 'image' | 'title' | 'price' | 'category'
>;

export type TAddress = Pick<IContacts, 'address'>;

export type TCommunication = Pick<IContacts, 'mail' | 'phone'>;
