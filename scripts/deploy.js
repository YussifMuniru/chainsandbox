// Import Ignition core functionalities
// const { ignition } = require("@nomicfoundation/hardhat-ignition");
const { ignition } = require("@nomicfoundation/hardhat-ignition/modules");

// Define the deployment process using an async function
async function main() {
  // Here we specify which module to deploy. The 'LockModule' refers to your module's name.
  const deployment = await ignition("ContractsModule");

  // Check the deployment status and log the deployed contract address
  if (deployment.status === "deployed") {
    console.log(
      `Lock contract deployed at: ${deployment.contracts.lock.address}`
    );
  } else {
    console.error("Deployment failed:", deployment.error);
  }
}

// We wrap the deployment script to catch any errors in deployment
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Deployment failed:", error);
    process.exit(1);
  });
