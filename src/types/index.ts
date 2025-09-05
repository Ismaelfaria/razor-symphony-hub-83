export interface Client {
  id: string;
  name: string;
  phone: string;
  email: string;
  registrationDate: string;
  lastVisit?: string;
  loyaltyPoints: number;
  loyaltyEnabled: boolean;
}

export interface Service {
  id: string;
  name: string;
  price: number;
  duration: number; // em minutos
}

export interface Appointment {
  id: string;
  clientId: string;
  serviceId: string;
  employeeId: string;
  date: string;
  time: string;
  status: 'agendado' | 'concluído' | 'cancelado';
  notes?: string;
}

export interface Employee {
  id: string;
  name: string;
  phone: string;
  email: string;
  password: string;
  position: 'barbeiro' | 'recepcao' | 'auxiliar';
  accessLevel: 'funcionario' | 'administrador';
  commissionType?: 'percentage' | 'fixed';
  commissionValue?: number;
  active: boolean;
}

export interface BarberShopConfig {
  id: string;
  name: string;
  address: string;
  openTime: string;
  closeTime: string;
  logo?: string;
  banner?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  accessLevel: 'funcionario' | 'administrador' | 'cliente';
  position: string;
}

export interface ClientUser extends Client {
  accessLevel: 'cliente';
  password: string;
}