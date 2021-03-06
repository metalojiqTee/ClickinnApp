export interface Placement{
	tenant_firstname: string;
	tenant_lastname: string;
	tenant_email: string;
	tenant_phoneNumber: string;
	tenant_occupation: string;
	tenant_id?: string;
	tenant_dp?: string;
	tenant_studentno?: string;
	tenant_institution?: string;
	qualification?: string;
	property_address: string;
	apartment_type: string;
	apartment_id: string;
	deposit: number;
	rent: number;
	placement_date: number;
	agent_id: string;
	agent_firstname: string;
	agent_lastname: string;
	agent_dp: string;
	placement_id: string;
	complete?: boolean;
}