export interface User{
	agents?: any[];
	landlords?: any[];
	displayName?: string;
	firstname: string;
	lastname: string;
	user_type: string;
	locations?: any[];
	email: string;
	fcm_token?: string;
	is_host: boolean;
	phoneNumber?: string;
	photoURL?: string;
	rating?: string;
	status?: boolean;
	threads?: any;
	uid: string;
	dob?: Date;
	occupation?: string;
	age?: number;
	id_no?: string;
	gender?: string;
	liked_apartments?: string[];
	balance?: number;
	bank?: string;
	account_number?: string;
	bank_code?: string;
	account_holder?: string;
	agreed_to_terms?: boolean;
}