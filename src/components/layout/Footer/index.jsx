import { Link } from "react-router-dom";
export default function Footer() {
  return (
    <footer className="border-t border-gray-200">
      <div className="mx-auto w-full p-8 md:flex md:items-center md:justify-between ">
        <div className="flex justify-center gap-x-6 md:order-2 text-gray-600 text-sm/6">
          <Link className="">Terms</Link>
          <Link className="">Privacy</Link>
          <Link className="">Help</Link>
          <Link className="">Contact</Link>
        </div>
        <p className="mt-8 text-center text-sm/6 text-gray-600 md:order-1 md:mt-0">&copy; {new Date().getFullYear()} PT XYZ, Inc. All rights reserved.</p>
      </div>
    </footer>
  );
}
