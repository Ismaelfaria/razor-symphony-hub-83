import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Edit, Trash2, Mail, Phone, User, Star } from "lucide-react";
import { useData } from "@/hooks/useData";
import { Client } from "@/types";
import { useToast } from "@/hooks/use-toast";
import LoyaltyManagement from "@/components/LoyaltyManagement";

export default function Clients() {
  const { clients, addClient, updateClient, deleteClient } = useData();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.phone.trim()) {
      toast({
        title: "Erro",
        description: "Nome e telefone são obrigatórios",
        variant: "destructive"
      });
      return;
    }

    if (editingClient) {
      updateClient(editingClient.id, formData);
      toast({
        title: "Cliente atualizado",
        description: "Os dados do cliente foram atualizados com sucesso."
      });
    } else {
      addClient({
        ...formData,
        registrationDate: new Date().toISOString().split('T')[0],
        loyaltyPoints: 0,
        loyaltyEnabled: true
      });
      toast({
        title: "Cliente adicionado",
        description: "Novo cliente foi adicionado com sucesso."
      });
    }

    setIsDialogOpen(false);
    setEditingClient(null);
    setFormData({ name: '', phone: '', email: '' });
  };

  const handleEdit = (client: Client) => {
    setEditingClient(client);
    setFormData({
      name: client.name,
      phone: client.phone,
      email: client.email
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (client: Client) => {
    if (window.confirm(`Tem certeza que deseja excluir o cliente ${client.name}?`)) {
      deleteClient(client.id);
      toast({
        title: "Cliente excluído",
        description: "Cliente foi removido com sucesso."
      });
    }
  };

  return (
    <div className="space-y-4 sm:space-y-8 overflow-x-hidden px-3 sm:px-0">
      <div className="text-center py-3 sm:py-6">
        <h1 className="text-2xl sm:text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2 sm:mb-3">
          Clientes
        </h1>
        <p className="text-muted-foreground text-sm sm:text-lg px-2">
          Gerencie todos os seus clientes cadastrados
        </p>
        <div className="w-16 sm:w-24 h-1 bg-gradient-primary rounded-full mx-auto mt-2 sm:mt-4"></div>
      </div>
      
      <Tabs defaultValue="list" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-muted/20 p-1 h-10 sm:h-12">
          <TabsTrigger value="list" className="flex items-center gap-1 sm:gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs sm:text-sm">
            <User className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Lista de Clientes</span>
            <span className="sm:hidden">Lista</span>
          </TabsTrigger>
          <TabsTrigger value="loyalty" className="flex items-center gap-1 sm:gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs sm:text-sm">
            <Star className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Gerenciar Fidelidade</span>
            <span className="sm:hidden">Fidelidade</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="list" className="space-y-3 sm:space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="text-xs sm:text-sm text-muted-foreground">
              {clients.length} cliente{clients.length !== 1 ? 's' : ''} cadastrado{clients.length !== 1 ? 's' : ''}
            </div>
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-primary text-white hover:opacity-90 shadow-violet hover:scale-105 transition-all duration-200 w-full sm:w-auto text-sm">
                  <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Novo Cliente</span>
                  <span className="sm:hidden">Novo</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gradient-to-br from-dark-card to-dark-card/80 border-dark-border shadow-dark backdrop-blur-sm max-w-[95vw] sm:max-w-lg w-[95vw] sm:w-auto p-4 sm:p-6 rounded-xl">
                <DialogHeader>
                  <DialogTitle className="text-foreground text-xl font-bold">
                    {editingClient ? 'Editar Cliente' : 'Adicionar Novo Cliente'}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <Label htmlFor="name" className="text-foreground font-medium">Nome *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Nome completo do cliente"
                      className="bg-input/50 border-dark-border text-foreground backdrop-blur-sm focus:border-primary/50 transition-all duration-200"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-foreground font-medium">Telefone *</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="(11) 99999-9999"
                      className="bg-input/50 border-dark-border text-foreground backdrop-blur-sm focus:border-primary/50 transition-all duration-200"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-foreground font-medium">E-mail</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="cliente@email.com"
                      className="bg-input/50 border-dark-border text-foreground backdrop-blur-sm focus:border-primary/50 transition-all duration-200"
                    />
                  </div>
                  <div className="flex gap-3 pt-6">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsDialogOpen(false)}
                      className="flex-1 border-dark-border text-foreground hover:bg-muted/30 transition-all duration-200"
                    >
                      Cancelar
                    </Button>
                    <Button 
                      type="submit" 
                      className="flex-1 bg-gradient-primary text-white hover:opacity-90 hover:scale-105 transition-all duration-200 shadow-violet"
                    >
                      {editingClient ? 'Salvar Alterações' : 'Adicionar Cliente'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Mobile list (cards) */}
          <div className="md:hidden space-y-3">
            {clients.length > 0 ? (
              clients.map((client) => (
                <Card key={client.id} className="bg-gradient-to-br from-dark-card via-dark-card to-dark-card/80 border-dark-border shadow-dark">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <User className="h-5 w-5 text-primary" />
                          <h3 className="text-base font-semibold text-foreground truncate">{client.name}</h3>
                        </div>
                        <div className="space-y-1 text-sm">
                          <div className="flex items-center gap-2 text-foreground">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span className="truncate">{client.phone}</span>
                          </div>
                          {client.email ? (
                            <div className="flex items-center gap-2 text-foreground">
                              <Mail className="h-4 w-4 text-muted-foreground" />
                              <span className="truncate">{client.email}</span>
                            </div>
                          ) : (
                            <span className="text-muted-foreground italic">Não informado</span>
                          )}
                          <div className="flex flex-wrap gap-3 pt-1 text-muted-foreground">
                            <span className="text-xs">Cadastro: {new Date(client.registrationDate).toLocaleDateString('pt-BR')}</span>
                            <span className="text-xs">Última visita: {client.lastVisit ? new Date(client.lastVisit).toLocaleDateString('pt-BR') : 'Nenhuma'}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 shrink-0">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(client)}
                          className="border-dark-border text-foreground"
                          aria-label={`Editar ${client.name}`}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(client)}
                          className="border-destructive/50 text-destructive"
                          aria-label={`Excluir ${client.name}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="bg-gradient-to-br from-dark-card via-dark-card to-dark-card/80 border-dark-border shadow-dark">
                <CardContent className="p-8">
                  <div className="flex flex-col items-center gap-3">
                    <User className="h-12 w-12 text-muted-foreground/30" />
                    <p className="text-muted-foreground text-base text-center">Nenhum cliente cadastrado ainda</p>
                    <p className="text-muted-foreground/60 text-sm text-center">Clique em "Novo Cliente" para começar</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Desktop/Tablet table */}
          <Card className="hidden md:block bg-gradient-to-br from-dark-card via-dark-card to-dark-card/80 border-dark-border shadow-dark hover:shadow-violet transition-all duration-300">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-foreground text-xl">
                <div className="p-2 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10">
                  <User className="h-6 w-6 text-primary" />
                </div>
                Lista de Clientes
                <span className="ml-auto text-sm font-normal text-muted-foreground bg-muted/20 px-3 py-1 rounded-full">
                  {clients.length} total
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-dark-border hover:bg-muted/30 transition-colors">
                      <TableHead className="text-muted-foreground font-semibold">Nome</TableHead>
                      <TableHead className="text-muted-foreground font-semibold">Telefone</TableHead>
                      <TableHead className="text-muted-foreground font-semibold">E-mail</TableHead>
                      <TableHead className="text-muted-foreground font-semibold">Data Cadastro</TableHead>
                      <TableHead className="text-muted-foreground font-semibold">Última Visita</TableHead>
                      <TableHead className="text-muted-foreground font-semibold text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {clients.length > 0 ? (
                      clients.map((client) => (
                        <TableRow key={client.id} className="border-dark-border hover:bg-gradient-to-r hover:from-muted/20 hover:to-muted/10 transition-all duration-200 group">
                          <TableCell className="font-semibold text-foreground group-hover:text-primary transition-colors">{client.name}</TableCell>
                          <TableCell className="text-foreground">
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-muted-foreground" />
                              {client.phone}
                            </div>
                          </TableCell>
                          <TableCell className="text-foreground">
                            {client.email ? (
                              <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                {client.email}
                              </div>
                            ) : (
                              <span className="text-muted-foreground italic">Não informado</span>
                            )}
                          </TableCell>
                          <TableCell className="text-muted-foreground font-medium">
                            {new Date(client.registrationDate).toLocaleDateString('pt-BR')}
                          </TableCell>
                          <TableCell className="text-muted-foreground font-medium">
                            {client.lastVisit ? new Date(client.lastVisit).toLocaleDateString('pt-BR') : (
                              <span className="italic">Nenhuma visita</span>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex gap-2 justify-end">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEdit(client)}
                                className="border-dark-border text-foreground hover:bg-primary/10 hover:border-primary/50 hover:text-primary transition-all duration-200 hover:scale-105"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDelete(client)}
                                className="border-destructive/50 text-destructive hover:bg-destructive/20 hover:border-destructive transition-all duration-200 hover:scale-105"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-12">
                          <div className="flex flex-col items-center gap-3">
                            <User className="h-12 w-12 text-muted-foreground/30" />
                            <p className="text-muted-foreground text-lg">Nenhum cliente cadastrado ainda</p>
                            <p className="text-muted-foreground/60 text-sm">Clique em "Novo Cliente" para começar</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="loyalty">
          <LoyaltyManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
}