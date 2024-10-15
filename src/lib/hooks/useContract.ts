import { ABI } from "@/utils/abi";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { getAptosClient } from "@/utils/aptosClient";


const aptosClient = getAptosClient();

export const useContract = () => {

  const { account, signAndSubmitTransaction } = useWallet();

  async function addUser(publicKey: string, isDoctor = false) {
    try {
      const response = await signAndSubmitTransaction({
        sender: account?.address,
        data: {
          function: `${ABI.address}::medisafe_v6::add_user`,
          typeArguments: [],
          functionArguments: [publicKey, isDoctor],
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

  async function addRecord(accessKey: string, recordName: string, fileName: string, fileHash: string) {
    try {
      const response = await signAndSubmitTransaction({
        sender: account?.address,
        data: {
          function: `${ABI.address}::medisafe_v6::add_record`,
          typeArguments: [],
          functionArguments: [Math.ceil(Date.now() / 1000), accessKey, recordName, fileName, fileHash],
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

  async function giveRecordAccess(doctorAddress:string,recordId:number,accessKey:string) {
    try {
      const response = await signAndSubmitTransaction({
        sender: account?.address,
        data: {
          function: `${ABI.address}::medisafe_v6::give_record_access`,
          typeArguments: [],
          functionArguments: [Math.ceil(Date.now() / 1000), doctorAddress, recordId, accessKey],
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

  async function verifyPublicKey(publicKey: string) {
    try {
      console.log(publicKey);
      const payload = {
        function: `${ABI.address}::medisafe_v6::verify_public_key` as const,
        type_arguments: [],
        functionArguments: [account?.address as string, publicKey]
      };

      const result = await aptosClient.view({ payload });
      console.log('View function result:', result);
      return result[0];
    } catch (error: any) {
      console.error(error);
    }
  }

  async function getPatientRecords() {
    try {
      const payload = {
        function: `${ABI.address}::medisafe_v6::get_patient_records` as const,
        type_arguments: [],
        functionArguments: [account?.address as string]
      };

      const result = await aptosClient.view({ payload });
      console.log('View function result:', result);
      return result[0];
    } catch (error: any) {
      console.error(error);
    }
  }

  async function getPatientRecord(recordId: number) {
    try {
      const records = (await getPatientRecords()) as any[];
      for (let index = 0; index < records?.length; index++) {
        if (records[index].record_id == recordId) {
          return records[index]
        }
      }
    } catch (err) {
      console.log(err)
    }
  }

  async function getDoctorRecords() {
    try {
      const payload = {
        function: `${ABI.address}::medisafe_v6::get_doctor_shared_records` as const,
        type_arguments: [],
        functionArguments: [account?.address as string]
      };

      const result = await aptosClient.view({ payload });
      console.log('View function result:', result);
      return result[0];
    } catch (error: any) {
      console.error(error);
    }
  }

  async function getDoctorRecord(recordId: number) {
    try {
      const records = (await getDoctorRecords()) as any[];
      console.log(records,recordId)
      for (let index = 0; index < records?.length; index++) {
        if (records[index].record_id == recordId) {
          console.log(records[index])
          return records[index]
        }
      }
    } catch (err) {
      console.log(err)
    }
  }
  async function isDoctorExist(address: string) {
    try {
      const payload = {
        function: `${ABI.address}::medisafe_v6::is_doctor_exists` as const,
        type_arguments: [],
        functionArguments: [address as string]
      };

      const result = await aptosClient.view({ payload });
      return result[0];
    } catch (error: any) {
      console.error(error);
    }
  }

  async function getUserPublicKey(address: string){
    try {
      const payload = {
        function: `${ABI.address}::medisafe_v6::get_user_public_key` as const,
        type_arguments: [],
        functionArguments: [address]
      };

      const result = await aptosClient.view({ payload });
      return result[0];
    } catch (error: any) {
      console.error(error);
    }
  }
  return {
    addUser,
    addRecord,
    giveRecordAccess,
    verifyPublicKey,
    getPatientRecords,
    getPatientRecord,
    getDoctorRecords,
    getDoctorRecord,
    isDoctorExist,
    getUserPublicKey
  }
}
