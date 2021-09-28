import React, { Component, useEffect, useState } from 'react';
import { Button, Card, Container, Col, Row, Modal } from 'react-bootstrap';

class Sell extends Component {
  handleClose = () => setShow(false);
  handleShow = () => setShow(true);

  render() {
    [show, setShow] = useState(false);
    return (
      <Modal.Dialog>
        <Modal.Header closeButton>
          <Modal.Title>Modal title</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p>Modal body text goes here.</p>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary">Close</Button>
          <Button variant="primary">Save changes</Button>
        </Modal.Footer>
      </Modal.Dialog>
    );
  }
}

export default Sell;