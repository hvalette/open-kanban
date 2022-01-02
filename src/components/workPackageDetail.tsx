import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  mutateWorkPackage,
  mutateWorkPackageChildren,
  useProjectsMembers,
  useStatus,
  useWorkPackage,
  useWorkPackageActivities,
  useWorkPackageChildren,
} from "../utils/fetcher";
import {
  getWorkPackageUrl,
  updateWorkPackageAssignee,
  updateWorkPackageStatus,
} from "../utils/workPackages";
import Loader from "./loader";

const WorkPackageDetail = ({
  workPackage,
  projectId,
  onClose,
  onUpdate,
}: any) => {
  const { data, isLoading } = useWorkPackage(workPackage.id);
  const { data: children } = useWorkPackageChildren(workPackage.id);
  const { data: statuses } = useStatus();
  const { data: members } = useProjectsMembers(projectId);

  const [currentStatusId, setCurrentStatusId] = useState<any>();
  const [currentUserHref, setCurrentUserHref] = useState<any>();

  useEffect(() => {
    if (!currentStatusId && data) {
      setCurrentStatusId(data._embedded.status.id);
    }
  }, [currentStatusId, data]);

  useEffect(() => {
    if (!currentUserHref && data) {
      setCurrentUserHref(data._embedded.assignee?._links.self.href);
    }
  }, [currentUserHref, data]);

  const handleAssigneeChange = (event: any) => {
    const previousAssignee = currentUserHref;
    const newAssignee = event.target.value;
    setCurrentUserHref(newAssignee);
    let userId = null;
    if (newAssignee) {
      const userIdHref: string[] = newAssignee.split("/");
      userId = Number(userIdHref[userIdHref.length - 1]);
    }
    updateWorkPackageAssignee(data, userId)
      .then((res) => {
        data.lockVersion = res.lockVersion;
        toast.success(`User assigned has been changed`, {
          hideProgressBar: true,
        });
        onUpdate();
        mutateWorkPackage(data.id);
      })
      .catch(() => {
        toast.error(`Error while assigning the user`, {
          hideProgressBar: true,
        });
        setCurrentUserHref(previousAssignee);
      });
  };

  const handleStatusChange = (event: any) => {
    const previousStatus = currentStatusId;
    const newStatusId = event.target.value;
    setCurrentStatusId(
      statuses._embedded.elements.find(
        (status: any) => Number(status.id) === Number(newStatusId)
      )
    );
    updateWorkPackageStatus(data, newStatusId)
      .then((res) => {
        data.lockVersion = res.lockVersion;
        toast.success(`Status has been changed`, {
          hideProgressBar: true,
        });
        onUpdate();
        mutateWorkPackage(data.id);
      })
      .catch(() => {
        toast.error(`Error while changing status`, {
          hideProgressBar: true,
        });
        setCurrentStatusId(previousStatus);
      });
  };

  const handleTaskChecked = (event: any) => {
    const isChecked = event.target.checked;
    const taskId = event.target.name;
    let newStatus: any;
    if (isChecked) {
      newStatus = statuses._embedded.elements.find(
        (status: any) => status.name === "Closed"
      );
    } else {
      newStatus = statuses._embedded.elements.find(
        (status: any) => status.name === "New"
      );
    }
    const child = children._embedded.elements.find(
      (child: any) => Number(child.id) === Number(taskId)
    );
    updateWorkPackageStatus(child, newStatus.id)
      .then((res) => {
        child.lockVersion = res.lockVersion;
        mutateWorkPackageChildren(data.id);
      })
      .catch((error) => {
        console.log(error);
        toast.error(`Error while changing task status`, {
          hideProgressBar: true,
        });
      });
  };

  return (
    <div
      className="fixed top-0 left-0 w-screen h-screen bg-gray-900/50 z-40 grid place-items-center"
      onClick={onClose}
    >
      <div
        className="w-4/5 h-3/4 bg-white dark:bg-gray-700 rounded shadow-xl py-4 px-8 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {isLoading && (
          <div className="w-full h-full grid place-items-center">
            <Loader></Loader>
          </div>
        )}
        {data && (
          <div
            className="h-full grid"
            style={{ gridTemplateRows: "auto 1fr auto" }}
          >
            <header className="mb-2 text-slate-500 flex justify-between">
              <span>#{data.id}</span>
              <a
                href={getWorkPackageUrl(data.id)}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full text-slate-300 hover:text-slate-500 hover:bg-slate-100 dark:hover:bg-gray-600 transition-all cursor-pointer"
                title="Open in OpenProject"
              >
                <svg
                  aria-hidden="true"
                  focusable="false"
                  data-prefix="fas"
                  data-icon="external-link-alt"
                  className="svg-inline--fa fa-external-link-alt fa-w-16 w-5 h-5"
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
            </header>
            <div className="grid grid-cols-4 gap-8 h-full overflow-hidden">
              <div
                className="col-span-3 grid h-full overflow-hidden gap-4"
                style={{ gridTemplateRows: "auto auto 1fr" }}
              >
                <div className="text-xl font-semibold">
                  <span style={{ color: data._embedded.type.color }}>
                    {data._embedded.type.name}
                  </span>{" "}
                  : <span>{data.subject}</span>
                </div>
                <div className="opacity-70">
                  {data.description.html !== "" ? (
                    <span
                      dangerouslySetInnerHTML={{
                        __html: data.description.html,
                      }}
                    ></span>
                  ) : (
                    <span>No description set</span>
                  )}
                </div>
                <div>
                  {children &&
                    children._embedded.elements.map((child: any) => (
                      <div key={child.id}>
                        <label className="cursor-pointer">
                          <input
                            type="checkbox"
                            id={child.id}
                            name={child.id}
                            className="mr-2"
                            checked={child._links.status.title === "Closed"}
                            onChange={handleTaskChecked}
                          />
                          {child.subject}
                        </label>
                      </div>
                    ))}
                </div>
              </div>
              <div>
                <select
                  value={currentStatusId}
                  onChange={handleStatusChange}
                  className="px-4 py-1 mb-4 font-semibold rounded appearance-none w-full hover:opacity-90 cursor-pointer transition-all outline-none"
                  style={{
                    backgroundColor:
                      statuses &&
                      statuses._embedded.elements.find(
                        (status: any) => status.id === currentStatusId
                      )?.color,
                    color:
                      parseInt(
                        statuses &&
                          statuses._embedded.elements
                            .find(
                              (status: any) => status.id === currentStatusId
                            )
                            ?.color.replace("#", ""),
                        16
                      ) >
                      0xffffff / 2
                        ? "#000"
                        : "#fff",
                  }}
                >
                  {statuses &&
                    statuses._embedded.elements.map((status: any) => (
                      <option key={"status-" + status.id} value={status.id}>
                        {status.name}
                      </option>
                    ))}
                </select>
                <div className="mb-2">
                  <span>
                    Author :{" "}
                    <span className="font-semibold">
                      {data._embedded.author.name}
                    </span>
                  </span>
                </div>
                <div className="mb-2">
                  <span>
                    Assignee :{" "}
                    <select
                      value={currentUserHref}
                      onChange={handleAssigneeChange}
                      className="font-semibold appearance-none px-2 rounded dark:bg-gray-600 hover:bg-slate-100 dark:hover:bg-gray-500 cursor-pointer transition-all outline-none"
                    >
                      <option>Unassigned</option>
                      {members &&
                        members._embedded.elements.map((member: any) => (
                          <option
                            key={member._links.principal.href}
                            value={member._links.principal.href}
                          >
                            {member._links.principal.title}
                          </option>
                        ))}
                    </select>
                  </span>
                </div>
                <div className="mb-2">
                  <span>
                    Story points :{" "}
                    <span className="font-semibold">
                      {data.storypoints ?? "/"}
                      {/* TODO: point select */}
                    </span>
                  </span>
                </div>
                <div className="mb-2">
                  <span>
                    Version :{" "}
                    <span className="font-semibold">
                      {data._embedded.version.name ?? "/"}
                      {/* TODO: users select */}
                    </span>
                  </span>
                </div>
              </div>
            </div>

            <footer className=" text-slate-500 dark:text-gray-200 flex justify-end ">
              <button
                className="px-8 py-2 rounded hover:bg-slate-100 dark:hover:bg-gray-600 transition-all"
                onClick={onClose}
              >
                Close
              </button>
            </footer>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkPackageDetail;
