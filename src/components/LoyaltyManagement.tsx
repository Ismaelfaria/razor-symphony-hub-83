import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Star, Users, Search, RotateCcw, Gift } from 'lucide-react';
import { useData } from '@/hooks/useData';
import { cn } from '@/lib/utils';

export default function LoyaltyManagement() {
  const { clients, toggleClientLoyalty, resetClientLoyalty } = useData();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phone.includes(searchTerm)
  );

  const handleToggleLoyalty = (clientId: string, enabled: boolean) => {
    toggleClientLoyalty(clientId, enabled);
    toast({
      title: enabled ? "Fidelidade ativada" : "Fidelidade desativada",
      description: enabled 
        ? "O cliente agora participa do programa de fidelidade"
        : "O cliente foi removido do programa de fidelidade"
    });
  };

  const handleResetLoyalty = (clientId: string, clientName: string) => {
    resetClientLoyalty(clientId);
    toast({
      title: "Pontos resetados",
      description: `Os pontos de fidelidade de ${clientName} foram resetados para zero`
    });
  };

  const getLoyaltyBadge = (points: number, enabled: boolean) => {
    if (!enabled) {
      return <Badge variant="secondary" className="text-xs">Desativado</Badge>;
    }
    
    if (points >= 8) {
      return <Badge className="bg-gradient-to-r from-amber-500 to-yellow-500 text-amber-950 text-xs animate-pulse">
        <Gift className="h-3 w-3 mr-1" />
        Grátis!
      </Badge>;
    }
    
    return <Badge variant="outline" className="text-xs border-amber-500/30 text-amber-400">
      {points}/8 pontos
    </Badge>;
  };

  return (
    <div className="space-y-4 sm:space-y-6 overflow-x-hidden px-3 sm:px-0">
      <div className="text-center">
        <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-3">
          Gerenciar Fidelidade
        </h1>
        <p className="text-muted-foreground">
          Controle o programa de fidelidade dos clientes
        </p>
      </div>

      <Card className="bg-gradient-to-br from-dark-card via-dark-card to-dark-card/80 border-dark-border shadow-dark">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-foreground">
            <div className="p-2 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10">
              <Users className="h-6 w-6 text-primary" />
            </div>
            Clientes Cadastrados
          </CardTitle>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar cliente por nome, email ou telefone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-muted/20 border-muted/30 focus:border-primary/50"
            />
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4">
            {filteredClients.length > 0 ? (
              filteredClients.map((client, index) => (
                <div key={client.id}>
                  {index > 0 && <div className="border-t border-muted/30 mb-4"></div>}
                  <Card className="bg-gradient-to-r from-muted/10 to-muted/5 border-muted/30 hover:border-primary/30 transition-all duration-300">
                  <CardContent className="p-4">
                    <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex-1 text-center sm:text-left">
                        <div className="flex items-center justify-center gap-3 mb-2 sm:justify-start">
                          <h3 className="font-semibold text-foreground">{client.name}</h3>
                          {getLoyaltyBadge(client.loyaltyPoints, client.loyaltyEnabled)}
                        </div>
                        
                        <div className="text-sm text-muted-foreground space-y-1 sm:space-y-1">
                          <p className="sm:hidden">{client.phone}</p>
                          <p className="hidden sm:block">{client.email}</p>
                          <p className="hidden sm:block">{client.phone}</p>
                          <p className="hidden sm:block">Cliente desde: {new Date(client.registrationDate).toLocaleDateString('pt-BR')}</p>
                        </div>

                        {/* Loyalty Progress */}
                        {client.loyaltyEnabled && (
                          <div className="mt-3 space-y-2 w-full max-w-xs sm:max-w-none">
                            <div className="flex justify-between items-center text-xs">
                              <span className="text-amber-400">Progresso da Fidelidade</span>
                              <span className="text-amber-300">{client.loyaltyPoints}/8 cortes</span>
                            </div>
                            <div className="w-full bg-amber-500/20 rounded-full h-2">
                              <div
                                className="bg-gradient-to-r from-amber-400 to-yellow-500 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${Math.min((client.loyaltyPoints / 8) * 100, 100)}%` }}
                              />
                            </div>
                            
                            {/* Visual dots */}
                            <div className="flex gap-1 justify-center mt-2">
                              {Array.from({ length: 8 }, (_, index) => (
                                <div
                                  key={index}
                                  className={cn(
                                    "w-3 h-3 rounded-full border transition-all duration-300",
                                    index < client.loyaltyPoints
                                      ? "bg-gradient-to-br from-amber-400 to-yellow-500 border-amber-400 shadow-sm"
                                      : "border-amber-500/30 bg-amber-500/10"
                                  )}
                                />
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col gap-3 items-center w-full sm:ml-4 sm:w-auto sm:items-end">
                        {/* Loyalty Toggle */}
                        <div className="flex items-center gap-3">
                          <Switch
                            checked={client.loyaltyEnabled}
                            onCheckedChange={(enabled) => handleToggleLoyalty(client.id, enabled)}
                            className="data-[state=checked]:bg-amber-500"
                          />
                          <span className="text-sm text-muted-foreground">
                            Fidelidade {client.loyaltyEnabled ? 'Ativa' : 'Inativa'}
                          </span>
                        </div>

                        {/* Reset Button */}
                        {client.loyaltyEnabled && client.loyaltyPoints > 0 && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleResetLoyalty(client.id, client.name)}
                            className="text-amber-400 border-amber-500/30 hover:bg-amber-500/10 hover:border-amber-500/50"
                          >
                            <RotateCcw className="h-4 w-4 mr-2" />
                            Resetar Pontos
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                 </Card>
                 </div>
              ))
            ) : (
              <div className="text-center py-12">
                <Star className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-muted-foreground text-lg">
                  {searchTerm ? 'Nenhum cliente encontrado com os termos buscados' : 'Nenhum cliente cadastrado'}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}