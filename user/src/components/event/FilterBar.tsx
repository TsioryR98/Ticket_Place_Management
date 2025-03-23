    "use client"

    import { format } from "date-fns"
    import { CalendarIcon, Check, ChevronsUpDown, X } from "lucide-react"
    import { cn } from "@/lib/utils"
    import { Button } from "../ui/button"
    import { Calendar } from "../ui/calendar"
    import { Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
    import { useState } from "react"
    import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList} from "@/components/ui/command"
    import {
        Select,
        SelectContent,
        SelectGroup,
        SelectItem,
        SelectLabel,
        SelectTrigger,
        SelectValue,
    } from "@/components/ui/select"
    import LocationType from "@/types/LocationType";
    import DateRangeType from "@/types/DateRangeType";

    const FilterBar = ({selectedDateRange, setSelectedDateRange, setSelectedLocation, selectedCategory, setSelectedCategory, locations, categories } : {
        selectedDateRange : DateRangeType,
        setSelectedDateRange : (range : DateRangeType) => void,
        selectedLocation : string | undefined,
        setSelectedLocation : (location: string | undefined) => void,
        selectedCategory : string | undefined,
        setSelectedCategory : (category: string | undefined) => void,
        locations : LocationType[],
        categories : string[]
    })  => {
        const [open, setOpen] = useState(false);
        const [value, setValue] = useState<string|undefined>("");
        const resetFilters = () => {
            setSelectedDateRange({ start: null, end: null });
            setSelectedLocation(undefined);
            setSelectedCategory(undefined);
            setValue("")
        };

        return (
            <div className=' p-5 shadow-2xl mt-8 rounded-sm flex items-center gap-8'>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            id="date"
                            variant={"outline"}
                            className={cn(
                                "w-[300px] justify-start text-left font-normal",
                                !selectedDateRange && "text-muted-foreground"
                            )}
                        >
                            <CalendarIcon />
                            {selectedDateRange.start !== null && selectedDateRange.end !== null ? (
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
                            selected={{ from: selectedDateRange.start ?? undefined, to: selectedDateRange.end ?? undefined }}
                            onSelect={(range) => setSelectedDateRange({ start: range?.from ?? null, end: range?.to ?? null })}
                            numberOfMonths={2}
                        />
                    </PopoverContent>
                </Popover>

                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={open}
                            className="w-[200px] justify-between"
                        >
                            {value
                                ? locations.find((location) => location.value === value)?.label
                                : <span>Select location...</span>}
                            <ChevronsUpDown className="opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                        <Command>
                            <CommandInput placeholder="Search location..." className="h-9 placeholder:font-medium" />
                            <CommandList>
                                <CommandEmpty>No  found.</CommandEmpty>
                                <CommandGroup>
                                    {locations.map((location,index:number) => (
                                        <CommandItem
                                            key={index}
                                            value={location.value}
                                            onSelect={(currentValue) => {
                                                const newValue = currentValue === value ? "" : currentValue;
                                                setValue(currentValue === value ? "" : currentValue)
                                                setSelectedLocation(newValue || undefined);
                                                setOpen(false)
                                            }}
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

                <Select onValueChange={(value) => setSelectedCategory(value || undefined)} value={selectedCategory}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel className="font-semibold">All categories</SelectLabel>
                            {categories.map((category: string) => (
                                <SelectItem key={category} value={category}>{category}</SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
                <Button variant="destructive" onClick={resetFilters} className="ml-auto cursor-pointer">
                    Reset Filters <X className="ml-2 w-4 h-4" />
                </Button>
            </div>
        );
    };

    export default FilterBar;