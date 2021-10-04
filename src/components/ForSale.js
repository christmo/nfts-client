import React, { Component, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuDialogContent-root': {
    padding: theme.spacing(2)
  },
  '& .MuDialogActions-root': {
    padding: theme.spacing(1)
  }
}));

const BootstrapDialogTitle = props => {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose
        ? <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: theme => theme.palette.grey[500]
            }}
          >
            <CloseIcon />
          </IconButton>
        : null}
    </DialogTitle>
  );
};

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired
};

class ForSale extends Component {
  state = { open: false };

  handleClickOpen = async () => {
    this.setState({ open: true });
  };

  handleClose = async () => {
    this.setState({ open: false });
  };

  unlockToken = async () => {
    console.log(this.state, this.props);
    const { contract, accounts, web3 } = this.props.blockchain;
    const buyer = accounts[0];
    let tokenToSell = {
      ...this.props.token,
      buyer: buyer
    };
    console.log(tokenToSell);
    //this.setState({ tokenToSell: tokenToSell });
    this.handleClose();
  };

  allowToBuyToken = async () => {
    const { buyerAddress } = this.state;
    const { contract } = this.props.blockchain;
    const { allowBuy, approve, setApprovalForAll } = contract.methods;
    const buyer = buyerAddress;
    const seller = this.props.token.owner;
    let tx = await allowBuy(this.props.token.tokenId, 10, buyer).send({
      from: seller
    });
    //let tx = await setApprovalForAll(buyer, true).send({
    //  from: seller
    //});
    //let tx = await approve(buyer, token.tokenId).send({
    //  from: seller
    //});
    console.log(tx);
    console.log(this.props);
    this.handleClose();
  };

  render() {
    let token = this.props.token;

    let displaySell = 'auto';
    let buyer = this.props.blockchain.accounts[0];
    if (this.props.token.owner == buyer) {
      displaySell = 'auto';
    } else {
      displaySell = 'none';
    }

    return (
      <div>
        <Button
          size="small"
          onClick={this.handleClickOpen}
          style={{ display: displaySell }}
        >
          For Sale
        </Button>
        <BootstrapDialog
          onClose={this.handleClose}
          aria-labelledby="customized-dialog-title"
          open={this.state.open}
        >
          <BootstrapDialogTitle
            id="customized-dialog-title"
            onClose={this.handleClose}
          >
            Sell NFT {token.tokenId}
          </BootstrapDialogTitle>
          <DialogContent dividers>
            <Typography gutterBottom>
              Allow to an address buy your token.
            </Typography>
            <Typography gutterBottom>
              Token Owner: {token.owner}
            </Typography>
            <TextField
              autoFocus
              margin="dense"
              id="buyer"
              label="Buyer Address"
              type="text"
              fullWidth
              variant="standard"
              onChange={e => this.setState({ buyerAddress: e.target.value })}
            />
            <TextField
              autoFocus
              margin="dense"
              id="price"
              label="Price"
              type="text"
              fullWidth
              variant="standard"
              onChange={e => this.setState({ price: e.target.value })}
              defaultValue={token.value}
            />
          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={this.allowToBuyToken}>
              Save changes
            </Button>
          </DialogActions>
        </BootstrapDialog>
      </div>
    );
  }
}

export default ForSale;
