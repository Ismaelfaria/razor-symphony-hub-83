import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, Scissors, DollarSign, TrendingUp, Clock } from "lucide-react";
import { useData } from "@/hooks/useData";
import WeeklyCalendar from "@/components/WeeklyCalendar";

export default function Dashboard() {
  const { clients, appointments, services, todaysAppointments, thisMonthRevenue } = useData();

  const stats = [
    {
      title: "Clientes Cadastrados",
      value: clients.length,
      icon: Users,
      description: "Total de clientes ativos",
      color: "text-blue-500"
    },
    {
      title: "Agendamentos Hoje",
      value: todaysAppointments.length,
      icon: Calendar,
      description: "Agendamentos para hoje",
      color: "text-green-500"
    },
    {
      title: "Serviços Realizados",
      value: appointments.filter(a => a.status === 'concluído').length,
      icon: Scissors,
      description: "Total de serviços concluídos",
      color: "text-primary"
    },
    {
      title: "Receita do Mês",
      value: `R$ ${thisMonthRevenue.toFixed(2)}`,
      icon: DollarSign,
      description: "Receita aproximada este mês",
      color: "text-emerald-500"
    }
  ];

  const recentAppointments = appointments
    .filter(a => a.status !== 'cancelado')
    .sort((a, b) => new Date(b.date + ' ' + b.time).getTime() - new Date(a.date + ' ' + a.time).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-4 sm:space-y-8">
      <div className="text-center py-4 sm:py-8">
        <h1 className="text-2xl sm:text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2 sm:mb-3">
          Dashboard
        </h1>
        <p className="text-muted-foreground text-sm sm:text-lg px-2">
          Visão geral completa do seu negócio de barbearia
        </p>
        <div className="w-16 sm:w-24 h-1 bg-gradient-primary rounded-full mx-auto mt-2 sm:mt-4"></div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="bg-gradient-to-br from-dark-card via-dark-card to-dark-card/80 border-dark-border shadow-dark hover:shadow-violet transition-all duration-300 hover:scale-105 group">
            <CardHeader className="pb-2 sm:pb-3 p-3 sm:p-6">
              <CardTitle className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 group-hover:from-primary/30 group-hover:to-primary/20 transition-all duration-300">
                  <stat.icon className={`h-3 w-3 sm:h-5 sm:w-5 ${stat.color} group-hover:scale-110 transition-transform duration-300`} />
                </div>
                <span className="hidden sm:inline">{stat.title}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 sm:p-6 pt-0">
              <div className="text-xl sm:text-3xl font-bold text-foreground mb-1 sm:mb-2 group-hover:bg-gradient-primary group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                {stat.value}
              </div>
              <p className="text-[10px] sm:text-xs text-muted-foreground leading-tight">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
        <Card className="bg-gradient-to-br from-dark-card via-dark-card to-dark-card/80 border-dark-border shadow-dark hover:shadow-violet transition-all duration-300">
          <CardHeader className="pb-3 sm:pb-4 p-4 sm:p-6">
            <CardTitle className="flex items-center gap-2 sm:gap-3 text-foreground text-lg sm:text-xl">
              <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-gradient-to-br from-primary/20 to-primary/10">
                <Calendar className="h-4 w-4 sm:h-6 sm:w-6 text-primary" />
              </div>
              Próximos Agendamentos
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <div className="space-y-3 sm:space-y-4">
              {recentAppointments.length > 0 ? (
                recentAppointments.map((appointment) => {
                  const client = clients.find(c => c.id === appointment.clientId);
                  const service = services.find(s => s.id === appointment.serviceId);
                  
                  return (
                    <div key={appointment.id} className="flex items-center justify-between p-3 sm:p-4 rounded-lg sm:rounded-xl bg-gradient-to-r from-muted/10 to-muted/5 border border-muted/30 hover:border-primary/30 transition-all duration-300 hover:scale-[1.02] group">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm sm:text-base text-foreground group-hover:text-primary transition-colors truncate">{client?.name}</p>
                        <p className="text-xs sm:text-sm text-muted-foreground font-medium truncate">{service?.name}</p>
                        <div className="flex items-center gap-1 sm:gap-2 text-xs text-muted-foreground mt-1 sm:mt-2">
                          <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                          <span className="truncate">{new Date(appointment.date).toLocaleDateString('pt-BR')} às {appointment.time}</span>
                        </div>
                      </div>
                      <div className={`px-2 sm:px-3 py-1 sm:py-2 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-semibold uppercase tracking-wide whitespace-nowrap ml-2 ${
                        appointment.status === 'agendado' 
                          ? 'bg-gradient-to-r from-blue-500/20 to-blue-600/20 text-blue-400 border border-blue-500/30' 
                          : appointment.status === 'concluído'
                          ? 'bg-gradient-to-r from-green-500/20 to-green-600/20 text-green-400 border border-green-500/30'
                          : 'bg-gradient-to-r from-red-500/20 to-red-600/20 text-red-400 border border-red-500/30'
                      }`}>
                        {appointment.status}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-6 sm:py-8">
                  <Calendar className="h-8 w-8 sm:h-12 sm:w-12 text-muted-foreground/30 mx-auto mb-2 sm:mb-3" />
                  <p className="text-sm sm:text-base text-muted-foreground">
                    Nenhum agendamento encontrado
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-dark-card via-dark-card to-dark-card/80 border-dark-border shadow-dark hover:shadow-violet transition-all duration-300">
          <CardHeader className="pb-3 sm:pb-4 p-4 sm:p-6">
            <CardTitle className="flex items-center gap-2 sm:gap-3 text-foreground text-lg sm:text-xl">
              <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-gradient-to-br from-primary/20 to-primary/10">
                <TrendingUp className="h-4 w-4 sm:h-6 sm:w-6 text-primary" />
              </div>
              Resumo de Serviços
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <div className="space-y-3 sm:space-y-4">
              {services.map((service) => {
                const serviceAppointments = appointments.filter(a => a.serviceId === service.id && a.status === 'concluído');
                const revenue = serviceAppointments.length * service.price;
                
                return (
                  <div key={service.id} className="flex items-center justify-between p-3 sm:p-4 rounded-lg sm:rounded-xl bg-gradient-to-r from-muted/10 to-muted/5 border border-muted/30 hover:border-primary/30 transition-all duration-300 hover:scale-[1.02] group">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm sm:text-base text-foreground group-hover:text-primary transition-colors truncate">{service.name}</p>
                      <p className="text-xs sm:text-sm text-muted-foreground font-medium">{serviceAppointments.length} realizados</p>
                    </div>
                    <div className="text-right ml-2">
                      <p className="font-bold text-lg sm:text-xl bg-gradient-primary bg-clip-text text-transparent">R$ {service.price.toFixed(2)}</p>
                      <p className="text-xs text-muted-foreground font-medium whitespace-nowrap">R$ {revenue.toFixed(2)} total</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Calendar */}
      <WeeklyCalendar />
    </div>
  );
}