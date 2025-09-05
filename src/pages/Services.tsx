import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Edit, Trash2, Scissors, Clock, DollarSign } from "lucide-react";
import { useData } from "@/hooks/useData";
import { Service } from "@/types";
import { useToast } from "@/hooks/use-toast";

export default function Services() {
  const { services, addService, updateService, deleteService } = useData();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    duration: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.price || !formData.duration) {
      toast({
        title: "Erro",
        description: "Todos os campos são obrigatórios",
        variant: "destructive"
      });
      return;
    }

    const serviceData = {
      name: formData.name.trim(),
      price: parseFloat(formData.price),
      duration: parseInt(formData.duration)
    };

    if (editingService) {
      updateService(editingService.id, serviceData);
      toast({
        title: "Serviço atualizado",
        description: "Os dados do serviço foram atualizados com sucesso."
      });
    } else {
      addService(serviceData);
      toast({
        title: "Serviço adicionado",
        description: "Novo serviço foi adicionado com sucesso."
      });
    }

    setIsDialogOpen(false);
    setEditingService(null);
    setFormData({ name: '', price: '', duration: '' });
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      price: service.price.toString(),
      duration: service.duration.toString()
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (service: Service) => {
    if (window.confirm(`Tem certeza que deseja excluir o serviço ${service.name}?`)) {
      deleteService(service.id);
      toast({
        title: "Serviço excluído",
        description: "Serviço foi removido com sucesso."
      });
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 overflow-x-hidden px-3 sm:px-0">
      <div className="text-center sm:text-left py-2 sm:py-4">
        <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
          Serviços
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base px-2 sm:px-0">
          Gerencie os serviços oferecidos pela barbearia
        </p>
        <div className="w-16 sm:w-20 h-1 bg-gradient-primary rounded-full mx-auto sm:mx-0 mt-2"></div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
        <div className="text-xs sm:text-sm text-muted-foreground">
          {services.length} serviço{services.length !== 1 ? 's' : ''} cadastrado{services.length !== 1 ? 's' : ''}
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary text-white hover:opacity-90 shadow-violet hover:scale-105 transition-all duration-200 w-full sm:w-auto">
              <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Novo Serviço</span>
              <span className="sm:hidden">Novo</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gradient-to-br from-dark-card to-dark-card/80 border-dark-border shadow-dark backdrop-blur-sm w-[95vw] max-w-md mx-auto">
            <DialogHeader>
              <DialogTitle className="text-foreground text-lg sm:text-xl font-bold">
                {editingService ? 'Editar Serviço' : 'Adicionar Novo Serviço'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              <div>
                <Label htmlFor="name" className="text-foreground font-medium text-sm">Nome do Serviço *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Ex: Corte Masculino"
                  className="bg-input/50 border-dark-border text-foreground backdrop-blur-sm focus:border-primary/50 transition-all duration-200 h-10"
                />
              </div>
              <div>
                <Label htmlFor="price" className="text-foreground font-medium text-sm">Preço (R$) *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  placeholder="30.00"
                  className="bg-input/50 border-dark-border text-foreground backdrop-blur-sm focus:border-primary/50 transition-all duration-200 h-10"
                />
              </div>
              <div>
                <Label htmlFor="duration" className="text-foreground font-medium text-sm">Duração (minutos) *</Label>
                <Input
                  id="duration"
                  type="number"
                  min="1"
                  value={formData.duration}
                  onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                  placeholder="45"
                  className="bg-input/50 border-dark-border text-foreground backdrop-blur-sm focus:border-primary/50 transition-all duration-200 h-10"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-4 sm:pt-6">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                  className="flex-1 border-dark-border text-foreground hover:bg-muted/30 transition-all duration-200 h-10"
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1 bg-gradient-primary text-white hover:opacity-90 hover:scale-105 transition-all duration-200 shadow-violet h-10"
                >
                  <span className="hidden sm:inline">{editingService ? 'Salvar Alterações' : 'Adicionar Serviço'}</span>
                  <span className="sm:hidden">{editingService ? 'Salvar' : 'Adicionar'}</span>
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="bg-gradient-to-br from-dark-card via-dark-card to-dark-card/80 border-dark-border shadow-dark hover:shadow-violet transition-all duration-300">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-foreground text-xl">
            <div className="p-2 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10">
              <Scissors className="h-6 w-6 text-primary" />
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full">
              <span>Lista de Serviços</span>
              <span className="text-sm font-normal text-muted-foreground bg-muted/20 px-3 py-1 rounded-full mt-1 sm:mt-0 w-fit">
                {services.length} total
              </span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Mobile list (no horizontal scroll) */}
          <div className="sm:hidden space-y-3">
            {services.length > 0 ? (
              services.map((service) => (
                <div
                  key={service.id}
                  className="border border-dark-border rounded-xl p-3 bg-gradient-to-br from-dark-card/80 to-dark-card/60"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <Scissors className="h-4 w-4 text-primary flex-shrink-0" />
                        <h3 className="font-semibold text-foreground truncate">{service.name}</h3>
                      </div>
                      <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5 text-blue-500" />
                          {service.duration} min
                        </span>
                        <span className="flex items-center gap-1 text-foreground font-medium">
                          <DollarSign className="h-3.5 w-3.5 text-green-500" />
                          R$ {service.price.toFixed(2)}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(service)}
                        className="h-8 w-8 p-0 border-dark-border hover:bg-primary/10 hover:border-primary/50"
                        aria-label={`Editar ${service.name}`}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(service)}
                        className="h-8 w-8 p-0 border-destructive/50 text-destructive hover:bg-destructive/20"
                        aria-label={`Excluir ${service.name}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Scissors className="h-8 w-8 mx-auto text-muted-foreground/30" />
                <p className="mt-2 text-sm text-muted-foreground">Nenhum serviço cadastrado ainda</p>
              </div>
            )}
          </div>

          {/* Desktop table (unchanged) */}
          <div className="hidden sm:block overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-dark-border hover:bg-muted/30 transition-colors">
                  <TableHead className="text-muted-foreground font-semibold">Serviço</TableHead>
                  <TableHead className="text-muted-foreground font-semibold min-w-[80px]">Preço</TableHead>
                  <TableHead className="text-muted-foreground font-semibold min-w-[90px]">Duração</TableHead>
                  <TableHead className="text-muted-foreground font-semibold text-right min-w-[100px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {services.length > 0 ? (
                  services.map((service) => (
                    <TableRow key={service.id} className="border-dark-border hover:bg-gradient-to-r hover:from-muted/20 hover:to-muted/10 transition-all duration-200 group">
                      <TableCell className="font-semibold text-foreground group-hover:text-primary transition-colors max-w-[120px] sm:max-w-none">
                        <div className="truncate sm:whitespace-normal">{service.name}</div>
                      </TableCell>
                      <TableCell className="text-foreground">
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 flex-shrink-0" />
                          <span className="text-xs sm:text-sm">R$ {service.price.toFixed(2)}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500 flex-shrink-0" />
                          <span className="text-xs sm:text-sm">{service.duration} min</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-1 sm:gap-2 justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(service)}
                            className="border-dark-border text-foreground hover:bg-primary/10 hover:border-primary/50 hover:text-primary transition-all duration-200 hover:scale-105 h-8 w-8 p-0 sm:h-9 sm:w-9"
                          >
                            <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(service)}
                            className="border-destructive/50 text-destructive hover:bg-destructive/20 hover:border-destructive transition-all duration-200 hover:scale-105 h-8 w-8 p-0 sm:h-9 sm:w-9"
                          >
                            <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 sm:py-12">
                      <div className="flex flex-col items-center gap-2 sm:gap-3">
                        <Scissors className="h-8 w-8 sm:h-12 sm:w-12 text-muted-foreground/30" />
                        <p className="text-muted-foreground text-sm sm:text-lg">Nenhum serviço cadastrado ainda</p>
                        <p className="text-muted-foreground/60 text-xs sm:text-sm">Clique em "Novo Serviço" para começar</p>
                      </div>
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