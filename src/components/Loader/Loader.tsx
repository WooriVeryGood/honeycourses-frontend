import { Container, Spinner } from "react-bootstrap";
import PageView from "../../pages/PageView/PageView";

export default function Loader() {
  return (
    <PageView>
      <Container fluid className="d-flex justify-content-center">
        <Spinner className="my-auto" animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    </PageView>
  );
}
