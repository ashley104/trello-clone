import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const Navbar = () => {
    return (
        <div className="fixed top-0 w-full h-14 px-4 border-b shadow-sm bg-white flex items-center">
            <div className="md:max-w-screen-lg mx-auto flex items-center w-full justify-between px-10">
                <Logo />
                <div className="space-x-4 md:block md:w-auto flex items-center justify-between w-full">
                    <Button variant="outline" asChild>
                        <Link href="/sign-in" className="h-14 text-lg">
                            Log in
                        </Link>
                    </Button>
                    <Button asChild className="bg-blue-600 h-14 rounded-none text-lg">
                        <Link href="/sign-up">
                            Get Trello for free
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default Navbar