module medisafe_addr::medisafe_v6{
    use std::error;
    use std::signer::address_of;
    use std::signer;
    use std::string::{Self, String,utf8};
    use std::vector;


    const SUCCESS: u8 = 1;

    // IF  address not registered in medisafe
    const EACTION_NOT_PERMITED: u64 = 2;

    // IF  address not registered in medisafe
    const EACCOUNT_NOT_FOUND: u64 = 3;

    // IF  address already registered in medisafe
    const EACCOUNT_ALREADY_REGISTERED: u64 = 4;

    const ERECORD_NOT_FOUND: u64 = 5;



    // pateint name limit exceed
    const ENAME_LIMIT: u64 = 2;

    //pateint name max length
    const NAME_UPPER_BOUND: u8 = 40;

    struct Admin has key { 
        addr: address
    }
    struct Doctor has key {
        addr  : address,
        is_approved: bool,
        public_key: String,
        shared_records: vector<SharedMedicalRecord>
    }

    struct Patient has key {
        addr  : address,
        public_key: String,
        records: vector<MedicalRecord>
    }
    
    struct MedicalRecord has key,store,drop,copy {
        record_id: u64,
        timestamp: u128,
        access_key: String,
        record_name: String,
        file_name: String,
        file_hash: String,
    }

    struct SharedMedicalRecord has key,store,drop,copy {
        record_id: u64,
        record_holder: address,
        timestamp: u128,
        origin_id: u64,
        access_key: String,
        record_name: String,
        file_name: String,
        file_hash: String,
    }

    fun init_module(account: &signer){
       move_to(account,Admin{ addr: signer::address_of(account)})
    }

    public entry fun add_user(account :&signer, public_key: String, is_doctor: bool){
        let user_address = signer::address_of(account);
        if(is_doctor_exists(user_address) || is_patient_exists(user_address)){
            assert!(false,EACCOUNT_ALREADY_REGISTERED)
        };
        if(is_doctor){
            let new_doctor = Doctor{
                addr: user_address,
                is_approved: false,
                public_key: public_key,
                shared_records: (vector[])
            };
            move_to(account,new_doctor);
        }
        else{
            let new_patient = Patient {
                addr: user_address,
                public_key: public_key,
                records: (vector[]),
            };
            move_to(account, new_patient);
        }
    }
    
    public entry fun approve_doctor(
        account: &signer,
        doctor_address: address
    ) acquires Doctor {
        if(!is_doctor_exists(signer::address_of(account))){
            assert!(false,EACCOUNT_NOT_FOUND)
        };

        if(!is_admin(signer::address_of(account))){
            assert!(false,EACCOUNT_NOT_FOUND)
        };

        let doctor = borrow_global_mut<Doctor>(doctor_address);
        doctor.is_approved = true;
    }

    public entry fun add_record(
        account: &signer,
        timestamp: u128,
        access_key: String,
        record_name: String,
        file_name: String,
        file_hash: String
    ) acquires Patient{
        if(!is_patient_exists(signer::address_of(account))){
            assert!(false,EACCOUNT_NOT_FOUND)
        };
        let signer_address = signer::address_of(account);
        let patient = borrow_global_mut<Patient>(signer_address);
        let records_count = vector::length(&patient.records);

        let new_record = MedicalRecord {
            record_id: records_count,
            timestamp: timestamp,
            access_key: access_key,
            record_name: record_name,
            file_name: file_name,
            file_hash: file_hash,
        };
        vector::push_back(&mut patient.records,new_record);
    }

    public entry fun give_record_access(
        account: &signer,
        timestamp: u128,
        doctor_address: address,
        record_id: u64,
        access_key: String
    ) acquires Doctor, Patient{
        let patient_address = signer::address_of(account);

        let patient = borrow_global<Patient>(patient_address);
        let records_len = vector::length(&patient.records);
        if(record_id >= records_len){
            assert!(false,ERECORD_NOT_FOUND);
        };
        let record_ref = vector::borrow(&patient.records, record_id);
        let record =  SharedMedicalRecord {
            record_id: 0,
            record_holder: patient_address,
            origin_id: record_ref.record_id,
            access_key: access_key,
            timestamp: timestamp,
            record_name: record_ref.record_name,
            file_name: record_ref.file_name,
            file_hash: record_ref.file_hash,
        };
        let doctor = borrow_global_mut<Doctor>(doctor_address);
        record.record_id = vector::length(&doctor.shared_records);

        vector::push_back(&mut doctor.shared_records,record);
    }

    
    // public entry fun revoke_record_access(
    //     account: &signer,
    //     recipient_address: address,
    //     shared_record_id: u64
    // ) acquires User{
    //     let signer_address = signer::address_of(account);
    //     let sender_user = borrow_global<User>(signer_address);

    //     let recipient_user = borrow_global_mut<User>(recipient_address);
    //     vector::remove(&mut recipient_user.shared_records, shared_record_id);
    // }


