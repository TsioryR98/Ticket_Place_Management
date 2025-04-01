import Link from "next/link";
import { CiFacebook } from "react-icons/ci";
import { FaInstagram , FaWhatsapp, FaTelegramPlane  } from "react-icons/fa";


const Footer = () => {
    return (
        <footer className="text-center bg-blue-900 grid grid-cols-3 space-x-10 px-5 pt-4 mt-4">
            <div className="space-y-4">
                <h2 className="text-amber-400 text-2xl font-bold">Social Networks</h2>
                <div className="flex items-center justify-center gap-x-5">
                    <div className=" flex flex-col gap-y-5">
                        <Link href={"#"} className="text-4xl text-white"><CiFacebook/></Link>
                        <Link href={"#"} className="text-4xl text-white"><FaInstagram/></Link>
                    </div>
                    <div className=" flex flex-col gap-y-5">
                        <Link href={"#"} className="text-4xl text-white"><FaTelegramPlane/></Link>
                        <Link href={"#"} className="text-4xl text-white"><FaWhatsapp/></Link>
                    </div>
                </div>
            </div>
            <div className="space-y-4">
                <h2 className="text-amber-400 text-2xl font-bold">Quick links</h2>
                <div className="flex flex-col space-y-4">
                    <Link href={"/"} className="text-white text-lg">Home</Link>
                    <Link href={"/"} className="text-white text-lg">All events</Link>
                    <Link href={"/auth/login"} className="text-white text-lg">Sign In</Link>
                    <Link href={"/auth/signup"} className="text-white text-lg">Sign Up</Link>
                </div>
            </div>
            <div className="space-y-4">
                <h2 className="text-amber-400 text-2xl font-bold">Tickify</h2>
                <p className="text-right text-white text-lg">Concerts, sports, theater. Get your tickets and create memories that last a lifetime !</p>
            </div>
        </footer>
    );
};


export default Footer;