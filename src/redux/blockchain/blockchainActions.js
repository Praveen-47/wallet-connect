// constants
import Web3EthContract from "web3-eth-contract";
import Web3 from "web3";
// log
import { fetchData } from "../data/dataActions";
import Web3Modal from "web3modal";

const connectRequest = () => {
  return {
    type: "CONNECTION_REQUEST",
  };
};

const connectSuccess = (payload) => {
  console.log('payload', payload)
  return {
    type: "CONNECTION_SUCCESS",
    payload: payload,
  };
};

const connectFailed = (payload) => {
  return {
    type: "CONNECTION_FAILED",
    payload: payload,
  };
};

const updateAccountRequest = (payload) => {
  return {
    type: "UPDATE_ACCOUNT",
    payload: payload,
  };
};

const providerOptions = {};

const web3Modal = new Web3Modal({
  network: "rinkeby", // optional
  cacheProvider: true, // optional
  providerOptions // required
});

export const connect = () => {
  return async (dispatch) => {
    dispatch(connectRequest());
    const provider = await web3Modal.connect();

    console.log(' -- -- -- ',provider);
    const abiResponse = await fetch("/config/abi.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const abi = await abiResponse.json();
    const configResponse = await fetch("/config/config.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const CONFIG = await configResponse.json();

    const { ethereum } = window;
    const metamaskIsInstalled = ethereum && ethereum.isMetaMask;
    console.log('metamaskIsInstalled', metamaskIsInstalled)
    if (metamaskIsInstalled) {
      // Web3EthContract.setProvider(ethereum);
      let web3 = new Web3(provider);
      console.log('web3=', web3)
      try {
        const accounts = await web3.eth.getAccounts();
        console.log('accounts==', accounts)
        const networkId = await web3.eth.net.getId();
        console.log('networkId', networkId)
        if (networkId == CONFIG.NETWORK.ID) {
          const SmartContractObj = new Web3EthContract(
            abi,
           CONFIG.CONTRACT_ADDRESS
          );

          console.log('SmartContractObj', SmartContractObj)
          dispatch(
            connectSuccess({
              account: accounts[0],
              smartContract: SmartContractObj,
              web3: web3,
            })
          );
          // Add listeners start
          web3.eth.on("accountsChanged", (accounts) => {
            dispatch(updateAccount(accounts[0]));
          });
          web3.eth.on("chainChanged", () => {
            window.location.reload();
          });
          // Add listeners end
        } else {
          dispatch(connectFailed(`Change network to ${CONFIG.NETWORK.NAME}.`));
        }
      } catch (err) {
        dispatch(connectFailed("Something went wrong."));
      }
    } else {
      dispatch(connectFailed("Install Metamask."));
    }
  };
};

export const updateAccount = (account) => {
  return async (dispatch) => {
    dispatch(updateAccountRequest({ account: account }));
    dispatch(fetchData(account));
  };
};
