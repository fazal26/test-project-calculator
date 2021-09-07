import ButtonGroup from "react-bootstrap/ButtonGroup";
import { Col, Container, Row } from "react-bootstrap";
import { Btn } from "../components/Btn";
import { useState } from "react";
import { evaluate } from "mathjs";

export const Body = (props) => {
  const [expression, setExpression] = useState("");
  const [postfix, setPostfix] = useState(null);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);

  const appendInput = (data) => {
    switch (data) {
      case "C":
        return setExpression(expression.substr(0, expression.length - 1));
      case "CE":
        setResult(null);
        setPostfix(null);
        return setExpression("");
      default:
        return setExpression(expression + data);
    }
  };

  const calculate = () => {
    try {
      const result = evaluate(expression);
      const isFloat = result.toString().indexOf(".") !== -1;
      if (isFloat) {
        setResult(result.toFixed(2));
      } else {
        setResult(result);
        const postResult = computePostfix();
        const historyItem = (key) => (
          <div key={key}>
            <h4>{["=>", expression].join(" ")}</h4>
            <h4>{["~>", postResult].join(" ")}</h4>
            <h4>{["==", result].join(" ")}</h4>
          </div>
        );
        setHistory([...history, historyItem]);
      }
    } catch {
      setResult("Invalid Expression");
    }
  };

  const getPrecedence = (operator) => {
    if (operator === "+" || operator === "-") {
      return 1;
    } else if (operator === "*" || operator === "/") {
      return 2;
    }
  };

  const computePostfix = () => {
    const stackData = ["("];
    let result = "";
    let exp = expression + ")";

    for (let i = 0; i < exp.length; i++) {
      let item = exp[i];

      if (parseInt(item)) {
        result += item;
      } else {
        if (item === "(") {
          stackData.push(item);
        } else if (
          getPrecedence(item) < getPrecedence(stackData[stackData.length - 1])
        ) {
          result += stackData.pop();
          stackData.push(item);
        } else if (item === ")") {
          let ind = stackData.join("").lastIndexOf("(");
          for (let j = stackData.length - 1; j >= ind; j--) {
            let lastEle = stackData.pop();
            if (lastEle !== "(") {
              result += lastEle;
            }
          }
        } else {
          stackData.push(item);
        }
      }
    }
    setPostfix(result);
    return result;
  };

  return (
    <Container>
      <Row>
        <Col className="bg-dark text-center mx-3 py-3">
          <h1 className="text-center text-light">Calculator</h1>
          <Row>
            <ButtonGroup>
              <Btn val={"("} handler={appendInput} />
              <Btn val={"CE"} handler={appendInput} />
              <Btn val={")"} handler={appendInput} />
              <Btn val={"C"} handler={appendInput} />
            </ButtonGroup>
          </Row>
          <Row>
            <ButtonGroup>
              <Btn val={"1"} handler={appendInput} />
              <Btn val={"2"} handler={appendInput} />
              <Btn val={"3"} handler={appendInput} />
              <Btn val={"+"} handler={appendInput} />
            </ButtonGroup>
          </Row>
          <Row>
            <ButtonGroup>
              <Btn val={"4"} handler={appendInput} />
              <Btn val={"5"} handler={appendInput} />
              <Btn val={"6"} handler={appendInput} />
              <Btn val={"-"} handler={appendInput} />
            </ButtonGroup>
          </Row>
          <Row>
            <ButtonGroup>
              <Btn val={"7"} handler={appendInput} />
              <Btn val={"8"} handler={appendInput} />
              <Btn val={"9"} handler={appendInput} />
              <Btn val={"*"} handler={appendInput} />
            </ButtonGroup>
          </Row>
          <Row>
            <ButtonGroup>
              <Btn val={"."} handler={appendInput} />
              <Btn val={"0"} handler={appendInput} />
              <Btn val={"="} handler={calculate} />
              <Btn val={"/"} handler={appendInput} />
            </ButtonGroup>
          </Row>
        </Col>
        <Col className="bg-dark text-light rounded ">
          <h1 className="text-center">Result Container</h1>
          <h4>{["", expression].join(" ")}</h4>
          {postfix && <h4>{["Postfix Notation", postfix].join(": ")}</h4>}
          {result !== null && <h4>{["Result", result].join(": ")}</h4>}
        </Col>
        <Col className="bg-dark text-light rounded mx-3 ">
          <h1 className="text-center">History Container</h1>
          {history.map((item, index) => item(index))}
        </Col>
      </Row>
    </Container>
  );
};
