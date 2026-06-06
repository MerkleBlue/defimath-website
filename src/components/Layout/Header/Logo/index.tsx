import Image from "next/image";
import Link from "next/link";

const Logo: React.FC = () => {
  return (
    <Link href="/">
      <Image
        src={`/images/logo/logo-pea.svg`}
        alt="logo"
        width={160}
        height={50}
        priority
      />
    </Link>
  );
};

export default Logo;
