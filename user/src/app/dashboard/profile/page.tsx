import { mockUser } from "@/lib/mockUser";
import Image from "next/image";
import Mi from "../../../../public/mock_user.jpg"
import { CiBookmark , CiSettings } from "react-icons/ci";
import {Button} from "@/components/ui/button";
import Link from "next/link";

export default function UserProfile() {
  return (
    <div className="flex flex-row items-center gap-x-10 justify-center mt-8">
        <div className="flex flex-col gap-y-8">
            <div className="p-5 shadow-md flex items-center flex-col cursor-pointer hover:shadow-xl transition-all duration-300">
                <h1 className="font-semibold text-lg flex items-center">Account Settings <CiSettings className="ms-4 text-2xl"/></h1>
                <p className="text-sm">Details about your information</p>
            </div>
            <Link href={`/dashboard/reservations`}>
                <div className="p-5 shadow-md flex items-center flex-col cursor-pointer hover:shadow-xl transition-all duration-300">
                    <h1 className="font-semibold text-lg flex items-center">My reservations <CiBookmark className="ms-4 text-2xl"/></h1>
                    <p className="text-sm">Check all of your bookings</p>
                </div>
            </Link>
        </div>
        <div className="flex flex-col gap-y-8">
            <div className="flex items-center gap-x-20 p-8 shadow-md hover:shadow-xl transition-all duration-300">
                <div className="flex items-center gap-x-8">
                    <Image src={Mi} alt={"Test"} height={100} width={100} className="rounded-full"/>
                    <h1>Your profile</h1>
                </div>
                <Button variant={"outline"} className="cursor-pointer">Update</Button>
            </div>

            <div className="shadow-md p-8 hover:shadow-xl transition-all duration-300">
                <h1 className="mb-6 font-bold text-xl">Your informations</h1>
                <div className="grid grid-cols-2 gap-8">
                    <span>
                        <p>Full Name</p>
                        <p className="font-semibold">{mockUser.name}</p>
                    </span>
                    <span>
                        <p>Email Address</p>
                        <p className="font-semibold">{mockUser.email}</p>
                    </span>
                </div>
            </div>
        </div>
    </div>
  );
}