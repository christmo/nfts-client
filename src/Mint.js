import React, { Component, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import getWeb3 from './getWeb3';
import VolcanoTokenContract from './contracts/VolcanoToken.json';
import { NFTStorage, File } from 'nft.storage';

class Mint extends React.Component {
  state = {
    // Initially, no file is selected
    selectedFile: null,
    image: null
  };

  constructor(props) {
    super(props);
    console.log(props);
  }

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

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
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

  mint = async nft => {
    console.log('mint');
    const { web3, accounts, contract } = this.state;
    const account = accounts[0];
    const { mint, symbol } = contract.methods;

    let metadata = await nft;
    const ipfs = 'https://ipfs.io/ipfs';
    let path = ipfs + metadata.data.image.pathname.substring(1);
    console.log(path);
    this.setState({ image: path });
    await mint(this.state.image).send({ from: account });
    /*nft.then(metadata => {
      const ipfs = 'https://ipfs.io/ipfs';
      let path = ipfs + metadata.data.image.pathname.substring(1);
      console.log(path);
      this.setState({ image: path });
    });*/
  };

  image = () => {
    if (this.state.image) {
      return <img src={this.state.image} />;
    } else {
      //this.setState({ image: null });
    }
  };

  // On file select (from the pop up)
  onFileChange = event => {
    // Update the state
    this.setState({ selectedFile: event.target.files[0] });
  };

  // On file upload (click the upload button)
  onFileUpload = () => {
    // Create an object of formData
    //const formData = new FormData();

    // Update the formData object
    /*formData.append(
      'myFile',
      this.state.selectedFile,
      this.state.selectedFile.name
    );*/

    // Details of the uploaded file
    //console.log(this.state.selectedFile);

    // Request made to the backend api
    // Send formData object
    //axios.post('api/uploadfile', formData);
    let nft = this.saveNFT('NFT', 'Minted by 0x', this.state.selectedFile);
    this.mint(nft);
  };

  // File content to be displayed after
  // file upload is complete
  fileData = () => {
    if (this.state.selectedFile) {
      return (
        <div>
          <h2>File Details:</h2>
          <p>
            File Name: {this.state.selectedFile.name}
          </p>
          <p>
            File Type: {this.state.selectedFile.type}
          </p>
          <p>
            Last Modified:{' '}
            {this.state.selectedFile.lastModifiedDate.toDateString()}
          </p>
        </div>
      );
    } else {
      return (
        <div>
          <br />
          <h4>Choose before Pressing the Upload button</h4>
        </div>
      );
    }
  };

  render() {
    return (
      <div>
        <h1>Mint a new Token</h1>
        <h3>Upload image to NFT.storage!</h3>
        <div>
          <input type="file" onChange={this.onFileChange} />
          <button onClick={this.onFileUpload}>Upload!</button>
        </div>
        {this.fileData()}
        {this.image()}
      </div>
    );
  }
}

export default Mint;
