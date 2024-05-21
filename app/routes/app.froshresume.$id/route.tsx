import { useParams } from "@remix-run/react";
import React from "react";

export default function FroshResume() {
  const { id } = useParams();

  return (
    <div className="min-h-screen flex flex-col items-center">
      <div className="w-full py-4 text-black text-center">
        <h1 className="text-2xl font-bold">Resume View</h1>
      </div>
      <div className="flex flex-col md:flex-row w-full flex-grow">
        <div className="flex-1 flex items-center justify-center border-b md:border-b-0 md:border-r p-4">
          <div>
            <h2 className="text-4xl font-bold">Resume ID: {id}</h2>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center p-4">
          <div>{/* Additional content can go here */}</div>
        </div>
      </div>
    </div>
  );
}
