import { Link } from "@remix-run/react";
import { useNavigate } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { IoArrowBack } from "react-icons/io5";

export default function Frosh() {
  const resumes = [
    { id: 1, name: "Resume 1" },
    { id: 2, name: "Resume 2" },
    { id: 3, name: "Resume 3" },
    { id: 4, name: "Resume 4" },
  ];

  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/app/select");
  };

  return (
    <div className="max-h-screen flex flex-col items-center">
      <div className="flex flex-row w-full justify-between items-center pt-16 sm:pt-24">
        <Button onClick={handleClick}>
          <IoArrowBack className="text-xl" />
          <h2 className="hidden sm:flex">Back</h2>
        </Button>
        <h1 className="text-4xl font-bold absolute left-1/2 transform -translate-x-1/2">
          Frosh
        </h1>
      </div>
      <div className="grid sm:grid-cols-2 gap-6 pt-8 sm:pt-16">
        {resumes.map((resume) => (
          <Link
            key={resume.id}
            to={`/app/froshresume/${resume.id}`}
            className="bg-white px-24 py-16 sm:p-24 rounded shadow-md flex items-center justify-center"
          >
            <h2 className="text-xl font-semibold">{resume.name}</h2>
          </Link>
        ))}
      </div>
    </div>
  );
}
