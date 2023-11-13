import "./Header.css";
import { useState, useEffect } from "react"; 
import Table from "../Table/Table.js";
import Statistics from "../Statistics/Statistics.js";
import Barchart from "../BarChart/BarChart.js";
import axios from "axios";

const Header = () => {
  const [pageNumber, setPageNumber] = useState(1);
  const [search, setSearch] = useState("");
  const [month, setMonth] = useState("03");
  const [data, setdata] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(10);

  async function getData() {
    try {
      const response = await axios.get(
        `https://roxiler-transactions.onrender.com/gettransactions/${month}`
      );
      setdata(response.data.data);
    } catch (err) {
      console.log(err.message);
    }
  }

  useEffect(() => {
    getData();
    setPageNumber(1);
    setSearch("");
  }, [month]);

  function setPrevpage() {
    if (endIndex > 10) {
      setStartIndex(startIndex - 10);
      setEndIndex(endIndex - 10);
      setPageNumber(pageNumber - 1);
    }
  }

  function setNxtpage() {
    if (startIndex < 41) {
      setStartIndex(startIndex + 10);
      setEndIndex(endIndex + 10);
      setPageNumber(pageNumber + 1);
    }
  }
  let pageData = [];
  if (data.length !== 0) {
    if (month === "all") {
      pageData = data.slice(startIndex, endIndex);
    } else {
      pageData = data;
    }
  }

  let filteredData = [];
  if (pageData.length !== 0) {
    filteredData = pageData.filter((item) => {
      return (
        item.productDescription.toLowerCase().includes(search.toLowerCase()) ||
        item.productTitle.toLowerCase().includes(search.toLowerCase()) ||
        item.productCategory.toLowerCase().includes(search.toLowerCase()) ||
        item.productPrice.toString().toLowerCase().includes(search.toLowerCase())
      );
    });
  }

  return (
    <div className="home">
      <div id="title" className="title">
        <h1>Transaction Dashboard</h1>
      </div>
      <div className="search-drop">
        <div className="search-bar">
          <input
            type="search"
            placeholder="Search Transaction"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="dropdown">
          <select
            name="dropdown"
            id="dropdown"
            onChange={(e) => {
              setMonth(e.target.value);
            }}>
            <option value="all">All</option>
            <option value="01">January</option>
            <option value="02">February</option>
            <option value="03" selected>
              March
            </option>
            <option value="04">April</option>
            <option value="05">May</option>
            <option value="06">June</option>
            <option value="07">July</option>
            <option value="08">August</option>
            <option value="09">September</option>
            <option value="10">October</option>
            <option value="11">November</option>
            <option value="12">December</option>
          </select>
        </div>
      </div>
      <div className="bottom">
        <Table data={filteredData} />
      </div>
      <div className="footer">
        <div className="left">
          <b>Page No: {pageNumber}</b>
        </div>
        <div className="center">
          <button
            onClick={setPrevpage}
            disabled={data.length < 10 ? true : false}>
            Previous Page
          </button>
          <button
            onClick={setNxtpage}
            disabled={data.length > 10 ? false : true}>
            Next Page
          </button>
        </div>
        <div className="right">
          <b>Per Page: 10</b><br/>
        </div>
      </div>
      <>
        <Statistics month={month} data={filteredData} pageNumber={pageNumber} />
      </>
      <>
        <Barchart month={month} data={filteredData} pageNumber={pageNumber} />
      </>
    </div>
  );
};

export default Header;
