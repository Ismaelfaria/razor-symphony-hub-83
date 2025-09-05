import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, Calendar, DollarSign, Clock, CheckCircle, XCircle, LogOut } from "lucide-react";
import { useData } from "@/hooks/useData";
import { useAuth } from "@/contexts/AuthContext";

export default function EmployeePortal() {
  const { appointments, services, clients, getClientById, getServiceById, calculateCommission, thisMonthEmployeeEarnings } = useData();
  const { user, logout } = useAuth();

  if (!user) return null;

  // Filter appointments for current employee
  const employeeAppointments = appointments.filter(a => a.employeeId === user.id);
  const todayAppointments = employeeAppointments.filter(a => a.date === new Date().toISOString().split('T')[0]);
  const completedAppointments = employeeAppointments.filter(a => a.status === 'concluído');
  const monthlyEarnings = thisMonthEmployeeEarnings(user.id);

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

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-background p-3 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
          <div className="text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Painel do Colaborador
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base mt-1 sm:mt-2">
              Bem-vindo, {user.name}!
            </p>
            <div className="w-16 sm:w-20 h-1 bg-gradient-primary rounded-full mx-auto sm:mx-0 mt-2"></div>
          </div>
          <Button 
            onClick={logout}
            variant="outline"
            className="border-dark-border text-foreground hover:bg-muted/30 transition-all duration-200 w-full sm:w-auto"
          >
            <LogOut className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            <span className="text-sm">Sair</span>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          <Card className="bg-gradient-to-br from-dark-card to-dark-card/80 border-dark-border shadow-dark hover:shadow-violet transition-all duration-300">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-xs sm:text-sm">Agendamentos Hoje</p>
                  <p className="text-xl sm:text-2xl font-bold text-foreground">{todayAppointments.length}</p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-dark-card to-dark-card/80 border-dark-border shadow-dark hover:shadow-violet transition-all duration-300">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-xs sm:text-sm">Serviços Concluídos</p>
                  <p className="text-xl sm:text-2xl font-bold text-foreground">{completedAppointments.length}</p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-green-500/20 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-dark-card to-dark-card/80 border-dark-border shadow-dark hover:shadow-violet transition-all duration-300">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-xs sm:text-sm">Ganhos do Mês</p>
                  <p className="text-lg sm:text-2xl font-bold text-foreground">{formatCurrency(monthlyEarnings)}</p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-dark-card to-dark-card/80 border-dark-border shadow-dark hover:shadow-violet transition-all duration-300">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-xs sm:text-sm">Total de Agendamentos</p>
                  <p className="text-xl sm:text-2xl font-bold text-foreground">{employeeAppointments.length}</p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                  <User className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Appointments List */}
        <Card className="bg-gradient-to-br from-dark-card via-dark-card to-dark-card/80 border-dark-border shadow-dark hover:shadow-violet transition-all duration-300">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-foreground text-lg sm:text-xl">
              <div className="p-2 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10">
                <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
              Meus Agendamentos
              <span className="ml-auto text-sm font-normal text-muted-foreground bg-muted/20 px-3 py-1 rounded-full">
                {employeeAppointments.length} total
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-dark-border hover:bg-muted/30 transition-colors">
                    <TableHead className="text-muted-foreground font-semibold">Cliente</TableHead>
                    <TableHead className="text-muted-foreground font-semibold min-w-[100px]">Serviço</TableHead>
                    <TableHead className="text-muted-foreground font-semibold min-w-[90px]">Data/Hora</TableHead>
                    <TableHead className="text-muted-foreground font-semibold min-w-[80px]">Status</TableHead>
                    <TableHead className="text-muted-foreground font-semibold min-w-[90px]">Comissão</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {employeeAppointments.length > 0 ? (
                    employeeAppointments
                      .sort((a, b) => new Date(b.date + ' ' + b.time).getTime() - new Date(a.date + ' ' + a.time).getTime())
                      .map((appointment) => {
                        const client = getClientById(appointment.clientId);
                        const service = getServiceById(appointment.serviceId);
                        const commission = calculateCommission(appointment.id);
                        
                        return (
                          <TableRow key={appointment.id} className="border-dark-border hover:bg-gradient-to-r hover:from-muted/20 hover:to-muted/10 transition-all duration-200 group">
                            <TableCell className="font-medium text-foreground group-hover:text-primary transition-colors max-w-[120px] sm:max-w-none">
                              <div className="flex items-center gap-1">
                                <User className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                                <span className="truncate sm:whitespace-normal text-xs sm:text-sm">
                                  {client?.name || 'Cliente não encontrado'}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="text-foreground max-w-[100px] sm:max-w-none">
                              <div>
                                <div className="truncate sm:whitespace-normal text-xs sm:text-sm font-medium">
                                  {service?.name || 'Serviço não encontrado'}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {formatCurrency(service?.price || 0)}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-foreground">
                              <div className="text-xs">
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
                            <TableCell className="text-foreground">
                              {appointment.status === 'concluído' ? (
                                <div className="font-medium text-green-400 text-xs sm:text-sm">
                                  {formatCurrency(commission.employee)}
                                </div>
                              ) : (
                                <span className="text-muted-foreground text-xs sm:text-sm">-</span>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 sm:py-12">
                        <div className="flex flex-col items-center gap-2 sm:gap-3">
                          <Calendar className="h-8 w-8 sm:h-12 sm:w-12 text-muted-foreground/30" />
                          <p className="text-muted-foreground text-sm sm:text-lg">Nenhum agendamento encontrado</p>
                          <p className="text-muted-foreground/60 text-xs sm:text-sm">Seus agendamentos aparecerão aqui</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}