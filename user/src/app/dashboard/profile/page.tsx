"use client"
import { mockUser } from "@/lib/mockUser";
import Image from "next/image";
import Mi from "../../../../public/mock_user.jpg"
import { CiBookmark , CiSettings, CiMail, CiUser, CiLock   } from "react-icons/ci";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import {Input} from "@/components/ui/input";
import {useState} from "react";
import {useSession} from "next-auth/react";


export default function UserProfile() {
    const [newUserName, setNewUserName] = useState<string>("");
    const [newEmailAddress, setNewEmailAddress] = useState<string>("");
    const [newPassword, setNewPassword] = useState("");

    const session = useSession();

    const handleSubmit = () => {
        console.log({
            newUserName,
            newEmailAddress,
            newPassword
        })
    }

    if(session.status === "unauthenticated") {
        return <div className="text-center mt-8 space-y-4">
            <h1 className="text-xl font-semibold text-amber-500">You need to sign up to see this page</h1>
            <Link href={"/auth/login"}>
                <Button variant={"outline"}>
                    Sign In
                </Button>
            </Link>
        </div>
    }

  return (
    <div className="flex flex-row items-center gap-x-10 justify-center mt-8">
        <div className="flex flex-col gap-y-8">
            <div className="p-5 shadow-md flex items-center flex-col cursor-pointer hover:shadow-xl">
                <h1 className="font-semibold text-lg flex items-center">Account Settings <CiSettings className="ms-4 text-2xl"/></h1>
                <p className="text-sm">Details about your information</p>
            </div>
            <Link href={`/dashboard/reservations`}>
                <div className="p-5 shadow-md flex items-center flex-col cursor-pointer hover:shadow-xl">
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
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant={"outline"} className="cursor-pointer">Update</Button>
                    </SheetTrigger>
                    <SheetContent>
                        <SheetHeader>
                            <SheetTitle>Edit profile</SheetTitle>
                            <SheetDescription>
                                Make changes to your profile here. Click save when you&#39;re done.
                            </SheetDescription>
                        </SheetHeader>
                        <div className="grid gap-4 py-4">
                            <div className="flex px-8 items-center">
                                <CiUser className='text-2xl absolute left-10'/>
                                <Input id="name"  className="text-right" placeholder="New user name" value={newUserName} onChange={(e) => setNewUserName(e.target.value)} />
                            </div>
                            <div className="flex px-8 items-center">
                                <CiMail className='text-2xl absolute left-10'/>
                                <Input id="username" className="text-right" placeholder="New email address" value={newEmailAddress} onChange={(e) => setNewEmailAddress(e.target.value)}/>
                            </div>
                            <div className="flex px-8 items-center">
                                <CiLock className='text-2xl absolute left-10'/>
                                <Input type={"password"} className="text-right" placeholder="New password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}/>
                            </div>
                        </div>
                        <SheetFooter>
                            <SheetClose asChild>
                                <Button onClick={handleSubmit}>Save changes</Button>
                            </SheetClose>
                        </SheetFooter>
                    </SheetContent>
                </Sheet>
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