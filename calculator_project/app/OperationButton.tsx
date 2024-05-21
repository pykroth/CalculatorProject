import { ACTIONS } from "./page"; // Adjust the path if necessary

interface OperationButton {
  dispatch: React.Dispatch<any>;
  digit: string;
}

export default function OperationButton({ dispatch, digit }: OperationButton) {
  return (
    <button onClick={() => dispatch({ type: ACTIONS.CHOOSE_OPERATION, payload: { digit } })}>
      {digit}
    </button>
  );
}
