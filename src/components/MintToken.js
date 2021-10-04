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
import { NFTStorage, File } from 'nft.storage';

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

class MintToken extends Component {
  state = { open: false };

  handleClickOpen = async () => {
    this.setState({ open: true });
  };

  handleClose = async () => {
    this.setState({ open: false });
  };

  onFileUpload = () => {
    let nft = this.saveNFT('NFT', 'Minted by 0x', this.state.selectedFile);
	this.mint(nft);
  };

  mint = async nft => {
    console.log('mint');
    const { web3, accounts, contract } = this.props.blockchain;
    const account = accounts[0];
    const { mint, symbol } = contract.methods;

    let metadata = await nft;
    const ipfs = 'https://ipfs.io/ipfs';
    let path = ipfs + metadata.data.image.pathname.substring(1);
    console.log(path);
    this.setState({ image: path });
    await mint(this.state.image).send({ from: account });
  };

  saveNFT = async (name, description, file) => {
    const apiKey =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDZlYTIxM0EyMjIyOTExYTQzOGY5ZjRlODczMTg5YzAxMDZhQjRmMTgiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTYzMTQwMzA1MzkwNywibmFtZSI6Im5mdHMifQ.QN7funmxlMLL8NGmYQJmW2-w8zVkClFD0qcAn4zC0i0';
    const client = new NFTStorage({ token: apiKey });

    const metadata = await client.store({
      name: name,
      description: description,
      image: file
    });
    console.log(metadata);
    return metadata;
  };

  onFileChange = event => {
    this.setState({ selectedFile: event.target.files[0] });
  };
  
  mintToken = () => {
	
  };

  render() {

    return (
      <>
        <Button
          color="inherit"
          sx={{ ml: '8%', border: '1px dashed #f3f3f3' }}
		  onClick={this.handleClickOpen}
        >
          Mint
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
            Mint a new Volcano NFT 
          </BootstrapDialogTitle>
          <DialogContent dividers>
            <Typography gutterBottom>
              Upload a new image, it will be sent to IPFS, the URL will be registered in the token and will be immutable.
            </Typography>
            <Typography gutterBottom>
              Token Owner: 
            </Typography>
			<input type="file" onChange={this.onFileChange}/>
			<Button color="inherit" onClick={this.onFileUpload}>
                Upload Image
            </Button>
			<img style={{width: "550px"}} src={this.state.image} />
          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={this.mintToken}>
              Mint
            </Button>
          </DialogActions>
        </BootstrapDialog>
      </>
    );
  }
}

export default MintToken;
