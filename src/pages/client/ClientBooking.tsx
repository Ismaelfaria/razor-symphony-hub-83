import { ArrowLeft, Calendar, Clock, User, Scissors } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useState } from "react";
import barbershopBg from "@/assets/barbershop-bg.jpg";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

const ClientBooking = () => {
  const location = useLocation();
  const { toast } = useToast();
  const selectedService = location.state?.selectedService;
  
  const [selectedProfessional, setSelectedProfessional] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  const professionals = [
    { id: "1", name: "Carlos Barbeiro" },
    { id: "2", name: "Roberto Silva" }
  ];

  const availableTimes = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "14:00", "14:30", "15:00", "15:30", "16:00", "16:30"
  ];

  const handleBooking = () => {
    // Verificar se todos os campos estão preenchidos
    if (!selectedProfessional || !selectedDate || !selectedTime) {
      toast({
        title: "Erro",
        description: "Todos os campos obrigatórios devem ser preenchidos",
        variant: "destructive"
      });
      return;
    }

    // Verificar se o agendamento é com pelo menos 2 horas de antecedência
    const selectedDateTime = new Date(`${selectedDate}T${selectedTime}`);
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

    // Lógica de agendamento
    toast({
      title: "Sucesso",
      description: "Agendamento realizado com sucesso!",
    });
  };

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
          <h1 className="text-2xl font-bold text-white tracking-wider">AGENDAR</h1>
          <div className="w-12"></div>
        </div>

        <div className="flex-1 space-y-6">
          {/* Selected Service */}
          {selectedService && (
            <Card className="bg-white/10 backdrop-blur-md border border-white/20 p-4">
              <div className="flex items-center gap-3">
                <Scissors className="w-5 h-5 text-white" />
                <div>
                  <p className="text-white font-medium">{selectedService.name}</p>
                  <p className="text-white/70 text-sm">R$ {selectedService.price} - {selectedService.duration}min</p>
                </div>
              </div>
            </Card>
          )}

          {/* Professional Selection */}
          <Card className="bg-white/10 backdrop-blur-md border border-white/20 p-6">
            <div className="flex items-center gap-3 mb-4">
              <User className="w-5 h-5 text-white" />
              <h3 className="text-white font-medium">Escolha o Profissional</h3>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {professionals.map((prof) => (
                <button
                  key={prof.id}
                  onClick={() => setSelectedProfessional(prof.id)}
                  className={`p-3 rounded-xl border-2 transition-colors ${
                    selectedProfessional === prof.id
                      ? "bg-white text-black border-white"
                      : "bg-white/10 text-white border-white/20 hover:bg-white/20"
                  }`}
                >
                  {prof.name}
                </button>
              ))}
            </div>
          </Card>

          {/* Date Selection */}
          <Card className="bg-white/10 backdrop-blur-md border border-white/20 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="w-5 h-5 text-white" />
              <h3 className="text-white font-medium">Escolha a Data</h3>
            </div>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50"
            />
          </Card>

          {/* Time Selection */}
          <Card className="bg-white/10 backdrop-blur-md border border-white/20 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Clock className="w-5 h-5 text-white" />
              <h3 className="text-white font-medium">Escolha o Horário</h3>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {availableTimes.map((time) => (
                <button
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  className={`p-3 rounded-xl border transition-colors text-sm ${
                    selectedTime === time
                      ? "bg-white text-black border-white"
                      : "bg-white/10 text-white border-white/20 hover:bg-white/20"
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </Card>

          {/* Booking Button */}
          <Button
            onClick={handleBooking}
            disabled={!selectedProfessional || !selectedDate || !selectedTime}
            className="w-full py-4 text-lg font-medium bg-white text-black hover:bg-white/90 disabled:bg-white/30 disabled:text-white/50"
          >
            Confirmar Agendamento
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ClientBooking;