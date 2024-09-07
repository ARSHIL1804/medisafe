import { ABI } from "@/utils/abi";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { getAptosClient } from "@/utils/aptosClient";


const aptosClient = getAptosClient();

export const useContract = () => {

    const {account, signAndSubmitTransaction} = useWallet();
    
    async function addUser(isDoctor = false){
        try {
            const response = await signAndSubmitTransaction({
              sender: account?.address,
              data: {
                function: `${ABI.address}::medisafe_v3::add_user`,
                typeArguments: [],
                functionArguments: [account?.publicKey,isDoctor],
              },
            });
            const result = await aptosClient.waitForTransaction({
              transactionHash: response.hash,
            });
            console.log(result);
        } catch (error: any) {
          console.error(error);
        } finally {
          console.log("completed")
        }
    }


    async function addRecord(patientId:string,recordName:string,fileName:string,fileHash:string){
        try {
            const response = await signAndSubmitTransaction({
              sender: account?.address,
              data: {
                function: `${ABI.address}::medisfae_v2::add_record`,
                typeArguments: [],
                functionArguments: [account?.publicKey],
              },
            });
            const result = await aptosClient.waitForTransaction({
              transactionHash: response.hash,
            });
            console.log(result);
        } catch (error: any) {
          console.error(error);
        } finally {
          console.log("completed")
        }
    }

    return {
        addUser,
        addRecord
    }
}
