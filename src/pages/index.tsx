import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Loader from "../components/loader";
import ProjectCard from "../components/projectCard";
import { useProjects } from "../utils/fetcher";

const Home: NextPage = () => {
  const { data, isLoading, isError } = useProjects();
  return (
    <div className="p-12">
      <h1 className="text-8xl font-extrabold text-center">Open Kanban</h1>
      <p className="p-2 text-center text-lg">
        Manage projects work packages from OpenProjects in a kanban way !
      </p>
      <h2 className="text-4xl font-extrabold py-8">Projects</h2>
      {isLoading && (
        <div className="w-full grid place-items-center">
          <Loader></Loader>
        </div>
      )}
      <div className="grid grid-repeat-auto-fill gap-x-8 gap-y-2">
        {data &&
          data._embedded.elements.map((project: any) => (
            <Link key={project.id} href={`/projects/${project.id}`} passHref>
              <div className="p-2 rounded hover:bg-slate-100 hover:dark:bg-gray-800 transition-colors cursor-pointer">
                {project.name}
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
};

export default Home;
