import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

export const getWorkPackagesFromProject = async (
  projectId: string,
  req: any
) => {
  const session = await getSession({ req });
  const accessToken = (session?.token as any).accessToken;

  const { data: project } = await axios.get(
    `${process.env.NEXT_PUBLIC_OP_URL}/api/v3/projects/${projectId}`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );

  const { data: versions } = await axios.get(
    `${process.env.NEXT_PUBLIC_OP_URL}/api/v3/projects/${projectId}/versions`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
      params: { pageSize: 200 },
    }
  );
  const { data: statuses } = await axios.get(
    `${process.env.NEXT_PUBLIC_OP_URL}/api/v3/statuses`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
      params: { pageSize: 200 },
    }
  );
  const { data: types } = await axios.get(
    `${process.env.NEXT_PUBLIC_OP_URL}/api/v3/types`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
      params: { pageSize: 200 },
    }
  );
  const { data: workPackages, config } = await axios.get(
    `${process.env.NEXT_PUBLIC_OP_URL}/api/v3/projects/${projectId}/work_packages`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
      params: {
        pageSize: 2000,
        filters: JSON.stringify([{ type: { operator: "!", values: ["1"] } }]),
      },
    }
  );

  const result = {
    id: project.id,
    name: project.name,
    versions: versions._embedded.elements.map((version: any) => ({
      id: version.id,
      name: version.name,
      statuses: statuses._embedded.elements.map((status: any) => ({
        id: status.id,
        name: status.name,
        status: status.status,
        endDate: status.endDate,
        workPackages: workPackages._embedded.elements
          .filter((wp: any) => {
            if (!wp._links.version.href) {
              return false;
            }
            const versionHref: string[] = wp._links.version.href.split("/");
            const versionId = Number(versionHref[versionHref.length - 1]);
            if (!wp._links.status.href) {
              return false;
            }
            const statusHref: string[] = wp._links.status.href.split("/");
            const statusId = Number(statusHref[statusHref.length - 1]);
            return version.id === versionId && statusId === status.id;
          })
          .map((wp: any) => {
            const typeHref: string[] = wp._links.type.href.split("/");
            const typeId = Number(typeHref[typeHref.length - 1]);
            const type = types._embedded.elements.find(
              (t: any) => t.id === typeId
            );

            let author: any = null;
            if (wp._links.author.href) {
              const authorHref: string[] = wp._links.author.href.split("/");
              const authorId = Number(authorHref[authorHref.length - 1]);
              author = {
                id: authorId,
                href: wp._links.author.href,
                name: wp._links.author.title,
              };
            }
            let assignee: any = null;
            if (wp._links.assignee.href) {
              const assigneeHref: string[] = wp._links.assignee.href.split("/");
              const assigneeId = Number(assigneeHref[assigneeHref.length - 1]);
              assignee = {
                id: assigneeId,
                href: wp._links.assignee.href,
                name: wp._links.assignee.title,
              };
            }
            return {
              id: wp.id,
              subject: wp.subject,
              description: wp.description,
              storyPoints: wp.storyPoints ?? null,
              lockVersion: wp.lockVersion,
              author,
              assignee,
              type: {
                id: type.id,
                name: type.name,
                color: type.color,
              },
            };
          }),
      })),
    })),
  };

  return result;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { projectId } = req.query;
    const result = await getWorkPackagesFromProject(projectId as string, req);
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    throw new Error(error as string);
  }
}
