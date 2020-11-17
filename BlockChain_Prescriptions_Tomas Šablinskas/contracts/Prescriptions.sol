pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

contract Prescriptions {
    int public prId = 0;
    int public pId = 0;

    string public adminAddress = "0x06441c9Da30b328e23B4453A8F128DC03671F3cc";
    // Model a doctor
    struct Doctor
    {
        string walletAddress;
        string name;
    }

    struct Prescription
    {
        int id;
        string medication;
        uint price;
        string doctorId;
        string patientId;
        string state; // 0 - prescribed; 1 - purchased
    }

    struct Medication
    {
        uint id;
        string name;
        uint price;
    }

    struct Patient
    {
        int pid;
        string wallet;
        string name;
    }

    mapping(string => Doctor) public doctors;

    mapping(int => Patient) public patients;

    mapping(int => Prescription) public prescriptions;

    mapping(uint => Medication) public medications;

    // Called when the contract is being deployed (adds all users into the prescription system)
    constructor() public
    {
        addPatient("0x06441c9Da30b328e23B4453A8F128DC03671F3cc", "John Sulivan");
        addPatient("0x9aEa836Da2969bD7397B595Cb8bbe02394cAbd32", "Kate Hopkins");
        addPatient("0xad41FFD74EbB3e790eAf320B3b2787656d1DBBDa", "James Kat");
        addPatient("0x33EC90aC223a928e3044f284661F48E9c7077F4a", "Bernie Sandy");
        addPatient("0x786fcad834A2C5b1b0Ba7A98D9319E3c36542DF6", "Ally McDemon");
        addPatient("0x9bAaa1796DeB06F73193aB592D491482eD1e4e25", "Gordon Sames");
        addPatient("0xDf7C10022Ebf0E216788C24a7B67bbb0821C432f", "Katy Films");
        addPatient("0x60a54d84F8d6ddA9FFF7E91f2068538Bd4c4D5BE", "Vilma Fansas");
        addPatient("0x3F3f1829A156f145b4c8bA2348324fBfF133e9f4", "Gabby Olws");
        addPatient("0x5A587CA84964B7d282E6e4c6756f551e91e2a445", "Taylor Funs");

        addMedication(0, "Venofaxin", 1);
        addMedication(1, "Dextroamphetamine", 225);
        addMedication(2, "Some other medication", 5);
        addMedication(3, "Memes", 777);
    }

    // Add a new doctor to the blockchain
    function addDoctor(string memory _walletAddress, string memory _name) public
    {
        doctors[_walletAddress] = Doctor(_walletAddress, _name);
    }

    // Add a new patient to the blockchain
    function addPatient(string memory WAddress, string memory name) public
    {
        patients[pId] = Patient(pId, WAddress, name);
        pId++;
    }

    function addMedication(uint id, string memory name, uint price) private
    {
        medications[id] = Medication(id, name, price);
    }

    // Create a new prescription and add it to the blockchain
    function createPrescription(uint medication,
                                string memory doctorId, string memory patientId) public
    {
        prescriptions[prId] = Prescription(prId, medications[medication].name, medications[medication].price, doctorId, patientId, "0");
        prId++;
    }

    function changeMedicationPrice(uint id, uint price) public
    {
        medications[id].price = price;
    }

    // Compares two String memory type variables
    function comp(string memory a, string memory b) private returns (bool)
    {
        return (keccak256(abi.encodePacked((a))) == keccak256(abi.encodePacked((b))) );
    }

    function buyTheMedication(int prescriptionId) public payable
    {
        prescriptions[prescriptionId].state = "1";
/*         address addr = 0x06441c9Da30b328e23B4453A8F128DC03671F3cc;
        address payable wallet = address(uint160(addr));
        uint price = prescriptions[prescriptionId].price;
        msg.sender.transfer(price*10**18); */

    } 
}
