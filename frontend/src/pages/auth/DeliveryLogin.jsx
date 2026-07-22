import {LogIn,CircleDollarSign,Clock,CalendarCheck} from 'lucide-react'

function DeliveryLogin(){
    return (
        <div className="w-full h-screen">
            <div className="lg:hidden flex flex-col w-full h-full">
                <div className="bg-[#004953] w-full h-full flex flex-col items-center justify-center">
                    {/* <div className="w-full h-fit text-white ">
                        <div className='flex items-center gap-2 text-4xl font-bold'>
                            <h1>Crave24h Riders</h1>
                        </div>
                        <p className='text-sm'>Deliver Earn Anytime</p>
                    </div> */}
                    <div className="w-[90%] h-fit flex flex-col gap-8 border border-[#EEEEEE] rounded-2xl px-10 py-10 shadow-lg bg-white">
                        <div className='flex flex-col gap-1'>
                            <h1 className='font-medium text-3xl'>Rider Sign In</h1>
                            <p className='text-gray-500 text-sm'>Welcome back! Please enter your details to start your shift.</p>
                        </div>
                        <div className='flex flex-col gap-2'>
                            <h2 className='font-medium text-sm'>Phone Number</h2>
                            <input type="text" className='w-full border border-[#cccccc] py-3 px-8 rounded-4xl focus:border-[#004953] outline-none focus:placeholder-transparent' placeholder='+855 | 81 234 567' />
                        </div>
                        <div className='flex flex-col gap-2'>
                            <h2 className='font-medium text-sm'>Password</h2>
                            <input type="text" className='w-full border border-[#cccccc] py-3 px-8 rounded-4xl focus:border-[#004953] outline-none focus:placeholder-transparent' placeholder='Enter password' />
                        </div>
                        <div className='flex flex-row-reverse'>
                            <h2 className='text-[#004953]'>Forgot Password?</h2>
                        </div>
                        <div className='btn-press flex justify-center items-center gap-2 w-full bg-[#004953] py-3 rounded-4xl text-white'>
                            <LogIn strokeWidth={1.5} size={20} />
                            <button>Sign in</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="hidden lg:grid grid-cols-2 w-full h-full">
                <div className="bg-[#004953] flex items-center justify-center">
                    <div className="w-[90%] h-[95%] flex flex-col justify-between gap-2">
                        <div className="w-full h-32 text-[#d0f4ad] ">
                            <div className='flex items-center gap-2 text-4xl font-bold'>
                                <h1>Crave24h Riders</h1>
                            </div>
                            <p className='text-sm'>Deliver Earn Anytime</p>
                        </div>
                        <div className="w-full h-full flex justify-center items-center ">
                            <img src="https://www.jotform.com/blog/wp-content/uploads/2020/05/How-to-start-a-food-delivery-business.png" alt="" className="w-[70%] h-[70%] object-cover rounded-2xl shadow-lg" />
                        </div>
                        <div className="w-[70%] flex flex-wrap justify-start items-start gap-x-4 gap-y-2">
                            <div className='bg-[#d0f4ad] w-fit h-fit px-4 py-2 rounded-4xl flex items-center justify-center gap-2 text-[#004953] shadow-lg'>
                                <CircleDollarSign strokeWidth={1.25} />
                                <p className=' font-medium'>Earn $15-40/day</p>
                            </div>
                            <div className='w-full'></div>
                            <div className='bg-[#d0f4ad] w-fit h-fit px-4 py-2 rounded-4xl flex items-center justify-center gap-2 text-[#004953] shadow-lg'>
                                <CalendarCheck strokeWidth={1.25} />
                                <p className=' font-medium'>Weekly payout</p>
                            </div>
                            <div className='bg-[#d0f4ad] w-fit h-fit px-4 py-2 rounded-4xl flex items-center justify-center gap-2 text-[#004953] shadow-lg'>
                                <Clock strokeWidth={1.25} />
                                <p className=' font-medium'>Flexible hours</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-white w-full h-full flex items-center justify-center">
                    <div className="w-[60%] h-[70%] flex flex-col gap-8 border border-[#EEEEEE] rounded-2xl px-10 py-10 shadow-lg">
                        <div className='flex flex-col gap-1'>
                            <h1 className='font-medium text-3xl'>Rider Sign In</h1>
                            <p className='text-gray-500 text-sm'>Welcome back! Please enter your details to start your shift.</p>
                        </div>
                        <div className='flex flex-col gap-2'>
                            <h2 className='font-medium text-sm'>Phone Number</h2>
                            <input type="text" className='w-full border border-[#cccccc] py-3 px-8 rounded-4xl focus:border-[#004953] outline-none focus:placeholder-transparent' placeholder='+855 | 81 234 567' />
                        </div>
                        <div className='flex flex-col gap-2'>
                            <h2 className='font-medium text-sm'>Password</h2>
                            <input type="text" className='w-full border border-[#cccccc] py-3 px-8 rounded-4xl focus:border-[#004953] outline-none focus:placeholder-transparent' placeholder='Enter password' />
                        </div>
                        <div className='flex flex-row-reverse'>
                            <h2 className='text-[#004953]'>Forgot Password?</h2>
                        </div>
                        <div className='btn-press flex justify-center items-center gap-2 w-full bg-[#004953] py-3 rounded-4xl text-[#8cc751]'>
                            <LogIn strokeWidth={1.5} size={20} />
                            <button>Sign in</button>
                        </div>
                        <div className='flex justify-center items-center gap-2'>
                            <h2 className='text-[#7b7b7b]'>New Rider?</h2>
                            <button className='btn-press text-[#004953]'>Apply to Join</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DeliveryLogin;