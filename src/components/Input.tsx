import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
//state
import {
  commandInput,
  modifiedCommandInput,
  onBoard,
  boardPosition,
  initError,
  robotFacingDirection,
} from "../store/Atom";
//import constants from staysTheSame
import * as STAYSTHESAME from "../staysTheSame/index";
import Console from "./Console";

//Component
const Input: React.FC = () => {
  //Set recoil state
  const [command, setCommand] = useRecoilState(commandInput);
  const [modifiedCommand, setModifiedCommand] = useRecoilState(
    modifiedCommandInput
  );
  const [robotOnTheBoard, setRobotOnTheBoard] = useRecoilState(onBoard);
  const [initErrors, setInitErrors] = useRecoilState(initError);
  const [boardPositions, setBoardPositions] = useRecoilState(boardPosition);
  const [robotDirection, setRobotDirection] = useRecoilState(
    robotFacingDirection
  );
  let [newCommand, setNewCommand] = useState(true);

  //useEffect to set state for and to control Robot logic:
  useEffect(() => {
    //take user input command array and assign index values to new variables
    let initInput: string = modifiedCommand[0];
    let xAxisValue: any = modifiedCommand[1];
    let yAxisValue: any = modifiedCommand[2];
    let directionFacing: string = modifiedCommand[3];

    //Switch statement that checks commands - logic to control errors and robots within each case:
    if (initInput === "PLACE") {
      setRobotOnTheBoard(true);
    }
    if (robotOnTheBoard && newCommand) {
      switch (initInput) {
        //place the robot on the board
        case "PLACE":
          if (
            xAxisValue >= 0 &&
            xAxisValue <= 4 &&
            yAxisValue >= 0 &&
            yAxisValue <= 4
          ) {
            setBoardPositions({
              x: parseInt(xAxisValue, 10),
              y: parseInt(yAxisValue, 10),
            });
            setInitErrors(STAYSTHESAME.ERRORS.nextCommand);
            if (STAYSTHESAME.FACING_DIRECTIONS.includes(directionFacing)) {
              setRobotDirection(directionFacing);
              setInitErrors(STAYSTHESAME.ERRORS.nextCommand);
            } else {
              setInitErrors(STAYSTHESAME.ERRORS.wrongDirection);
            }
          } else {
            setInitErrors(STAYSTHESAME.ERRORS.wrongCoordinate);
          }
          break;
        //turn left
        case "LEFT":
          switch (robotDirection) {
            case "NORTH":
              setRobotDirection("WEST");
              break;
            case "EAST":
              setRobotDirection("NORTH");
              break;
            case "SOUTH":
              setRobotDirection("EAST");
              break;
            case "WEST":
              setRobotDirection("SOUTH");
              break;
          }
          setNewCommand(false);
          break;
        //turn right
        case "RIGHT":
          switch (robotDirection) {
            case "NORTH":
              setRobotDirection("EAST");
              break;
            case "EAST":
              setRobotDirection("SOUTH");
              break;
            case "SOUTH":
              setRobotDirection("WEST");
              break;
            case "WEST":
              setRobotDirection("NORTH");
              break;
          }
          setNewCommand(false);
          break;
        //move around table
        case "MOVE":
          //check which direction robot is facing
          switch (robotDirection) {
            case "NORTH":
              if (boardPositions.y < STAYSTHESAME.TABLE_DIMENSION.y - 1) {
                setBoardPositions({
                  x: boardPositions.x,
                  y: boardPositions.y + 1,
                });
              }
              break;
            case "EAST":
              if (boardPositions.x < STAYSTHESAME.TABLE_DIMENSION.x - 1) {
                setBoardPositions({
                  x: boardPositions.x + 1,
                  y: boardPositions.y,
                });
              }
              break;
            case "SOUTH":
              if (boardPositions.y > 0) {
                setBoardPositions({
                  x: boardPositions.x,
                  y: boardPositions.y - 1,
                });
              }
              break;
            case "WEST":
              if (boardPositions.x > 0) {
                setBoardPositions({
                  x: boardPositions.x - 1,
                  y: boardPositions.y,
                });
              }
              break;
          }
          break;
        //report where robot is
        case "REPORT":
          console.log(
            `Robot at: X: ${boardPositions.x}, Y: ${boardPositions.y}. Facing: ${robotDirection}`
          );
          break;
        default:
          setInitErrors(
            "Enter PLACE,X,Y,F to start. This will put the robot on the table in position X,Y and facing NORTH, SOUTH, EAST or WEST, "
          );
      }
    } else {
      setInitErrors(
        "Enter PLACE X,Y,F - will put the toy robot on the table in position X,Y and facing NORTH, SOUTH, EAST or WEST."
      );
    }
  }, [
    modifiedCommand,
    setInitErrors,
    robotOnTheBoard,
    setRobotOnTheBoard,
    setBoardPositions,
    robotDirection,
    setRobotDirection,
  ]);

  // React.MouseEvent<HTMLButtonElement> - I know I need to use this but can't make it work - How do I do it correctly?
  //Handles the onClick mouse event - Splits input command string into an array of strings. Sets that new array to 'modified command' state
  const onSubmit = (e: any) => {
    e.preventDefault();
    let splitStringCommand = (input: string) => {
      let initialString: any = input.split(",");
      let arrayOfStrings: any = initialString.map((s: string) => s.trim());
      setModifiedCommand(arrayOfStrings);
    };
    splitStringCommand(command);
    e.target.reset();
    setNewCommand(true);
  };

  //Handles user input commands and sets them to 'command' state
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCommand(e.target.value.toUpperCase());
  };

  return (
    <div>
      <div>Tell the robot what to do...</div>
      <form onSubmit={onSubmit}>
        <input
          onChange={handleChange}
          name="robotCommands"
          type="text"
          placeholder="Take the robot for a spin!"
        />
        <button>Go</button>
        <button>Reset</button>
      </form>
      {/* <p>{initErrors}</p> */}
      <p>{robotOnTheBoard}</p>
      <p>x: {boardPositions.x}</p>
      <p>y: {boardPositions.y}</p>
      <p>Facing: {robotDirection}</p>
    </div>
  );
};

export default Input;
