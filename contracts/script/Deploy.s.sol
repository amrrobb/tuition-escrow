// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.26;

import {TuitionEscrow} from "../src/TuitionEscrow.sol";
import {Script, console} from "forge-std/Script.sol";
import {MockToken} from "../test/mock/MockToken.sol";

contract Deploy is Script {
    uint256 constant INITIAL_BALANCE = 100_000 * 10 ** 6; // 100K USDC
    TuitionEscrow escrow;
    MockToken usdc;

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address usdcAddress;
        try vm.envAddress("MOCK_USDC_ADDRESS") {
            usdcAddress = vm.envAddress("MOCK_USDC_ADDRESS");
        } catch {
            usdcAddress = address(0);
        }
        address deployer = vm.addr(deployerPrivateKey);

        vm.startBroadcast(deployerPrivateKey);

        // Deploy the USDC mock contract
        if (usdcAddress == address(0)) {
            usdc = new MockToken("Mock USDC", "USDC", 6);
            usdc.mint(deployer, INITIAL_BALANCE);
        } else {
            usdc = MockToken(usdcAddress);
        }
        // Deploy the TuitionEscrow contract with the USDC address as the stablecoin address
        escrow = new TuitionEscrow(address(usdc));

        console.log("MOCKUSDC_ADDRESS=%s", address(usdc));
        console.log("TUITIONESCROW_ADDRESS=%s", address(escrow));

        vm.stopBroadcast();
    }
}
