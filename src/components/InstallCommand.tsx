import { CopyButton } from "./Documentation/CopyButton";

type Props = {
  /** The shell command to display. Defaults to `npm install defimath-lib`. */
  command?: string;
  /** Optional className applied to the outer wrapper (use for spacing/width overrides). */
  className?: string;
};

/**
 * Prominent install-command code block with a built-in coral-orange copy button.
 * Reusable on any page (docs landing, marketing, news, etc.).
 */
export const InstallCommand = ({
  command = "npm install defimath-lib",
  className,
}: Props) => {
  return (
    <div
      className={`py-5 px-5 rounded-md bg-dark_grey relative ${className ?? ""}`}
    >
      <p className="text-base font-mono text-gray-400 pe-20">{command}</p>
      <CopyButton
        value={command}
        orange
        trackEvent={{ name: "install_copy", value: 1, currency: "USD" }}
      />
    </div>
  );
};
