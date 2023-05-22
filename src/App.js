import { useState, useEffect } from "react";
import { NFTStorage, File } from "nft.storage";
import { Buffer } from "buffer";
import { ethers } from "ethers";
import axios from "axios";

// Components
import Spinner from "react-bootstrap/Spinner";
import Navigation from "./components/Navigation";

// ABIs
import NFT from "./abis/NFT.json";

// Config
import config from "./config.json";

function App() {
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");

  const loadBlockchainData = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    setProvider(provider);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    // call AI API tp generate a image based on description
    const imageData = createImage();
  };

  const createImage = async (e) => {
    const API_URL =
      "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2";
    // const response = await fetch(
    //   "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2",
    //   {
    //     headers: {
    //       Authorization: "Bearer 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",
    //     },
    //     method: "POST",
    //     body: JSON.stringify({
    //       input: description,
    //       options: { wait_for_model: true },
    //     }),
    //   }
    // );
    axios
      .post(
        "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2",
        JSON.stringify({
          input: description,
          options: { wait_for_model: true },
          parameters: { max_length: 500 },
          // __root__: "h",
        }),
        {
          headers: {
            Authorization: `Bearer ${process.env.REACT_APP_HUGGING_FACE_API_KEY}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        console.log("hiiiii", response.data);
      })
      .catch((error) => {
        console.log("hoooooy", error);
      });
    const response = await axios({
      url: API_URL,
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.REACT_APP_HUGGING_FACE_API_KEY}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      data: JSON.stringify({
        input: description,
        options: { wait_for_model: true },
        parameters: { max_length: 500 },
        // __root__: "h",
      }),
      responseType: "arraybuffer",
    });
    const type = response.headers["content-type"];
    const data = response.data;

    const base64data = Buffer.form(data).toString("base64");
    const img = `data:${type};base64,` + base64data; // This is so we can render it on the page
    setImage(img);
    return data;
  };

  useEffect(() => {
    loadBlockchainData();
  }, []);

  return (
    <div>
      <Navigation account={account} setAccount={setAccount} />
      <div className="form">
        <form onSubmit={submitHandler}>
          <input
            type="text"
            placeholder="Create a name ..."
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
          <input
            type="text"
            placeholder="Create a description ..."
            onChange={(e) => setDescription(e.target.value)}
          />
          <input type="submit" value="Create & Mint" />
        </form>
        <div className="image">
          <img src={image} alt="AI generated image" />
        </div>
      </div>
      <p>
        View&nbsp;
        <a href="" target="_blank" rel="noreferrer">
          Metadata
        </a>
      </p>
    </div>
  );
}

export default App;
