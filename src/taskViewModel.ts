import * as React from "bloatless-react";

import BoardViewModel from "./ViewModel/Pages/boardViewModel";

export default class TaskViewModel {
    boardViewModel: BoardViewModel;

    // state
    name: React.State<string> = new React.State("");

    category: React.State<string> = new React.State("");
    status: React.State<string> = new React.State("");

    description: React.State<string> = new React.State("");

    priority: React.State<string> = new React.State("");
    date: React.State<string> = new React.State("");
    time: React.State<string> = new React.State("");

    // storage
    save = (): void => {}

    // init
    constructor(boardViewModel: BoardViewModel) {
        this.boardViewModel = boardViewModel;
    }
}