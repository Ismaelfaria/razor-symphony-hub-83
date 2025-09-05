import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Gift } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoyaltyCardProps {
  loyaltyPoints: number;
  loyaltyEnabled: boolean;
  className?: string;
}

export default function LoyaltyCard({ loyaltyPoints, loyaltyEnabled, className }: LoyaltyCardProps) {
  const maxPoints = 8;
  const progress = (loyaltyPoints / maxPoints) * 100;
  const isComplete = loyaltyPoints >= maxPoints;

  if (!loyaltyEnabled) {
    return null;
  }

  return (
    <Card className={cn("bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-yellow-500/10 border-amber-500/20 shadow-lg", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-amber-200 text-lg">
            <div className="p-2 rounded-lg bg-amber-500/20">
              <Star className="h-5 w-5 text-amber-400" />
            </div>
            Programa Fidelidade
          </CardTitle>
          {isComplete && (
            <Badge className="bg-gradient-to-r from-amber-500 to-yellow-500 text-amber-950 font-bold animate-pulse">
              <Gift className="h-3 w-3 mr-1" />
              GRÁTIS!
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {/* Progress Text */}
          <div className="text-center">
            <p className="text-amber-200 text-sm">
              {isComplete ? (
                <span className="font-bold text-amber-400">
                  🎉 Você ganhou um corte grátis! 🎉
                </span>
              ) : (
                <>
                  <span className="font-bold text-amber-400">{loyaltyPoints}</span>
                  <span className="text-amber-300"> de </span>
                  <span className="font-bold text-amber-400">{maxPoints}</span>
                  <span className="text-amber-300"> cortes</span>
                </>
              )}
            </p>
            {!isComplete && (
              <p className="text-amber-300/70 text-xs mt-1">
                Faltam apenas {maxPoints - loyaltyPoints} corte{maxPoints - loyaltyPoints !== 1 ? 's' : ''} para seu prêmio!
              </p>
            )}
          </div>

          {/* Visual Progress - Circles */}
          <div className="flex justify-center gap-2 flex-wrap">
            {Array.from({ length: maxPoints }, (_, index) => {
              const isFilled = index < loyaltyPoints;
              return (
                <div
                  key={index}
                  className={cn(
                    "w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300",
                    isFilled
                      ? "bg-gradient-to-br from-amber-400 to-yellow-500 border-amber-400 shadow-lg shadow-amber-500/25 scale-110"
                      : "border-amber-500/30 bg-amber-500/5 hover:border-amber-500/50"
                  )}
                >
                  {isFilled && (
                    <Star className="h-4 w-4 text-amber-950 fill-current" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="w-full bg-amber-500/20 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-amber-400 to-yellow-500 h-2 rounded-full transition-all duration-500 shadow-sm"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-amber-300/70">
              <span>0</span>
              <span>{maxPoints} cortes</span>
            </div>
          </div>

          {/* Reward Description */}
          <div className="text-center p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
            <p className="text-amber-200 text-sm">
              {isComplete ? (
                "🎁 Seu próximo corte é por nossa conta!"
              ) : (
                "Complete a fidelidade e ganhe um corte grátis!"
              )}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}