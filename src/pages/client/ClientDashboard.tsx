import { MapPin, Users, Scissors, Calendar, Skull, LogOut, Clock, User, Star } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useData } from "@/hooks/useData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import barbershopBg from "@/assets/barbershop-bg.jpg";
import { format, parseISO } from "date-fns";

const ClientDashboard = () => {
  const { logout, user } = useAuth();
  const { getClientFutureAppointments, clients, getServiceById, getEmployeeById } = useData();

  // Find client data based on logged user email
  const clientData = clients.find(client => client.email === user?.email);
  const futureAppointments = clientData ? getClientFutureAppointments(clientData.id) : [];

  const handleLogout = () => {
    logout();
  };

  const menuItems = [
    {
      title: "LOCALIZAÇÃO", 
      icon: MapPin,
      path: "/client/location",
      description: "Encontre nossa localização"
    },
    {
      title: "PROFISSIONAIS", 
      icon: Users,
      path: "/client/professionals",
      description: "Conheça nossos barbeiros"
    },
    {
      title: "SERVIÇOS", 
      icon: Scissors,
      path: "/client/services", 
      description: "Veja nossos serviços"
    },
    {
      title: "FIDELIDADE", 
      icon: Star,
      path: "/client/loyalty",
      description: "Acompanhe seus pontos"
    },
    {
      title: "AGENDAR", 
      icon: Calendar,
      path: "/client/booking",
      description: "Agende seu horário"
    }
  ];

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: `url(${barbershopBg})` }}
    >
      {/* Overlay escuro para melhor legibilidade */}
      <div className="absolute inset-0 bg-black/70"></div>
      
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-6">
        {/* Logo Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <Skull className="w-24 h-24 text-white mb-4" strokeWidth={1.5} />
              <div className="absolute inset-0 flex items-center justify-center">
                <Scissors className="w-8 h-8 text-white rotate-45" strokeWidth={2} />
              </div>
            </div>
          </div>
          
          <h1 className="text-5xl font-black text-white mb-2 tracking-wider" 
              style={{ fontFamily: 'serif' }}>
            Maggiop
          </h1>
          <div className="w-32 h-px bg-white/50 mx-auto mb-2"></div>
          <h2 className="text-xl font-light text-white/90 tracking-[0.3em] uppercase">
            Barbershop
          </h2>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-2 gap-6 max-w-lg w-full mb-8 sm:grid-cols-3 lg:max-w-xl">
          {menuItems.map((item) => (
            <NavLink
              key={item.title}
              to={item.path}
              className="group"
            >
              <div className="flex flex-col items-center">
                {/* Icon Circle */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-white/90 transition-all duration-300 group-hover:scale-110 shadow-lg">
                  <item.icon className="w-6 h-6 sm:w-8 sm:h-8 text-black" strokeWidth={2} />
                </div>
                
                {/* Title */}
                <span className="text-white font-bold text-xs sm:text-sm tracking-wider text-center leading-tight">
                  {item.title}
                </span>
              </div>
            </NavLink>
          ))}
        </div>

        {/* Future Appointments */}
        {futureAppointments.length > 0 && (
          <div className="w-full max-w-md mb-6">
            <Card className="bg-black/40 border-white/20 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-lg flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Próximos Agendamentos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {futureAppointments.slice(0, 3).map((appointment) => {
                    const service = getServiceById(appointment.serviceId);
                    const employee = getEmployeeById(appointment.employeeId);
                    return (
                      <div key={appointment.id} className="flex items-center justify-between p-3 rounded-lg bg-white/10 backdrop-blur-sm">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-primary/20">
                            <Scissors className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="text-white font-medium text-sm">{service?.name}</p>
                            <p className="text-white/70 text-xs">{employee?.name}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-medium text-sm">
                            {format(parseISO(appointment.date), 'dd/MM')}
                          </p>
                          <p className="text-white/70 text-xs">{appointment.time}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Header Menu (HOME) */}
        <div className="absolute top-6 left-0 right-0 flex items-center justify-between px-6">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors"
          >
            <LogOut className="w-4 h-4 text-white" />
            <span className="text-white text-sm">Sair</span>
          </button>
          <span className="text-white font-light text-lg tracking-[0.2em]">
            HOME
          </span>
          <div className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm">
            <span className="text-white text-sm">Olá, {user?.name}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;