import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Calendar, Clock, User, Scissors } from 'lucide-react';
import { useData } from '@/hooks/useData';
import { format, addDays, startOfWeek, endOfWeek, isSameDay, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';

interface WeeklyCalendarProps {
  employeeId?: string;
}

export default function WeeklyCalendar({ employeeId }: WeeklyCalendarProps) {
  const { appointments, clients, services, employees, getClientById, getServiceById, getEmployeeById } = useData();
  const [currentWeek, setCurrentWeek] = useState(new Date());

  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 }); // Monday
  const weekEnd = endOfWeek(currentWeek, { weekStartsOn: 1 }); // Sunday

  const weekDays = useMemo(() => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      days.push(addDays(weekStart, i));
    }
    return days;
  }, [weekStart]);

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

  const filteredAppointments = useMemo(() => {
    return appointments.filter(appointment => {
      const appointmentDate = parseISO(appointment.date);
      const isInWeek = appointmentDate >= weekStart && appointmentDate <= weekEnd;
      const isForEmployee = !employeeId || appointment.employeeId === employeeId;
      return isInWeek && isForEmployee && appointment.status !== 'cancelado';
    });
  }, [appointments, weekStart, weekEnd, employeeId]);

  const getAppointmentsForDayAndTime = (day: Date, time: string) => {
    return filteredAppointments.filter(appointment => 
      isSameDay(parseISO(appointment.date), day) && appointment.time === time
    );
  };

  const goToPreviousWeek = () => {
    setCurrentWeek(prev => addDays(prev, -7));
  };

  const goToNextWeek = () => {
    setCurrentWeek(prev => addDays(prev, 7));
  };

  const goToCurrentWeek = () => {
    setCurrentWeek(new Date());
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'agendado':
        return 'bg-blue-500/20 text-blue-400 border-blue-400/30';
      case 'concluído':
        return 'bg-green-500/20 text-green-400 border-green-400/30';
      case 'cancelado':
        return 'bg-red-500/20 text-red-400 border-red-400/30';
      default:
        return 'bg-muted/20 text-muted-foreground border-muted/30';
    }
  };

  return (
    <Card className="bg-gradient-to-br from-dark-card via-dark-card to-dark-card/80 border-dark-border shadow-dark">
      <CardHeader className="pb-3 sm:pb-4 p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 sm:gap-3 text-foreground text-lg sm:text-xl">
            <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-gradient-to-br from-primary/20 to-primary/10">
              <Calendar className="h-4 w-4 sm:h-6 sm:w-6 text-primary" />
            </div>
            <span className="hidden sm:inline">Agenda da Semana</span>
            <span className="sm:hidden">Agenda</span>
          </CardTitle>
          
          <div className="flex items-center gap-1 sm:gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={goToPreviousWeek}
              className="border-dark-border text-foreground hover:bg-muted/30 h-8 w-8 sm:h-9 sm:w-9 p-0"
            >
              <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={goToCurrentWeek}
              className="border-dark-border text-foreground hover:bg-muted/30 h-8 px-2 sm:h-9 sm:px-4 text-xs sm:text-sm"
            >
              Hoje
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={goToNextWeek}
              className="border-dark-border text-foreground hover:bg-muted/30 h-8 w-8 sm:h-9 sm:w-9 p-0"
            >
              <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </div>
        </div>
        
        <div className="text-center">
          <p className="text-muted-foreground text-sm sm:text-lg font-medium">
            {format(weekStart, 'dd/MM')} - {format(weekEnd, 'dd/MM/yyyy')}
          </p>
        </div>
      </CardHeader>
      
      <CardContent className="p-2 sm:p-6">
        <div className="overflow-x-auto">
          <div className="min-w-[320px] sm:min-w-[800px]">
            {/* Header with days */}
            <div className="grid grid-cols-8 gap-0.5 sm:gap-1 mb-2 sm:mb-4">
              <div className="h-8 sm:h-12 flex items-center justify-center text-xs sm:text-sm font-medium text-muted-foreground">
                <span className="hidden sm:inline">Horário</span>
                <span className="sm:hidden">Hora</span>
              </div>
              {weekDays.map((day, index) => (
                <div 
                  key={index} 
                  className={cn(
                    "h-8 sm:h-12 flex flex-col items-center justify-center text-xs sm:text-sm font-medium rounded-md sm:rounded-lg border transition-colors",
                    isSameDay(day, new Date()) 
                      ? "bg-primary/10 text-primary border-primary/30" 
                      : "text-muted-foreground border-dark-border"
                  )}
                >
                  <div className="capitalize">
                    <span className="hidden sm:inline">{format(day, 'EEE')}</span>
                    <span className="sm:hidden">{format(day, 'EE')}</span>
                  </div>
                  <div className="text-[10px] sm:text-xs opacity-70">
                    {format(day, 'dd/MM')}
                  </div>
                </div>
              ))}
            </div>

            {/* Time slots and appointments */}
            <div className="space-y-0.5 sm:space-y-1">
              {timeSlots.map((time) => (
                <div key={time} className="grid grid-cols-8 gap-0.5 sm:gap-1">
                  {/* Time column */}
                  <div className="h-10 sm:h-14 flex items-center justify-center text-[10px] sm:text-xs font-medium text-muted-foreground border border-dark-border/50 rounded-md sm:rounded-lg bg-muted/20">
                    {time}
                  </div>
                  
                  {/* Day columns */}
                  {weekDays.map((day, dayIndex) => {
                    const dayAppointments = getAppointmentsForDayAndTime(day, time);
                    
                    return (
                      <div 
                        key={dayIndex} 
                        className="h-10 sm:h-14 border border-dark-border/50 rounded-md sm:rounded-lg bg-gradient-to-br from-card/30 to-card/10 p-0.5 sm:p-1 overflow-hidden"
                      >
                        {dayAppointments.map((appointment) => {
                          const client = getClientById(appointment.clientId);
                          const service = getServiceById(appointment.serviceId);
                          const employee = getEmployeeById(appointment.employeeId);
                          
                          return (
                            <div
                              key={appointment.id}
                              className={cn(
                                "w-full h-full rounded-sm sm:rounded-md border p-0.5 sm:p-1 text-xs cursor-pointer hover:scale-105 transition-all duration-200 shadow-sm",
                                getStatusColor(appointment.status)
                              )}
                              title={`${client?.name} - ${service?.name} - ${employee?.name}`}
                            >
                              <div className="flex flex-col gap-0.5 sm:gap-1 h-full">
                                <div className="font-medium truncate text-[8px] sm:text-[10px] leading-tight">
                                  {client?.name}
                                </div>
                                <div className="flex items-center gap-0.5 sm:gap-1 text-[7px] sm:text-[9px] opacity-80">
                                  <Scissors className="h-1.5 w-1.5 sm:h-2 sm:w-2" />
                                  <span className="truncate">{service?.name}</span>
                                </div>
                                {!employeeId && (
                                  <div className="flex items-center gap-0.5 sm:gap-1 text-[7px] sm:text-[9px] opacity-70">
                                    <User className="h-1.5 w-1.5 sm:h-2 sm:w-2" />
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
        
        {/* Legend */}
        <div className="mt-4 sm:mt-6 flex flex-wrap gap-2 sm:gap-4 pt-3 sm:pt-4 border-t border-dark-border">
          <div className="flex items-center gap-1 sm:gap-2">
            <Badge className="bg-blue-500/20 text-blue-400 border-blue-400/30 text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5">
              Agendado
            </Badge>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <Badge className="bg-green-500/20 text-green-400 border-green-400/30 text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5">
              Concluído
            </Badge>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <Badge className="bg-red-500/20 text-red-400 border-red-400/30 text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5">
              Cancelado
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}