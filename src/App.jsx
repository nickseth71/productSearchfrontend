import React, { useState, useEffect } from "react";

function App() {
  // variables
  const [data, setData] = useState([]); // fetched products data
  const [search, setSearch] = useState(""); //search query
  const [loading, setLoading] = useState(false); // Indicates if the data is being loaded
  const [error, setError] = useState(null); //check for erros
  const [moneyFormat, setMoneyFormat] = useState(null); //currency format

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Set loading to true while fetching data
      try {
        const res = await fetch("https://product-search-backend.vercel.app/products"); // Fetch data from the API
        const jsonData = await res.json(); // JSON response
        setData(jsonData.products); // Set the fetched data to the state
      } catch (error) {
        setError(error); 
      } finally {
        setLoading(false); 
      }
    };
    fetchData(); // Call the function to fetch data
  }, []);



  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setLoading(true); // Set loading to true while fetching data
    try {
      const res = await fetch(`https://product-search-backend.vercel.app/products?query=${search}`); // Fetch data based on the search query
      const jsonData = await res.json(); // JSON response
      setData(jsonData.products); // Set the fetched data to the state
      setMoneyFormat(jsonData.shop.currencyFormats.moneyFormat); // Set the money format for displaying prices
    } catch (error) {
      setError(error); 
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div>
      <div>
        <h1 className="text-3xl font-bold m-10">Products</h1>
        <form onSubmit={handleSubmit} className="ml-10 mt-10">
          <input
            className="p-1 border"
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search"
          />
          <button className="border border-black px-4 py2 pl-2" type="submit">Search</button>
        </form>
      </div>

      {/* Display loading, error, or data */}
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error.message}</p>
      ) : (
        <>
          {data.length > 0 && (
            <div className="text-center">
              <h2 className="text-xl font-bold my-5">Product Title: {data[0].title}</h2>
              <table className="table-auto w-full border-collapse">
                <thead>
                  <tr>
                    <th className="px-4 py-2 border-b-2 border-gray-200">Title</th>
                    <th className="px-4 py-2 border-b-2 border-gray-200">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Map through data and display product variants */}
                  {data.map((item, index) => (
                    <React.Fragment key={`pro_${index}`}>
                      {item.variants.edges.map((variant, ind) => (
                        <tr key={ind} className="hover:bg-gray-100">
                          <td className="px-4 py-2 border-b border-gray-200">{variant.node.title}</td>
                          <td className="px-4 py-2 border-b border-gray-200">
                            {moneyFormat && moneyFormat.replace('{{amount}}', variant.node.price)}
                          </td>
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;
