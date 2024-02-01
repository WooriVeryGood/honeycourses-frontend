import { Button } from "react-bootstrap";

const WritePostButton = () => {
  return <Button
    href="/community/addPost"
    className="my-auto align-self-center"
    variant="success"
    size="sm"
    style={{
      marginLeft: "20px",
      backgroundColor: "#43A680",
      borderColor: "#43A680",
    }}
  >
    <img
      src="/images/plus.svg"
      className="bi"
      width="23"
      height="23"
      alt="github-icon"
    />
    글 작성
  </Button>
};

export default WritePostButton;