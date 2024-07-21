export interface File {
  dataVersion: "v2";

  id: string;
  title: string;

  contentVersions: { [id: string]: FileContent };
}

export interface FileContent {
  dataVersion: "v2";

  id: string;
  creationDate: string;
}
