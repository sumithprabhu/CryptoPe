import React, { useEffect, useState, useRef } from "react";
import { ethers, Contract, providers } from "ethers";
import Web3Modal from "web3modal";
import { contractABI, contractAddress } from "../utils/constants";

export const TransactionContext = React.createContext();

const { ethereum } = window;

export const TransactionsProvider = ({ children }) => {
  const [formData, setformData] = useState({
    fName: "",
    addressTo: "",
    amount: "",
    message: "",
  });
  const [currentAccount, setCurrentAccount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [transactionCount, setTransactionCount] = useState(
    localStorage.getItem("transactionCount")
  );
  const [transactions, setTransactions] = useState([]);
  const [members, setMembers] = useState([]);
  
  const [walletConnected, setWalletConnected] = useState(false);
  const [contract, setContract] = useState(null);
  const web3ModalRef = useRef();

  const createEthereumContract = async () => {
    const signer = await checkIfWalletIsConnect(true);
    setCurrentAccount(await signer.getAddress());
    const NContract = new Contract(contractAddress, contractABI, signer);
    setContract(NContract);
    
  };

  const handleChange = (e, name) => {
    setformData((prevState) => ({ ...prevState, [name]: e.target.value }));
  };
  const partialhandle=(fNamee,receivere)=>{
    setformData({fName:fNamee,addressTo:receivere,amount:"",message:""});
  }

  const getAllTransaction = async () => {
    try {
      if (ethereum) {
        const transactionsContract = contract;

        const availableTransactions =
          await transactionsContract.getAllTransactions(
            currentAccount
          );
        console.log(availableTransactions);
        const structuredTransactions = availableTransactions.map(
          (transaction) => ({
            fName: transaction.fName,
            addressTo: transaction.receiver,
            amount: parseInt(transaction.amount._hex) / 10 ** 18,
            message: transaction.message,
          })
        );

        console.log(structuredTransactions);

        setTransactions(structuredTransactions);
      } else {
        console.log("Ethereum is not present");
      }
    } catch (error) {
      console.log(error);
    }
  };


  const getAllMember = async () => {
    try {
      if (ethereum) {
        const transactionsContract = contract;

        const availableMembers =
          await transactionsContract.getAllMembers(
            currentAccount
          );
        console.log(availableMembers);
        const structuredMembers = availableMembers.map(
          (member) => ({
            fName: member.fname,
            addressTo: member.receiver,
          })
        );

        console.log(structuredMembers);

        setMembers(structuredMembers);
      } else {
        console.log("Ethereum is not present");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const checkIfWalletIsConnect = async (needSigner = false) => {
    // Connect to Metamask

    // Since we store `web3Modal` as a reference, we need to access the `current` value to get access to the underlying object
    const provider = await web3ModalRef.current.connect();
    const web3Provider = new providers.Web3Provider(provider);

    // If user is not connected to the Goerli network, let them know and throw an error
    const { chainId } = await web3Provider.getNetwork();
    if (chainId !== 80001) {
      window.alert("Change the network to shardeum");
      throw new Error("Change network to shardeum");
    }

    if (needSigner) {
      const signer = web3Provider.getSigner();
      return signer;
    }

    return web3Provider;
  };

  const checkIfTransactionsExists = async () => {
    try {
      if (ethereum) {
        const transactionsContract = contract;
        const currentTransactionCount =
          await transactionsContract.getTransactionCount();

        window.localStorage.setItem(
          "transactionCount",
          currentTransactionCount
        );
      }
    } catch (error) {
      console.log(error);

      throw new Error("No ethereum object");
    }
  };

  const connectWallet = async () => {
    try {
      // Get the provider from web3Modal, which in our case is MetaMask
      // When used for the first time, it prompts the user to connect their wallet
      await checkIfWalletIsConnect();
      const signer = await checkIfWalletIsConnect(true);
      setCurrentAccount(await signer.getAddress());
      //setWallet("Wallet connected")
      setWalletConnected(true);
    } catch (err) {
      console.error(err);
    }
    // const transactionsContract = await createEthereumContract();
    // const availableTransactions = await transactionsContract.getAllTransactions(currentAccount);
  };

  const sendTransaction = async () => {
    try {
      if (ethereum) {
        const { fName, addressTo, amount, message } = formData;
        const transactionsContract = contract;
        const parsedAmount = ethers.utils.parseEther(amount);

        await ethereum.request({
          method: "eth_sendTransaction",
          params: [
            {
              from: currentAccount,
              to: addressTo,
              gas: "0x5208",
              value: parsedAmount._hex,
            },
          ],
        });

        const transactionHash = await transactionsContract.addToBlockchain(
          currentAccount,
          fName,
          addressTo,
          parsedAmount,
          message
        );

        setIsLoading(true);
        console.log(`Loading - ${transactionHash.hash}`);
        await transactionHash.wait();
        console.log(`Success - ${transactionHash.hash}`);
        setIsLoading(false);

        //const transactionsCount = await transactionsContract.getTransactionCount();

        //setTransactionCount(transactionsCount.toNumber());
        window.location.reload();
      } else {
        console.log("No ethereum object");
      }
    } catch (error) {
      console.log(error);

      throw new Error("No ethereum object");
    }
  };

  useEffect(async () => {
    if (!walletConnected) {
      // Assign the Web3Modal class to the reference object by setting it's `current` value
      // The `current` value is persisted throughout as long as this page is open
      web3ModalRef.current = new Web3Modal({
        network: "mumbai",
        providerOptions: {},
        disableInjectedProvider: false,
      });

      connectWallet();
      createEthereumContract();
      
      
    }
  }, [walletConnected]);

  return (
    <TransactionContext.Provider
      value={{
        transactionCount,
        connectWallet,
        transactions,
        currentAccount,
        isLoading,
        sendTransaction,
        handleChange,
        formData,
        getAllTransaction,
        partialhandle,
        getAllMember,
        members
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
