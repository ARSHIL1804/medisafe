import React from "react";
import { WalletSelector } from "./WalletSelector";

export default function Header() {
  return (
    <header>
      <nav className="bg-white border-gray-200 px-4 lg:px-6 py-2.5 dark:bg-gray-800">
        <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
          <a className="flex items-center">
            <img
              src="/MEDISAFE.png"
              className="mr-3 h-6 sm:h-9"
              alt="Flowbite Logo"
            />
            <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
              Medisafe
            </span>
          </a>
          <div className="flex items-center lg:order-2">
            <WalletSelector />
          </div>
        </div>
      </nav>
    </header>
  );
}
