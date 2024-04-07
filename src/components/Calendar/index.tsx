import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { cn } from "../../lib/utils";

interface CalendarProps {
  onClickDate?: (date: Date) => void;
  dateSelected?: Date;
}
export const Calendar = ({ onClickDate, dateSelected }: CalendarProps) => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  const daysInMonth = (date: Date): number => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const firstDayOfMonth = (date: Date): number => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const prevMonth = (): void => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const nextMonth = (): void => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const compareDates = (date1: Date, date2: Date) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  const renderCalendar = (): JSX.Element[] => {
    const totalDays = daysInMonth(currentDate);
    const startingDay = firstDayOfMonth(currentDate);
    const today = new Date().getDate();

    const calendar: JSX.Element[] = [];

    for (let i = 0; i < startingDay; i++) {
      calendar.push(<div key={`empty-${i}`}></div>);
    }

    for (let i = 1; i <= totalDays; i++) {
      const itemDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        i
      );

      if (dateSelected) {
        console.log(compareDates(dateSelected, itemDate));
      }

      const isCurrentDay =
        i === today &&
        currentDate.getMonth() === new Date().getMonth() &&
        currentDate.getFullYear() === new Date().getFullYear();

      calendar.push(
        <div
          key={i}
          onClick={() =>
            onClickDate &&
            onClickDate(
              new Date(currentDate.getFullYear(), currentDate.getMonth(), i)
            )
          }
          title={isCurrentDay ? "Hoje" : ""}
          className={cn(
            "text-center rounded-sm text-gray-100 cursor-pointer hover:bg-green-800",
            isCurrentDay ? "bg-primary bg-opacity-10 underline" : "",
            dateSelected && compareDates(dateSelected, itemDate)
              ? "bg-primary"
              : ""
          )}
        >
          <div className="mt-1">{i}</div>
          <div className="rounded-full w-1 h-1 mx-auto "></div>
        </div>
      );
    }

    return calendar;
  };

  return (
    <div className="calendar p-2 rounded-md">
      <div className="flex justify-between items-center mb-4">
        <button
          className="px-2 py-1 text-gray-500 rounded hover:border-gray-100"
          onClick={prevMonth}
        >
          <ChevronLeft />
        </button>
        <h2 className="text-xl font-bold">
          {currentDate.toLocaleDateString("default", {
            month: "long",
            year: "numeric",
          })}
        </h2>
        <button
          className="px-2 py-1 text-gray-500 rounded hover:border-gray-100"
          onClick={nextMonth}
        >
          <ChevronRight />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-2 text-gray-600 text-sm font-semibold">
        <div className="text-center uppercase">Dom</div>
        <div className="text-center uppercase">Seg</div>
        <div className="text-center uppercase">Ter</div>
        <div className="text-center uppercase">Qua</div>
        <div className="text-center uppercase">Qui</div>
        <div className="text-center uppercase">Sex</div>
        <div className="text-center uppercase">Sáb</div>
        {renderCalendar()}
      </div>
    </div>
  );
};
