import React, { useContext, useRef, useState, useEffect } from 'react';
import ProfilePicture from "@dsalvagni/react-profile-picture";
import "@dsalvagni/react-profile-picture/dist/ProfilePicture.css";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { authContext } from '../../context/authContext/authContextProvider';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const Profile = () => {
  const { user } = useContext(authContext);
  const [productData, setProductData] = useState({
    url: "",
    description: "",
    model: "",
    id:"",
    username: "",
  });

  const [productList, setProductList] = useState([]);


  const save = async () => {
    const { v4: uuidv4 } = require('uuid');
    const productDataWithUsername = { ...productData, username: (user.username===undefined)?user:user.username ,id:uuidv4() };
    const api = `${process.env.REACT_APP_TO_BACKEND_URL}/users/addproduct`;
    const res = await fetch(api, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productDataWithUsername),
    });
    
    const response = await res.json();

    if (response) {
      updateProductList();
    } else {
      console.log("Error saving product");
    }
  };

  const updateProductList = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_TO_BACKEND_URL}/users/${(user.username === undefined) ? user : user.username}`);
      const response = await res.json();
        setProductList(response.products);
    } catch (error) {
      console.error("Error fetching user products:", error);
    }
  };

  useEffect(() => {
    updateProductList();
  }, []);

  const textEllipsis = (text) => {
    if (text.length > 100) {
      return text.slice(0, 100) + "...";
    }
    else
      return text;
  };

  return (
    <div className="flex justify-center items-center p-3 pb-4 w-fit mb-3 rounded-xl mt-[12vh] font-[Montserrat]" style={{width:"85%",boxShadow: "10px 10px 19px 0px rgba(0,0,0,0.75)"}}>
      <Card className="profileCard" style={{ width: "100%", }}>
        <CardContent>
          <Typography variant="h4" component="div" gutterBottom sx={{borderRadius:"10px",padding:"5px 0",textAlign:"center",backgroundColor:"#4e60fe",color:"white"}}>
            Hello {(user.username===undefined)?user:user.username} !
          </Typography>
          <div className="yourProducts text-center font-semibold mt-[2vh]">
            <p style={{fontSize:"25px",marginBottom:"10px"}}>Your Products:</p>
            <Grid container spacing={2} sx={{marginBottom:"10px"}}>
              {productList.map((product) => (
                <Grid item xs={12} sm={6} md={4} key={product.id}>
                  <Card>
                    <img src={product.url} alt={product.model} style={{ width: "100%" }} />
                    <CardContent>
                      <Typography variant="h6" component="div">
                        {product.model}
                      </Typography>
                      <Typography variant="body2" >
                      {textEllipsis(product.description)}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </div>
          <div className="addProducts flex flex-col text-center gap-y-3 font-semibold">
          <p style={{fontSize:"25px"}}>Add Products:</p>
          <TextField
              id="model-name"
              label="Image Public Link"
              variant="outlined"
              value={productData.url}
              onChange={(e) => setProductData({ ...productData, url: e.target.value })}
            />
            <TextField
              id="model-name"
              label="Model Name"
              variant="outlined"
              value={productData.model}
              onChange={(e) => setProductData({ ...productData, model: e.target.value })}
            />
            <TextField
              id="description"
              label="Description"
              variant="outlined"
              multiline
              rows={4}
              value={productData.description}
              onChange={(e) => setProductData({ ...productData, description: e.target.value })}
            />
            <Button variant="contained" color="success" onClick={save}>
              Save Product
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
