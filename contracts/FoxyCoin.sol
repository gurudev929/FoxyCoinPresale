// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";

contract FoxyCoin is ERC20, ERC20Burnable, Ownable, ERC20Permit {
    address public prevenda = address(0x0);

    constructor(address initialOwner)
        ERC20("FoxyCoin", "Foxy")
        Ownable(initialOwner)
        ERC20Permit("FoxyCoin")
    {}

    // Modifier for checking of mint previlege 
    modifier onlyMinter() {
        require(msg.sender == owner() || msg.sender == prevenda, "Acesso nao autorizado");
        _;
    }

    // Set presale contract address
    function setPrevenda(address _prevenda) public onlyOwner {
        prevenda = _prevenda;
    }

    function mint(address to, uint256 amount) public onlyMinter {
        _mint(to, amount);
    }
}
