import { ACTIONS } from "./page"; // Adjust the path if necessary

interface DigitButtonProps {
  dispatch: React.Dispatch<any>;
  digit: string;
}

export default function DigitButton({ dispatch, digit }: DigitButtonProps) {
  return (
    <button onClick={() => dispatch({ type: ACTIONS.ADD_DIGIT, payload: { digit } })}>
      {digit}
    </button>
  );
}
