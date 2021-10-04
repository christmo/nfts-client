import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import ForSale from './ForSale';
//image="https://mui.com/static/images/cards/contemplative-reptile.jpg"
export default function NFT(props) {
  const onClickConnect = () => {
    console.log('click');
  };

  const buyToken = async () => {
    const { contract, accounts, web3 } = props.blockchain;
    const { buy } = contract.methods;
    const account = accounts[0];
    let value = props.token.value.toString();
    console.log(value.toString());
    let tx = await buy(props.token.tokenId).send({
      from: account,
      value: web3.utils.toWei(value, 'ether')
    });
    console.log(tx);
  };

  let displayBuy = 'auto';
  let buyer = props.blockchain.accounts[0];
  if (props.token.owner == buyer) {
    displayBuy = 'none';
  } else {
    displayBuy = 'auto';
  }

  let token = props.token;
  let blockchain = props.blockchain;
  if (token) {
    return (
      <Card sx={{ maxWidth: 345 }}>
        <CardMedia
          component="img"
          height="140"
          image={token.tokenURL}
          alt="green iguana"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            NFT {token.tokenId}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>Value: </strong>
            {token.value} ETH
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>Owner: </strong>
            {token.owner.slice(0, 10)}...{token.owner.slice(
              token.owner.length - 10,
              token.owner.length
            )}
          </Typography>
        </CardContent>
        <CardActions>
          <ForSale token={token} blockchain={blockchain} />
          <Button
            size="small"
            onClick={buyToken}
            style={{ display: displayBuy }}
          >
            Buy
          </Button>
        </CardActions>
      </Card>
    );
  }
  return null;
}
