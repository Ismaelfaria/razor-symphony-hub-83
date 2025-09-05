import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { BarChart3, TrendingUp, Users, Calendar, DollarSign, Clock, Filter } from "lucide-react";
import { useData } from "@/hooks/useData";

export default function Reports() {
  const { appointments, clients, services, employees, getClientById, getServiceById, getEmployeeById, calculateCommission } = useData();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Filter appointments by date range
  const filteredAppointments = appointments.filter(appointment => {
    if (!startDate && !endDate) return true;
    const appointmentDate = new Date(appointment.date);
    const start = startDate ? new Date(startDate) : new Date('1900-01-01');
    const end = endDate ? new Date(endDate) : new Date('2100-12-31');
    return appointmentDate >= start && appointmentDate <= end;
  });

  // Calculate statistics
  const completedAppointments = filteredAppointments.filter(a => a.status === 'concluído');
  const canceledAppointments = filteredAppointments.filter(a => a.status === 'cancelado');
  
  const totalRevenue = completedAppointments.reduce((sum, appointment) => {
    const service = getServiceById(appointment.serviceId);
    return sum + (service?.price || 0);
  }, 0);

  const totalCommissions = completedAppointments.reduce((sum, appointment) => {
    const commission = calculateCommission(appointment.id);
    return sum + commission.employee;
  }, 0);

  const netRevenue = totalRevenue - totalCommissions;

  // Employee statistics
  const employeeStats = employees.map(employee => {
    const employeeAppointments = completedAppointments.filter(a => a.employeeId === employee.id);
    const employeeRevenue = employeeAppointments.reduce((sum, appointment) => {
      const commission = calculateCommission(appointment.id);
      return sum + commission.employee;
    }, 0);

    return {
      ...employee,
      appointments: employeeAppointments.length,
      revenue: employeeRevenue
    };
  }).filter(stat => stat.appointments > 0);

  // Service statistics
  const serviceStats = services.map(service => {
    const serviceAppointments = completedAppointments.filter(a => a.serviceId === service.id);
    const serviceRevenue = serviceAppointments.length * service.price;

    return {
      ...service,
      appointments: serviceAppointments.length,
      revenue: serviceRevenue
    };
  }).filter(stat => stat.appointments > 0);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Relatórios
          </h1>
          <p className="text-muted-foreground mt-2">
            Análise financeira e estatísticas da barbearia
          </p>
        </div>
      </div>

      {/* Filtros */}
      <Card className="bg-gradient-dark border-dark-border shadow-dark">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Filter className="h-5 w-5 text-primary" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div>
              <Label htmlFor="startDate" className="text-foreground">Data Inicial</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-input border-border text-foreground"
              />
            </div>
            <div>
              <Label htmlFor="endDate" className="text-foreground">Data Final</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-input border-border text-foreground"
              />
            </div>
            <Button 
              onClick={() => {
                setStartDate('');
                setEndDate('');
              }}
              variant="outline"
              className="border-border text-foreground hover:bg-muted"
            >
              Limpar Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Cards de estatísticas principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-dark border-dark-border shadow-dark">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Faturamento Total</p>
                <p className="text-2xl font-bold text-foreground">{formatCurrency(totalRevenue)}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-dark border-dark-border shadow-dark">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Comissões Pagas</p>
                <p className="text-2xl font-bold text-foreground">{formatCurrency(totalCommissions)}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-dark border-dark-border shadow-dark">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Receita Líquida</p>
                <p className="text-2xl font-bold text-foreground">{formatCurrency(netRevenue)}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-dark border-dark-border shadow-dark">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Serviços Concluídos</p>
                <p className="text-2xl font-bold text-foreground">{completedAppointments.length}</p>
                <p className="text-xs text-red-400">Cancelados: {canceledAppointments.length}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                <Clock className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance por Funcionário */}
      <Card className="bg-gradient-dark border-dark-border shadow-dark">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Users className="h-5 w-5 text-primary" />
            Performance por Funcionário
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-muted/50">
                  <TableHead className="text-muted-foreground">Funcionário</TableHead>
                  <TableHead className="text-muted-foreground">Atendimentos</TableHead>
                  <TableHead className="text-muted-foreground">Comissões</TableHead>
                  <TableHead className="text-muted-foreground">Tipo Comissão</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employeeStats.length > 0 ? (
                  employeeStats.map((stat) => (
                    <TableRow key={stat.id} className="border-border hover:bg-muted/30">
                      <TableCell className="font-medium text-foreground">
                        <div>
                          <div>{stat.name}</div>
                          <div className="text-sm text-muted-foreground">{stat.position}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-foreground">{stat.appointments}</TableCell>
                      <TableCell className="font-medium text-green-400">
                        {formatCurrency(stat.revenue)}
                      </TableCell>
                      <TableCell className="text-foreground">
                        {stat.commissionType === 'percentage' 
                          ? `${stat.commissionValue}%` 
                          : `${formatCurrency(stat.commissionValue || 0)} fixo`
                        }
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                      Nenhum dado encontrado para o período selecionado
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Serviços Mais Procurados */}
      <Card className="bg-gradient-dark border-dark-border shadow-dark">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Calendar className="h-5 w-5 text-primary" />
            Serviços Mais Procurados
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-muted/50">
                  <TableHead className="text-muted-foreground">Serviço</TableHead>
                  <TableHead className="text-muted-foreground">Quantidade</TableHead>
                  <TableHead className="text-muted-foreground">Faturamento</TableHead>
                  <TableHead className="text-muted-foreground">Preço Unitário</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {serviceStats.length > 0 ? (
                  serviceStats
                    .sort((a, b) => b.appointments - a.appointments)
                    .map((stat) => (
                      <TableRow key={stat.id} className="border-border hover:bg-muted/30">
                        <TableCell className="font-medium text-foreground">{stat.name}</TableCell>
                        <TableCell className="text-foreground">{stat.appointments}</TableCell>
                        <TableCell className="font-medium text-green-400">
                          {formatCurrency(stat.revenue)}
                        </TableCell>
                        <TableCell className="text-foreground">
                          {formatCurrency(stat.price)}
                        </TableCell>
                      </TableRow>
                    ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                      Nenhum dado encontrado para o período selecionado
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}