// SPDX-License-Identifier: GPL-3.0

//        _..._                                                                    _..._                                                     
//     .-'_..._''.                      _______                                 .-'_..._''.                                                  
//   .' .'      '.\             _..._   \  ___ `'.                            .' .'      '.\              .           __.....__              
//  / .'                      .'     '.  ' |--.\  \.-.          .-           / .'                       .'|       .-''         '.            
// . '                       .   .-.   . | |    \  '\ \        / /          . '                       .'  |      /     .-''"'-.  `.          
// | |                 __    |  '   '  | | |     |  '\ \      / /           | |                 __   <    |     /     /________\   \         
// | |              .:--.'.  |  |   |  | | |     |  | \ \    / /            | |              .:--.'.  |   | ____|                  |    _    
// . '             / |   \ | |  |   |  | | |     ' .'  \ \  / /             . '             / |   \ | |   | \ .'\    .-------------'  .' |   
//  \ '.          .`" __ | | |  |   |  | | |___.' /'    \ `  /               \ '.          .`" __ | | |   |/  .  \    '-.____...---. .   | / 
//   '. `._____.-'/ .'.''| | |  |   |  |/_______.'/      \  /                 '. `._____.-'/ .'.''| | |    /\  \  `.             .'.'.'| |// 
//     `-.______ / / /   | |_|  |   |  |\_______|/       / /                    `-.______ / / /   | |_|   |  \  \   `''-...... -'.'.'.-'  /  
//              `  \ \._,\ '/|  |   |  |             |`-' /                              `  \ \._,\ '/'    \  \  \               .'   \_.'   
//                  `--'  `" '--'   '--'              '..'                                   `--'  `"'------'  '---'                       

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SmartContract is ERC721Enumerable, Ownable {
  using Strings for uint256;
  string public baseURI;
  string public baseExtension = ".json";
  uint256 public cost = 0.003 ether; // 1 ,2 ,3
  uint256 public maxSupply = 2222;
  uint256 public maxMintAmount = 157; // one user can mint only 5 nfts 
  bool public paused = false;
  mapping(address => bool) public whitelisted;

  constructor(
    string memory _name,
    string memory _symbol,
    string memory _initBaseURI
  ) ERC721(_name, _symbol) {
    setBaseURI(_initBaseURI);
    mint(msg.sender, 50); // msg.sender means you (the deployer )
  }

  // internal
  function _baseURI() internal view virtual override returns (string memory) {
    return baseURI;
  }
  // public
  function mint(address _to, uint256 _mintAmount) public payable {
    uint256 supply = totalSupply();
    require(!paused,"gasscase1");
    require(_mintAmount > 0,"gasscase2");
    require(_mintAmount <= maxMintAmount,"gasscase3");
    require(supply + _mintAmount <= maxSupply,"gasscase4");

    if (msg.sender != owner()) {
        if(whitelisted[msg.sender] != true) {
          require(msg.value >= cost * _mintAmount,"gasscase5");
        }
    }

    for (uint256 i = 1; i <= _mintAmount; i++) {
      _safeMint(_to, supply + i);
    }
  }

  function walletOfOwner(address _owner)
    public
    view
    returns (uint256[] memory)
  {
    uint256 ownerTokenCount = balanceOf(_owner);
    uint256[] memory tokenIds = new uint256[](ownerTokenCount);
    for (uint256 i; i < ownerTokenCount; i++) {
      tokenIds[i] = tokenOfOwnerByIndex(_owner, i);
    }
    return tokenIds;
  }

  function tokenURI(uint256 tokenId)
    public
    view
    virtual
    override
    returns (string memory)
  {
    require(
      _exists(tokenId),
      "ERC721Metadata: URI query for nonexistent token"
    );

    string memory currentBaseURI = _baseURI();
    return bytes(currentBaseURI).length > 0
        ? string(abi.encodePacked(currentBaseURI, tokenId.toString(), baseExtension))
        : "";
  }

  //only owner
  function setCost(uint256 _newCost) public onlyOwner {
    cost = _newCost;
  }

  function setmaxMintAmount(uint256 _newmaxMintAmount) public onlyOwner {
    maxMintAmount = _newmaxMintAmount;
  }

  function setBaseURI(string memory _newBaseURI) public onlyOwner {
    baseURI = _newBaseURI;
  }

  function setBaseExtension(string memory _newBaseExtension) public onlyOwner {
    baseExtension = _newBaseExtension;
  }

  function pause(bool _state) public onlyOwner {
    paused = _state;
  }
 
 function whitelistUser(address _user) public onlyOwner {
    whitelisted[_user] = true;
  }
 
  function removeWhitelistUser(address _user) public onlyOwner {
    whitelisted[_user] = false;
  }

  function withdraw() public payable onlyOwner {
  require(payable(msg.sender).send(address(this).balance),'');
  }// the all money send to deployer account anyway
  //  you can get all money on contracts in mainnet, when we deploy our 
  //  contract to mainnet you will able to see the contract on opensea 
}
