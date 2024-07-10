import Footer from "./_components/footer";
import Navbar from "./_components/navbar";

const MareketingLayout = ({ 
    children 
}: {
    children: React.ReactNode;
}
) => {
    return (
        <div className="h-full bg-slate-100">
            <Navbar />
            <main className="pt-40 pb-40 bg-gradient-to-r from-violet-500 to-fuchsia-400">
                {children}
            </main>
            <Footer />
        </div>
    );
};

export default MareketingLayout;