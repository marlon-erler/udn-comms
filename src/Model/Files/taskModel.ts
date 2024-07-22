// thile file is responsible for managing task files within chats.

import { FileContent } from "./fileModel";

export default class TaskFileModel {}

// types
export interface TaskFileContent extends FileContent {
    type: "task",

    board: string;
    category?: string;
    status?: string;

    description?: string;
    
    priority?: number;
    date?: string;
    time?: string;
}