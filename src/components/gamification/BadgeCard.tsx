import { Badge as BadgeIcon, Lock } from "lucide-react";
import { Badge } from "@/services/gamificationService";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

interface BadgeCardProps {
    badge: Badge;
}

export function BadgeCard({ badge }: BadgeCardProps) {
    const isLocked = !badge.awarded_at;

    return (
        <Card className={cn(
            "overflow-hidden transition-all duration-300 hover:scale-105",
            isLocked ? "opacity-60 grayscale" : "border-primary/50 shadow-md transform"
        )}>
            <CardContent className="p-4 flex flex-col items-center text-center space-y-2">
                <div className={cn(
                    "h-12 w-12 rounded-full flex items-center justify-center bg-muted",
                    !isLocked && "bg-primary/10 text-primary"
                )}>
                    {/* Dynamic Icon placeholder logic - for now using generic icons based on name/category or fallback */}
                    {isLocked ? <Lock className="h-6 w-6" /> : <BadgeIcon className="h-6 w-6" />}
                </div>

                <div>
                    <h3 className="font-semibold text-sm">{badge.name}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-2">{badge.description}</p>
                </div>

                {badge.awarded_at && (
                    <span className="text-[10px] text-muted-foreground pt-1">
                        Earned {new Date(badge.awarded_at).toLocaleDateString()}
                    </span>
                )}
            </CardContent>
        </Card>
    );
}
