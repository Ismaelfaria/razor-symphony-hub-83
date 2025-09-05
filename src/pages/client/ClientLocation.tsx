import { ArrowLeft, MapPin, Phone, Clock } from "lucide-react";
import { NavLink } from "react-router-dom";
import barbershopBg from "@/assets/barbershop-bg.jpg";

const ClientLocation = () => {
  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: `url(${barbershopBg})` }}
    >
      <div className="absolute inset-0 bg-black/80"></div>
      
      <div className="relative z-10 flex flex-col min-h-screen p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <NavLink 
            to="/client"
            className="p-3 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </NavLink>
          <h1 className="text-2xl font-bold text-white tracking-wider">LOCALIZAÇÃO</h1>
          <div className="w-12"></div>
        </div>

        <div className="flex-1 flex flex-col justify-center">
          {/* Location Card */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-black" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Maggiop Barbershop</h2>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <MapPin className="w-5 h-5 text-white mt-1 flex-shrink-0" />
                <div>
                  <p className="text-white font-medium">Endereço</p>
                  <p className="text-white/80 text-sm">
                    Rua das Flores, 123<br />
                    Centro - São Paulo, SP<br />
                    CEP: 01234-567
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Phone className="w-5 h-5 text-white flex-shrink-0" />
                <div>
                  <p className="text-white font-medium">Telefone</p>
                  <p className="text-white/80 text-sm">(11) 9999-9999</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Clock className="w-5 h-5 text-white mt-1 flex-shrink-0" />
                <div>
                  <p className="text-white font-medium">Horário de Funcionamento</p>
                  <div className="text-white/80 text-sm">
                    <p>Segunda à Sexta: 9h às 18h</p>
                    <p>Sábado: 9h às 16h</p>
                    <p>Domingo: Fechado</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map placeholder */}
            <div className="mt-8 h-48 bg-white/10 rounded-xl border border-white/20 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-12 h-12 text-white/50 mx-auto mb-2" />
                <p className="text-white/60 text-sm">Mapa em breve</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientLocation;