import React, { useEffect, useState } from 'react';
import { Block } from './Block';
import './index.scss';

function App() {
  const [fromCurrency, setFromCurrency] = useState('USD')
  const [toCurrency, setToCurrency] = useState('EUR')
  const [fromPrice, setFromPrice] = useState(0)
  const [toPrice, setToPrice] = useState(0)

  const [rates, setRates] = useState({})

  useEffect(() => {
    fetch('https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json')
      .then(res => res.json())
      .then(json => {
        const setJson = json.reduce((acc, { cc, rate }) => ({ ...acc, [cc]: rate }), {})
        setRates(setJson)
      })
      .catch(er => console.warn(er))
  }, [])

  const onChangeFromPrice = (value) => {
    const price = value / rates[fromCurrency]
    const result = price * rates[toCurrency]
    setToPrice(result.toFixed(3))
    setFromPrice(value)
  }
  const onChangeToPrice = (value) => {
    const result = (rates[fromCurrency] / rates[toCurrency]) * value
    setFromPrice(result.toFixed(3))
    setToPrice(value)
  }

  useEffect(() => {
    onChangeFromPrice(fromPrice)
  }, [fromCurrency])

  useEffect(() => {
    onChangeToPrice(toPrice)
  }, [toCurrency])

  return (
    <div className="App">
      <Block
        value={fromPrice}
        currency={fromCurrency}
        onChangeCurrency={setFromCurrency}
        onChangeValue={onChangeFromPrice}

      />
      <Block
        value={toPrice}
        currency={toCurrency}
        onChangeCurrency={setToCurrency}
        onChangeValue={onChangeToPrice}
      />
    </div>
  );
}

export default App;