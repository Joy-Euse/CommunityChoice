let web3;
let contract;
let accounts;

const contractAddress ='0xD7d9E4EFa7CB0e63D975CB3B659c62aC1e19bbA6'; 
const contractABI = [
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "candidateId",
                "type": "uint256"
            }
        ],
        "name": "votedEvent",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "candidates",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
            },
            {
                "internalType": "string",
                "name": "name",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "voteCount",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "candidatesCount",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "voters",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_candidateId",
                "type": "uint256"
            }
        ],
        "name": "vote",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

async function init() {
    // Check if MetaMask is installed
    if (typeof window.ethereum !== 'undefined') {
        try {
            // Request account access
            accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            web3 = new Web3(window.ethereum);
            
            // Initialize contract
            contract = new web3.eth.Contract(contractABI, contractAddress);
            
            // Display connected account
            document.getElementById('account').textContent = accounts[0];
            document.getElementById('accountInfo').style.display = 'block';
            
            // Load candidates
            await loadCandidates();
            
            // Set up event listeners
            document.getElementById('voteButton').addEventListener('click', castVote);
            
            // Listen for account changes
            window.ethereum.on('accountsChanged', function (newAccounts) {
                accounts = newAccounts;
                document.getElementById('account').textContent = accounts[0];
            });
        } catch (error) {
            console.error("User denied account access");
        }
    } else {
        alert('Please install MetaMask to use this dApp!');
    }
}

async function loadCandidates() {
    const candidatesList = document.getElementById('candidatesList');
    const candidateSelect = document.getElementById('candidateId');
    candidatesList.innerHTML = '';
    candidateSelect.innerHTML = '';
    
    const count = await contract.methods.candidatesCount().call();
    
    for (let i = 1; i <= count; i++) {
        const candidate = await contract.methods.candidates(i).call();
        
        // Add to list
        const candidateElement = document.createElement('div');
        candidateElement.className = 'candidate-item';
        candidateElement.innerHTML = `
            <span>${candidate.name}</span>
            <span class="candidate-votes">${candidate.voteCount} votes</span>
        `;
        candidatesList.appendChild(candidateElement);
        
        // Add to select
        const option = document.createElement('option');
        option.value = candidate.id;
        option.textContent = candidate.name;
        candidateSelect.appendChild(option);
    }
}

async function castVote() {
    const candidateId = document.getElementById('candidateId').value;
    
    try {
        await contract.methods.vote(candidateId).send({ from: accounts[0] });
        alert('Vote cast successfully!');
        await loadCandidates(); // Refresh the candidates list
    } catch (error) {
        alert('Error casting vote: ' + error.message);
    }
}

// Initialize the app when the page loads
window.addEventListener('load', init); 