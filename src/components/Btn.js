import Button from "react-bootstrap/Button";

export const Btn = (props) => {
  return (
    <Button variant="light" size="sm" onClick={() => props.handler(props.val)}>
      {props.val}
    </Button>
  );
};
