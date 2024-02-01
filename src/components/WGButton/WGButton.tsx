import { Button } from "react-bootstrap";

export enum WGButtonVariant {
  PRIMARY = "primary",
  SECONDARY = "secondary",
  OUTLINE_PRIMARY = "outline-primary",
  OUTLINE_DANGER = "outline-danger",
}

interface WGButtonProps {
  text: string;
  variant: WGButtonVariant;
  action: () => void;
  diabled?: boolean;
}

export const WGButton = (props: WGButtonProps) => {
  return <Button
    variant={props.variant}
    onClick={props.action}
    disabled={props.diabled}
    >
      {props.text}
    </Button>
};
