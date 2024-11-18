"use client";

import { ListWithCards } from "@/types";
import { ListForm } from "./list-form";
import { use, useEffect, useState } from "react";
import { ListItem } from "./list-item";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import { useAction } from "@/hooks/use-action";
import { updateListOrder } from "@/actions/update-list-order";
import { toast } from "sonner";
import { updateCardOrder } from "@/actions/update-card-order";

interface ListContainerProps {
  data: ListWithCards[];
  boardId: string;
}

function reorder<T>(list: T[], startIndex: number, endIndex: number) {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

export const ListContainer = ({
  data,
  boardId,
}: ListContainerProps) => {
  const [orderData, setOrderData] = useState(data);

  const { execute: executeUpdateListOrder } = useAction(updateListOrder, {
    onSuccess: () => {
      toast.success("List order updated");
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const { execute: executeUpdateCardOrder } = useAction(updateCardOrder, {
    onSuccess: () => {
      toast.success("Card order updated");
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  useEffect(() => {
    setOrderData(data);
  }, [data]);

  const onDragEnd = (result: any) => {
    const { source, destination, type } = result;
    if (!destination) {
      return;
    }

    //if dropped in the same position
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    // user moves a list
    if (result.type === "list") {
      const items = reorder(
        orderData, source.index, destination.index
      ).map((item, index) => ({ ...item, order: index }));

      setOrderData(items);
      executeUpdateListOrder({ boardId, items });
    }

    // user moves a card
    if (type === "card") {
      let newOrderData = [...orderData];

      // find the source and destination lists
      const sourceList = newOrderData.find(
        list => list.id === source.droppableId
      );
      const destinationList = newOrderData.find(
        list => list.id === destination.droppableId
      );

      if (!sourceList || !destinationList) {
        return;
      }

      //Check if cards exists on the source llist
      if (!sourceList.cards) {
        sourceList.cards = [];
      }

      //Check if cards exists on the destination list
      if (!destinationList.cards) {
        destinationList.cards = [];
      }

      //Move the card in the same list
      if (source.droppableId === destination.droppableId) {
        const newCards = reorder(
          sourceList.cards, source.index, destination.index
        );

        newCards.forEach((card, index) => {
          card.order = index;
        });

        sourceList.cards = newCards;

        setOrderData(newOrderData);
        executeUpdateCardOrder({ boardId, items: newCards });

        //Move the card to another list
      } else {
        //Remove the card from the source list
        const [movedCard] = sourceList.cards.splice(source.index, 1);

        //Add the card to the destination list
        movedCard.listId = destinationList.id;

        //Add the card to the destination list
        destinationList.cards.splice(destination.index, 0, movedCard);

        //Update the order of the cards
        sourceList.cards.forEach((card, index) => {
          card.order = index;
        });

        destinationList.cards.forEach((card, index) => {
          card.order = index;
        });

        setOrderData(newOrderData);
        executeUpdateCardOrder({ boardId, items: destinationList.cards });
      }
    }
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="lists" type="list" direction="horizontal">
        {(provided) => (
          <ol 
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="flex gap-x-3 h-full"
          >
            {orderData.map((list, index) => (
              <ListItem key={list.id} data={list} index={index} />
            ))}
            {provided.placeholder}
            <ListForm />
            <div className="flex-shrink-0 w-1" />
          </ol>
        )}
      </Droppable>
    </DragDropContext>
  );
}