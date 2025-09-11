"use client";

import { format } from "date-fns";
import { StudyBlock } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Clock,
  MoreVertical,
  Edit,
  Trash2,
  Mail,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface StudyBlockCardProps {
  block: StudyBlock;
  onEdit: (block: StudyBlock) => void;
  onDelete: (id: string) => void;
  showDate?: boolean;
}

export const StudyBlockCard = ({
  block,
  onEdit,
  onDelete,
  showDate = false,
}: StudyBlockCardProps) => {
  const startTime = new Date(block.startTime);
  const now = new Date();
  const isActive =
    now >= startTime &&
    now < new Date(startTime.getTime() + block.duration * 60 * 1000);
  const isPast =
    now >= new Date(startTime.getTime() + block.duration * 60 * 1000);
  const isFuture = now < startTime;

  const getStatusBadge = () => {
    if (isActive) {
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
          Active
        </Badge>
      );
    }
    if (isPast) {
      return <Badge variant="secondary">Completed</Badge>;
    }
    return <Badge variant="outline">Upcoming</Badge>;
  };

  const getStatusColor = () => {
    if (isActive) return "border-green-200 bg-green-50";
    if (isPast) return "border-gray-200 bg-gray-50";
    return "border-blue-200 bg-blue-50";
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (hours > 0) {
      return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    }
    return `${mins}m`;
  };

  const canEdit = isFuture;

  return (
    <Card
      className={cn(
        "transition-all hover:shadow-md animate-slide-up",
        getStatusColor()
      )}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-gray-900 truncate">
                {block.title}
              </h3>
              {getStatusBadge()}
              {block.emailReminderSent && (
                <Mail className="h-4 w-4 text-green-600" />
              )}
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {showDate
                  ? format(startTime, "MMM d, h:mm a")
                  : format(startTime, "h:mm a")}
              </div>
              <span className="text-xs bg-white px-2 py-1 rounded-full">
                {formatDuration(block.duration)}
              </span>
            </div>

            {block.description && (
              <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                {block.description}
              </p>
            )}
          </div>

          {canEdit && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(block)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onDelete(block.id)}
                  className="text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {!canEdit && isPast && (
            <div
              className="text-muted-foreground"
              title="Past sessions cannot be edited"
            >
              <AlertCircle className="h-4 w-4" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
