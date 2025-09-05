import { useState } from 'react';
import { Client, Service, Appointment, Employee, BarberShopConfig } from '@/types';

// Mock data
const initialClients: Client[] = [
  {
    id: '1',
    name: 'João Silva',
    phone: '(11) 99999-9999',
    email: 'joao@email.com',
    registrationDate: '2024-01-15',
    lastVisit: '2024-12-01',
    loyaltyPoints: 3,
    loyaltyEnabled: true
  },
  {
    id: '2',
    name: 'Maria Santos',
    phone: '(11) 88888-8888',
    email: 'maria@email.com',
    registrationDate: '2024-02-20',
    lastVisit: '2024-11-28',
    loyaltyPoints: 7,
    loyaltyEnabled: true
  },
  {
    id: '3',
    name: 'João Cliente',
    phone: '(11) 77777-7777',
    email: 'cliente@teste.com',
    registrationDate: '2024-03-01',
    lastVisit: '2024-11-30',
    loyaltyPoints: 2,
    loyaltyEnabled: true
  }
];

const initialServices: Service[] = [
  {
    id: '1',
    name: 'Corte Masculino',
    price: 30,
    duration: 45
  },
  {
    id: '2',
    name: 'Barba',
    price: 20,
    duration: 30
  },
  {
    id: '3',
    name: 'Corte + Barba',
    price: 45,
    duration: 75
  }
];

const initialEmployees: Employee[] = [
  {
    id: '1',
    name: 'Carlos Barbeiro',
    phone: '(11) 77777-7777',
    email: 'carlos@barbearia.com',
    password: '123456',
    position: 'barbeiro',
    accessLevel: 'funcionario',
    commissionType: 'percentage',
    commissionValue: 60,
    active: true
  },
  {
    id: '2',
    name: 'Roberto Silva',
    phone: '(11) 66666-6666',
    email: 'roberto@barbearia.com',
    password: '123456',
    position: 'barbeiro',
    accessLevel: 'funcionario',
    commissionType: 'fixed',
    commissionValue: 25,
    active: true
  },
  {
    id: '3',
    name: 'Admin User',
    phone: '(11) 55555-5555',
    email: 'admin@barbearia.com',
    password: 'admin123',
    position: 'barbeiro',
    accessLevel: 'administrador',
    commissionType: 'percentage',
    commissionValue: 70,
    active: true
  }
];

const initialConfig: BarberShopConfig = {
  id: '1',
  name: 'BarberShop Premium',
  address: 'Rua das Flores, 123 - Centro',
  openTime: '08:00',
  closeTime: '18:00'
};

const initialAppointments: Appointment[] = [
  {
    id: '1',
    clientId: '1',
    serviceId: '1',
    employeeId: '1',
    date: '2024-12-02',
    time: '14:00',
    status: 'agendado',
    notes: 'Cliente prefere máquina 2'
  },
  {
    id: '2',
    clientId: '2',
    serviceId: '3',
    employeeId: '2',
    date: '2024-12-02',
    time: '15:30',
    status: 'concluído'
  }
];

