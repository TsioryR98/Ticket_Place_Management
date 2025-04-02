import { Card, CardContent, CardFooter } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";

const EventCardHome = ({
  title,
  description,
  date,
  time,
  location,
  organizer,
  link,
  imagePath,
}: {
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  organizer: string;
  link: string;
  imagePath?: string;
}) => {
  return (
    <Link href={link} className="w-full h-full group">
      <Card className="w-full h-full rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col border border-gray-100 hover:border-gray-200">
        {/* Image section */}
        <div className="relative aspect-video w-full overflow-hidden">
          {imagePath && (
            <>
              <Image
                src={imagePath}
                alt={title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority={false}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
                <h3 className="text-xl font-bold text-white drop-shadow-md line-clamp-1">
                  {title}
                </h3>
                <p className="text-white/90 line-clamp-2 text-sm mt-1 drop-shadow-md">
                  {description}
                </p>
              </div>
            </>
          )}
        </div>

        {/* Content section */}
        <CardContent className="p-4 grid grid-cols-2 gap-3 flex-1">
          {/* Date */}
          <div className="flex items-start gap-3 p-2 rounded-lg">
            <div className="p-2 bg-amber-50 rounded-full text-amber-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
            </div>
            <div>
              <p className="text-xs text-gray-500">Date</p>
              <p className="font-medium text-sm">
                {new Date(date).toLocaleDateString("fr-FR", {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                })}
              </p>
            </div>
          </div>

          {/* Time */}
          <div className="flex items-start gap-3 p-2 rounded-lg">
            <div className="p-2 bg-amber-50 rounded-full text-amber-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
            </div>
            <div>
              <p className="text-xs text-gray-500">Heure</p>
              <p className="font-medium text-sm">{time}</p>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-start gap-3 p-2 rounded-lg col-span-2">
            <div className="p-2 bg-amber-50 rounded-full text-amber-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
            </div>
            <div>
              <p className="text-xs text-gray-500">Lieu</p>
              <p className="font-medium text-sm line-clamp-2">{location}</p>
            </div>
          </div>
        </CardContent>

        {/* Footer section */}
        <CardFooter className="px-4 py-3 border-t bg-gray-50 flex items-center justify-between group-hover:bg-gray-100 transition-colors">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-50 rounded-full text-amber-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
            <div>
              <p className="text-xs text-gray-500">Organisé par</p>
              <p className="font-medium text-sm text-gray-700">{organizer}</p>
            </div>
          </div>
          <span className="text-sm text-gray-500 group-hover:text-amber-500 transition-colors">
            Voir l'événement →
          </span>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default EventCardHome;
