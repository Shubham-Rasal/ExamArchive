"use client"
import React from "react";
import Link from "next/link";
export default function LandingPage() {
  return (
    <div>
      <nav className="bg-gray-800 text-white">
        <div className="px-5 xl:px-12 py-6 flex items-center justify-between">
          <a className="text-3xl font-bold font-heading" href="#">
            Logo Here.
          </a>
          <div className="hidden xl:flex items-center space-x-5">
            <div className="ml-auto">
              <a className="flex items-center hover:text-gray-200" href="#">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 hover:text-gray-200"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Login/SignUp
              </a>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex justify-center items-center px-20 mt-10">
        <div className="space-y-10">
          <div className="flex items-center p-6 space-x-6 bg-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition duration-500">
            <div className="flex bg-gray-100 p-4 w-72 space-x-4 rounded-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 opacity-30"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                className="bg-black-200 outline-none text-slate-800"
                type="text"
                placeholder="Article name or keyword..."
              />
            </div>
            <div
              className="flex py-3 px-4 rounded-lg text-gray-500 font-semibold cursor-pointer"
              
            >
              <Link href="./filter">Filter</Link>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
            <div className="bg-gray-800 py-3 px-5 text-white font-semibold rounded-lg hover:shadow-lg transition duration-3000 cursor-pointer">
              <span>Search</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap justify-center items-center px-20 mt-10 space-x-5">
        
        {[1, 2, 3, 4, 5].map((item) => (
          <div
            key={item}
            className="max-w-sm rounded overflow-hidden shadow-lg bg-slate-825"
          >
            <img
              className="w-full h-60 object-cover"
              src={`https://picsum.photos/200/${item * 100}`}
              alt="Sunset in the mountains"
            />
            <div className="px-6 py-4">
              <div className="font-bold text-xl mb-2">The Coldest Sunset</div>
              <p className="text-gray-700 text-base">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Voluptatibus quia, nulla! Maiores et perferendis eaque,
                exercitationem praesentium nihil.
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