export function useData() {
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [services, setServices] = useState<Service[]>(initialServices);
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [config, setConfig] = useState<BarberShopConfig>(initialConfig);

  // Client operations
  const addClient = (client: Omit<Client, 'id'>) => {
    const newClient: Client = {
      ...client,
      id: Date.now().toString(),
      registrationDate: new Date().toISOString().split('T')[0],
      loyaltyPoints: client.loyaltyPoints || 0,
      loyaltyEnabled: client.loyaltyEnabled ?? true
    };
    setClients(prev => [...prev, newClient]);
  };

  const updateClient = (id: string, client: Partial<Client>) => {
    setClients(prev => prev.map(c => c.id === id ? { ...c, ...client } : c));
  };

  const deleteClient = (id: string) => {
    setClients(prev => prev.filter(c => c.id !== id));
    // Remove appointments for this client
    setAppointments(prev => prev.filter(a => a.clientId !== id));
  };

  // Service operations
  const addService = (service: Omit<Service, 'id'>) => {
    const newService: Service = {
      ...service,
      id: Date.now().toString()
    };
    setServices(prev => [...prev, newService]);
  };

  const updateService = (id: string, service: Partial<Service>) => {
    setServices(prev => prev.map(s => s.id === id ? { ...s, ...service } : s));
  };

  const deleteService = (id: string) => {
    setServices(prev => prev.filter(s => s.id !== id));
    // Remove appointments for this service
    setAppointments(prev => prev.filter(a => a.serviceId !== id));
  };

  // Appointment operations
  const addAppointment = (appointment: Omit<Appointment, 'id'>) => {
    // Validate minimum 2 hours advance booking
    const appointmentDateTime = new Date(`${appointment.date} ${appointment.time}`);
    const now = new Date();
    const twoHoursFromNow = new Date(now.getTime() + (2 * 60 * 60 * 1000));
    
    if (appointmentDateTime <= twoHoursFromNow) {
      throw new Error('Agendamentos devem ser feitos com pelo menos 2 horas de antecedência');
    }

    const newAppointment: Appointment = {
      ...appointment,
      id: Date.now().toString()
    };
    setAppointments(prev => [...prev, newAppointment]);
  };

  const updateAppointment = (id: string, appointment: Partial<Appointment>) => {
    setAppointments(prev => prev.map(a => {
      if (a.id === id) {
        const updated = { ...a, ...appointment };
        return updated;
      }
      return a;
    }));

    // Handle loyalty points separately to avoid hook violations
    const appointmentToUpdate = appointments.find(a => a.id === id);
    if (appointmentToUpdate && appointment.status === 'concluído' && appointmentToUpdate.status !== 'concluído') {
      const client = getClientById(appointmentToUpdate.clientId);
      if (client && client.loyaltyEnabled) {
        const newPoints = client.loyaltyPoints + 1;
        setClients(prevClients => prevClients.map(c => 
          c.id === client.id 
            ? { ...c, loyaltyPoints: newPoints >= 8 ? 0 : newPoints }
            : c
        ));
      }
    }
  };

  const deleteAppointment = (id: string) => {
    setAppointments(prev => prev.filter(a => a.id !== id));
  };

  // Employee operations
  const addEmployee = (employee: Omit<Employee, 'id'>) => {
    const newEmployee: Employee = {
      ...employee,
      id: Date.now().toString()
    };
    setEmployees(prev => [...prev, newEmployee]);
  };

  const updateEmployee = (id: string, employee: Partial<Employee>) => {
    setEmployees(prev => prev.map(e => e.id === id ? { ...e, ...employee } : e));
  };

  const deleteEmployee = (id: string) => {
    setEmployees(prev => prev.filter(e => e.id !== id));
    // Remove appointments for this employee
    setAppointments(prev => prev.filter(a => a.employeeId !== id));
  };

  // Config operations
  const updateConfig = (newConfig: Partial<BarberShopConfig>) => {
    setConfig(prev => ({ ...prev, ...newConfig }));
  };

  // Helper functions
  const getClientById = (id: string) => clients.find(c => c.id === id);
  const getServiceById = (id: string) => services.find(s => s.id === id);
  const getAppointmentById = (id: string) => appointments.find(a => a.id === id);
  const getEmployeeById = (id: string) => employees.find(e => e.id === id);

  // Commission calculations
  const calculateCommission = (appointmentId: string) => {
    const appointment = getAppointmentById(appointmentId);
    if (!appointment || appointment.status !== 'concluído') return { employee: 0, barbershop: 0 };
    
    const service = getServiceById(appointment.serviceId);
    const employee = getEmployeeById(appointment.employeeId);
    
    if (!service || !employee) return { employee: 0, barbershop: 0 };
    
    let employeeAmount = 0;
    if (employee.commissionType === 'percentage') {
      employeeAmount = (service.price * (employee.commissionValue || 0)) / 100;
    } else {
      employeeAmount = employee.commissionValue || 0;
    }
    
    return {
      employee: employeeAmount,
      barbershop: service.price - employeeAmount
    };
  };

  // Dashboard stats
  const todaysAppointments = appointments.filter(a => a.date === new Date().toISOString().split('T')[0]);
  const thisMonthRevenue = appointments
    .filter(a => a.status === 'concluído' && new Date(a.date).getMonth() === new Date().getMonth())
    .reduce((total, appointment) => {
      const service = getServiceById(appointment.serviceId);
      return total + (service?.price || 0);
    }, 0);

  const thisMonthEmployeeEarnings = (employeeId: string) => {
    return appointments
      .filter(a => a.employeeId === employeeId && a.status === 'concluído' && new Date(a.date).getMonth() === new Date().getMonth())
      .reduce((total, appointment) => {
        const commission = calculateCommission(appointment.id);
        return total + commission.employee;
      }, 0);
  };

  // Loyalty functions
  const toggleClientLoyalty = (clientId: string, enabled: boolean) => {
    updateClient(clientId, { loyaltyEnabled: enabled });
  };

  const resetClientLoyalty = (clientId: string) => {
    updateClient(clientId, { loyaltyPoints: 0 });
  };

  const getClientFutureAppointments = (clientId: string) => {
    const today = new Date().toISOString().split('T')[0];
    return appointments.filter(a => 
      a.clientId === clientId && 
      a.status === 'agendado' && 
      a.date >= today
    ).sort((a, b) => new Date(`${a.date} ${a.time}`).getTime() - new Date(`${b.date} ${b.time}`).getTime());
  };

  return {
    // Data
    clients,
    services,
    appointments,
    employees,
    config,
    
    // Client operations
    addClient,
    updateClient,
    deleteClient,
    
    // Service operations
    addService,
    updateService,
    deleteService,
    
    // Appointment operations
    addAppointment,
    updateAppointment,
    deleteAppointment,
    
    // Employee operations
    addEmployee,
    updateEmployee,
    deleteEmployee,
    
    // Config operations
    updateConfig,
    
    // Helper functions
    getClientById,
    getServiceById,
    getAppointmentById,
    getEmployeeById,
    calculateCommission,
    
    // Dashboard stats
    todaysAppointments,
    thisMonthRevenue,
    thisMonthEmployeeEarnings,
    
    // Loyalty functions
    toggleClientLoyalty,
    resetClientLoyalty,
    getClientFutureAppointments
  };
}