import axios from "axios";
import { getSession } from "next-auth/react";

export const updateWorkPackageStatus = async (
  workPackage: any,
  statusId: number
) => {
  const session = await getSession();
  const accessToken = (session?.token as any).accessToken;
  const { data: res } = await axios.patch(
    `${process.env.NEXT_PUBLIC_OP_URL}/api/v3/work_packages/${workPackage.id}`,
    {
      lockVersion: workPackage.lockVersion,
      _links: {
        status: {
          href: `/api/v3/statuses/${statusId}`,
        },
      },
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return res;
};

export const updateWorkPackageAssignee = async (
  workPackage: any,
  userId: number | null
) => {
  const session = await getSession();
  const accessToken = (session?.token as any).accessToken;
  const { data: res } = await axios.patch(
    `${process.env.NEXT_PUBLIC_OP_URL}/api/v3/work_packages/${workPackage.id}`,
    {
      lockVersion: workPackage.lockVersion,
      _links: {
        assignee: {
          href: userId ? `/api/v3/users/${userId}` : null,
        },
      },
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return res;
};

export const getWorkPackageUrl = (workPackageId: number) => {
  return `${process.env.NEXT_PUBLIC_OP_URL}/work_packages/${workPackageId}`;
};

export const getCreateWorkPackageUrl = (projectId: number) => {
  return `${process.env.NEXT_PUBLIC_OP_URL}/projects/${projectId}/work_packages/new?type=6`;
};
