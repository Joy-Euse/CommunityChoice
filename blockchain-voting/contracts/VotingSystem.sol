// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title University Election Voting System
 * @dev Smart contract for managing university elections with secure voting
 */
contract VotingSystem {
    // Election status enum
    enum ElectionState { Created, Active, Ended }
    
    // Candidate struct
    struct Candidate {
        uint256 id;
        string name;
        string position;
        string party;
        uint256 voteCount;
    }
    
    // Voter struct
    struct Voter {
        string studentId;
        string department;
        uint256 yearOfStudy;
        bool isRegistered;
        bool hasVoted;
        mapping(string => bool) votedForPosition;
    }
    
    // Election struct
    struct Election {
        string title;
        uint256 startTime;
        uint256 endTime;
        ElectionState state;
        uint256 totalVoters;
        uint256 totalVotes;
    }

    // Add a new struct for voting categories
    struct VotingCategory {
        string id;
        string name;
        string description;
        string[] positions;
        bool isActive;
    }
    
    // Contract state variables
    address public admin;
    Election public currentElection;
    mapping(address => Voter) public voters;
    mapping(string => Candidate[]) public candidatesByPosition;
    string[] public positions;
    mapping(uint256 => Candidate) public candidatesById;
    uint256 public candidateCount;
    address[] public registeredVoters;

    // Add to contract state variables
    mapping(string => VotingCategory) public categories;
    string[] public categoryIds;
    uint256 public categoryCount;
    
    // Events
    event ElectionCreated(string title, uint256 startTime, uint256 endTime);
    event ElectionStarted(uint256 timestamp);
    event ElectionEnded(uint256 timestamp);
    event VoterRegistered(address indexed voterAddress, string studentId);
    event CandidateAdded(uint256 indexed candidateId, string name, string position);
    event VoteCast(address indexed voter, uint256 indexed candidateId, string position);

    // Add events
    event CategoryAdded(string id, string name);
    event CategoryRemoved(string id);
    
    // Modifiers
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can call this function");
        _;
    }
    
    modifier electionExists() {
        require(bytes(currentElection.title).length > 0, "No election has been created");
        _;
    }
    
    modifier electionActive() {
        require(currentElection.state == ElectionState.Active, "Election is not active");
        require(block.timestamp >= currentElection.startTime, "Election has not started yet");
        require(block.timestamp <= currentElection.endTime, "Election has already ended");
        _;
    }
    
    modifier voterNotRegistered() {
        require(!voters[msg.sender].isRegistered, "Voter is already registered");
        _;
    }
    
    modifier voterRegistered() {
        require(voters[msg.sender].isRegistered, "Voter is not registered");
        _;
    }
    
    modifier hasNotVotedForPosition(string memory position) {
        require(!voters[msg.sender].votedForPosition[position], "Already voted for this position");
        _;
    }
    
    // Constructor
    constructor() {
        admin = msg.sender;
    }
    
    /**
     * @dev Create a new election
     * @param _title Title of the election
     * @param _startTime Start time of the election (unix timestamp)
     * @param _endTime End time of the election (unix timestamp)
     */
    function createElection(string memory _title, uint256 _startTime, uint256 _endTime) public onlyAdmin {
        require(_startTime < _endTime, "End time must be after start time");
        require(_startTime > block.timestamp, "Start time must be in the future");
        
        // Reset previous election data if any
        if (bytes(currentElection.title).length > 0) {
            for (uint i = 0; i < positions.length; i++) {
                delete candidatesByPosition[positions[i]];
            }
            delete positions;
            candidateCount = 0;
        }
        
        currentElection = Election({
            title: _title,
            startTime: _startTime,
            endTime: _endTime,
            state: ElectionState.Created,
            totalVoters: 0,
            totalVotes: 0
        });
        
        emit ElectionCreated(_title, _startTime, _endTime);
    }
    
    /**
     * @dev Start the election
     */
    function startElection() public onlyAdmin electionExists {
        require(currentElection.state == ElectionState.Created, "Election cannot be started");
        currentElection.state = ElectionState.Active;
        emit ElectionStarted(block.timestamp);
    }
    
    /**
     * @dev End the election
     */
    function endElection() public onlyAdmin electionExists {
        require(currentElection.state == ElectionState.Active, "Election is not active");
        currentElection.state = ElectionState.Ended;
        emit ElectionEnded(block.timestamp);
    }

    /**
     * @dev Add a new voting category
     * @param _id Unique identifier for the category
     * @param _name Name of the category
     * @param _description Description of the category
     * @param _positions Array of position names in this category
     */
    function addCategory(string memory _id, string memory _name, string memory _description, string[] memory _positions) public onlyAdmin {
        require(bytes(categories[_id].name).length == 0, "Category ID already exists");
        
        categories[_id] = VotingCategory({
            id: _id,
            name: _name,
            description: _description,
            positions: _positions,
            isActive: true
        });
        
        categoryIds.push(_id);
        categoryCount++;
        
        emit CategoryAdded(_id, _name);
    }

    /**
     * @dev Remove a voting category
     * @param _id ID of the category to remove
     */
    function removeCategory(string memory _id) public onlyAdmin {
        require(bytes(categories[_id].name).length > 0, "Category does not exist");
        
        // Mark as inactive instead of deleting to preserve history
        categories[_id].isActive = false;
        
        emit CategoryRemoved(_id);
    }

    /**
     * @dev Get all active category IDs
     * @return Array of category IDs
     */
    function getCategories() public view returns (string[] memory) {
        uint256 activeCount = 0;
        
        // Count active categories
        for (uint i = 0; i < categoryIds.length; i++) {
            if (categories[categoryIds[i]].isActive) {
                activeCount++;
            }
        }
        
        // Create array of active category IDs
        string[] memory activeCategoryIds = new string[](activeCount);
        uint256 index = 0;
        
        for (uint i = 0; i < categoryIds.length; i++) {
            if (categories[categoryIds[i]].isActive) {
                activeCategoryIds[index] = categoryIds[i];
                index++;
            }
        }
        
        return activeCategoryIds;
    }

    /**
     * @dev Get category details
     * @param _id ID of the category
     * @return id, name, description, positions, isActive
     */
    function getCategoryDetails(string memory _id) public view returns (
        string memory id,
        string memory name,
        string memory description,
        string[] memory positions,
        bool isActive
    ) {
        require(bytes(categories[_id].name).length > 0, "Category does not exist");
        
        VotingCategory memory category = categories[_id];
        return (
            category.id,
            category.name,
            category.description,
            category.positions,
            category.isActive
        );
    }
    
    /**
     * @dev Add a new candidate
     * @param _name Name of the candidate
     * @param _position Position the candidate is running for
     * @param _party Party or affiliation of the candidate
     */
    function addCandidate(string memory _name, string memory _position, string memory _party, string memory _category) public onlyAdmin electionExists {
        require(currentElection.state == ElectionState.Created, "Cannot add candidates after election has started");
        require(bytes(categories[_category].name).length > 0, "Category does not exist");
        
        // Verify position exists in category
        bool positionExists = false;
        for (uint i = 0; i < categories[_category].positions.length; i++) {
            if (keccak256(bytes(categories[_category].positions[i])) == keccak256(bytes(_position))) {
                positionExists = true;
                break;
            }
        }
        require(positionExists, "Position does not exist in this category");
        
        candidateCount++;
        Candidate memory newCandidate = Candidate({
            id: candidateCount,
            name: _name,
            position: _position,
            party: _party,
            voteCount: 0
        });
        
        candidatesById[candidateCount] = newCandidate;
        candidatesByPosition[_position].push(newCandidate);
        
        // Add position if it doesn't exist
        bool positionInListExists = false;
        for (uint i = 0; i < positions.length; i++) {
            if (keccak256(bytes(positions[i])) == keccak256(bytes(_position))) {
                positionInListExists = true;
                break;
            }
        }
        
        if (!positionInListExists) {
            positions.push(_position);
        }
        
        emit CandidateAdded(candidateCount, _name, _position);
    }
    
    /**
     * @dev Register a new voter
     * @param _studentId Student ID of the voter
     * @param _department Department of the voter
     * @param _yearOfStudy Year of study
     */
    function registerVoter(string memory _studentId, string memory _department, uint256 _yearOfStudy) public voterNotRegistered {
        Voter storage newVoter = voters[msg.sender];
        newVoter.studentId = _studentId;
        newVoter.department = _department;
        newVoter.yearOfStudy = _yearOfStudy;
        newVoter.isRegistered = true;
        newVoter.hasVoted = false;
        
        registeredVoters.push(msg.sender);
        currentElection.totalVoters++;
        
        emit VoterRegistered(msg.sender, _studentId);
    }
    
    /**
     * @dev Cast a vote for a candidate
     * @param _candidateId ID of the candidate
     */
    function vote(uint256 _candidateId) public voterRegistered electionActive {
        require(_candidateId > 0 && _candidateId <= candidateCount, "Invalid candidate ID");
        
        Candidate storage candidate = candidatesById[_candidateId];
        require(!voters[msg.sender].votedForPosition[candidate.position], "Already voted for this position");
        
        // Record the vote
        voters[msg.sender].votedForPosition[candidate.position] = true;
        candidate.voteCount++;
        candidatesById[_candidateId].voteCount++;
        
        // Update candidate in the position array
        for (uint i = 0; i < candidatesByPosition[candidate.position].length; i++) {
            if (candidatesByPosition[candidate.position][i].id == _candidateId) {
                candidatesByPosition[candidate.position][i].voteCount++;
                break;
            }
        }
        
        // Mark voter as having voted
        if (!voters[msg.sender].hasVoted) {
            voters[msg.sender].hasVoted = true;
            currentElection.totalVotes++;
        }
        
        emit VoteCast(msg.sender, _candidateId, candidate.position);
    }
    
    /**
     * @dev Get the number of candidates for a position
     * @param _position Position to query
     * @return Number of candidates
     */
    function getCandidateCountForPosition(string memory _position) public view returns (uint256) {
        return candidatesByPosition[_position].length;
    }
    
    /**
     * @dev Get candidate details by ID
     * @param _candidateId ID of the candidate
     * @return id, name, position, party, voteCount
     */
    function getCandidate(uint256 _candidateId) public view returns (
        uint256 id,
        string memory name,
        string memory position,
        string memory party,
        uint256 voteCount
    ) {
        require(_candidateId > 0 && _candidateId <= candidateCount, "Invalid candidate ID");
        Candidate memory candidate = candidatesById[_candidateId];
        return (
            candidate.id,
            candidate.name,
            candidate.position,
            candidate.party,
            candidate.voteCount
        );
    }
    
    /**
     * @dev Get all positions in the election
     * @return Array of position names
     */
    function getPositions() public view returns (string[] memory) {
        return positions;
    }
    
    /**
     * @dev Get all candidates for a position
     * @param _position Position to query
     * @return Array of candidate IDs
     */
    function getCandidatesForPosition(string memory _position) public view returns (uint256[] memory) {
        Candidate[] memory candidates = candidatesByPosition[_position];
        uint256[] memory candidateIds = new uint256[](candidates.length);
        
        for (uint i = 0; i < candidates.length; i++) {
            candidateIds[i] = candidates[i].id;
        }
        
        return candidateIds;
    }
    
    /**
     * @dev Check if a voter has voted for a position
     * @param _voter Address of the voter
     * @param _position Position to check
     * @return True if voted, false otherwise
     */
    function hasVotedForPosition(address _voter, string memory _position) public view returns (bool) {
        return voters[_voter].votedForPosition[_position];
    }
    
    /**
     * @dev Get election results for a position
     * @param _position Position to get results for
     * @return candidateIds, names, parties, voteCounts
     */
    function getElectionResults(string memory _position) public view returns (
        uint256[] memory candidateIds,
        string[] memory names,
        string[] memory parties,
        uint256[] memory voteCounts
    ) {
        require(currentElection.state == ElectionState.Ended, "Results are only available after election ends");
        
        Candidate[] memory candidates = candidatesByPosition[_position];
        uint256 count = candidates.length;
        
        candidateIds = new uint256[](count);
        names = new string[](count);
        parties = new string[](count);
        voteCounts = new uint256[](count);
        
        for (uint i = 0; i < count; i++) {
            candidateIds[i] = candidates[i].id;
            names[i] = candidates[i].name;
            parties[i] = candidates[i].party;
            voteCounts[i] = candidates[i].voteCount;
        }
        
        return (candidateIds, names, parties, voteCounts);
    }
    
    /**
     * @dev Get election statistics
     * @return totalRegisteredVoters, totalVotesCast, electionState
     */
    function getElectionStats() public view returns (
        uint256 totalRegisteredVoters,
        uint256 totalVotesCast,
        ElectionState electionState
    ) {
        return (
            currentElection.totalVoters,
            currentElection.totalVotes,
            currentElection.state
        );
    }
}
