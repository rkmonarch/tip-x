import { ConnectKitButton } from "connectkit";
import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <nav className="absolute justify-between w-[100%] py-6 mb-12 md:mb-20 bg-transparent z-50">
      <div className="container px-4 mx-auto">
        <div className="flex items-center">
          <Link className="hidden lg:inline-block text-lg font-bold" href="/">
            <Image
              className="h-10"
              src="/tip-land.png"
              alt=""
              height={60}
              width={40}
            />
          </Link>
          <Link className="inline-block lg:hidden text-lg font-bold" href="/">
            <Image
              className="h-10"
              src="/tip-land.png"
              alt=""
              height={60}
              width={40}
            />
          </Link>
          <ul className="hidden lg:flex ml-2 lg:w-auto lg:space-x-14 items-center">
            <li>
              <p className="inline-block text-lg text-orange-500 font-semibold">
                tip land
              </p>
            </li>
          </ul>
          <div className="hidden lg:block ml-auto">
            <ConnectKitButton />
          </div>
        </div>
      </div>
    </nav>
  );
}
