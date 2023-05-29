import React from "https://cdn.skypack.dev/react@17.0.1";
import ReactDOM from "https://cdn.skypack.dev/react-dom@17.0.1";
import { createMachine, assign, send } from "https://cdn.skypack.dev/xstate";

// @xstate/react

function range(start, end) {
  return Array(end - start).
    fill(null).
    map((_, i) => i + start);
}

const winningLines = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]];


function checkWin(board) {
  for (let line of winningLines) {
    const xWon = line.every(index => {
      return board[index] === "x";
    });

    if (xWon) {
      return ["x", line];
    }

    const oWon = line.every(index => {
      return board[index] === "o";
    });

    if (oWon) {
      return ["o", line];
    }
  }

  return false;
}

const initialContext = {
  board: Array(9).fill(null),
  player: "x", // or 'o'
  winner: null,
  winningLine: null,
  moves: 0
};


const gameMachine = createMachine({
  initial: "playing",
  context: initialContext,
  states: {
    playing: {
      always: [
        {
          target: "winner",
          cond: ctx => !!checkWin(ctx.board),
          actions: assign({
            winner: ctx => checkWin(ctx.board)[0],
            winningLine: ctx => checkWin(ctx.board)[1]
          })
        },


        {
          target: "draw",
          cond: ctx => ctx.board.every(item => item)
        }],


      on: {
        PLAY: {
          target: "playing",
          actions: assign({
            board: (ctx, e) => {
              const updatedBoard = [...ctx.board];
              updatedBoard[e.value] = ctx.player;
              return updatedBoard;
            },
            player: ctx => ctx.player === "x" ? "o" : "x",
            moves: ctx => ctx.moves + 1
          }),

          cond: (ctx, e) => ctx.board[e.value] === null
        },

        RESET: undefined
      }
    },


    winner: {},
    draw: {}
  },

  on: {
    RESET: {
      target: ".playing",
      actions: assign(initialContext)
    }
  }
});




function App() {
  const [state, send] = React.useReducer(
    gameMachine.transition,
    gameMachine.initialState);


  const { winningLine } = state.context;

  return /*#__PURE__*/(
    React.createElement("main", null, /*#__PURE__*/
      React.createElement("div", null, /*#__PURE__*/
        React.createElement("header", null, /*#__PURE__*/
          React.createElement("h1", null, "Tic Tac Toe")),

        !state.matches("playing") && /*#__PURE__*/
        React.createElement("button", { className: "reset", onClick: () => send("RESET") }, "Reset"), /*#__PURE__*/



        React.createElement("div", { className: "game-board", "data-state": state.value },
          range(0, 9).map(index => {
            return /*#__PURE__*/(
              React.createElement("div", {
                className: "tile",
                key: index,
                onClick: () => send({ type: "PLAY", value: index }),
                "data-player": state.context.board[index],
                "data-winning": (winningLine === null || winningLine === void 0 ? void 0 : winningLine.includes(index)) || undefined
              },

                state.context.board[index]));


          }),
          range(0, 4).map(index => {
            return /*#__PURE__*/React.createElement("div", { className: "line", key: index, "data-line": index });
          })))));













}

ReactDOM.render( /*#__PURE__*/React.createElement(App, null), document.querySelector("#app"));
