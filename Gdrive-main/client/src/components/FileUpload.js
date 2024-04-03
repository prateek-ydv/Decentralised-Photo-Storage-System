import {useState} from "react";
import axios from "axios";
import "./FileUpload.css"
const FileUpload =({contract, account, provider}) => {
    const[file,setFile]= useState(null);
    const[fileName,setFileName]=useState("No Image selected");

    const handleSubmit=async(e)=>{
        e.preventDefault();
        if(file) {
            try{
                const formData = new FormData();
                formData.append("file",file);

                const resFile = await axios({
                    method: "post",
                    url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
                    data: formData,
                    headers: {
                    pinata_api_key: `4b0ef7e16e7fcbe6f432`,
                    pinata_secret_api_key: `62f39c2d0560a22fab226b14f5e2a6195a1064dd1b68f3231e18c6e141dbf2d6`,
                    "Content-Type": "multipart/form-data",
                       },
                        });
                        const ImgHash = `ipfs://${resFile.data.IpfsHash}`;
                        const signer = contract.connect(provider.getSigner());
                        signer.add(account, ImgHash ); //gets the address and img hash to the add function of smart contract.

                         } catch(e){
                alert("unable to upload image to pinata");
            }
        }
        alert("sucessfully image uploaded");
            setFileName("No image selected");
            setFile(null);
    };
    const retrieveFile = (e) => {
      const data = e.target.files[0]; //files array of files object
       console.log(data);
      const reader = new window.FileReader();
      reader.readAsArrayBuffer(data);
      reader.onloadend = () => {
        setFile(e.target.files[0]);
      };
      setFileName(e.target.files[0].name);
      e.preventDefault();
    };
    return (
        <div className="top">
          <form className="form" onSubmit={handleSubmit}>
            <label htmlFor="file-upload" className="choose">
              Choose Image
            </label>
            <input
              disabled={!account}
              type="file"
              id="file-upload"
              name="data"
              onChange={retrieveFile}
            />
            <span className="textArea">Image: {fileName}</span>
            <button type="submit" className="upload" disabled={!file}>
              Upload Your File
            </button>
          </form>
        </div>
      );
};
export default FileUpload; 