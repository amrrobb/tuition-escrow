# Load environment variables from .env file
include .env
export

# Default network if not specified
network ?= default_network

# Ensure required environment variables are set
check-env:
	@if [ -z "$(PRIVATE_KEY)" ]; then \
		echo "Error: PRIVATE_KEY is not set in .env"; \
		exit 1; \
	fi
	@if [ -z "$(ALCHEMY_API_KEY)" ]; then \
		echo "Error: ALCHEMY_API_KEY is not set in .env"; \
		exit 1; \
	fi
	@if [ -z "$(ETHERSCAN_API_KEY)" ]; then \
		echo "Error: ETHERSCAN_API_KEY is not set in .env"; \
		exit 1; \
	fi

# Compile contracts
compile:
	forge compile

# Run tests
test:
	forge test

# Lint the code
lint:
	forge fmt --check

chain:
	anvil --chain-id 31337

# Deploy contracts to the specified network
deploy: check-env
	forge script script/Deploy.s.sol:Deploy --rpc-url $(network) --private-key $(PRIVATE_KEY) --broadcast

# Deploy and verify contracts
deploy-verify: check-env
	forge script script/Deploy.s.sol:Deploy --rpc-url $(network) --private-key $(PRIVATE_KEY) --broadcast --verify --etherscan-api-key $(ETHERSCAN_API_KEY)

# Verify already deployed contracts
verify: check-env
	forge script script/VerifyAll.s.sol:VerifyAll --ffi --rpc-url $(network) --broadcast --etherscan-api-key $(ETHERSCAN_API_KEY)

# Display help information
help:
	@echo "Makefile targets:"
	@echo "  deploy          - Deploy contracts using the specified network (e.g., make deploy network=arbitrumSepolia)"
	@echo "  deploy-verify   - Deploy and verify contracts using the specified network"
	@echo "  verify          - Verify contracts using the specified network"
	@echo "  compile         - Compile the contracts"
	@echo "  test            - Run tests"
	@echo "  lint            - Lint the code"
	@echo "  help            - Display this help information"

.PHONY: compile test lint deploy deploy-verify verify help check-env