import { ArrowLeft, Users, Star } from "lucide-react";
import { NavLink } from "react-router-dom";
import barbershopBg from "@/assets/barbershop-bg.jpg";

const ClientProfessionals = () => {
  const professionals = [
    {
      id: "1",
      name: "Carlos Barbeiro",
      specialty: "Cortes Clássicos & Barba",
      experience: "5 anos",
      rating: 4.8,
      description: "Especialista em cortes tradicionais e modernos"
    },
    {
      id: "2", 
      name: "Roberto Silva",
      specialty: "Cortes Modernos & Fade",
      experience: "3 anos",
      rating: 4.9,
      description: "Expert em técnicas de fade e cortes atuais"
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
          <h1 className="text-2xl font-bold text-white tracking-wider">PROFISSIONAIS</h1>
          <div className="w-12"></div>
        </div>

        <div className="flex-1">
          <div className="space-y-6">
            {professionals.map((professional) => (
              <div 
                key={professional.id}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-colors"
              >
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                    <Users className="w-8 h-8 text-black" />
                  </div>
                  
                  {/* Info */}
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-1">
                      {professional.name}
                    </h3>
                    <p className="text-white/80 text-sm mb-2">
                      {professional.specialty}
                    </p>
                    <p className="text-white/70 text-sm mb-3">
                      {professional.description}
                    </p>
                    
                    {/* Stats */}
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-white">{professional.rating}</span>
                      </div>
                      <div className="text-white/70">
                        {professional.experience} de experiência
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Book button */}
                <div className="mt-4 pt-4 border-t border-white/20">
                  <NavLink
                    to="/client/booking"
                    className="block w-full py-3 bg-white text-black font-medium rounded-xl text-center hover:bg-white/90 transition-colors"
                  >
                    Agendar com {professional.name.split(' ')[0]}
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

export default ClientProfessionals;