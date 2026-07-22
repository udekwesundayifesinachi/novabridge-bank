'use client';

import { useState } from 'react';
import { CheckCircle, Phone, Zap, Wifi, Tv, Car, Shield, Droplets, Home, Landmark, Building, Receipt, Search, CreditCard } from 'lucide-react';
import { Provider } from '@radix-ui/react-tooltip';

const billCategories = [
  {
  name: 'Credit Card',
  icon: CreditCard,
  color: '#0A5CFF',
  providers: ['Visa', 'Mastercard', 'American Express', 'Discover']
},
{
  name: 'Insurance',
  icon: Shield,
  color: '#0A5CFF',
  providers: ['State Farm', 'GEICO', 'Progressive', 'Allstate']
},
{
  name: 'Water',
  icon: Droplets,
  color: '#0A5CFF',
  providers: ['City Water', 'County Water', 'Municipal Water', 'Water District']
},
{
  name: 'Mortgage',
  icon: Home,
  color: '#0A5CFF',
  providers: ['Chase', 'Bank of America', 'Wells Fargo', 'Rocket Mortgage']
},
{
  name: 'Property Tax',
  icon: Landmark,
  color: '#0A5CFF',
  providers: ['County Tax Office', 'City Tax Office', 'State Revenue', 'IRS']
},
  { name: 'Electricity', icon: Zap, color: '#FFB300', providers: ['ConEd', 'PG&E', 'Duke Energy', 'Southern Co', 'Exelon'] },
  { name: 'Streaming & TV', icon: Tv, color: '#F64C9C', providers: ['Comcast', 'Spectrum', 'DirecTV'] },
  { name: 'Internet', icon: Wifi, color: '#7C3AED', providers: ['Comcast', 'Verizon Fios', 'AT&T Fiber', 'Cox'] },
  { name: 'Tolls', icon: Car, color: '#E53935', providers: ['E-ZPass', 'FasTrak'] },
  { name: 'Government Payments', icon: Building, color: '#64748b', providers: ['IRS', 'State Tax', 'Local Tax'] },
];

export default function BillsPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const [provider, setProvider] = useState('');
  const [phoneOrMeter, setPhoneOrMeter] = useState('');
  const [amount, setAmount] = useState('');
  const [success, setSuccess] = useState(false);

  const selectedCat = billCategories.find((c) => c.name === selected);

  const handlePay = () => {
    setSuccess(true);
    setTimeout(() => { setSuccess(false); setSelected(null); setProvider(''); setPhoneOrMeter(''); setAmount(''); }, 3000);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[900px] mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-[#0F172A]">Bill Payments</h1>
        <p className="text-slate-500 text-sm mt-1">Pay your bills instantly from your NovabridgeBank account</p>
      </div>

      {success ? (
        <div className="bg-white rounded-3xl p-12 card-shadow text-center">
          <div className="w-20 h-20 rounded-full bg-[#E8FFF3] flex items-center justify-center mx-auto mb-5">
            <CheckCircle className="w-10 h-10 text-[#00C853]" />
          </div>
          <h2 className="text-2xl font-extrabold text-[#0F172A] mb-2">Payment Successful!</h2>
          <p className="text-slate-500 text-sm">Your bill has been paid and a receipt has been sent to your email.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
          {billCategories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => { setSelected(cat.name); setProvider(''); }}
              className={`flex flex-col items-center gap-3 p-5 rounded-2xl border-2 transition-all duration-200 ${
                selected === cat.name
                  ? 'border-[#0A5CFF] bg-blue-50 shadow-md'
                  : 'border-[#E8EEF7] bg-white hover:border-slate-300 card-shadow'
              }`}
            >
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: `${cat.color}15` }}>
                <cat.icon className="w-6 h-6" style={{ color: cat.color }} />
              </div>
              <span className={`text-sm font-semibold ${selected === cat.name ? 'text-[#0A5CFF]' : 'text-slate-700'}`}>
                {cat.name}
              </span>
            </button>
          ))}
        </div>
      )}

      {selected && !success && selectedCat && (
        <div className="bg-white rounded-2xl p-6 card-shadow max-w-lg">
          <h2 className="font-bold text-[#0F172A] mb-5">{selected}</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Provider</label>
              <select className="input-field" value={provider} onChange={(e) => setProvider(e.target.value)}>
                <option value="">Select provider</option>
                {selectedCat.providers.map((p) => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                {selected === 'Electricity' ? 'Account Number' : selected === 'Cable TV' ? 'Account Number' : 'Phone Number'}
              </label>
              <input className="input-field" placeholder="Enter number"
                value={phoneOrMeter} onChange={(e) => setPhoneOrMeter(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Amount ($)</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {[100, 200, 500, 1000, 2000, 5000].map((amt) => (
                  <button key={amt} onClick={() => setAmount(String(amt))}
                    className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${amount === String(amt) ? 'gradient-primary text-white shadow-sm' : 'bg-[#EEF4FF] text-[#0A5CFF] hover:bg-[#0A5CFF] hover:text-white'}`}>
                    ${amt.toLocaleString()}
                  </button>
                ))}
              </div>
              <input type="number" className="input-field" placeholder="Or enter custom amount"
                value={amount} onChange={(e) => setAmount(e.target.value)} />
            </div>
            <button
              disabled={!provider || !phoneOrMeter || !amount}
              onClick={handlePay}
              className="w-full gradient-primary text-white font-bold py-3.5 rounded-xl text-sm shadow-md disabled:opacity-50 hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
            >
              <Receipt className="w-4 h-4" /> Pay ${Number(amount || 0).toLocaleString()}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
