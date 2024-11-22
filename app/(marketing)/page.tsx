import { Medal } from "lucide-react";
import Link from "next/link";
import localFont from "next/font/local";
import { Poppins } from "next/font/google";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const headingFont = localFont({
    src: "../../public/fonts/CalSans-SemiBold.woff2"
});

const textFont = Poppins({ 
    subsets: ["latin"],
    weight: [
        "100",
        "200",
        "300",
        "400",
        "500",
        "600",
        "700",
        "800",
        "900"
    ]
});

const MarketingPage = () => {
    return (
        <div className="flex items-center justify-center flex-col">
            <div className={cn("flex items-center justify-center flex-col", headingFont.className)}>
                <div className="mb-4 flex items-center border shadow-sm p-4 bg-amber-100 text_amber-700 rounded-full uppercase">
                    <Medal className="h-6 w6 mr-2" />
                    N0 1 task management
                </div>
                <h1 className="text-3xl md:text-6xl text-center mb-6 text-white">
                    Trello brings all your tasks, teammates, and tools together
                </h1>
            </div>
            <div className={cn("text-sm md:text-xl text-white mt-4 maxx-w-xs md:max-w-2xl text-center mx-auto", textFont.className)}>
            Keep everything in the same place—even if your team isn’t.
            </div>
            <Button className="mt-6 bg-blue-600 text-lg" size="lg" asChild>
                <Link href="/sign-up">
                Sign up - it’s free!
                </Link>
            </Button>
        </div>
    );
};

export default MarketingPage;