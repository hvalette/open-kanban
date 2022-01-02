import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { getAvatarUrl } from "../utils/avatar";
import { changeTheme, isDarkTheme } from "../utils/theme";

const Navbar = () => {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(isDarkTheme());
  return (
    <nav
      className={`h-full fixed top-0 shadow-xl bg-white dark:bg-gray-800 transition-all z-50 overflow-hidden ${
        isOpen ? "w-64" : "w-16 "
      }`}
    >
      <ul className="h-full flex flex-col items-center">
        <li
          className="w-full font-extrabold uppercase text-lg mb-4 cursor-pointer text-center"
          style={{ letterSpacing: "0.3ch" }}
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="flex items-center h-16">
            <span
              className={`inline absolute ml-4 whitespace-nowrap transition-all ${
                isOpen ? "left-0" : "-left-96"
              }`}
            >
              Open Kanban
            </span>
            <svg
              aria-hidden="true"
              focusable="false"
              data-prefix="fas"
              data-icon="angle-double-right"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512"
              className={`svg-inline--fa fa-angle-double-right fa-w-14 w-8 h-8 transition-all mx-4 ${
                isOpen ? "-rotate-180 ml-52" : " "
              }`}
            >
              <path
                fill="currentColor"
                d="M224.3 273l-136 136c-9.4 9.4-24.6 9.4-33.9 0l-22.6-22.6c-9.4-9.4-9.4-24.6 0-33.9l96.4-96.4-96.4-96.4c-9.4-9.4-9.4-24.6 0-33.9L54.3 103c9.4-9.4 24.6-9.4 33.9 0l136 136c9.5 9.4 9.5 24.6.1 34zm192-34l-136-136c-9.4-9.4-24.6-9.4-33.9 0l-22.6 22.6c-9.4 9.4-9.4 24.6 0 33.9l96.4 96.4-96.4 96.4c-9.4 9.4-9.4 24.6 0 33.9l22.6 22.6c9.4 9.4 24.6 9.4 33.9 0l136-136c9.4-9.2 9.4-24.4 0-33.8z"
              ></path>
            </svg>
          </div>
        </li>
        <li className="w-full font-bold cursor-pointer text-center hover:bg-slate-100 dark:hover:bg-gray-700 transition-colors">
          <Link href={"/"} passHref>
            <div className="flex items-center h-16">
              <svg
                aria-hidden="true"
                focusable="false"
                data-prefix="fas"
                data-icon="home"
                className="svg-inline--fa fa-home fa-w-18 w-8 min-w-fit h-8 mx-4"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 576 512"
              >
                <path
                  fill="currentColor"
                  d="M280.37 148.26L96 300.11V464a16 16 0 0 0 16 16l112.06-.29a16 16 0 0 0 15.92-16V368a16 16 0 0 1 16-16h64a16 16 0 0 1 16 16v95.64a16 16 0 0 0 16 16.05L464 480a16 16 0 0 0 16-16V300L295.67 148.26a12.19 12.19 0 0 0-15.3 0zM571.6 251.47L488 182.56V44.05a12 12 0 0 0-12-12h-56a12 12 0 0 0-12 12v72.61L318.47 43a48 48 0 0 0-61 0L4.34 251.47a12 12 0 0 0-1.6 16.9l25.5 31A12 12 0 0 0 45.15 301l235.22-193.74a12.19 12.19 0 0 1 15.3 0L530.9 301a12 12 0 0 0 16.9-1.6l25.5-31a12 12 0 0 0-1.7-16.93z"
                ></path>
              </svg>
              <span
                className={`whitespace-nowrap ${isOpen ? "inline" : "hidden"}`}
              >
                Projects
              </span>
            </div>
          </Link>
        </li>
        <span className="mt-auto"></span>
        <li
          className="w-full font-bold cursor-pointer text-center hover:bg-slate-100 dark:hover:bg-gray-700 transition-colors"
          onClick={() => {
            changeTheme();
            setIsDark(!isDark);
          }}
        >
          <div className="flex items-center h-16">
            {isDark ? (
              <svg
                aria-hidden="true"
                focusable="false"
                data-prefix="fas"
                data-icon="sun"
                className="svg-inline--fa fa-sun fa-w-16 w-8 min-w-fit h-8 mx-4"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
              >
                <path
                  fill="currentColor"
                  d="M256 160c-52.9 0-96 43.1-96 96s43.1 96 96 96 96-43.1 96-96-43.1-96-96-96zm246.4 80.5l-94.7-47.3 33.5-100.4c4.5-13.6-8.4-26.5-21.9-21.9l-100.4 33.5-47.4-94.8c-6.4-12.8-24.6-12.8-31 0l-47.3 94.7L92.7 70.8c-13.6-4.5-26.5 8.4-21.9 21.9l33.5 100.4-94.7 47.4c-12.8 6.4-12.8 24.6 0 31l94.7 47.3-33.5 100.5c-4.5 13.6 8.4 26.5 21.9 21.9l100.4-33.5 47.3 94.7c6.4 12.8 24.6 12.8 31 0l47.3-94.7 100.4 33.5c13.6 4.5 26.5-8.4 21.9-21.9l-33.5-100.4 94.7-47.3c13-6.5 13-24.7.2-31.1zm-155.9 106c-49.9 49.9-131.1 49.9-181 0-49.9-49.9-49.9-131.1 0-181 49.9-49.9 131.1-49.9 181 0 49.9 49.9 49.9 131.1 0 181z"
                ></path>
              </svg>
            ) : (
              <svg
                aria-hidden="true"
                focusable="false"
                data-prefix="fas"
                data-icon="moon"
                className="svg-inline--fa fa-moon fa-w-16 w-8 min-w-fit h-8 mx-4"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
              >
                <path
                  fill="currentColor"
                  d="M283.211 512c78.962 0 151.079-35.925 198.857-94.792 7.068-8.708-.639-21.43-11.562-19.35-124.203 23.654-238.262-71.576-238.262-196.954 0-72.222 38.662-138.635 101.498-174.394 9.686-5.512 7.25-20.197-3.756-22.23A258.156 258.156 0 0 0 283.211 0c-141.309 0-256 114.511-256 256 0 141.309 114.511 256 256 256z"
                ></path>
              </svg>
            )}

            <span
              className={`whitespace-nowrap ${isOpen ? "inline" : "hidden"}`}
            >
              Dark mode
            </span>
          </div>
        </li>
        <li className="w-full font-bold cursor-pointer text-center hover:bg-slate-100 dark:hover:bg-gray-700 transition-colors">
          <Link href={"#"} passHref>
            <div className="flex items-center h-16">
              <figure className="rounded-full mx-4 min-w-fit">
                <Image
                  src={getAvatarUrl(session?.user?.name ?? "")}
                  alt="Connected user avatar"
                  width={32}
                  height={32}
                  className="rounded-full mx-4"
                ></Image>
              </figure>
              <span
                className={`whitespace-nowrap ${isOpen ? "inline" : "hidden"}`}
              >
                {session?.user?.name}
              </span>
            </div>
          </Link>
        </li>
        <li
          className="w-full font-bold cursor-pointer text-center hover:bg-slate-100 dark:hover:bg-gray-700 transition-colors"
          onClick={() => signOut()}
        >
          <div className="flex items-center h-16">
            <svg
              aria-hidden="true"
              focusable="false"
              data-prefix="fas"
              data-icon="sign-out-alt"
              className="svg-inline--fa fa-home fa-w-18 w-8 min-w-fit h-8 mx-4"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
            >
              <path
                fill="currentColor"
                d="M497 273L329 441c-15 15-41 4.5-41-17v-96H152c-13.3 0-24-10.7-24-24v-96c0-13.3 10.7-24 24-24h136V88c0-21.4 25.9-32 41-17l168 168c9.3 9.4 9.3 24.6 0 34zM192 436v-40c0-6.6-5.4-12-12-12H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h84c6.6 0 12-5.4 12-12V76c0-6.6-5.4-12-12-12H96c-53 0-96 43-96 96v192c0 53 43 96 96 96h84c6.6 0 12-5.4 12-12z"
              ></path>
            </svg>
            <span
              className={`whitespace-nowrap ${isOpen ? "inline" : "hidden"}`}
            >
              Sign out
            </span>
          </div>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
