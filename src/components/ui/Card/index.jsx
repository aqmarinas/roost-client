import { UserGroupIcon } from "@heroicons/react/24/outline";
import { MapPinIcon } from "lucide-react";
import React from "react";

export default function Card({ name, capacity, location, link = "#", imgSrc = "https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png?20210521171500" }) {
  return (
    <a
      href={link}
      className="block max-w-full bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300"
    >
      <div className="relative group">
        <img
          className="rounded-lg w-full object-cover aspect-3/2 transform transition-transform duration-500 group-hover:scale-105"
          src={imgSrc}
          alt={name}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 p-5 pointer-events-none">
          <h1 className="text-xl font-semibold text-white mb-2">{name}</h1>
          <div className="flex gap-4 text-white">
            <div className="flex items-center gap-2 text-sm">
              <UserGroupIcon className="size-5" />
              {capacity}
            </div>
            <span className="text-sm text-white"> | </span>
            <div className="flex items-center gap-2 text-sm">
              <MapPinIcon className="size-5" />
              {location}
            </div>
          </div>
        </div>
      </div>
    </a>
  );
}
