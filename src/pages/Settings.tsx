import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings as SettingsIcon, Building, Clock, MapPin, Save } from "lucide-react";
import { useData } from "@/hooks/useData";
import { useToast } from "@/hooks/use-toast";

export default function Settings() {
  const { config, updateConfig } = useData();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: config.name,
    address: config.address,
    openTime: config.openTime,
    closeTime: config.closeTime
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.address || !formData.openTime || !formData.closeTime) {
      toast({
        title: "Erro",
        description: "Todos os campos são obrigatórios",
        variant: "destructive"
      });
      return;
    }

    updateConfig(formData);
    toast({
      title: "Configurações salvas",
      description: "As configurações da barbearia foram atualizadas com sucesso."
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Configurações
          </h1>
          <p className="text-muted-foreground mt-2">
            Gerencie as informações da barbearia
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Informações da Barbearia */}
        <Card className="bg-gradient-dark border-dark-border shadow-dark">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Building className="h-5 w-5 text-primary" />
              Informações da Barbearia
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-foreground">Nome da Barbearia *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Nome da barbearia"
                  className="bg-input border-border text-foreground"
                />
              </div>
              
              <div>
                <Label htmlFor="address" className="text-foreground">Endereço *</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="Endereço completo"
                  className="bg-input border-border text-foreground"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="openTime" className="text-foreground">Horário de Abertura *</Label>
                  <Input
                    id="openTime"
                    type="time"
                    value={formData.openTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, openTime: e.target.value }))}
                    className="bg-input border-border text-foreground"
                  />
                </div>
                <div>
                  <Label htmlFor="closeTime" className="text-foreground">Horário de Fechamento *</Label>
                  <Input
                    id="closeTime"
                    type="time"
                    value={formData.closeTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, closeTime: e.target.value }))}
                    className="bg-input border-border text-foreground"
                  />
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-gradient-primary text-white hover:opacity-90"
              >
                <Save className="h-4 w-4 mr-2" />
                Salvar Configurações
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Preview das Informações */}
        <Card className="bg-gradient-dark border-dark-border shadow-dark">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <SettingsIcon className="h-5 w-5 text-primary" />
              Preview das Informações
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-muted/20 border border-border">
                <div className="flex items-center gap-2 mb-2">
                  <Building className="h-4 w-4 text-primary" />
                  <span className="font-medium text-foreground">Nome</span>
                </div>
                <p className="text-muted-foreground">{formData.name || 'Nome da barbearia'}</p>
              </div>
              
              <div className="p-4 rounded-lg bg-muted/20 border border-border">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span className="font-medium text-foreground">Endereço</span>
                </div>
                <p className="text-muted-foreground">{formData.address || 'Endereço da barbearia'}</p>
              </div>
              
              <div className="p-4 rounded-lg bg-muted/20 border border-border">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-primary" />
                  <span className="font-medium text-foreground">Horário de Funcionamento</span>
                </div>
                <p className="text-muted-foreground">
                  {formData.openTime || '08:00'} às {formData.closeTime || '18:00'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Links Públicos */}
      <Card className="bg-gradient-dark border-dark-border shadow-dark">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <SettingsIcon className="h-5 w-5 text-primary" />
            Links Públicos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-muted/20 border border-border">
              <h4 className="font-medium text-foreground mb-2">Página de Agendamento Online</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Link para clientes fazerem agendamentos online
              </p>
              <div className="flex gap-2">
                <Input
                  readOnly
                  value={`${window.location.origin}/booking`}
                  className="bg-input border-border text-foreground flex-1"
                />
                <Button
                  onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}/booking`);
                    toast({
                      title: "Link copiado!",
                      description: "O link foi copiado para a área de transferência."
                    });
                  }}
                  variant="outline"
                  className="border-border text-foreground hover:bg-muted"
                >
                  Copiar
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}