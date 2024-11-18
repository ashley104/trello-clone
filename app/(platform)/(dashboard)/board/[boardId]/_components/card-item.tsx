"use client";

interface CardItemProps {
  data: any;
  index: number;
}

export const CardItem = ({
  data,
  index,
}: CardItemProps) => {
  return (
    <div 
      role="button"
      className="truncate border-2 border-transparent hover:border-bleck py-2 px-3 text-sm bg-white rounded-md shadow-sm"
    >
      {data.title}
    </div>
  );
};