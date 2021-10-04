import React, { Component, useEffect, useState } from 'react';
import getWeb3 from './getWeb3';
import VolcanoTokenContract from './contracts/VolcanoToken.json';
import {
  Button,
  Card,
  Container,
  Col,
  Row,
  Modal,
  Form
} from 'react-bootstrap';

class Home extends Component {
  state = {
    storageValue: 0,
    web3: null,
    accounts: null,
    contract: null,
    show: false,
    tokenToSell: {
      tokenId: 0,
      buyer: ''
    }
  };

  handleClose = () => this.setState({ show: false });
  handleShow = () => this.setState({ show: true });
  disableMyTokens = token => {
    let buyer = this.state.accounts[0];
    console.log(token.owner, buyer);
    if (token.owner == buyer) {
      return true;
    }
    return false;
  };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      //console.log(networkId);
      const deployedNetwork = VolcanoTokenContract.networks[networkId];
      const instance = new web3.eth.Contract(
        VolcanoTokenContract.abi,
        deployedNetwork && deployedNetwork.address
      );

      console.log(await instance.methods.owner().call());

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance }, this.loadData);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  };

  loadData = async () => {
    const { contract, accounts } = this.state;
    const account = accounts[0];
    const { getListTokensCirculating, getOwnership } = contract.methods;
    let tokens = await getListTokensCirculating().call();
    let edited = [];
    for (let i = 0; i < tokens.length; i++) {
      if (tokens[i].tokenId != 0) {
        edited.push({
          ...tokens[i],
          value: (Math.random() * 100).toFixed(2)
        });
      }
    }
    let myTokens = await getOwnership(account).call();
    this.setState({ tokens: edited, myTokens });
  };

  onClickConnect = () => {
    console.log('click');
  };
  buyToken = async token => {
    const { contract, accounts, web3 } = this.state;
    const { buy } = contract.methods;
    const account = accounts[0];
    let value = new web3.utils.BN(token.value);
    let tx = await buy(token.tokenId).send({
      from: account,
      value: web3.utils.fromWei(value, 'wei')
    });
    console.log(tx);
  };
  unlockToken = async token => {
    const { contract, accounts, web3 } = this.state;
    const buyer = accounts[0];
    let tokenToSell = {
      ...token,
      buyer: buyer
    };
    console.log(tokenToSell);
    this.setState({ tokenToSell: tokenToSell });
    this.handleShow();
  };

  allowToBuyToken = async token => {
    const { contract, formAddress } = this.state;
    const { allowBuy, approve, setApprovalForAll } = contract.methods;
    const buyer = formAddress;
    const seller = token.owner;
    let tx = await allowBuy(token.tokenId, 10, buyer).send({ from: seller });
    //let tx = await setApprovalForAll(buyer, true).send({
    //  from: seller
    //});
    //let tx = await approve(buyer, token.tokenId).send({
    //  from: seller
    //});
    console.log(tx);
    console.log(this.state);
    this.handleClose();
  };

  connectButton = () => {
    let button = (
      <Button variant="warning" onClick={this.onClickConnect}>
        Connect Wallet
      </Button>
    );
    if (this.state.accounts) {
      button = this.state.accounts.map(acc =>
        <Button variant="success" key="{acc}">
          {acc.slice(0, 5)}...{acc.slice(acc.length - 5, acc.length)}
        </Button>
      );
    }
    return button;
  };

  render() {
    let accounts;
    let nfts;
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    let button = this.connectButton();
    //console.log(this.state.tokens);
    if (this.state.tokens) {
      nfts = this.state.tokens.map(token => {
        if (token.tokenId != 0) {
          return (
            <Card style={{ width: '18rem' }} key={token.tokenId}>
              <Card.Img variant="top" src={token.tokenURL} />
              <Card.Body>
                <Card.Title>
                  NFT {token.tokenId}
                </Card.Title>
                <Card.Text>
                  Price: {token.value}
                </Card.Text>
                <Button
                  disabled={!this.disableMyTokens(token)}
                  variant="primary"
                  onClick={() => this.unlockToken(token)}
                >
                  Sell to
                </Button>
                <Button
                  disabled={this.disableMyTokens(token)}
                  variant="primary"
                  onClick={() => this.buyToken(token)}
                >
                  Buy
                </Button>
              </Card.Body>
            </Card>
          );
        }
      });
    }
    return (
      <div>
        <Container fluid>
          <Row className="justify-content-center">
            <Col xs md lg="auto">
              <h1>NFT Volcano Tokens</h1>
            </Col>
            <Col sm={1}>
              {button}
            </Col>
          </Row>
          <Row className="justify-content-center">
            <Col xs md lg="auto">
              <div>---</div>
              <Button as="a" href="/mint" variant="light">
                Mint
              </Button>
            </Col>
          </Row>
          <Row>
            <Col>
              <div>Gallery:</div>
            </Col>
          </Row>
          <Row md={6} xs="auto">
            {nfts}
          </Row>
        </Container>

        <Modal show={this.state.show} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Allow Buy Token</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Allow to buy the token {this.state.tokenToSell.tokenId} from the
            address: {this.state.tokenToSell.buyer}
            <Form>
              <Form.Group className="mb-3" controlId="formBuyerAddress">
                <Form.Label>Buyer Address</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="0x..."
                  onChange={e => this.setState({ formAddress: e.target.value })}
                />
                <Form.Text className="text-muted">
                  Address to allow buy the token
                </Form.Text>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formTokenPrice">
                <Form.Label>Token Price</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Price"
                  onChange={e => this.setState({ formPrice: e.target.value })}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleClose}>
              Close
            </Button>
            <Button
              variant="primary"
              onClick={() => this.allowToBuyToken(this.state.tokenToSell)}
            >
              Allow
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default Home;
