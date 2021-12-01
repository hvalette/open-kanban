import Image from "next/image";
import { getAvatarUrl } from "../utils/avatar";

const WorkPackageCard = ({ workPackage, onCardClicked }: any) => {
  return (
    <div
      className="h-full rounded bg-white dark:bg-gray-700 hover:bg-slate-50 dark:hover:bg-gray-600 p-2 border-l-8 shadow-sm flex justify-between flex-col"
      style={{
        borderColor: workPackage.type.color,
      }}
      onClick={onCardClicked}
    >
      <div> {workPackage.subject}</div>
      <div
        className="uppercase text-sm"
        style={{
          color: workPackage.type.color,
        }}
      >
        {workPackage.type.name}{" "}
      </div>
      <div className="flex justify-between">
        <div>
          <span className="text-xs px-3 bg-slate-200 dark:bg-gray-600 rounded-full text-gray-500 dark:text-gray-400">
            {workPackage.storyPoints ?? "-"}
          </span>
        </div>
        <div className="flex align-middle">
          <span className="px-2 text-gray-500">{"#" + workPackage.id}</span>
          {workPackage.assignee && (
            <Image
              src={getAvatarUrl(workPackage.assignee.name)}
              alt="assignee name"
              width={24}
              height={24}
              className="rounded-full"
              title={workPackage.assignee.name}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkPackageCard;
