import { useState } from 'react';
import './App.css';


function App() {

    const today = new Date().toISOString().split('T')[0];
    const [stockId, setStockId] = useState('');
    const [currentStockId, setCurrentStockId] = useState('');
    const [responseObject, setResponseObject] = useState(null);
    const [errorObject, setErrorObject] = useState(null);
    const lastFriday = getDefaultdate();
    const [date, setDate] = useState(lastFriday);
    const [loader, setLoader] = useState(false);

    function getDefaultdate() {
        const day = new Date(today).getUTCDay();
        if ([6, 0].includes(day)) {
            const t = new Date().getDate() + (6 - new Date().getDay() - 1) - 7;
            const lastFriday = new Date();
            lastFriday.setDate(t);
            return lastFriday.toISOString().split('T')[0];
        }
        return day;
    }

    function handleSubmit(event) {
        event?.preventDefault();
        setCurrentStockId(stockId);
        setLoader(true);
        fetch('http://localhost:5000/api/fetchStockData', {
            method: 'POST',
            body: JSON.stringify(
                { stockId, date },
            ),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        }).then((res) => res.json()).then((data) => {
            setLoader(false);
            if (data.status == 200 && data?.data && data?.data[0]) {
                setErrorObject(null);
                setResponseObject(data.data[0]);
            }
            else {
                setResponseObject(null);
                setErrorObject(data.message);
            }
        }).catch((err) => {
            setLoader(false);
            setResponseObject(null);
            setErrorObject(err.message);
        });
    }

    function checkAndSetDate(date) {
        const day = new Date(date).getUTCDay();
        if ([6, 0].includes(day)) {
            alert('Weekends not allowed');
            setDate(lastFriday);
            return;
        }
        setDate(date);
    }


    return (
        <div>
            <h1>
                Here is the application you can get stock deatils of the day
            </h1>
            <form onSubmit={handleSubmit} className='form'>
                <label htmlFor="stockId">Please enter stock id:</label>
                <input type="text" id='stockId' placeholder='enter the stock id' className='input-text' required value={stockId} onChange={event => setStockId(event.target.value)} />
                <br />
                <label htmlFor="date">Please enter select date:</label>
                <input type="date" id='date' placeholder='select the date' className='input-text' required max={today} value={date} onChange={event => checkAndSetDate(event.target.value)} />
                <br />
                <button type='submit' className='btn'>Submit</button>
            </form>
            { }
            {
                loader &&
                <div className='loader'></div>
            }
            {
                responseObject && !loader &&
                <section>
                    <table className='table'>
                        <thead >
                            <th className='table-head'>Stock name</th>
                            <th className='table-head'>Open</th>
                            <th className='table-head'>Highest</th>
                            <th className='table-head'>Lowest</th>
                            <th className='table-head'>Close</th>
                            <th className='table-head'>Total Volume</th>
                        </thead>
                        <tr>
                            <td className='table-cell'>{currentStockId}</td>
                            <td className='table-cell'>{responseObject.o}</td>
                            <td className='table-cell'>{responseObject.h}</td>
                            <td className='table-cell'>{responseObject.l}</td>
                            <td className='table-cell'>{responseObject.c}</td>
                            <td className='table-cell'>{responseObject.v}</td>
                        </tr>
                    </table>
                </section>
            }
            {
                errorObject && !loader &&
                <section>
                    {errorObject.toString()}
                </section>
            }
        </div>
    );
}

export default App;