"use client";

import { format } from "date-fns";
import { CalendarIcon, Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState, useEffect } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import LocationType from "@/types/LocationType";
import DateRangeType from "@/types/DateRangeType";
import { useRouter, useSearchParams } from "next/navigation";
import { SearchIcon } from "lucide-react";

interface FilterBarProps {
  selectedDateRange: DateRangeType;
  selectedLocation: string | undefined;
  selectedCategory: string | undefined;
  locations: LocationType[];
  categories: string[];
}

const FilterBar = ({
  selectedDateRange,
  selectedLocation,
  selectedCategory,
  locations,
  categories,
}: FilterBarProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<string | undefined>(
    selectedLocation || ""
  );
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    setValue(selectedLocation || "");
  }, [selectedLocation]);

  const scrollToEvents = () => {
    setTimeout(() => {
      const eventsSection = document.getElementById("events");
      if (eventsSection) {
        eventsSection.scrollIntoView({ behavior: "smooth" });
      }
    }, 100); // Petit délai pour s'assurer que le DOM est mis à jour
  };

  const updateSearchParams = (params: Record<string, string | null>) => {
    const newParams = new URLSearchParams(searchParams.toString());

    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
    });

    router.replace(`?${newParams.toString()}`, { scroll: false });
    scrollToEvents();
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    updateSearchParams({
      search: query || null,
    });
  };

  const handleDateChange = (range: { from?: Date; to?: Date } | undefined) => {
    const newRange = {
      start: range?.from || null,
      end: range?.to || null,
    };

    updateSearchParams({
      start: newRange.start ? format(newRange.start, "yyyy-MM-dd") : null,
      end: newRange.end ? format(newRange.end, "yyyy-MM-dd") : null,
    });
  };

  const handleLocationChange = (currentValue: string) => {
    const newValue = currentValue === value ? "" : currentValue;
    updateSearchParams({
      location: newValue || null,
    });
  };

  const handleCategoryChange = (value: string) => {
    updateSearchParams({
      category: value === "all" ? null : value,
    });
  };

  const resetFilters = () => {
    setSearchQuery("");
    setValue("");
    router.replace("/", { scroll: false });
    setTimeout(scrollToEvents, 100);
  };

  return (
    <div className="p-5 shadow-2xl mt-8 rounded-sm flex items-center gap-8 flex-wrap">
      {/* Barre de recherche */}
      <div className="relative w-full md:w-auto">
        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Rechercher des événements..."
          className="pl-10 pr-4 py-2 border rounded-md w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>

      {/* Sélecteur de date */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !selectedDateRange.start && "text-muted-foreground"
            )}
          >
            <CalendarIcon />
            {selectedDateRange.start !== null &&
            selectedDateRange.end !== null ? (
              <>
                {format(selectedDateRange.start, "LLL dd, y")} -{" "}
                {format(selectedDateRange.end, "LLL dd, y")}
              </>
            ) : (
              <span>Select a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={selectedDateRange?.start ?? new Date()}
            selected={{
              from: selectedDateRange.start ?? undefined,
              to: selectedDateRange.end ?? undefined,
            }}
            onSelect={handleDateChange}
            numberOfMonths={1}
          />
        </PopoverContent>
      </Popover>

      {/* Sélecteur de location */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[200px] justify-between overflow-hidden"
          >
            {value ? (
              locations.find((location) => location.value === value)?.label
            ) : (
              <span>Select location...</span>
            )}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput
              placeholder="Search location..."
              className="h-9 placeholder:font-medium"
            />
            <CommandList>
              <CommandEmpty>No location found.</CommandEmpty>
              <CommandGroup>
                {locations.map((location, index: number) => (
                  <CommandItem
                    key={index}
                    value={location.value}
                    onSelect={handleLocationChange}
                  >
                    {location.label}
                    <Check
                      className={cn(
                        "ml-auto",
                        value === location.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Sélecteur de catégorie */}
      <Select
        onValueChange={handleCategoryChange}
        value={selectedCategory || "all"}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select a category" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel className="font-semibold">Categories</SelectLabel>
            <SelectItem value="all">All categories</SelectItem>
            {categories.map((category: string) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      {/* Bouton de réinitialisation */}
      <Button
        variant="destructive"
        onClick={resetFilters}
        className="ml-auto cursor-pointer"
      >
        Reset Filters <X className="ml-2 w-4 h-4" />
      </Button>
    </div>
  );
};

export default FilterBar;
