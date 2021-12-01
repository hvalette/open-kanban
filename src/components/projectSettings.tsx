import { useEffect, useState } from "react";

const ProjectSettings = ({
  selectedVersion,
  displayedStatus,
  setDisplayedStatus,
}: any) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (displayedStatus) {
      localStorage.setItem("status", JSON.stringify(displayedStatus));
    }
    if (displayedStatus === null && selectedVersion) {
      try {
        let storedStatus = JSON.parse(
          localStorage.getItem("status") ?? ""
        ) as number[];
        setDisplayedStatus(storedStatus);
      } catch (error) {
        localStorage.removeItem("status");
        const statusIds = selectedVersion.statuses.map((v: any) => v.id);
        setDisplayedStatus(statusIds);
        localStorage.setItem("status", JSON.stringify(displayedStatus));
      }
    }
  }, [displayedStatus, setDisplayedStatus, selectedVersion]);

  const handleStatusSettingsChange = (event: any) => {
    const statusId = Number(event.target.id);
    if (event.target.checked) {
      return setDisplayedStatus([...(displayedStatus ?? []), statusId]);
    }
    displayedStatus?.splice(
      displayedStatus.findIndex((id: number) => id === statusId),
      1
    ) ?? [];
    return setDisplayedStatus([...(displayedStatus ?? [])]);
  };
  return (
    <div
      className={`h-screen fixed w-64 bg-white dark:bg-gray-700 shadow-xl top-0 p-4 transition-all z-30 ${
        isOpen ? "right-0" : "-right-64"
      }`}
    >
      <div
        className="absolute right-full top-4 bg-slate-100 dark:bg-gray-800 py-4 rounded shadow-sm cursor-pointer hover:bg-slate-200 dark:hover:bg-gray-700"
        onClick={() => setIsOpen(!isOpen)}
      >
        <svg
          aria-hidden="true"
          focusable="false"
          data-prefix="fas"
          data-icon="angle-left"
          className={`svg-inline--fa fa-angle-left fa-w-8 w-8 min-w-fit h-8 transition-all ${
            isOpen ? "rotate-180" : " "
          }`}
          role="img"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 256 512"
        >
          <path
            fill="currentColor"
            d="M31.7 239l136-136c9.4-9.4 24.6-9.4 33.9 0l22.6 22.6c9.4 9.4 9.4 24.6 0 33.9L127.9 256l96.4 96.4c9.4 9.4 9.4 24.6 0 33.9L201.7 409c-9.4 9.4-24.6 9.4-33.9 0l-136-136c-9.5-9.4-9.5-24.6-.1-34z"
          ></path>
        </svg>
      </div>
      <div className="text-2xl font-black">Settings</div>
      <div>
        <div className="text-2xl mt-4 mb-2">Status</div>
        {selectedVersion &&
          selectedVersion.statuses.map((status: any) => (
            <div key={"settings-status-" + status.id}>
              <label className="cursor-pointer">
                <input
                  type="checkbox"
                  id={status.id}
                  name={status.id}
                  className="mr-2"
                  checked={!!displayedStatus?.includes(status.id)}
                  onChange={handleStatusSettingsChange}
                />
                {status.name}
              </label>
            </div>
          ))}
      </div>
    </div>
  );
};

export default ProjectSettings;
