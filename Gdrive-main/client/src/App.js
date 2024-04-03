import upload from "./artifacts/contracts/upload.sol/upload.json";
import { useState, useEffect } from "react";
import FileUpload from "./components/FileUpload";
import Display from "./components/Display";
import Modal from "./components/Modal";

import "./App.css";

function App() {
  const ethers = require("ethers")
  const [account,setAccount]=useState("");
  const [contract,setContract]=useState(null);
  const [provider,setProvider]=useState(null);
  const [modalOpen,setModalOpen]=useState(null);


  useEffect(() => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const loadProvider= async() =>{
      if (provider) {
        window.ethereum.on("chainChanged", () => {
          window.location.reload();
        });

        window.ethereum.on("accountsChanged", () => {
          window.location.reload();
        });
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);
        let contractAddress =
            "0x03D21f4Cd5A72FEC273448Ec45a370b92430b847";

        const contract = new ethers.Contract(
          contractAddress,
          upload.abi,
          signer 
        );
        //console.log(contract);
        setContract(contract);
        setProvider(provider);
      }else {
        console.error("metamask is not installed");
      }
    };
    provider && loadProvider()
  }, []);
  return(
    <>
    {!modalOpen && (
    <button className="share" onClick={() => setModalOpen(true)}>
      Share
      </button>
      )}{""}
      {modalOpen && 
      (<Modal setModalOpen ={setModalOpen} contract = {contract} ></Modal>)}
     <div className="App">
    <h1 style ={{color:"white"}}>Google Drive</h1>
    <div class="bg"></div>
    <div class="bg bg2"></div>
    <div class="bg bg3"></div>
    <p style ={{color:"white"}}>Account : {account ? account :"Please connect your Metamsk Account!!!!....."}
    </p>
    <FileUpload account ={account}
    provider = {provider}
    contract = {contract}> 
    </FileUpload>
    <Display contract = {contract} account={account}>

    </Display>
  </div> </>
  );
}
export default App;
