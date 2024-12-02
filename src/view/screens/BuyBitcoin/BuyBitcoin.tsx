import { useEffect, useState } from 'react';
import { SiBitcoincash } from 'react-icons/si';
import { useNavigate } from 'react-router-dom';
import Btc from '../../assets/bitcoin.svg';
import Brl from '../../assets/brl.svg';
import { BackgroundAnimatedProduct } from '../../components/BackgroundAnimatedProduct';
import { ROUTES } from '../../routes/Routes';
import { useCurrentLang } from '../../utils/useCurrentLang';
import { NavBarBuyBitcoin } from './NavbarBuyBitcoin';

export default function BuyBitcoinAndCheckout() {
  const navigate = useNavigate();
  const { currentLang } = useCurrentLang();

  const [brlAmount, setBrlAmount] = useState('');
  const [btcAmount, setBtcAmount] = useState('');
  const [btcRate, setBtcRate] = useState(0);

  useEffect(() => {
    const fetchBitcoinRate = async () => {
      try {
        const response = await fetch(
          'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=brl',
        );
        const data = await response.json();
        setBtcRate(data.bitcoin.brl);
      } catch (error) {
        console.error('Error fetching Bitcoin rate:', error);
      }
    };

    fetchBitcoinRate();
  }, []);

  const formatBrl = (value: string): string => {
    const numericValue = value.replace(/\D/g, '');
    const formattedValue = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(parseFloat(numericValue) / 100);
    return numericValue ? formattedValue : '';
  };

  const handleBrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numericValue = parseFloat(value.replace(/\D/g, '')) / 100;

    if (numericValue > 5000) {
      return;
    }

    const formattedValue = formatBrl(value);
    setBrlAmount(formattedValue);

    if (btcRate > 0 && numericValue >= 0) {
      setBtcAmount((numericValue / btcRate).toFixed(8));
    }
  };

  const handleNextStep = () => {
    const numericValue = parseFloat(brlAmount.replace(/\D/g, '')) / 100;
    if (numericValue >= 700 && numericValue <= 5000) {
      localStorage.setItem('brlAmount', brlAmount);
      localStorage.setItem('btcAmount', btcAmount);
      navigate(ROUTES.buyCheckout.call(currentLang));
    } else {
      alert(
        'O valor deve ser maior que R$700 e menor que R$5000 para prosseguir.',
      );
    }
  };

  return (
    <div>
      <BackgroundAnimatedProduct />
      <NavBarBuyBitcoin />
      <div className="pt-[10%] pb-[10%] flex justify-center">
        <h1 className="text-[#F6911D] dark:text-[#F6911D] font-black text-7xl flex items-center">
          <SiBitcoincash className="mr-2" /> ALFRED
        </h1>
      </div>

      <div className="flex justify-center">
        <div>
          <div className="flex justify-center items-center space-x-4">
            <div className="relative">
              <input
                value={brlAmount}
                onChange={handleBrlChange}
                placeholder="Digite o valor em BRL"
                className="border pl-20 pr-20 py-3 rounded-3xl text-lg text-black dark:text-white bg-slate-100 dark:bg-slate-700 text-center no-arrows"
              />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white px-4 rounded-full">
                <img src={Brl} alt="BRL" className="w-8 h-8" />
              </button>
            </div>
          </div>
          <div className="flex justify-center items-center pt-4">
            <div className="relative">
              <input
                value={btcAmount}
                readOnly
                placeholder="Valor em BTC"
                className="border pl-20 pr-20 py-3 rounded-3xl text-lg text-black dark:text-white bg-slate-100 dark:bg-slate-700 text-center no-arrows"
              />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white px-4 rounded-full">
                <img src={Btc} alt="Bitcoin" className="w-8 h-8" />
              </button>
            </div>
          </div>
          <div className="flex justify-center items-center pt-4">
            <button
              onClick={handleNextStep}
              type="button"
              className="w-full h-12 bg-[#F6911D] text-black dark:text-white rounded-3xl font-bold"
            >
              Prosseguir
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
