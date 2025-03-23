import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {CiCalendarDate, CiLocationOn} from "react-icons/ci"
import {MdOutlineWatchLater} from "react-icons/md"
import Link from "next/link";

const EventCardHome = ({title, description, date, time, location, organizer, link} : {
    title: string;
    description: string;
    date: string;
    time: string;
    location: string;
    organizer: string;
    link: string;
}) => {
    return (
        <Link href={link}>
            <Card className="w-[400px] shadow-2xl">
                <CardHeader>
                    <CardTitle className="text-lg">{title}</CardTitle>
                    <CardDescription className="text-[1.05rem]">{description}</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-y-5">
                    <span className="flex items-center gap-8">
                        <CiCalendarDate className="text-3xl"/> {date}
                    </span>
                    <span className="flex items-center gap-8">
                        <MdOutlineWatchLater className="text-3xl"/> {time}
                    </span>
                    <span className="flex items-center gap-8">
                        <CiLocationOn className="text-3xl"/> {location}
                    </span>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <div>
                        <span>Organized by : <br/> <span className="font-semibold">{organizer}</span></span>
                    </div>
                    <p className="hover:underline transition-all duration-300">Learn more</p>
                </CardFooter>
            </Card>
        </Link>
    );
};


export default EventCardHome;