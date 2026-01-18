import { Card } from '@/components/ui/card';
import Link from 'next/link';
import Image from 'next/image';

const EventCardHome = ({
  title,
  date,
  time,
  location,
  organizer,
  link,
  imagePath,
}: {
  title: string;
  date: string;
  time: string;
  location: string;
  organizer: string;
  link: string;
  imagePath?: string;
}) => {
  return (
    <Link href={link} className="w-full block aspect-square group">
      <Card className="w-full h-full border-0 relative overflow-hidden m-0 p-0 transition-all duration-500 ease-in-out hover:shadow-xl hover:shadow-primary/10">
        {/* Image avec effet de zoom et lumière */}
        <div className="relative w-full h-full m-0 p-0 overflow-hidden">
          {imagePath ? (
            <>
              <Image
                src={imagePath}
                alt={title}
                fill
                className="object-cover brightness-95 group-hover:brightness-110 group-hover:scale-105 transition-all duration-700 ease-in-out"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority={false}
              />

              {/* Overlay avec effet de profondeur */}
              <div
                className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent 
                            flex flex-col justify-end p-5
                            transition-all duration-500 ease-in-out
                            group-hover:from-black/80 group-hover:via-black/40"
              >
                {/* Titre avec effet de surbrillance et mouvement */}
                <h3
                  className="text-xl font-bold text-white mb-3 line-clamp-2 
                              transition-all duration-500 ease-in-out
                              group-hover:text-primary-200 group-hover:translate-y-[-5px]"
                >
                  <span className="relative inline-block">
                    {title}
                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-primary-400 transform scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100"></span>
                  </span>
                </h3>

                {/* Métadonnées avec effet de glissement et apparition */}
                <div
                  className="space-y-2 text-white/90 opacity-90
                               transition-all duration-500 ease-in-out
                               group-hover:opacity-100 group-hover:space-y-3"
                >
                  <div className="flex items-center gap-2 transition-all duration-300 group-hover:translate-x-1">
                    <div className="p-1 bg-primary-500/20 rounded-full group-hover:bg-primary-500/30 transition-colors duration-300">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="transition-all duration-300 group-hover:stroke-[2.5px] group-hover:text-primary-300"
                      >
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                      </svg>
                    </div>
                    <p className="text-sm group-hover:text-primary-100 transition-colors duration-300">
                      {new Date(date).toLocaleDateString('fr-FR', {
                        weekday: 'short',
                        day: 'numeric',
                        month: 'short',
                      })}
                      {' • '}
                      {time}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 transition-all duration-300 group-hover:translate-x-1 delay-75">
                    <div className="p-1 bg-primary-500/20 rounded-full group-hover:bg-primary-500/30 transition-colors duration-300">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="transition-all duration-300 group-hover:stroke-[2.5px] group-hover:text-primary-300"
                      >
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                      </svg>
                    </div>
                    <p className="text-sm line-clamp-1 group-hover:text-primary-100 transition-colors duration-300">
                      {location}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 transition-all duration-300 group-hover:translate-x-1 delay-100">
                    <div className="p-1 bg-primary-500/20 rounded-full group-hover:bg-primary-500/30 transition-colors duration-300">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="transition-all duration-300 group-hover:stroke-[2.5px] group-hover:text-primary-300"
                      >
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                      </svg>
                    </div>
                    <p className="text-sm line-clamp-1 group-hover:text-primary-100 transition-colors duration-300">
                      {organizer}
                    </p>
                  </div>
                </div>

                {/* Bouton invisible qui apparaît au hover */}
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out">
                  <div className="bg-primary-500 text-white px-3 py-1 rounded-full text-xs font-medium transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    View details
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex flex-col justify-end p-5 group-hover:from-gray-300 group-hover:to-gray-400 transition-all duration-500">
              <h3 className="text-xl font-bold text-gray-800 group-hover:text-gray-900 transition-colors duration-300">
                {title}
              </h3>
              {/* ... autres infos ... */}
            </div>
          )}
        </div>
      </Card>
    </Link>
  );
};

export default EventCardHome;
