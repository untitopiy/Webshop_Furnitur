import {FetchBaseQueryError} from "@reduxjs/toolkit/query";
import {SerializedError} from "@reduxjs/toolkit";

export interface ISurveyField {
    id: string;
    title: string;
    type: string;
    options: {id: string, label: string}[] | null;
}

export interface ISurvey {
    id: number;
    title: string;
    status?: string;
}

export interface IAnswer {
    id: number;
    user_id: number;
    survey_id: number;
    data: string;
}

export interface ISurveyListItem {
    id: string;
    title: string;
    data: string;
    answers?: IAnswer[];
}
export interface ISurveyItem {
    id: string;
    title: string;
    data: string;
}

export interface IConvertedSurvey {
    id: string;
    title: string;
    surveys: ISurveyItem[];
}

export interface useGetQueryResponse<T> {
    data: T;
    error?: FetchBaseQueryError | SerializedError;
    isLoading: boolean;
}

export interface IResponsePaginatedData<T> {
    page: number;
    totalPages: number;
    content: T[];
}