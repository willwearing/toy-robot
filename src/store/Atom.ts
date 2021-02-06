//Recoil state
import { atom } from "recoil";

//"Tell the robot what to do" state
type Default = string;

const initState: Default = "";

export const commandInput = atom({
  key: "commandInput",
  default: initState,
});

//Take the user input command and turn it into an array of strings

export const modifiedCommandInput = atom({
  key: "modifiedCommandInput",
  default: [],
});

//Invoke checking function state

export const invokeFunc = atom({
  key: "invokeFunc",
  default: false,
});

//Board position state

export const boardPosition = atom({
  key: "boardPosition",
  default: {
    x: 0,
    y: 0,
  },
});

//Robot direction state

//initError
export const initError = atom({
  key: "initError",
  default:
    "Enter PLACE,X,Y,F to start. This will put the robot on the table in position X,Y and facing NORTH, SOUTH, EAST or WEST, ",
});
