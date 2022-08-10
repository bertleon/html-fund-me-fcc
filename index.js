//import

import { ethers } from "./ethers-5.6.esm.min.js"
import { abi, contractAddress } from "./constants.js"

const connectButton = document.getElementById("connectButton")
const fundButton = document.getElementById("fundButton")
const balanceButton = document.getElementById("balanceButton")
const withdrawButton = document.getElementById("withdrawButton")

connectButton.onclick = connect
fundButton.onclick = fund
balanceButton.onclick = getBalance
withdrawButton.onclick = withdraw

console.log(ethers)

async function connect() {
    if (typeof window.ethereum != "undefined") {
        try {
            await window.ethereum.request({ method: "eth_requestAccounts" })
        } catch (error) {
            console.log(error)
        }
        document.getElementById("connectButton").innerHTML = "Connected!"
        const accounts = await ethereum.request({ method: "eth_accounts" })
        console.log(accounts)
    } else {
        console.log("No metamask!")
        document.getElementById("connectButton").innerHTML =
            "Please connect metamask!"
    }
}

async function getBalance() {
    if (typeof window.ethereum != "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const balance = await provider.getBalance(contractAddress)
        console.log(ethers.utils.formatEther(balance))
    } else {
        console.log("No metamask!")
        document.getElementById("connectButton").innerHTML =
            "Please connect metamask!"
    }
}

//fund

async function fund() {
    const ethAmount = document.getElementById("ethAmount").value

    console.log(`Funding with ${ethAmount}...`)
    if (typeof window.ethereum != "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)
        try {
            const transactionResponse = await contract.fund({
                value: ethers.utils.parseEther(ethAmount),
            })
            await listenForTransactionMine(transactionResponse, provider)
            console.log("done")
        } catch (error) {
            console.log(error)
        }
    } else {
        console.log("No metamask!")
        document.getElementById("connectButton").innerHTML =
            "Please connect metamask!"
    }
}

async function withdraw() {
    if (typeof window.ethereum != "undefined") {
        console.log("withdrawing ....")
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)
        try {
            const transactionResponse = await contract.withdraw()
            await listenForTransactionMine(transactionResponse, provider)
        } catch (error) {
            console.log(error)
        }
    } else {
        console.log("No metamask!")
        document.getElementById("connectButton").innerHTML =
            "Please connect metamask!"
    }
}

function listenForTransactionMine(transactionResponse, provider) {
    console.log(`Mining ${transactionResponse.hash}...`)
    return new Promise((resolve, reject) => {
        provider.once(transactionResponse.hash, (transactionReceipt) => {
            console.log(
                `Completed with ${transactionReceipt.confirmations} confirmations`
            )
            resolve()
        })
    })

    //create listener for the block chain
}
//withdraw
