// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Voting {
    struct Candidate {
        uint id;
        string name;
        uint voteCount;
    }

    struct Voter {
        bool hasVoted;
        uint votedFor;  // Store the candidate ID they voted for
    }

    mapping(uint => Candidate) public candidates;
    mapping(address => Voter) public voters;
    uint public candidatesCount;
    bool public electionActive;

    event votedEvent(uint indexed candidateId, address indexed voter);
    event electionStatusChanged(bool active);

    constructor() {
        addCandidate("Rama");
        addCandidate("Nick");
        addCandidate("Jose");
        electionActive = true;
    }

    modifier onlyActiveElection() {
        require(electionActive, "Election is not active");
        _;
    }

    function addCandidate(string memory _name) private {
        candidatesCount++;
        candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
    }

    function vote(uint _candidateId) public onlyActiveElection {
        require(!voters[msg.sender].hasVoted, "You have already voted in this election");
        require(_candidateId > 0 && _candidateId <= candidatesCount, "Invalid candidate ID");

        voters[msg.sender] = Voter({
            hasVoted: true,
            votedFor: _candidateId
        });
        
        candidates[_candidateId].voteCount++;

        emit votedEvent(_candidateId, msg.sender);
    }

    function hasVoted(address voter) public view returns (bool) {
        return voters[voter].hasVoted;
    }

    function getVotedCandidate(address voter) public view returns (uint) {
        return voters[voter].votedFor;
    }

    function getCandidates() public view returns (Candidate[] memory) {
        Candidate[] memory allCandidates = new Candidate[](candidatesCount);
        for (uint i = 1; i <= candidatesCount; i++) {
            allCandidates[i-1] = candidates[i];
        }
        return allCandidates;
    }

    function toggleElectionStatus() public {
        electionActive = !electionActive;
        emit electionStatusChanged(electionActive);
    }
} 