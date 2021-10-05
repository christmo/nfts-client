import React, { Component, useEffect, useState } from 'react';
import getWeb3 from './getWeb3';
import VolcanoTokenContract from './contracts/VolcanoToken.json';
import NFT from './components/NFT';
import MintToken from './components/MintToken';

import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { alpha } from '@mui/material/styles';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary
}));

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
      //const deployedNetwork = VolcanoTokenContract.networks[networkId];
	  const deployedNetwork = {
        address: '0x8145343153773fF8d7011a0bC50681Eeb074EB9b'
      };
      const instance = new web3.eth.Contract(
        VolcanoTokenContract.abi,
        deployedNetwork && deployedNetwork.address
      );

      console.log(await instance.methods.owner().call());

      let blockchain = {
        web3: web3,
        contract: instance,
        accounts: accounts
      };
      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ blockchain: blockchain }, this.loadData);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  };

  loadData = async () => {
    const { contract, accounts } = this.state.blockchain;
    const account = accounts[0];
    const {
      getListTokensCirculating,
      getOwnership,
      marketCap
    } = contract.methods;
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
    let nfts = await marketCap().call();
    this.setState({ tokens: edited, myTokens, marketCap: nfts });
  };

  onClickConnect = () => {
    console.log('click');
  };

  connectButton = () => {
    let button = (
      <Button variant="warning" onClick={this.onClickConnect}>
        Connect Wallet
      </Button>
    );
    if (this.state.blockchain && this.state.blockchain.accounts) {
      button = this.state.blockchain.accounts.map(acc =>
        <Button variant="success" key="{acc}">
          {acc.slice(0, 5)}...{acc.slice(acc.length - 5, acc.length)}
        </Button>
      );
    }
    return button;
  };

  render() {
    let nfts;
    if (this.state.blockchain && !this.state.blockchain.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    let button = this.connectButton();

    if (this.state.tokens) {
      nfts = this.state.tokens.map(token => {
        if (token.tokenId != 0) {
          return (
            <Grid item xs={3} key={token.tokenId}>
              <NFT token={token} blockchain={this.state.blockchain} />
            </Grid>
          );
        }
      });
    }
    return (
      <React.Fragment>
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="static" sx={{ background: '#191630' }}>
            <Toolbar>
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Volcano Tokens NFTs - Encode Academy
                <MintToken blockchain={this.state.blockchain} />
              </Typography>
              <Typography component="div">
                <strong>Market Cap: </strong>
                {this.state.marketCap}
              </Typography>
              {button}
              <Button color="inherit" sx={{ display: 'none' }}>
                Login
              </Button>
            </Toolbar>
          </AppBar>
        </Box>
        <CssBaseline />
        <Container
          maxWidth="xl"
          sx={{ background: '#191630', height: '100vh' }}
        >
          <Box sx={{ flexGrow: 1, pb: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={11} />
              <Grid item xs={1} />
            </Grid>
          </Box>

          <Grid container spacing={2}>
            {nfts}
          </Grid>
        </Container>
      </React.Fragment>
    );
  }
}

export default Home;
