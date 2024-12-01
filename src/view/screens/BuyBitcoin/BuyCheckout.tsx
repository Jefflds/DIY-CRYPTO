import axios from 'axios';
import { QRCodeSVG } from 'qrcode.react'; // Importa a biblioteca qrcode.react
import { useEffect, useState } from 'react';
import { CiCreditCard1 } from 'react-icons/ci';
import { FaBarcode, FaPix } from 'react-icons/fa6';
import { SiBitcoincash } from 'react-icons/si';
import Lightning from '../../assets/lightning.svg';
import { BackgroundAnimatedProduct } from '../../components/BackgroundAnimatedProduct';
import { NavBarBuyBitcoin } from './NavbarBuyBitcoin';

export default function BuyCheckout() {
  const [network, setNetwork] = useState<string>('Rede do BTC');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDropdownOpenMethod, setIsDropdownOpenMethod] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<
    'PIX' | 'Cartão de Crédito' | 'Boleto Bancário'
  >('PIX');
  const [pixKey, setPixKey] = useState<string | null>(null); // Estado para armazenar a chave PIX
  const [isLoading, setIsLoading] = useState(false); // Estado de loading
  const [brlAmount, setBrlAmount] = useState('');
  const [btcAmount, setBtcAmount] = useState('');
  const [, setIsWaitingForPayment] = useState(false); // Estado para monitorar o pagamento

  useEffect(() => {
    const storedBrl = localStorage.getItem('brlAmount');
    const storedBtc = localStorage.getItem('btcAmount');
    if (storedBrl && storedBtc) {
      setBrlAmount(storedBrl);
      setBtcAmount(storedBtc);
    }
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen((prevState) => !prevState);
  };

  const selectNetwork = (networkName: string) => {
    setNetwork(networkName);
    setIsDropdownOpen(false);
  };

  const toggleDropdownMethod = () => {
    setIsDropdownOpenMethod((prevState) => !prevState);
  };

  const selectPaymentMethod = (method: 'PIX') => {
    setPaymentMethod(method);
    setIsDropdownOpenMethod(false);
  };

  const networks = [{ name: 'Lightning', icon: Lightning }];

  const handleProcessPayment = async () => {
    setIsLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/orders/create-order`,
        {
          amountBrl: parseFloat(brlAmount.replace(/\D/g, '')) / 100,
          amountBtc: parseFloat(btcAmount),
          paymentMethod,
          network: network.toLowerCase(),
        },
      );

      // Captura a chave PIX retornada
      const pixKey = response.data.order.pixKey;
      setPixKey(pixKey);

      setIsLoading(false);

      // Após gerar a chave PIX, realiza a verificação do pagamento uma única vez
      verifyPaymentStatus(response.data.order.id);
    } catch (error) {
      console.error('Erro ao processar pagamento:', error);
      alert('Erro ao processar o pagamento.');
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (pixKey) {
      navigator.clipboard.writeText(pixKey);
      alert('Chave PIX copiada para a área de transferência!');
    }
  };

  const verifyPaymentStatus = async (orderId: string) => {
    setIsWaitingForPayment(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/orders/confirm-payment`,
        {
          orderId,
        },
      );

      console.log(response);

      if (response.data === 'confirmed') {
        alert('Pagamento confirmado!');
      } else {
        alert('Pagamento ainda não confirmado. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro ao verificar o status do pagamento:', error);
      alert('Erro ao verificar o status do pagamento.');
    } finally {
      setIsWaitingForPayment(false);
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
          <p className="text-lg text-center">
            Valor: {brlAmount} BRL / {btcAmount} BTC
          </p>

          {/* Se a chave PIX foi gerada, mostramos o QR code e o botão para copiar a chave PIX */}
          {pixKey ? (
            <div className="flex flex-col items-center pt-4">
              <p className="text-lg mb-4">
                Escaneie o QR Code ou copie a chave PIX abaixo:
              </p>

              {/* Exibe o QR code gerado com a chave PIX */}
              <QRCodeSVG value={pixKey} size={256} />

              <textarea
                value={pixKey}
                readOnly
                className="border px-4 py-3 rounded-3xl text-lg text-black dark:text-white bg-slate-100 dark:bg-slate-700 w-full mt-4"
                rows={4}
              />

              <button
                onClick={copyToClipboard}
                className="mt-4 px-6 py-3 bg-[#F6911D] text-white rounded-3xl font-bold"
              >
                Copiar Chave PIX
              </button>
            </div>
          ) : (
            <>
              {/* Se a chave PIX não foi gerada, exibe a seleção de rede e método de pagamento */}
              <div className="flex justify-center items-center pt-4">
                <div className="relative">
                  <input
                    type="text"
                    value={network}
                    readOnly
                    placeholder="Selecione uma rede"
                    className="border pl-28 pr-4 py-3 rounded-3xl text-lg text-black dark:text-white bg-slate-100 dark:bg-slate-700 cursor-pointer"
                    onClick={toggleDropdown}
                  />
                  <button
                    onClick={toggleDropdown}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white px-4 rounded-full"
                  >
                    {networks.find((net) => net.name === network)?.icon && (
                      <img
                        src={networks.find((net) => net.name === network)?.icon}
                        alt={network}
                        className="w-8 h-8"
                      />
                    )}
                  </button>
                  {isDropdownOpen && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                      <ul>
                        {networks.map((net) => (
                          <li
                            key={net.name}
                            onClick={() => selectNetwork(net.name)}
                            className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer"
                          >
                            {net.name}
                            <img
                              src={net.icon}
                              alt={net.name}
                              className="w-8 h-8 ml-2"
                            />
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-center items-center pt-4">
                <div className="relative">
                  <input
                    type="text"
                    value={paymentMethod}
                    readOnly
                    placeholder="Selecione o método de pagamento"
                    className="border pl-28 pr-4 py-3 rounded-3xl text-lg text-black dark:text-white bg-slate-100 dark:bg-slate-700 cursor-pointer"
                    onClick={toggleDropdownMethod}
                  />
                  <button
                    onClick={toggleDropdownMethod}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white px-4 rounded-full"
                  >
                    {paymentMethod === 'PIX' ? (
                      <FaPix className="w-8 h-8" />
                    ) : paymentMethod === 'Cartão de Crédito' ? (
                      <CiCreditCard1 className="w-8 h-8" />
                    ) : (
                      <FaBarcode className="w-8 h-8" />
                    )}
                  </button>
                  {isDropdownOpenMethod && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-lg">
                      <ul>
                        <li
                          onClick={() => selectPaymentMethod('PIX')}
                          className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer"
                        >
                          PIX
                          <FaPix />
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-center items-center pt-4">
                {isLoading ? (
                  <p className="text-lg font-bold text-[#F6911D]">
                    Carregando...
                  </p>
                ) : (
                  <button
                    onClick={handleProcessPayment}
                    type="button"
                    className="w-full h-12 bg-[#F6911D] text-black dark:text-white rounded-3xl font-bold"
                  >
                    Obter Chave PIX
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
