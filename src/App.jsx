import './App.css';
import { Navbar, Container, Nav, NavDropdown,Offcanvas } from 'react-bootstrap';
import ReactDOM from "react-dom";
import {
  Link,
  DirectLink,
  Element,
  Events,
  animateScroll,
  scrollSpy,
  scroller,
} from "react-scroll";
import dinoBackground from './res/dino-background.jpg';
import {useLayoutEffect, useEffect, useState, useRef } from "react";
import Aos from "aos";
import "aos/dist/aos.css";
import {GrFormClose} from 'react-icons/gr';
import {FaAlignJustify} from 'react-icons/fa';
import {BsInstagram} from 'react-icons/bs';
import { ImTwitter } from "react-icons/im";
import { SiDiscord } from "react-icons/si";

import Countdown from "react-countdown";

import dino_01 from "./res/dino_01.jpeg";
import dino_02 from "./res/dino_02.jpeg";
import rocketIcon from './res/free-rocket-icon.png';
import roadblock from './res/roadblock.png';
import roadmap_01 from './res/roadmap_01.png';
import roadmap_02 from './res/roadmap_02.png';

//blockchain
import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";


const aboutParagraphText = {
  fontSize: "1.5em",
  color:"#115E83",
};

const timeLabelStyle = {
  fontSize: "1em",
  fontWeight: "bold",
  color:"#115e83"
};

const successStyle = {
  backgroundColor: "#000000",
  padding: "0.2em 0.5em",
  borderRadius: "5px",
  color: "yellow",
  fontSize: "2em",
}

const errorStyle = {
  backgroundColor: "#000000",
  padding: "0.2em 0.5em",
  borderRadius: "5px",
  color: "red",
  fontSize: "2em",
}

const normalStyle = {
  backgroundColor: "#000000",
  padding: "0.2em 0.5em",
  borderRadius: "5px",
  color: "white",
  fontSize: "1.5em",
}


