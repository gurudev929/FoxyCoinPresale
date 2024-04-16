// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.18;

import "./FoxyCoin.sol"; // Importando o contrato FoxyCoin

contract PreVenda is Ownable {
    FoxyCoin public foxyCoin; // Declaração da variável para o contrato FoxyCoin

    uint256 public tokenPreco = 5 * 10 ** 12; // Preço inicial do token FoxyCoin em USDT (0.20 USDT)
    // uint256 public tokenPreco = 25 * 10 ** 11; // (0.40 USDT)

    // Evento para emitir logs quando uma compra for realizada
    event Compra(address comprador, uint256 quantidade);
    event DebugText(string mensagem);

    // USDT contract address
    address public usdtCoin = 0x3Ee285421b114B2A8C89809F22CbeFe947F8F455; 

    // Construtor que define o endereço do dono do contrato e inicializa o contrato FoxyCoin
    constructor(address initialOwner, address _foxyCoinAddress) 
        Ownable(initialOwner)
    {
        foxyCoin = FoxyCoin(_foxyCoinAddress);
    }

    // Set foxycoin contract address
    function setFoxyCoinContract(address _foxyCoinAddress) public onlyOwner {
        foxyCoin = FoxyCoin(_foxyCoinAddress);
    }

    // Set presale contract address
    function setUsdtContract(address _usdtContract) public onlyOwner {
        usdtCoin = _usdtContract;
    }

    // Função para modificar o preço do token
    function modificarPreco(uint256 _novoPreco) external onlyOwner {
        tokenPreco = _novoPreco;
    }

    function preVenda(uint256 _valorComprado) external {
        emit DebugText("FUNCAO PRE VENDA INICIADA");
        
        // Definir e definir o endereço do contrato USDT
        ERC20 usdtContract = ERC20(usdtCoin);

        // Verifique o saldo USDT do remetente da mensagem
        require(usdtContract.balanceOf(msg.sender) >= _valorComprado, "USDT balance is not enough"); 

        // Verifique o limite de USDT do remetente da mensagem
        uint256 allowance = usdtContract.allowance(msg.sender, address(this));
        require(allowance >= _valorComprado, "Allowance of USDT is not valid");

        // Calcula a quantidade de tokens FoxyCoin com base no valor em USDT
        uint256 quantidadeTokens = _valorComprado * tokenPreco;

        // Inicia a transação para que a carteira do usuário comprador envie os USDTs para o dono do contrato
        require(usdtContract.transferFrom(msg.sender, owner(), _valorComprado), "Falha ao transferir USDTs");

        // Quando a transação for confirmada e os USDTs estiverem na carteira do dono do contrato,
        // Minta a quantidade de tokens FoxyCoin na carteira do usuário comprador
        foxyCoin.mint(msg.sender, quantidadeTokens);
    }
}
