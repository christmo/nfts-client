import React, { Component, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Home.css';
import getWeb3 from './getWeb3';
import VolcanoTokenContract from './contracts/VolcanoToken.json';
import { Button, Card, Container, Col, Row } from 'react-bootstrap';

class Home extends Component {
  state = { storageValue: 0, web3: null, accounts: null, contract: null };

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

      //console.log(await instance.methods.owner().call());

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
    const { web3, accounts, contract } = this.state;
    const account = accounts[0];
    const { getOwnership } = contract.methods;
    let tokens = await getOwnership(account).call();
    this.setState({ tokens });
  };

  render() {
    let accounts;
    let nfts;
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    console.log(this.state.tokens);
    if (this.state.accounts) {
      accounts = this.state.accounts.map(acc =>
        <Button variant="success" key="{acc}">
          {acc.slice(0, 5)}...{acc.slice(acc.length - 5, acc.length)}
        </Button>
      );
    }

    if (this.state.tokens) {
      nfts = this.state.tokens.map(token =>
        <Card style={{ width: '18rem' }} key={token.tokenId}>
          <Card.Img variant="top" src={token.uri} />
          <Card.Body>
            <Card.Title>
              NFT {token.tokenId}
            </Card.Title>
            <Card.Text>Reference Text</Card.Text>
            <Button variant="primary">Go somewhere</Button>
          </Card.Body>
        </Card>
      );
    }
    return (
      <Container fluid>
        <Row className="justify-content-center">
          <Col xs md lg="auto">
            <h1>NFT Volcano Tokens</h1>
          </Col>
          <Col sm={1}>
            {accounts}
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
    );
  }
}

export default Home;
