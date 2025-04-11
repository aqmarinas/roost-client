// import React from "react";
// import { BellIcon } from "@heroicons/react/24/outline";
// import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";

// export default function AdminNavbar() {
//   return (
//     <div className="flex px-4 sm:px-8 justify-end py-3 items-center gap-2">
//       <button
//         type="button"
//         className="relative rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
//       >
//         <span className="absolute -inset-1.5" />
//         <span className="sr-only">View notifications</span>
//         <BellIcon className="size-5 sm:size-6" />
//       </button>

//       {/* Profile dropdown */}
//       <Menu
//         as="div"
//         className="relative ml-3"
//       >
//         <div>
//           <MenuButton className="relative flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
//             <span className="absolute -inset-1.5" />
//             <span className="sr-only">Open user menu</span>
//             <img
//               alt="User profile"
//               src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
//               className="size-7 sm:size-8 rounded-full"
//             />
//           </MenuButton>
//         </div>
//         <MenuItems
//           transition
//           className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-none"
//         >
//           <MenuItem>
//             {({ focus }) => (
//               <a
//                 href="#"
//                 className={`block px-4 py-2 text-sm text-gray-700 ${focus ? "bg-gray-100" : ""}`}
//               >
//                 Your Profile
//               </a>
//             )}
//           </MenuItem>
//           <MenuItem>
//             {({ focus }) => (
//               <a
//                 href="#"
//                 className={`block px-4 py-2 text-sm text-gray-700 ${focus ? "bg-gray-100" : ""}`}
//               >
//                 Settings
//               </a>
//             )}
//           </MenuItem>
//           <MenuItem>
//             {({ focus }) => (
//               <a
//                 href="#"
//                 className={`block px-4 py-2 text-sm text-gray-700 ${focus ? "bg-gray-100" : ""}`}
//               >
//                 Sign out
//               </a>
//             )}
//           </MenuItem>
//         </MenuItems>
//       </Menu>
//     </div>
//   );
// }
