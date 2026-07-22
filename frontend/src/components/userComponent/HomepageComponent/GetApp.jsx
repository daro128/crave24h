import image25 from '../../../assets/image copy 25.png'
import image26 from '../../../assets/image copy 26.png'
const GetApp = () => {
    return (
        <div>
            <div className="px-6 sm:px-12 lg:px-30 py-12 lg:py-20 bg-[#004953] grid grid-cols-1 lg:grid-cols-2 items-center gap-10">
                <div className="space-y-6 text-white">
                    <h1 className="text-3xl sm:text-5xl font-bold">
                        Get the Crave App
                    </h1>

                    <p className="text-lg max-w-md">
                        Unlock exclusive app-only rewards, real-time tracking,
                        and lightning-fast checkout. Your cravings, one tap away.
                    </p>

                    <div className="space-y-3 text-lg">
                        <div> Exclusive Rewards</div>
                        <div> Priority Delivery</div>
                        <div> Live Order Tracking</div>
                    </div>

                    <div>
                        <img className="w-40" src={image26} alt="" />
                        <h1 className="text-2xl font-bold mt-2">Download Now</h1>
                        <p className="text-sm text-gray-300">Available on iOS and Android</p>
                    </div>
                </div>

                <div className="flex justify-center">
                    <img
                        className="w-75 drop-shadow-2xl"
                        src={image25}
                        alt=""
                    />
                </div>
            </div>

        </div>
    )
}

export default GetApp
