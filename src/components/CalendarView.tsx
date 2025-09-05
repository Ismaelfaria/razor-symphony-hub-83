import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar, 
  Clock, 
  User, 
  Scissors,
  CalendarDays,
  Grid3X3,
  MoreHorizontal,
  Plus
} from 'lucide-react';
import { useData } from '@/hooks/useData';
import { 
  format, 
  addDays, 
  addWeeks,
  addMonths,
  startOfWeek, 
  endOfWeek, 
  startOfMonth,
  endOfMonth,
  startOfDay,
  endOfDay,
  isSameDay, 
  isSameMonth,
  parseISO,
  getDaysInMonth,
  getDay
} from 'date-fns';
import { cn } from '@/lib/utils';

interface CalendarViewProps {
  employeeId?: string;
}

type ViewType = 'day' | 'week' | 'month';

export default function CalendarView({ employeeId }: CalendarViewProps) {
  const { appointments, clients, services, employees, getClientById, getServiceById, getEmployeeById } = useData();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewType, setViewType] = useState<ViewType>('week');

  const timeSlots = useMemo(() => {
    const slots = [];
    for (let hour = 8; hour < 18; hour++) {
      for (let min = 0; min < 60; min += 30) {
        const timeStr = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
        slots.push(timeStr);
      }
    }
    return slots;
  }, []);

  // Get date range based on view type
  const getDateRange = useMemo(() => {
    switch (viewType) {
      case 'day':
        return {
          start: startOfDay(currentDate),
          end: endOfDay(currentDate)
        };
      case 'week':
        return {
          start: startOfWeek(currentDate, { weekStartsOn: 1 }),
          end: endOfWeek(currentDate, { weekStartsOn: 1 })
        };
      case 'month':
        return {
          start: startOfMonth(currentDate),
          end: endOfMonth(currentDate)
        };
      default:
        return {
          start: startOfDay(currentDate),
          end: endOfDay(currentDate)
        };
    }
  }, [viewType, currentDate]);

  // Always calculate week days to avoid conditional hooks
  const weekDays = useMemo(() => {
    const start = startOfWeek(currentDate, { weekStartsOn: 1 });
    const days = [];
    for (let i = 0; i < 7; i++) {
      days.push(addDays(start, i));
    }
    return days;
  }, [currentDate]);

  const { start: rangeStart, end: rangeEnd } = getDateRange;

  const filteredAppointments = useMemo(() => {
    return appointments.filter(appointment => {
      const appointmentDate = parseISO(appointment.date);
      const isInRange = appointmentDate >= rangeStart && appointmentDate <= rangeEnd;
      const isForEmployee = !employeeId || appointment.employeeId === employeeId;
      return isInRange && isForEmployee && appointment.status !== 'cancelado';
    });
  }, [appointments, rangeStart, rangeEnd, employeeId]);

  const getAppointmentsForDayAndTime = (day: Date, time: string) => {
    return filteredAppointments.filter(appointment => 
      isSameDay(parseISO(appointment.date), day) && appointment.time === time
    );
  };

  const getAppointmentsForDay = (day: Date) => {
    return filteredAppointments.filter(appointment => 
      isSameDay(parseISO(appointment.date), day)
    );
  };

  const navigate = (direction: 'prev' | 'next' | 'today') => {
    if (direction === 'today') {
      setCurrentDate(new Date());
      return;
    }

    const increment = direction === 'next' ? 1 : -1;
    
    switch (viewType) {
      case 'day':
        setCurrentDate(prev => addDays(prev, increment));
        break;
      case 'week':
        setCurrentDate(prev => addWeeks(prev, increment));
        break;
      case 'month':
        setCurrentDate(prev => addMonths(prev, increment));
        break;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'agendado':
        return 'bg-primary/20 text-primary border-primary/30';
      case 'concluído':
        return 'bg-green-500/20 text-green-400 border-green-400/30';
      case 'cancelado':
        return 'bg-destructive/20 text-destructive border-destructive/30';
      default:
        return 'bg-muted/20 text-muted-foreground border-muted/30';
    }
  };

  const getViewTitle = () => {
    switch (viewType) {
      case 'day':
        return 'Visão do Dia';
      case 'week':
        return 'Visão da Semana';
      case 'month':
        return 'Visão do Mês';
      default:
        return 'Agenda';
    }
  };

  const getDateRangeText = () => {
    switch (viewType) {
      case 'day':
        return format(currentDate, 'dd/MM/yyyy');
      case 'week':
        return `${format(rangeStart, 'dd/MM')} - ${format(rangeEnd, 'dd/MM/yyyy')}`;
      case 'month':
        return format(currentDate, 'MMMM yyyy');
      default:
        return '';
    }
  };

  // Render functions for each view type
  const renderContent = () => {
    if (viewType === 'day') {
      const dayAppointments = getAppointmentsForDay(currentDate);
      const isToday = isSameDay(currentDate, new Date());
      
      return (
        <div className="space-y-4">
          <div className="flex items-center justify-between py-4 border-b border-border">
            <div>
              <h3 className="text-2xl sm:text-3xl font-bold text-foreground">
                {format(currentDate, 'dd')}
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground capitalize">
                {format(currentDate, 'EEEE, MMMM yyyy')}
                {isToday && <span className="ml-2 text-primary font-medium">Hoje</span>}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs sm:text-sm text-muted-foreground">
                {dayAppointments.length} agendamento{dayAppointments.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          
          {/* Mobile day view */}
          <div className="block sm:hidden space-y-3">
            {timeSlots.map((time) => {
              const timeAppointments = getAppointmentsForDayAndTime(currentDate, time);
              
              if (timeAppointments.length === 0) return null;
              
              return (
                <div key={time} className="bg-gradient-to-br from-dark-card/80 to-dark-card/60 border border-dark-border rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-3 pb-2 border-b border-dark-border/30">
                    <Clock className="h-4 w-4 text-primary" />
                    <span className="text-sm font-semibold text-primary">{time}</span>
                  </div>
                  
                  <div className="space-y-2">
                    {timeAppointments.map((appointment, index) => {
                      const client = getClientById(appointment.clientId);
                      const service = getServiceById(appointment.serviceId);
                      const employee = getEmployeeById(appointment.employeeId);
                      
                      return (
                        <div
                          key={appointment.id}
                          className={cn(
                            "p-3 rounded-lg border-l-4 bg-gradient-to-r shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group",
                            appointment.status === 'agendado' 
                              ? "border-l-primary bg-primary/5 hover:bg-primary/10" 
                              : appointment.status === 'concluído'
                              ? "border-l-green-500 bg-green-500/5 hover:bg-green-500/10"
                              : "border-l-red-500 bg-red-500/5 hover:bg-red-500/10"
                          )}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors truncate text-sm">
                                {client?.name}
                              </h4>
                              <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                                <Scissors className="h-3 w-3 flex-shrink-0" />
                                <span className="truncate">{service?.name}</span>
                              </div>
                              {!employeeId && (
                                <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                                  <User className="h-3 w-3 flex-shrink-0" />
                                  <span className="truncate">{employee?.name}</span>
                                </div>
                              )}
                            </div>
                            <div className={cn(
                              "px-2 py-1 rounded text-xs font-medium uppercase",
                              appointment.status === 'agendado' ? "bg-primary/20 text-primary" :
                              appointment.status === 'concluído' ? "bg-green-500/20 text-green-600" :
                              "bg-red-500/20 text-red-600"
                            )}>
                              {appointment.status}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Desktop day view */}
          <div className="hidden sm:block">
            <div className="grid grid-cols-[80px_1fr] gap-0">
              {timeSlots.map((time) => {
                const timeAppointments = getAppointmentsForDayAndTime(currentDate, time);
                
                return (
                  <div key={time} className="contents">
                    <div className="py-4 pr-4 text-right border-r border-border/50">
                      <span className="text-xs text-muted-foreground font-medium">
                        {time}
                      </span>
                    </div>
                    
                    <div className="py-2 pl-4 border-b border-border/20 min-h-[60px] relative">
                      {timeAppointments.length > 0 ? (
                        timeAppointments.map((appointment, index) => {
                          const client = getClientById(appointment.clientId);
                          const service = getServiceById(appointment.serviceId);
                          const employee = getEmployeeById(appointment.employeeId);
                          
                          return (
                            <div
                              key={appointment.id}
                              className={cn(
                                "mb-2 p-3 rounded-lg border-l-4 bg-gradient-to-r shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group",
                                appointment.status === 'agendado' 
                                  ? "border-l-primary bg-primary/5 hover:bg-primary/10" 
                                  : appointment.status === 'concluído'
                                  ? "border-l-green-500 bg-green-500/5 hover:bg-green-500/10"
                                  : "border-l-red-500 bg-red-500/5 hover:bg-red-500/10"
                              )}
                              style={{ marginLeft: index * 8 }}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                                    {client?.name}
                                  </h4>
                                  <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                                    <Scissors className="h-3 w-3" />
                                    <span>{service?.name}</span>
                                  </div>
                                  {!employeeId && (
                                    <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                                      <User className="h-3 w-3" />
                                      <span>{employee?.name}</span>
                                    </div>
                                  )}
                                </div>
                                <div className={cn(
                                  "px-2 py-1 rounded text-xs font-medium uppercase",
                                  appointment.status === 'agendado' ? "bg-primary/20 text-primary" :
                                  appointment.status === 'concluído' ? "bg-green-500/20 text-green-600" :
                                  "bg-red-500/20 text-red-600"
                                )}>
                                  {appointment.status}
                                </div>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="flex items-center h-full text-muted-foreground/50 text-sm italic">
                          Horário livre
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          {dayAppointments.length === 0 && (
            <div className="text-center py-8 sm:py-12">
              <Calendar className="h-8 w-8 sm:h-12 sm:w-12 text-muted-foreground/50 mx-auto mb-4" />
              <p className="text-muted-foreground text-sm sm:text-base">
                Nenhum agendamento para este dia
              </p>
            </div>
          )}
        </div>
      );
    }

    if (viewType === 'month') {
      const daysInMonth = getDaysInMonth(currentDate);
      const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const startDay = getDay(firstDayOfMonth) === 0 ? 6 : getDay(firstDayOfMonth) - 1;

      const days = [];
      
      for (let i = 0; i < startDay; i++) {
        days.push(null);
      }
      
      for (let day = 1; day <= daysInMonth; day++) {
        days.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
      }

      const monthAppointments = filteredAppointments.filter(appointment => 
        isSameMonth(parseISO(appointment.date), currentDate)
      );

      return (
        <div className="space-y-4">
          <div className="flex items-center justify-between py-4 border-b border-border">
            <div>
              <h3 className="text-3xl font-bold text-foreground capitalize">
                {format(currentDate, 'MMMM yyyy')}
              </h3>
              <p className="text-sm text-muted-foreground">
                {monthAppointments.length} agendamento{monthAppointments.length !== 1 ? 's' : ''} este mês
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-7 gap-0 border-b border-border/50">
            {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day, index) => (
              <div key={day} className="h-12 flex items-center justify-center text-sm font-semibold text-muted-foreground border-r border-border/30 last:border-r-0">
                {day}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-0 border border-border/30 rounded-lg overflow-hidden">
            {days.map((day, index) => {
              if (!day) {
                return (
                  <div 
                    key={index} 
                    className="h-32 bg-muted/5 border-r border-b border-border/20 last:border-r-0"
                  ></div>
                );
              }
              
              const dayAppointments = getAppointmentsForDay(day);
              const isToday = isSameDay(day, new Date());
              const isCurrentMonth = isSameMonth(day, currentDate);
              
              return (
                <div 
                  key={index}
                  className={cn(
                    "h-32 p-2 border-r border-b border-border/20 last:border-r-0 transition-all duration-200 overflow-hidden hover:bg-muted/10 cursor-pointer group relative",
                    !isCurrentMonth && "bg-muted/5 opacity-50"
                  )}
                >
                  <div className={cn(
                    "text-sm font-medium mb-2 flex items-center justify-between",
                    isToday 
                      ? "text-white" 
                      : isCurrentMonth 
                      ? "text-foreground" 
                      : "text-muted-foreground"
                  )}>
                    <span className={cn(
                      "flex items-center justify-center w-6 h-6 rounded-full transition-all",
                      isToday && "bg-primary text-white font-bold shadow-sm"
                    )}>
                      {format(day, 'd')}
                    </span>
                    {dayAppointments.length > 0 && (
                      <span className="text-xs text-muted-foreground bg-muted/30 px-1 rounded">
                        {dayAppointments.length}
                      </span>
                    )}
                  </div>
                  
                  <div className="space-y-1">
                    {dayAppointments.slice(0, 3).map((appointment) => {
                      const client = getClientById(appointment.clientId);
                      const service = getServiceById(appointment.serviceId);
                      
                      return (
                        <div
                          key={appointment.id}
                          className={cn(
                            "text-xs p-1.5 rounded-md border-l-2 bg-gradient-to-r cursor-pointer hover:shadow-sm transition-all duration-200 group/item",
                            appointment.status === 'agendado' 
                              ? "border-l-primary bg-primary/5 hover:bg-primary/10" 
                              : appointment.status === 'concluído'
                              ? "border-l-green-500 bg-green-500/5 hover:bg-green-500/10"
                              : "border-l-red-500 bg-red-500/5 hover:bg-red-500/10"
                          )}
                          title={`${appointment.time} - ${client?.name} - ${service?.name}`}
                        >
                          <div className="font-medium text-foreground group-hover/item:text-primary transition-colors truncate">
                            {appointment.time}
                          </div>
                          <div className="opacity-80 truncate text-muted-foreground">
                            {client?.name}
                          </div>
                        </div>
                      );
                    })}
                    
                    {dayAppointments.length > 3 && (
                      <div className="text-xs text-muted-foreground bg-muted/20 p-1 rounded border border-muted/30 text-center">
                        +{dayAppointments.length - 3} mais
                      </div>
                    )}
                  </div>
                  
                  {dayAppointments.length === 0 && isCurrentMonth && (
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-20 transition-opacity">
                      <Plus className="h-4 w-4 text-muted-foreground" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          {monthAppointments.length === 0 && (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
              <p className="text-muted-foreground">
                Nenhum agendamento para este mês
              </p>
            </div>
          )}
        </div>
      );
    }

    // Default to week view
    const start = startOfWeek(currentDate, { weekStartsOn: 1 });

    return (
      <div className="space-y-4">
        {/* Mobile week view - simplified */}
        <div className="block sm:hidden">
          <div className="space-y-3">
            {weekDays.map((day, dayIndex) => {
              const dayAppointments = getAppointmentsForDay(day);
              const isToday = isSameDay(day, new Date());
              
              return (
                <div key={dayIndex} className="bg-gradient-to-br from-dark-card/80 to-dark-card/60 border border-dark-border rounded-lg p-3">
                  <div className={cn(
                    "flex items-center justify-between mb-3 pb-2 border-b border-dark-border/30",
                    isToday && "border-primary/30"
                  )}>
                    <div>
                      <h4 className={cn(
                        "font-semibold capitalize",
                        isToday ? "text-primary" : "text-foreground"
                      )}>
                        {format(day, 'EEEE')}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {format(day, 'dd/MM')}
                        {isToday && <span className="ml-2 text-primary font-medium">Hoje</span>}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-muted-foreground">
                        {dayAppointments.length} agendamento{dayAppointments.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    {dayAppointments.length > 0 ? (
                      dayAppointments.map((appointment) => {
                        const client = getClientById(appointment.clientId);
                        const service = getServiceById(appointment.serviceId);
                        const employee = getEmployeeById(appointment.employeeId);
                        
                        return (
                          <div
                            key={appointment.id}
                            className={cn(
                              "p-2 rounded-lg border-l-3 bg-gradient-to-r shadow-sm transition-all duration-200 cursor-pointer group",
                              appointment.status === 'agendado' 
                                ? "border-l-primary bg-primary/5 hover:bg-primary/10" 
                                : appointment.status === 'concluído'
                                ? "border-l-green-500 bg-green-500/5 hover:bg-green-500/10"
                                : "border-l-red-500 bg-red-500/5 hover:bg-red-500/10"
                            )}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <Clock className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                                  <span className="text-xs text-primary font-medium">{appointment.time}</span>
                                </div>
                                <h5 className="font-semibold text-foreground text-sm group-hover:text-primary transition-colors truncate">
                                  {client?.name}
                                </h5>
                                <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                                  <Scissors className="h-3 w-3 flex-shrink-0" />
                                  <span className="truncate">{service?.name}</span>
                                </div>
                                {!employeeId && (
                                  <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                                    <User className="h-3 w-3 flex-shrink-0" />
                                    <span className="truncate">{employee?.name}</span>
                                  </div>
                                )}
                              </div>
                              <div className={cn(
                                "px-2 py-1 rounded text-xs font-medium uppercase tracking-wide",
                                appointment.status === 'agendado' ? "bg-primary/20 text-primary" :
                                appointment.status === 'concluído' ? "bg-green-500/20 text-green-600" :
                                "bg-red-500/20 text-red-600"
                              )}>
                                {appointment.status}
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center py-4 text-muted-foreground/50 text-sm italic">
                        Nenhum agendamento
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Desktop week view - grid layout */}
        <div className="hidden sm:block overflow-x-auto">
          <div className="min-w-[800px]">
            <div className="grid grid-cols-8 gap-1 mb-4">
              <div className="h-12 flex items-center justify-center text-sm font-medium text-muted-foreground">
                Horário
              </div>
              {weekDays.map((day, index) => (
                <div 
                  key={index} 
                  className={cn(
                    "h-12 flex flex-col items-center justify-center text-sm font-medium rounded-lg border transition-colors",
                    isSameDay(day, new Date()) 
                      ? "bg-primary/10 text-primary border-primary/30" 
                      : "text-muted-foreground border-border"
                  )}
                >
                  <div className="capitalize">
                    {format(day, 'EEE')}
                  </div>
                  <div className="text-xs opacity-70">
                    {format(day, 'dd/MM')}
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-1">
              {timeSlots.map((time) => (
                <div key={time} className="grid grid-cols-8 gap-1">
                  <div className="h-14 flex items-center justify-center text-xs font-medium text-muted-foreground border border-dark-border/50 rounded-lg bg-muted/30">
                    {time}
                  </div>
                  
                  {weekDays.map((day, dayIndex) => {
                    const dayAppointments = getAppointmentsForDayAndTime(day, time);
                    
                    return (
                      <div 
                        key={dayIndex} 
                        className="h-14 border border-dark-border/50 rounded-lg bg-gradient-to-br from-dark-card/40 to-dark-card/20 p-1 overflow-hidden hover:from-dark-card/50 hover:to-dark-card/30 transition-all"
                      >
                        {dayAppointments.map((appointment) => {
                          const client = getClientById(appointment.clientId);
                          const service = getServiceById(appointment.serviceId);
                          const employee = getEmployeeById(appointment.employeeId);
                          
                          return (
                            <div
                              key={appointment.id}
                              className={cn(
                                "w-full h-full rounded-md border p-1 text-xs cursor-pointer hover:scale-105 transition-all duration-200 shadow-sm",
                                getStatusColor(appointment.status)
                              )}
                              title={`${client?.name} - ${service?.name} - ${employee?.name}`}
                            >
                              <div className="flex flex-col gap-1 h-full">
                                <div className="font-medium truncate text-[10px] leading-tight">
                                  {client?.name}
                                </div>
                                <div className="flex items-center gap-1 text-[9px] opacity-80">
                                  <Scissors className="h-2 w-2" />
                                  <span className="truncate">{service?.name}</span>
                                </div>
                                {!employeeId && (
                                  <div className="flex items-center gap-1 text-[9px] opacity-70">
                                    <User className="h-2 w-2" />
                                    <span className="truncate">{employee?.name}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Card className="bg-gradient-to-br from-dark-card via-dark-card to-dark-card/90 border-dark-border shadow-dark">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          <CardTitle className="flex items-center gap-3 text-foreground text-lg sm:text-xl">
            <div className="p-2 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10">
              <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            </div>
            <span className="hidden sm:inline">{getViewTitle()}</span>
            <span className="sm:hidden">Agenda</span>
          </CardTitle>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
            <Tabs value={viewType} onValueChange={(value) => setViewType(value as ViewType)} className="w-full sm:w-auto">
              <TabsList className="grid w-full grid-cols-3 sm:w-auto bg-muted/20 h-9 sm:h-10">
                <TabsTrigger value="day" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                  <CalendarDays className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">Dia</span>
                  <span className="sm:hidden">D</span>
                </TabsTrigger>
                <TabsTrigger value="week" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                  <MoreHorizontal className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">Semana</span>
                  <span className="sm:hidden">S</span>
                </TabsTrigger>
                <TabsTrigger value="month" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                  <Grid3X3 className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">Mês</span>
                  <span className="sm:hidden">M</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
            
            <div className="flex items-center gap-1 sm:gap-2 w-full sm:w-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('prev')}
                className="border-dark-border text-foreground hover:bg-muted/50 transition-colors flex-1 sm:flex-none h-9 px-2 sm:px-3"
              >
                <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('today')}
                className="border-dark-border text-foreground hover:bg-muted/50 px-2 sm:px-4 text-xs sm:text-sm transition-colors flex-1 sm:flex-none h-9"
              >
                Hoje
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('next')}
                className="border-dark-border text-foreground hover:bg-muted/50 transition-colors flex-1 sm:flex-none h-9 px-2 sm:px-3"
              >
                <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </div>
          </div>
        </div>
        
        <div className="text-center">
          <p className="text-muted-foreground text-sm sm:text-lg font-medium">
            {getDateRangeText()}
          </p>
        </div>
      </CardHeader>
      
      <CardContent>
        {renderContent()}
        
        <div className="mt-6 flex flex-wrap gap-4 pt-4 border-t border-border">
          <div className="flex items-center gap-2">
            <Badge className="bg-primary/20 text-primary border-primary/30">
              Agendado
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-green-500/20 text-green-400 border-green-400/30">
              Concluído
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-destructive/20 text-destructive border-destructive/30">
              Cancelado
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}