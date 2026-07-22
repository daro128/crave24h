import image12 from '../../../assets/image copy 12.png'
import image13 from '../../../assets/image copy 13.png'
const ExploreCuisines = ({products}) => {
    return (
        <div className="py-15 px-4 sm:px-20 lg:px-60 flex items-center">
            <div className="flex flex-col items-center gap-2 w-full">
                <h1 className="font-bold text-2xl py-5 text-black">Explore Cuisines</h1>
                <ol className="grid grid-cols-3 sm:grid-cols-6 gap-6 sm:gap-12 lg:gap-20">
                    <div className="flex flex-col items-center">
                        <li className="card-hover bg-slate-700 rounded-[50%] overflow-hidden w-20 h-20 flex items-center justify-center">
                        <img
                            className="w-full h-full object-cover rounded-[50%] p-2"
                            src="https://img.magnific.com/free-vector/pizza-slice-design_25030-78625.jpg?semt=ais_hybrid&w=740&q=80"
                            alt=""
                        />
                    </li>
                        <p>Pizaa</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <li className="card-hover bg-slate-700 rounded-[50%] overflow-hidden w-20 h-20 flex items-center justify-center">
                        <img
                            className="w-full h-full object-cover rounded-[50%] p-1"
                            src="https://png.pngtree.com/png-clipart/20220430/original/pngtree-sushi-logo-shop-png-image_7596643.png"
                            alt=""
                        />
                    </li>
                        <p>Sushi</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <li className="card-hover bg-slate-700 rounded-[50%] overflow-hidden w-20 h-20 flex items-center justify-center">
                        <img
                            className="w-[90%] h-[90%] object-cover rounded-[50%] p-1"
                            src="https://www.allrecipes.com/thmb/5JVfA7MxfTUPfRerQMdF-nGKsLY=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/25473-the-perfect-basic-burger-DDMFS-4x3-56eaba3833fd4a26a82755bcd0be0c54.jpg"
                            alt=""
                        />
                    </li>
                        <p>Burgers</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <li className="card-hover bg-slate-700 rounded-[50%] overflow-hidden w-20 h-20 flex items-center justify-center">
                        <img
                            className="w-full h-full object-cover rounded-[50%] p-2"
                            src="https://www.eatingwell.com/thmb/Sud6f5AxXQDmX-_LSVZOafBF96w=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/boba-tea-explainer-131c892c9c8540bdac4f6a0b403263df.jpg"
                            alt=""
                        />
                    </li>
                        <p>Boba</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <li className="card-hover bg-slate-700 rounded-[50%] overflow-hidden w-20 h-20 flex items-center justify-center">
                        <img
                            className="w-full h-full object-cover rounded-[50%] p-2"
                            src={image12}
                            alt=""
                        />
                    </li>
                        <p>Hearthy</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <li className="card-hover bg-slate-700 rounded-[50%] overflow-hidden w-20 h-20 flex items-center justify-center">
                        <img
                            className="w-full h-full object-cover rounded-[50%] p-2"
                            src={image13}
                            alt=""
                        />
                    </li>
                        <p>Dessert</p>
                    </div>
                </ol>
            </div>
        </div>
    )
}

export default ExploreCuisines
