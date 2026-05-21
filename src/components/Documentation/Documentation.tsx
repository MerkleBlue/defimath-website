import { BinaryOptions } from "./BinaryOptions";
import { Futures } from "./Futures";
import { Installation } from "./Installation";
import { MathDocs } from "./MathDocs";
import { Options } from "./Options";
import { Overview } from "./Overview";
import { Rates } from "./Rates";
import { Statistics } from "./Statistics";

export const Documentation = () => {
    return (
        <>
            <Overview />
            <Installation />
            <MathDocs />
            <Options />
            <BinaryOptions />
            <Futures />
            <Rates />
            <Statistics />
        </>
    );
};
