import { DocNavigation } from "@/components/Documentation/DocNavigation";
import { OnThisPage } from "@/components/Documentation/OnThisPage";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="bg-darkmode md:pt-0 pt-12">
            <div className="container mx-auto lg:max-w-screen-xl md:max-w-screen-md p-6 lg:pt-44 pt-16">
                <div className="grid grid-cols-12 gap-6">
                    <div className="lg:col-span-3 col-span-12 lg:block hidden">
                        <DocNavigation />
                    </div>
                    <div className="lg:col-span-7 col-span-12" data-docs-content>
                        {children}
                    </div>
                    <div className="lg:col-span-2 col-span-12 lg:block hidden">
                        <OnThisPage />
                    </div>
                </div>
            </div>
        </div>
    );
}
