import { IAllUsersData, ICertificatesReports, IDashboardData, IDetailedLogs, IDocumentVerification, IReports, IUpdateDocumentStatus, IUpdateUser } from "@/lib/api/types";
import {

} from "@/types/api";
import { API } from "@/utils/fetch";

export async function fetchGetAllStats(): Promise<IDashboardData> {
  try {
    const endpoint = `dashboard`;
    const [data] = await API({
      endpoint,
      method: "GET",
    });
    return data;
  } catch (error) {
    throw error;
  }
}

// export async function fetchGetAllUsers(
//   page: number,
//   limit: number | string,
//   searchTerm?: string,
//   accountStatus?:string,
//   shipMemberRole?:string
// ): Promise<IAllUsersData> {
//   try {
//     const endpoint = searchTerm
//       ? `users?page=${page}&limit=${limit}&searchTerm=${searchTerm}`
//       : `users?page=${page}&limit=${limit}`;
//     const [data] = await API({
//       endpoint,
//       method: "GET",
//     });
//     return data;
//   } catch (error) {
//     throw error;
//   }
// }

export async function fetchGetAllUsers(
  page: number,
  limit: number | string,
  searchTerm?: string,
  accountStatus?: string,
  shipMemberRole?: string
): Promise<IAllUsersData> {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (searchTerm) params.append("searchTerm", searchTerm);
    if (accountStatus) params.append("accountStatus", accountStatus);
    if (shipMemberRole) params.append("shipMemberRole", shipMemberRole);

    const endpoint = `users?${params.toString()}`;

    const [data] = await API({
      endpoint,
      method: "GET",
    });

    return data;
  } catch (error) {
    throw error;
  }
}


export async function updateUser(params: IUpdateUser) {
  const { userId, payload } = params;
  try {
    const endpoint = `users/${userId}`;
    const [data] = await API({
      endpoint,
      method: "PATCH",
      payload,
    });
    return data;
  } catch (error) {
    throw error;
  }
}

export async function fetchGetAllDocumentsVerified(
  page: number,
  limit: number | string,
  searchTerm?: string
): Promise<IDocumentVerification> {
  try {
    const endpoint = searchTerm
      ? `documents?limit=${limit}&page=${page}&searchTerm=${searchTerm}`
      : `documents?limit=${limit}&page=${page}`;
    const [data] = await API({
      endpoint,
      method: "GET",
    });
    return data;
  } catch (error) {
    throw error;
  }
}

export async function updateDocumentStatus(params: IUpdateDocumentStatus) {
  const { documentId, payload } = params;
  try {
    const endpoint = `documents/${documentId}`;
    const [data] = await API({
      endpoint,
      method: "PATCH",
      payload,
    });
    return data;
  } catch (error) {
    throw error;
  }
}

export async function fetchGetAllCertificates(
  page: number,
  limit: number | string,
  searchTerm?: string
): Promise<ICertificatesReports> {
  try {
    const endpoint = searchTerm
      ? `certificates?limit=${limit}&page=${page}&searchTerm=${searchTerm}`
      : `certificates?limit=${limit}&page=${page}`;

    const [data] = await API({
      endpoint,
      method: "GET",
    });
    return data;
  } catch (error) {
    throw error;
  }
}

export async function fetchGetAllReports(
  userId: string,
  certificateName: string,
  year?: string
): Promise<{ success: true; data: IReports }> {
  try {
    const yearFilter  = year ? `&year=${year}` : ''
    const endpoint = `certificates/report/${userId}?certificateName=${certificateName}${yearFilter}`;

    const [data] = await API({
      endpoint,
      method: "GET",
    });
    return data;
  } catch (error) {
    throw error;
  }
}

export async function fetchGetAllDetailedLogs(
  page: number,
  limit: number | string,
  searchTerm?: string
): Promise<IDetailedLogs> {
  try {
    const endpoint = searchTerm
      ? `timelogs?limit=${limit}&page=${page}&searchTerm=${searchTerm}`
      : `timelogs?limit=${limit}&page=${page}`;

    const [data] = await API({
      endpoint,
      method: "GET",
    });
    return data;
  } catch (error) {
    throw error;
  }
}
