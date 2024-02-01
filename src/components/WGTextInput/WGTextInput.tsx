import { ElementType } from "react";
import Form from "react-bootstrap/Form";

interface WGTextInputProps {
  placeholder: string;
  text: string;
  onTextChange: (newText: string) => void;
  textarea?: ElementType<any>;
  className?: string;
  maxTextLength?: number
}

const WGTextInput = (props: WGTextInputProps) => {
  return <Form.Control
    as={props.textarea}
    type="text"
    value={props.text}
    onChange={(e) => {
      if (e.target.value.length <= (props.maxTextLength ?? 255)) {
        props.onTextChange(e.target.value)
      }
    }}
    placeholder={props.placeholder}
    required
    style={{ marginBottom: "0.5rem" }}
    className={props?.className}
  />
};

export default WGTextInput;