function App() {

  useEffect(() => {
    Aos.init({
      duration: 1000,
      delay: 200,
    });
  }, []);

  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const [claimingNft, setClaimingNft] = useState(false);
  const [feedback, setFeedback] = useState(`Click buy to mint your NFT.`);
  const [feedbackMsgStyle, setFeedbackMsgStyle] = useState(normalStyle);
  const [mintAmount, setMintAmount] = useState(1);
  const [CONFIG, SET_CONFIG] = useState({
    CONTRACT_ADDRESS: "",
    SCAN_LINK: "",
    NETWORK: {
      NAME: "",
      SYMBOL: "",
      ID: 0,
    },
    NFT_NAME: "",
    SYMBOL: "",
    MAX_SUPPLY: 1,
    WEI_COST: 0,
    DISPLAY_COST: 0,
    GAS_LIMIT: 0,
    MARKETPLACE: "",
    MARKETPLACE_LINK: "",
    SHOW_BACKGROUND: false,
  });

  const claimNFTs = () => {
    let cost = CONFIG.WEI_COST;
    let gasLimit = CONFIG.GAS_LIMIT;
    let totalCostWei = String(cost * mintAmount);
    let totalGasLimit = String(gasLimit * mintAmount);
    console.log("Cost: ", totalCostWei);
    console.log("Gas limit: ", totalGasLimit);
    setFeedback(`Minting your ${CONFIG.NFT_NAME}...`);
    setClaimingNft(true);
    blockchain.smartContract.methods
      .mint(blockchain.account, mintAmount)
      .send({
        gasLimit: String(totalGasLimit),
        to: CONFIG.CONTRACT_ADDRESS,
        from: blockchain.account,
        value: totalCostWei,
      })
      .once("error", (err) => {
        console.log(err);
        setFeedback("Sorry, something went wrong please try again later.");
        setClaimingNft(false);
        setFeedbackMsgStyle(errorStyle);
      })
      .then((receipt) => {
        console.log(receipt);
        setFeedback(
          `WOW, the ${CONFIG.NFT_NAME} is yours! go visit Opensea.io to view it.`
        );
        setClaimingNft(false);
        setFeedbackMsgStyle(successStyle);
        dispatch(fetchData(blockchain.account));
      });
  };

  const decrementMintAmount = () => {
    let newMintAmount = mintAmount - 1;
    if (newMintAmount < 1) {
      newMintAmount = 1;
    }
    setMintAmount(newMintAmount);
  };

  const incrementMintAmount = () => {
    let newMintAmount = mintAmount + 1;
    if (newMintAmount > 50) {
      newMintAmount = 50;
    }
    setMintAmount(newMintAmount);
  };

  const getData = () => {
    console.log('blockchain.account', blockchain.account)
    console.log('blockchain.smartContract', blockchain.smartContract)
    if (blockchain.account !== "" && blockchain.smartContract !== null) {
      dispatch(fetchData(blockchain.account));
    }
  };

  const getConfig = async () => {
    const configResponse = await fetch("/config/config.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const config = await configResponse.json();
    SET_CONFIG(config);
  };

  useEffect(() => {
    getConfig();
  }, []);

  useEffect(() => {
   let data =  getData();
   console.log('data', data)
  }, [blockchain.account]);

  const [expanded, setExpanded] = useState(false);
  //count down timer
  const now = new Date();
  const due = new Date("January 30, 2022 8:00:00");
  let countTime = due - now;

  // Random component
  const Completionist = () => <span>You are good to go!</span>;
  // Renderer callback with condition
  const renderer = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      // Render a completed state
      return <Completionist />;
    } else {
      // Render a countdown
      if (days < 10) {
        days = `0${days}`;
      }
      if (hours < 10) {
        hours = `0${hours}`;
      }
      if (minutes < 10) {
        minutes = `0${minutes}`;
      }
      if (seconds < 10) {
        seconds = `0${seconds}`;
      }

      return (
        <div className="d-flex justify-content-center">
          <div className="d-block">
            <span className="timeStyle">{days}</span>
            <p style={timeLabelStyle}>Days</p>
          </div>
          <div className="d-block">
            <span className="timeStyle">{hours}</span>
            <p style={timeLabelStyle}>Hours</p>
          </div>
          <div className="d-block">
            <span className="timeStyle">{minutes}</span>
            <p style={timeLabelStyle}>Minutes</p>
          </div>
          <div className="d-block">
            <span className="timeStyle">{seconds}</span>
            <p style={timeLabelStyle}>Seconds</p>
          </div>
        </div>
      );
    }
  };

  //count down timer end

  //get window size
  const [size, setSize] = useState([0, 0]);
  useLayoutEffect(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight]);
    }
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);
  //get window size end


  return (
    <div className="App">
      <Navbar
        fixed="top"
        expand={false}
        style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        expanded={expanded}
      >
        <Container fluid>
          <Navbar.Brand
            href="#"
            style={{ color: "#30d5c8", fontSize: "30px", fontWeight: "700" }}
          >
            Dino Society
          </Navbar.Brand>
      {
        size[0] >= 992?(
          //large screen
          <div className="d-flex justify-content-center" style={{width:"80%"}}>

                  <Link
                    activeClass="active"
                    className="largenavbar-link"
                    to="div-storytelling"
                    spy={true}
                    smooth={true}
                    duration={500}
                  >
                    Storytelling
                  </Link>

                  <Link
                    activeClass="active"
                    className="largenavbar-link"
                    to="div-roadmap"
                    spy={true}
                    smooth={true}
                    duration={500}
                  >
                    Roadmap
                  </Link>

                  <Link
                    activeClass="active"
                    className="largenavbar-link"
                    to="div-team"
                    spy={true}
                    smooth={true}
                    duration={500}
                  >
                    Team
                  </Link>


                  <Link
                    activeClass="active"
                    className="largenavbar-link"
                    to="div-mintpage"
                    spy={true}
                    smooth={true}
                    duration={500}
                  >
                    Mint
                  </Link>

 
                  <Link
                    activeClass="active"
                    className="largenavbar-link"
                    to="div-social"
                    spy={true}
                    smooth={true}
                    duration={500}
                  >
                    Contact
                  </Link>

          </div>
        ):(
          //small screen
          <>
          <FaAlignJustify onClick={() => setExpanded(expanded ? false : "expanded")} style={{ color: "white", fontSize:"1.7em", cursor:"pointer" }} />

          <Navbar.Offcanvas
            id="offcanvasNavbar"
            aria-labelledby="offcanvasNavbarLabel"
            placement="end"
          >
            <Offcanvas.Header>
              <Offcanvas.Title id="offcanvasNavbarLabel">
              Dino Society
              </Offcanvas.Title>
              <GrFormClose style={{cursor:"pointer",fontSize:"3em",opacity:"0.7"}} onClick={() => setExpanded(false)} />
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Nav className="justify-content-center flex-grow-1 pe-3">
                <Nav.Link className="navLinkStyle">
                  <Link
                    activeClass="active"
                    className="link"
                    to="div-storytelling"
                    spy={true}
                    smooth={true}
                    duration={500}
                    onClick={() => setExpanded(false)}
                  >
                    Storytelling
                  </Link>
                </Nav.Link>
                <Nav.Link className="navLinkStyle">
                  <Link
                    activeClass="active"
                    className="link"
                    to="div-roadmap"
                    spy={true}
                    smooth={true}
                    duration={500}
                    onClick={() => setExpanded(false)}
                  >
                    Roadmap
                  </Link>
                </Nav.Link>
                <Nav.Link className="navLinkStyle">
                  <Link
                    activeClass="active"
                    className="link"
                    to="div-team"
                    spy={true}
                    smooth={true}
                    duration={500}
                    onClick={() => setExpanded(false)}
                  >
                    Team
                  </Link>
                </Nav.Link>
                <Nav.Link className="navLinkStyle">
                  <Link
                    activeClass="active"
                    className="link"
                    to="div-mintpage"
                    spy={true}
                    smooth={true}
                    duration={500}
                    onClick={() => setExpanded(false)}
                  >
                    Mint
                  </Link>
                </Nav.Link>
                <Nav.Link className="navLinkStyle">
                  <Link
                    activeClass="active"
                    className="link"
                    to="div-social"
                    spy={true}
                    smooth={true}
                    duration={500}
                    onClick={() => setExpanded(false)}
                  >
                    Contact
                  </Link>
                </Nav.Link>
                
              </Nav>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
          </>
        )
      }
      </Container>
    </Navbar>

{/* 
      <Navbar
        fixed="top"
        expand={false}
        style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        expanded={expanded}
      >
        <Container fluid>
          <Navbar.Brand
            href="#"
            style={{ color: "#30d5c8", fontSize: "30px", fontWeight: "700" }}
          >
            Dino Society
          </Navbar.Brand>

          <FaAlignJustify onClick={() => setExpanded(expanded ? false : "expanded")} style={{ color: "white", fontSize:"1.7em", cursor:"pointer" }} />

          <Navbar.Offcanvas
            id="offcanvasNavbar"
            aria-labelledby="offcanvasNavbarLabel"
            placement="end"
          >
            <Offcanvas.Header>
              <Offcanvas.Title id="offcanvasNavbarLabel">
              Dino Society
              </Offcanvas.Title>
              <GrFormClose style={{cursor:"pointer",fontSize:"3em",opacity:"0.7"}} onClick={() => setExpanded(false)} />
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Nav className="justify-content-center flex-grow-1 pe-3">
                <Nav.Link className="navLinkStyle">
                  <Link
                    activeClass="active"
                    className="link"
                    to="div-storytelling"
                    spy={true}
                    smooth={true}
                    duration={500}
                    onClick={() => setExpanded(false)}
                  >
                    Storytelling
                  </Link>
                </Nav.Link>
                <Nav.Link className="navLinkStyle">
                  <Link
                    activeClass="active"
                    className="link"
                    to="div-roadmap"
                    spy={true}
                    smooth={true}
                    duration={500}
                    onClick={() => setExpanded(false)}
                  >
                    Roadmap
                  </Link>
                </Nav.Link>
                <Nav.Link className="navLinkStyle">
                  <Link
                    activeClass="active"
                    className="link"
                    to="div-team"
                    spy={true}
                    smooth={true}
                    duration={500}
                    onClick={() => setExpanded(false)}
                  >
                    Team
                  </Link>
                </Nav.Link>
                <Nav.Link className="navLinkStyle">
                  <Link
                    activeClass="active"
                    className="link"
                    to="div-mintpage"
                    spy={true}
                    smooth={true}
                    duration={500}
                    onClick={() => setExpanded(false)}
                  >
                    Mint
                  </Link>
                </Nav.Link>
                <Nav.Link className="navLinkStyle">
                  <Link
                    activeClass="active"
                    className="link"
                    to="div-social"
                    spy={true}
                    smooth={true}
                    duration={500}
                    onClick={() => setExpanded(false)}
                  >
                    Contact
                  </Link>
                </Nav.Link>
                
              </Nav>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar> */}

      <div id="div-hero" className="div-hero d-flex justify-content-center" style={{height:"100vh",alignItems:"center",backgroundImage:`url("${dinoBackground}")`,backgroundAttachment:"fixed",backgroundSize:"cover",backgroundColor:"rgba(0,0,0,0.5)",backgroundBlendMode:"multiply"}}>
        <div className="container-fluid">
          <div className="row">
            <div className="col-12 text-center">
            <h1
                data-aos="zoom-out-up"
                style={{
                  color: "white",
                  fontWeight: "800",
                  textAlign: "center",
                }}
                className="hero-topic"
              >
                Dino Society
              </h1>
              <p data-aos="fade-up" className="paraStyle">
                Lorem Ipsum is simply dummy text of the
              </p>
              <p data-aos="fade-up" className="mintedNFTs" style={{fontSize:"2em",fontWeight:"800",color:"yellow", textShadow:"1px 2px 3px rgba(0,0,0,0.5)"}}> 
                Total minted NFTs {data.totalSupply}/{CONFIG.MAX_SUPPLY}
              </p>
              <span data-aos="fade-up" className="feedBack" style={feedbackMsgStyle}>
                {feedback}
              </span>
              {/* <button
                id="btnMint"
                data-aos="fade-up"
                className="btn btn-lg mintButton"
              >MINT</button> */}

          {Number(data.totalSupply) == CONFIG.MAX_SUPPLY ? (
                <h1>The sale has ended.</h1>
              ) : (
                <div>
                  {blockchain.account === "" ||
                  blockchain.smartContract === null ? (
                    <div>
                      <button
                        id="btnMint"
                        data-aos="fade-up"
                        className="btn btn-lg mintButton"
                        onClick={(e) => {
                          e.preventDefault();
                          dispatch(connect());
                          getData();
                        }}
                      >
                        Connect
                      </button>
                      {blockchain.errorMsg !== "" ? (
                        <span data-aos="fade-up" className="feedBack" style={feedbackMsgStyle}>{blockchain.errorMsg}</span>
                      ) : null}
                    </div>
                  ) : (
                    <div>
                      <button
                        id="btnMint"
                        data-aos="fade-up"
                        className="btn btn-lg mintButton"
                        onClick={(e) => {
                          e.preventDefault();
                          claimNFTs(2);
                          getData();
                        }}
                      >
                        MINT
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Storytelling */}
      <div className="div-storytelling section-background">
        <div className="container py-5">
          <div className="row">
            <div className="col-12">
              <h1 data-aos="fade-up" className="heading">Storytelling</h1>
              <p data-aos="fade-up" className="mt-4" style={aboutParagraphText}>
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* empty section */}
      <div className="container-fluid" style={{backgroundImage:`url("${dinoBackground}")`,backgroundAttachment:"fixed",backgroundSize:"cover",backgroundColor:"rgba(0,0,0,0.5)",backgroundBlendMode:"multiply"}}>
        <div className="row">
          <div className="col-12" style={{ padding: "4em 0 4em 0" }}></div>
        </div>
      </div>

      {/*roadmap*/}
      <div className="div-roadmap section-background">
        <div className="container py-5">
          <div className="row">
            <div className="col-12">
              <h1 data-aos="fade-up" className="heading">Roadmap</h1>
              <p data-aos="fade-up" className="mt-4" style={aboutParagraphText}>
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
              </p>
            </div>
          </div>
          <div className="row">
            <div className="col-12 d-flex justify-content-center mb-3">
              <h2 className='roadmap-topic'>THE BEGINNING</h2>&nbsp;<img style={{width:"4em",height:"4em"}} src={rocketIcon} alt="" />
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <img src={roadmap_01} style={{width:"100%"}} alt="" />
            </div>
          </div>
          <div className="row">
            <div className="col-12 d-flex justify-content-center mb-3">
              <h2 className="roadmap-topic">THE DEVELOPMENT</h2>&nbsp;<img style={{width:"4em",height:"4em"}} src={roadblock} alt="" />
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <img src={roadmap_02} style={{width:"100%"}} alt="" />
            </div>
          </div>
          {/* <div className="row">
            <div className="col-12">
              <h4 className='text-left roadmap-sub-topic'>25% sell out</h4>
              <div className="roadmap-discription">
                <p className='roadmap-para'>🔹Free Airdrop: 10 lucky holders will be airdropped a Dino Society NFT.</p>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <h4 className='text-left roadmap-sub-topic'>50% sell out</h4>
              <div className="roadmap-discription">
              <p className='roadmap-para'>🔹Exclusive Raffle: We'll do a community raffle for 0.25ETH (10 winners). One lucky holder will receive 1 ETH.</p>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <h4 className='text-left roadmap-sub-topic'>75% sell out</h4>
              <div className="roadmap-discription">
              <p className='roadmap-para'>🔹Charity Donation: Donate $25,000 to a children's health charity. Community vote for which founder will receive our donation.</p>
              <p className='roadmap-para'>CEDARS Kids</p>
              <p className='roadmap-para'>The Children's Health Fund</p>
              <p className='roadmap-para'>The Make-A-Wish Foundation</p>
              <p className='roadmap-para'>🔹Merchandise Store: Launch our store and drop a limited collection. Limit 4 per wallet regardless of how many NFT you holding.</p>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <h4 className='text-left roadmap-sub-topic'>100% sold out.</h4>
              <div className="roadmap-discription">
              <p className='roadmap-para'>🔹Community Fund: Fund $30,000 to community wallet to finance the community’s creations, designs, and development. 10% of the OpenSea fees are dedicated to this special fund ensuring the Dino Society longevity through community projects.</p>
              <p className='roadmap-para'>🔹Listing on Rarity Tools</p>
              <p className='roadmap-para'>🔹Massive giveaways: to be announced, we like to surprise!!</p>
              </div>
            </div>

          <div className="row">
            <div className="col-12 d-flex justify-content-center mb-3">
              <h2 className="roadmap-topic">THE DEVELOPMENT</h2>&nbsp;<img style={{width:"4em",height:"4em"}} src={roadblock} alt="" />
            </div>
          </div>

          <div className="row">
            <div className="col-12">
              <h4 className='text-left roadmap-sub-topic'>Q2 2022 (FEB)</h4>
              <div className="roadmap-discription">
                <p className='roadmap-para'>Launch $DINOS token. $Dinos are our ERC-20 in-game currency used to power the Dino Society ecosystem.
              We are still making final decisions on how our rewards and incentives opportunities will operate, so we’ll update you as soon as possible.
              Acquired land in Sandbox as soon as the project sold out and prepare for our 🦕 playground in the Metaverse!</p>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <h4 className='text-left roadmap-sub-topic'>Q2 2022 (MAR)</h4>
              <div className="roadmap-discription">
              <p className='roadmap-para'>Launch 3D companion collection. Dino Society NFT holders will be able to claim their companions.
              Limited time apply, unclaimed companions will available for public sale.
              Initiate liquidity pool and airdrop token to our holder. Staking activated.
              25% secondary fee will be permanently dedicated to providing liquidity for our token $DINOS</p>
              </div>
            </div>
          </div> */}
        </div>
      </div>

      {/* empty section */}
      <div className="container-fluid" style={{backgroundImage:`url("${dinoBackground}")`,backgroundAttachment:"fixed",backgroundSize:"cover",backgroundColor:"rgba(0,0,0,0.5)",backgroundBlendMode:"multiply"}}>
        <div className="row">
          <div className="col-12" style={{ padding: "4em 0 4em 0" }}></div>
        </div>
      </div>

      {/* team */}
      <div className="div-team py-5 section-background">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <h1 data-aos="fade-up" className="heading">Team</h1>
              <p data-aos="fade-up" className="mt-4" style={aboutParagraphText}>
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
              </p>
            </div>
          </div>
          <div className="row justify-content-center">
            <div className="col-8 col-sm-7 col-md-6 col-lg-4 col-xl-3 text-center mb-3">
              <img src={dino_01} style={{width:"100%",borderRadius:"50%",boxShadow:"1px 1px 3px rgba(0,0,0,0.5)"}} alt="" />
              <h3>Founder: BAYC #2819 (Twitter: @BAYC2819)</h3>
            </div>
            <div className="col-8 col-sm-7 col-md-6 col-lg-4 col-xl-3 text-center mb-3">
              <img src={dino_02} style={{width:"100%",borderRadius:"50%",boxShadow:"1px 1px 3px rgba(0,0,0,0.5)"}} alt="" />
              <h3>Marketing Director: Rainis Hwin (Instagram: @raininstagram)</h3>
            </div>
            <div className="col-8 col-sm-7  col-md-6 col-lg-4 col-xl-3">
              <img src={dino_01} style={{width:"100%",borderRadius:"50%",boxShadow:"1px 1px 3px rgba(0,0,0,0.5)"}} alt="" />
              <h3>Artist: Arena Multimedia team</h3>
            </div>
            <div className="col-8 col-sm-7 col-md-6 col-lg-4 col-xl-3 text-center mb-3">
              <img src={dino_02} style={{width:"100%",borderRadius:"50%",boxShadow:"1px 1px 3px rgba(0,0,0,0.5)"}} alt="" />
              <h3>Developer: Praveen Matheesha (Instagram : @dexx_terrk)</h3>
            </div>
          </div>
        </div>
      </div>

      {/* empty section */}
      <div className="container-fluid" style={{backgroundImage:`url("${dinoBackground}")`,backgroundAttachment:"fixed",backgroundSize:"cover",backgroundColor:"rgba(0,0,0,0.5)",backgroundBlendMode:"multiply"}}>
        <div className="row">
          <div className="col-12" style={{ padding: "4em 0 4em 0" }}></div>
        </div>
      </div>

      {/* countdown */}
      <div className="div-countdown py-5 section-background">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <h1 data-aos="fade-up" style={{fontSize:"3em",color:"#115e83"}}>Lorem Ipsum is simply</h1>
            </div>
            <div className="col-12 mt-3">
              <Countdown
                date={Date.now() + countTime}
                renderer={renderer}
              />
            </div>
          </div>
        </div>
      </div>

      {/* empty section */}
      <div className="container-fluid" style={{backgroundImage:`url("${dinoBackground}")`,backgroundAttachment:"fixed",backgroundSize:"cover",backgroundColor:"rgba(0,0,0,0.5)",backgroundBlendMode:"multiply"}}>
        <div className="row">
          <div className="col-12" style={{ padding: "4em 0 4em 0" }}></div>
        </div>
      </div>

      {/* Minting page */}
      <div className="div-mintpage py-5 section-background">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <h1 data-aos="fade-up" className="heading">Lorem Ipsum</h1>
              <p data-aos="fade-up" className="mt-4" style={aboutParagraphText}>
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
              </p>
              <button
                id="btnMint"
                data-aos="fade-up"
                className="btn btn-lg blackMintButton"
              >
                MINT HEAR
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* empty section */}
      <div className="container-fluid" style={{backgroundImage:`url("${dinoBackground}")`,backgroundAttachment:"fixed",backgroundSize:"cover",backgroundColor:"rgba(0,0,0,0.5)",backgroundBlendMode:"multiply"}}>
        <div className="row">
          <div className="col-12" style={{ padding: "4em 0 4em 0" }}></div>
        </div>
      </div>

      {/* Social */}
      <div className="div-social py-5 section-background">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-md-6 d-flex justify-content-around mt-5">
              <div
                onClick={() =>
                  window.open("https://twitter.com")
                }
                className="contact-icons"
              >
                <ImTwitter className="icon" />
              </div>
              <div
                onClick={() =>
                  window.open("https://www.instagram.com/")
                }
                className="contact-icons"
              >
                <BsInstagram className="icon" />
              </div>
              <div
                onClick={() =>
                  window.open("https://discord.com")
                }
                className="contact-icons"
              >
                <SiDiscord className="icon" />
              </div>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
}

export default App;
