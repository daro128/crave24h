import Seccess from '../../components/userComponent/CheckoutComponent/Success'
import ProcessStep from '../../components/userComponent/CheckoutComponent/ProcessStep';
import Navbar from '../../components/userComponent/HomepageComponent/Navbar';
import Footer from '../../components/userComponent/HomepageComponent/Footer';
const SucessPaymentPage = () => {
  return (
    <div>
        <Navbar/>
        <div className='mt-5 mx-auto max-w-2xl px-4 sm:px-0'>
            <ProcessStep currentStep={3}/>
        </div>
        <Seccess/>
        <Footer/>

    </div>
  );
};

export default SucessPaymentPage;