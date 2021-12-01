/* eslint-disable @next/next/no-img-element */
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { SWRConfig } from "swr";
import { mutateProject, useProject } from "../../utils/fetcher";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import WorkPackageCard from "../../components/workPackageCard";
import {
  getCreateWorkPackageUrl,
  updateWorkPackageStatus,
} from "../../utils/workPackages";
import { toast } from "react-toastify";
import { getAvatarUrl } from "../../utils/avatar";
import Loader from "../../components/loader";
import ProjectSettings from "../../components/projectSettings";
import WorkPackageDetail from "../../components/workPackageDetail";

const Project = () => {
  const router = useRouter();
  const { projectId } = router.query;
  const [selectedVersion, setSelectedVersion]: any[] = useState(null);

  const [displayedStatus, setDisplayedStatus] = useState<number[] | null>(null);

  const [workPackageDetail, setWorkPackageDetail] = useState<any>(null);

  const { data: project, isLoading, isError } = useProject(projectId as string);

  const handleVersionChange = (event: any) => {
    const versionId = Number(event.target.value);
    const version = project.versions.find((v: any) => v.id === versionId);
    setSelectedVersion(version);
  };

  useEffect(() => {
    if (selectedVersion && project) {
      const versionId = selectedVersion.id;
      const version = project.versions.find((v: any) => v.id === versionId);
      setSelectedVersion(version);
    }
  }, [project, selectedVersion]);

  const onDragEnd = ({ destination, source }: any) => {
    const destinationStatusId = Number(destination.droppableId);

    const sourceStatusId = Number(source.droppableId);
    const destinationStatus = selectedVersion.statuses.find(
      (s: any) => s.id === destinationStatusId
    );
    const sourceStatus = selectedVersion.statuses.find(
      (s: any) => s.id === sourceStatusId
    );
    const [workPackage] = sourceStatus.workPackages.splice(source.index, 1);
    updateWorkPackageStatus(workPackage, destinationStatusId)
      .then((res) => {
        workPackage.lockVersion = res.lockVersion;
      })
      .catch((error) => {
        const [workPackage] = destinationStatus.workPackages.splice(
          destination.index,
          1
        );
        sourceStatus.workPackages.splice(source.index, 0, workPackage);
        setSelectedVersion({ ...selectedVersion });
        toast.error(
          `Cannot move item from "${sourceStatus.name}" to "${destinationStatus.name}"`,
          { hideProgressBar: true }
        );
      });
    destinationStatus.workPackages.splice(destination.index, 0, workPackage);
  };

  useEffect(() => {
    if (project?.versions && !selectedVersion) {
      setSelectedVersion(project.versions[0]);
    }
  }, [project, selectedVersion]);

  const [selectedUser, setSelectedUser] = useState(null);

  const getUsers = () => {
    const users = selectedVersion.statuses
      .map((status: any) => status.workPackages.map((wp: any) => wp.assignee))
      .flat()
      .filter(
        (user: any, index: number, self: any[]) =>
          index === self.findIndex((u: any) => u === user || u?.id === user?.id)
      )
      .sort();
    return users;
  };

  return (
    <div
      className="p-8 min-h-screen grid"
      style={{ gridTemplateRows: "auto 1fr" }}
    >
      {isLoading && (
        <div className="h-full w-full grid place-items-center row-span-2">
          <Loader></Loader>
        </div>
      )}
      {isError && (
        <div className="h-full w-full grid place-items-center row-span-2">
          An error occured while retrieving the project...
        </div>
      )}
      {project?.versions && (
        <>
          <div className="pb-4 flex flex-col relative w-full">
            <div
              className="flex justify-between"
              style={{ width: "calc(100vw - 8rem)" }}
            >
              <div>
                <span className="text-4xl font-black">{project.name}</span>
                <select
                  className="mx-3 px-2 outline-none appearance-none dark:bg-gray-800 hover:bg-slate-100 hover:dark:bg-gray-700 rounded cursor-pointer transition-all text-lg"
                  onChange={handleVersionChange}
                >
                  {project?.versions.map((v: any) => (
                    <option key={"version-" + v.id} value={v.id}>
                      {v.name}
                    </option>
                  ))}
                </select>
              </div>

              <a
                href={getCreateWorkPackageUrl(project.id)}
                target="_blank"
                rel="noopener noreferrer"
                className="mr-4 py-2 px-4 text-white bg-indigo-500 hover:bg-indigo-600 rounded transition-all flex items-center"
              >
                Create ticket
                <svg
                  aria-hidden="true"
                  focusable="false"
                  data-prefix="fas"
                  data-icon="external-link-alt"
                  className="svg-inline--fa fa-external-link-alt fa-w-16 w-4 h-4 ml-4"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                >
                  <path
                    fill="currentColor"
                    d="M432,320H400a16,16,0,0,0-16,16V448H64V128H208a16,16,0,0,0,16-16V80a16,16,0,0,0-16-16H48A48,48,0,0,0,0,112V464a48,48,0,0,0,48,48H400a48,48,0,0,0,48-48V336A16,16,0,0,0,432,320ZM488,0h-128c-21.37,0-32.05,25.91-17,41l35.73,35.73L135,320.37a24,24,0,0,0,0,34L157.67,377a24,24,0,0,0,34,0L435.28,133.32,471,169c15,15,41,4.5,41-17V24A24,24,0,0,0,488,0Z"
                  ></path>
                </svg>
              </a>
            </div>
            <div className="flex">
              {selectedVersion &&
                getUsers().map((user: any) => (
                  <span
                    key={"user-" + user?.id}
                    className="grid place-items-center ml-1"
                    title={user?.name ?? "Unassigned"}
                  >
                    <img
                      onClick={() =>
                        setSelectedUser(
                          selectedUser === user?.id ? null : user?.id
                        )
                      }
                      src={getAvatarUrl(user?.name)}
                      alt="assignee name"
                      className={`w-8 h-8 rounded-full cursor-pointer ${
                        selectedUser === user?.id
                          ? "border-4 border-sky-600"
                          : ""
                      }`}
                    />
                  </span>
                ))}
            </div>
          </div>
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex flex-row gap-2">
              {selectedVersion &&
                selectedVersion.statuses
                  .filter((s: any) => displayedStatus?.includes(s.id))
                  .map((s: any) => (
                    <Droppable key={"status-" + s.id} droppableId={s.id + ""}>
                      {(provided, snapshot) => (
                        <div
                          className={`w-64 shrink-0 grow grid h-full bg-slate-100 dark:bg-gray-800 rounded transition-all ${
                            snapshot.isDraggingOver
                              ? "bg-slate-200 dark:bg-gray-700"
                              : ""
                          } `}
                          style={{
                            gridTemplateRows: "4rem 1fr",
                          }}
                        >
                          <span
                            className={`grid place-items-center uppercase font-extrabold bg-gradient-to-b from-slate-100 via-slate-100 dark:from-gray-800 dark:via-gray-800 rounded transition-all top-0 sticky  transition-all${
                              snapshot.isDraggingOver
                                ? "from-slate-200 via-slate-200 dark:from-gray-700 dark:via-gray-700"
                                : ""
                            }`}
                          >
                            {s.name}
                          </span>
                          <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className="h-full px-2 pb-2 flex flex-col"
                          >
                            {s.workPackages
                              .filter(
                                (wp: any) =>
                                  selectedUser === null ||
                                  wp.assignee?.id === selectedUser
                              )
                              .map((wp: any, index: number) => (
                                <Draggable
                                  key={"wp-" + wp.lockVersion + "-" + wp.id}
                                  draggableId={wp.id + ""}
                                  index={index}
                                >
                                  {(provided) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      className="mt-2 shrink-0 basis-32"
                                    >
                                      <WorkPackageCard
                                        workPackage={wp}
                                        onCardClicked={() =>
                                          setWorkPackageDetail(wp)
                                        }
                                      ></WorkPackageCard>
                                    </div>
                                  )}
                                </Draggable>
                              ))}
                            {provided.placeholder}
                          </div>
                        </div>
                      )}
                    </Droppable>
                  ))}
            </div>
          </DragDropContext>
          {workPackageDetail && (
            <WorkPackageDetail
              workPackage={workPackageDetail}
              projectId={projectId}
              onClose={() => {
                setWorkPackageDetail(null);
              }}
              onUpdate={() => mutateProject(projectId as string)}
            ></WorkPackageDetail>
          )}
          <ProjectSettings
            selectedVersion={selectedVersion}
            displayedStatus={displayedStatus}
            setDisplayedStatus={setDisplayedStatus}
          ></ProjectSettings>
        </>
      )}
    </div>
  );
};

export default Project;
