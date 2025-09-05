import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Edit, Trash2, Calendar, User, Clock, CheckCircle, XCircle, CalendarDays, List } from "lucide-react";
import { useData } from "@/hooks/useData";
import { Appointment } from "@/types";
import { useToast } from "@/hooks/use-toast";
import CalendarView from "@/components/CalendarView";

export default function Appointments() {
  const { appointments, clients, services, employees, addAppointment, updateAppointment, deleteAppointment, getClientById, getServiceById, getEmployeeById } = useData();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [formData, setFormData] = useState({
    clientId: '',
    serviceId: '',
    employeeId: '',
    date: '',
    time: '',
    status: 'agendado' as 'agendado' | 'concluído' | 'cancelado',
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.clientId || !formData.serviceId || !formData.employeeId || !formData.date || !formData.time) {
      toast({
        title: "Erro",
        description: "Todos os campos obrigatórios devem ser preenchidos",
        variant: "destructive"
      });
      return;
    }

    if (editingAppointment) {
      updateAppointment(editingAppointment.id, formData);
      toast({
        title: "Agendamento atualizado",
        description: "Os dados do agendamento foram atualizados com sucesso."
      });
    } else {
      addAppointment(formData);
      toast({
        title: "Agendamento criado",
        description: "Novo agendamento foi criado com sucesso."
      });
    }

    setIsDialogOpen(false);
    setEditingAppointment(null);
      setFormData({
        clientId: '',
        serviceId: '',
        employeeId: '',
        date: '',
        time: '',
        status: 'agendado' as 'agendado' | 'concluído' | 'cancelado',
        notes: ''
      });
  };

  const handleEdit = (appointment: Appointment) => {
    setEditingAppointment(appointment);
    setFormData({
      clientId: appointment.clientId,
      serviceId: appointment.serviceId,
      employeeId: appointment.employeeId,
      date: appointment.date,
      time: appointment.time,
      status: appointment.status,
      notes: appointment.notes || ''
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (appointment: Appointment) => {
    const client = getClientById(appointment.clientId);
    if (window.confirm(`Tem certeza que deseja excluir o agendamento de ${client?.name}?`)) {
      deleteAppointment(appointment.id);
      toast({
        title: "Agendamento excluído",
        description: "Agendamento foi removido com sucesso."
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'concluído':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'cancelado':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-blue-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'concluído':
        return 'bg-green-500/20 text-green-400';
      case 'cancelado':
        return 'bg-red-500/20 text-red-400';
      default:
        return 'bg-blue-500/20 text-blue-400';
    }
  };

  return (
    <div className="space-y-4 sm:space-y-8 overflow-x-hidden px-3 sm:px-0">
      <div className="text-center py-3 sm:py-6">
        <h1 className="text-2xl sm:text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2 sm:mb-3">
          Agendamentos
        </h1>
        <p className="text-muted-foreground text-sm sm:text-lg px-2">
          Gerencie todos os agendamentos da barbearia
        </p>
        <div className="w-16 sm:w-24 h-1 bg-gradient-primary rounded-full mx-auto mt-2 sm:mt-4"></div>
      </div>

      <Tabs defaultValue="calendar" className="w-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
          <TabsList className="grid w-full grid-cols-2 sm:w-auto bg-muted/20">
            <TabsTrigger value="calendar" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
              <CalendarDays className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Calendário</span>
              <span className="sm:hidden">Cal.</span>
            </TabsTrigger>
            <TabsTrigger value="list" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
              <List className="h-3 w-3 sm:h-4 sm:w-4" />
              Lista
            </TabsTrigger>
          </TabsList>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
            <div className="text-xs sm:text-sm text-muted-foreground">
              {appointments.length} agendamento{appointments.length !== 1 ? 's' : ''} total
            </div>
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-primary text-white hover:opacity-90 shadow-olive hover:scale-105 transition-all duration-200 w-full sm:w-auto text-sm">
                  <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Novo Agendamento</span>
                  <span className="sm:hidden">Novo</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gradient-to-br from-dark-card to-dark-card/80 border-dark-border shadow-dark backdrop-blur-sm w-[95vw] max-w-md mx-auto">
                <DialogHeader>
                  <DialogTitle className="text-foreground text-lg sm:text-xl font-bold">
                    {editingAppointment ? 'Editar Agendamento' : 'Criar Novo Agendamento'}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                  <div>
                    <Label htmlFor="clientId" className="text-foreground font-medium text-sm">Cliente *</Label>
                    <Select value={formData.clientId} onValueChange={(value) => setFormData(prev => ({ ...prev, clientId: value }))}>
                      <SelectTrigger className="bg-input/50 border-dark-border text-foreground backdrop-blur-sm focus:border-primary/50 transition-all duration-200 h-10">
                        <SelectValue placeholder="Selecione um cliente" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover/90 border-dark-border backdrop-blur-md">
                        {clients.map((client) => (
                          <SelectItem key={client.id} value={client.id} className="text-foreground hover:bg-primary/10">
                            {client.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="serviceId" className="text-foreground font-medium text-sm">Serviço *</Label>
                    <Select value={formData.serviceId} onValueChange={(value) => setFormData(prev => ({ ...prev, serviceId: value }))}>
                      <SelectTrigger className="bg-input/50 border-dark-border text-foreground backdrop-blur-sm focus:border-primary/50 transition-all duration-200 h-10">
                        <SelectValue placeholder="Selecione um serviço" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover/90 border-dark-border backdrop-blur-md">
                        {services.map((service) => (
                          <SelectItem key={service.id} value={service.id} className="text-foreground hover:bg-primary/10">
                            {service.name} - R$ {service.price.toFixed(2)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="employeeId" className="text-foreground font-medium text-sm">Funcionário *</Label>
                    <Select value={formData.employeeId} onValueChange={(value) => setFormData(prev => ({ ...prev, employeeId: value }))}>
                      <SelectTrigger className="bg-input/50 border-dark-border text-foreground backdrop-blur-sm focus:border-primary/50 transition-all duration-200 h-10">
                        <SelectValue placeholder="Selecione um funcionário" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover/90 border-dark-border backdrop-blur-md">
                        {employees.filter(emp => emp.active).map((employee) => (
                          <SelectItem key={employee.id} value={employee.id} className="text-foreground hover:bg-primary/10">
                            {employee.name} - {employee.position}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="date" className="text-foreground font-medium text-sm">Data *</Label>
                      <Input
                        id="date"
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                        className="bg-input/50 border-dark-border text-foreground backdrop-blur-sm focus:border-primary/50 transition-all duration-200 h-10"
                      />
                    </div>
                    <div>
                      <Label htmlFor="time" className="text-foreground font-medium text-sm">Horário *</Label>
                      <Input
                        id="time"
                        type="time"
                        value={formData.time}
                        onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                        className="bg-input/50 border-dark-border text-foreground backdrop-blur-sm focus:border-primary/50 transition-all duration-200 h-10"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="status" className="text-foreground font-medium text-sm">Status</Label>
                    <Select value={formData.status} onValueChange={(value: 'agendado' | 'concluído' | 'cancelado') => setFormData(prev => ({ ...prev, status: value }))}>
                      <SelectTrigger className="bg-input/50 border-dark-border text-foreground backdrop-blur-sm focus:border-primary/50 transition-all duration-200 h-10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-popover/90 border-dark-border backdrop-blur-md">
                        <SelectItem value="agendado" className="text-foreground hover:bg-primary/10">Agendado</SelectItem>
                        <SelectItem value="concluído" className="text-foreground hover:bg-primary/10">Concluído</SelectItem>
                        <SelectItem value="cancelado" className="text-foreground hover:bg-primary/10">Cancelado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="notes" className="text-foreground font-medium text-sm">Observações</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="Observações sobre o agendamento"
                      className="bg-input/50 border-dark-border text-foreground backdrop-blur-sm focus:border-primary/50 transition-all duration-200 min-h-[80px]"
                      rows={3}
                    />
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-4 sm:pt-6">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsDialogOpen(false)}
                      className="flex-1 border-dark-border text-foreground hover:bg-muted/30 transition-all duration-200 h-10"
                    >
                      Cancelar
                    </Button>
                    <Button 
                      type="submit" 
                      className="flex-1 bg-gradient-primary text-white hover:opacity-90 hover:scale-105 transition-all duration-200 shadow-olive h-10"
                    >
                      <span className="hidden sm:inline">{editingAppointment ? 'Salvar Alterações' : 'Criar Agendamento'}</span>
                      <span className="sm:hidden">{editingAppointment ? 'Salvar' : 'Criar'}</span>
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <TabsContent value="calendar" className="mt-0">
          <CalendarView />
        </TabsContent>

        <TabsContent value="list" className="mt-0">
          <Card className="bg-gradient-to-br from-dark-card via-dark-card to-dark-card/80 border-dark-border shadow-dark hover:shadow-olive transition-all duration-300">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-foreground text-xl">
                <div className="p-2 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                Lista de Agendamentos
                <span className="ml-auto text-sm font-normal text-muted-foreground bg-muted/20 px-3 py-1 rounded-full">
                  {appointments.length} total
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Mobile list (no horizontal scroll) */}
              <div className="sm:hidden space-y-3">
                {appointments.length > 0 ? (
                  appointments
                    .sort((a, b) => new Date(b.date + ' ' + b.time).getTime() - new Date(a.date + ' ' + a.time).getTime())
                    .map((appointment) => {
                      const client = getClientById(appointment.clientId);
                      const service = getServiceById(appointment.serviceId);
                      const employee = getEmployeeById(appointment.employeeId);
                      return (
                        <div
                          key={appointment.id}
                          className="border border-dark-border rounded-xl p-3 bg-gradient-to-br from-dark-card/80 to-dark-card/60"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-primary flex-shrink-0" />
                                <h3 className="font-semibold text-foreground truncate">{client?.name || 'Cliente'}</h3>
                              </div>
                              <div className="mt-1 text-xs text-muted-foreground space-y-1">
                                <div className="truncate">{service?.name || 'Serviço'}</div>
                                <div className="truncate">{employee?.name || 'Funcionário'}</div>
                                <div className="flex items-center gap-3">
                                  <span className="font-medium text-foreground">{new Date(appointment.date).toLocaleDateString('pt-BR')}</span>
                                  <span>{appointment.time}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-2 flex-shrink-0">
                              <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                                {getStatusIcon(appointment.status)}
                                <span>{appointment.status}</span>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleEdit(appointment)}
                                  className="h-8 w-8 p-0 border-dark-border hover:bg-primary/10 hover:border-primary/50"
                                  aria-label={`Editar ${client?.name || ''}`}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDelete(appointment)}
                                  className="h-8 w-8 p-0 border-destructive/50 text-destructive hover:bg-destructive/20"
                                  aria-label={`Excluir ${client?.name || ''}`}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="h-8 w-8 mx-auto text-muted-foreground/30" />
                    <p className="mt-2 text-sm text-muted-foreground">Nenhum agendamento criado ainda</p>
                  </div>
                )}
              </div>

              {/* Desktop table (unchanged) */}
              <div className="hidden sm:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-dark-border hover:bg-muted/30 transition-colors">
                      <TableHead className="text-muted-foreground font-semibold">Cliente</TableHead>
                      <TableHead className="text-muted-foreground font-semibold min-w-[90px]">Serviço</TableHead>
                      <TableHead className="text-muted-foreground font-semibold min-w-[100px]">Funcionário</TableHead>
                      <TableHead className="text-muted-foreground font-semibold min-w-[90px]">Data/Hora</TableHead>
                      <TableHead className="text-muted-foreground font-semibold min-w-[80px]">Status</TableHead>
                      <TableHead className="text-muted-foreground font-semibold text-right min-w-[100px]">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {appointments.length > 0 ? (
                      appointments
                        .sort((a, b) => new Date(b.date + ' ' + b.time).getTime() - new Date(a.date + ' ' + a.time).getTime())
                        .map((appointment) => {
                          const client = getClientById(appointment.clientId);
                          const service = getServiceById(appointment.serviceId);
                          const employee = getEmployeeById(appointment.employeeId);
                          
                          return (
                            <TableRow key={appointment.id} className="border-dark-border hover:bg-gradient-to-r hover:from-muted/20 hover:to-muted/10 transition-all duration-200 group">
                              <TableCell className="font-semibold text-foreground group-hover:text-primary transition-colors max-w-[120px] sm:max-w-none">
                                <div className="flex items-center gap-1 sm:gap-2">
                                  <User className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                                  <span className="truncate sm:whitespace-normal text-xs sm:text-sm">
                                    {client?.name || 'Cliente não encontrado'}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell className="text-foreground font-medium max-w-[90px] sm:max-w-none">
                                <span className="truncate sm:whitespace-normal text-xs sm:text-sm">
                                  {service?.name || 'Serviço não encontrado'}
                                </span>
                              </TableCell>
                              <TableCell className="text-foreground font-medium max-w-[100px] sm:max-w-none">
                                <span className="truncate sm:whitespace-normal text-xs sm:text-sm">
                                  {employee?.name || 'Funcionário não encontrado'}
                                </span>
                              </TableCell>
                              <TableCell className="text-foreground">
                                <div className="text-xs sm:text-sm">
                                  <div className="font-medium">{new Date(appointment.date).toLocaleDateString('pt-BR')}</div>
                                  <div className="text-muted-foreground">{appointment.time}</div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                                  {getStatusIcon(appointment.status)}
                                  <span className="hidden sm:inline">{appointment.status}</span>
                                </div>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex gap-1 sm:gap-2 justify-end">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleEdit(appointment)}
                                    className="border-dark-border text-foreground hover:bg-primary/10 hover:border-primary/50 hover:text-primary transition-all duration-200 hover:scale-105 h-8 w-8 p-0 sm:h-9 sm:w-9"
                                  >
                                    <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleDelete(appointment)}
                                    className="border-destructive/50 text-destructive hover:bg-destructive/20 hover:border-destructive transition-all duration-200 hover:scale-105 h-8 w-8 p-0 sm:h-9 sm:w-9"
                                  >
                                    <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 sm:py-12">
                          <div className="flex flex-col items-center gap-2 sm:gap-3">
                            <Calendar className="h-8 w-8 sm:h-12 sm:w-12 text-muted-foreground/30" />
                            <p className="text-muted-foreground text-sm sm:text-lg">Nenhum agendamento criado ainda</p>
                            <p className="text-muted-foreground/60 text-xs sm:text-sm">Clique em "Novo Agendamento" para começar</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}