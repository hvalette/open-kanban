import axios from "axios";
import { getSession } from "next-auth/react";
import useSWR, { mutate } from "swr";

export const fetcher = async (url: string) => {
  return axios.get(url).then((res) => res.data);
};

export const authenticatedFetcher = async (url: string) => {
  const session = await getSession();
  const accessToken = (session?.token as any).accessToken;
  return axios
    .get(url, { headers: { Authorization: `Bearer ${accessToken}` } })
    .then((res) => res.data);
};

export const useProjects = () => {
  const { data, error } = useSWR(
    `${process.env.NEXT_PUBLIC_OP_URL}/api/v3/projects`,
    authenticatedFetcher
  );

  return {
    data,
    isLoading: !error && !data,
    isError: error,
  };
};

export const useProject = (projectId: string) => {
  const { data, error } = useSWR(
    projectId ? `/api/projects/${projectId}` : null,
    projectId ? fetcher : null
  );

  return {
    data,
    isLoading: !error && !data,
    isError: error,
  };
};

export const mutateProject = (projectId: string) => {
  mutate(`/api/projects/${projectId}`);
};

export const useWorkPackage = (workPackageId: string) => {
  const { data, error } = useSWR(
    workPackageId
      ? `${process.env.NEXT_PUBLIC_OP_URL}/api/v3/work_packages/${workPackageId}`
      : null,
    workPackageId ? authenticatedFetcher : null
  );

  return {
    data,
    isLoading: !error && !data,
    isError: error,
  };
};

export const mutateWorkPackage = (workPackageId: string) => {
  mutate(
    `${process.env.NEXT_PUBLIC_OP_URL}/api/v3/work_packages/${workPackageId}`
  );
};

export const useWorkPackageActivities = (workPackageId: string) => {
  const { data, error } = useSWR(
    workPackageId
      ? `${process.env.NEXT_PUBLIC_OP_URL}/api/v3/work_packages/${workPackageId}/activities`
      : null,
    workPackageId ? authenticatedFetcher : null
  );

  return {
    data,
    isLoading: !error && !data,
    isError: error,
  };
};

export const useWorkPackageChildren = (workPackageId: string) => {
  const { data, error } = useSWR(
    workPackageId
      ? `${process.env.NEXT_PUBLIC_OP_URL}/api/v3/work_packages/?filters=[{"parent": { "operator": "=", "values": [${workPackageId}] }}]&pageSize=50`
      : null,
    workPackageId ? authenticatedFetcher : null
  );

  return {
    data,
    isLoading: !error && !data,
    isError: error,
  };
};

export const mutateWorkPackageChildren = (workPackageId: string) => {
  mutate(
    `${process.env.NEXT_PUBLIC_OP_URL}/api/v3/work_packages/?filters=[{"parent": { "operator": "=", "values": [${workPackageId}] }}]&pageSize=50`
  );
};

export const useStatus = () => {
  const { data, error } = useSWR(
    `${process.env.NEXT_PUBLIC_OP_URL}/api/v3/statuses/?pageSize=50`,
    authenticatedFetcher
  );

  return {
    data,
    isLoading: !error && !data,
    isError: error,
  };
};

export const useProjectsMembers = (projectId: string) => {
  const { data, error } = useSWR(
    projectId
      ? `${process.env.NEXT_PUBLIC_OP_URL}/api/v3/memberships?filters=[{"project": { "operator": "=", "values": [${projectId}] }}]&pageSize=500`
      : null,
    projectId ? authenticatedFetcher : null
  );

  return {
    data,
    isLoading: !error && !data,
    isError: error,
  };
};
