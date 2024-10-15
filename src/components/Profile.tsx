import { useWallet } from '@aptos-labs/wallet-adapter-react'
import React from 'react'

export default function Profile() {
 const {connected}  = useWallet()
  return (
    connected ? <div className='w-10 h-10 rounded-full bg-secondary flex justify-center items-center text-2xl'>A</div> : <></>
  )
}
