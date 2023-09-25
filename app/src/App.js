import { useState, useEffect } from "react";
import { ReactComponent as BoardSVG } from "./board.svg";
import propTypes from "prop-types";
import "./App.css";
import { render } from "react-dom";

function Cell(props) {
  return <button className={props.name} onClick={props.onclick}></button>;
}
Cell.propTypes = {
  name: propTypes.string,
  onclick: propTypes.func,
};

function App() {
  const [state, setState] = useState({
    // -1 - Undefined | 1 - yellow | 2 - red
    board: Array(42).fill(-1),
    yellowNext: true,
    buttonPlace: "",
    actAnimation: false,
    addToBoard: [-1, -1],
    win: -1,
  });
  useEffect(() => {
    document.getElementById("ani").addEventListener("animationend", () => {
      setState((prevState) => {
        let arr = prevState.board.slice();
        arr[prevState.addToBoard[0]] = prevState.addToBoard[1];
        return {
          ...prevState,
          board: arr,
          actAnimation: false,
          buttonPlace: "",
          addToBoard: [-1, -1],
        };
      });
    });
  }, []);

  const resetBoard = () => {
    setState({
      board: Array(42).fill(-1),
      yellowNext: true,
      buttonPlace: "",
      actAnimation: false,
      addToBoard: [-1, -1],
      win: -1,
    });
  };

  const getBoardAniName = () => {
    if (state.actAnimation == true) {
      let a = state.addToBoard[0];
      while (a > 6) {
        a -= 7;
      }
      return "boardAnimationsAct" + (a + 1);
    }
    return "boardAnimations";
  };

  const checkCircleWin = (n, numMatch, color, check) => {
    const row = Math.ceil(n / 7);
    const col =
      (n > 34
        ? n - 35
        : n > 27
        ? n - 28
        : n > 20
        ? n - 21
        : n > 13
        ? n - 14
        : n > 6
        ? n - 7
        : n) + 1;
    // -1 - Undefined | 1 - yellow | 2 - red
    // Up
    if (row != 1 && (check == "Up" || check == "All")) {
      if (state.board[n - 7] != -1 && state.board[n - 7] == color) {
        if (numMatch == 1) {
          return color;
        } else if (checkCircleWin(n - 7, numMatch - 1, color, "Up") == color) {
          return color;
        }
      }
    }
    // Left-Up
    if (row != 1 && col != 1 && (check == "Left-Up" || check == "All")) {
      if (state.board[n - 8] != -1 && state.board[n - 8] == color) {
        if (numMatch == 1) {
          return color;
        } else if (
          checkCircleWin(n - 8, numMatch - 1, color, "Left-Up") == color
        ) {
          return color;
        }
      }
    }
    // Right-Up
    if (row != 1 && col != 7 && (check == "Right-Up" || check == "All")) {
      if (state.board[n - 6] != -1 && state.board[n - 6] == color) {
        if (numMatch == 1) {
          return color;
        } else if (
          checkCircleWin(n - 6, numMatch - 1, color, "Right-Up") == color
        ) {
          return color;
        }
      }
    }
    // Left
    if (col != 1 && (check == "Left" || check == "All")) {
      if (state.board[n - 1] != -1 && state.board[n - 1] == color) {
        if (numMatch == 1) {
          return color;
        } else if (
          checkCircleWin(n - 1, numMatch - 1, color, "Left") == color
        ) {
          return color;
        }
      }
    }
    // Right
    if (col != 7 && (check == "Right" || check == "All")) {
      if (state.board[n + 1] != -1 && state.board[n + 1] == color) {
        if (numMatch == 1) {
          return color;
        } else if (
          checkCircleWin(n + 1, numMatch - 1, color, "Right") == color
        ) {
          return color;
        }
      }
    }
    // Down
    if (row != 6 && (check == "Down" || check == "All")) {
      if (state.board[n + 7] != -1 && state.board[n + 7] == color) {
        if (numMatch == 1) {
          return color;
        } else if (
          checkCircleWin(n + 7, numMatch - 1, color, "Down") == color
        ) {
          return color;
        }
      }
    }
    // Left-Down
    if (col != 1 && row != 6 && (check == "Left-Down" || check == "All")) {
      if (state.board[n + 6] != -1 && state.board[n + 6] == color) {
        if (numMatch == 1) {
          return color;
        } else if (
          checkCircleWin(n + 6, numMatch - 1, color, "Left-Down") == color
        ) {
          return color;
        }
      }
    }
    // Right-Down
    if (col != 7 && row != 6 && (check == "Right-Down" || check == "All")) {
      if (state.board[n + 8] != -1 && state.board[n + 8] == color) {
        if (numMatch == 1) {
          return color;
        } else if (
          checkCircleWin(n + 8, numMatch - 1, color, "Right-Down") == color
        ) {
          return color;
        }
      }
    }
    return -1;
  };

  const renderCell = (i) => {
    return (
      <Cell
        onclick={() => {
          if (state.board[i] != -1 || state.win != -1) {
            return;
          }
          let n = i;
          while (n > 6) {
            n -= 7;
          }
          while (n < 42) {
            if (n < 35) {
              if (state.board[n + 7] == -1) {
                n += 7;
                continue;
              }
            }
            let col = 0;
            if (state.yellowNext == true) {
              col = 1;
            } else {
              col = 2;
            }
            let winRet = checkCircleWin(n, 3, col, "All");
            setState((prevState) => {
              return {
                ...prevState,
                yellowNext: prevState.yellowNext ? false : true,
                buttonPlace: "ani" + (n + 1),
                actAnimation: true,
                addToBoard: [n, col],
                win: winRet != -1 ? winRet : -1,
              };
            });
            return;
          }
        }}
        name={
          state.board[i] == 2
            ? "cellRed"
            : state.board[i] == 1
            ? "cellYellow"
            : "cellWhite"
        }
      />
    );
  };

  let status = "";
  if (state.win != -1) {
    if (state.win == 1) {
      status = "Yellow wins!!";
    } else {
      status = "Red wins!!";
    }
  } else {
    if (state.yellowNext) {
      status = "Yellow's turn.";
    } else {
      status = "Red's turn.";
    }
  }
  return (
    <>
      <h1>Connect-4</h1>
      <div className="board">
        <BoardSVG
          className={
            state.actAnimation == true ? "boardShellAct" : "boardShell"
          }
        />
        <div className="cellBoard">
          <div className="row1">
            {renderCell(0)}
            {renderCell(1)}
            {renderCell(2)}
            {renderCell(3)}
            {renderCell(4)}
            {renderCell(5)}
            {renderCell(6)}
          </div>
          <div className="row2">
            {renderCell(7)}
            {renderCell(8)}
            {renderCell(9)}
            {renderCell(10)}
            {renderCell(11)}
            {renderCell(12)}
            {renderCell(13)}
          </div>
          <div className="row3">
            {renderCell(14)}
            {renderCell(15)}
            {renderCell(16)}
            {renderCell(17)}
            {renderCell(18)}
            {renderCell(19)}
            {renderCell(20)}
          </div>
          <div className="row4">
            {renderCell(21)}
            {renderCell(22)}
            {renderCell(23)}
            {renderCell(24)}
            {renderCell(25)}
            {renderCell(26)}
            {renderCell(27)}
          </div>
          <div className="row5">
            {renderCell(28)}
            {renderCell(29)}
            {renderCell(30)}
            {renderCell(31)}
            {renderCell(32)}
            {renderCell(33)}
            {renderCell(34)}
          </div>
          <div className="row6">
            {renderCell(35)}
            {renderCell(36)}
            {renderCell(37)}
            {renderCell(38)}
            {renderCell(39)}
            {renderCell(40)}
            {renderCell(41)}
          </div>
        </div>
        <div className={getBoardAniName()}>
          <div className={state.buttonPlace} id="ani">
            <span
              className={state.yellowNext == true ? "circleR" : "circleY"}
            ></span>
          </div>
        </div>
      </div>
      <div className="statusBar">
        <h4 className="status">{status}</h4>
        <button className="resetBtn" onClick={resetBoard}>
          Reset
        </button>
      </div>
    </>
  );
}

export default App;
