'use client';

import { deleteBoard } from "@/actions/delete-board";
import { Button } from "@/components/ui/button";
import { Popover, PopoverClose, PopoverTrigger } from "@/components/ui/popover";
import { useAction } from "@/hooks/use-action";
import { PopoverContent } from "@radix-ui/react-popover";
import { MoreHorizontal, X } from "lucide-react";
import { toast } from "sonner";

interface BoardOptionsProps {
  id: string;
};

export const BoardOptions = ({ id }: BoardOptionsProps) => {
  const { execute, isLoading } = useAction(deleteBoard, {
    onError: (error) => {
      toast.error(error);
    }
  })

  const onDelete = () => {
    execute({ id });
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="h-auto w-auto p-2" variant="transparent">
          <MoreHorizontal className="h-4 w-4"/>
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="px-20 rounded pt-3 pb-3 bg-white" 
        side="bottom" 
        align="start"
      >
        <div className="text-sm font-medium text-center text-neutral-600 pb-4 bg-white">
          Board actions
        </div>
        <PopoverClose asChild>
          <Button
            className="h-auto w-auto p-2 absolute top-2 right-2 text-neutral-600"
            variant="ghost"
          >
            <X className="h-4 w-4" />
          </Button>
        </PopoverClose>
        <Button
          variant="ghost"
          onClick={onDelete}
          disabled={isLoading}
          className="rouded-none w-full h-auto p-2 px-5 justify-start font-normal text-sm bg-white text-neutral-600"
        >
          Delete this board 
        </Button>
      </PopoverContent>
    </Popover>
  )
}