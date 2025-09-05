import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Trash2, Users, Badge, Percent, DollarSign } from "lucide-react";
import { useData } from "@/hooks/useData";
import { Employee } from "@/types";
import { useToast } from "@/hooks/use-toast";

export default function Employees() {
  const { employees, addEmployee, updateEmployee, deleteEmployee } = useData();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    position: 'barbeiro' as 'barbeiro' | 'recepcao' | 'auxiliar',
    accessLevel: 'funcionario' as 'funcionario' | 'administrador',
    commissionType: 'percentage' as 'percentage' | 'fixed',
    commissionValue: 50,
    active: true
  });

  const resetForm = () => {
    setFormData({
      name: '',
      phone: '',
      email: '',
      password: '',
      position: 'barbeiro',
      accessLevel: 'funcionario',
      commissionType: 'percentage',
      commissionValue: 50,
      active: true
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone || !formData.email || !formData.password) {
      toast({
        title: "Erro",
        description: "Todos os campos obrigatórios devem ser preenchidos",
        variant: "destructive"
      });
      return;
    }

    if (editingEmployee) {
      updateEmployee(editingEmployee.id, formData);
      toast({
        title: "Funcionário atualizado",
        description: "Os dados do funcionário foram atualizados com sucesso."
      });
    } else {
      addEmployee(formData);
      toast({
        title: "Funcionário criado",
        description: "Novo funcionário foi criado com sucesso."
      });
    }

    setIsDialogOpen(false);
    setEditingEmployee(null);
    resetForm();
  };

  const handleEdit = (employee: Employee) => {
    setEditingEmployee(employee);
    setFormData({
      name: employee.name,
      phone: employee.phone,
      email: employee.email,
      password: employee.password,
      position: employee.position,
      accessLevel: employee.accessLevel,
      commissionType: employee.commissionType || 'percentage',
      commissionValue: employee.commissionValue || 50,
      active: employee.active
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (employee: Employee) => {
    if (window.confirm(`Tem certeza que deseja excluir o funcionário ${employee.name}?`)) {
      deleteEmployee(employee.id);
      toast({
        title: "Funcionário excluído",
        description: "Funcionário foi removido com sucesso."
      });
    }
  };

  const getAccessLevelBadge = (accessLevel: string) => {
    return accessLevel === 'administrador' ? 
      'bg-purple-500/20 text-purple-400' : 
      'bg-blue-500/20 text-blue-400';
  };

  const getStatusBadge = (active: boolean) => {
    return active ? 
      'bg-green-500/20 text-green-400' : 
      'bg-red-500/20 text-red-400';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Funcionários
          </h1>
          <p className="text-muted-foreground mt-2">
            Gerencie todos os funcionários da barbearia
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary text-white hover:opacity-90 shadow-violet">
              <Plus className="h-4 w-4 mr-2" />
              Novo Funcionário
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border max-w-md">
            <DialogHeader>
              <DialogTitle className="text-foreground">
                {editingEmployee ? 'Editar Funcionário' : 'Criar Novo Funcionário'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-foreground">Nome *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Nome completo"
                  className="bg-input border-border text-foreground"
                />
              </div>
              
              <div>
                <Label htmlFor="phone" className="text-foreground">Telefone *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="(11) 99999-9999"
                  className="bg-input border-border text-foreground"
                />
              </div>
              
              <div>
                <Label htmlFor="email" className="text-foreground">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="funcionario@email.com"
                  className="bg-input border-border text-foreground"
                />
              </div>

              <div>
                <Label htmlFor="password" className="text-foreground">Senha *</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="••••••••"
                  className="bg-input border-border text-foreground"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="position" className="text-foreground">Cargo</Label>
                  <Select value={formData.position} onValueChange={(value: 'barbeiro' | 'recepcao' | 'auxiliar') => setFormData(prev => ({ ...prev, position: value }))}>
                    <SelectTrigger className="bg-input border-border text-foreground">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      <SelectItem value="barbeiro" className="text-foreground">Barbeiro</SelectItem>
                      <SelectItem value="recepcao" className="text-foreground">Recepção</SelectItem>
                      <SelectItem value="auxiliar" className="text-foreground">Auxiliar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="accessLevel" className="text-foreground">Nível de Acesso</Label>
                  <Select value={formData.accessLevel} onValueChange={(value: 'funcionario' | 'administrador') => setFormData(prev => ({ ...prev, accessLevel: value }))}>
                    <SelectTrigger className="bg-input border-border text-foreground">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      <SelectItem value="funcionario" className="text-foreground">Funcionário</SelectItem>
                      <SelectItem value="administrador" className="text-foreground">Administrador</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {(formData.position === 'barbeiro' || formData.accessLevel === 'administrador') && (
                <>
                  <div>
                    <Label className="text-foreground">Tipo de Comissão</Label>
                    <Select value={formData.commissionType} onValueChange={(value: 'percentage' | 'fixed') => setFormData(prev => ({ ...prev, commissionType: value }))}>
                      <SelectTrigger className="bg-input border-border text-foreground">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-popover border-border">
                        <SelectItem value="percentage" className="text-foreground">Percentual (%)</SelectItem>
                        <SelectItem value="fixed" className="text-foreground">Valor Fixo (R$)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label className="text-foreground">
                      Valor da Comissão {formData.commissionType === 'percentage' ? '(%)' : '(R$)'}
                    </Label>
                    <Input
                      type="number"
                      value={formData.commissionValue}
                      onChange={(e) => setFormData(prev => ({ ...prev, commissionValue: parseFloat(e.target.value) || 0 }))}
                      placeholder={formData.commissionType === 'percentage' ? '60' : '25.00'}
                      className="bg-input border-border text-foreground"
                      min="0"
                      step={formData.commissionType === 'percentage' ? '1' : '0.01'}
                    />
                  </div>
                </>
              )}
              
              <div className="flex gap-3 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setIsDialogOpen(false);
                    resetForm();
                  }}
                  className="flex-1 border-border text-foreground hover:bg-muted"
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1 bg-gradient-primary text-white hover:opacity-90"
                >
                  {editingEmployee ? 'Salvar' : 'Criar'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="bg-gradient-dark border-dark-border shadow-dark">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Users className="h-5 w-5 text-primary" />
            Lista de Funcionários ({employees.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-muted/50">
                  <TableHead className="text-muted-foreground">Nome</TableHead>
                  <TableHead className="text-muted-foreground">Contato</TableHead>
                  <TableHead className="text-muted-foreground">Cargo</TableHead>
                  <TableHead className="text-muted-foreground">Acesso</TableHead>
                  <TableHead className="text-muted-foreground">Comissão</TableHead>
                  <TableHead className="text-muted-foreground">Status</TableHead>
                  <TableHead className="text-muted-foreground text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employees.length > 0 ? (
                  employees.map((employee) => (
                    <TableRow key={employee.id} className="border-border hover:bg-muted/30">
                      <TableCell className="font-medium text-foreground">
                        <div>
                          <div>{employee.name}</div>
                          <div className="text-sm text-muted-foreground">{employee.email}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-foreground">
                        {employee.phone}
                      </TableCell>
                      <TableCell>
                        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-primary/20 text-primary`}>
                          <Badge className="h-3 w-3" />
                          {employee.position}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getAccessLevelBadge(employee.accessLevel)}`}>
                          {employee.accessLevel}
                        </div>
                      </TableCell>
                      <TableCell className="text-foreground">
                        {(employee.position === 'barbeiro' || employee.accessLevel === 'administrador') ? (
                          <div className="flex items-center gap-1">
                            {employee.commissionType === 'percentage' ? (
                              <>
                                <Percent className="h-3 w-3 text-muted-foreground" />
                                {employee.commissionValue}%
                              </>
                            ) : (
                              <>
                                <DollarSign className="h-3 w-3 text-muted-foreground" />
                                R$ {employee.commissionValue?.toFixed(2)}
                              </>
                            )}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">N/A</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(employee.active)}`}>
                          {employee.active ? 'Ativo' : 'Inativo'}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(employee)}
                            className="border-border text-foreground hover:bg-muted"
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(employee)}
                            className="border-destructive text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      Nenhum funcionário cadastrado ainda
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