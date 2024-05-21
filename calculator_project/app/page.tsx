"use client";
import "./styles.css";
import { useReducer } from "react";
import DigitButton from "./ComponentButton";
import OperationButton from "./OperationButton";

// Define the state type
interface State {
  currentOperand: string | null;
  previousOperand: string | null;
  operation: string | null;

}

// Define the action type
interface Action {
  type: string;
  payload?: any;
}

export const ACTIONS = {
  ADD_DIGIT: 'add-digit',
  CHOOSE_OPERATION: 'choose-operation',
  CLEAR: 'clear',
  DELETE_DIGIT: 'delete-digit',
  EVALUATE: 'evaluate',
};
let overwrite = true;

// Move overwrite flag outside of the reducer


function reducer(state: State, { type, payload }: Action): State {
  console.log("StateOperation :", state.operation, "Previous Operation: ", state.previousOperand, "Current Operation:", state.currentOperand);
  
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      if (overwrite) {
        overwrite = false; // Reset overwrite flag when a new digit is added
        return {
          ...state,
          currentOperand: payload.digit,
        };
      }
      if (state.currentOperand === null) {
        return {
          ...state,
          currentOperand: payload.digit,
        };
      }
      if (payload.digit === "0" && state.currentOperand === "0") {
        return state;
      }
      if (payload.digit === "." && state.currentOperand !== null && state.currentOperand.includes(".")) {
        return state;
      }
      return {
        ...state,
        currentOperand: `${state.currentOperand || ''}${payload.digit}`,
      };
    case ACTIONS.CLEAR:
      overwrite = false; // Reset overwrite flag when clearing
      return {
        currentOperand: null,
        previousOperand: null,
        operation: null,
      };
    case ACTIONS.DELETE_DIGIT:
      if (state.currentOperand === null) return state;
      if (state.currentOperand.length === 1) {
        return {
          ...state,
          currentOperand: null,
        };
      }
      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1),
      };
    case ACTIONS.CHOOSE_OPERATION:
      overwrite = false; // Reset overwrite flag when choosing operation
      if (state.currentOperand === null && state.previousOperand === null) {
        return state;
      }
      if (state.currentOperand === null) {
        return {
          ...state,
          operation: payload.operation,
        };
      }
      if (state.previousOperand === null) {
        return {
          ...state,
          operation: payload.operation,
          previousOperand: state.currentOperand,
          currentOperand: null,
        };
      }
      return {
        ...state,
        previousOperand: evaluate(state),
        operation: payload.operation,
        currentOperand: null,
      };
    case ACTIONS.EVALUATE:
      overwrite = true;
      if (state.operation === null || state.currentOperand === null || state.previousOperand === null) {
        return state;
      }
      // Set overwrite to true after evaluation
      return {
        ...state,
        previousOperand: null,
        operation: null,
        currentOperand: evaluate(state) || "",
      };
    default:
      return state;
  }
}



function evaluate({ currentOperand, previousOperand, operation }: State): string{
  const prev = previousOperand ? parseFloat(previousOperand) :0;
  const current = currentOperand ? parseFloat(currentOperand) : 0;

  if (isNaN(prev) || isNaN(current)) return "";

  let computation = "";
  switch (operation) {
    case "+":
      computation = (prev + current).toString();
      break;
    case "-":
      computation = (prev - current).toString();
      break;
    case "*":
      computation = (prev * current).toString();
      break;
    case "÷":
      computation = (prev / current).toString();
      break;
    default:
      return "";
  }
  return computation;
}


export default function Home() {
  const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(reducer, {
    currentOperand: '',
    previousOperand: '',
    operation: null,
  });

  return (
    <div className="calculator-grid">
      <div className="output">
        <div className="previous-operand">{previousOperand}</div>
        <div className="current-operand">{currentOperand}</div>
      </div>

      <button className="span-two" onClick={() => dispatch({ type: ACTIONS.CLEAR })}>AC</button>
      <button onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}>DEL</button>
      <button onClick={() => dispatch({ type: ACTIONS.CHOOSE_OPERATION, payload: { operation: '÷' } })}>÷</button>
      <button onClick={() => dispatch({ type: ACTIONS.ADD_DIGIT, payload: { digit: '1' } })}>1</button>
      <button onClick={() => dispatch({ type: ACTIONS.ADD_DIGIT, payload: { digit: '2' } })}>2</button>
      <button onClick={() => dispatch({ type: ACTIONS.ADD_DIGIT, payload: { digit: '3' } })}>3</button>
      <button onClick={() => dispatch({ type: ACTIONS.CHOOSE_OPERATION, payload: { operation: '*' } })}>*</button>
      <button onClick={() => dispatch({ type: ACTIONS.ADD_DIGIT, payload: { digit: '4' } })}>4</button>
      <button onClick={() => dispatch({ type: ACTIONS.ADD_DIGIT, payload: { digit: '5' } })}>5</button>
      <button onClick={() => dispatch({ type: ACTIONS.ADD_DIGIT, payload: { digit: '6' } })}>6</button>
      <button onClick={() => dispatch({ type: ACTIONS.CHOOSE_OPERATION, payload: { operation: '+' } })}>+</button>
      <button onClick={() => dispatch({ type: ACTIONS.ADD_DIGIT, payload: { digit: '7' } })}>7</button>
      <button onClick={() => dispatch({ type: ACTIONS.ADD_DIGIT, payload: { digit: '8' } })}>8</button>
      <button onClick={() => dispatch({ type: ACTIONS.ADD_DIGIT, payload: { digit: '9' } })}>9</button>
      <button onClick={() => dispatch({ type: ACTIONS.CHOOSE_OPERATION, payload: { operation: '-' } })}>-</button>
      <button onClick={() => dispatch({ type: ACTIONS.ADD_DIGIT, payload: { digit: '.' } })}>.</button>
      <button onClick={() => dispatch({ type: ACTIONS.ADD_DIGIT, payload: { digit: '0' } })}>0</button>
      <button className="span-two" onClick={() => dispatch({type:ACTIONS.EVALUATE})}>=</button>
    </div>
  );
}
