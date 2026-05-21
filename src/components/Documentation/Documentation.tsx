import { BinaryOptions } from "./BinaryOptions";
import { DocNavigation } from "./DocNavigation";
import { Futures } from "./Futures";
import { Installation } from "./Installation";
import { MathDocs } from "./MathDocs";
import { Options } from "./Options";
import { Overview } from "./Overview";
import { Rates } from "./Rates";
import { Statistics } from "./Statistics";

export const Documentation = () => {
    return (
        <div className="bg-darkmode md:pt-0 pt-12">
            <div className="container mx-auto lg:max-w-screen-xl md:max-w-screen-md p-6 lg:pt-44 pt-16">
                <div className="grid grid-cols-12 gap-6">
                    <div className="lg:col-span-3 col-span-12 lg:block hidden">
                        <DocNavigation />
                    </div>
                    <div className="lg:col-span-9 col-span-12">
                        <Overview />
                        <Installation />
                        <MathDocs />
                        <Options />
                        <BinaryOptions />
                        <Futures />
                        <Rates />
                        <Statistics />
                    </div>
                </div>
            </div>
        </div>
    );
};