    #[view]
    public fun is_doctor_exists(addr: address): bool {
        exists<Doctor>(addr)
    }

    #[view]
    public fun is_patient_exists(addr: address): bool {
        exists<Patient>(addr)
    }

    #[view]
    public fun is_admin(admin_addr: address): bool{
        exists<Admin>(admin_addr)
    }



    #[view]
    public fun verify_public_key(addr: address,public_key: String):bool acquires Patient,Doctor{
        if(is_patient_exists(addr)){
            let patient = borrow_global<Patient>(addr);
            return patient.public_key == public_key
        }
        else if(is_doctor_exists(addr)){
            let doctor = borrow_global<Doctor>(addr);
            return doctor.public_key == public_key
        };
        return false
    }

    #[view]
    public fun get_patient_records(addr: address):vector<MedicalRecord> acquires Patient{
        if(!is_patient_exists(addr)){
            assert!(false,EACCOUNT_NOT_FOUND)
        };
        let patient = borrow_global<Patient>(addr);
        patient.records
    }

    #[view]
    public fun get_doctor_shared_records(addr: address):vector<SharedMedicalRecord> acquires Doctor{
        if(!is_doctor_exists(addr)){
            assert!(false,EACCOUNT_NOT_FOUND)
        };
        let doctor = borrow_global<Doctor>(addr);
        doctor.shared_records
    }

    #[view]
    public fun get_patient_record(addr: address,record_id:u64):vector<MedicalRecord> acquires Patient{
        if(!is_patient_exists(addr)){
            assert!(false,EACCOUNT_NOT_FOUND)
        };
        let patient = borrow_global<Patient>(addr);
        patient.records
    }
    
    #[view]
    public fun get_user_public_key(addr: address):String acquires Patient,Doctor{
        if(is_patient_exists(addr)){
            let patient = borrow_global<Patient>(addr);
            return patient.public_key
        }
        else if(is_doctor_exists(addr)){
            let doctor = borrow_global<Doctor>(addr);
            return doctor.public_key
        }
        else{
            return utf8(b"")
        }
    }

     #[test(account = @0x1,account2 = @0x2)]
    fun add_user_test(
        account: &signer,
        account2: &signer,
    ) acquires Doctor, Patient{
        add_user(account,utf8(b"my_public_key"),true);
        let doctor = borrow_global<Doctor>(signer::address_of(account));

        assert!(is_doctor_exists(signer::address_of(account)),101);

        add_user(account2,utf8(b"my_public_key"),false);
        let patient = borrow_global<Patient>(signer::address_of(account2));

        assert!(is_patient_exists(signer::address_of(account2)),101);
    }

    #[test(account = @0x1)]
    fun add_user_twise_test(  //should fail
        account: &signer,
    ){
        add_user(account,utf8(b"my_public_key"),true);
        add_user(account,utf8(b"my_public_key"),true);
    }

    #[test(account = @0x1)]
    fun add_record_test(
        account: &signer,
    ) acquires Patient{

        add_user(account,utf8(b"my_public_key"),false);
        add_record(account,1232323232,utf8(b"access_key"),utf8(b"MY RECORD"),utf8(b"FILE"),utf8(b"HASH123"));

        let records = get_patient_records(signer::address_of(account));
        // record count should be 1 
        let records_count = vector::length(&records);
        if(records_count == 0)assert!(false,ERECORD_NOT_FOUND);
        let i = 0;
        while (i < records_count) {
            let record = vector::borrow(&records, i);
            // verify record name
            if(record.record_name != utf8(b"MY RECORD") && record.record_id == 0)
            {
                assert!(false,1);
            };
            i = i + 1;
        }
    }


    #[test(account1 = @0x1, account2 = @0x2)]
    fun give_record_access_test(
        account1: &signer,
        account2: &signer
    ) acquires Doctor,Patient{

        add_user(account1,utf8(b"my_public_key"),false);
        add_user(account2,utf8(b"my_public_key2"),true);


        add_record(account1,101,utf8(b"access_key"),utf8(b"MY RECORD"),utf8(b"FILE"),utf8(b"HASH123"));
        let record_id = 0;
        let recipient_address = signer::address_of(account2);
        if(!is_patient_exists(signer::address_of(account1)) || !is_doctor_exists(recipient_address)){
            assert!(false,1223);
        };
        give_record_access(account1,243343333, recipient_address, 0,utf8(b"access_key"));
        let records = get_doctor_shared_records(recipient_address);

         // record count should be 1 
        let records_count = vector::length(&records);
        if(records_count== 0)assert!(false,1);

        let i = 0;
        while (i < records_count) {
            let record = vector::borrow(&records, i);
            // verify record name
            if(record.record_holder != signer::address_of(account1) || record.record_name != utf8(b"MY RECORD") || record.record_id != 0 || record.access_key != utf8(b"access_key"))
            {
                assert!(false,1);
            };
            i = i + 1;
        }
    }

}