import { getImagePrefix } from "@/utils/utils";
import Image from "next/image";
import Link from "next/link";

const Logo: React.FC = () => {
  return (
    <Link href="/">
      <Image
        // src={`${getImagePrefix()}images/logo/logo-pea.svg`}
        src={`/images/logo/logo-pea.svg`}
        alt="logo"
        width={160}
        height={50}
        priority
        style={{ width: "auto", height: "auto" }}
      />
    </Link>
  );
};

export default Logo;
