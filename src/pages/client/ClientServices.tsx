import { ArrowLeft, Scissors, Clock, DollarSign } from "lucide-react";
import { NavLink } from "react-router-dom";
import barbershopBg from "@/assets/barbershop-bg.jpg";

const ClientServices = () => {
  const services = [
    {
      id: "1",
      name: "Corte Masculino",
      price: 35,
      duration: 45,
      description: "Corte personalizado conforme seu estilo"
    },
    {
      id: "2",
      name: "Barba Completa",
      price: 25,
      duration: 30,
      description: "Aparar, modelar e finalizar a barba"
    },
    {
      id: "3",
      name: "Corte + Barba",
      price: 50,
      duration: 60,
      description: "Combo completo com desconto especial"
    },
    {
      id: "4",
      name: "Lavagem e Hidratação",
      price: 20,
      duration: 20,
      description: "Cuidado especial para seus cabelos"
    },
    {
      id: "5",
      name: "Sobrancelha",
      price: 15,
      duration: 15,
      description: "Design e limpeza das sobrancelhas"
    }
  ];

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat relative overflow-x-hidden"
      style={{ backgroundImage: `url(${barbershopBg})` }}
    >
      <div className="absolute inset-0 bg-black/80"></div>
      
      <div className="relative z-10 flex flex-col min-h-screen p-4 sm:p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <NavLink 
            to="/client"
            className="p-3 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </NavLink>
          <h1 className="text-2xl font-bold text-white tracking-wider">SERVIÇOS</h1>
          <div className="w-12"></div>
        </div>

        <div className="flex-1">
          <div className="space-y-4">
            {services.map((service) => (
              <div 
                key={service.id}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    {/* Icon */}
                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                      <Scissors className="w-6 h-6 text-black" />
                    </div>
                    
                    {/* Service Info */}
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-white mb-1">
                        {service.name}
                      </h3>
                      <p className="text-white/80 text-sm mb-3">
                        {service.description}
                      </p>
                      
                      {/* Details */}
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1 text-white/70">
                          <Clock className="w-4 h-4" />
                          <span>{service.duration}min</span>
                        </div>
                        <div className="flex items-center gap-1 text-white font-bold">
                          <DollarSign className="w-4 h-4" />
                          <span>R$ {service.price}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Book button */}
                <div className="mt-4 pt-4 border-t border-white/20">
                  <NavLink
                    to="/client/booking"
                    state={{ selectedService: service }}
                    className="block w-full py-3 bg-white text-black font-medium rounded-xl text-center hover:bg-white/90 transition-colors"
                  >
                    Agendar Serviço
                  </NavLink>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientServices;