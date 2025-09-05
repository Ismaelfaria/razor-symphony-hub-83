import { ArrowLeft, Star, Gift, Trophy } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useData } from "@/hooks/useData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import LoyaltyCard from "@/components/LoyaltyCard";
import barbershopBg from "@/assets/barbershop-bg.jpg";

const ClientLoyalty = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { clients } = useData();

  // Find client data based on logged user email
  const clientData = clients.find(client => client.email === user?.email);

  if (!clientData || !clientData.loyaltyEnabled) {
    return (
      <div 
        className="min-h-screen bg-cover bg-center bg-no-repeat relative flex items-center justify-center"
        style={{ backgroundImage: `url(${barbershopBg})` }}
      >
        <div className="absolute inset-0 bg-black/70"></div>
        <div className="relative z-10 text-center p-6">
          <div className="mb-6">
            <Trophy className="w-16 h-16 text-white/50 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">
              Programa de Fidelidade
            </h2>
            <p className="text-white/70">
              O programa de fidelidade não está disponível para sua conta.
            </p>
          </div>
          <Button 
            onClick={() => navigate('/client')} 
            variant="outline"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </div>
      </div>
    );
  }

  const maxPoints = 8;
  const currentPoints = clientData.loyaltyPoints;
  const remainingPoints = maxPoints - currentPoints;
  const isComplete = currentPoints >= maxPoints;

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: `url(${barbershopBg})` }}
    >
      {/* Overlay escuro para melhor legibilidade */}
      <div className="absolute inset-0 bg-black/70"></div>
      
      <div className="relative z-10 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button 
            onClick={() => navigate('/client')} 
            variant="ghost"
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <h1 className="text-2xl font-bold text-white tracking-wider">
            FIDELIDADE
          </h1>
          <div></div>
        </div>

        <div className="max-w-md mx-auto space-y-6">
          {/* Loyalty Card */}
          <LoyaltyCard 
            loyaltyPoints={currentPoints} 
            loyaltyEnabled={clientData.loyaltyEnabled}
          />

          {/* Status Cards */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-black/40 border-white/20 backdrop-blur-sm">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Star className="w-6 h-6 text-amber-400" />
                </div>
                <div className="text-2xl font-bold text-white">{currentPoints}</div>
                <div className="text-sm text-white/70">Cortes Realizados</div>
              </CardContent>
            </Card>

            <Card className="bg-black/40 border-white/20 backdrop-blur-sm">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Gift className="w-6 h-6 text-emerald-400" />
                </div>
                <div className="text-2xl font-bold text-white">
                  {isComplete ? '1' : remainingPoints}
                </div>
                <div className="text-sm text-white/70">
                  {isComplete ? 'Corte Grátis' : 'Faltam para Grátis'}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* How it Works */}
          <Card className="bg-black/40 border-white/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white text-lg flex items-center gap-2">
                <Trophy className="h-5 w-5 text-amber-400" />
                Como Funciona
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-amber-400 text-sm font-bold">1</span>
                </div>
                <p className="text-white/80 text-sm">
                  A cada corte realizado, você ganha 1 ponto de fidelidade
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-amber-400 text-sm font-bold">2</span>
                </div>
                <p className="text-white/80 text-sm">
                  Complete 8 pontos para ganhar um corte grátis
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-amber-400 text-sm font-bold">3</span>
                </div>
                <p className="text-white/80 text-sm">
                  O corte grátis pode ser usado em qualquer serviço
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Action Button */}
          {!isComplete && (
            <Card className="bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border-amber-500/20 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <p className="text-amber-200 mb-4">
                  Continue cortando conosco e ganhe recompensas!
                </p>
                <Button 
                  onClick={() => navigate('/client/booking')}
                  className="bg-gradient-to-r from-amber-500 to-yellow-500 text-amber-950 font-bold hover:from-amber-600 hover:to-yellow-600"
                >
                  Agendar Próximo Corte
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientLoyalty;