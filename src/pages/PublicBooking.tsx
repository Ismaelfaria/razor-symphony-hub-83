import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Clock, Scissors, User, MapPin, Phone, Mail } from "lucide-react";
import { useData } from "@/hooks/useData";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default function PublicBooking() {
  const { services, employees, config, addAppointment, addClient, appointments } = useData();
  const { toast } = useToast();
  const [selectedService, setSelectedService] = useState<string>('');
  const [selectedEmployee, setSelectedEmployee] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [clientData, setClientData] = useState({
    name: '',
    phone: '',
    email: ''
  });

  // Generate available time slots
  const generateTimeSlots = () => {
    const slots = [];
    const openTime = config.openTime || '08:00';
    const closeTime = config.closeTime || '18:00';
    
    const [openHour, openMin] = openTime.split(':').map(Number);
    const [closeHour, closeMin] = closeTime.split(':').map(Number);
    
    for (let hour = openHour; hour < closeHour; hour++) {
      for (let min = 0; min < 60; min += 30) {
        if (hour === closeHour - 1 && min >= closeMin) break;
        const timeStr = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
        slots.push(timeStr);
      }
    }
    
    return slots;
  };

  // Check if time slot is available
  const isTimeAvailable = (time: string) => {
    if (!selectedDate || !selectedEmployee || !selectedService) return true;
    
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    const service = services.find(s => s.id === selectedService);
    
    // Check if this time slot conflicts with existing appointments
    const conflictingAppointments = appointments.filter(apt => 
      apt.employeeId === selectedEmployee && 
      apt.date === dateStr && 
      apt.status !== 'cancelado'
    );
    
    for (const apt of conflictingAppointments) {
      const aptService = services.find(s => s.id === apt.serviceId);
      if (!aptService) continue;
      
      const aptStart = new Date(`2000-01-01T${apt.time}`);
      const aptEnd = new Date(aptStart.getTime() + aptService.duration * 60000);
      
      const slotStart = new Date(`2000-01-01T${time}`);
      const slotEnd = new Date(slotStart.getTime() + (service?.duration || 30) * 60000);
      
      if (slotStart < aptEnd && slotEnd > aptStart) {
        return false;
      }
    }
    
    return true;
  };

  const availableTimeSlots = generateTimeSlots().filter(isTimeAvailable);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!clientData.name || !clientData.phone || !selectedService || !selectedEmployee || !selectedDate || !selectedTime) {
      toast({
        title: "Erro",
        description: "Todos os campos obrigatórios devem ser preenchidos",
        variant: "destructive"
      });
      return;
    }

    // Verificar se o agendamento é com pelo menos 2 horas de antecedência
    const selectedDateTime = new Date(`${format(selectedDate, 'yyyy-MM-dd')}T${selectedTime}`);
    const now = new Date();
    const twoHoursFromNow = new Date(now.getTime() + (2 * 60 * 60 * 1000));

    if (selectedDateTime < twoHoursFromNow) {
      toast({
        title: "Agendamento não permitido",
        description: "É necessário agendar com pelo menos 2 horas de antecedência",
        variant: "destructive"
      });
      return;
    }

    try {
      // Add new client
      const clientId = Date.now().toString();
      addClient({
        ...clientData,
        registrationDate: new Date().toISOString().split('T')[0],
        loyaltyPoints: 0,
        loyaltyEnabled: true
      });

      // Add appointment
      addAppointment({
        clientId,
        serviceId: selectedService,
        employeeId: selectedEmployee,
        date: format(selectedDate, 'yyyy-MM-dd'),
        time: selectedTime,
        status: 'agendado',
        notes: 'Agendamento online'
      });

      toast({
        title: "Agendamento realizado!",
        description: "Seu agendamento foi confirmado com sucesso. Entraremos em contato para confirmar."
      });

      // Reset form
      setClientData({ name: '', phone: '', email: '' });
      setSelectedService('');
      setSelectedEmployee('');
      setSelectedDate(undefined);
      setSelectedTime('');
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao realizar o agendamento. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <div className="bg-gradient-dark border-b border-border">
        <div className="max-w-4xl mx-auto p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center">
              <Scissors className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                {config.name}
              </h1>
              <p className="text-muted-foreground">Agendamento Online</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              {config.address}
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              {config.openTime} às {config.closeTime}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Services */}
          <Card className="bg-gradient-dark border-dark-border shadow-dark">
            <CardHeader>
              <CardTitle className="text-foreground">Nossos Serviços</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {services.map((service) => (
                  <div 
                    key={service.id}
                    className={cn(
                      "p-3 rounded-lg border cursor-pointer transition-all",
                      selectedService === service.id
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50 hover:bg-muted/30"
                    )}
                    onClick={() => setSelectedService(service.id)}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium text-foreground">{service.name}</h4>
                        <p className="text-sm text-muted-foreground">{service.duration} minutos</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary">R$ {service.price.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Professionals */}
          <Card className="bg-gradient-dark border-dark-border shadow-dark">
            <CardHeader>
              <CardTitle className="text-foreground">Nossos Profissionais</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {employees.filter(emp => emp.active && emp.position === 'barbeiro').map((employee) => (
                  <div 
                    key={employee.id}
                    className={cn(
                      "p-3 rounded-lg border cursor-pointer transition-all",
                      selectedEmployee === employee.id
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50 hover:bg-muted/30"
                    )}
                    onClick={() => setSelectedEmployee(employee.id)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground">{employee.name}</h4>
                        <p className="text-sm text-muted-foreground capitalize">{employee.position}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Booking Form */}
        <Card className="mt-8 bg-gradient-dark border-dark-border shadow-dark">
          <CardHeader>
            <CardTitle className="text-foreground">Agendar Horário</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Client Information */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="name" className="text-foreground">Nome *</Label>
                  <Input
                    id="name"
                    value={clientData.name}
                    onChange={(e) => setClientData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Seu nome completo"
                    className="bg-input border-border text-foreground"
                  />
                </div>
                <div>
                  <Label htmlFor="phone" className="text-foreground">Telefone *</Label>
                  <Input
                    id="phone"
                    value={clientData.phone}
                    onChange={(e) => setClientData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="(11) 99999-9999"
                    className="bg-input border-border text-foreground"
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-foreground">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={clientData.email}
                    onChange={(e) => setClientData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="seu@email.com"
                    className="bg-input border-border text-foreground"
                  />
                </div>
              </div>

              {/* Date and Time Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-foreground">Data *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal bg-input border-border text-foreground",
                          !selectedDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate ? format(selectedDate, "dd/MM/yyyy") : "Selecione uma data"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-popover border-border">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        disabled={(date) => date < new Date() || date.getDay() === 0} // Disable past dates and Sundays
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <Label className="text-foreground">Horário *</Label>
                  <Select 
                    value={selectedTime} 
                    onValueChange={setSelectedTime}
                    disabled={!selectedDate || !selectedEmployee || !selectedService}
                  >
                    <SelectTrigger className="bg-input border-border text-foreground">
                      <SelectValue placeholder="Selecione um horário" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      {availableTimeSlots.map((time) => (
                        <SelectItem key={time} value={time} className="text-foreground">
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedDate && selectedEmployee && selectedService && availableTimeSlots.length === 0 && (
                    <p className="text-sm text-red-400 mt-1">
                      Não há horários disponíveis para esta data.
                    </p>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full bg-gradient-primary text-white hover:opacity-90"
                disabled={!clientData.name || !clientData.phone || !selectedService || !selectedEmployee || !selectedDate || !selectedTime}
              >
                Confirmar Agendamento
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}